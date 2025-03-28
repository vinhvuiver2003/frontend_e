// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Service xử lý các thao tác xác thực và phân quyền
 */
const authService = {
    /**
     * Đăng nhập với username hoặc email và password
     * @param {Object} credentials - Thông tin đăng nhập
     * @param {string} credentials.usernameOrEmail - Username hoặc email
     * @param {string} credentials.password - Mật khẩu
     * @returns {Promise<Object>} - Phản hồi từ server
     */
    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials);
            
            // In ra phản hồi để debug
            console.log('API login response:', response.data);
            
            // Kiểm tra cấu trúc phản hồi
            if (response.data.success && response.data.data) {
                // Lưu token và thông tin người dùng vào localStorage
                if (response.data.data.accessToken) {
                    localStorage.setItem('token', response.data.data.accessToken);
                    localStorage.setItem('user', JSON.stringify(response.data.data.user));
                    
                    // Đánh dấu để hợp nhất giỏ hàng sau khi đăng nhập
                    if (localStorage.getItem('guest_session_id')) {
                        localStorage.setItem('should_merge_cart', 'true');
                    }
                }
            }
            
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error.response?.data || { message: error.message };
        }
    },

    /**
     * Đăng ký tài khoản mới
     * @param {Object} userData - Thông tin người dùng
     * @returns {Promise<Object>} - Phản hồi từ server
     */
    register: async (userData) => {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response;
    },

    /**
     * Cập nhật thông tin người dùng
     * @param {Object} userData - Thông tin cần cập nhật
     * @returns {Promise<Object>} - Phản hồi từ server
     */
    updateProfile: async (userData) => {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/users/profile`, userData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    },

    /**
     * Đổi mật khẩu
     * @param {Object} passwordData - Thông tin mật khẩu
     * @param {string} passwordData.currentPassword - Mật khẩu hiện tại
     * @param {string} passwordData.newPassword - Mật khẩu mới
     * @returns {Promise<Object>} - Phản hồi từ server
     */
    changePassword: async (passwordData) => {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/users/password`, passwordData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    },

    /**
     * Quên mật khẩu - Gửi email đặt lại mật khẩu
     * @param {string} email - Email đăng ký tài khoản
     * @returns {Promise<Object>} - Phản hồi từ server
     */
    forgotPassword: async (email) => {
        const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
        return response;
    },

    /**
     * Đặt lại mật khẩu
     * @param {Object} resetData - Thông tin đặt lại mật khẩu
     * @param {string} resetData.token - Token xác thực từ email
     * @param {string} resetData.newPassword - Mật khẩu mới
     * @returns {Promise<Object>} - Phản hồi từ server
     */
    resetPassword: async (resetData) => {
        const response = await axios.post(`${API_URL}/auth/reset-password`, resetData);
        return response;
    },

    /**
     * Kiểm tra xem người dùng có phải là admin không
     * @param {Object} user - Thông tin người dùng
     * @returns {boolean} - true nếu là admin, ngược lại false
     */
    isAdmin: (user) => {
        if (!user) return false;
        
        // Kiểm tra trong trường hợp API trả về role là một chuỗi đơn
        if (user.role) {
            return user.role === 'ADMIN';
        }
        
        // Kiểm tra trong trường hợp roles là chuỗi (VD: "ADMIN,USER")
        if (typeof user.roles === 'string') {
            const rolesArray = user.roles.split(',');
            return rolesArray.includes('ADMIN') || rolesArray.includes('ROLE_ADMIN');
        }
        
        // Kiểm tra trong trường hợp roles là mảng (VD: ["ADMIN", "USER"])
        if (Array.isArray(user.roles)) {
            return user.roles.includes('ADMIN') || user.roles.includes('ROLE_ADMIN');
        }
        
        return false;
    },

    /**
     * Kiểm tra xem người dùng có vai trò cụ thể không
     * @param {Object} user - Thông tin người dùng
     * @param {string} role - Vai trò cần kiểm tra (ADMIN, USER, MODERATOR,...)
     * @returns {boolean} - true nếu người dùng có vai trò cần kiểm tra, ngược lại false
     */
    hasRole: (user, role) => {
        if (!user) return false;
        
        const normalizedRole = role.replace('ROLE_', '');
        
        // Kiểm tra trong trường hợp API trả về role là một chuỗi đơn
        if (user.role) {
            return user.role === role || user.role === normalizedRole || user.role === 'ROLE_' + normalizedRole;
        }
        
        // Kiểm tra nếu roles là chuỗi
        if (typeof user.roles === 'string') {
            const rolesArray = user.roles.split(',');
            return rolesArray.some(r => 
                r === role || 
                r === normalizedRole || 
                r === 'ROLE_' + normalizedRole
            );
        }
        
        // Kiểm tra nếu roles là mảng
        if (Array.isArray(user.roles)) {
            return user.roles.some(r => 
                r === role || 
                r === normalizedRole || 
                r === 'ROLE_' + normalizedRole
            );
        }
        
        return false;
    },

    /**
     * Kiểm tra xem người dùng có bất kỳ vai trò nào trong danh sách không
     * @param {Object} user - Thông tin người dùng
     * @param {Array<string>} roles - Danh sách vai trò cần kiểm tra
     * @returns {boolean} - true nếu người dùng có ít nhất một vai trò trong danh sách, ngược lại false
     */
    hasAnyRole: (user, roles) => {
        if (!user || !user.roles) return false;
        
        for (const role of roles) {
            if (authService.hasRole(user, role)) {
                return true;
            }
        }
        
        return false;
    }
};

export default authService;