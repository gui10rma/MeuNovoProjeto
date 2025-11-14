import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    Image,
    StatusBar,
    Pressable,
<<<<<<< HEAD
    Alert // Adicionado Alert para o final do diálogo
} from 'react-native';
// Importa o tipo ScreenName do App.tsx (O caminho '../../App' assume que App.tsx está na raiz)
import { ScreenName } from '../../App'; 
=======
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
>>>>>>> a47fe1e902decb36e352355ae2ed02bf212fa2d8

// --- Constantes das Imagens ---
// NOTA: Os caminhos de require() dependem da localização exata do Cap1-1.tsx
const neonBgImage = require('../../assets/neon_city.jpg');
const lexiAvatarImage = require('../../assets/lexi_avatar.png');
const lexiEmergencyImage = require('../../assets/lexi_avatar_preocupada.png');
// ------------------------------

// --- Falas da Lexi ---
const lexisDialogues = [
<<<<<<< HEAD
    "E aí! Seja muito bem-vindo(a) à 'Ascensão do Coder'. Meu nome é Lexi, e eu vou ser sua guia nessa jornada.", // 0
    "Eu criei este lugar, o Arcanum do Código, como um playground digital para treinar os melhores desenvolvedores do mundo. Aqui, você vai aprender tudo, do básico ao avançado, de uma forma que...", // 1
    "Opa. Isso não estava no script. Segura aí um segundo.", // 2 (Ponto de Transição: Começa o Flash/Preocupada)
    "Ok, Coder. Parece que vamos ter que pular a parte do 'tour tranquilo'. O Arcanum foi infectado por... algo. Não é um vírus comum. É um... Paradoxo.", // 3
    "Uma entidade de código que se espalha reescrevendo as regras do sistema e trancando tudo por trás de 'Firewalls de Enigmas'. Ele não quer destruir o Arcanum, ele quer... testá-lo. E a nós." // 4 (Fim do Diálogo)
];
// ---------------------

// Define o tipo das props que o Cap1-1 espera receber
type Cap1ScreenProps = {
    navigateTo: (screen: ScreenName) => void;
};

const NeonBackgroundScreen: React.FC<Cap1ScreenProps> = ({ navigateTo }) => {
=======
    "E aí! Seja muito bem-vindo(a) à 'Ascensão do Coder'. Meu nome é Lexi, e eu vou ser sua guia nessa jornada.",
    "Eu criei este lugar, o Arcanum do Código, como um playground digital para treinar os melhores desenvolvedores do mundo. Aqui, você vai aprender tudo, do básico ao avançado, de uma forma que...",
    "Opa. Isso não estava no script. Segura aí um segundo.",
    "Ok, Coder. Parece que vamos ter que pular a parte do 'tour tranquilo'. O Arcanum foi infectado por... algo. Não é um vírus comum. É um... Paradoxo.",
    "Uma entidade de código que se espalha reescrevendo as regras do sistema e trancando tudo por trás de 'Firewalls de Enigmas'. Ele não quer destruir o Arcanum, ele quer... testá-lo. E a nós."
];
// ---------------------

