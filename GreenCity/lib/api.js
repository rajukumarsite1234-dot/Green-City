import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your actual backend IP
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          refreshToken
        });
        
        const { token, refreshToken: newRefreshToken } = response.data;
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);
        
        // Update the Authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Retry the original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (error) {
        // If refresh token fails, clear storage and redirect to login
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('refreshToken');
        // You might want to redirect to login screen here
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
