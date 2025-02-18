
const onAndroid = true; // Variable for accessing localhost on emulator vs local device
const remote = false; // Variable for accessing remote server vs local server

const url = remote ? 'http://35.179.152.82:8000' : (onAndroid ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000');   
import { categorized_question, feedback, q_and_a } from './types';

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
    const scenario = responseJSON.message;
    return scenario;
}

export { fetchResponse, fetchFeedback, categorizeQuestion, fetchQuestion, fetchScenario };
export default {};

