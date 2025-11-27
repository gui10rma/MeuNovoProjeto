import React from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
    Alert // Importa o Alert para as mensagens de missão em desenvolvimento
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importa o hook de navegação

// Importe a fonte que você instalou (Audiowide)
import { useFonts, Audiowide_400Regular } from '@expo-google-fonts/audiowide';

const backgroundImage = require('../../assets/neonm1.jpg');

function Mission1() { // Este é o componente Hub de Missões

    const navigation = useNavigation();

    // Carrega a fonte no app
    let [fontsLoaded] = useFonts({
        Audiowide_400Regular,
    });

    // Função centralizada para lidar com a navegação para diferentes missões
    const handleMissionStart = (missionName: string) => {
        if (missionName === 'Mission1') {
            // Rota para o Quiz de Python (Missão 1)
            navigation.navigate('PythonQuiz' as any); 
        } else if (missionName === 'Mission2') {
            // Rota para a Introdução Narrativa da Missão 2 (Cap2_1.tsx)
            navigation.navigate('Cap2_1' as any); 
        } else if (missionName === 'Mission3') {
            // Missão 3 ainda não implementada
            Alert.alert('Missão 3', 'Loops: Em desenvolvimento!');
        }
    };

    // Se a fonte ainda não carregou, mostra um indicador
    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00FFFF" />
            </View>
        );
    }

    // Quando a fonte carregar, mostra a tela
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
                        Capítulos
                    </Text>
                    <Text style={styles.subtitle}>
                        Escolha sua jornada de decodificação!
                    </Text>

                    {/* Missão 1 - Variáveis (Leva para PythonQuiz) */}
                    <TouchableOpacity
                        style={[styles.button, styles.buttonCyan]}
                        onPress={() => handleMissionStart('Mission1')}
                    >
                        <Text style={styles.buttonText}>1. Variáveis - O Portão Quebrado</Text>
                    </TouchableOpacity>

                    {/* Missão 2 - Condicionais (Leva para Cap2_1) */}
                    <TouchableOpacity
                        style={[styles.button, styles.buttonMagenta]}
                        onPress={() => handleMissionStart('Mission2')}
                    >
                        <Text style={styles.buttonText}>2. Condicionais - A Chave Lógica</Text>
                    </TouchableOpacity>

                    {/* Missão 3 - Loops */}
                    <TouchableOpacity
                        style={[styles.button, styles.buttonYellow]}
                        onPress={() => handleMissionStart('Mission3')}
                    >
                        <Text style={styles.buttonText}>3. Loops - A Repetição Infinita</Text>
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
        width: '90%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 15,
        padding: 30, 
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Audiowide_400Regular',
        fontSize: 48, 
        color: '#FFFFFF', // Mudado para branco para contraste
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    subtitle: {
        fontFamily: 'Audiowide_400Regular',
        fontSize: 18, 
        color: '#AAAAAA', 
        textAlign: 'center',
        paddingHorizontal: 10,
        marginBottom: 30, // Espaço antes dos botões
    },
    // Estilos para o Botão
    button: {
        marginTop: 15, 
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 10, 
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonCyan: {
        backgroundColor: 'rgba(0, 255, 255, 0.15)', // Fundo ciano transparente
        borderColor: '#00FFFF', // Borda ciano
        shadowColor: '#00FFFF',
    },
    buttonMagenta: {
        backgroundColor: 'rgba(255, 0, 255, 0.15)', // Fundo magenta transparente
        borderColor: '#FF00FF', // Borda magenta
        shadowColor: '#FF00FF',
    },
    buttonYellow: {
        backgroundColor: 'rgba(255, 255, 0, 0.15)', // Fundo amarelo transparente
        borderColor: '#FFFF00', // Borda amarela
        shadowColor: '#FFFF00',
    },
    buttonText: {
        fontFamily: 'Audiowide_400Regular',
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'center',
        textShadowColor: 'rgba(255, 255, 255, 0.7)',
        textShadowRadius: 5,
    },
});

export default Mission1;