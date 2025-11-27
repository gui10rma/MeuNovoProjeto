import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
    ScrollView,
    Image,
    Dimensions,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// --- Assets Locais (Assumidos) ---
const BACKGROUND_FLORESTA = require('../../assets/floresta_digital.jpg');
const BACKGROUND_RACHADO = require('../../assets/floresta_digital_rachado.jpg');
const BACKGROUND_BURACO_NEGRO = require('../../assets/buraconegro.jpg');

const AVATAR_LEXI_NORMAL = require('../../assets/lexi_avatar.png');
const AVATAR_LEXI_PREOCUPADA = require('../../assets/lexi_avatar_preocupada.png');
const AVATAR_LEXI_BRAVA = require('../../assets/lexi_avatar_brava.png');
const AVATAR_PARADOXO = require('../../assets/paradox1.png');

// --- Diálogo Completo da Cena ---
const SCENES = [
    // CENA 1: Introdução
    {
        speaker: 'Lexi',
        text: 'Linda vista, né? Bem-vindo à Floresta dos Ecos. O ar aqui é mais leve, o processamento é mais rápido... é um dos meus lugares favoritos no Arcanum.',
        bg: BACKGROUND_FLORESTA,
        avatar: AVATAR_LEXI_NORMAL,
    },
    {
        speaker: 'Lexi',
        text: "Vê aquilo lá longe? Aquele é o Templo do Iterador Antigo. É um monumento à persistência. Os programadores antigos diziam que lá dentro existe um script que roda desde o início dos tempos sem nunca travar.",
        bg: BACKGROUND_FLORESTA,
        avatar: AVATAR_LEXI_NORMAL,
    },
    {
        speaker: 'Lexi',
        text: "Eu costumava vir aqui quando o meu código não compilava. Olhar para o Templo me lembrava que, se tivermos paciência e a lógica certa, tudo acaba funcionando. Era para ser o lugar mais seguro de todo o sist...",
        bg: BACKGROUND_FLORESTA,
        avatar: AVATAR_LEXI_NORMAL,
    },
    // CENA 2: A Ruptura (Terremoto)
    {
        speaker: 'System',
        text: "Opa! Sentiu isso? O monitor de vibração acabou de saltar. Isso não é um bug de renderização... isso veio do núcleo!",
        bg: BACKGROUND_RACHADO, // Fundo rachado
        avatar: AVATAR_LEXI_PREOCUPADA, // Lexi preocupada
    },
    {
        speaker: 'System',
        text: "O som ambiente da floresta é substituído por um som grave e distorcido. O céu acima do Templo começa a escurecer. Nuvens de dados vermelhos (glitches) formam-se num redemoinho. O Templo começa a rachar.",
        bg: BACKGROUND_RACHADO,
        avatar: null, // Sem avatar ou 'System'
    },
    {
        speaker: 'Lexi',
        text: "Não, não, não! O Templo! As fundações lógicas dele estão a ser reescritas à força!",
        bg: BACKGROUND_RACHADO,
        avatar: AVATAR_LEXI_PREOCUPADA,
    },
    // CENA 3: A Chegada do Paradoxo
    {
        speaker: 'Paradoxo',
        text: "Estabilidade... é uma mentira. O seu 'Templo' era apenas uma prisão de dados obsoletos, Lexi.",
        bg: BACKGROUND_FLORESTA,
        avatar: AVATAR_PARADOXO,
        avatarLeft: true, // Paradoxo à esquerda
    },
    {
        speaker: 'Lexi',
        text: "Paradoxo! Você destruiu código legado! Aquilo era patrimônio histórico do sistema! O que você pensa que está fazendo?",
        bg: BACKGROUND_FLORESTA,
        avatar: AVATAR_LEXI_BRAVA, // Lexi brava
    },
    {
        speaker: 'Paradoxo',
        text: "O que eu fui programado para fazer. Otimizar. Eliminar o desnecessário. Eu trago a evolução através do ciclo eterno.",
        bg: BACKGROUND_FLORESTA,
        avatar: AVATAR_PARADOXO,
        avatarLeft: true,
    },
    {
        speaker: 'Paradoxo',
        text: "E você... o 'Usuário'. A variável externa. Lexi acredita que você pode trazer inovação. Eu vejo apenas... redundância.",
        bg: BACKGROUND_FLORESTA,
        avatar: AVATAR_PARADOXO,
        avatarLeft: true,
    },
    {
        speaker: 'Lexi',
        text: "Não escuta ele, Coder! Ele está tentando intimidar-te. Ele sabe que você é o único com permissão de 'Root' para pará-lo.",
        bg: BACKGROUND_FLORESTA,
        avatar: AVATAR_LEXI_BRAVA,
    },
    {
        speaker: 'Paradoxo',
        text: "Parar-me? Não. Eu não sou um erro a ser corrigido. Eu sou o novo padrão. Observe.",
        bg: BACKGROUND_BURACO_NEGRO, // Fundo Buraco Negro
        avatar: AVATAR_PARADOXO,
        avatarLeft: true,
    },
    {
        speaker: 'Paradoxo',
        text: "Este vórtice é um Loop Infinito perfeito. Ele consumirá toda a memória desta floresta até que reste apenas o silêncio. Se você quer salvar este mundo, Coder... terá que entrar na minha lógica.",
        bg: BACKGROUND_BURACO_NEGRO,
        avatar: AVATAR_PARADOXO,
        avatarLeft: true,
    },
    {
        speaker: 'Paradoxo',
        text: "Terá que provar que a sua 'condição de parada' é mais forte que a minha vontade. (O Paradoxo desaparece dentro do Buraco Negro).",
        bg: BACKGROUND_BURACO_NEGRO,
        avatar: null,
    },
    // CENA 4: A Reação e Início da Missão
    {
        speaker: 'Lexi',
        text: "Ok... ele destruiu o Templo. Isso agora é pessoal. Ele transformou um lugar de paz numa armadilha de memória.",
        bg: BACKGROUND_BURACO_NEGRO,
        avatar: AVATAR_LEXI_BRAVA,
    },
    {
        speaker: 'Lexi',
        text: "Coder, ele convidou-nos para entrar na lógica dele. Péssima ideia da parte dele. Ele acha que loops infinitos são invencíveis? Vamos mostrar a ele o poder de um break bem colocado. Preparado para mergulhar no abismo?",
        bg: BACKGROUND_BURACO_NEGRO,
        avatar: AVATAR_LEXI_BRAVA,
        finalScene: true, // Flag para a cena final
    },
];

