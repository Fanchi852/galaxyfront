
const API_URL = 'http://192.168.0.27:8080/APIGalaxy/resources/';

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
        console.log("este es el endpoint: ", endpoint, "este es el method: ", method, "este es el data: ", data, "este es el url: ", url);
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
        console.log("este es el response desde la api: ", responseData);

        return responseData;
        
    };
};
    