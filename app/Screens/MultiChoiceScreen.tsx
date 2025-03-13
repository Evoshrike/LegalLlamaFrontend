import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, Image, Animated, PanResponder, BackHandler } from 'react-native';

import colors from '../config/colors';
import { fetchQuestion } from '../config/API requests';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from '../config/types';
import Icon from 'react-native-vector-icons/Ionicons';
import { GestureHandlerRootView, NativeViewGestureHandler, ScrollView } from 'react-native-gesture-handler';
import { getHighScores, saveHighScores } from '../config/PersistentState';
import { maybeCompleteAuthSession } from 'expo-web-browser';

type Props = NativeStackScreenProps<RootStackParamList, 'MultiChoiceScreen'>;

const MultiChoiceScreen: React.FC<Props> = ({ navigation, route }) => {
  const {question_type_index} = route.params;
  const options = ["Open-Ended", "Directive", "Option Posing", "Suggestive"];
  const optionsFromLLM = ["Open-ended", "Directive", "Option-Posing", "Suggestive"];
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = React.useState<boolean | null>(null);
  const [question, setQuestion] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [highscore, setHighscore] = React.useState(0);
  const [optionsModalVisible, setOptionsModalVisible] = React.useState(false);
  const [networkErrorModalVisible, setNetworkErrorModalVisible] = React.useState(false);
  const [waitingForResponse, setWaitingForResponse] = React.useState(false);
  const feedback = ["An open-ended question is one that encourages a long detailed answer (i.e., a free-recall response) and cannot be answered by yes or no.",
    "A directive question is a 'Who, What, When, Where, Why, How' question on a specific topic. This type of question encourages the interviewee to focus on a specific aspect of the event without adding unsolicited information.",
    "An option-posing question is one that is multiple choice (this also includes yes/no questions) where the answer is part of the question but is not implied.",
    "A suggestive question is a question with presuppositions, implied correct answers, or information that the interviewee did not reveal themeselves."
  ];
  const [userWrongOption, setUserWrongOption] = React.useState(0);
  const [categoryNum, setCategoryNum] = React.useState(1);
  const translateYFeedbackModal = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderGrant: () => {},
      onPanResponderMove: (event, gesture) => {
        //Animated.event([null, {dy: translateYFeedbackModal}])(event, gesture);
        if (gesture.dy > 0){
          translateYFeedbackModal.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (event, gesture) => {
        Animated.spring(translateYFeedbackModal, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        
      },
    })
  ).current;

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

  useEffect(() => {
    const backAction = () => {
      setOptionsModalVisible(true);
    return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const handleOptionPress = (option: number) => { 
    const optionString = optionsFromLLM[option];
    if (optionString == category || (alwaysOpenEnded && option == 0)) {
      setIsAnswerCorrect(true);
    } else {
      console.log("correct answer: ", category);
      setIsAnswerCorrect(false);
      setUserWrongOption(option);
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
    let newScores = [...pastScores];
    console.log(pastScores);
    const pastScoresLen = pastScores.length;
    let insertIndex = null;

    for (let i = 1; i <= 5 && i <= pastScoresLen; i++) {
      if (pastScores[pastScoresLen - i].score < highscore) {
        insertIndex = pastScoresLen - i + 1;
        newScores.splice(insertIndex, 0, {score: highscore, date: new Date().toDateString()});
        newScores = newScores.slice(-5);
        console.log(newScores);
        await saveHighScores(newScores);
        break;
      }
    }
  };


  const handleQuitGame = async () => {
    await updateHighScoresList();
    setOptionsModalVisible(false);
    navigation.navigate("Home");
  };

  // Not using this anymore - pressing back arrow will also trigger options modal
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  const handleHomePress = () => {
    setNetworkErrorModalVisible(false);
    navigation.navigate("Home");
  };

  const handleSettingsPress = () => {
    setOptionsModalVisible(false);
    navigation.navigate("AboutScreen");
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

      switch (question.category) {
        case "Open-ended":
          setCategoryNum(0);
          break;
        case "Directive":
          setCategoryNum(1);
          break;
        case "Option-Posing":
          setCategoryNum(2);
          break;
        case "Suggestive":
          setCategoryNum(3);
          break;
      }
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
             <Pressable onPress={() => setOptionsModalVisible(true)} style={styles.backButton}>
                          <Icon name="arrow-back" size={30} color={colors.darkText} />
                        </Pressable>
                        <Text style={styles.toptext}>Practice Mode</Text>
      <Pressable style={styles.aboutButton} onPress={() => navigation.navigate("AboutScreen")}>
        <Icon name="information-circle-outline" size={35} color={colors.darkText}/>
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
          <Animated.View pointerEvents="auto" style={[styles.modalContent, isAnswerCorrect ? styles.correctModal : styles.incorrectModal, {transform : [{translateY: translateYFeedbackModal}]}]} {...panResponder.panHandlers}>
            <View>
              <View style={styles.modalHeader}>
                <Icon name="chevron-down" size={30} color={colors.lightText}/>
              </View>
              
              <Text style={styles.modalText}>
                {isAnswerCorrect ? "Well Done!" : `Wrong Answer \n ${feedback[userWrongOption]} \n\n HINT: \n ${feedback[categoryNum]}`}
              </Text>
              <TouchableOpacity
                style={[styles.modalButton, isAnswerCorrect ? styles.correctButton : styles.incorrectButton]}
                onPress={() => handleAnswer(isAnswerCorrect ? true : false)}
              >
                <Text style={styles.buttonText}>{isAnswerCorrect ? "Continue" : "Got It"}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          
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
                  {/*<Pressable
                    style={[styles.optionsModalButton, styles.correctButton]}
                    onPress={() => handleSettingsPress()}
                  >
                    <Text style={styles.buttonText}>About</Text>
                  </Pressable>*/}
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
  aboutButton:{
    position: "absolute",
    top: 10,
    right: 10,
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
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  modalHeader:{
    alignItems: 'center'
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
    textAlign: 'center',
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