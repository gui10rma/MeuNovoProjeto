import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
    ScrollView,
    Platform, 
    Alert,
    Pressable, // ✅ Adicionado para capturar o toque na tela
    // 🚨 CORREÇÃO AQUI: Adiciona KeyboardAvoidingView
    KeyboardAvoidingView,
    // 🚨 CORREÇÃO AQUI: Adiciona TextInput
    TextInput 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// ✅ CONSTANTES DAS IMAGENS LOCAIS
const clubBaladaImage = require('../../assets/lexi_balada.jpg'); 
const clubHologramaImage = require('../../assets/lexi_holograma.jpg'); 
// ❌ REMOVIDO: junkbox e bar (não pertencem a esta cena, e causam referência incorreta)


// --- ESTÁGIOS DA CENA ---
const SCENE = {
    INTRO: 0,
    CHALLENGE: 1,
    FIXED: 2, // Desafio resolvido, exibe o diálogo final
    CONCLUSION: 3, // Estágio onde aparece o botão de retorno
};

// Valor correto do BPM (Batidas Por Minuto) para o desafio
const CORRECT_BPM_VALUE = 128;

const dialogue = [
    { speaker: 'Lexi', text: "SENTES ESSE RITMO? É TUDO MATEMÁTICA! A música é só um algoritmo bem executado! Eu adoro este lugar. Aqui, cada batida é uma instrução executada, cada drop é uma função chamada no momento perfeito. É o único sítio onde um loop infinito é uma coisa boa!" },
    { speaker: 'System', text: "De repente, as luzes estroboscópicas congelam numa cor branca ofuscante e os dançarinos holográficos começam a \"glitchar\", movendo-se em câmara lenta enquanto a música continua rápida." },
    { speaker: 'Lexi', text: "(Grita por cima da música) LAG! Temos um problema de renderização! O sistema de luzes não está a acompanhar o áudio. O clock do processador está dessincronizado!" },
];

const conclusionDialogue = [
    { speaker: 'Lexi', text: "Isso foi épico! Sincronização perfeita. Tu tens ritmo de código, parceiro(a)! Se consegues lidar com esta velocidade, a 'Floresta dos Ecos' vai ser um passeio no parque. Vamos dançar mais um bocado antes de voltarmos para a realidade!" },
];


