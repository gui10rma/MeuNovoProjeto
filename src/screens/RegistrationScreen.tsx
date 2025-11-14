import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
// Importa o tipo ScreenName do App.tsx (O caminho '../../App' assume que App.tsx está na raiz)
import { ScreenName } from '../../App'; 

const API_BASE_URL = 'http://192.168.0.39:3000'; 
const TEXT_COLOR_BASE = '#00FFFF';
const GLOW_COLOR_ON = 'rgba(0, 255, 255, 1.0)';
const GLOW_COLOR_OFF = 'rgba(0, 255, 255, 0.2)';

// 1. Define o tipo das props que o RegistrationScreen espera receber
type RegistrationScreenProps = {
    navigateTo: (screen: ScreenName) => void;
};

// 2. Aplica o tipo de props ao componente
const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ navigateTo }) => {
    // Estados para o brilho, inputs e loading
    const [currentGlowColor, setCurrentGlowColor] = useState(GLOW_COLOR_ON);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Efeito de brilho
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentGlowColor(prev => 
                prev === GLOW_COLOR_ON ? GLOW_COLOR_OFF : GLOW_COLOR_ON
            );
        }, 400);
        return () => clearInterval(interval);
    }, []);

    // Lógica de Registro
    const handleRegister = async () => {
        if (loading) return;
        if (!name || !email || !password) {
            Alert.alert("Erro", "Todos os campos são obrigatórios."); 
            return;
        }
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: name, email, senha: password }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Sucesso!", data.mensagem || "Registro realizado com sucesso!");
                
                // 3. NAVEGA DE VOLTA PARA A TELA DE LOGIN
                navigateTo('Login');
                
            } else {
                Alert.alert("Falha no Registro", data.mensagem || "Ocorreu um erro.");
            }
        } catch (error) {
            Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor.");
        } finally {
            setLoading(false);
        }
    };

    // Lógica de Navegação para Login
    const handleNavigateToLogin = () => {
        // 4. NAVEGA DE VOLTA PARA A TELA DE LOGIN
        navigateTo('Login');
    };

    return (
        <ImageBackground
            source={require('../../assets/background.jpg')}
            style={styles.background}
        >
            <StatusBar barStyle="light-content" />
            
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <Text style={[styles.titleFuturistic, { textShadowColor: currentGlowColor }]}>
                    CADASTRE-SE
                </Text>

                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        placeholderTextColor="#ccc"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        editable={!loading}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#ccc"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor="#ccc"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!loading}
                    />
                    
                    <TouchableOpacity 
                        style={[styles.button, styles.buttonPrimary]} 
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text style={[styles.buttonText, styles.buttonPrimaryText]}>
                            {loading ? 'Registrando...' : 'Registrar'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginLink} onPress={handleNavigateToLogin}>
                        <Text style={styles.loginLinkText}>Já tem uma conta? **Faça Login**</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

// Estilos (sem alterações)
const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    titleFuturistic: {
        fontSize: 36,
        fontWeight: '900',
        color: TEXT_COLOR_BASE, 
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
        letterSpacing: 4, 
        marginBottom: 30,
    },
    formContainer: {
        width: '90%',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    input: {
        width: '100%',
        padding: 15,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    button: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        flexDirection: 'row',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonPrimary: {
        backgroundColor: '#8A2BE2',
    },
    buttonPrimaryText: {
        color: '#FFFFFF',
    },
    loginLink: {
        marginTop: 20,
        padding: 10,
    },
    loginLinkText: {
        color: '#FFFFFF',
        fontSize: 16,
    }
});

export default RegistrationScreen;