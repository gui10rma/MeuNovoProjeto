import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
    ScrollView,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// --- Assets Locais (Assumidos) ---
// ⚠️ ATENÇÃO: Adicione estas imagens na sua pasta assets!
const BACKGROUND_MEDITACAO_FECHADO = require('../../assets/lexi_meditacao.jpg'); 
const BACKGROUND_MEDITACAO_DOIS_OLHOS = require('../../assets/lexi_meditacao_2olhos.jpg'); // Fundo quando Lexi abre os olhos
const BACKGROUND_MEDITACAO_UM_OLHO = require('../../assets/lexi_meditacao_1olho.jpg'); // Fundo quando Lexi abre um olho

// --- ESTÁGIOS DA CENA ---
const SCENE = {
    DIALOGUE: 0,
    CONCLUSION: 1, // Exibe o botão de retorno
};

// 🚨 DIÁLOGOS COMPLETOS DA CENA
const dialogue = [
    { speaker: 'System', text: "Lexi senta-se no chão, cruzando as pernas em posição de lótus. O avatar dela flutua alguns centímetros acima da relva digital." }, // 0
    { speaker: 'Lexi', text: "Senta aí. Vamos fazer um exercício de 'Defrag Mental'. É algo que eu faço quando o código fica muito complexo e eu perco o foco." }, // 1
    { speaker: 'System', text: "Você senta-se ao lado dela. O ar ao seu redor cheira a ozônio e silício. A Lexi fecha os olhos." }, // 2
    { speaker: 'Lexi', text: "Feche os olhos (ou desligue o monitor, metaforicamente). Imagine que o seu cérebro é um navegador com 50 abas abertas. A aba do Paradoxo, a aba do Templo destruído, a aba do medo de falhar..." }, // 3
    { speaker: 'Lexi', text: "Agora, quero que feche uma aba de cada vez. Click. Click. Click. Pare de processar o passado e o futuro. Foque apenas no Main Thread, no agora. Sinta o fluxo de dados passando por você sem tentar compilá-lo." }, // 4
    { speaker: 'System', text: "O silêncio dura alguns segundos. De repente, Lexi abre um olho, quebrando a serenidade." }, // 5 (Muda para 1 olho aberto)
    { speaker: 'Lexi', text: "Está funcionando? Porque eu acabei de lembrar que deixei uma pizza no micro-ondas no mundo real há três horas... Ok, foco, Lexi! Foco!" }, // 6 (Muda para 2 olhos abertos)
    { speaker: 'Lexi', text: "Sério agora. O que fizemos hoje... enfrentamos o caos e impusemos ordem. Isso exige uma mente limpa. Obrigada por estares aqui. É difícil encontrar silêncio num mundo feito de ruído e dados. Acho que o meu cache está limpo agora." }, // 7
];


const FlorestaMeditarScreen = () => {
    const navigation = useNavigation();
    const [sceneStage, setSceneStage] = useState(SCENE.DIALOGUE);
    const [dialogueIndex, setDialogueIndex] = useState(0);

    const currentDialog = dialogue[dialogueIndex];

    // ✅ NOVO: Lógica para mudar o fundo dinamicamente
    const getBackgroundImage = () => {
        if (sceneStage === SCENE.CONCLUSION) {
            return BACKGROUND_MEDITACAO_DOIS_OLHOS; // Usa a imagem de olhos abertos no final
        }
        
        switch (dialogueIndex) {
            case 5: // Diálogo "Lexi abre um olho"
                return BACKGROUND_MEDITACAO_UM_OLHO;
            case 6: // Diálogo da pizza (olhos abertos)
            case 7: 
                return BACKGROUND_MEDITACAO_DOIS_OLHOS;
            default:
                // Para diálogos 0, 1, 2, 3, 4 (Meditação/Olhos Fechados)
                return BACKGROUND_MEDITACAO_FECHADO;
        }
    };


    // Avança o diálogo
    const advanceDialogue = () => {
        if (dialogueIndex < dialogue.length - 1) {
            setDialogueIndex(dialogueIndex + 1);
        } else {
            // Fim do diálogo: Vai para o estágio de conclusão
            setSceneStage(SCENE.CONCLUSION);
        }
    };

    const renderCurrentScene = () => {
        // --- ESTÁGIO DE CONCLUSÃO FINAL (BOTÃO DE RETORNO) ---
        if (sceneStage === SCENE.CONCLUSION) {
            return (
                <View style={styles.dialogueBox}>
                    <Text style={styles.speakerText}>{'[RECARREGADO]'}</Text>
                    <Text style={styles.dialogueText}>
                        Vocês levantam-se, sentindo-se "recarregados". O teu avatar ganhou um bônus temporário de Foco, que ajudará na próxima missão.
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
        
        // --- ESTÁGIO DE DIÁLOGO ---
        return (
            <View style={styles.dialogueBox}>
                <Text style={styles.speakerText}>{currentDialog.speaker}:</Text>
                <Text style={styles.dialogueText}>{currentDialog.text}</Text>
                
                <TouchableOpacity style={styles.actionButton} onPress={advanceDialogue}>
                    <Text style={styles.buttonText}>Continuar >></Text>
                </TouchableOpacity>
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
        width: '100%',
        height: '100%',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end', // Alinha o conteúdo ao fundo
        paddingBottom: 20,
    },
    // --- Estilos da Caixa de Diálogo ---
    dialogueBox: {
        width: '95%',
        padding: 15,
        backgroundColor: 'rgba(0, 50, 0, 0.85)', // Fundo verde escuro para floresta
        borderColor: '#00FF00', // Borda verde neon
        borderWidth: 2,
        borderRadius: 10,
        margin: 10,
        shadowColor: '#00FF00',
        shadowRadius: 10,
        elevation: 10,
    },
    speakerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF00FF', // Rosa Neon para Lexi/System
        marginBottom: 5,
    },
    dialogueText: {
        fontSize: 17, 
        color: '#FFFFFF',
        marginBottom: 15,
        lineHeight: 22,
    },
    actionButton: {
        padding: 10,
        backgroundColor: '#00FF00', // Verde Neon
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default FlorestaMeditarScreen;