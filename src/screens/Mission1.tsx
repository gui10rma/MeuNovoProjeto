import React, { useState, useEffect } from 'react'; 
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
import { useNavigation, useIsFocused } from '@react-navigation/native'; 
import { removeAuthToken } from '../lib/api'; 
import api from '../lib/api'; 

// Importe a fonte que você instalou (Audiowide)
import { useFonts, Audiowide_400Regular } from '@expo-google-fonts/audiowide';

const backgroundImage = require('../../assets/neonm1.jpg');

// ID da Missão 1 (DEVE BATER com o ID salvo no Quiz)
const MISSAO_1_ID = 'Missao1_PythonBasics'; 

function Mission1() { 

    const navigation = useNavigation();
    const isFocused = useIsFocused(); 

    // Estado para armazenar pontuações e estado de carregamento
    const [userScores, setUserScores] = useState<Record<string, number | undefined>>({});
    const [isLoadingScores, setIsLoadingScores] = useState(true);

    // Carrega a fonte no app
    let [fontsLoaded] = useFonts({
        Audiowide_400Regular,
    });
    
    // --- Função para Carregar Pontuações ---
    const fetchUserScores = async () => {
        setIsLoadingScores(true);
        try {
            // Chama a rota GET /usuarios/pontuacoes (Backend já corrigido)
            const response = await api.get('/usuarios/pontuacoes');
            const pontuacoes = response.data?.pontuacoes || {}; 
            setUserScores(pontuacoes);
        } catch (error) {
            console.error("Erro ao buscar pontuações:", error);
            // Pode ocorrer se o token for inválido, mantendo o bloqueio até o login
        } finally {
            setIsLoadingScores(false);
        }
    };

    // useEffect CRÍTICO: Recarrega as pontuações sempre que a tela entra em foco
    useEffect(() => {
        if (isFocused) {
            fetchUserScores();
        }
    }, [isFocused]);

    // VERIFICAÇÃO PRINCIPAL: Checa se a pontuação da Missão 1 é maior que zero
    const isMission1Completed = (userScores[MISSAO_1_ID] || 0) > 0;
    
    // --- Lógica de Logout (Mantida) ---
    const handleLogout = async () => {
        Alert.alert(
            "Sair do Jogo",
            "Tem certeza que deseja encerrar a sua sessão?",
            [
                { text: "Cancelar", style: "cancel" },
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
            // ✅ NAVEGAÇÃO DIRETA para a Missão 1
            // Confirme que 'PythonQuiz' é o nome exato da rota no seu NavigationStack
            navigation.navigate('PythonQuiz' as any); 
        } else if (missionName === 'Mission2') {
             // Lógica de Bloqueio 
             if (isMission1Completed) {
                 navigation.navigate('Cap2_1' as any); 
             } else {
                 Alert.alert("Acesso Bloqueado", "Complete o Portão Quebrado (Missão 1) para desbloquear Condicionais.");
             }
        } else if (missionName === 'Mission3') {
            navigation.navigate('IteradorFenda' as any); 
        }
    };
    
    // Estilo para botão bloqueado
    const getButtonStyle = (missionName: string) => {
        if (missionName === 'Mission2' && !isMission1Completed) {
            return styles.buttonLocked;
        }
        if (missionName === 'Mission1') return styles.buttonCyan;
        if (missionName === 'Mission2') return styles.buttonMagenta;
        if (missionName === 'Mission3') return styles.buttonYellow;
        return styles.button;
    }


    // Se a fonte ou os dados ainda não carregaram, mostra um indicador
    if (!fontsLoaded || isLoadingScores) {
        return ( 
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00FFFF" />
            </View>
        );
    }

    // Quando a fonte e os dados carregarem, mostra a tela
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

                    {/* Missão 1 - Variáveis (Sempre Acessível) */}
                    <TouchableOpacity
                        style={[styles.button, getButtonStyle('Mission1')]}
                        onPress={() => handleMissionStart('Mission1')}
                        // Não há 'disabled' aqui, o botão deve funcionar
                    >
                        <Text style={styles.buttonText}>1. Variáveis - O Portão Quebrado</Text>
                    </TouchableOpacity>

                    {/* Missão 2 - Condicionais (Bloqueada se Missão 1 não foi concluída) */}
                    <TouchableOpacity
                        style={[styles.button, getButtonStyle('Mission2')]}
                        onPress={() => handleMissionStart('Mission2')}
                        disabled={!isMission1Completed} // 🚨 AQUI ESTÁ O BLOQUEIO
                    >
                        <Text style={styles.buttonText}>
                            2. Condicionais - A Chave Lógica {isMission1Completed ? '' : ' [ BLOQUEADO ]'}
                        </Text>
                    </TouchableOpacity>

                    {/* Missão 3 - Loops */}
                    <TouchableOpacity
                        style={[styles.button, getButtonStyle('Mission3')]}
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
    // 🚨 NOVO ESTILO: Botão Bloqueado
    buttonLocked: {
        backgroundColor: 'rgba(50, 50, 50, 0.5)', // Cor escura para indicar bloqueio
        borderColor: '#888888', // Borda cinza
        shadowColor: '#333333',
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