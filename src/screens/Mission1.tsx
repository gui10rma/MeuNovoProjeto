import React from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity, // 1. Importado para criar o botão
    ActivityIndicator // 2. Para mostrar "carregando" enquanto a fonte baixa
} from 'react-native';

// 3. Importe a fonte que você instalou
import { useFonts, Audiowide_400Regular } from '@expo-google-fonts/audiowide';

const backgroundImage = require('../../assets/neonm1.jpg');

function Mission1() {

    // 4. Carrega a fonte no app
    let [fontsLoaded] = useFonts({
        Audiowide_400Regular,
    });

    // 5. Se a fonte ainda não carregou, mostra um indicador
    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00FFFF" />
            </View>
        );
    }

    // 6. Quando a fonte carregar, mostra a tela
    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <ImageBackground
                source={backgroundImage}
                resizeMode="cover"
                style={styles.background}
            >
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        Missão 1
                    </Text>
                    <Text style={styles.subtitle}>
                        Variáveis e Tipos de Dados - O Portão Quebrado
                    </Text>

                    {/* 7. BOTÃO "COMEÇAR" ADICIONADO AQUI */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => console.log('Botão "Começar" pressionado!')} // Ação do botão
                    >
                        <Text style={styles.buttonText}>Começar</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: { // Estilo para a tela de loading
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#01011a',
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        width: '90%', // Impede o texto de colar nas bordas
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 10,
        padding: 25, // Aumentei o padding
        alignItems: 'center',
    },
    title: {
        // 8. FONTE APLICADA
        fontFamily: 'Audiowide_400Regular',
        fontSize: 42, // Ajustei o tamanho
        color: '#00FFFF',
        textAlign: 'center',
        marginBottom: 15, // Aumentei a margem
        textShadowColor: 'rgba(0, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    subtitle: {
        // 8. FONTE APLICADA
        fontFamily: 'Audiowide_400Regular',
        fontSize: 22, // Ajustei o tamanho
        color: '#FF00FF', // Mudei para Rosa Neon
        textAlign: 'center',
        paddingHorizontal: 10,
        textShadowColor: 'rgba(255, 0, 255, 0.7)', // Sombra rosa
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
        lineHeight: 30, // Melhora a leitura
    },
    // 9. ESTILOS PARA O BOTÃO
    button: {
        marginTop: 40, // Espaço acima do botão
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: 'rgba(0, 255, 255, 0.1)', // Fundo ciano transparente
        borderColor: '#00FFFF', // Borda ciano
        borderWidth: 2,
        borderRadius: 25, // Borda arredondada
    },
    buttonText: {
        // 8. FONTE APLICADA
        fontFamily: 'Audiowide_400Regular',
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'center',
        textShadowColor: 'rgba(255, 255, 255, 0.7)',
        textShadowRadius: 8,
    },
});

export default Mission1;