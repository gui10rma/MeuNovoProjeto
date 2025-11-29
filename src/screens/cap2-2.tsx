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
    Pressable // ✅ Adicionado para capturar o toque na tela
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// --- Assets Locais (Assumidos) ---
const BACKGROUND_MEDITACAO_FECHADO = require('../../assets/lexi_meditacao.jpg'); 
const BACKGROUND_MEDITACAO_DOIS_OLHOS = require('../../assets/lexi_meditacao_2olhos.jpg'); // Fundo quando Lexi abre os olhos
const BACKGROUND_MEDITACAO_UM_OLHO = require('../../assets/lexi_meditacao_1olho.jpg'); // Fundo quando Lexi abre um olho

// --- ESTÁGIOS DA CENA ---
const SCENE = {
    DIALOGUE: 0,
    CONCLUSION: 1, // Exibe o botão de retorno centralizado
};

// 🚨 DIÁLOGOS COMPLETOS DA CENA
const dialogue = [
    { speaker: 'System', text: "Lexi senta-se no chão, cruzando as pernas em posição de lótus. O avatar dela flutua alguns centímetros acima da relva digital." }, // 0 - COMEÇA ABERTO
    { speaker: 'Lexi', text: "Senta aí. Vamos fazer um exercício de 'Defrag Mental'. É algo que eu faço quando o código fica muito complexo e eu perco o foco." }, // 1 - ABERTO
    { speaker: 'System', text: "Você senta-se ao lado dela. O ar ao seu redor cheira a ozônio e silício. A Lexi fecha os olhos." }, // 2 - ABERTO (Muda para FECHADO no próximo passo)
    { speaker: 'Lexi', text: "Feche os olhos (ou desligue o monitor, metaforicamente). Imagine que o seu cérebro é um navegador com 50 abas abertas. A aba do Paradoxo, a aba do Templo destruído, a aba do medo de falhar..." }, // 3 - FECHADO
    { speaker: 'Lexi', text: "Agora, quero que feche uma aba de cada vez. Click. Click. Click. Pare de processar o passado e o futuro. Foque apenas no Main Thread, no agora. Sinta o fluxo de dados passando por você sem tentar compilá-lo." }, // 4 - FECHADO
    { speaker: 'System', text: "O silêncio dura alguns segundos. De repente, Lexi abre um olho, quebrando a serenidade." }, // 5 - UM OLHO
    { speaker: 'Lexi', text: "Está funcionando? Porque eu acabei de lembrar que deixei uma pizza no micro-ondas no mundo real há três horas... Ok, foco, Lexi! Foco!" }, // 6 - DOIS OLHOS
    { speaker: 'Lexi', text: "Sério agora. O que fizemos hoje... enfrentamos o caos e impusemos ordem. Isso exige uma mente limpa. Obrigada por estares aqui. É difícil encontrar silêncio num mundo feito de ruído e dados. Acho que o meu cache está limpo agora." }, // 7 - DOIS OLHOS
];


