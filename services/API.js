
const API_URL = 'http://192.168.0.21:8080/APIGalaxy/resources/';

export const apiRequest = async (endpoint, method, data) => {
    const url = API_URL + endpoint;
    const jsonData = JSON.stringify(data);
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
        },
        body: jsonData,
    });
    const responseData = await response.json();
    return responseData;
};
    