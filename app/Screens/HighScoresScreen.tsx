import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Modal, Pressable, Image, Dimensions, BackHandler } from "react-native";
import { RootStackParamList } from "../config/types";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getHighScores } from "../config/PersistentState";
import { highscore } from "../config/types";
import colors from "../config/colors";
import ConfettiCanon from "react-native-confetti-cannon";
import Icon from 'react-native-vector-icons/Ionicons';


type Props = NativeStackScreenProps<RootStackParamList, "HighScoresScreen">;

const { width, height } = Dimensions.get("window");

const HighScoresScreen: React.FC<Props> = ({ navigation}) => {
    const [topScore, setTopScore] = useState<highscore | null>(null);
    const [otherScores, setOtherScores] = useState<highscore[]>([]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const confettiRef = useRef<ConfettiCanon>(null);

    useEffect(() => {
        const getTop5Scores = async () => {
            const highScores = await getHighScores();
            let len = highScores.length;
            if (len > 0) {
                const score = highScores[len - 1];
                let otherScoresList = highScores.slice(0, len - 1);
                otherScoresList = otherScoresList.reverse();
                otherScoresList = otherScoresList.slice(0, 4);
                setTopScore(score);
                setOtherScores(otherScoresList);
            }
        };

        getTop5Scores();
        confettiRef.current?.start();
    }, []);

    useEffect(() => {
        const backAction = () => {
            navigation.goBack();
        return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, []);
    
    return (
        <View style={styles.background}>
            <View style={styles.headContainer}>
                
                <Pressable onPress={handleGoBack} style={styles.backButton}>
                    <Icon name="arrow-back" size={30} color={colors.lightText}/>
                </Pressable>

                <Pressable onPress={()=>navigation.navigate("AboutScreen")} style={styles.aboutButton}>
                    <Icon name="information-circle-outline" size={40} color={colors.lightText}/>
                </Pressable>

                <View style={styles.imageContainer}>
                    <Image source={require("../assets/images/trophy.png")} style={styles.image} />
                </View>

                
                <View>
                    <Text style={styles.title}>HIGH SCORES</Text>
                </View>
            </View>


            <View style={styles.scoresContainer}>
                <View style={styles.scoresHeader}>
                    <Text style={styles.scoreTypeText}>PRACTICE MODE</Text>
                    <Text style={styles.scoreTypeText}># Correct answers in a row</Text>
                </View>
                
                <View style={styles.scoreRowsContainer}>
                    <View style={styles.topScoreRow}>
                        { topScore !== null ?
                            <Text style={styles.topScoreText}>1.    🔥{topScore.score}     {topScore.date}</Text>:
                            <Text style={styles.topScoreText}>1.     -      -</Text>
                        }
                    </View>

                    
                    {otherScores.map((otherScore, i) => (
                        <View style={styles.otherScoreRow} key={i}>
                            <Text style={styles.otherScoreText}>{i+2}.     🔥{otherScore.score}      {otherScore.date}</Text>
                        </View>
                    ))}
                    
                    
                </View>

                
                
                {/*
                { topScore !== null ? 
                    <>
                        <Text style={styles.scoreNumText}>🔥{topScore.score}</Text>
                        <Text style={styles.scoreDateText}>{topScore.date}</Text>
                    </>  :
                    <Text style={styles.noScoresText}>... </Text>

                }
                */}

            </View>

            <ConfettiCanon ref={confettiRef} count={50} origin={{x: 0, y: 0}} fadeOut />

        </View>

    )
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: colors.highScoresSecondary,
        alignItems: "center",
    },
    aboutButton: {
        position: "absolute",
        top: 10,
        right:10
    },
    headContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: width,
        paddingVertical: height * 0.05,
        backgroundColor: colors.highScoresSecondary,
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: width * 0.35,
        height: height * 0.25,
    },
    title: {
        fontSize: 50,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginTop: height * 0.03,
        textAlign: "center",
        marginHorizontal: width * 0.05,
        color: colors.lightText
      },
    
    scoresContainer:{
        flex: 1,
        backgroundColor: colors.transparent,
        width: width,
    },
    scoresHeader:{
        backgroundColor: colors.background,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderLeftColor: "white",
        borderRightColor: "white",
        borderTopColor: "white",
        borderBottomColor: "white",
        width: width,
        paddingHorizontal: width * 0.07,
        paddingVertical: height * 0.015,
    },
    scoreTypeText:{
        fontSize: 20,
        color: colors.highScoresSecondary,
        fontWeight: 600,
        textAlign: "center",
    },
    scoreRowsContainer:{
        flex: 1,
        backgroundColor: colors.background,
        borderWidth: 3,
        borderColor: "white",
    },
    topScoreRow:{
        flex: 2,
        backgroundColor: colors.highScoresTertiary,
        marginVertical: 5, 
        marginHorizontal: 10,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    otherScoreRow:{
        flex: 1,
        backgroundColor: colors.highScoresTertiary,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 2,
        justifyContent: "center",
        alignItems: "center",
    },

    topScoreText:{
        color: colors.lightText,
        fontWeight: 'bold',
        fontSize: 25,
    },

    otherScoreText:{
        color: colors.lightText,
        fontSize: 20,
        fontWeight: 'bold',
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
    noScoresText:{
        fontSize: 25,
        fontStyle: 'italic',
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