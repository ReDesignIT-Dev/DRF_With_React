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