
const API_URL = 'http://192.168.0.21:8080/APIGalaxy/resources/';

export const apiRequest = async (endpoint, method, data) => {
    const url = API_URL + endpoint;
    console.log("este es el endpoint: ", endpoint, "este es el method: ", method, "este es el data: ", data, "este es el url: ", url);
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
        },
        body: data,
    });
    const responseData = await response.json();
    return responseData;
};
    