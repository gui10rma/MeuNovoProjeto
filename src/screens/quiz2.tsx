import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    Animated,
    ImageBackground,
    Alert,
    TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// NOTA: Você precisará garantir que esta biblioteca de API está acessível/importável.
// Se não tiver um arquivo 'api.js' ou 'lib/api.js', esta linha pode causar erro.
// Assumindo um mock simples para fins de demonstração.
const api = {
    post: async (endpoint, data) => {
        console.log(`Mock API POST: ${endpoint}`, data);
        // Simulação de delay da rede
        await new Promise(resolve => setTimeout(resolve, 500)); 
        // Simulação de sucesso
        return { data: { mensagem: "Mock pontuação salva!" } };
    }
};

interface OptionType {
    id: string;
    label: string;
    value: string;
}

// 🚨 CORREÇÃO: Limites de pontuação para as duas recompensas
const MIN_SCORE_PASS = 400; // Mínimo para ir à Floresta (Coder)
const HIGH_SCORE_PASS = 800; // Mínimo para ir à Lagoa (Hacker)

// --- CONFIGURAÇÃO DA MISSÃO ---
const MISSAO_ID = 'Missao2_Condicionais'; 
const QUIZ_POINTS_PER_QUESTION = 0; // Removido, pontuação é randômica
const BACKGROUND_IMAGE = require('../../assets/buraconegro.jpg'); 

const quizQuestions = [
    {
        question: 'Qual é o operador de "igual a" em Python, usado em condicionais?',
        options: [
            { id: '1', label: '=', value: 'eq' },
            { id: '2', label: '==', value: 'double_eq' },
            { id: '3', label: '!=', value: 'not_eq' },
            { id: '4', label: '===', value: 'triple_eq' },
        ],
        correctAnswer: { id: '2', label: '==', value: 'double_eq' },
    },
    {
        question: 'Qual palavra-chave é usada para adicionar uma condição alternativa após um "if" em Python?',
        options: [
            { id: '1', label: 'else if', value: 'else_if' },
            { id: '2', label: 'elif', value: 'elif' },
            { id: '3', label: 'otherwise', value: 'otherwise' },
            { id: '4', label: 'then', value: 'then' },
        ],
        correctAnswer: { id: '2', label: 'elif', value: 'elif' },
    },
    {
        question: 'O que o operador lógico "not" faz em uma condição?',
        options: [
            { id: '1', label: 'Inverte o valor booleano (True torna-se False).', value: 'invert' },
            { id: '2', label: 'Combina duas condições.', value: 'combine' },
            { id: '3', label: 'Verifica se o valor é nulo.', value: 'null' },
            { id: '4', label: 'Cria uma exceção.', value: 'exception' },
        ],
        correctAnswer: { id: '1', label: 'Inverte o valor booleano (True torna-se False).', value: 'invert' },
    },
    {
        question: 'Em qual caso a seguinte condição é True: `(4 > 3) and (2 < 1)`?',
        options: [
            { id: '1', label: 'Apenas quando a primeira é True.', value: 'first' },
            { id: '2', label: 'Apenas quando a segunda é True.', value: 'second' },
            { id: '3', label: 'Sempre é True.', value: 'always' },
            { id: '4', label: 'Nunca é True.', value: 'never' },
        ],
        correctAnswer: { id: '4', label: 'Nunca é True.', value: 'never' },
    },
    {
        question: 'Qual operador verifica se dois valores são diferentes?',
        options: [
            { id: '1', label: '<>', value: 'old_diff' },
            { id: '2', label: '!=', value: 'diff' },
            { id: '3', label: '=!', value: 'invalid' },
            { id: '4', label: 'or', value: 'or' },
        ],
        correctAnswer: { id: '2', label: '!=', value: 'diff' },
    },
    {
        question: 'Qual será a saída do código:\n`x = 10\nif x > 15:\n   print("A")\nelse:\n   print("B")`',
        options: [
            { id: '1', label: 'A', value: 'A' },
            { id: '2', label: 'B', value: 'B' },
            { id: '3', label: 'Nada', value: 'nothing' },
            { id: '4', label: 'Erro', value: 'error' },
        ],
        correctAnswer: { id: '2', label: 'B', value: 'B' },
    },
    {
        question: 'Em Python, o que acontece se a condição `if` for True e o `elif` seguinte também for True?',
        options: [
            { id: '1', label: 'Apenas o bloco `if` executa.', value: 'if_only' },
            { id: '2', label: 'Ambos os blocos `if` e `elif` executam.', value: 'both' },
            { id: '3', label: 'Apenas o bloco `elif` executa.', value: 'elif_only' },
            { id: '4', label: 'O programa trava.', value: 'crash' },
        ],
        correctAnswer: { id: '1', label: 'Apenas o bloco `if` executa.', value: 'if_only' },
    },
    {
        question: 'Qual operador lógico exige que APENAS UMA das condições seja True para ser True?',
        options: [
            { id: '1', label: 'and', value: 'and' },
            { id: '2', label: 'xor', value: 'xor' },
            { id: '3', label: 'or', value: 'or' },
            { id: '4', label: 'not', value: 'not' },
        ],
        correctAnswer: { id: '3', label: 'or', value: 'or' },
    },
    {
        question: 'Qual dos valores abaixo é considerado Falso (False) em Python?',
        options: [
            { id: '1', label: 'A string "False"', value: 'str_false' },
            { id: '2', label: 'O número 1', value: 'one' },
            { id: '3', label: 'A lista vazia []', value: 'empty_list' },
            { id: '4', label: 'A string "0"', value: 'str_zero' },
        ],
        correctAnswer: { id: '3', label: 'A lista vazia []', value: 'empty_list' },
    },
    {
        question: 'Qual operador verifica se o valor da esquerda é menor ou igual ao da direita?',
        options: [
            { id: '1', label: '=<', value: 'invalid_op' },
            { id: '2', label: '>=', value: 'greater_eq' },
            { id: '3', label: '<=', value: 'less_eq' },
            { id: '4', label: '=>', value: 'another_invalid' },
        ],
        correctAnswer: { id: '3', label: '<=', value: 'less_eq' },
    },
];


