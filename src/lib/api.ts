import axios from 'axios';
// ✅ IMPORT CORRETO: Volta para a importação padrão, que funciona na maioria dos casos.
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// ✅ URL PÚBLICA: Usando o endereço do seu serviço na Render.
const API_BASE_URL = 'https://api-coder-scli.onrender.com'; 

const api = axios.create({
    baseURL: API_BASE_URL,
    // O timeout de 30 segundos acomoda o tempo de 'wake up' da Render.
    timeout: 30000, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Chave para armazenar o token
const AUTH_TOKEN_KEY = '@app_auth_token'; 

/**
 * 1. Salva o token no AsyncStorage.
 * 2. Define o header Authorization para todas as requisições futuras do Axios.
 */
export const setAuthToken = async (token: string | null) => {
    if (token) {
        // ✅ As funções são chamadas diretamente do objeto AsyncStorage
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token); 
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY); 
        delete api.defaults.headers.common['Authorization'];
    }
};

/**
 * Tenta carregar o token do AsyncStorage e configurar o Axios.
 */
export const loadAuthToken = async () => {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return token;
    }
    return null;
};

export default api;