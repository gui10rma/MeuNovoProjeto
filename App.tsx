import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ✅ Funções de autenticação e API
import { loadAuthToken } from './src/lib/api';


// --- Importações de Telas ---
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import NeonBackgroundScreen from './src/screens/Cap1-1';
import Mission1 from './src/screens/Mission1'; // Hub de Missões

// Missão 1
import ArcanumIntroScreen from './src/screens/Cap1-2'; // Tela de Confronto
import PythonQuizScreen from './src/screens/quiz1'; // Quiz de Variáveis
import BarScreen from './src/screens/Cap1-3'; // Recompensa Bar
import ClubScreen from './src/screens/Cap1-4'; // Recompensa Balada

// Missão 2
import Capitulo21Screen from './src/screens/Cap2-1'; // Introdução à Missão 2 (Condicionais)
import FlorestaMeditarScreen from './src/screens/cap2-2'; // Recompensa Floresta (Coder)
import LagoaRelaxarScreen from './src/screens/Cap2-3';     // Recompensa Lagoa (Hacker)
import QuizCondicionaisScreen from './src/screens/quiz2'; // Quiz de Condicionais

// 🚀 Missão 3: IMPORTAÇÃO CORRETA
import IteradorFendaScreen from './src/screens/itinerador'; // NOVA TELA: Quiz de Loops (Iteradores)


// Definição dos tipos para as rotas
export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Cap1_1: undefined;
    Mission1: undefined;
    ArcanumIntroScreen: undefined;
    PythonQuiz: undefined;
    BarScreen: undefined;
    ClubScreen: undefined;

    Cap2_1: undefined;
    QuizCondicionais: undefined;
    FlorestaMeditar: undefined;
    LagoaRelaxar: undefined;

    // 🚀 NOVA ROTA ADICIONADA AQUI!
    IteradorFenda: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    // Lógica de carregamento de token (implementada anteriormente)
    const [isLoading, setIsLoading] = useState(true);
    const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Login');

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // ✅ Assumindo que loadAuthToken é tipo string | null 
                const token = await loadAuthToken();
                setInitialRoute(token ? 'Cap1_1' : 'Login');
            } catch (error) {
                console.error("Erro ao carregar token:", error);
                setInitialRoute('Login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00FFFF" />
                <Text style={styles.loadingText}>Carregando dados do Coder...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={initialRoute}
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegistrationScreen} />

                {/* Telas do Capítulo 1 */}
                <Stack.Screen name="Cap1_1" component={NeonBackgroundScreen} />
                <Stack.Screen name="ArcanumIntroScreen" component={ArcanumIntroScreen} />

                <Stack.Screen name="Mission1" component={Mission1} />

                <Stack.Screen name="PythonQuiz" component={PythonQuizScreen} />
                <Stack.Screen name="BarScreen" component={BarScreen} />
                <Stack.Screen name="ClubScreen" component={ClubScreen} />

                {/* Telas do Capítulo 2 */}
                <Stack.Screen name="Cap2_1" component={Capitulo21Screen} />
                <Stack.Screen name="QuizCondicionais" component={QuizCondicionaisScreen} />
                <Stack.Screen name="FlorestaMeditar" component={FlorestaMeditarScreen} />
                <Stack.Screen name="LagoaRelaxar" component={LagoaRelaxarScreen} />

                {/* 🚀 Telas do Capítulo 3 */}
                <Stack.Screen name="IteradorFenda" component={IteradorFendaScreen} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    loadingText: {
        color: '#00FFFF',
        marginTop: 10,
        fontSize: 16,
    }
});