const ClubScreen = () => {
    const navigation = useNavigation();
    const [sceneStage, setSceneStage] = useState(SCENE.INTRO);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [challengeAttempted, setChallengeAttempted] = useState(false);

    // ✅ FUNÇÃO PRINCIPAL: Avança o diálogo ao toque
    const advanceDialogue = () => {
        // Se estiver no diálogo introdutório
        if (sceneStage === SCENE.INTRO) {
            if (dialogueIndex < dialogue.length - 1) {
                setDialogueIndex(dialogueIndex + 1);
            } else {
                setSceneStage(SCENE.CHALLENGE);
            }
        } 
        // Se estiver no diálogo final (após o desafio)
        else if (sceneStage === SCENE.FIXED) {
            if (dialogueIndex < conclusionDialogue.length - 1) {
                setDialogueIndex(dialogueIndex + 1);
            } else {
                setSceneStage(SCENE.CONCLUSION);
            }
        }
    };

    // Lógica do Minigame (atribuição numérica)
    const handleSyncChallenge = () => {
        setChallengeAttempted(true);
        const inputNumber = parseInt(userInput);

        if (inputNumber === CORRECT_BPM_VALUE) {
            // Acerto!
            setDialogueIndex(0); // Começa o diálogo de conclusão
            setSceneStage(SCENE.FIXED); // Vai para o estágio de diálogo final
        } else {
            // Erro
            Alert.alert("Erro", `O valor ${userInput} está dessincronizado. Tente novamente! (Dica: Pense em música eletrônica!)`);
        }
    };

    const handleBackToMissions = () => {
        navigation.navigate('Mission1' as any);
    }


    const renderCurrentScene = () => {
        
        // --- ESTÁGIO DE CONCLUSÃO FINAL (BOTÃO DE RETORNO) ---
        if (sceneStage === SCENE.CONCLUSION) {
            return (
                // 🚨 CONTAINER CENTRALIZADO PARA O BOTÃO
                <View style={styles.conclusionContainer}>
                    <View style={styles.dialogueBox}>
                        <Text style={styles.speakerText}>{'[FIM DA CENA]'}</Text>
                        <Text style={styles.dialogText}>
                            Você terminou a interação VIP com Lexi. Avance para o próximo capítulo!
                        </Text>
                        {/* Prompt de Toque */}
                        <Text style={styles.tapPrompt}>
                            [ TOQUE PARA CONTINUAR ]
                        </Text>
                    </View>
                    
                    {/* BOTÃO CENTRALIZADO */}
                    <TouchableOpacity 
                        style={styles.centeredActionButton} 
                        onPress={handleBackToMissions}
                    >
                        <Text style={styles.centeredButtonText}>Voltar ao Hub de Missões</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        
        // --- ESTÁGIO DE DIÁLOGO (INTRO OU FIXED) ---
        if (sceneStage === SCENE.INTRO || sceneStage === SCENE.FIXED) {
            
            const currentDialogueList = (sceneStage === SCENE.INTRO) ? dialogue : conclusionDialogue;
            const currentDialog = currentDialogueList[dialogueIndex];
            
            const isLastDialogue = dialogueIndex === currentDialogueList.length - 1;

            return (
                // O Pressable principal da tela gerencia o toque para continuar
                <View style={styles.dialogContainer}>
                    <View style={styles.dialogueBox}>
                        <Text style={styles.speakerText}>{currentDialog.speaker}:</Text>
                        <Text style={styles.dialogText}>{currentDialog.text}</Text>
                        
                        {/* Prompt de Toque */}
                        <Text style={styles.tapPrompt}>
                            {isLastDialogue ? '[ TOQUE PARA CONTINUAR ]' : '[ TOQUE PARA CONTINUAR >> ]'}
                        </Text>
                    </View>
                </View>
            );

        } 
        
        // --- ESTÁGIO DO DESAFIO ---
        else if (sceneStage === SCENE.CHALLENGE) {
            return (
                // ✅ KeyboardAvoidingView dentro da ScrollView
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.challengeBox}
                >
                    <Text style={styles.challengeTitle}>Desafio Oculto: Sincronia de Clock</Text>
                    
                    <Text style={styles.challengeCodeTitle}>Interface Holográfica de DJ:</Text>
                    
                    <View style={styles.codeBlock}>
                        <Text style={styles.codeLine}>const BPM_DA_MÚSICA = {CORRECT_BPM_VALUE};</Text>
                        <Text style={styles.codeLine}>let delay_de_luzes: Number = <Text style={styles.codeError}>[INSIRA VALOR]</Text>;</Text>
                        <Text style={styles.codeLine}>// O clock do processador exige o mesmo valor do BPM.</Text>
                        <Text style={styles.codeLine}>BPM no Ecrã: <Text style={styles.codeNote}>128</Text></Text>
                    </View>

                    <Text style={styles.challengeInstruction}>
                        Defina o valor da variável 'delay_de_luzes' para sincronizar as luzes com o BPM da música. (Digite o valor numérico)
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder={`Digite o valor (${CORRECT_BPM_VALUE})`}
                        placeholderTextColor="#AAAAAA"
                        keyboardType="numeric"
                        value={userInput}
                        onChangeText={setUserInput}
                    />

                    <TouchableOpacity style={styles.challengeOption} onPress={handleSyncChallenge} disabled={!userInput}>
                        <Text style={styles.challengeButtonText}>Sincronizar Clock</Text>
                    </TouchableOpacity>
                    
                    {/* Imagem do desafio (Holograma) */}
                    <Text style={styles.imagePlaceholderText}></Text>
                </KeyboardAvoidingView>
            );
        }
    };

    const getBackgroundImage = () => {
        // Usa as constantes locais 'require' para definir o fundo
        // 🚨 CORREÇÃO: Usando os assets corretos para esta cena (Balada/Holograma)
        if (sceneStage === SCENE.CHALLENGE) {
            return clubHologramaImage;
        }
        return clubBaladaImage;
    }


    return (
        <ImageBackground
            source={getBackgroundImage()} // ✅ Chama a função para mudar o fundo
            style={styles.background}
            resizeMode="cover"
        >
            <StatusBar hidden />
            
            {/* ✅ CONTAINER PRINCIPAL QUE GERE O TOQUE NA TELA INTEIRA PARA O DIÁLOGO */}
            <Pressable 
                style={styles.fullScreenOverlay} 
                onPress={sceneStage === SCENE.INTRO || sceneStage === SCENE.FIXED ? advanceDialogue : undefined}
            >
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
        // Mantém a imagem cobrindo toda a tela para não ter bordas pretas
    },
    fullScreenOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end', // Alinha o conteúdo ao fundo
    },
    
    // ✅ NOVO: Estilo do Container que imita o seu exemplo de balão
    dialogContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        paddingBottom: 20,
    },

    // 🚨 NOVO: Container para centralizar o botão de conclusão
    conclusionContainer: {
        flex: 1,
        // 🚨 MUDANÇA CRÍTICA: Centraliza vertical e horizontalmente
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
    },
    
    // --- Estilos da Caixa de Diálogo (Balão) ---
    dialogueBox: {
        width: '95%',
        padding: 20,
        // 🚨 MUDANÇA: Fundo azul escuro para contraste com o branco (Volta para o Azul Neon)
        backgroundColor: 'rgba(0, 0, 50, 0.90)', 
        // 🚨 MUDANÇA: Borda e sombra ciano
        borderColor: '#00FFFF',
        borderWidth: 3,
        borderRadius: 15, // Mais arredondado
        margin: 10,
        shadowColor: '#00FFFF',
        shadowRadius: 10,
        shadowOpacity: 1,
        elevation: 10,
    },
    // 🚨 ESTILO DE LETRA MONOSPACE PARA SPEAKER
    speakerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF00FF', // Rosa Neon para contraste
        marginBottom: 5,
        fontFamily: 'monospace', // ✅ Monospace em todos os sistemas
    },
    // 🚨 ESTILO DE LETRA MONOSPACE PARA DIÁLOGO
    dialogText: {
        color: '#FFFFFF', // Texto branco puro
        fontSize: 18,
        fontFamily: 'monospace', // ✅ Monospace em todos os sistemas
        fontWeight: 'bold',
        textAlign: 'center',
        // Mantendo sombra leve para melhor legibilidade
        textShadowColor: 'rgba(0, 0, 0, 0.5)', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        marginBottom: 10,
        lineHeight: 22,
    },
    
    // ✅ NOVO: Estilo para o prompt de toque
    tapPrompt: {
        color: '#00FFFF', // Ciano Neon
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'right',
        marginTop: 10,
    },
    
    // --- Estilos do Desafio (Challenge) ---
    challengeBox: {
        width: '95%',
        padding: 15,
        backgroundColor: 'rgba(20, 20, 50, 0.85)', // Fundo escuro para desafio
        borderColor: '#FFFF00',
        borderWidth: 2,
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
    },
    challengeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFF00', // Amarelo Neon
        marginBottom: 10,
    },
    challengeInstruction: {
        fontSize: 15,
        color: '#AAAAAA',
        textAlign: 'center',
        marginVertical: 10,
    },
    challengeCodeTitle: {
        fontSize: 13,
        color: '#00FFFF',
        marginTop: 8,
    },
    codeBlock: {
        width: '100%',
        backgroundColor: '#00001a',
        padding: 8,
        borderRadius: 5,
    },
    codeLine: {
        fontFamily: 'monospace', // ✅ Monospace em todos os sistemas
        color: '#FFFFFF',
        fontSize: 13,
        lineHeight: 18,
    },
    codeError: {
        color: '#FF0000',
        fontWeight: 'bold',
    },
    optionGroup: {
        width: '100%',
        marginTop: 15,
    },
    challengeOption: {
        padding: 10,
        backgroundColor: '#FF00FF',
        borderRadius: 8,
        marginVertical: 4,
        alignItems: 'center',
    },
    challengeButtonText: { // Novo estilo para o texto dos botões de desafio
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    imagePlaceholderText: {
        color: '#444444',
        fontSize: 10,
        marginTop: 15,
    },

    // 🚨 NOVO: Estilos para o Botão de Conclusão Centralizado
    centeredActionButton: {
        width: '80%',
        padding: 15,
        backgroundColor: '#00FFFF', // Ciano Neon
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
        shadowColor: '#00FFFF',
        shadowRadius: 5,
        elevation: 5,
    },
    centeredButtonText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default ClubScreen;