const getRandomScore = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ✅ NOVO NOME DO COMPONENTE: QuizCondicionaisScreen
const QuizCondicionaisScreen: React.FC = () => {
    const navigation = useNavigation();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [showResult, setShowResult] = useState(false);
    const [isSavingScore, setIsSavingScore] = useState(false); 

    const scoreSentRef = useRef(false);

    const progress = useRef(new Animated.Value(10)).current;

    const sendScoreToBackend = async (finalScore: number) => {
        if (scoreSentRef.current || isSavingScore) return;

        scoreSentRef.current = true; 
        setIsSavingScore(true); 

        try {
            await api.post('/usuarios/salvar-pontuacao', { 
                nomeMissao: MISSAO_ID, 
                novaPontuacao: finalScore 
            });

            Alert.alert("Pontuação Salva!", `Sua pontuação de ${finalScore} para ${MISSAO_ID} foi registrada!`);

        } catch (error: any) {
            console.error("Erro ao salvar pontuação:", error);
            const msg = error?.response?.data?.mensagem || "Falha ao conectar e salvar pontuação. (Verifique o JWT_SECRET na Render)";
            Alert.alert("Erro de Pontuação", msg);
        } finally {
            setIsSavingScore(false);
        }
    };


    useEffect(() => {
        if (showResult) {
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
            setShowResult(true);
        }
    };

    const handleRetry = () => {
        setScore(0);
        setCorrectAnswers(0);
        setCurrentQuestion(0);
        setTimeLeft(10);
        setShowResult(false);
        scoreSentRef.current = false;
        setIsSavingScore(false);
    };

    const handleBackToMissions = () => {
        navigation.navigate('Mission1' as any);
    }

    // 🚨 NOVAS FUNÇÕES DE NAVEGAÇÃO
    const handleGoToFloresta = () => {
        navigation.navigate('FlorestaMeditar' as any); // Rota a ser criada no App.tsx
    }
    const handleGoToLagoa = () => {
        navigation.navigate('LagoaRelaxar' as any); // Rota a ser criada no App.tsx
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
        const passedCoder = score >= MIN_SCORE_PASS;
        const passedHacker = score >= HIGH_SCORE_PASS;

        return (
            <View style={styles.buttonGroup}>
                {/* 1. OPÇÃO: REFAZER (Se não atingiu o mínimo de 400) */}
                {!passedCoder && (
                    <TouchableOpacity style={styles.resultButtonRed} onPress={handleRetry} disabled={isSavingScore}>
                        <Text style={styles.buttonText}>Refazer Missão</Text>
                    </TouchableOpacity>
                )}

                {/* 2. OPÇÃO: LAGOA (Se atingiu pontuação alta/Hacker >= 800) */}
                {passedHacker && (
                    <TouchableOpacity style={styles.resultButtonCyan} onPress={handleGoToLagoa} disabled={isSavingScore}>
                        <Text style={styles.buttonText}>Lagoa com Lexi (Relaxar)</Text>
                    </TouchableOpacity>
                )}

                {/* 3. OPÇÃO: FLORESTA (Se passou, mas não atingiu o Hacker 400 <= score < 800) */}
                {(passedCoder && !passedHacker) && (
                    <TouchableOpacity style={styles.resultButtonPurple} onPress={handleGoToFloresta} disabled={isSavingScore}>
                        <Text style={styles.buttonText}>Floresta com Lexi (Meditação)</Text>
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
            source={BACKGROUND_IMAGE}
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
                            ? "Sua performance garantiu um momento relaxante na Lagoa."
                            : score >= MIN_SCORE_PASS
                                ? "Você passou no teste. Lexi sugere uma pausa tranquila na Floresta."
                                : "A segurança da rede te bloqueou. Tente novamente."}
                    </Text>

                    {renderResultButtons()}
                </View>
            )}
        </ImageBackground>
    );
};

// Exportação padrão para uso no App.tsx
export default QuizCondicionaisScreen;

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
        // Cor do quiz para vermelho/roxo escuro (tema Condicionais)
        backgroundColor: 'rgba(70, 0, 0, 0.9)', 
        alignItems: 'center',
        shadowColor: '#FF0000',
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
        borderColor: '#FF0000', // Borda vermelha
        borderWidth: 2,
        shadowColor: '#FF0000',
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
        textAlign: 'center', // ✅ JÁ ESTAVA CENTRALIZADO
    },
    optionButton: {
        width: '100%',
        padding: 15,
        backgroundColor: 'rgba(255, 0, 0, 0.2)', // Botão com fundo vermelho transparente
        borderColor: '#FF0000',
        borderWidth: 1,
        borderRadius: 15,
        marginBottom: 10,
        alignItems: 'center',
    },
    optionText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center', // 🎯 NOVO: Centraliza o texto da opção
    },
    progressBar: {
        width: '100%',
        height: 10,
        backgroundColor: '#440000', // Fundo escuro da barra
        borderRadius: 5,
        marginTop: 15,
    },
    progressFill: {
        height: 10,
        backgroundColor: '#FF0000', // Preenchimento vermelho
        borderRadius: 5,
    },
    timerText: {
        marginTop: 10,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center', // 🎯 NOVO: Centraliza o timer
    },
    // Estilos da Tela de Resultado
    resultTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FF0000', // Título vermelho
        textAlign: 'center', // ✅ JÁ ESTAVA CENTRALIZADO
        textShadowColor: 'rgba(255, 0, 0, 0.9)',
        textShadowRadius: 10,
        marginBottom: 10,
    },
    resultMessage: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center', // ✅ JÁ ESTAVA CENTRALIZADO
        marginVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
        paddingBottom: 20,
    },
    resultCountText: {
        fontSize: 18,
        color: '#00FFFF', // Ciano Neon para destaque
        textAlign: 'center', // ✅ JÁ ESTAVA CENTRALIZADO
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
    // Botão Lagoa (Cyan) - HIGH SCORE
    resultButtonCyan: {
        paddingVertical: 15,
        backgroundColor: 'rgba(0, 255, 255, 0.1)',
        borderColor: '#00FFFF',
        borderWidth: 2,
        borderRadius: 15,
        alignItems: 'center',
    },
    // Botão Floresta (Purple/Magenta) - MID SCORE
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
        textAlign: 'center', // 🎯 NOVO: Centraliza o texto dos botões de resultado
    }
});