import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, Image } from 'react-native';

import colors from '../config/colors';
import { fetchQuestion } from '../config/API requests';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from '../config/types';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParamList, 'MultiChoiceScreen'>;

const MultiChoiceScreen: React.FC<Props> = ({ navigation, route }) => {
  const {question_type_index} = route.params;
  const options = ["Open-Ended", "Directive", "Option Posing", "Suggestive"];
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = React.useState<boolean | null>(null);
  const [question, setQuestion] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [highscore, setHighscore] = React.useState(0);
   const [optionsModalVisible, setOptionsModalVisible] = React.useState(false);


  // While the classifier is still not set up:
  const alwaysOpenEnded = true;
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOptionPress = (option: number) => { 
    const optionString = options[option];
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
    
    if (isAnswerCorrect){
      navigation.navigate("EnterQuestionScreen",
         { highscore: highscore, 
          question_type_index: question_type_index, 
          successiveQuestionCount: 0 });
    }
  }, [highscore]);

  async function getQuestion() {
    const question = await fetchQuestion();
    setQuestion(question.question);
    console.log("question: ", question.question);
    
    setCategory(question.category);
    
  };

  useEffect(() => {
    getQuestion();
    setHighscore(route.params.highscore);
  }, []);

  return (
    <View style={styles.container}>
             <Pressable onPress={handleGoBack} style={styles.backButton}>
                          <Icon name="arrow-back" size={30} color="black" />
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
      <View style={styles.speechBubble}>
        <Text style={styles.questionText}>{question}</Text>
      </View>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgreen',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 40,
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
    fontSize: 26,
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
  speechBubble: {
    width: '80%',
    padding: 20,
    marginTop:30,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    color: 'black',
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
    backgroundColor: '#006400',
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  optionText: {
    fontSize: 18,
    color: 'white',
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

export default MultiChoiceScreen;