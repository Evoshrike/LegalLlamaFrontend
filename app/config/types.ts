type RootStackParamList = {
    Home: undefined;
    PracticeScreen1: undefined;
    TestingScreen: { stage: number};
    
  };

type q_and_a = {
    question: string;
    answer: string;
}

type feedback = {
  response: string;
  isCorrect: boolean;
}

  export {RootStackParamList, q_and_a, feedback};

  export default {}