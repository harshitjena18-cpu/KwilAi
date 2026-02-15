import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.API_PATH}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kwil_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('kwil_auth_token');
      localStorage.removeItem('kwil_user');
      localStorage.removeItem('kwil_onboarding_complete');
      
      // Only redirect if not on auth page
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }
    
    // Handle 403 Forbidden - Insufficient permissions
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
