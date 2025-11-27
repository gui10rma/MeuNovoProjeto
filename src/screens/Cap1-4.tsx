import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform, 
    Alert // Importa Alert para as mensagens de erro do minigame
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// ✅ CORREÇÃO FINAL: Variáveis locais que carregam os assets
const clubBaladaImage = require('../../assets/lexi_balada.jpg'); 
const clubHologramaImage = require('../../assets/lexi_holograma.jpg'); 

// --- ESTÁGIOS DA CENA ---
const SCENE = {
    INTRO: 0,
    CHALLENGE: 1,
    FIXED: 2, // Desafio resolvido, exibe o diálogo final
    CONCLUSION: 3, // Estágio onde aparece o botão de retorno
};

// Valor correto do BPM (Batidas Por Minuto) para o desafio
const CORRECT_BPM_VALUE = 128;

// Diálogo atualizado
const dialogue = [
    { speaker: 'Lexi', text: "SENTES ESSE RITMO? É TUDO MATEMÁTICA! A música é só um algoritmo bem executado! Eu adoro este lugar. Aqui, cada batida é uma instrução executada, cada drop é uma função chamada no momento perfeito. É o único sítio onde um loop infinito é uma coisa boa!" },
    { speaker: 'System', text: "De repente, as luzes estroboscópicas congelam numa cor branca ofuscante e os dançarinos holográficos começam a \"glitchar\", movendo-se em câmara lenta enquanto a música continua rápida." },
    { speaker: 'Lexi', text: "(Grita por cima da música) LAG! Temos um problema de renderização! O sistema de luzes não está a acompanhar o áudio. O clock do processador está dessincronizado!" },
];

// Conclusão atualizada
const conclusionDialogue = [
    { speaker: 'Lexi', text: "Isso foi épico! Sincronização perfeita. Tu tens ritmo de código, parceiro(a)! Se consegues lidar com esta velocidade, a 'Floresta dos Ecos' vai ser um passeio no parque. Vamos dançar mais um bocado antes de voltarmos para a realidade!" },
];


