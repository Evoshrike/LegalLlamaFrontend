type RootStackParamList = {
    Home: undefined;
    EnterQuestionScreen: {level: number};
    TestingScreen: { stage: number};
    DragSortListScreen: undefined;
    MultiChoiceScreen: undefined;
    
  };

type q_and_a = {
    question: string;
    response: string;
}

type categorized_question = {
  question: string;
  category: string;
}

type feedback = {
  response: string;
  is_correct: boolean;
}

type item =  { key: string, label: string }




  export {RootStackParamList, q_and_a, feedback, item, categorized_question};

  export default {}