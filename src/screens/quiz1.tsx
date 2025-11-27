import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    Animated,
    ImageBackground,
    Alert,
    TouchableOpacity // 🚨 Importado para usar botões estilizados no resultado
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // 🚨 Importado para navegação

// ✅ IMPORT CORRETO: Caminho do import corrigido para acessar src/lib/api
import api from '../lib/api';

// Define a interface para as opções
interface OptionType {
    id: string;
    label: string;
    value: string;
}

// Definição dos limites de pontuação
const MIN_SCORE_PASS = 400; // Mínimo para ir ao bar
const HIGH_SCORE_PASS = 700; // Mínimo para ir à balada

// --- CONFIGURAÇÃO DA MISSÃO ---
// ID ÚNICO da missão para o backend (MongoDB)
const MISSAO_ID = 'Missao1_PythonBasics'; 
// 🚨 CORREÇÃO: Pontuação base removida. Pontos serão gerados no random.
const QUIZ_POINTS_PER_QUESTION = 0; 
// Pontuação total máxima possível: 10 * 100 = 1000

// Perguntas do quiz (sem alterações)
const quizQuestions = [
    {
        question: 'Qual função imprime algo na tela em Python?',
        options: [
            { id: '1', label: 'print()', value: 'print' },
            { id: '2', label: 'echo()', value: 'echo' },
            { id: '3', label: 'console.log()', value: 'log' },
            { id: '4', label: 'display()', value: 'display' },
        ],
        correctAnswer: { id: '1', label: 'print()', value: 'print' },
    },
    {
        question: 'Qual operador é usado para potência em Python?',
        options: [
            { id: '1', label: '^', value: '^' },
            { id: '2', label: '**', value: '**' },
            { id: '3', label: 'pow()', value: 'pow' },
            { id: '4', label: '%', value: '%' },
        ],
        correctAnswer: { id: '2', label: '**', value: '**' },
    },
    {
        question: 'Qual destes tipos de dados não existe em Python?',
        options: [
            { id: '1', label: 'int', value: 'int' },
            { id: '2', label: 'float', value: 'float' },
            { id: '3', label: 'char', value: 'char' },
            { id: '4T', label: 'str', value: 'str' },
        ],
        correctAnswer: { id: '3', label: 'char', value: 'char' },
    },
    {
        question: 'Como se cria uma lista vazia em Python?',
        options: [
            { id: '1', label: '[]', value: '[]' },
            { id: '2', label: '{}', value: '{}' },
            { id: '3', label: '()', value: '()' },
            { id: '4', label: 'list()', value: 'list' },
        ],
        correctAnswer: { id: '1', label: '[]', value: '[]' },
    },
    {
        question: 'Qual a sintaxe correta de um comentário em Python?',
        options: [
            { id: '1', label: '// comentário', value: '//' },
            { id: '2', label: '# comentário', value: '#' },
            { id: '3', label: '/* comentário */', value: '/* */' },
            { id: '4', label: '', value: '' },
        ],
        correctAnswer: { id: '2', label: '# comentário', value: '#' },
    },
    {
        question: 'Qual comando converte uma string em inteiro?',
        options: [
            { id: '1', label: 'int()', value: 'int' },
            { id: '2', label: 'str()', value: 'str' },
            { id: '3', label: 'float()', value: 'float' },
            { id: '4', label: 'parseInt()', value: 'parseInt' },
        ],
        correctAnswer: { id: '1', label: 'int()', value: 'int' },
    },
    {
        question: 'Qual função retorna o tamanho de uma lista?',
        options: [
            { id: '1', label: 'length()', value: 'length' },
            { id: '2', label: 'size()', value: 'size' },
            { id: '3', label: 'len()', value: 'len' },
            { id: '4', label: 'count()', value: 'count' },
        ],
        correctAnswer: { id: '3', label: 'len()', value: 'len' },
    },
    {
        question: 'Qual palavra-chave é usada para criar funções?',
        options: [
            { id: '1', label: 'func', value: 'func' },
            { id: '2', label: 'function', value: 'function' },
            { id: '3', label: 'def', value: 'def' },
            { id: '4', label: 'define', value: 'define' },
        ],
        correctAnswer: { id: '3', label: 'def', value: 'def' },
    },
    {
        question: 'Como se inicia um loop for em Python?',
        options: [
            { id: '1', label: 'for i in range(5):', value: 'for' },
            { id: '2', label: 'for(i=0; i<5; i++)', value: 'for_c' },
            { id: '3', label: 'foreach i in range(5)', value: 'foreach' },
            { id: '4', label: 'loop(i=0;i<5;i++)', value: 'loop' },
        ],
        correctAnswer: { id: '1', label: 'for i in range(5):', value: 'for' },
    },
    {
        question: 'Qual operador é usado para igualdade?',
        options: [
            { id: '1', label: '=', value: '=' },
            { id: '2', label: '==', value: '==' },
            { id: '3', label: '===', value: '===' },
            { id: '4', label: '!=', value: '!=' },
        ],
        correctAnswer: { id: '2', label: '==' },
    },
];

