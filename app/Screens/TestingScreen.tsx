import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from "react-native";
import { fetchResponse } from "../config/API requests";

const ChatMessage: React.FC<{ message: string; isUser: boolean }> = ({ message, isUser }) => {
  return (
    <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.botMessage]}>
      <Text style={isUser ? styles.userMessageText : styles.botMessageText}>{message}</Text>
    </View>
  );
};

const TestingScreen: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      setInput("");
      simulateBotResponse(input);
    }
  };

  const simulateBotResponse = async (userMessage: string) => {
    setBotTyping(true);
    try {
      const botMessage = await fetchResponse(userMessage);
      displayMessageCharacterByCharacter(botMessage, false);
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

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
});

export default TestingScreen;