import axios from 'services/axiosConfig';

export async function postData(endpoint, data) {
    try {
        const response = await axios.post(endpoint, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        throw new Error('Failed to post data');
    }
}

export async function postLogin(username, password, recaptcha) {
    try {

        const authString = `${username}:${password}`;
        const encodedAuthString = btoa(authString);

        const response = await axios.post('login/', { recaptcha: recaptcha }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${encodedAuthString}`,
            },
        });
        return response;
    } catch (error) {
        console.error('Error posting data:', error.response || error.message);
        throw new Error('Failed to post data');
    }
}

export async function getData(endpoint) {
    try {
        const response = await axios.get(endpoint, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        throw new Error('Failed to get data');
    }
}