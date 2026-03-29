import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

const guestAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  console.log('Interceptor - Token found:', token ? 'Yes' : 'No');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export { API, guestAPI };
export default API;

export const apiCall = async (config, useGuest = false) => {
  const instance = useGuest ? guestAPI : API;
  try {
    const res = await instance(config);
    return res.data;
  } catch (error) {
    console.error('API Call Failed:', {
      url: config.url,
      method: config.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

