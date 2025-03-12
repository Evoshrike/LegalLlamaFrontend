import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { View, Text,Switch, StyleSheet, Animated, Pressable } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from '../config/types';
import Icon from 'react-native-vector-icons/Ionicons';

import { Button } from "@rneui/base";
import colors from '../config/colors';
const ThemeContext = createContext('themeContext');

import { ReactNode } from 'react';
import * as Linking from 'expo-linking';

// TODO make this work - integrate light / dark mode and add toggle switch
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value=""//{{ isDarkMode, toggleTheme }}> 
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

type Props = NativeStackScreenProps<RootStackParamList, "AboutScreen">;

const AboutScreen: React.FC<Props> = ({ navigation }) => {
    const [option1, setOption1] = React.useState(false);
    const [option2, setOption2] = React.useState(false);
    const [option3, setOption3] = React.useState(false);

    const animatedValue1 = useRef(new Animated.Value(0)).current;
    const animatedValue2 = useRef(new Animated.Value(0)).current;
    const animatedValue3 = useRef(new Animated.Value(0)).current;

    

    const handleNICHDPress = () => {
        Linking.openURL('https://nichdprotocol.com/the-nichd-protocol/_obj/pdf/28/REVISED_VERSION_2021.pdf');
    };

    const handleHomePress = () => {
        navigation.navigate("Home");
    };

    const handleGoBack = () => {
        navigation.goBack();
      };
        

    const toggleSwitch = (option: boolean, setOption: React.Dispatch<React.SetStateAction<boolean>>, animatedValue: Animated.Value) => {
        setOption(!option);
        Animated.timing(animatedValue, {
            toValue: option ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const handleFrontendPress = () => {
        Linking.openURL('https://github.com/Evoshrike/LegalLlamaFrontend');
    };

    const handleBackendPress = () => {
        Linking.openURL('https://github.com/HFZR2005/SierraServer');
    };

    useEffect(() => {
        Animated.timing(animatedValue1, {
            toValue: option1 ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [option1]);

    useEffect(() => {
        Animated.timing(animatedValue2, {
            toValue: option2 ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [option2]);

    useEffect(() => {
        Animated.timing(animatedValue3, {
            toValue: option3 ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [option3]);

    return (
        <View style={styles.container}>
              <Pressable onPress={handleGoBack} style={styles.backButton}>
                                <Icon name="arrow-back" size={30} color="black" />
                              </Pressable>
            <Text style={styles.header}>About Legal Llama</Text>
            <View style={styles.optionContainer}>
                <Text style={styles.aboutText}>This app was developed in 2025 as a group project by Cambridge University students Radhika Agrawal,
                     Nastasya Anos, Shrey Patel, Harry West, and Jude Hill (collectively known as Team Sierra), in
                      collaboration with Dr. Ching-Yu (Soar) Huang from the National University of Taiwan. Created as part of 
                      the Part IB Computer Science Tripos, the app is designed to assist users in learning proper techniques 
                      for conducting interviews with children in sensitive situations, following the NICHD protocol. 
                      Below, you can find links to the protocol and the project's GitHub repository.
                </Text>
                
            </View>
            <View style={styles.optionContainer}>
                <Text style={styles.optionTextStyle}>View the NICHD protocol</Text>
                <View style={styles.buttonStyle}>
                <Button title="Open" onPress={handleNICHDPress} buttonStyle={styles.buttonStyle} />
                </View>
            </View>
            <View style={styles.optionContainer}>
                <Text style={styles.optionTextStyle} >Frontend repository</Text>
                <View style={styles.buttonStyle}>
                <Button title="Open" onPress={handleFrontendPress} buttonStyle={styles.buttonStyle} />
                </View>
            </View>
            <View style={styles.optionContainer}>
                <Text style={styles.optionTextStyle}>Backend repository</Text>
                <View style={styles.buttonStyle}>
                <Button title="Open" onPress={handleBackendPress} buttonStyle={styles.buttonStyle} />
                </View>
            </View>
            <View style={styles.homeButton}>
                    <Button
                      title="Home"
                      buttonStyle={styles.homeButtonStyle}
                      containerStyle={styles.buttonContainer}
                      titleStyle={{ fontWeight: "bold" }}
                      onPress={handleHomePress}
                    />
                  </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgreen',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    buttonContainer: {},
    buttonStyle: {
        borderRadius: 10,
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1,
      },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 20,
        textAlign: 'center',
    },
    homeButtonStyle: {
        backgroundColor: "#004D40",
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 60,
      },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    homeButton: {
        alignSelf: "center",
        justifyContent: "flex-end",
        width: "40%",
        height: 100,
        backgroundColor: colors.transparent,
      
      },
      optionTextStyle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: colors.darkText,
    },
    aboutText: {
        fontSize: 16,
        color: colors.darkText,
    },
});

export default AboutScreen;