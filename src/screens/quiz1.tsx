import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Animated,
  ImageBackground,
} from 'react-native';

// Define a interface para as opções
interface OptionType {
  id: string;
  label: string;
  value: string;
}

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
    correctAnswer: { id: '2', label: '==', value: '==' },
  },
];

// --- NOVA FUNÇÃO ---
// Função para gerar pontuação aleatória entre 50 e 100
const getRandomScore = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const QuizScreen: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [score, setScore] = useState(0); // Agora armazena os PONTOS
  const [correctAnswers, setCorrectAnswers] = useState(0); // --- NOVO ESTADO --- (para CONTAGEM de acertos)
  const [timeLeft, setTimeLeft] = useState(10);
  const [showResult, setShowResult] = useState(false);

  const progress = useRef(new Animated.Value(10)).current;

  // Contador regressivo
  useEffect(() => {
    if (showResult) return;
    if (timeLeft === 0) {
      handleNextQuestion(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, showResult]);

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
    
    // --- LÓGICA DE PONTUAÇÃO ATUALIZADA ---
    if (correct) {
      const points = getRandomScore(50, 100); // Gera pontos aleatórios
      setScore((prev) => prev + points); // Adiciona os pontos
      setCorrectAnswers((prev) => prev + 1); // Incrementa a CONTAGEM de acertos
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

  // --- ATUALIZADO ---
  const handleRetry = () => {
    setScore(0);
    setCorrectAnswers(0); // Reseta a contagem de acertos
    setCurrentQuestion(0);
    setTimeLeft(10);
    setShowResult(false);
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 10],
    outputRange: ['0%', '100%'],
  });

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
        // --- TELA DE RESULTADO ATUALIZADA ---
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {correctAnswers >= 8 // Usa a CONTAGEM para a lógica
              ? `Parabéns! Você fez ${score} pontos!` // Mostra os PONTOS
              : `Você fez ${score} pontos. Tente novamente!`}
          </Text>
          
          {/* Texto adicional para mostrar a contagem */}
          <Text style={styles.resultCountText}>
            {`Você acertou ${correctAnswers} de ${quizQuestions.length} perguntas.`}
          </Text>

          {correctAnswers < 8 && ( // Lógica de "tentar novamente" baseada na CONTAGEM
            <Pressable style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryText}>Tentar Novamente</Text>
            </Pressable>
          )}
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
  resultContainer: {
    width: '90%',
    padding: 30,
    borderRadius: 25,
    backgroundColor: '#ff5ec9',
    alignItems: 'center',
    shadowColor: '#ff00ff',
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
  retryButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ff87d1', // Mudei a cor para destacar
    borderRadius: 15,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  // --- NOVO ESTILO ---
  resultCountText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default QuizScreen;