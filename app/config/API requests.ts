
const onAndroid = true; // Variable for accessing localhost on emulator vs local device
const remote = true; // Variable for accessing remote server vs local server

const url = remote ? 'http://18.175.217.103:8000' : (onAndroid ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000');   
import { categorized_question, chat_request, feedback, q_and_a, testing_feedback, testing_feedback_input } from './types';

async function fetchResponse(prompt: string): Promise<string> {
    console.log("fetching response");
    const responseURL = url + '/generate-response';
    const requestBody = { prompt: prompt };

    const response = await fetch(responseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("response: ", response);

    const responseJSON = await response.json();
    const message = responseJSON.response;
    return message;
} 

async function fetchChatResponse(prompt: chat_request): Promise<string> {
    console.log("fetching response");
    const responseURL = url + '/chat';
    const requestBody = prompt;

    const response = await fetch(responseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("response: ", response);

    const responseJSON = await response.json();
    const message = responseJSON.message;
    return message;
} 

async function fetchFeedback(conversation: Array<q_and_a>): Promise<feedback> {
    console.log("fetching feedback");
    const responseURL = url + '/feedback';
    
    const requestBody = { conversation: conversation };
    console.log(requestBody);

    const response = await fetch(responseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    

    const responseJSON = await response.json();
    return responseJSON;
} 

async function categorizeQuestion(question: string): Promise<string> {
    
    const responseURL = url + '/categorize-question';
    
    const requestBody = { question: question};
    

    const response = await fetch(responseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    

    const responseJSON = await response.json();
    const category = responseJSON.message;
    return responseJSON;
} 

async function fetchTestingFeedback(conversation: testing_feedback_input): Promise<testing_feedback> {
    console.log("fetching Testing feedback");
    const responseURL = url + '/testing-feedback';
    
    const requestBody = conversation;
    console.log(requestBody);

    const response = await fetch(responseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    

    const responseJSON = await response.json();
    return responseJSON;
} 

async function fetchQuestion(): Promise<categorized_question> {
    
    const responseURL = url + '/generate-question';
    const response = await fetch(responseURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
       
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    

    const responseJSON = await response.json();
    console.log("category: ", responseJSON.category);
    return responseJSON;
}

async function fetchScenario(): Promise<string> {
    
    const responseURL = url + '/generate-scenario';

    const response = await fetch(responseURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    

    const responseJSON = await response.json();
    const scenario = responseJSON.Scenario;
    return scenario;
}

async function startSession(): Promise<number> {
    
    const responseURL = url + '/start-session';

    const response = await fetch(responseURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    

    const responseJSON = await response.json();
    const session_id = responseJSON.session_id;
    console.log("session_id: ", session_id);
    return session_id;
}

export { fetchResponse, fetchFeedback, categorizeQuestion, fetchQuestion, fetchScenario, startSession, fetchChatResponse, fetchTestingFeedback };
export default {};

