import axios from 'axios';

// Create an Axios instance with the base URL
const API = axios.create({
  baseURL: 'https://loompanics-backend.vercel.app/api/',
});

// Add a request interceptor to set the Authorization header only if a token exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle the error
  }
);

export default API;
