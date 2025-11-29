import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
    ScrollView,
    Alert,
    Dimensions,
    Pressable // ✅ Adicionado para capturar o toque na tela
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// --- Assets Locais (Assumidos) ---
const BACKGROUND_MARGEM = require('../../assets/lago.jpg'); 
const BACKGROUND_LAGO_SWIM = require('../../assets/lexi_lagoa.jpg'); // Fundo com Lexi na água

// --- ESTÁGIOS DA CENA ---
const SCENE = {
    ENTRANCE: 0,      // Chegada na margem (Tem botão de ação)
    IN_WATER: 1,      // Conversa na água (Tem diálogo para avançar por toque)
    CONCLUSION: 2,    // Fim da cena (Tem botão de retorno)
};

const dialogueEntrance = [
    { speaker: 'Lexi', text: "Linda vista, né? Vamos logo entrar nessa água!" },
];

const dialogueInWater = [
    { speaker: 'Lexi', text: "WOOOO! A temperatura está perfeita! Eu configurei a variável da água para 'Tropical'. Anda, entra! A física de fluidos aqui é a melhor parte do jogo!" },
    { speaker: 'Lexi', text: "Ah... isso é vida. Programar não é só resolver problemas e fechar buracos negros. É criar mundos onde a gente possa se sentir bem. Hoje, nós protegemos essa alegria. Obrigada." },
    { speaker: 'Lexi', text: "Quem chegar primeiro àquela ilha flutuante ganha um bónus de XP! 3, 2, 1... JÁ!" },
];


