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
    KeyboardAvoidingView,
    Alert // Importa Alert para as mensagens de erro do minigame
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// ✅ CONSTANTES DAS IMAGENS LOCAIS
const lexiBarImage = require('../../assets/lexi_bar.jpg');
const lexiJunkboxImage = require('../../assets/lexi_junkbox.jpg');


// --- ESTÁGIOS DA CENA ---
const SCENE = {
    INTRO: 0,
    CHALLENGE: 1,
    FIXED: 2, // Desafio resolvido, exibe o diálogo final
    CONCLUSION: 3, // Estágio onde aparece o botão de retorno
};

const dialogue = [
    { speaker: 'Lexi', text: "Bem-vindo ao /dev/null. É para aqui que vêm os dados descartados para relaxar. Pedi-te um 'Java Juice' – é forte, mas ajuda a manter a classe." },
    { speaker: 'Lexi', text: "Sabes, quando comecei, eu era terrível com variáveis. Uma vez declarei o saldo da minha conta bancária como uma string de texto em vez de um número. Tentei somar o meu salário e o sistema concatenou os valores. Fiquei milionária por três segundos até o programa dar crash." },
    { speaker: 'System', text: "O som do bar falha. A música começa a repetir a mesma nota irritante, como um disco riscado. O Barman (um robô com um monóculo) parece em pânico, a bater na lateral da Jukebox digital." },
    { speaker: 'Lexi', text: "Ah, não. A Jukebox entrou em Deadlock. Ninguém merece beber sem música. Ei, Coder, queres impressionar a mentora? Dá uma olhadela no código da lista de reprodução." },
];

const conclusionDialogue = [
    { speaker: 'Jukebox Fixa', text: "A batida Lo-Fi volta a tocar suavemente. Lexi levanta o copo num brinde." },
    { speaker: 'Lexi', text: "Saúde. Tens jeito para isto. Não é só seguir regras, é saber improvisar quando o sistema falha. Descansa bem, porque amanhã... amanhã vamos lidar com repetições infinitas. E não vai ser tão agradável quanto esta música." },
];


