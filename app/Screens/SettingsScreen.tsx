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

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
    const [option1, setOption1] = React.useState(false);
    const [option2, setOption2] = React.useState(false);
    const [option3, setOption3] = React.useState(false);

    const animatedValue1 = useRef(new Animated.Value(0)).current;
    const animatedValue2 = useRef(new Animated.Value(0)).current;
    const animatedValue3 = useRef(new Animated.Value(0)).current;

    

    const handlePress = () => {
        console.log('pressed');
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

    const handleDocsPress = () => {
        Linking.openURL('https://github.com/Evoshrike/LegalLlamaFrontend');
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
            <Text style={styles.header}>Settings Screen</Text>
            <View style={styles.optionContainer}>
                <Text>Option 1</Text>
                <Switch
                    value={option1}
                    onValueChange={() => toggleSwitch(option1, setOption1, animatedValue1)}
                    thumbColor='#f4f3f4'
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                />
            </View>
            <View style={styles.optionContainer}>
                <Text>Option 2</Text>
                <Switch
                    value={option2}
                    onValueChange={() => toggleSwitch(option2, setOption2, animatedValue2)}
                    thumbColor='#f4f3f4'
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                />
            </View>
            <View style={styles.optionContainer}>
                <Text>Option 3</Text>
                <Switch
                    value={option3}
                    onValueChange={() => toggleSwitch(option3, setOption3, animatedValue3)}
                    thumbColor='#f4f3f4'
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                />
            </View>
            <View style={styles.optionContainer}>
                <Text>About App</Text>
                <View style={styles.buttonStyle}>
                <Button title="Docs" onPress={handleDocsPress} buttonStyle={styles.buttonStyle} />
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
});

export default SettingsScreen;