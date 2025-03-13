import React, { useEffect, useRef } from "react";
import { Text, BackHandler, TextInput, Modal, TouchableOpacity, Pressable, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, Animated, PanResponder } from "react-native";
import { View, Image, StyleSheet } from "react-native";
import colors from "../config/colors";
import { Button } from "@rneui/base";
import { RootStackParamList } from "../config/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { categorizeQuestion } from "../config/API requests";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getHighScores, saveHighScores } from '../config/PersistentState';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParamList, "EnterQuestionScreen">;

const EnterQuestionScreen: React.FC<Props> = ({ navigation, route }) => {
  // For testing purposes, marks all questions as correct (still performs API call)
  // to test navigation. For production, set to false. 

  const alwaysCorrect = false;
  const { question_type_index, successiveQuestionCount } = route.params;
  

  const questionTypes = ["Open-Ended", "Directive", "Option Posing", "Suggestive"];
  const questionTypesFromAPI = ["Open-ended", "Directive", "Option Posing", "Suggestive"];
  const questionType = questionTypes[question_type_index - 1];
  const questionTypeForAPI = questionTypesFromAPI[question_type_index - 1];
  var questionPronoun = "";
  if (question_type_index == 2) {
    questionPronoun = "a";
  } else {
    questionPronoun = "an";
  }
  const currentType = questionTypes[question_type_index - 1];
  const [question, setQuestion] = React.useState("");
  const [placeholder, setPlaceholder] = React.useState("Enter your question");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = React.useState<boolean | null>(null);
  const [confidentAboutAnswer, setConfidentAboutAnswer] = React.useState(false);
  const [highscore, setHighscore] = React.useState(0);
  const [optionsModalVisible, setOptionsModalVisible] = React.useState(false);
  const [networkErrorModalVisible, setNetworkErrorModalVisible] = React.useState(false);
  const [waitingForResponse, setWaitingForResponse] = React.useState(false);
  const feedback = [["An example of an open-ended question is 'What happened?'", "An example of an open-ended question is 'Can you tell me about what happened?'", "An example of an open-ended question is 'Tell me everything.'"],
  ["An example of a directive question is 'Who hurt you?'", "An example of a directive question is 'What did he do to you?'", "An example of a directive question is 'Where were you when this happened?'", "An example of a directive question is 'Who did this to you'"], 
  ["An example of an option posing question is 'Did he slap you or did he kick you'", "An example of an option posing question is 'Did you go straight home or did you go to their house?'", "An example of an option posing question is 'Did she give you water or coffee?'"],
  ["An example of a suggestive question is 'He hit you, didn't he?'", "An example of a suggestive question is 'You said you went home early, you went to her house didn't you?'", "An example of a suggestive question is 'Did he do anything else, did he hit you?'"]
];
  const [currentExample,setCurrentExample] = React.useState("");
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

  const handleSubmit = async () => {

    const randomIndex = Math.floor(Math.random() * feedback[question_type_index - 1].length);
    const example = feedback[question_type_index - 1][randomIndex];
    setCurrentExample(example);

    try {
      setWaitingForResponse(true);
      const response = await categorizeQuestion(question);
      const category = response.question_type;
      setWaitingForResponse(false);
      if ((category == questionTypeForAPI) || alwaysCorrect) {
        setIsAnswerCorrect(true);
      } else {
        setIsAnswerCorrect(false);
      }
      if (response.confidence < 0.7) {
        setConfidentAboutAnswer(false);
      } else {
        setConfidentAboutAnswer(true);
      }
      setModalVisible(true);
    } catch (error) {
      setNetworkErrorModalVisible(true);
      setWaitingForResponse(false);
    }
    
  };

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
  

  

  useEffect(() => {
    setHighscore(route.params.highscore);
    
    
  }, []);

  const handleAnswer = (isCorrect: boolean, confidentAboutAnswer: boolean) => {
    setModalVisible(false);
    if (confidentAboutAnswer){
      if (isCorrect) {
        setHighscore(highscore + 1);
      } else {
        setHighscore(0);
      }
    } else {
      setHighscore(highscore);
      setQuestion("");
      setPlaceholder("Enter your question");
      setModalVisible(false);
    }
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
    // console.log("passing highscore: ", highscore);
    if (!(isAnswerCorrect)) {
      handleCloseModal();
      setQuestion("");
      setPlaceholder("Enter your question");
    } else {
      handleCloseModal();
      if (successiveQuestionCount < 1) {
        setQuestion("");
        setPlaceholder("Enter your question");
        console.log("question type index: ", (question_type_index + 1) % 4);

        navigation.navigate("EnterQuestionScreen",
           { question_type_index: (question_type_index % 4) + 1, 
            highscore: highscore, 
            successiveQuestionCount: successiveQuestionCount + 1 });
      } else {
        setQuestion("");
        setPlaceholder("Enter your question");
        navigation.navigate("MultiChoiceScreen", { highscore: highscore, question_type_index: (question_type_index % 4) + 1 });
      }
    }
  }, [highscore]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS == "android" ? "padding" : "height"} style={{ flex: 1 }}>
      <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === "ios" ? 20 : 0}
          keyboardShouldPersistTaps="handled"
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.background}>
            <Pressable onPress={() => setOptionsModalVisible(true)} style={styles.backButton}>
              <Icon name="arrow-back" size={30} color={colors.darkText} />
            </Pressable>
            <Text style={styles.toptext}>Practice Mode</Text>
      <View style={styles.orangeBox}>
        <Text style={styles.orangeBoxText}>🔥 {highscore}</Text>
      </View>
      <Pressable style={styles.aboutButton} onPress={() => navigation.navigate("AboutScreen")}>
        <Icon name="information-circle-outline" size={35} color={colors.darkText}/>
      </Pressable>
      <Text style={styles.header}>Type in {questionPronoun} {questionType} question</Text>
      <View style={styles.logoContainer}>
                      <Image source = {require("../../assets/images/llama.png")} style={styles.logo}/>
                    </View>
      <TextInput
        style={[styles.textInput]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={question}
        onChangeText={setQuestion}
        onFocus={() => setPlaceholder("")}
        onBlur={() => setPlaceholder("Enter your question")}
        multiline={true}
        scrollEnabled={true}
      />
      <View style={styles.submitButton}>
        <Button
          title="Submit"
          buttonStyle={styles.buttonStyle}
          containerStyle={styles.buttonContainer}
          titleStyle={{ fontWeight: "bold" }}
          onPress={handleSubmit}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View pointerEvents="auto" 
          style={[styles.modalContent, confidentAboutAnswer ? 
          (isAnswerCorrect ? styles.correctModal : styles.incorrectModal)
          : styles.unsureModal,
          {transform: [{translateY: translateYFeedbackModal}]}]}
          {...panResponder.panHandlers}>
          
            <View>
              <View style={styles.modalHeader}>
                <Icon name="chevron-down" size={30} color={colors.lightText}/>
              </View>
              <Text style={styles.modalText}>
                {confidentAboutAnswer ? (isAnswerCorrect ? "Well Done!" : `Wrong Answer \n\nHere's a hint:\n ${currentExample}`) : "We aren't sure about this one. Try to make your question a closer fit to the category"}
              </Text>
              <TouchableOpacity
                style={[styles.modalButton, confidentAboutAnswer ? 
                  (isAnswerCorrect ? styles.correctButton : styles.incorrectButton)
                : styles.unsureButton]}
                onPress={() => handleAnswer(isAnswerCorrect ? true : false, confidentAboutAnswer ? true : false)}
              >
                <Text style={styles.buttonText}>{confidentAboutAnswer ? (isAnswerCorrect ? "Continue" : "Got It") : "Try Again"}</Text>
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
              <Modal
                animationType="none"
                transparent={true}
                visible={waitingForResponse}
                onRequestClose={() => setWaitingForResponse(false)}
              >
                <View style={styles.overlay}>
                  <View style={styles.overlayContent}>
                    <TypingIndicator />
                  </View>
                </View>
              </Modal>
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: colors.button,
    borderWidth: 2,
    borderColor: colors.outline,
    borderRadius: 60,
  },
  buttonContainer: {
    width: 300,
    height: 200,
    marginHorizontal: 50,
    marginTop: 20,
    alignSelf: "center",
    marginBottom: 100,
    
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  toptext: {
    fontSize: 22,
    fontWeight: 'bold',
    top: 7,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  logo: {
    width: 250,
    height: 250,
    
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
    top: 0,
  },
  submitButton: {
    width: "40%",
    height: 100,
    backgroundColor: colors.transparent,
    marginBottom: 100,
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
    color: "#004D40",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.transparent,
  },
  modalContent: {
    textAlign: 'center',
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  correctModal: {
    backgroundColor: colors.correct,
  },
  unsureModal: {
    backgroundColor: colors.unsure,
  },
  incorrectModal: {
    backgroundColor: colors.incorrect,
  },
  modalText: {
    textAlign: 'center',
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
  modalHeader:{
    alignItems: 'center',
  },
  correctButton: {
    backgroundColor: colors.correctButton,
  },
  incorrectButton: {
    backgroundColor: colors.incorrectButton,
  },
  unsureButton: {
    backgroundColor: colors.unsureButton,
  },
  buttonText: {
    color: colors.lightText,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInput: {
    justifyContent: "flex-start",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBackground,
    width: "80%",
    height: "20%",
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 40,
    paddingHorizontal: 8,
    textAlignVertical: "top",
    color: "",
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
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  overlayContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default EnterQuestionScreen;