const BarScreen = () => {
    const navigation = useNavigation();
    const [sceneStage, setSceneStage] = useState(SCENE.INTRO);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [challengeFixed, setChallengeFixed] = useState(false);

    // Avança o diálogo
    const advanceDialogue = () => {
        // Se estiver no diálogo introdutório
        if (sceneStage === SCENE.INTRO) {
            if (dialogueIndex < dialogue.length - 1) {
                setDialogueIndex(dialogueIndex + 1);
            } else {
                // Se o diálogo introdutório terminou, vai para o desafio
                setSceneStage(SCENE.CHALLENGE);
            }
        } 
        // Se estiver no diálogo final (após o desafio)
        else if (sceneStage === SCENE.FIXED) {
            if (dialogueIndex < conclusionDialogue.length - 1) {
                setDialogueIndex(dialogueIndex + 1);
            } else {
                // Se o diálogo final terminou, vai para o botão de conclusão
                setSceneStage(SCENE.CONCLUSION);
            }
        }
    };

    // Lógica do Minigame (simula a troca de tipo de dado)
    const handleFixJukebox = (type: string) => {
        if (type === 'string') {
            // Acerto!
            setChallengeFixed(true);
            setDialogueIndex(0); // Começa o diálogo de conclusão
            setSceneStage(SCENE.FIXED); // Vai para o estágio de diálogo final
        } else {
            // Erro
            Alert.alert("Erro", "A Jukebox rejeitou o comando. O tipo de dado está incorreto!");
        }
    };

    const renderCurrentScene = () => {
        // --- ESTÁGIO DE CONCLUSÃO FINAL (BOTÃO DE RETORNO) ---
        if (sceneStage === SCENE.CONCLUSION) {
            return (
                <View style={styles.dialogueBox}>
                    <Text style={styles.speakerText}>{'[FIM DA CENA]'}</Text>
                    <Text style={styles.dialogueText}>
                        Você terminou a primeira interação narrativa com Lexi. Avance para as próximas missões.
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
                <View style={styles.challengeBox}>
                    <Text style={styles.challengeTitle}>Desafio Oculto: Deadlock na Jukebox</Text>
                    <Text style={styles.challengeCodeTitle}>Código da Jukebox:</Text>

                    <View style={styles.codeBlock}>
                        <Text style={styles.codeLine}>let nome_da_musica: <Text style={styles.codeError}>Boolean</Text> = True;</Text>
                        <Text style={styles.codeLine}>while (nome_da_musica) {'{'} </Text>
                        <Text style={styles.codeLine}>  play_sound(nome_da_musica); </Text>
                        <Text style={styles.codeLine}>{'}'} </Text>
                    </View>

                    <Text style={styles.challengeInstruction}>
                        A Jukebox está presa num loop infinito porque o nome da música está declarado como um booleano (True). Corrija o TIPO de dado.
                    </Text>

                    <View style={styles.optionGroup}>
                        <TouchableOpacity style={styles.challengeOption} onPress={() => handleFixJukebox('boolean')}>
                            <Text style={styles.buttonText}>Trocar para Boolean (False)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.challengeOption} onPress={() => handleFixJukebox('string')}>
                            <Text style={styles.buttonText}>Trocar para String ("LoFiChill")</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.challengeOption} onPress={() => handleFixJukebox('number')}>
                            <Text style={styles.buttonText}>Trocar para Number (1)</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Imagem do desafio (Jukebox) - Mantida para preencher o espaço, se necessário */}
                    <Text style={styles.imagePlaceholderText}></Text>
                </View>
            );
        }
    };

    const getBackgroundImage = () => {
        // Usa as constantes locais 'require' para definir o fundo
        if (sceneStage === SCENE.CHALLENGE) {
            return lexiJunkboxImage;
        }
        return lexiBarImage;
    }


    return (
        <ImageBackground
            source={getBackgroundImage()} // ✅ Chama a função para mudar o fundo
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
    // ✅ Garante que o conteúdo fique alinhado ao fundo
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    // --- Estilos da Caixa de Diálogo ---
    dialogueBox: {
        width: '95%',
        padding: 15, // Padding reduzido
        backgroundColor: 'rgba(0, 0, 0, 0.75)', // Mais transparente
        borderColor: '#00FFFF',
        borderWidth: 2,
        borderRadius: 10,
        margin: 8, // Margem reduzida
        shadowColor: '#00FFFF',
        shadowRadius: 8,
        shadowOpacity: 0.9,
        elevation: 8,
    },
    speakerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF00FF', // Rosa Neon para o nome
        marginBottom: 5,
    },
    dialogueText: {
        fontSize: 17, // Fonte ligeiramente menor
        color: '#FFFFFF',
        marginBottom: 12,
        lineHeight: 22,
    },
    actionButton: {
        padding: 10,
        backgroundColor: '#00FFFF',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000000',
        fontWeight: 'bold',
    },

    // --- Estilos do Desafio (Challenge) ---
    challengeBox: {
        width: '95%',
        padding: 15, // Padding reduzido
        // 🚨 MUDANÇA: Mais transparente para ver o fundo (0.65 de opacidade)
        backgroundColor: 'rgba(20, 20, 50, 0.65)', 
        borderColor: '#FFFF00',
        borderWidth: 2,
        borderRadius: 10,
        margin: 8, // Margem reduzida
        alignItems: 'center',
    },
    challengeTitle: {
        fontSize: 22, // Fonte menor
        fontWeight: 'bold',
        color: '#FFFF00', // Amarelo Neon
        marginBottom: 10,
    },
    challengeInstruction: {
        fontSize: 15, // Fonte menor
        color: '#AAAAAA',
        textAlign: 'center',
        marginVertical: 10, // Margem vertical menor
    },
    challengeCodeTitle: {
        fontSize: 13,
        color: '#00FFFF',
        marginTop: 8,
    },
    codeBlock: {
        width: '100%',
        backgroundColor: '#00001a',
        padding: 8, // Padding reduzido
        borderRadius: 5,
    },
    codeLine: {
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', 
        color: '#FFFFFF',
        fontSize: 13, // Fonte menor
        lineHeight: 18,
    },
    codeError: {
        color: '#FF0000', // Vermelho para destacar o erro
        fontWeight: 'bold',
    },
    optionGroup: {
        width: '100%',
        marginTop: 15, // Espaço menor
    },
    challengeOption: {
        padding: 10, // Padding reduzido
        backgroundColor: '#FF00FF',
        borderRadius: 8,
        marginVertical: 4, // Margem vertical reduzida
        alignItems: 'center',
    },
    imagePlaceholderText: {
        color: '#444444',
        fontSize: 10, // Fonte bem pequena
        marginTop: 15,
    }
});

export default BarScreen;