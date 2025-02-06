import React from "react";
import { Text, TextInput, Modal, TouchableOpacity, Pressable} from "react-native";
import { View, Image, StyleSheet } from "react-native";

import colors from "../config/colors";
import { Button } from "@rneui/base";
import { RootStackParamList } from "../config/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "PracticeScreen1">;

// TODO: Make the layout better (less empty space in the bottom half of the screen)
const PracticeScreen1: React.FC<Props> = ({ navigation, route }) => {
  const [question, setQuestion] = React.useState("");
  const [placeholder, setPlaceholder] = React.useState("Enter your question");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = React.useState<boolean | null>(null);

  const handleSubmit = () => {
    // Placeholder for checking the answer - to be replaced by API call to webserver
    if (question === "What is the capital of France?") {
      setIsAnswerCorrect(true);
    } else {
      setIsAnswerCorrect(false);
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!isCorrect) {
      handleCloseModal();
      setQuestion("");
      setPlaceholder("Enter your question");
    } else {
        handleCloseModal();
        navigation.navigate("Home");
    }
  };

  return (
    <View style={styles.background}>
      <Text style={styles.header}>Type in an open-ended question</Text>
      <TextInput
        style={[
          styles.textInput,
          ,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={question}
        onChangeText={setQuestion}
        onFocus={() => setPlaceholder("")}
        onBlur={() => setPlaceholder("Enter your question")}
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
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: "#004D40",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 30,
  },
  buttonContainer: {
    width: 200,
    marginHorizontal: 50,
    marginVertical: 10,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", 
    padding: 16,
  },
  background: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "lightgreen",
    top: 0,
  },
  submitButton: {
    width: "40%",
    height: 100,
    backgroundColor: colors.transparent,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 40,
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
  textInput: {
    justifyContent: "flex-start",
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: "white",
    width: "80%",
    height:"20%",
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 8,
    textAlignVertical: "top",
    color: "",
  },
});

export default PracticeScreen1;
