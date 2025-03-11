import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, Image, Animated } from 'react-native';

import colors from '../config/colors';
import { fetchQuestion } from '../config/API requests';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from '../config/types';
import Icon from 'react-native-vector-icons/Ionicons';
import { GestureHandlerRootView, NativeViewGestureHandler, ScrollView } from 'react-native-gesture-handler';
import { getHighScores, saveHighScores } from '../config/PersistentState';

type Props = NativeStackScreenProps<RootStackParamList, 'MultiChoiceScreen'>;

const MultiChoiceScreen: React.FC<Props> = ({ navigation, route }) => {
  const {question_type_index} = route.params;
  const options = ["Open-Ended", "Directive", "Option Posing", "Suggestive"];
  const optionsFromLLM = ["Open-Ended", "Directive", "Option-Posing", "Suggestive"];
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = React.useState<boolean | null>(null);
  const [question, setQuestion] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [highscore, setHighscore] = React.useState(0);
  const [optionsModalVisible, setOptionsModalVisible] = React.useState(false);
  const [networkErrorModalVisible, setNetworkErrorModalVisible] = React.useState(false);
  const [waitingForResponse, setWaitingForResponse] = React.useState(false);

  const TypingIndicator: React.FC = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      const animateDot = (dot: Animated.Value, delay: number) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot, {
              toValue: -5,
              duration: 300,
              useNativeDriver: true,
              delay,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };
  
      animateDot(dot1, 0);
      animateDot(dot2, 150);
      animateDot(dot3, 300);
    }, [dot1, dot2, dot3]);
  
    return (
      <View style={styles.typingIndicator}>
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
      </View>
    );
  };
  

  // While the classifier is still not set up:
  const alwaysOpenEnded = false;
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOptionPress = (option: number) => { 
    const optionString = optionsFromLLM[option];
    if (optionString == category || (alwaysOpenEnded && option == 0)) {
      setIsAnswerCorrect(true);
    } else {
      setIsAnswerCorrect(false);
    }
    setModalVisible(true);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect){
      setHighscore(highscore + 1);
  } else {
    setHighscore(0);
    console.log("correct answer: ", category);
  }
  handleCloseModal();
};

  const updateHighScoresList = async () => {
    const pastScores = await getHighScores();
    let pastTopScore = {score:0, date:""}

    if (pastScores.length > 0) {
      pastTopScore = pastScores[pastScores.length - 1];
    }

    if (highscore > pastTopScore.score) {
      const newTopScore = {score: highscore, date: new Date().toDateString()};
      pastScores.push(newTopScore);
      await saveHighScores(pastScores);
    }
  };


  const handleQuitGame = async () => {
    await updateHighScoresList();
    setOptionsModalVisible(false);
    navigation.navigate("Home");
  };

  const handleGoBack = () => {
    navigation.goBack();
  };
  
  const handleHomePress = () => {
    setNetworkErrorModalVisible(false);
    navigation.navigate("Home");
  };

  const handleSettingsPress = () => {
    setOptionsModalVisible(false);
    navigation.navigate("Settings");
  };

  useEffect(() => {
    
    if (isAnswerCorrect){
      navigation.navigate("EnterQuestionScreen",
         { highscore: highscore, 
          question_type_index: question_type_index, 
          successiveQuestionCount: 0 });
    }
  }, [highscore]);

  async function getQuestion() {
    try {
    setWaitingForResponse(true);
    const question = await fetchQuestion();
    setWaitingForResponse(false);
    setQuestion(question.question);
    console.log("question: ", question.question);
    
    setCategory(question.category);
    } catch (error) {
      console.log("error: ", error); 
      setNetworkErrorModalVisible(true);
      setWaitingForResponse(false);
    };
    
  };

  useEffect(() => {
    getQuestion();
    setHighscore(route.params.highscore);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={styles.container}>
             <Pressable onPress={handleGoBack} style={styles.backButton}>
                          <Icon name="arrow-back" size={30} color={colors.darkText} />
                        </Pressable>
                        <Text style={styles.toptext}>Practice Section</Text>
      <Pressable style={styles.optionsButton} onPress={() => setOptionsModalVisible(true)}>
              <View style={styles.optionsIcon}>
                <View style={styles.bar} />
                <View style={styles.bar} />
                <View style={styles.bar} />
              </View>
            </Pressable>
      <View style={styles.orangeBox}>
              <Text style={styles.orangeBoxText}>🔥 {highscore}</Text>
            </View>
      <Text style={styles.header}>Categorize this question</Text>
      <View style={styles.logoContainer}>
                <Image source = {require("../../assets/images/llama.png")} style={styles.logo}/>
              </View>       
        <ScrollView style={styles.speechBubble} contentContainerStyle={{alignItems: 'center'}}>
          <Text style={styles.questionText}>{question}</Text>
          {waitingForResponse && <TypingIndicator />}
        </ScrollView>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionBox} onPress={() => handleOptionPress(0)}>
          <Text style={styles.optionText}>{options[0]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBox} onPress={() => handleOptionPress(1)}>
          <Text style={styles.optionText}>{options[1]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBox} onPress={() => handleOptionPress(2)}>
          <Text style={styles.optionText}>{options[2]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBox} onPress={() => handleOptionPress(3)}>
          <Text style={styles.optionText}>{options[3]}</Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isAnswerCorrect ? styles.correctModal : styles.incorrectModal]}>
            <Text style={styles.modalText}>
              {isAnswerCorrect ? "Well Done!" : "Wrong Answer"}
            </Text>
            <Pressable
              style={[styles.modalButton, isAnswerCorrect ? styles.correctButton : styles.incorrectButton]}
              onPress={() => handleAnswer(isAnswerCorrect ? true : false)}
            >
              <Text style={styles.buttonText}>{isAnswerCorrect ? "Continue" : "Got It"}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
              animationType="slide"
              transparent={true}
              visible={optionsModalVisible}
              onRequestClose={() => setOptionsModalVisible(false)}
            >
              <View style={styles.centeredView}>
                <View style={styles.optionsModalView}>
                  <Text style={styles.modalText}>Options</Text>
                  <Pressable
                    style={[styles.optionsModalButton, styles.correctButton]}
                    onPress={handleQuitGame}
                  >
                    <Text style={styles.buttonText}>Quit Practice</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.optionsModalButton, styles.correctButton]}
                    onPress={() => setOptionsModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Resume Practice</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.optionsModalButton, styles.correctButton]}
                    onPress={() => handleSettingsPress()}
                  >
                    <Text style={styles.buttonText}>Settings</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            <Modal
          animationType="slide"
          transparent={true}
          visible={networkErrorModalVisible}
          onRequestClose={() => setNetworkErrorModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.optionsModalView}>
              <Text style={styles.modalText}>Network Error</Text>
              <Pressable
                style={[styles.optionsModalButton, styles.correctButton]}
                onPress={() => setNetworkErrorModalVisible(false)}
              >
                <Text style={styles.buttonText}>Retry</Text>
              </Pressable>
              <Pressable
                style={[styles.optionsModalButton, styles.correctButton]}
                onPress={() => handleHomePress()}
              >
                <Text style={styles.buttonText}>Home</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 12,
    height: 30,
    width: 30,
    left: 10,
    zIndex: 1,
  },
  toptext: {
    position: 'absolute',
    top: 10,
    fontSize: 22,
  
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    
  },
  logoContainer: {
    
    
    alignItems: 'center',
    justifyContent: 'center',
  },
  orangeBox: {
    position: 'absolute',
    top: 10,
    right: 50,
    backgroundColor: colors.highStreakBackground,
    padding: 10,
    borderRadius: 10,
  },
  orangeBoxText: {
    fontSize: 12,
    color: colors.lightText,
  },
  optionsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    marginBottom: 50,
    backgroundColor: colors.optionsBackground,
    padding: 10,
    borderRadius: 10,
  },
  optionsIcon: {
    width: 15,
    height: 15,
    justifyContent: 'space-between',
  },
  bar: {
    width: '100%',
    height: 1.5,
    backgroundColor: colors.lightText,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  optionsModalButton: {
    paddingVertical: 10,
    marginVertical: 10,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  optionsModalView: {
    height: 300,
    width: 300,
    margin: 20,
    justifyContent: "center",
    backgroundColor: colors.optionsMenuBackground,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.outline,
  },
  speechBubble: {
    width: '80%',
    padding: 20,
    marginTop:30,
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  
    marginBottom: 20,
    
  },
  questionText: {
    fontSize: 18,
    color: colors.darkText,

  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    
    justifyContent: 'space-between',
    height: '30%',
    width: '100%',
  },
  optionBox: {
    width: '48%',
    padding: 20,
    height: 100,
    backgroundColor: colors.optionBoxBackground,
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  optionText: {
    fontSize: 18,
    color: colors.lightText,
  },
  submitButtonContainer: {
    width: '80%',
    paddingBottom: 20,
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    width: '100%',
    height: 60,
  },
  buttonContainer: {
    width: '100%',
    height: 60,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.transparent,
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  correctModal: {
    backgroundColor: colors.correct, 
  },
  incorrectModal: {
    backgroundColor: colors.incorrect, 
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.lightText,
    marginBottom: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  correctButton: {
    backgroundColor: colors.correctButton, 
  },
  incorrectButton: {
    backgroundColor: colors.incorrectButton, 
  },
  buttonText: {
    color: colors.lightText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    marginHorizontal: 2,
  },
});

export default MultiChoiceScreen;