import React from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { removeAuthToken } from '../lib/api'; // Importa a função de logout

// Importe a fonte que você instalou (Audiowide)
import { useFonts, Audiowide_400Regular } from '@expo-google-fonts/audiowide';

const backgroundImage = require('../../assets/neonm1.jpg');

function Mission1() { // Este é o componente Hub de Missões

    const navigation = useNavigation();

    // Carrega a fonte no app
    let [fontsLoaded] = useFonts({
        Audiowide_400Regular,
    });
    
    // --- Lógica de Logout ---
    const handleLogout = async () => {
        Alert.alert(
            "Sair do Jogo",
            "Tem certeza que deseja encerrar a sua sessão?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sair",
                    onPress: async () => {
                        try {
                            await removeAuthToken(); 
                            
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' as any }],
                            });

                        } catch (error) {
                            console.error("Erro ao fazer logout:", error);
                            Alert.alert("Erro de Logout", "Não foi possível sair. Tente novamente.");
                        }
                    }
                }
            ]
        );
    };
    // -----------------------------

    // Função centralizada para lidar com a navegação para diferentes missões
    const handleMissionStart = (missionName: string) => {
        if (missionName === 'Mission1') {
            // Rota para o Quiz de Python (Missão 1)
            navigation.navigate('PythonQuiz' as any); 
        } else if (missionName === 'Mission2') {
            // Rota para a Introdução Narrativa da Missão 2 (Cap2_1.tsx)
            navigation.navigate('Cap2_1' as any); 
        } else if (missionName === 'Mission3') {
            // ✅ Navegação CORRETA para a tela de Loops
            navigation.navigate('IteradorFenda' as any); 
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
                {/* Botão de Sair no canto superior direito */}
                <TouchableOpacity 
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutText}>SAIR</Text>
                </TouchableOpacity>

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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#01011a',
    },
    background: {
        flex: 1,
    },
    // Estilos do botão SAIR
    logoutButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        zIndex: 10,
        borderColor: '#FF0000',
        borderWidth: 1,
    },
    logoutText: {
        fontFamily: 'Audiowide_400Regular',
        color: '#FFCCCC',
        fontSize: 14,
        textShadowColor: 'rgba(255, 0, 0, 0.7)',
        textShadowRadius: 3,
    },
    textContainer: {
        width: '90%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 15,
        padding: 30, 
        alignSelf: 'center',
        marginTop: 150,
    },
    title: {
        fontFamily: 'Audiowide_400Regular',
        fontSize: 48, 
        color: '#FFFFFF',
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
        marginBottom: 30,
    },
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
        backgroundColor: 'rgba(0, 255, 255, 0.15)',
        borderColor: '#00FFFF',
        shadowColor: '#00FFFF',
    },
    buttonMagenta: {
        backgroundColor: 'rgba(255, 0, 255, 0.15)',
        borderColor: '#FF00FF',
        shadowColor: '#FF00FF',
    },
    buttonYellow: {
        backgroundColor: 'rgba(255, 255, 0, 0.15)',
        borderColor: '#FFFF00',
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