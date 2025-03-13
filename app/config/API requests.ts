
const onAndroid = false; 
const remote = true; 
const timeout = 10000; 



const url = remote ? 'http://18.130.224.226:8000' : (onAndroid ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000');   
import { calculateFeedback } from './Feedback';
import { categorize_response, categorized_question, chat_request, feedback, q_and_a, testing_feedback, testing_feedback_input, testing_feedback_report } from './types';

async function fetchResponse(prompt: string): Promise<string> {
    
    const responseURL = url + '/generate-response';
    const requestBody = { prompt: prompt };

   
     const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout')), timeout) 
    );
    const response = await Promise.race([
        fetch(responseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }),
        timeoutPromise
    ]);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    

    const responseJSON = await response.json();
    const message = responseJSON.response;
    return message;
} 

async function fetchChatResponse(prompt: chat_request): Promise<string> {
    
    const responseURL = url + '/chat';
    const requestBody = prompt;

     // Create a timeout promise, race against response promise, throw err if no response in 5s
     const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout')), timeout) 
    );
    const response = await Promise.race([
        fetch(responseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }),
        timeoutPromise
    ]);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    

    const responseJSON = await response.json();
    const message = responseJSON.message;
    return message;
} 

async function fetchFeedback(conversation: Array<q_and_a>, listFeedback: Array<testing_feedback_report>, stage: number): Promise<feedback> {
 
    const responseURL = url + '/end-stage-feedback';
    
    const requestBody = { responses: conversation };


     // Create a timeout promise, race against response promise, throw err if no response in 5s
     const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout')), timeout) 
    );
    const response = await Promise.race([
        fetch(responseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }),
        timeoutPromise
    ]);

    if (!response.ok) {
        
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    

    const responseJSON = await response.json();
    // Score calculated from the sum of all the live feedback responses, as opposed to the seperate API call to end stage feedback
    const internalFeedback = calculateFeedback(listFeedback, responseJSON, stage);
    const score = internalFeedback.score;
    let feedback = { is_correct: false, is_half_correct: false, message: "You have switched context! Try again, and try to avoid this.", score: score };
    
        if (score > 8)
            { feedback = { is_correct: true, is_half_correct: false, message: "Good job!", score: score }; 
             
            }
        else if (score > 4 && score < 9)
            { feedback = { is_correct: false, is_half_correct: true, message: "Almost there!", score: score };
            
            }
    
 
    return feedback;
} 

async function categorizeQuestion(question: string): Promise<categorize_response> {
   
    const responseURL = url + '/categorize-question';
    const requestBody = { question: question};
    
     // Create a timeout promise, race against response promise, throw err if no response in 5s
     const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout')), timeout) 
    );
    const response = await Promise.race([
        fetch(responseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }),
        timeoutPromise
    ]);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    

    const responseJSON = await response.json();
  
    return responseJSON;
} 

async function fetchTestingFeedback(conversation: testing_feedback_input): Promise<testing_feedback> {

    const responseURL = url + '/live-feedback';
    
    const requestBody = conversation;


        // Create a timeout promise, race against response promise, throw err if no response in 5s
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Network timeout')), timeout) 
        );
        const response = await Promise.race([
            fetch(responseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }),
            timeoutPromise
        ]);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    

    const responseJSON = await response.json();
   
    return responseJSON;
} 

async function fetchQuestion(): Promise<categorized_question> {

    const responseURL = url + '/generate-question';

    // Create a timeout promise, race against response promise, throw err if no response in 5s
    const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout')), timeout) 
    );
    const response = await Promise.race([
        fetch(responseURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }),
        timeoutPromise
    ]);

    if (!response.ok) {
        
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseJSON = await response.json();
    
    return responseJSON;
}

async function fetchScenario(): Promise<string> {
    
    const responseURL = url + '/generate-scenario';

     // Create a timeout promise, race against response promise, throw err if no response in 5s
     const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout')), timeout) 
    );
    const response = await Promise.race([
        fetch(responseURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }),
        timeoutPromise
    ]);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    

    const responseJSON = await response.json();
    const scenario = responseJSON.Scenario;
    return scenario;
}

async function startSession(): Promise<number> {
    
    const responseURL = url + '/start-session';

    // Create a timeout promise, race against response promise, throw err if no response in 5s
    const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout')), timeout) 
    );
    const response = await Promise.race([
        fetch(responseURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }),
        timeoutPromise
    ]);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    

    const responseJSON = await response.json();
    const session_id = responseJSON.session_id;
    
    return session_id;
}

export { fetchResponse, fetchFeedback, categorizeQuestion, fetchQuestion, fetchScenario, startSession, fetchChatResponse, fetchTestingFeedback };
export default {};

