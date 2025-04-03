import api from './api';

/**
 * Lấy tất cả đơn hàng (admin)
 * @param {number} page - Trang hiện tại
 * @param {number} size - Số lượng đơn hàng mỗi trang
 * @returns {Promise<Object>} - Kết quả API
 */
export const getAllOrders = async (page = 0, size = 10) => {
  return await api.get(`/orders?page=${page}&size=${size}`);
};

/**
 * Lấy đơn hàng theo ID
 * @param {number} id - ID của đơn hàng
 * @returns {Promise<Object>} - Kết quả API
 */
export const getOrderById = async (id) => {
  return await api.get(`/orders/${id}`);
};

/**
 * Lấy đơn hàng của người dùng hiện tại
 * @param {number} page - Trang hiện tại
 * @param {number} size - Số lượng đơn hàng mỗi trang
 * @returns {Promise<Object>} - Kết quả API
 */
export const getMyOrders = async (page = 0, size = 10) => {
  return await api.get(`/orders/my-orders?page=${page}&size=${size}`);
};

/**
 * Thanh toán giỏ hàng (checkout)
 * @param {Object} checkoutData - Dữ liệu thanh toán
 * @returns {Promise<Object>} - Kết quả API
 */
export const checkout = async (checkoutData) => {
  return await api.post('/orders/checkout', checkoutData);
};

/**
 * Tạo đơn hàng mới
 * @param {Object} orderData - Dữ liệu đơn hàng
 * @returns {Promise<Object>} - Kết quả API
 */
export const createOrder = async (orderData) => {
  return await api.post('/orders', orderData);
};

/**
 * Lấy đơn hàng của một người dùng cụ thể (admin)
 * @param {number} userId - ID của người dùng
 * @param {number} page - Trang hiện tại
 * @param {number} size - Số lượng đơn hàng mỗi trang
 * @returns {Promise<Object>} - Kết quả API
 */
export const getOrdersByUser = async (userId, page = 0, size = 10) => {
  return await api.get(`/orders/user/${userId}?page=${page}&size=${size}`);
};

/**
 * Lấy đơn hàng theo trạng thái
 * @param {string} status - Trạng thái đơn hàng
 * @returns {Promise<Object>} - Kết quả API
 */
export const getOrdersByStatus = async (status) => {
  return await api.get(`/orders/status/${status}`);
};

/**
 * Cập nhật trạng thái đơn hàng (admin)
 * @param {number} id - ID của đơn hàng
 * @param {string} status - Trạng thái mới
 * @returns {Promise<Object>} - Kết quả API
 */
export const updateOrderStatus = async (id, status) => {
  return await api.patch(`/orders/${id}/status?status=${status}`);
};

/**
 * Xóa đơn hàng (admin)
 * @param {number} id - ID của đơn hàng
 * @returns {Promise<Object>} - Kết quả API
 */
export const deleteOrder = async (id) => {
  return await api.delete(`/orders/${id}`);
};

/**
 * Xác nhận đã nhận được hàng
 * @param {number} id - ID của đơn hàng
 * @returns {Promise<Object>} - Kết quả API
 */
export const confirmDelivery = async (id) => {
  return await api.put(`/orders/${id}/confirm-delivery`);
};

/**
 * Hủy đơn hàng
 * @param {number} id - ID của đơn hàng
 * @param {string} reason - Lý do hủy đơn hàng
 * @returns {Promise<Object>} - Kết quả API
 */
export const cancelOrder = async (id, reason) => {
  return await api.patch(`/orders/${id}/cancel?cancelReason=${encodeURIComponent(reason || '')}`);
};

/**
 * Lấy thống kê bán hàng
 * @param {string} startDate - Ngày bắt đầu (YYYY-MM-DD)
 * @param {string} endDate - Ngày kết thúc (YYYY-MM-DD)
 * @returns {Promise<Object>} - Kết quả API
 */
export const getSalesStats = async (startDate, endDate) => {
  return await api.get(`/orders/stats?startDate=${startDate}&endDate=${endDate}`);
};

const orderService = {
  getAllOrders,
  getOrderById,
  getMyOrders,
  getOrdersByUser,
  getOrdersByStatus,
  checkout,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getSalesStats,
  confirmDelivery,
  cancelOrder
};

export default orderService; 