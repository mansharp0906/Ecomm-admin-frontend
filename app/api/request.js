// src/api/request.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor (for adding tokens)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor (for error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    // Handle token expiration
    if (error.response?.status === 401) {
      // Don't force a redirect for authentication endpoints themselves (login/register)
      // so that login components can handle 401 responses and show proper messages
      const requestUrl = error.config?.url || '';
      const isAuthEndpoint = /\/auth\/(login|register)/i.test(requestUrl);

      localStorage.removeItem('token');

      if (!isAuthEndpoint) {
        // Redirect to login page for other endpoints when token is expired/unauthorized
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
