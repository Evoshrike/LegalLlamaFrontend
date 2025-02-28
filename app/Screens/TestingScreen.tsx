import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, Modal, Pressable, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, Animated } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { fetchChatResponse, fetchFeedback, fetchResponse, fetchScenario, fetchTestingFeedback, startSession } from "../config/API requests";
import { q_and_a, RootStackParamList } from "../config/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "@rneui/base";
import Icon from 'react-native-vector-icons/Ionicons';
import colors from "../config/colors";

type Props = NativeStackScreenProps<RootStackParamList, 'TestingScreen'>;

const ChatMessage: React.FC<{ message: string; isUser: number }> = ({ message, isUser }) => {
  return (
    <View style={[styles.messageContainer, isUser === 1 ? styles.userMessage : (isUser === 0 ? styles.botMessage : styles.feedbackMessage)]}>
      <Text style={isUser ? styles.userMessageText : styles.botMessageText}>{message}</Text>
    </View>
  );
};

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

const TestingScreen: React.FC<Props> = ({ navigation, route }) => {
  const stageList = [
    "Stage 1: Introductory Phase",
    "Stage 2: Information-Gathering Phase",
    "Stage 3: Closure Phase"
  ];

  const stageQuestionCount = [2, 2, 2];
  const { stage } = route.params;
  const stage_name = stageList[stage - 1];

  const [messages, setMessages] = useState<{ text: string; isUser: number }[]>([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [qAndAPairs, setQAndAPairs] = useState<q_and_a[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [scenario, setScenario] = useState<string>("");
  const [session_id, setSessionID] = useState(0);
  const [lastQuestion, setLastQuestion] = useState("");
  const [networkErrorModalVisible, setNetworkErrorModalVisible] = React.useState(false);
  const [waitingForResponse, setWaitingForResponse] = React.useState(false); 
  const [finalModalVisible, setFinalModalVisible] = React.useState(false);
  

  const handleSend = () => {
    Keyboard.dismiss();
    if (questionCount < 5) {
      if (input.trim()) {
        setLastQuestion(input);
        setMessages([...messages, { text: input, isUser: 1 }]);
        setInput("");
        simulateBotResponse(input);
        setQuestionCount(questionCount + 1);
      }
    } else {
      setModalVisible(true);
    }
  };

  const onFinishingInterview = () => {
    setFinalModalVisible(true);
  };

  const onFinalModalHomePress = () => {
    setFinalModalVisible(false);
    navigation.navigate("Home");
  };

  const handleNavigation = () => {
    switch (stage) {
      case 1: {
        if (questionCount === stageQuestionCount[0] - 1){
          
          onMovingStage();
        };
      };
      case 2: {
        if (questionCount === stageQuestionCount[1] - 1){
          onFinishingInterview();
      };
    };
      case 3: {
        if (questionCount === stageQuestionCount[2] - 1){
          onFinishingInterview();
        }
      };
    };
  }; 
  const simulateBotResponse = async (userMessage: string) => {
    setBotTyping(true);
    try {
      const chat_prompt = { message: userMessage, scenario: scenario, session_id: session_id };
      setWaitingForResponse(true);
      const botMessage = await fetchChatResponse(chat_prompt);
      setWaitingForResponse(false);
      displayMessageCharacterByCharacter(botMessage, 0, () => onEachQuestion());
      setQAndAPairs([...qAndAPairs, { question: userMessage, response: botMessage }]);
      handleNavigation();
    } catch (error) {
      console.error("Error fetching bot response:", error);
      const errorMessage = "There was an error fetching a response. Please try again later.";
      displayMessageCharacterByCharacter(errorMessage, 0);
      setNetworkErrorModalVisible(true);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };
  // isUser == 0: bot, isUser == 1: user, isUser == -1: feedback
  const displayMessageCharacterByCharacter = (message: string, isUser: number, callback?: () => void) => {
    let currentText = "";
    let index = 0;

    const interval = setInterval(() => {
        if (index < message.length) {
            currentText += message[index];
            setMessages((prevMessages) => {
                const newMessages = [...prevMessages];
                if (newMessages[newMessages.length - 1]?.isUser === isUser) {
                    newMessages[newMessages.length - 1].text = currentText;
                } else {
                    newMessages.push({ text: currentText, isUser });
                }
                return newMessages;
            });
            index++;
        } else {
            clearInterval(interval);
            setBotTyping(false);
            if (callback) {
                callback();
            }
        }
    }, 10);
};

  async function onEachQuestion() {
    try {
      if (questionCount != 0){
        const last_QApair = qAndAPairs[qAndAPairs.length - 1];
        const testing_feedback_input = { question_1: last_QApair.question, response: last_QApair.response, question_2: lastQuestion };
        const testing_feedback = await fetchTestingFeedback(testing_feedback_input);
        const context_switch = testing_feedback.context_switch;
        const q_type = testing_feedback.q_type
        const q_stage = testing_feedback.q_stage;
        const wrong_stage = (q_stage != stage);
        var message = "";
        if (context_switch) {
          message += "You have switched context. Please avoid doing so unless prompted by the interviewee.";
        };
        if (wrong_stage) {
          if (context_switch) {
            message += " Also, y";
          } else {
            message += "Y";
          };
          message += "ou have asked a question that is not appropriate for this stage. Your question is for stage " + q_stage + " but we are currently in stage " + stage + ".";
        };
        if (q_type == "Suggestive"){
          if (context_switch || wrong_stage){
            message += " Also, p";
          } else {
            message += "P";
          };
          message += " lease avoid asking suggestive questions.";
        }
        if (message.length > 0) {
          displayMessageCharacterByCharacter(message, -1);
        };
      };
    } catch (error) {
      setNetworkErrorModalVisible(true);
    }
  };

  async function onMovingStage(): Promise<undefined> {
    try {
      setWaitingForResponse(true);
      const feedbackJSON = await fetchFeedback(qAndAPairs);
      setWaitingForResponse(false);
      setMessages([]);
      setQAndAPairs([]);
      setQuestionCount(0);
      setIsAnswerCorrect(null);
      setFeedback(null);
      setIsAnswerCorrect(feedbackJSON.is_correct);
      setFeedback(feedbackJSON.response);
      setModalVisible(true);
    } catch (error) {
      setNetworkErrorModalVisible(true);
    };
   
  };

  async function generateScenario() {
    try {
      setWaitingForResponse(true);
      const scenario = await fetchScenario();
      setWaitingForResponse(false);
      setScenario(scenario);
      console.log(scenario);
    } catch (error) {
      setNetworkErrorModalVisible(true);
  };
};

  async function startChatSession() {
    try {
      const session_id = await startSession();
      setSessionID(session_id);
    } catch (error) {
      setNetworkErrorModalVisible(true);
    };
  };

  const handleCloseFinalModal = () => {
    setFinalModalVisible(false);
  };

  useEffect(() => {
    generateScenario();
    startChatSession();
  }, []);

  useEffect(() => {
    displayMessageCharacterByCharacter(scenario, 0);
  }, [scenario]);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleHomePress = () => {
    setNetworkErrorModalVisible(false);
    navigation.navigate("Home");
  };

  const handleAnswer = (isCorrect: boolean) => {
    setModalVisible(false);
    if (isCorrect) {
      setMessages([]);
      setQAndAPairs([]);
      setQuestionCount(0);
      setIsAnswerCorrect(null);
      setFeedback(null);
      navigation.navigate("TestingScreen", { stage: stage + 1 });
    };
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS == "android" ? "padding" : "height"} style={{ flex: 1 }}>
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === "ios" ? 20 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="black" />
            </Pressable>
            <Text style={styles.toptext}>Testing Section</Text>
          <Text style={styles.header}>Ask {stageQuestionCount[stage - 1]} questions appropriate for {stage_name}</Text>
          <View style={styles.speechBubble}>
            <Text style={stage === 1 ? styles.scenarioTextStage1 : styles.scenarioTestNotStage1}>
              Your scenario is: {stage != 1 ? scenario : ""}</Text>
          </View>
          <ScrollView style={styles.chatContainer}>
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message.text} isUser={message.isUser} />
            ))}
            {waitingForResponse && <TypingIndicator />}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message"
              multiline={true}
              scrollEnabled={true}
            />
            <View style={styles.buttonContainer}>
            <Button title="SEND" onPress={handleSend} style={styles.sendButtonStyle} />
            </View>
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
                  {feedback}
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
            visible={finalModalVisible}
            onRequestClose={handleCloseFinalModal}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, styles.correctModal ]}>
                <Text style={styles.modalText}>
                  Well done! You have completed the testing section.
                </Text>
                <Pressable
                  style={[styles.modalButton, styles.correctButton]}
                  onPress={() => onFinalModalHomePress()}
                >
                  <Text style={styles.buttonText}>Home</Text>
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
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "darkgrey",
    margin: 20,

  },
  buttonContainer: {
    borderRadius: 20,
  
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  speechBubble: {
  
    width: '80%',
    height: '10%',
    padding: 20,
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  scenarioTextStage1: {
    fontSize: 18,
    color: colors.darkText,
    
  },
  scenarioTestNotStage1: {
    fontSize: 11,
    color: colors.darkText,
  },
  sendButtonStyle: {
    borderRadius: 10,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
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
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
  },
  userMessageText: {
    color: "#fff",
  },
  botMessageText: {
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    height: 40,
  },
  toptext: {
    fontSize: 20,
    fontWeight: 'bold',
    top: 7,
    textAlign: 'center',
  },
  feedbackMessage: {
    backgroundColor: "#ADD8E6",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  correctModal: {
    backgroundColor: '#4CAF50', 
  },
  incorrectModal: {
    backgroundColor: '#f44336', 
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  correctButton: {
    backgroundColor: '#388E3C', 
  },
  incorrectButton: {
    backgroundColor: '#D32F2F', 
  },
  buttonText: {
    color: '#ffffff',
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

export default TestingScreen;