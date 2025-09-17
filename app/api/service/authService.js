// src/api/services/authService.js
import api from '../request';

const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export default authService;
