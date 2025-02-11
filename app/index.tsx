
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import { enableScreens } from 'react-native-screens';
import WelcomeScreen from "./Screens/WelcomeScreen";
import { RootStackParamList } from "./config/types";
import PracticeScreen1 from "./Screens/PracticeScreen1";
import TestingScreen from "./Screens/TestingScreen";

console.log("app loading..");
enableScreens();

const App = () => {
  console.log("We got to APP");
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (

    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e", // Customize the background color
        },
        statusBarTranslucent: true,
        headerShown: false,
        

        headerTintColor: "#fff", // Customize the back button and title color
        headerTitleStyle: {
          fontWeight: "bold", // Customize the font style
          color: "#fff",
        },
      }}
    >
      <Stack.Screen name="Home" component={WelcomeScreen} />
      <Stack.Screen name="PracticeScreen1" component={PracticeScreen1} />
      <Stack.Screen name="TestingScreen" component={TestingScreen} />
 
    </Stack.Navigator>

  );
};

export default App;