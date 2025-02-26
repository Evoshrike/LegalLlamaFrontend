import React, { useEffect } from "react";
import { Text, TextInput, Modal, TouchableOpacity, Pressable, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { View, Image, StyleSheet } from "react-native";
import colors from "../config/colors";
import { Button } from "@rneui/base";
import { RootStackParamList } from "../config/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { categorizeQuestion } from "../config/API requests";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParamList, "EnterQuestionScreen">;

const EnterQuestionScreen: React.FC<Props> = ({ navigation, route }) => {
  // For testing purposes, marks all questions as correct (still performs API call)
  // to test navigation. For production, set to false. 
  const alwaysCorrect = true;
  const { question_type_index, successiveQuestionCount } = route.params;

  const questionTypes = ["Open-Ended", "Directive", "Option Posing", "Suggestive"];
  const questionType = questionTypes[question_type_index - 1];
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
  const [highscore, setHighscore] = React.useState(0);
  const [optionsModalVisible, setOptionsModalVisible] = React.useState(false);

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

  

  useEffect(() => {
    setHighscore(route.params.highscore);
  }, []);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setHighscore(highscore + 1);
    } else {
      setHighscore(0);
    }
  };

  const handleQuitGame = () => {
    setOptionsModalVisible(false);
    navigation.navigate("Home");
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSettingsPress = () => {
    setOptionsModalVisible(false);
    navigation.navigate("Settings");
  };

  useEffect(() => {
    console.log("passing highscore: ", highscore);
    if (!(isAnswerCorrect)) {
      handleCloseModal();
      setQuestion("");
      setPlaceholder("Enter your question");
    } else {
      handleCloseModal();
      if (successiveQuestionCount < 1) {
        setQuestion("");
        setPlaceholder("Enter your question");
        
        navigation.navigate("EnterQuestionScreen",
           { question_type_index: question_type_index + 1, 
            highscore: highscore, 
            successiveQuestionCount: successiveQuestionCount + 1 });
      } else {
        setQuestion("");
        setPlaceholder("Enter your question");
        navigation.navigate("MultiChoiceScreen", { highscore: highscore, question_type_index: question_type_index + 1});
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
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.background}>
       <Pressable onPress={handleGoBack} style={styles.backButton}>
                    <Icon name="arrow-back" size={30} color="black" />
                  </Pressable>
                  <Text style={styles.toptext}>Practice Section</Text>
      <View style={styles.orangeBox}>
        <Text style={styles.orangeBoxText}>🔥 {highscore}</Text>
      </View>
      <Pressable style={styles.optionsButton} onPress={() => setOptionsModalVisible(true)}>
        <View style={styles.optionsIcon}>
          <View style={styles.bar} />
          <View style={styles.bar} />
          <View style={styles.bar} />
        </View>
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
              onPress={() => handleQuitGame()}
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
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: colors.darkGreen,
    borderWidth: 2,
    borderColor: "white",
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
    fontSize: 26,
    fontWeight: 'bold',
    top: 7,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    fontSize: 32,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
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
    height: "20%",
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 40,
    paddingHorizontal: 8,
    textAlignVertical: "top",
    color: "",
  },
  orangeBox: {
    position: 'absolute',
    top: 10,
    right: 50,
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
  },
  orangeBoxText: {
    fontSize: 12,
    color: 'white',
  },
  optionsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    marginBottom: 50,
    backgroundColor: 'grey',
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
    backgroundColor: 'white',
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
    backgroundColor: "green",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default EnterQuestionScreen;