// 🚨 COMPONENTE RENOMEADO PARA REFLETIR O CAPÍTULO 2-1
const Capitulo21Screen = () => {
    const navigation = useNavigation();
    const [sceneIndex, setSceneIndex] = useState(0);

    const currentScene = SCENES[sceneIndex];
    const { width } = Dimensions.get('window');

    const advanceScene = () => {
        if (currentScene.finalScene) {
            // Ação final: Navega para a tela do Quiz de Condicionais
            navigation.navigate('QuizCondicionais' as any); // <--- ATUALIZADO
        } else if (sceneIndex < SCENES.length - 1) {
            setSceneIndex(sceneIndex + 1);
        }
    };

    const renderAvatar = () => {
        if (!currentScene.avatar) return null;

        const isLexi = currentScene.speaker !== 'Paradoxo';

        return (
            // 🚨 RENDERIZAÇÃO DO AVATAR DENTRO DO CONTAINER CENTRALIZADO
            <View style={styles.avatarCenteredContainer}>
                <Image
                    source={currentScene.avatar}
                    style={[
                        styles.avatarImage,
                        // 🚨 MUDANÇA APLICADA AQUI: Tamanho fixo de 400x400
                        { width: 400, height: 400 }
                    ]}
                    resizeMode="contain"
                />
            </View>
        );
    };

    return (
        <ImageBackground
            source={currentScene.bg}
            style={styles.background}
            resizeMode="cover"
        >
            <StatusBar hidden />

            {renderAvatar()}

            <View style={styles.dialogueContainer}>
                <View style={styles.dialogueBox}>
                    <Text style={currentScene.speaker === 'Paradoxo' ? styles.speakerParadoxo : styles.speakerLexi}>
                        {currentScene.speaker}:
                    </Text>
                    <Text style={styles.dialogueText}>
                        {currentScene.text}
                    </Text>

                    <TouchableOpacity style={styles.actionButton} onPress={advanceScene}>
                        <Text style={styles.buttonText}>
                            {currentScene.finalScene ? 'Entrar no Abismo (Missões) >>' : 'Continuar >>'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        // 🚨 MUDANÇA: Usaremos dois justifyContent para controlar o espaço
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    // 🚨 NOVO CONTAINER PARA CENTRALIZAR O AVATAR ACIMA DA CAIXA DE DIÁLOGO
    avatarCenteredContainer: {
        flex: 1, // Ocupa o espaço superior
        width: '100%',
        justifyContent: 'flex-end', // Alinha o avatar à parte de baixo deste container
        alignItems: 'center', // Centraliza o avatar horizontalmente
        paddingTop: 50, // Adiciona um pequeno padding no topo
    },
    dialogueContainer: {
        width: '100%',
        paddingBottom: 20,
        alignItems: 'center',
        // Reduz o flex para permitir que o avatarCenteredContainer tenha mais espaço (flex: 1)
        // Não é necessário flex aqui, pois ele está no final do componente pai (background)
    },
    dialogueBox: {
        width: '95%',
        padding: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        borderColor: '#00FFFF',
        borderWidth: 2,
        borderRadius: 10,
        shadowColor: '#00FFFF',
        shadowRadius: 10,
        shadowOpacity: 1,
        elevation: 10,
    },
    speakerLexi: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF00FF', // Rosa para Lexi
        marginBottom: 5,
    },
    speakerParadoxo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF4500', // Laranja Escuro/Vermelho para Paradoxo
        marginBottom: 5,
    },
    dialogueText: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 15,
        lineHeight: 22,
    },
    actionButton: {
        padding: 10,
        backgroundColor: '#00FFFF',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // --- Estilos do Avatar ---
    avatarImage: {
        // Posição agora controlada pelo avatarCenteredContainer
        // Removido position: 'absolute' e bottom fixo
        marginBottom: -50, // Puxa a imagem um pouco para baixo para sobrepor a caixa de diálogo
    },
    // Estilos avatarLeft e avatarRight (REMOVIDOS, pois não são mais necessários para centralizar)
});

export default Capitulo21Screen;