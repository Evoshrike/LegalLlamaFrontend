
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import { enableScreens } from 'react-native-screens';
import WelcomeScreen from "./Screens/WelcomeScreen";
import { RootStackParamList } from "./config/types";
import PracticeScreen1 from "./Screens/EnterQuestionScreen";
import TestingScreen from "./Screens/TestingScreen";
import PracticeScreen2 from "./Screens/DragSortListScreen";
import EnterQuestionScreen from "./Screens/EnterQuestionScreen";
import MultiChoiceScreen from "./Screens/MultiChoiceScreen";
import DragSortListScreen from "./Screens/DragSortListScreen";
import SettingsScreen from "./Screens/AboutScreen";
import HighScoresScreen from "./Screens/HighScoresScreen";
import { initHighScores } from "./config/PersistentState";


enableScreens();

const App = () => {

  initHighScores();
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (

    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        statusBarTranslucent: true,
        headerShown: false,
        

        headerTintColor: "#fff", 
        headerTitleStyle: {
          fontWeight: "bold", 
          color: "#fff",
        },
      }}
    >
      <Stack.Screen name="Home" component={WelcomeScreen} />
      <Stack.Screen name="EnterQuestionScreen" component={EnterQuestionScreen} />
      <Stack.Screen name="TestingScreen" component={TestingScreen} />
      <Stack.Screen name="MultiChoiceScreen" component={MultiChoiceScreen} />
      <Stack.Screen name="DragSortListScreen" component={DragSortListScreen} />
      <Stack.Screen name="AboutScreen" component={SettingsScreen} />
      <Stack.Screen name="HighScoresScreen" component={HighScoresScreen} />
    </Stack.Navigator>

  );
};

export default App;