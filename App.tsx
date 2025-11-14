import React from 'react';
<<<<<<< HEAD
import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
=======
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- Suas telas ---
>>>>>>> a47fe1e902decb36e352355ae2ed02bf212fa2d8
import NeonBackgroundScreen from './src/screens/Cap1-1';
import Mission1 from './src/screens/Mission1';
import ArcanumIntroScreen from './src/screens/Cap1-2';
import PythonQuizScreen from './src/screens/quiz1';
import RegistrationScreen from './src/screens/RegistrationScreen';

export type ScreenName = 'Login' | 'Register' | 'Cap1-1';

// --- Criação da Stack ---
const Stack = createNativeStackNavigator();

export default function App() {
<<<<<<< HEAD
    // O estado 'currentScreen' controla qual tela está visível.
    // Começamos na tela 'Login'.
    const [currentScreen, setCurrentScreen] = useState<ScreenName>('Login');

    // Esta função é passada para as telas filhas (Login, Register)
    // para permitir que elas mudem a tela atual.
    const navigateTo = (screen: ScreenName) => {
        setCurrentScreen(screen);
    };

    // Função que decide qual componente renderizar com base no estado
    const renderScreen = () => {
        switch (currentScreen) {
            case 'Login':
                return <LoginScreen navigateTo={navigateTo} />;
            
            case 'Register':
                return <RegistrationScreen navigateTo={navigateTo} />;
            
            case 'Cap1-1':
                // Passamos 'navigateTo' para que a Cap1-1 possa voltar ao Login (se necessário)
                return <NeonBackgroundScreen navigateTo={navigateTo} />;
            
            default:
                return <LoginScreen navigateTo={navigateTo} />;
        }
    };

    return (
        <View style={styles.container}>
            {renderScreen()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Garante que o app ocupe a tela inteira
    },
});
=======
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="NeonBackgroundScreen" 
        screenOptions={{
          headerShown: false, 
        }}
      >
        {/* Telas registradas */}
        <Stack.Screen name="NeonBackgroundScreen" component={NeonBackgroundScreen} />
        <Stack.Screen name="Mission1" component={Mission1} />
        <Stack.Screen name="ArcanumIntroScreen" component={ArcanumIntroScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

>>>>>>> a47fe1e902decb36e352355ae2ed02bf212fa2d8
