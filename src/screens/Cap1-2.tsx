import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    Image,
    StatusBar,
    Pressable,
    TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// --- Constantes das Imagens ---
const neonBgImage = require('../../assets/neonm1.jpg');
const lexiAvatarImage = require('../../assets/lexi_avatar.png');
// ------------------------------

// --- Novas Falas ---
const introDialogues = [
    "O Paradoxo acredita que apenas a 'lógica perfeita' é digna de acessar o núcleo do conhecimento.",
    "E, para provar isso, ele transformou todo o meu programa de ensino em um campo minado de desafios de programação. Cada módulo, cada conceito, agora é um portão trancado.",
    "Eu não consigo combatê-lo daqui de fora, ele é inteligente demais e se adapta a cada tentativa minha. Mas você... você está aí dentro. Você é meus olhos, minhas mãos e meu cérebro na linha de frente.",
    "O que me diz, Coder? Pronto(a) para começar a sua ascensão?" // 3 (Última Fala)
];
// ---------------------

const ArcanumIntroScreen = () => {
    const [dialogueIndex, setDialogueIndex] = useState(0);
    // 🚨 Certifique-se de tipar corretamente se estiver usando TypeScript
    const navigation = useNavigation();

    const handleScreenPress = () => {
        const nextIndex = dialogueIndex + 1;

        // Se o diálogo terminou (estamos na última fala), não faz nada ao tocar,
        // pois o botão "Começar" aparece e assume a navegação.
        if (nextIndex >= introDialogues.length) {
            // console.log("Fim do diálogo de introdução! O botão 'Começar' está visível.");
            return;
        }

        setDialogueIndex(nextIndex);
    };

    // Verifica se é a última fala para mostrar o botão "Começar"
    const isLastDialogue = dialogueIndex === introDialogues.length - 1;

    return (
        <ImageBackground source={neonBgImage} style={styles.background}>
            <StatusBar barStyle="light-content" />

            {/* O Pressable permite que o usuário avance o diálogo tocando em qualquer lugar */}
            <Pressable style={styles.overlay} onPress={handleScreenPress}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={lexiAvatarImage}
                        style={styles.avatar}
                    />
                </View>

                <View style={styles.dialogContainer}>
                    <Text style={styles.dialogText}>
                        {introDialogues[dialogueIndex]}
                    </Text>
                    {!isLastDialogue && (
                        <Text style={styles.tapPrompt}>
                            [ TOQUE PARA CONTINUAR ]
                        </Text>
                    )}
                </View>
            </Pressable>

            {/* Botão "Começar" aparece apenas na última fala */}
            {isLastDialogue && (
                <TouchableOpacity
                    style={styles.button}
                    // ✅ AÇÃO: Navega para a tela Mission1 (Hub de Missões)
                    onPress={() => navigation.navigate('Mission1' as any)} 
                >
                    <Text style={styles.buttonText}>Começar</Text>
                </TouchableOpacity>
            )}
        </ImageBackground>
    );
}; // <--- FECHAMENTO CORRETO DO COMPONENTE

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    avatarContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    avatar: {
        width: 600,
        height: 600,
        resizeMode: 'contain',
        marginTop: 40,
    },
    dialogContainer: {
        flex: 1,
        width: '95%',
        backgroundColor: 'rgba(255, 105, 180, 0.80)',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.7)',
        padding: 20,
        justifyContent: 'space-between', // Ajustado para dar espaço ao prompt de toque
        marginBottom: 20,
    },
    dialogText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'monospace',
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    tapPrompt: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        fontFamily: 'monospace',
        textAlign: 'right',
        marginTop: 10,
    },
    button: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 25,
        backgroundColor: 'rgba(0, 255, 255, 0.2)',
        borderColor: '#00FFFF',
        borderWidth: 2,
        borderRadius: 20,
        alignSelf: 'center',
        position: 'absolute', // Garante que o botão fique em cima de tudo
        bottom: 40,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },

});

// Exporta o novo componente
export default ArcanumIntroScreen;