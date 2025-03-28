import api from './api';

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async () => {
  return await api.get('/auth/me');
};

// Lấy thông tin người dùng theo ID (ADMIN)
export const getUserById = async (id) => {
  return await api.get(`/users/${id}`);
};

// Lấy danh sách người dùng (ADMIN)
export const getAllUsers = async (page = 0, size = 10) => {
  return await api.get(`/users?page=${page}&size=${size}`);
};

// Cập nhật thông tin người dùng
export const updateUser = async (id, userData) => {
  return await api.put(`/users/${id}`, userData);
};

// Cập nhật mật khẩu
export const updatePassword = async (passwordData) => {
  return await api.post('/users/change-password', passwordData);
};

// Yêu cầu reset mật khẩu
export const requestPasswordReset = async (email) => {
  return await api.post('/password-reset/request', { email });
};

// Xác nhận reset mật khẩu
export const confirmPasswordReset = async (token, newPassword) => {
  return await api.post('/password-reset/confirm', { token, newPassword });
};

// Xóa người dùng (ADMIN)
export const deleteUser = async (id) => {
  return await api.delete(`/users/${id}`);
};

// Cập nhật vai trò người dùng (ADMIN)
export const updateUserRole = async (userId, roleIds) => {
  return await api.put(`/users/${userId}/roles`, { roleIds });
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
  updateUserRole
};

export default userService; 