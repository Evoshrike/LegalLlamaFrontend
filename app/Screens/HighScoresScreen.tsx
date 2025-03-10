import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Modal, Pressable, Image } from "react-native";
import { RootStackParamList } from "../config/types";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getHighScores } from "../config/PersistentState";
import { highscore } from "../config/types";
import colors from "../config/colors";
import ConfettiCanon from "react-native-confetti-cannon";
import Icon from 'react-native-vector-icons/Ionicons';


type Props = NativeStackScreenProps<RootStackParamList, "HighScoresScreen">;

const HighScoresScreen: React.FC<Props> = ({ navigation}) => {

    const handleGoBack = () => {
        navigation.goBack();
    };

    const confettiRef = useRef<ConfettiCanon>(null);

    useEffect(() => {
        confettiRef.current?.start();
    }, []);
    
    return (
        <View style={styles.background}>
            <View style={styles.headContainer}>
                
                <Pressable onPress={handleGoBack} style={styles.backButton}>
                    <Icon name="arrow-back" size={30} color={colors.lightText}/>
                </Pressable>

                <View style={styles.imageContainer}>
                    <Image source={require("../assets/images/trophy.png")} style={styles.image} />
                </View>

                
                <View>
                    <Text style={styles.title}>HIGH SCORES</Text>
                </View>
            </View>


            <View style={styles.scoresContainer}>
                <Text style={styles.scoreTypeText}>Max # correct answers in a row</Text>
                <Text style={styles.scoreNumText}>🔥5</Text>
                <Text style={styles.scoreDateText}>01/01/2000</Text>
            </View>

            <ConfettiCanon ref={confettiRef} count={100} origin={{x: 0, y: 0}} fadeOut />

        </View>

    )
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: colors.highScoresSecondary,
        alignItems: "center",
    },
    headContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingTop: 40,
        paddingBottom: 30,
        backgroundColor: colors.highScoresSecondary,
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
    },
    image: {
        width: 150,
        height: 200,
        marginTop: 20
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 0,
        textAlign: "center",
        marginHorizontal: 20,
        color: colors.lightText
      },
    
    scoresContainer:{
        flex: 1,
        backgroundColor: colors.background,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderTopWidth: 3,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: colors.background,
        borderRightColor: colors.background,
        borderTopColor: "white",
        width: "100%",
        paddingHorizontal: 20,
        paddingTop: 35,
        marginHorizontal: 20,
        marginTop: 20,
    },
    scoreTypeText:{
        fontSize: 22,
        color: colors.highScoresSecondary,
        fontWeight: 600,
    },
    scoreNumText: {
        fontSize: 110,
        fontWeight: 'bold',
        color: colors.highScoresSecondary,
        textAlign: "center",
        alignSelf: "center",
        marginVertical: 10,
        paddingTop:10
    },
    scoreDateText:{
        fontSize: 25,
        fontWeight: 'bold',
        color: colors.highScoresSecondary,
        textAlign: "center",
        alignSelf: "center",
        marginVertical: 10
    },
    backButton: {
        position: 'absolute',
        top: 12,
        height: 30,
        width: 30,
        left: 10,
        zIndex: 1,
      }    
});

export default HighScoresScreen;