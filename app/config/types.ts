type RootStackParamList = {
    Home: undefined;
    PracticeScreen1: {level: number};
    TestingScreen: { stage: number};
    PracticeScreen2: undefined;
    
  };

type q_and_a = {
    question: string;
    answer: string;
}

type feedback = {
  response: string;
  isCorrect: boolean;
}

type item =  { key: string, label: string }




  export {RootStackParamList, q_and_a, feedback, item};

  export default {}