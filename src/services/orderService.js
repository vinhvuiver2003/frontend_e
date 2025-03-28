import api from './api';

// Lấy danh sách tất cả đơn hàng (chỉ ADMIN)
export const getAllOrders = async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
  return await api.get(`/orders?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
};

// Lấy thông tin chi tiết một đơn hàng theo ID
export const getOrderById = async (id) => {
  return await api.get(`/orders/${id}`);
};

// Lấy danh sách đơn hàng của người dùng hiện tại
export const getMyOrders = async (page = 0, size = 10) => {
  return await api.get(`/orders/my-orders?page=${page}&size=${size}`);
};

// Lấy danh sách đơn hàng của một người dùng (chỉ ADMIN hoặc chính người dùng đó)
export const getOrdersByUser = async (userId, page = 0, size = 10) => {
  return await api.get(`/orders/user/${userId}?page=${page}&size=${size}`);
};

// Lấy danh sách đơn hàng theo trạng thái (chỉ ADMIN)
export const getOrdersByStatus = async (status) => {
  return await api.get(`/orders/status/${status}`);
};

// Tạo đơn hàng mới từ giỏ hàng (checkout)
export const checkout = async (checkoutData) => {
  return await api.post('/orders/checkout', checkoutData);
};

// Tạo đơn hàng mới (chỉ ADMIN)
export const createOrder = async (orderData) => {
  return await api.post('/orders', orderData);
};

// Cập nhật trạng thái đơn hàng (chỉ ADMIN)
export const updateOrderStatus = async (id, status) => {
  return await api.patch(`/orders/${id}/status?status=${status}`);
};

// Xóa đơn hàng (chỉ ADMIN)
export const deleteOrder = async (id) => {
  return await api.delete(`/orders/${id}`);
};

// Lấy thống kê doanh số (chỉ ADMIN)
export const getSalesStats = async (startDate, endDate) => {
  let url = '/orders/stats/sales';
  if (startDate || endDate) {
    url += '?';
    if (startDate) url += `startDate=${startDate.toISOString()}`;
    if (startDate && endDate) url += '&';
    if (endDate) url += `endDate=${endDate.toISOString()}`;
  }
  return await api.get(url);
};

// Người dùng xác nhận đã nhận hàng
export const confirmDelivery = async (id) => {
  return await api.patch(`/orders/${id}/confirm-delivery`);
};

// Người dùng hủy đơn hàng
export const cancelOrder = async (id, cancelReason) => {
  let url = `/orders/${id}/cancel`;
  if (cancelReason) {
    url += `?cancelReason=${encodeURIComponent(cancelReason)}`;
  }
  return await api.patch(url);
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