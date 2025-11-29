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
    Pressable // ✅ Adicionado para capturar o toque na tela
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
    CONCLUSION: 3, // Estágio onde aparece o botão de retorno (Centralizado)
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

    // Lógica do Minigame (simula a troca de tipo de dado)
    const handleFixJukebox = (type: string) => {
        // O tipo correto de dado para nome_da_musica deve ser "string"
        if (type === 'string') {
            // Acerto!
            setChallengeFixed(true);
            setDialogueIndex(0); // Começa o diálogo de conclusão
            setSceneStage(SCENE.FIXED); // Vai para o estágio de diálogo final
        } else {
            // Erro
            Alert.alert("Erro de Tipo", "A Jukebox rejeitou o comando. O tipo de dado está incorreto!");
        }
    };

    const handleBackToMissions = () => {
        navigation.navigate('Mission1' as any);
    }


    const renderCurrentScene = () => {

        // --- ESTÁGIO DE CONCLUSÃO FINAL (BOTÃO CENTRALIZADO) ---
        if (sceneStage === SCENE.CONCLUSION) {
            return (
                // ✅ USANDO conclusionContainer: Centraliza vertical e horizontalmente
                <View style={styles.conclusionContainer}>
                    <View style={styles.dialogueBox}>
                        <Text style={styles.speakerText}>{'[FIM DA CENA]'}</Text>
                        <Text style={styles.dialogText}>
                            Você terminou a primeira interação narrativa com Lexi. Avance para as próximas missões.
                        </Text>
                    </View>
                    
                    {/* BOTÃO CENTRALIZADO E ISOLADO */}
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
                            <Text style={styles.challengeButtonText}>Trocar para Boolean (False)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.challengeOption} onPress={() => handleFixJukebox('string')}>
                            <Text style={styles.challengeButtonText}>Trocar para String ("LoFiChill")</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.challengeOption} onPress={() => handleFixJukebox('number')}>
                            <Text style={styles.challengeButtonText}>Trocar para Number (1)</Text>
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

// --- Estilos de Layout e Tema (Amarelo Escuro/Neon Aplicado) ---
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

    // Contêiner padrão para diálogos (na parte inferior)
    dialogContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        paddingBottom: 20,
    },

    // 🚨 NOVO: Container para centralizar o botão de conclusão (USADO!)
    conclusionContainer: {
        flex: 1,
        // 🚨 Centraliza vertical e horizontalmente
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
    },

    // --- Estilos da Caixa de Diálogo (Balão) ---
    dialogueBox: {
        width: '95%',
        padding: 20,
        // 🟡 MUDANÇA APLICADA: Fundo Amarelo Escuro/Dourado Neon
        backgroundColor: 'rgba(50, 50, 0, 0.90)', 
        // 🟡 MUDANÇA APLICADA: Borda e sombra Amarelo Neon
        borderColor: '#FFFF00', 
        borderWidth: 3,
        borderRadius: 15, 
        margin: 10,
        shadowColor: '#FFFF00', 
        shadowRadius: 10,
        shadowOpacity: 1,
        elevation: 10,
    },
    // 🚨 ESTILO DE LETRA MONOSPACE PARA SPEAKER
    speakerText: {
        fontSize: 18,
        fontWeight: 'bold',
        // 🟡 MUDANÇA APLICADA: Cor do Speaker para Rosa/Magenta (Alto Contraste)
        color: '#FF00FF', // Rosa Neon
        marginBottom: 5,
        fontFamily: 'monospace', 
    },
    // 🚨 ESTILO DE LETRA MONOSPACE PARA DIÁLOGO
    dialogText: {
        // 🟡 MUDANÇA APLICADA: Texto Ciano Neon para alto contraste no fundo escuro
        color: '#00FFFF', // Ciano Neon
        fontSize: 18,
        fontFamily: 'monospace', 
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        marginBottom: 10,
        lineHeight: 22,
    },

    // ✅ NOVO: Estilo para o prompt de toque
    tapPrompt: {
        // 🟡 MUDANÇA APLICADA: Rosa Neon para contraste
        color: '#FF00FF', 
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
        backgroundColor: '#FF00FF', // Rosa Neon
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

    // 🚨 NOVO: Estilos para o Botão de Conclusão Centralizado (USADO EM SCENE.CONCLUSION)
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

export default BarScreen;