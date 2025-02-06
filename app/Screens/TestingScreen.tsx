import React, {useState, useEffect} from "react";
import { View, StyleSheet } from "react-native";
import { RootStackParamList } from "../config/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
type Props = NativeStackScreenProps<RootStackParamList, "TestingScreen">;

const ChatMessage: React.FC<{ message: string, isUser: boolean }> = ({ message, isUser }) => {
    return (
        <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.botMessage]}>
        </View>
    );
    };

const TestingScreen: React.FC<Props> = ({ navigation, route }) =>  {
    const [messages, setMessages] = useState<{ text: String; isUser: boolean }[]>([]);
    const [input, setInput] = useState("");
    const [botTyping, setBotTyping] = useState(false);

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, isUser: true }]);
            setInput("");
            simulateBotResponse(input);
        }
    };
    return (
        <View> 
        </View>
        


    );
};

export default TestingScreen;

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
      messageText: {
        color: "#fff",
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

