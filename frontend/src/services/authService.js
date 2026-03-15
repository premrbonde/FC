import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  googleLogin: async (token) => {
    const response = await api.post('/api/auth/google-login', { token });
    return response.data;
  },
};

export default authService;