const NeonBackgroundScreen = () => {
>>>>>>> a47fe1e902decb36e352355ae2ed02bf212fa2d8
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [currentImage, setCurrentImage] = useState(lexiAvatarImage);
    const [isFlashing, setIsFlashing] = useState(false);
    const [flashToggle, setFlashToggle] = useState(false);

<<<<<<< HEAD
    // Este useEffect controla a animação de piscar do overlay
=======
    // 🚨 useNavigation precisa ser tipado corretamente (para evitar erro de tipo)
    const navigation = useNavigation<any>();

    // Controla o efeito de piscar
>>>>>>> a47fe1e902decb36e352355ae2ed02bf212fa2d8
    useEffect(() => {
        let flashInterval: any = null; // 👈 trocado de NodeJS.Timeout → any (React Native não reconhece NodeJS.Timeout)
        if (isFlashing) {
            flashInterval = setInterval(() => {
                setFlashToggle(prev => !prev);
            }, 150);
        } else {
<<<<<<< HEAD
            // Garante que o flash pare desligado
=======
>>>>>>> a47fe1e902decb36e352355ae2ed02bf212fa2d8
            setFlashToggle(false);
        }

        return () => {
            if (flashInterval) clearInterval(flashInterval);
        };
    }, [isFlashing]);

    const handleScreenPress = () => {
        const nextIndex = dialogueIndex + 1;

<<<<<<< HEAD
        // Se o diálogo tiver terminado (após a última fala)
        if (nextIndex >= lexisDialogues.length) {
            Alert.alert(
                "Iniciando Missão", 
                "Pronto para a Missão 1? Você será redirecionado para a próxima tela.",
                [{ text: "OK", onPress: () => {
                    // Aqui você navegaria para a próxima tela, ex: 'Cap1-2'
                    console.log("Navegando para Cap1-2 (ou tela de Quiz/Missão)");
                    // navigateTo('Cap1-2'); // Você precisará adicionar 'Cap1-2' ao App.tsx
                }}]
            );
            setIsFlashing(false); // Garante que para de piscar
            return; 
=======
        if (nextIndex >= lexisDialogues.length) {
            setIsFlashing(false);
            navigation.navigate('Mission1'); // 👈 navega para próxima tela
            return;
>>>>>>> a47fe1e902decb36e352355ae2ed02bf212fa2d8
        }

        setDialogueIndex(nextIndex);

<<<<<<< HEAD
        // --- LÓGICA DE ESTADO VISUAL (Imagem e Flash) ---

        // Lógica da Imagem: Mudar para "preocupada" a partir do índice 2
=======
>>>>>>> a47fe1e902decb36e352355ae2ed02bf212fa2d8
        if (nextIndex >= 2) {
            setCurrentImage(lexiEmergencyImage);
        } else {
            setCurrentImage(lexiAvatarImage);
        }

        if (nextIndex === 2) {
            setIsFlashing(true);
        } else {
<<<<<<< HEAD
            setIsFlashing(false); // Para de piscar
=======
            setIsFlashing(false);
>>>>>>> a47fe1e902decb36e352355ae2ed02bf212fa2d8
        }
    };

    return (
        <ImageBackground source={neonBgImage} style={styles.background}>
            <StatusBar barStyle="light-content" />

            <Pressable style={styles.overlay} onPress={handleScreenPress}>
                {isFlashing && flashToggle && <View style={styles.redFlashOverlay} />}

                <View style={styles.avatarContainer}>
                    <Image source={currentImage} style={styles.avatar} />
                </View>

                <View style={styles.dialogContainer}>
                    <Text style={styles.dialogText}>
                        {lexisDialogues[dialogueIndex]}
                    </Text>
                    <Text style={styles.tapPrompt}>
                        [ TOQUE PARA CONTINUAR ]
                    </Text>
                </View>
            </Pressable>
        </ImageBackground>
    );
};

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
    redFlashOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 0, 0, 0.4)',
        zIndex: 1,
    },
    avatarContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        zIndex: 2,
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
        backgroundColor: 'rgba(255, 105, 180, 0.80)', // Fundo rosa semi-transparente
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.7)',
        padding: 20,
        justifyContent: 'space-between', // Para posicionar o prompt
        marginBottom: 20,
<<<<<<< HEAD
        zIndex: 2, 
=======
        zIndex: 2,
>>>>>>> a47fe1e902decb36e352355ae2ed02bf212fa2d8
    },
    dialogText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'monospace', // Usando monospace para visual futurista
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
<<<<<<< HEAD
    tapPrompt: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        fontFamily: 'monospace',
        textAlign: 'right',
        marginTop: 10,
    }
=======
>>>>>>> a47fe1e902decb36e352355ae2ed02bf212fa2d8
});

export default NeonBackgroundScreen;
