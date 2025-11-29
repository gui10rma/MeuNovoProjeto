import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ✅ Funções de autenticação e API
import { loadAuthToken } from './src/lib/api'; 

// --- Importações de Telas ---
import InitialSplashScreen from './src/screens/telainicial'; // Splash Screen
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';

// FLUXO PRINCIPAL
import NeonBackgroundScreen from './src/screens/Cap1-1';
import Mission1 from './src/screens/Mission1'; // Hub de Missões

// Missão 1
import ArcanumIntroScreen from './src/screens/Cap1-2';
import PythonQuizScreen from './src/screens/quiz1';
import BarScreen from './src/screens/Cap1-3'; 
import ClubScreen from './src/screens/Cap1-4'; 

// Missão 2
import Capitulo21Screen from './src/screens/Cap2-1'; // Introdução Condicionais
import QuizCondicionaisScreen from './src/screens/quiz2'; // 🚨 IMPORT FALTANTE (Quiz Condicionais)
import FlorestaMeditarScreen from './src/screens/cap2-2'; // 🚨 IMPORT FALTANTE (Recompensa Floresta)
import LagoaRelaxarScreen from './src/screens/Cap2-3';     // 🚨 IMPORT FALTANTE (Recompensa Lagoa)

// Missão 3
import IteradorFendaScreen from './src/screens/itinerador'; // 🚨 IMPORT FALTANTE (Nova Tela de Loops)


// Definição dos tipos para as rotas
export type RootStackParamList = {
    // ROTA INICIAL
    InitialSplash: undefined; 
    
    // Autenticação
    Login: undefined;
    Register: undefined;
    
    // Fluxo Principal e Missões
    Cap1_1: undefined; 
    ArcanumIntroScreen: undefined; 
    Mission1: undefined; 
    PythonQuiz: undefined; 

    // Recompensas Missão 1
    BarScreen: undefined;
    ClubScreen: undefined;

    // Rotas da Missão 2
    Cap2_1: undefined; 
    QuizCondicionais: undefined;
    FlorestaMeditar: undefined; 
    LagoaRelaxar: undefined; 

    // Rotas da Missão 3
    IteradorFenda: undefined; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('InitialSplash');

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = await loadAuthToken(); 
                setInitialRoute(token ? 'Cap1_1' : 'InitialSplash'); 
            } catch (error) {
                console.error("Erro ao carregar token:", error);
                setInitialRoute('InitialSplash');
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
                {/* 1. ROTA INICIAL (Splash) */}
                <Stack.Screen name="InitialSplash" component={InitialSplashScreen} />

                {/* 2. ROTAS DE AUTENTICAÇÃO */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegistrationScreen} />
                
                {/* 3. FLUXO DE INTRODUÇÃO / HUB */}
                <Stack.Screen name="Cap1_1" component={NeonBackgroundScreen} /> 
                <Stack.Screen name="ArcanumIntroScreen" component={ArcanumIntroScreen} /> 
                <Stack.Screen name="Mission1" component={Mission1} /> 

                {/* 4. ROTAS DE QUIZZES E RECOMPENSAS */}
                <Stack.Screen name="PythonQuiz" component={PythonQuizScreen} />
                <Stack.Screen name="BarScreen" component={BarScreen} />
                <Stack.Screen name="ClubScreen" component={ClubScreen} />
                
                <Stack.Screen name="Cap2_1" component={Capitulo21Screen} /> 
                <Stack.Screen name="QuizCondicionais" component={QuizCondicionaisScreen} />
                <Stack.Screen name="FlorestaMeditar" component={FlorestaMeditarScreen} /> 
                <Stack.Screen name="LagoaRelaxar" component={LagoaRelaxarScreen} /> 

                {/* 🚀 Rotas da Missão 3 */}
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