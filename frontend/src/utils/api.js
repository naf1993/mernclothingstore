import axios from 'axios';
import { apiUrl } from '../actions/apiUrl';

// Create an Axios instance
const api = axios.create({
  baseURL: apiUrl, // Your API base URL
  withCredentials: true, // Include cookies with requests
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // Check for the Authorization header
    const token = response.headers['authorization'];
    if (token) {
      const jwtToken = token.split(' ')[1]; // Extract the JWT token
      // Store the token in local storage or a non-httpOnly cookie
      localStorage.setItem('token', jwtToken);
      console.log('Token stored in local storage:', jwtToken);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
