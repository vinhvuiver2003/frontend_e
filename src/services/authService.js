// src/services/authService.js
import api from './api';

const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    logout: () => {
        // Phương thức này chỉ xóa token ở frontend, không cần gọi API
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    updateProfile: async (userData) => {
        try {
            const response = await api.put(`/users/${userData.id || 'me'}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }}
};

export default authService;