const LagoaRelaxarScreen = () => {
    const navigation = useNavigation();
    const [sceneStage, setSceneStage] = useState(SCENE.ENTRANCE);
    const [dialogueIndex, setDialogueIndex] = useState(0); 

    const getCurrentDialogueList = () => {
        if (sceneStage === SCENE.ENTRANCE) return dialogueEntrance;
        if (sceneStage === SCENE.IN_WATER) return dialogueInWater;
        return [{ speaker: '[FIM]', text: "A cena termina com vocês a nadar, deixando para trás o stress da batalha." }];
    }

    // Função de ação (usada por botão para pular/retornar)
    const handleAction = () => {
         if (sceneStage === SCENE.ENTRANCE) {
            // Ação de estágio: Mudar para a água
            Alert.alert("Lexi pula!", "Toque na tela para iniciar a conversa na água.");
            setSceneStage(SCENE.IN_WATER);
            setDialogueIndex(0); 
        } else if (sceneStage === SCENE.CONCLUSION) {
            // Ação de estágio: Navegar para Mission1
            navigation.navigate('Mission1' as any); 
        }
    }

    // Função para avançar o diálogo (usada pelo Pressable de tela)
    const advanceDialogue = () => {
        if (sceneStage === SCENE.IN_WATER) {
            // Avança o diálogo na água
            if (dialogueIndex < dialogueInWater.length - 1) {
                setDialogueIndex(dialogueIndex + 1);
            } else {
                // Fim da cena de diálogo: Transição para o estágio de conclusão
                Alert.alert("Fim da Recompensa", "Recompensado com um bônus de XP!");
                setDialogueIndex(0); // Reinicia o índice para o item único de conclusão
                setSceneStage(SCENE.CONCLUSION);
            }
        }
        // Se estiver em ENTRANCE ou CONCLUSION, o toque na tela não faz nada, pois há um botão de ação.
    };
    

    const renderCurrentScene = () => {
        const currentList = getCurrentDialogueList();
        
        const safeIndex = (sceneStage === SCENE.CONCLUSION && dialogueIndex > 0) 
             ? 0 
             : dialogueIndex;

        const currentDialog = currentList[safeIndex];
        const isLastInWater = sceneStage === SCENE.IN_WATER && dialogueIndex === dialogueInWater.length - 1;
        
        let buttonText = 'Continuar >>';
        if (sceneStage === SCENE.ENTRANCE) {
            buttonText = '[ Pular na Lagoa ]';
        } else if (sceneStage === SCENE.CONCLUSION) {
            buttonText = '[ Voltar ao Hub de Missões ]';
        } else if (isLastInWater) {
             buttonText = '[ Começar a Corrida ]';
        }

        // --- Renderização Com Botão de Ação (ENTRANCE e CONCLUSION) ---
        if (sceneStage === SCENE.ENTRANCE || sceneStage === SCENE.CONCLUSION) {
            return (
                // Usamos o container centralizado para o estágio final (CONCLUSION)
                <View style={sceneStage === SCENE.CONCLUSION ? styles.conclusionContainer : styles.dialogContainer} >
                     <View style={styles.dialogueBox}>
                        {currentDialog?.speaker && (<Text style={styles.speakerText}>{currentDialog.speaker}:</Text>)}
                        {currentDialog?.text && (<Text style={styles.dialogueText}>{currentDialog.text}</Text>)}

                        <TouchableOpacity 
                            style={styles.actionButton} 
                            onPress={handleAction}
                        >
                            <Text style={styles.buttonText}>{buttonText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        
        // --- Renderização Somente com Toque (IN_WATER) ---
        return (
            <View style={styles.dialogContainer}>
                <View style={styles.dialogueBox}>
                    {currentDialog?.speaker && (<Text style={styles.speakerText}>{currentDialog.speaker}:</Text>)}
                    {currentDialog?.text && (<Text style={styles.dialogueText}>{currentDialog.text}</Text>)}
                    
                    {/* Prompt de toque (substituindo o botão) */}
                    <Text style={styles.tapPrompt}>
                        {isLastInWater ? '[ Começar a Corrida ]' : '[ TOQUE PARA CONTINUAR >> ]'}
                    </Text>
                    {/* Botão de ação (Corrida) NÃO É USADO aqui, pois o toque na tela avança para CONCLUSION */}
                </View>
            </View>
        );
    };

    const getBackgroundImage = () => {
        return sceneStage === SCENE.ENTRANCE ? BACKGROUND_MARGEM : BACKGROUND_LAGO_SWIM;
    }


    return (
        <ImageBackground
            source={getBackgroundImage()}
            style={styles.background}
            resizeMode="cover"
        >
            <StatusBar hidden />
            
            {/* ✅ Pressable em tela cheia (Ativo somente durante IN_WATER) */}
            <Pressable 
                style={styles.fullScreenOverlay} 
                onPress={advanceDialogue}
            >
                {/* ScrollView for flex-end alignment */}
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {renderCurrentScene()}
                </ScrollView>
            </Pressable>
        </ImageBackground>
    );
};

// Estilos
const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    fullScreenOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end', // Alinha o conteúdo ao fundo
        paddingBottom: 20,
        alignItems: 'center', // Centraliza a caixa de diálogo
    },
     // Contêiner padrão para diálogos (na parte inferior)
    dialogContainer: {
        width: '100%',
        paddingBottom: 20,
        alignItems: 'center',
    },
    // Container para centralizar o botão de conclusão (USADO em SCENE.CONCLUSION)
    conclusionContainer: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
    },
    
    // --- Estilos da Caixa de Diálogo (Azul Marinho / Ciano) ---
    dialogueBox: {
        width: '95%',
        padding: 15,
        // ✅ MUDANÇA: Fundo Azul Marinho Escuro
        backgroundColor: 'rgba(0, 0, 50, 0.85)', 
        // ✅ MUDANÇA: Borda Ciano Neon
        borderColor: '#00FFFF', 
        borderWidth: 2,
        borderRadius: 10,
        margin: 10,
        // ✅ MUDANÇA: Sombra Ciano Neon
        shadowColor: '#00FFFF',
        shadowRadius: 10,
        shadowOpacity: 1,
        elevation: 10,
    },
    speakerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF00FF', // Rosa Neon para Lexi/System (Mantido para contraste)
        marginBottom: 5,
        fontFamily: 'monospace', // ✅ Monospace adicionado
    },
    dialogueText: {
        fontSize: 16,
        color: '#FFFFFF', // ✅ Branco mantido
        marginBottom: 15,
        lineHeight: 22,
        fontFamily: 'monospace', // ✅ Monospace adicionado
    },
    
    // ✅ NOVO ESTILO: Prompt de toque
    tapPrompt: {
        color: '#00FFFF', // ✅ Ciano Neon
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'right',
        marginTop: 5,
        fontFamily: 'monospace', // ✅ Monospace adicionado
    },

    // --- Estilos de Ação (Para ENTRANCE e CONCLUSION) ---
    actionButton: {
        padding: 10,
        backgroundColor: '#00FFFF', // ✅ Ciano Neon
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'monospace', // ✅ Monospace adicionado
    },
});

export default LagoaRelaxarScreen;