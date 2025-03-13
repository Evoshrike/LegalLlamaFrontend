import { useEffect } from "react";
import {
    View,
    Image,
    StyleSheet,
    BackHandler
  } from "react-native";
  
  import colors from "../config/colors";
  import { Button } from '@rneui/base';
  import { RootStackParamList } from "../config/types";
  import { NativeStackScreenProps } from '@react-navigation/native-stack';
  
  type Props = NativeStackScreenProps<RootStackParamList, "Home">;
  
  const WelcomeScreen: React.FC<Props> = ({ navigation, route }) =>  {

    useEffect(() => {
        const backAction = () => {
          BackHandler.exitApp();
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
        <View style={styles.logoContainer}>
          <Image source = {require("../assets/images/llamalogo.png")} style={styles.logo}/>
        </View>
        
        <View style={styles.loginButton} >
        <Button 
                title="PRACTICE"
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainer}
                titleStyle={{ fontWeight: 'bold' }}
                onPress={() => navigation.navigate("MultiChoiceScreen", { highscore: 0, question_type_index: 1 })}
              />
        </View>
        <View style={styles.loginButton} >
        <Button
                title="TESTING"
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainer}
                titleStyle={{ fontWeight: 'bold' }}
                onPress={() => navigation.navigate("TestingScreen", { stage: 1 })}
              />
        </View>
        <View style={styles.registerButton} >
        <Button
                title="HIGH SCORES"
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainer}
                titleStyle={{ fontWeight: 'bold' }}
                onPress={() => navigation.navigate("HighScoresScreen")}
              />
          </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    background: {
      flex: 1,
      flexGrow: 1,
      justifyContent: "flex-end",
      alignItems: 'center',
      backgroundColor: 'lightgreen',
      top: 0
    },
    loginButton: {
      width: "40%",
      height: 100,
      backgroundColor: colors.transparent,
    },
    registerButton: {
      width: "40%",
      height: 200,
      backgroundColor: colors.transparent,
    },
    logo: {
      width: 250,
      height: 250,
      
    },
    logoContainer: {
      position: 'absolute',
      top: 70,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonStyle: {
      backgroundColor: '#004D40',
      borderWidth: 2,
      borderColor: 'white',
      borderRadius: 30,
    },
    buttonContainer: {
      width: 200,
      marginHorizontal: 50,
      marginVertical: 10,
      alignSelf: 'center'
    }
  });
  
  export default WelcomeScreen;
