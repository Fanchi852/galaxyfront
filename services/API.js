
const API_URL = 'http://192.168.0.25:8080/APIGalaxy/resources/';

export const apiRequest = async (endpoint, method, data, usersession) => {

    const cheackSession = async (usersession) => {
        const url = API_URL + 'usersession/checksession';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*',
            },
            body: {"userSession_id":usersession},
        });
        if(response.status === 200){
            return responseData = await response.json();
        }else{
            return false;
        }
    };

    if(usersession === undefined || cheackSession){
        
        const url = API_URL + endpoint;
        console.log("----> PETICION A LA API: Endpoint: ", endpoint, ", method: ", method, ", data: ", JSON.stringify(data, null, 2), ", url: ", url);
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*',
            },
            body: data,
        });
        var responseData;
        if(response.status === 200){
            responseData = await response.json();
        }else{
            responseData = {status: response.status};
        }
        console.log("----> RESPUESTA DE LA API:  response: ", JSON.stringify(responseData, null, 2));

        return responseData;
        
    };
};
    