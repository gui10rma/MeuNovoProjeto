import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
    ScrollView,
    Alert,
    Animated,
    Dimensions, // Para calcular o tamanho da célula dinamicamente
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

// --- Configurações do Jogo ---
const GRID_SIZE = 5;
const CELL_SIZE = 50; // Tamanho base da célula para animação (em pixels)
const INITIAL_ROBOT_POS = { x: 0, y: 0 };

// Os Glitches formam um caminho em L (Borda Superior e Borda Direita)
const GLITCH_BLOCKS = [
    { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, 
    { x: 3, y: 0 }, { x: 4, y: 0 },
    { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 },
]; // Modificado para ter mais glithes, incluindo o canto inferior direito e canto superior esquerdo

// --- Comandos Disponíveis ---
const COMMAND_BLOCKS = [
    { id: 'M_R', label: 'Move (Direita)', type: 'MOVE', icon: 'arrow-right', move: { x: 1, y: 0 } },
    { id: 'M_D', label: 'Move (Abaixo)', type: 'MOVE', icon: 'arrow-down', move: { x: 0, y: 1 } },
    { id: 'M_L', label: 'Move (Esquerda)', type: 'MOVE', icon: 'arrow-left', move: { x: -1, y: 0 } },
    { id: 'M_U', label: 'Move (Cima)', type: 'MOVE', icon: 'arrow-up', move: { x: 0, y: -1 } }, // Novo comando
    { id: 'C', label: 'Limpar Célula', type: 'CLEAN', icon: 'broom' },
    { id: 'L4', label: 'LOOP (4x)', type: 'LOOP', count: 4, icon: 'redo' },
    { id: 'BRK', label: 'BREAK Loop', type: 'BREAK', icon: 'times-circle' },
];

const IteradorFendaScreen = () => {
    const navigation = useNavigation();

    // Estado do Jogo
    const [robotPos, setRobotPos] = useState(INITIAL_ROBOT_POS);
    const [cleanedBlocks, setCleanedBlocks] = useState({});
    const [script, setScript] = useState([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionIndex, setExecutionIndex] = useState(-1);
    const [totalCommandCount, setTotalCommandCount] = useState(0);

    // Efeito visual do robô
    const robotAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

    // useEffect para sincronizar a animação com a posição inicial
    useEffect(() => {
        robotAnim.setValue({ x: INITIAL_ROBOT_POS.x * CELL_SIZE, y: INITIAL_ROBOT_POS.y * CELL_SIZE });
    }, []);

    // --- Lógica de Reset ---
    const resetGame = () => {
        if (isExecuting) return;
        setRobotPos(INITIAL_ROBOT_POS);
        setCleanedBlocks({});
        setScript([]);
        setIsExecuting(false);
        setExecutionIndex(-1);
        setTotalCommandCount(0);
        
        // Reseta a animação visual
        Animated.timing(robotAnim, {
            toValue: { x: INITIAL_ROBOT_POS.x * CELL_SIZE, y: INITIAL_ROBOT_POS.y * CELL_SIZE },
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    // --- Lógica do Script ---
    const addCommand = (command) => {
        if (isExecuting) return;
        
        // Se o loop já existe, não permite adicionar outro (simplificação para este demo)
        if (command.type === 'LOOP' && script.some(c => c.type === 'LOOP')) {
            Alert.alert("Atenção", "Para simplificar o demo, adicione apenas um Loop por vez!");
            return;
        }

        // Se for um LOOP, adiciona os comandos aninhados fixos
        if (command.type === 'LOOP') {
            const nestedCommands = [
                COMMAND_BLOCKS.find(c => c.id === 'M_R'), // Move (Direita)
                COMMAND_BLOCKS.find(c => c.id === 'C'), // Limpar Célula
            ];
            const fullLoopCommand = { 
                ...command, 
                nestedCommands: nestedCommands, 
                label: `LOOP ${command.count}x (M.Dir + Limpa)`,
            };
            setScript(prev => [...prev, fullLoopCommand]);
        } else {
            setScript(prev => [...prev, command]);
        }
    };

    const removeCommand = (indexToRemove) => {
        if (isExecuting) return;
        setScript(prev => prev.filter((_, index) => index !== indexToRemove));
    };
    
    // --- Lógica de Execução Principal (Onde a mágica do Loop acontece) ---
    const executeScript = async () => {
        if (isExecuting || script.length === 0) return;

        // Resetar o estado, mas manter o script
        setRobotPos(INITIAL_ROBOT_POS);
        setCleanedBlocks({});
        setTotalCommandCount(0);
        
        // Animação para resetar o robô visualmente
        Animated.timing(robotAnim, {
            toValue: { x: INITIAL_ROBOT_POS.x * CELL_SIZE, y: INITIAL_ROBOT_POS.y * CELL_SIZE },
            duration: 200,
            useNativeDriver: false,
        }).start();

        setIsExecuting(true);
        await new Promise(resolve => setTimeout(resolve, 300)); // Pequeno delay antes de iniciar

        let currentPos = { ...INITIAL_ROBOT_POS };
        let currentCleaned = {};
        
        // Função de execução recursiva para lidar com loops
        const runCommands = async (commands, loopCount = 1, nestingLevel = 0) => {
            for (let k = 0; k < loopCount; k++) {
                
                for (let i = 0; i < commands.length; i++) {
                    const command = commands[i];
                    
                    // Contagem de comandos executados
                    setTotalCommandCount(prev => prev + 1);
                    if (nestingLevel === 0) setExecutionIndex(i); // Apenas anima o índice do script principal

                    await new Promise(resolve => setTimeout(resolve, 300)); // Delay para animação

                    if (command.type === 'MOVE') {
                        let newX = currentPos.x + command.move.x;
                        let newY = currentPos.y + command.move.y;

                        // Verifica colisão (Bounds check)
                        if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
                            Alert.alert("Erro de Limite", "O Agente Iterador saiu do mapa! Código Travado.");
                            setIsExecuting(false);
                            return 'BREAK_FAIL'; // Sinaliza falha
                        }
                        
                        currentPos = { x: newX, y: newY };
                        setRobotPos(currentPos);
                        
                        // Atualiza a posição visual do robô
                        Animated.timing(robotAnim, {
                            toValue: { x: newX * CELL_SIZE, y: newY * CELL_SIZE },
                            duration: 200,
                            useNativeDriver: false,
                        }).start();
                        await new Promise(resolve => setTimeout(resolve, 200)); // Espera a animação
                        

                    } else if (command.type === 'CLEAN') {
                        const key = `${currentPos.x},${currentPos.y}`;
                        const isGlitch = GLITCH_BLOCKS.some(b => b.x === currentPos.x && b.y === currentPos.y);

                        // Apenas conta o ponto se for um Glitch e não foi limpo
                        if (isGlitch && !currentCleaned[key]) {
                            currentCleaned[key] = true;
                            setCleanedBlocks({ ...currentCleaned });
                        }

                    } else if (command.type === 'LOOP') {
                        // Recursivamente executa os comandos dentro do loop
                        const result = await runCommands(command.nestedCommands || [], command.count, nestingLevel + 1);
                        if (result === 'BREAK' || result === 'BREAK_FAIL') return result; // Propaga a quebra ou falha
                        
                    } else if (command.type === 'BREAK') {
                        return 'BREAK'; // Sinaliza para parar o loop pai (ou o loop atual)
                    }
                }
            }
            return 'COMPLETE'; // Retorna que o loop (ou script) terminou sem falhas
        };

        // Inicia a execução
        const result = await runCommands(script);

        setIsExecuting(false);
        setExecutionIndex(-1);

        if (result !== 'BREAK_FAIL') {
            const numCleaned = Object.keys(currentCleaned).length;
            const isComplete = numCleaned === GLITCH_BLOCKS.length;
            
            if (isComplete) {
                const totalXP = (GLITCH_BLOCKS.length * 100) + Math.round(10000 / totalCommandCount); // Bônus por eficiência
                Alert.alert("Missão Concluída! 🏆", `Você limpou todos os Glitches em ${totalCommandCount} comandos! XP Total: ${totalXP}`);
            } else {
                Alert.alert("Missão Incompleta", `Faltaram Glitches! Você limpou ${numCleaned} de ${GLITCH_BLOCKS.length}. Tente otimizar seu loop.`);
            }
        }
    };
    
    // --- Função Auxiliar para Criar a Grade de Blocos ---
    const renderGrid = () => {
        const grid = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const key = `${x},${y}`;
                const isGlitch = GLITCH_BLOCKS.some(b => b.x === x && b.y === y);
                const isCleaned = !!cleanedBlocks[key];
                
                let iconName = null;
                let color = '#222'; 
                
                if (isGlitch) {
                    iconName = isCleaned ? 'check-circle' : 'radiation-alt';
                    color = isCleaned ? '#00FF0033' : '#FF000033'; 
                }

                grid.push(
                    <View 
                        key={key} 
                        style={[styles.gridCell, { 
                            backgroundColor: color, 
                            borderColor: isCleaned ? '#00FF00' : '#444',
                            width: CELL_SIZE, // Usa o tamanho base da célula
                            height: CELL_SIZE,
                        }]}
                    >
                        {iconName && <FontAwesome5 name={iconName} size={16} color={isCleaned ? '#00FF00' : '#FF0000'} />}
                    </View>
                );
            }
        }
        return grid;
    };

    // --- Função Auxiliar para Renderizar o Script (Com Recursão) ---
    const renderScript = (commands, nestingLevel = 0) => {
        if (!commands) return null;

        return commands.map((command, index) => {
            const isLoop = command.type === 'LOOP';
            // Apenas o script no nível 0 tem animação de execução
            const isCurrent = executionIndex === index && nestingLevel === 0 && isExecuting;

            return (
                <View key={index} style={{ marginLeft: nestingLevel * 20 }}>
                    <TouchableOpacity
                        style={[
                            styles.scriptCommand,
                            isLoop && styles.loopCommand,
                            isCurrent && styles.activeCommand
                        ]}
                        onPress={() => nestingLevel === 0 && removeCommand(index)}
                        disabled={isExecuting || nestingLevel !== 0}
                    >
                        <FontAwesome5 name={command.icon} size={12} color="#FFF" />
                        <Text style={styles.commandText}>{command.label}</Text>
                        {nestingLevel === 0 && <Text style={styles.removeText}>X</Text>}
                    </TouchableOpacity>

                    {/* RENDERIZAÇÃO RECURSIVA DO CONTEÚDO DO LOOP */}
                    {isLoop && command.nestedCommands && (
                        <View style={styles.nestedContainer}>
                            {/* Chamada recursiva para renderizar os comandos aninhados */}
                            {renderScript(command.nestedCommands, nestingLevel + 1)}
                            {/* Adiciona a indicação de fim de loop */}
                            <Text style={[styles.nestedHint, { marginLeft: 10 }]}>FIM LOOP {command.count}x</Text>
                        </View>
                    )}
                </View>
            );
        });
    };
    
    return (
        <ImageBackground
            source={require('../../assets/background.jpg')} 
            style={styles.container}
            resizeMode="cover"
        >
            <StatusBar hidden />
            
            <View style={styles.header}>
                <Text style={styles.title}>Iterador de Fenda</Text>
                <Text style={styles.subtitle}>Comandos Executados: {totalCommandCount}</Text>
            </View>

            {/* --- Área Principal do Jogo (Grid) --- */}
            <View style={styles.gameArea}>
                <View style={[styles.gridContainer, { width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }]}>
                    {renderGrid()}
                    
                    {/* Robô (Agente Iterador) */}
                    <Animated.View style={[styles.robot, robotAnim.getLayout(), { width: CELL_SIZE, height: CELL_SIZE }]}>
                        <FontAwesome5 
                            name="robot" 
                            size={CELL_SIZE * 0.5} 
                            color="#00FFFF" 
                            style={{ textShadowColor: '#00FFFF', textShadowRadius: 5 }}
                        />
                    </Animated.View>
                </View>
            </View>

            {/* --- Painel de Comandos e Script --- */}
            <View style={styles.controlPanel}>
                
                {/* Comandos Disponíveis */}
                <ScrollView style={styles.commandBlocksContainer} horizontal>
                    {COMMAND_BLOCKS.map(cmd => (
                        <TouchableOpacity
                            key={cmd.id}
                            style={[styles.commandButton, cmd.type === 'LOOP' && { backgroundColor: '#00FF00' }]}
                            onPress={() => addCommand(cmd)} // Agora 'addCommand' trata todos os tipos
                            disabled={isExecuting}
                        >
                            <FontAwesome5 name={cmd.icon} size={16} color="#000" />
                            <Text style={styles.commandButtonText}>{cmd.label.replace(/ \(.+\)/, '')}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Script do Jogador */}
                <View style={styles.scriptArea}>
                    <Text style={styles.scriptTitle}>Seu Script (Comandos: {script.length})</Text>
                    <ScrollView style={styles.scriptList} contentContainerStyle={styles.scriptContentContainer}>
                        {renderScript(script)}
                        {script.length === 0 && <Text style={styles.emptyScriptText}>Adicione os comandos aqui...</Text>}
                    </ScrollView>
                </View>

                {/* Botões de Ação */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={[styles.runButton, (isExecuting || script.length === 0) && { opacity: 0.5 }]} 
                        onPress={executeScript} 
                        disabled={isExecuting || script.length === 0}
                    >
                        <Text style={styles.runButtonText}>{isExecuting ? 'EXECUTANDO...' : 'EXECUTAR SCRIPT'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.resetButton, isExecuting && { opacity: 0.5 }]} 
                        onPress={resetGame} 
                        disabled={isExecuting}
                    >
                        <Text style={styles.runButtonText}>RESET</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00FFFF',
        textShadowColor: 'rgba(0, 255, 255, 0.5)',
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#FF00FF',
    },
    gameArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderWidth: 2,
        borderColor: '#333',
        backgroundColor: '#111',
        position: 'relative',
    },
    gridCell: {
        // Tamanho é definido inline usando CELL_SIZE
        borderWidth: 1,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    robot: {
        position: 'absolute',
        // Tamanho é definido inline usando CELL_SIZE
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlPanel: {
        height: 350,
        backgroundColor: 'rgba(20, 20, 40, 0.9)',
        padding: 10,
        borderTopWidth: 2,
        borderTopColor: '#00FFFF',
    },
    commandBlocksContainer: {
        height: 70,
        marginBottom: 10,
    },
    commandButton: {
        backgroundColor: '#00FFFF',
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    commandButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 5,
    },
    scriptArea: {
        flex: 1,
        marginBottom: 10,
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        padding: 5,
        borderWidth: 1,
        borderColor: '#00FFFF',
    },
    scriptTitle: {
        color: '#00FFFF',
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    scriptList: {
        flex: 1,
    },
    scriptContentContainer: {
        paddingBottom: 20, // Espaço extra para rolagem
    },
    scriptCommand: {
        flexDirection: 'row',
        backgroundColor: '#444',
        padding: 8,
        borderRadius: 4,
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeftWidth: 5,
        borderColor: '#FF00FF', // Cor padrão para Move/Clean
    },
    loopCommand: {
        borderColor: '#00FF00', // Verde para Loop
    },
    activeCommand: {
        backgroundColor: '#8844FF', // Roxo para comando sendo executado
    },
    commandText: {
        color: '#FFF',
        fontSize: 14,
        flex: 1,
        marginLeft: 10,
    },
    removeText: {
        color: '#FF0000',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyScriptText: {
        color: '#777',
        textAlign: 'center',
        marginTop: 20,
    },
    nestedContainer: {
        borderLeftWidth: 2,
        borderLeftColor: '#00FF00',
        marginLeft: 20,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        marginBottom: 4,
    },
    nestedHint: {
        color: '#00FF00',
        fontSize: 12,
        marginTop: 5,
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    runButton: {
        backgroundColor: '#00FFFF',
        padding: 15,
        borderRadius: 10,
        width: '60%',
        alignItems: 'center',
    },
    resetButton: {
        backgroundColor: '#FF0000',
        padding: 15,
        borderRadius: 10,
        width: '30%',
        alignItems: 'center',
    },
    runButtonText: {
        fontWeight: 'bold',
        color: '#000',
    },
});

export default IteradorFendaScreen;