import { feedback, testing_feedback, testing_feedback_report } from "./types";

const calculateFeedback = (live_feedback: Array<testing_feedback_report>, end_feedback: feedback, q_stage: number) => {
   
    let total_bad = 0;
    for (let i = 0; i < live_feedback.length; i++) {
        if (live_feedback[i].context_switch) {
            total_bad++;
           
        }
        if (live_feedback[i].q_type[0] === "Suggestive" && live_feedback[i].type_confidence > 0.75) {
            total_bad++;
          
        }
        if ((live_feedback[i].q_stage % 2 != q_stage % 2) && live_feedback[i].stage_confidence > 0.75) {
            total_bad++;
           
        }
    }
   
    const rate_bad = total_bad / (3*live_feedback.length);
    const rate_good = 1 - rate_bad; 
    const score = Math.floor(rate_good * 10);
    return {score: score};

};

export {calculateFeedback};

export default {};