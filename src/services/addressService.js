import api from './api';

/**
 * Lấy tất cả địa chỉ của người dùng hiện tại
 * @returns {Promise<Object>} - Kết quả API
 */
export const getUserAddresses = async () => {
  return await api.get('/user/addresses');
};

/**
 * Thêm địa chỉ mới
 * @param {Object} addressData - Dữ liệu địa chỉ
 * @returns {Promise<Object>} - Kết quả API
 */
export const addAddress = async (addressData) => {
  return await api.post('/user/addresses', addressData);
};

/**
 * Cập nhật địa chỉ
 * @param {number} addressId - ID của địa chỉ
 * @param {Object} addressData - Dữ liệu địa chỉ
 * @returns {Promise<Object>} - Kết quả API
 */
export const updateAddress = async (addressId, addressData) => {
  return await api.put(`/user/addresses/${addressId}`, addressData);
};

/**
 * Xóa địa chỉ
 * @param {number} addressId - ID của địa chỉ
 * @returns {Promise<Object>} - Kết quả API
 */
export const deleteAddress = async (addressId) => {
  return await api.delete(`/user/addresses/${addressId}`);
};

/**
 * Đặt địa chỉ làm mặc định
 * @param {number} addressId - ID của địa chỉ
 * @returns {Promise<Object>} - Kết quả API
 */
export const setDefaultAddress = async (addressId) => {
  return await api.put(`/user/addresses/${addressId}/default`);
};

const addressService = {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};

export default addressService; 