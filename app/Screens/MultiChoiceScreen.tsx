import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, Image } from 'react-native';

import colors from '../config/colors';
import { fetchQuestion } from '../config/API requests';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from '../config/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MultiChoiceScreen'>;

const MultiChoiceScreen: React.FC<Props> = ({ navigation, route }) => {
  const options = ["Open-Ended", "Directive", "Option Posing", "Suggestive"];
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = React.useState<boolean | null>(null);
  const [question, setQuestion] = React.useState("");
  const [category, setCategory] = React.useState("");

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOptionPress = (option: number) => { 
    const optionString = options[option];
    if (optionString == category) {
      setIsAnswerCorrect(true);
    } else {
      setIsAnswerCorrect(false);
    }
    setModalVisible(true);
  };

  const handleAnswer = (isCorrect: boolean) => {
    setModalVisible(false);
    if (isCorrect){
      navigation.navigate("Home");
    }
  };

  async function getQuestion() {
    const question = await fetchQuestion();
    setQuestion(question.question);
    console.log("question: ", question.question);
    setCategory(question.category);
  }

  useEffect(() => {
    getQuestion();
  }, []);

  return (
    <View style={styles.container}>
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
    marginTop: 40,
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 250,
    
  },
  logoContainer: {
    
    
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechBubble: {
    width: '80%',
    padding: 20,
    marginTop:40,
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