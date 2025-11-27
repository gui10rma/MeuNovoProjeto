import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
    Platform,
    TextInput,
    KeyboardAvoidingView,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// ✅ IMPORT CORRETO: Importa a instância do Axios E a função de salvar/configurar o token
import api, { setAuthToken } from '../lib/api'; 


const APP_NAME = "A Ascensão do Coder";
const TEXT_COLOR_BASE = '#000033';
const GLOW_COLOR_ON = 'rgba(0, 255, 255, 1.0)';
const GLOW_COLOR_OFF = 'rgba(0, 255, 255, 0.0)';

// O componente agora não recebe props de navegação
const LoginScreen = () => {
    // Inicializa o hook de navegação
    const navigation = useNavigation();

    // Estados para o brilho, inputs e loading
    const [currentGlowColor, setCurrentGlowColor] = useState(GLOW_COLOR_ON);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Efeito de brilho pulsante
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentGlowColor(prev =>
                prev === GLOW_COLOR_ON ? GLOW_COLOR_OFF : GLOW_COLOR_ON
            );
        }, 400);
        return () => clearInterval(interval);
    }, []);

    // Lógica de Login e integração com a API usando AXIOS
    const handleLogin = async () => {
        if (loading) return;
        if (!email || !password) {
            Alert.alert("Erro", "Email e senha são obrigatórios.");
            return;
        }
        setLoading(true);

        try {
            // ✅ Chamada usando api.post (Axios) para o endpoint de login
            const response = await api.post('/usuarios/login', {
                email, 
                senha: password
            });

            // O token está em response.data.token (enviado pelo seu backend Node.js)
            const token = response.data?.token;

            if (!token) throw new Error("Token de autenticação não recebido.");

            // 🚀 Ação Crítica: Salva o token de forma persistente (AsyncStorage) 
            // e configura o header 'Authorization' para requisições futuras.
            await setAuthToken(token); 

            // SUCESSO!
            Alert.alert("Login com Sucesso!", "Bem-vindo de volta, Coder!");

            // NAVEGAÇÃO: Envia o usuário para a próxima tela protegida
            navigation.navigate('Cap1_1');

        } catch (err: any) {
             // Trata erros de resposta HTTP (4xx/5xx) ou erros de rede/timeout (30s)
             const msg = err?.response?.data?.mensagem || 
                         err?.message || 
                         "Falha na conexão ou Timeout. Verifique a API e o Firewall.";
            
            Alert.alert("Falha no Login", msg);
            console.error("Erro de Login (Axios):", err);

        } finally {
            setLoading(false);
        }
    };

    // Lógica de Navegação para Registro
    const handleSignUp = () => {
        // NAVEGAÇÃO: usa o objeto navigation
        navigation.navigate('Register');
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
                    {APP_NAME}
                </Text>

                <View style={styles.formContainer}>
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
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={[styles.buttonText, styles.buttonPrimaryText]}>
                            {loading ? 'Entrando...' : 'Login'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.buttonSecondary]}
                        onPress={handleSignUp} // Chama a navegação
                        disabled={loading}
                    >
                        <Text style={[styles.buttonText, styles.buttonSecondaryText]}>Cadastre-se</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

// Estilos
const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    titleFuturistic: {
        fontSize: 50,
        fontWeight: '900',
        color: TEXT_COLOR_BASE,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
        letterSpacing: 4,
        lineHeight: 45,
        marginBottom: 40,
    },
    formContainer: {
        width: '90%',
        alignItems: 'center',
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
    buttonSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    buttonSecondaryText: {
        color: '#FFFFFF',
    },
});

export default LoginScreen;