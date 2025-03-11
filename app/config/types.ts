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
  message: string;
  is_correct: boolean;
  is_half_correct: boolean;
  score: number; 
}

type testing_feedback_input = {
  question_1: string;
  response: string;
  question_2: string;
};

type testing_feedback = {
  q_type: string;
  q_stage: number;
  context_switch: boolean;
}

type item =  { key: string, label: string }

type highscore = {
  score: number,
  date: string
}

type categorize_response = {
  question_type: string;
  confidence: number;
}




  export {RootStackParamList, q_and_a, feedback, item, 
    categorized_question, chat_request, testing_feedback_input, testing_feedback, highscore, categorize_response};

  export default {}