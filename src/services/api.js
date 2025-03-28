import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Timeout sau 10 giây
});

// Request interceptor - Thêm token vào header
api.interceptors.request.use(
    (config) => {
        console.log(`[API Request] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config.data || config.params);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Xử lý lỗi chung
api.interceptors.response.use(
    (response) => {
        console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
        return response;
    },
    (error) => {
        console.error('[API Response Error]', error.response?.data || error.message);
        
        // Xử lý lỗi 401 Unauthorized - Token hết hạn hoặc không hợp lệ
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Nếu không phải ở trang login, có thể chuyển hướng đến trang login
            if (window.location.pathname !== '/login') {
                console.log('Token hết hạn, chuyển hướng đến trang đăng nhập');
                // window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;