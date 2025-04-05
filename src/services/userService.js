import api from './api';

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async () => {
  return api.get('/users/me');
};

// Lấy thông tin người dùng theo ID (ADMIN)
export const getUserById = async (id) => {
  return api.get(`/users/${id}`);
};

// Lấy danh sách người dùng (ADMIN)
export const getAllUsers = async (page = 0, size = 10, sortBy = 'id', sortDir = 'asc', search = '', role = '') => {
  return api.get('/users', {
    params: { page, size, sortBy, sortDir, search, role }
  });
};

// Cập nhật thông tin người dùng
export const updateUser = async (id, userData) => {
  return api.put(`/users/${id}`, userData);
};

// Cập nhật mật khẩu
export const updatePassword = async (passwordData) => {
  return api.post('/users/change-password', passwordData);
};

// Yêu cầu reset mật khẩu
export const requestPasswordReset = async (email) => {
  return api.post('/password-reset/request', { email });
};

// Xác nhận reset mật khẩu
export const confirmPasswordReset = async (token, newPassword) => {
  return api.post('/password-reset/confirm', { token, newPassword });
};

// Xóa người dùng (ADMIN)
export const deleteUser = async (id) => {
  return api.delete(`/users/${id}`);
};

// Cập nhật vai trò người dùng (ADMIN)
export const updateUserRole = async (userId, roleIds) => {
  return api.put(`/users/${userId}/roles`, { roleIds });
};

// Cập nhật thông tin người dùng hiện tại
export const updateCurrentUserProfile = async (userData) => {
  return api.put('/users/profile', userData);
};

// Lấy danh sách người dùng theo vai trò
export const getUsersByRole = async (roleId) => {
  return api.get(`/users/role/${roleId}`);
};

// Khóa/Mở khóa tài khoản người dùng (ADMIN)
export const toggleUserStatus = async (id) => {
  return api.put(`/users/${id}/toggle-status`);
};

// Đặt lại mật khẩu cho người dùng (ADMIN)
export const resetPassword = async (id) => {
  return api.post(`/users/${id}/reset-password`);
};

// Tạo mới người dùng (ADMIN)
export const createUser = async (userData) => {
  return api.post('/users', userData);
};

const userService = {
  getCurrentUser,
  getUserById,
  getAllUsers,
  updateUser,
  updatePassword,
  requestPasswordReset,
  confirmPasswordReset,
  deleteUser,
  updateUserRole,
  updateCurrentUserProfile,
  getUsersByRole,
  toggleUserStatus,
  resetPassword,
  createUser
};

export default userService; 