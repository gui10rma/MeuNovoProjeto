import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
    // ❌ REMOVIDO: Image (não precisamos mais de avatares)
    Alert,
    Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// --- Assets Locais (Assumidos) ---
const BACKGROUND_MARGEM = require('../../assets/lago.jpg'); 
const BACKGROUND_LAGO_SWIM = require('../../assets/lexi_lagoa.jpg'); // Fundo com Lexi na água

// --- ESTÁGIOS DA CENA ---
const SCENE = {
    ENTRANCE: 0,      // Chegada na margem (Sem Avatar)
    IN_WATER: 1,      // Conversa na água (Sem Avatar)
    CONCLUSION: 2,    // Fim da cena
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

    // Avança o estágio, simulando a ação de Lexi pular
    const handleAction = () => {
        if (sceneStage === SCENE.ENTRANCE) {
            // Fim do diálogo de entrada -> Transição para a água
            Alert.alert("Lexi pula!", "Toque para iniciar a conversa na água.");
            setSceneStage(SCENE.IN_WATER);
            setDialogueIndex(0); // Inicia o diálogo da água
        } else if (sceneStage === SCENE.IN_WATER) {
            // Avança o diálogo na água
            if (dialogueIndex < dialogueInWater.length - 1) {
                setDialogueIndex(dialogueIndex + 1);
            } else {
                // Fim da cena: Transição para o estágio de conclusão
                Alert.alert("Fim da Recompensa", "Recompensado com um bônus de XP!");
                setSceneStage(SCENE.CONCLUSION);
                // NÃO RESETAMOS O INDEX AQUI, POIS O handleAction É CHAMADO NOVAMENTE
                // PARA O ESTÁGIO DE CONCLUSÃO
            }
        } else if (sceneStage === SCENE.CONCLUSION) {
            // AÇÃO NO ESTÁGIO DE CONCLUSÃO: Navegar para Mission1
            navigation.navigate('Mission1' as any); // ✅ Volta para o Hub de Missões
        }
    };
    

    const renderCurrentScene = () => {
        const currentList = getCurrentDialogueList();
        
        // 🎯 Correção: Garante que o índice não excede o limite da lista atual.
        // Se estiver no estágio de conclusão (que tem apenas 1 item), força o índice para 0.
        const safeIndex = (sceneStage === SCENE.CONCLUSION && dialogueIndex > 0) 
            ? 0 
            : dialogueIndex;

        const currentDialog = currentList[safeIndex];
        
        // --- Diálogo e Botão de Ação ---
        const DialogueAndActionBox = (
            <View style={styles.dialogueBox}>
                {/* Verifica se currentDialog está definido antes de tentar ler speaker */}
                {currentDialog?.speaker && (
                    <Text style={styles.speakerText}>{currentDialog.speaker}:</Text>
                )}
                {currentDialog?.text && (
                    <Text style={styles.dialogueText}>{currentDialog.text}</Text>
                )}

                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={handleAction}
                >
                    <Text style={styles.buttonText}>
                        {sceneStage === SCENE.ENTRANCE 
                            ? '[ Pular na Lagoa ]' 
                            : sceneStage === SCENE.IN_WATER 
                                ? dialogueIndex === dialogueInWater.length - 1 ? '[ Começar a Corrida ]' : 'Continuar >>'
                                : '[ Voltar ao Hub de Missões ]'
                        }
                    </Text>
                </TouchableOpacity>
            </View>
        );
        
        // --- RENDERIZAÇÃO PRINCIPAL ---
        return (
            <View style={styles.fullScreenTouch}>
                {/* O espaçador agora ocupa todo o espaço que resta, empurrando o diálogo para baixo */}
                <View style={styles.emptySpacer} /> 
                
                {/* Caixa de diálogo aparece no final */}
                <View style={styles.dialogueContainer}>
                    {DialogueAndActionBox}
                </View>
            </View>
        );
    };

    const getBackgroundImage = () => {
        // Define o fundo com base no estágio
        return sceneStage === SCENE.ENTRANCE ? BACKGROUND_MARGEM : BACKGROUND_LAGO_SWIM;
    }


    return (
        <ImageBackground
            source={getBackgroundImage()}
            style={styles.background}
            resizeMode="cover"
        >
            <StatusBar hidden />
            {renderCurrentScene()}
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
    fullScreenTouch: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between', // Divide espaço entre o topo e o diálogo
        alignItems: 'center',
    },
    
    // ✅ NOVO: Espaçador para ocupar o espaço superior
    emptySpacer: {
        flex: 1, // Isso faz o espaçador ocupar todo o espaço não ocupado pelo diálogo
        width: '100%',
    },
    
    // --- Diálogo Container ---
    dialogueContainer: {
        width: '100%',
        paddingBottom: 20,
        alignItems: 'center',
    },
    dialogueBox: {
        width: '95%',
        padding: 15,
        backgroundColor: 'rgba(0, 0, 30, 0.85)', 
        borderColor: '#00FFFF',
        borderWidth: 2,
        borderRadius: 10,
        margin: 10,
        shadowColor: '#00FFFF',
        shadowRadius: 10,
        elevation: 10,
    },
    speakerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF00FF', 
        marginBottom: 5,
    },
    dialogueText: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 15,
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
        fontSize: 16,
    },
});

export default LagoaRelaxarScreen;