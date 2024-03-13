import axios from 'axios';
import BASE_URL from 'config';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

export default instance;