import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image, // ✅ Importado para usar a imagem como um componente separado
    StatusBar,
    Pressable,
    Platform,
    Dimensions // Para usar a largura da tela
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 🚨 CORREÇÃO: Usando .jpg
const BACKGROUND_IMAGE = require('../../assets/tela_inicial.jpg'); 
const { height, width } = Dimensions.get('window'); // Obtém as dimensões da tela

const STRETCH_FACTOR = 1.1; 
const STRETCHED_HEIGHT = height * STRETCH_FACTOR;

const InitialSplashScreen = () => {
    const navigation = useNavigation();

    const handleContinue = () => {
        navigation.navigate('Login' as any);
    };

    return (
        <View style={styles.container}> {/* Container principal com fundo lilás */}
            <StatusBar hidden />
            
            {/* 🔄 IMAGEM RENDERIZADA SEPARADAMENTE PARA MAIOR CONTROLE */}
            <Image
                source={BACKGROUND_IMAGE}
                style={styles.stretchedImage}
                resizeMode="stretch" // ✅ Estica a imagem para preencher a área definida
            />

            <Pressable style={styles.overlay} onPress={handleContinue}>
                <View style={styles.textContainer}>
                    <Text style={styles.promptText}>
                        [ PRESSIONE PARA CONTINUAR ]
                    </Text>
                </View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#800080', // ✅ Fundo lilás
        justifyContent: 'center', // Centraliza a imagem verticalmente
        alignItems: 'center',     // Centraliza a imagem horizontalmente
    },
    stretchedImage: {
        width: '100%', 
        height: STRETCHED_HEIGHT, 
        position: 'absolute', // Posiciona a imagem por trás do overlay
        // 🚨 AJUSTE DE POSIÇÃO: Aumenta o valor negativo para subir a imagem
        top: -(STRETCHED_HEIGHT - height) / 1.5, // Alterado de /2 para /1.5 para subir mais
        left: 0,
    },
    overlay: {
        flex: 1,
        width: '100%',
        // 🚨 REMOVIDO: backgroundColor 'rgba(128, 0, 128, 0.4)'
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '20%', 
    },
    textContainer: {
        alignItems: 'center',
    },
    promptText: {
        fontSize: 18,
        color: '#00FFFF', // Ciano Neon
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 255, 255, 0.5)',
        textShadowRadius: 5,
        letterSpacing: 1,
        marginTop: 50,
    }
});

export default InitialSplashScreen;