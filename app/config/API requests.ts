async function fetchResponse(prompt: string): Promise<string> {
    console.log("fetching response");
    const url = 'http://127.0.0.1:8000/repeat-response';
    const requestBody = { prompt: prompt };

    const response = await fetch(url, {
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
export { fetchResponse };
export default {};

