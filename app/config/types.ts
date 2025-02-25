type RootStackParamList = {
    Home: undefined;
    Settings: undefined;
    EnterQuestionScreen: {question_type_index: number, highscore: number, successiveQuestionCount: number};
    TestingScreen: { stage: number, };
    DragSortListScreen: undefined;
    // MultiChoiceScreen does not need question_type_index, it just carries it to pass to 
    // EnterQuestionScreen.
    MultiChoiceScreen: {question_type_index: number, highscore: number};
    
  };

type q_and_a = {
    question: string;
    response: string;
}
type chat_request = {
  message: string; 
  scenario: string;
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




  export {RootStackParamList, q_and_a, feedback, item, categorized_question, chat_request};

  export default {}