// Função para gerar pontuação aleatória entre 90 e 100
const getRandomScore = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 🚨 CORREÇÃO: Mudança do nome da função/componente para PythonQuizScreen
const PythonQuizScreen: React.FC = () => {
    const navigation = useNavigation(); // 🚨 Hook de navegação

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [showResult, setShowResult] = useState(false);
    const [isSavingScore, setIsSavingScore] = useState(false); // ✅ NOVO: Estado para mostrar loading

    // Flag para garantir que a pontuação só seja enviada uma vez
    const scoreSentRef = useRef(false);

    const progress = useRef(new Animated.Value(10)).current;

    // Função para enviar a pontuação ao backend
    const sendScoreToBackend = async (finalScore: number) => {
        // Garante que o envio só ocorra uma vez
        if (scoreSentRef.current || isSavingScore) return;

        scoreSentRef.current = true; 
        setIsSavingScore(true); 

        try {
            // ✅ CORREÇÃO: Chamada protegida para salvar a pontuação
            const response = await api.post('/usuarios/salvar-pontuacao', { 
                nomeMissao: MISSAO_ID, 
                novaPontuacao: finalScore 
            });

            // O backend retorna o mapa de pontuações, mas o Alert pode ser simples
            Alert.alert("Pontuação Salva!", `Sua pontuação de ${finalScore} para ${MISSAO_ID} foi registrada!`);

        } catch (error: any) {
            console.error("Erro ao salvar pontuação:", error);
            const msg = error?.response?.data?.mensagem || "Falha ao conectar e salvar pontuação. (Verifique o JWT_SECRET na Render)";
            Alert.alert("Erro de Pontuação", msg);
        } finally {
            setIsSavingScore(false);
        }
    };


    // Contador regressivo e Lógica de Envio
    useEffect(() => {
        if (showResult) {
            // Envia a pontuação quando o resultado é mostrado
            sendScoreToBackend(score); 
            return;
        }
        if (timeLeft === 0) {
            handleNextQuestion(false);
            return;
        }
        const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, showResult, score]);


    // Barra animada
    useEffect(() => {
        Animated.timing(progress, {
            toValue: timeLeft,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [timeLeft]);

    const handleOptionPress = (option: OptionType) => {
        if (selectedOption) return;
        setSelectedOption(option);

        const correct =
            quizQuestions[currentQuestion].correctAnswer.value === option.value;

        if (correct) {
            // 🚨 CORREÇÃO: Pontuação é agora gerada entre 90 e 100 para manter o máximo em 1000
            const points = getRandomScore(90, 100); 
            setScore((prev) => prev + points);
            setCorrectAnswers((prev) => prev + 1);
        }

        setTimeout(() => handleNextQuestion(), 500);
    };

    const handleNextQuestion = (answeredCorrectly = true) => {
        setSelectedOption(null);
        setTimeLeft(10);

        if (currentQuestion + 1 < quizQuestions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // ✅ QUANDO TERMINA A ÚLTIMA PERGUNTA
            setShowResult(true);
        }
    };

    // --- LÓGICA DE RETRY E VOLTAR ---
    const handleRetry = () => {
        setScore(0);
        setCorrectAnswers(0);
        setCurrentQuestion(0);
        setTimeLeft(10);
        setShowResult(false);
        scoreSentRef.current = false;
        setIsSavingScore(false);
    };

    // Volta para a tela de Missões (Hub)
    const handleBackToMissions = () => {
        navigation.navigate('Mission1' as any); // 'Mission1' é o Hub
    }

    // Função para ir ao Bar com Lexi
    const handleGoToBar = () => {
        navigation.navigate('BarScreen' as any);
    }

    // Função para ir à Balada com Lexi
    const handleGoToClub = () => {
        navigation.navigate('ClubScreen' as any);
    }

    const progressWidth = progress.interpolate({
        inputRange: [0, 10],
        outputRange: ['0%', '100%'],
    });

    // Determina o texto de sucesso/falha
    const getResultTitle = () => {
        if (score >= HIGH_SCORE_PASS) {
            return `Nível Hacker (Score: ${score})`;
        } else if (score >= MIN_SCORE_PASS) {
            return `Nível Coder (Score: ${score})`;
        } else {
            return `Nível Novato (Score: ${score})`;
        }
    };


    const renderResultButtons = () => {
        const passed = score >= MIN_SCORE_PASS;

        return (
            <View style={styles.buttonGroup}>
                {/* 1. OPÇÃO: REFAZER (Se não atingiu o mínimo) */}
                {!passed && (
                    <TouchableOpacity style={styles.resultButtonRed} onPress={handleRetry} disabled={isSavingScore}>
                        <Text style={styles.buttonText}>Refazer Missão</Text>
                    </TouchableOpacity>
                )}

                {/* 2. OPÇÃO: BALADA (Se atingiu pontuação alta) */}
                {score >= HIGH_SCORE_PASS && (
                    <TouchableOpacity style={styles.resultButtonPurple} onPress={handleGoToClub} disabled={isSavingScore}>
                        <Text style={styles.buttonText}>Balada com Lexi (VIP)</Text>
                    </TouchableOpacity>
                )}

                {/* 3. OPÇÃO: BAR (Se passou, mas não foi VIP) */}
                {(score >= MIN_SCORE_PASS && score < HIGH_SCORE_PASS) && (
                    <TouchableOpacity style={styles.resultButtonCyan} onPress={handleGoToBar} disabled={isSavingScore}>
                        <Text style={styles.buttonText}>Bar com Lexi</Text>
                    </TouchableOpacity>
                )}

                {/* 4. OPÇÃO: VOLTAR (Sempre disponível, como botão de escape) */}
                <TouchableOpacity style={styles.resultButtonGray} onPress={handleBackToMissions} disabled={isSavingScore}>
                    <Text style={styles.buttonText}>
                        {isSavingScore ? 'Salvando Pontuação...' : 'Voltar às Missões'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }


    return (
        <ImageBackground
            source={require('../../assets/neonm1.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            {!showResult ? (
                <View style={styles.quizContainer}>
                    <Text style={styles.questionText}>
                        {quizQuestions[currentQuestion].question}
                    </Text>
                    {quizQuestions[currentQuestion].options.map((option) => (
                        <Pressable
                            key={option.id}
                            style={[
                                styles.optionButton,
                                selectedOption?.id === option.id && {
                                    backgroundColor: '#ffb3e6',
                                },
                            ]}
                            onPress={() => handleOptionPress(option)}
                        >
                            <Text style={styles.optionText}>{option.label}</Text>
                        </Pressable>
                    ))}

                    <View style={styles.progressBar}>
                        <Animated.View
                            style={[styles.progressFill, { width: progressWidth }]}
                        />
                    </View>

                    <Text style={styles.timerText}>Tempo: {timeLeft}s</Text>
                </View>
            ) : (
                // --- TELA DE RESULTADO FINAL ---
                <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>{getResultTitle()}</Text>
                    <Text style={styles.resultCountText}>
                        {`Você acertou ${correctAnswers} de ${quizQuestions.length} perguntas.`}
                    </Text>
                    <Text style={styles.resultMessage}>
                        {score >= HIGH_SCORE_PASS
                            ? "Sua performance garantiu o acesso VIP na rede. Lexi está impressionada."
                            : score >= MIN_SCORE_PASS
                                ? "Você passou no teste e Lexi te convidou para beber algo."
                                : "A segurança da rede te bloqueou. Tente novamente."}
                    </Text>

                    {renderResultButtons()}
                </View>
            )}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Estilos do Quiz Container
    quizContainer: {
        width: '90%',
        padding: 20,
        borderRadius: 25,
        backgroundColor: '#ff5ec9', // Quadrado rosa
        alignItems: 'center',
        shadowColor: '#ff00ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
    // Estilos do Resultado Container
    resultContainer: {
        width: '90%',
        padding: 30,
        borderRadius: 25,
        backgroundColor: '#000033', // Fundo escuro para contraste
        alignItems: 'center',
        borderColor: '#00FFFF',
        borderWidth: 2,
        shadowColor: '#00FFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
    questionText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    optionButton: {
        width: '100%',
        padding: 15,
        backgroundColor: '#ff87d1',
        borderRadius: 15,
        marginBottom: 10,
        alignItems: 'center',
    },
    optionText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    progressBar: {
        width: '100%',
        height: 10,
        backgroundColor: '#ffb3e6',
        borderRadius: 5,
        marginTop: 15,
    },
    progressFill: {
        height: 10,
        backgroundColor: '#ff00ff',
        borderRadius: 5,
    },
    timerText: {
        marginTop: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    // Estilos da Tela de Resultado
    resultTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#00FFFF', // Ciano Neon
        textAlign: 'center',
        textShadowColor: 'rgba(0, 255, 255, 0.9)',
        textShadowRadius: 10,
        marginBottom: 10,
    },
    resultMessage: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        marginVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
        paddingBottom: 20,
    },
    resultCountText: {
        fontSize: 18,
        color: '#FF00FF', // Rosa Neon
        textAlign: 'center',
        fontWeight: 'bold',
    },
    // Estilos para o Grupo de Botões
    buttonGroup: {
        width: '100%',
        marginTop: 30,
        gap: 15, // Espaço entre os botões
    },
    resultButtonRed: {
        paddingVertical: 15,
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        borderColor: '#FF0000',
        borderWidth: 2,
        borderRadius: 15,
        alignItems: 'center',
    },
    resultButtonCyan: {
        paddingVertical: 15,
        backgroundColor: 'rgba(0, 255, 255, 0.1)',
        borderColor: '#00FFFF',
        borderWidth: 2,
        borderRadius: 15,
        alignItems: 'center',
    },
    resultButtonPurple: {
        paddingVertical: 15,
        backgroundColor: 'rgba(128, 0, 128, 0.2)',
        borderColor: '#FF00FF',
        borderWidth: 2,
        borderRadius: 15,
        alignItems: 'center',
    },
    resultButtonGray: {
        paddingVertical: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: '#AAAAAA',
        borderWidth: 2,
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
        textShadowColor: '#000000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    }
});

export default PythonQuizScreen;