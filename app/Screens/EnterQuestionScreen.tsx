import React from "react";
import { Text, TextInput, Modal, TouchableOpacity, Pressable} from "react-native";
import { View, Image, StyleSheet } from "react-native";

import colors from "../config/colors";
import { Button } from "@rneui/base";
import { RootStackParamList } from "../config/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { categorizeQuestion } from "../config/API requests";

type Props = NativeStackScreenProps<RootStackParamList, "EnterQuestionScreen">;


const EnterQuestionScreen: React.FC<Props> = ({ navigation, route }) => {
  // For testing purposes, marks all questions as correct (still performs API call)
  // to test navigation. For production, set to false. 
  const alwaysCorrect = true;
  const { level } = route.params;
  const questionTypes = ["Open-Ended", "Directive", "Option Posing", "Suggestive"];
  const questionType = questionTypes[level - 1];
  var questionPronoun = "";
  if (level == 2){
    questionPronoun = "a";
  } else {
    questionPronoun = "an";
  }
  const currentType = questionTypes[level - 1];
  const [question, setQuestion] = React.useState("");
  const [placeholder, setPlaceholder] = React.useState("Enter your question");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = React.useState<boolean | null>(null);

  const handleSubmit = async () => {
    const category = await categorizeQuestion(question);
    if ((category == questionType) || alwaysCorrect) {
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
    if (!(isCorrect)) {
      handleCloseModal();
      setQuestion("");
      setPlaceholder("Enter your question");
    } else {
        handleCloseModal();
        if (level < 4) {
          setQuestion("");
          setPlaceholder("Enter your question");
          navigation.navigate("EnterQuestionScreen", { level: level + 1 });
        } else {
          setQuestion("");
          setPlaceholder("Enter your question");
          navigation.navigate("MultiChoiceScreen");
        }
    }
  };

  return (
    <View style={styles.background}>
      <Text style={styles.header}>Type in {questionPronoun} {questionType} question</Text>
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
    borderRadius: 60,
  },
  buttonContainer: {
    width: 300,
    height: 200,
    marginHorizontal: 50,
    marginTop: 60,
    alignSelf: "center",
    marginBottom: 100,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", 
    padding: 16,
  },
  background: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "lightgreen",
    top: 0,
  },
  submitButton: {
    width: "40%",
    height: 100,
    backgroundColor: colors.transparent,
    marginBottom: 100,
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 50,
    marginTop: 40,
    color: "#004D40",
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
    height:"40%",
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 8,
    textAlignVertical: "top",
    color: "",
  },
});

export default EnterQuestionScreen;
