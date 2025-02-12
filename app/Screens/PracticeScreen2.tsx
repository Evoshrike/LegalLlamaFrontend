import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "@rneui/base";
import colors from "../config/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../config/types";
import Animated, { Easing, useSharedValue } from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, "PracticeScreen2">;

const PracticeScreen2: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState([
    { key: "1", label: "Question 1" },
    { key: "2", label: "Question 2" },
    { key: "3", label: "Question 3" },
    { key: "4", label: "Question 4" },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const dataShared = useSharedValue([...data]);

  const handleSubmit = () => {
    setIsAnswerCorrect(true);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleAnswer = (isCorrect: boolean) => {
    handleCloseModal();
    if (isCorrect) {
      navigation.navigate("Home");
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
    return (
      <TouchableOpacity
      
        style={[
          styles.optionBox,
          { backgroundColor: isActive ? "#006400" : "#006400" },
        ]}
        delayLongPress={10}
        onLongPress={drag}
      >
        <Text style={styles.optionText}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>Rank these questions in the order they would appear in an interview</Text>
        <View style={styles.listContainer}>
        <DraggableFlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          onDragEnd={({ data }) => {
            dataShared.value = data.map(item => ({ ...item })); 
            setData([...dataShared.value]); 
          }}
          animationConfig={{
            duration: 300,
          }}
        />
        </View>
        <View style={styles.submitButton}>
          <Button
            title="Submit"
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.buttonContainer}
            titleStyle={{ fontWeight: "bold" , fontSize: 20}}
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
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: "#004D40",
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 60,
        height: 100,
        width: 200,
        alignSelf: "center",
      },
      buttonContainer: {
        width: 300,
        height: 400,
        marginHorizontal: 50,
        marginTop: 60,
        alignSelf: "center",
        marginBottom: 100,
      },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "lightgreen",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
  },
  optionBox: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",

  },
  listContainer: {
    width: "100%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    color: "white",
  },
  submitButton: {
      width: "40%",
      height: 100,
      backgroundColor: colors.transparent,
      marginBottom: 100,
    },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  correctModal: {
    backgroundColor: "green",
  },
  incorrectModal: {
    backgroundColor: "red",
  },
  modalText: {
    fontSize: 18,
    color: "white",
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
  },
  correctButton: {
    backgroundColor: "white",
    color: "green",
  },
  incorrectButton: {
    backgroundColor: "white",
    color: "red",
  },
  buttonText: {
    color: "green",
    fontWeight: "bold",
  },
});

export default PracticeScreen2;