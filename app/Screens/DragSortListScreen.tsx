import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "@rneui/base";
import colors from "../config/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../config/types";
import Animated, { Easing, useSharedValue } from 'react-native-reanimated';

// NOTE: As of 13/02, this screen is NOT in the final spec and is hence NOT in use. It is retained here
// in case it is required in future. It also doesn't work correctly. 

type Props = NativeStackScreenProps<RootStackParamList, "DragSortListScreen">;

const DragSortListScreen: React.FC<Props> = ({ navigation }) => {
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
          { backgroundColor: isActive ? "#006400" : "#006400", },
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
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: "absolute",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "lightgreen",
  },
  header: {
    position: "absolute",
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
    position: "absolute",
    top: 150,
    bottom: 200,
    left: 0,
    right: 0,
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
    position: "absolute",
    top: 600,
    bottom: 100,
      width: "40%",
      height: 100,
      backgroundColor: colors.transparent,
      marginBottom: 100,
    },
    modalOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      position: "absolute",
      width: "100%",
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

export default DragSortListScreen;