const ClubScreen = () => {
    const navigation = useNavigation();
    const [sceneStage, setSceneStage] = useState(SCENE.INTRO);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [challengeAttempted, setChallengeAttempted] = useState(false);

    // Avança o diálogo
    const advanceDialogue = () => {
        if (sceneStage === SCENE.INTRO) {
            if (dialogueIndex < dialogue.length - 1) {
                setDialogueIndex(dialogueIndex + 1);
            } else {
                // Vai para o desafio
                setSceneStage(SCENE.CHALLENGE);
            }
        } 
        else if (sceneStage === SCENE.FIXED) {
            if (dialogueIndex < conclusionDialogue.length - 1) {
                setDialogueIndex(dialogueIndex + 1);
            } else {
                // Se o diálogo final terminou, vai para o botão de conclusão
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

    const renderCurrentScene = () => {
        // --- ESTÁGIO DE CONCLUSÃO FINAL (BOTão DE RETORNO) ---
        if (sceneStage === SCENE.CONCLUSION) {
            return (
                <View style={styles.dialogueBox}>
                    <Text style={styles.speakerText}>{'[FIM DA CENA]'}</Text>
                    <Text style={styles.dialogueText}>
                        Você terminou a interação VIP com Lexi. Avance para o próximo capítulo!
                    </Text>
                    <TouchableOpacity 
                        style={styles.actionButton} 
                        onPress={() => navigation.navigate('Mission1' as any)} // ✅ RETORNA À TELA DE MISSÕES
                    >
                        <Text style={styles.buttonText}>Voltar ao Hub de Missões</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        
        // --- ESTÁGIO DE DIÁLOGO (INTRO OU FIXED) ---
        if (sceneStage === SCENE.INTRO || sceneStage === SCENE.FIXED) {
            
            const currentDialogueList = (sceneStage === SCENE.INTRO) ? dialogue : conclusionDialogue;
            const currentDialog = currentDialogueList[dialogueIndex];

            return (
                <View style={styles.dialogueBox}>
                    <Text style={styles.speakerText}>{currentDialog.speaker}:</Text>
                    <Text style={styles.dialogueText}>{currentDialog.text}</Text>
                    
                    <TouchableOpacity style={styles.actionButton} onPress={advanceDialogue}>
                        <Text style={styles.buttonText}>Continuar >></Text>
                    </TouchableOpacity>
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
                        <Text style={styles.buttonText}>Sincronizar Clock</Text>
                    </TouchableOpacity>
                    
                    {/* Imagem do desafio (Holograma) */}
                    <Text style={styles.imagePlaceholderText}></Text>
                </KeyboardAvoidingView>
            );
        }
    };

    const getBackgroundImage = () => {
        // ✅ CORREÇÃO: Usa as constantes locais CLUBHOLOGRMAIMAGE ou CLUBBALADAIMAGE
        if (sceneStage === SCENE.CHALLENGE) {
            return clubHologramaImage; // Fundo Jukebox/Desafio
        }
        return clubBaladaImage; // Fundo Bar/Diálogo
    }


    return (
        <ImageBackground
            source={getBackgroundImage()}
            style={styles.background}
            resizeMode="cover"
        >
            <StatusBar hidden />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {renderCurrentScene()}
            </ScrollView>
        </ImageBackground>
    );
};

// Estilos
const styles = StyleSheet.create({
    background: {
        flex: 1,
        // Mantém a imagem cobrindo toda a tela para não ter bordas pretas
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end', // Alinha o conteúdo ao fundo
        paddingBottom: 25, // 🚨 MUDANÇA: Adiciona padding inferior para subir o conteúdo
    },
    // --- Estilos da Caixa de Diálogo (APLICANDO OTIMIZAÇÕES DO BARSCREEN) ---
    dialogueBox: {
        width: '95%',
        padding: 10, // 🚨 REDUZIDO: Menos padding vertical
        backgroundColor: 'rgba(0, 0, 0, 0.75)', // Mais transparente
        borderColor: '#FF00FF', // Rosa Neon
        borderWidth: 2,
        borderRadius: 10,
        margin: 8, // Margem reduzida
        shadowColor: '#FF00FF',
        shadowRadius: 8,
        shadowOpacity: 0.9,
        elevation: 8,
    },
    speakerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00FFFF', // Ciano Neon para o nome
        marginBottom: 5,
    },
    dialogueText: {
        fontSize: 16, // 🚨 REDUZIDO
        color: '#FFFFFF',
        marginBottom: 8, // Margem reduzida
        lineHeight: 20,
    },
    actionButton: {
        padding: 8, // Padding reduzido
        backgroundColor: '#FF00FF',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },

    // --- Estilos do Desafio (Challenge) ---
    challengeBox: {
        width: '95%',
        padding: 10, // 🚨 REDUZIDO: Menos padding vertical
        // MUDANÇA: Mais transparente e com cor sutil para ver o fundo
        backgroundColor: 'rgba(30, 0, 30, 0.65)', 
        borderColor: '#00FFFF',
        borderWidth: 2,
        borderRadius: 10,
        margin: 8, // Margem reduzida
        alignItems: 'center',
    },
    challengeTitle: {
        fontSize: 20, // 🚨 REDUZIDO
        fontWeight: 'bold',
        color: '#00FFFF', // Ciano Neon
        marginBottom: 8,
    },
    challengeInstruction: {
        fontSize: 14, // 🚨 REDUZIDO
        color: '#AAAAAA',
        textAlign: 'center',
        marginVertical: 8, // Margem vertical menor
    },
    challengeCodeTitle: {
        fontSize: 13,
        color: '#FF00FF',
        marginTop: 5, // Margem reduzida
    },
    codeBlock: {
        width: '100%',
        backgroundColor: '#00001a',
        padding: 5, // 🚨 REDUZIDO
        borderRadius: 5,
        marginBottom: 8, // Margem reduzida
    },
    codeLine: {
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', 
        color: '#FFFFFF',
        fontSize: 12, // 🚨 REDUZIDO
        lineHeight: 16,
    },
    codeError: {
        color: '#FF0000', // Vermelho
        fontWeight: 'bold',
    },
    codeNote: {
        color: '#FFFF00', // Amarelo
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: 12, // 🚨 REDUZIDO
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#FFFFFF',
        fontSize: 16, // 🚨 REDUZIDO
        textAlign: 'center',
        marginVertical: 8, // Margem reduzida
        borderColor: '#00FFFF',
        borderWidth: 1,
    },
    challengeOption: {
        padding: 10, // 🚨 REDUZIDO
        backgroundColor: '#00FFFF',
        borderRadius: 8,
        marginVertical: 4, // Margem vertical reduzida
        alignItems: 'center',
        width: '100%',
    },
    imagePlaceholderText: {
        color: '#444444',
        fontSize: 10,
        marginTop: 10, // Margem reduzida
    }
});

export default ClubScreen;