
const url = 'http://127.0.0.1:8000';
import { feedback, q_and_a } from './types';

async function fetchResponse(prompt: string): Promise<string> {
    console.log("fetching response");
    const responseURL = url + '/repeat-response';
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

export { fetchResponse, fetchFeedback };
export default {};

