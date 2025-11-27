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
import { useNavigation } from '@react-navigation/native';
// ✅ IMPORT CORRETO: Importa a instância do Axios
import api from '../lib/api';

// ❌ REMOVIDO: A constante API_BASE_URL (agora configurada em src/lib/api.ts)
// const API_BASE_URL = 'http://192.168.0.39:3000'; 

const TEXT_COLOR_BASE = '#00FFFF';
const GLOW_COLOR_ON = 'rgba(0, 255, 255, 1.0)';
const GLOW_COLOR_OFF = 'rgba(0, 255, 255, 0.2)';

const RegistrationScreen = () => {
    const navigation = useNavigation();
    const [currentGlowColor, setCurrentGlowColor] = useState(GLOW_COLOR_ON);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Efeito de brilho
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentGlowColor(prev =>
                // ✅ CORREÇÃO AQUI: GLOW_COLOR_ON em vez de GLOL_COLOR_ON
                prev === GLOW_COLOR_ON ? GLOW_COLOR_OFF : GLOW_COLOR_ON
            );
        }, 400);
        return () => clearInterval(interval);
    }, []);

    // Lógica de Registro usando AXIOS
    const handleRegister = async () => {
        if (loading) return;
        if (!name || !email || !password) {
            Alert.alert("Erro", "Todos os campos são obrigatórios.");
            return;
        }
        setLoading(true);

        try {
            // ✅ Chamada usando api.post (Axios)
            await api.post('/usuarios/registrar', {
                nome: name,
                email,
                senha: password
            });

            // SUCESSO
            Alert.alert("Sucesso!", "Registro realizado com sucesso! Faça login.");
            navigation.navigate('Login');

        } catch (err: any) {
            // Trata erros de resposta HTTP (4xx/5xx) ou erros de rede/timeout
            const msg = err?.response?.data?.mensagem ||
                err?.message ||
                "Falha na conexão ou Timeout. Verifique a API e o Firewall.";

            Alert.alert("Falha no Registro", msg);
            console.error("Erro de Registro (Axios):", err);

        } finally {
            // Garante que o estado de loading sempre volte para falso
            setLoading(false);
        }
    };

    const handleNavigateToLogin = () => {
        navigation.navigate('Login');
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
                        <Text style={styles.loginLinkText}>
                            Já tem uma conta?
                            <Text style={{ fontWeight: 'bold' }}> Faça Login</Text>
                        </Text>
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