const FlorestaMeditarScreen = () => {
    const navigation = useNavigation();
    const [sceneStage, setSceneStage] = useState(SCENE.DIALOGUE);
    const [dialogueIndex, setDialogueIndex] = useState(0);

    const currentDialog = dialogue[dialogueIndex];

    // ✅ NOVO: Lógica para mudar o fundo dinamicamente (LÓGICA INVERTIDA)
    const getBackgroundImage = () => {
        if (sceneStage === SCENE.CONCLUSION) {
            return BACKGROUND_MEDITACAO_DOIS_OLHOS; 
        }
        
        switch (dialogueIndex) {
            case 3: 
            case 4: // Diálogos de meditação profunda (Olhos Fechados)
                return BACKGROUND_MEDITACAO_FECHADO;
            case 5: // Diálogo "Lexi abre um olho"
                return BACKGROUND_MEDITACAO_UM_OLHO;
            default:
                // Diálogos 0, 1, 2, 6, 7 (Começa com olhos abertos, volta a abrir)
                return BACKGROUND_MEDITACAO_DOIS_OLHOS;
        }
    };


    // Avança o diálogo (Anexado ao Pressable de tela cheia)
    const advanceDialogue = () => {
        if (dialogueIndex < dialogue.length - 1) {
            setDialogueIndex(dialogueIndex + 1);
        } else {
            // Fim do diálogo: Vai para o estágio de conclusão
            setSceneStage(SCENE.CONCLUSION);
        }
    };

    const handleBackToMissions = () => {
        navigation.navigate('Mission1' as any);
    }


    const renderCurrentScene = () => {
        
        // --- ESTÁGIO DE CONCLUSÃO FINAL (BOTÃO CENTRALIZADO) ---
        if (sceneStage === SCENE.CONCLUSION) {
            return (
                 <View style={styles.conclusionContainer}> 
                    <View style={styles.dialogueBox}>
                        <Text style={styles.speakerText}>{'[RECARREGADO]'}</Text>
                        <Text style={styles.dialogueText}>
                            Vocês levantam-se, sentindo-se "recarregados". O teu avatar ganhou um bônus temporário de Foco, que ajudará na próxima missão.
                        </Text>
                    </View>
                    
                    {/* BOTÃO CENTRALIZADO E ISOLADO (Estilo copiado da BarScreen/ClubScreen) */}
                    <TouchableOpacity 
                        style={styles.centeredActionButton} 
                        onPress={handleBackToMissions} 
                    >
                        <Text style={styles.centeredButtonText}>Voltar ao Hub de Missões</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        
        // --- ESTÁGIO DE DIÁLOGO ---
        const isLastDialogue = dialogueIndex === dialogue.length - 1;
        return (
             <View style={styles.dialogContainer}>
                <View style={styles.dialogueBox}>
                    <Text style={styles.speakerText}>{currentDialog.speaker}:</Text>
                    <Text style={styles.dialogueText}>{currentDialog.text}</Text>
                    
                    {/* ✅ NOVO: Prompt de toque */}
                    <Text style={styles.tapPrompt}>
                        {isLastDialogue ? '[ FIM DO EXERCÍCIO ]' : '[ TOQUE PARA CONTINUAR >> ]'}
                    </Text>
                    {/* ❌ REMOVIDO: TouchableOpacity do botão "Continuar" */}
                </View>
            </View>
        );
    };


    return (
        <ImageBackground
            source={getBackgroundImage()} // ✅ Usa a função para pegar o fundo dinâmico
            style={styles.background}
            resizeMode="cover"
        >
            <StatusBar hidden />
            
            {/* ✅ Pressable em tela cheia para avançar o diálogo */}
            <Pressable 
                style={styles.fullScreenOverlay} 
                onPress={sceneStage === SCENE.DIALOGUE ? advanceDialogue : undefined}
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
    // 🚨 NOVO: Container para centralizar o botão de conclusão
    conclusionContainer: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
    },

    // --- Estilos da Caixa de Diálogo (Verde Neon) ---
    dialogueBox: {
        width: '95%',
        padding: 15,
        // ✅ MUDANÇA: Fundo verde escuro para floresta
        backgroundColor: 'rgba(0, 50, 0, 0.85)', 
        // ✅ MUDANÇA: Borda verde neon
        borderColor: '#00FF00', 
        borderWidth: 2,
        borderRadius: 10,
        margin: 10,
        // ✅ MUDANÇA: Sombra verde neon
        shadowColor: '#00FF00',
        shadowRadius: 10,
        shadowOpacity: 1,
        elevation: 10,
    },
    speakerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF00FF', // Rosa Neon para Lexi/System (Mantido para contraste)
        marginBottom: 5,
        fontFamily: 'monospace', // ✅ Monospace adicionado
    },
    dialogueText: {
        fontSize: 17, 
        color: '#FFFFFF', // ✅ Branco mantido
        marginBottom: 15,
        lineHeight: 22,
        fontFamily: 'monospace', // ✅ Monospace adicionado
    },
    
    // ✅ NOVO ESTILO: Prompt de toque
    tapPrompt: {
        color: '#00FF00', // Verde Neon para o prompt
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'right',
        marginTop: 5,
        fontFamily: 'monospace', // ✅ Monospace adicionado
    },

    // 🚨 Estilos de botão final (copiados da BarScreen/ClubScreen para centralização)
    centeredActionButton: {
        width: '80%',
        padding: 15,
        backgroundColor: '#00FF00', // Verde Neon
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
        shadowColor: '#00FF00',
        shadowRadius: 5,
        elevation: 5,
    },
    centeredButtonText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'monospace',
    },
});

export default FlorestaMeditarScreen;