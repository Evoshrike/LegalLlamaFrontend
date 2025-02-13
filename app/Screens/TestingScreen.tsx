import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Modal, Pressable } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { fetchFeedback, fetchResponse, fetchScenario } from "../config/API requests";
import { q_and_a, RootStackParamList } from "../config/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, 'TestingScreen'>;

const ChatMessage: React.FC<{ message: string; isUser: boolean }> = ({ message, isUser }) => {
  return (
    <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.botMessage]}>
      <Text style={isUser ? styles.userMessageText : styles.botMessageText}>{message}</Text>
    </View>
  );
};

const TestingScreen: React.FC<Props> = ({ navigation, route }) => {
  const stageList = [
    "Stage 1: Introductory Phase",
    "Stage 2: Rapport-Building Phase",
    "Stage 3: Transitional Phase",
    "Stage 4: Substantive Phase",
    "Stage 5: Closure Phase"
  ];
  const { stage } = route.params;
  const stage_name = stageList[stage - 1];

  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [qAndAPairs, setQAndAPairs] = useState<q_and_a[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = React.useState<boolean | null>(null);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [scenario, setScenario] = useState<string>("");

  const handleSend = () => {
    if (questionCount < 5) {
      if (input.trim()) {
        setMessages([...messages, { text: input, isUser: true }]);
        setInput("");
        simulateBotResponse(input);
        setQuestionCount(questionCount + 1);
      }
    } else {
      setModalVisible(true);
    }
  };

  const simulateBotResponse = async (userMessage: string) => {
    setBotTyping(true);
    try {
      const botMessage = await fetchResponse(userMessage);
      displayMessageCharacterByCharacter(botMessage, false);
      setQAndAPairs([...qAndAPairs, { question: userMessage, response: botMessage }]);
      if (questionCount + 1 === 5) {
        onFifthQuestion();
      }
    } catch (error) {
      console.error("Error fetching bot response:", error);
      const errorMessage = "There was an error fetching a response. Please try again later.";
      displayMessageCharacterByCharacter(errorMessage, false);
    }
  };

  const displayMessageCharacterByCharacter = (message: string, isUser: boolean) => {
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
      }
    }, 50);
  };

  async function onFifthQuestion(): Promise<undefined> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const feedbackJSON = await fetchFeedback(qAndAPairs);
    setIsAnswerCorrect(feedbackJSON.is_correct);
    setFeedback(feedbackJSON.response);
    setModalVisible(true);
  };

  async function generateScenario() {
    const scenario = await fetchScenario();
    setScenario(scenario);
    
  }

  useEffect(() => {
      generateScenario();
    }, []);

  const handleCloseModal = () => {
    setModalVisible(false);
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
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ask 5 questions appropriate for {stage_name}</Text>
      <View style={styles.speechBubble}>
        <Text style={styles.scenarioText}>Your scenario is: {scenario}</Text>
      </View>
      
      <ScrollView style={styles.chatContainer}>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message.text} isUser={message.isUser} />
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={handleSend} />
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
    </View>
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
  speechBubble: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    alignSelf: 'center',
    marginBottom: 20,
  },
  scenarioText: {
    fontSize: 18,
    color: 'black',
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
});

export default TestingScreen;