import api from './api';

// Lấy tất cả phương thức thanh toán
export const getAllPaymentMethods = async () => {
  return await api.get('/payments/methods');
};

// Xử lý thanh toán
export const processPayment = async (paymentData) => {
  return await api.post('/payments/process', paymentData);
};

// Xác nhận thanh toán thành công
export const confirmPayment = async (paymentId, data) => {
  return await api.post(`/payments/confirm/${paymentId}`, data);
};

// Kiểm tra trạng thái thanh toán
export const checkPaymentStatus = async (paymentId) => {
  return await api.get(`/payments/status/${paymentId}`);
};

// Tạo thanh toán mới (cho admin)
export const createPayment = async (paymentData) => {
  return await api.post('/payments', paymentData);
};

// Cập nhật thanh toán (cho admin)
export const updatePayment = async (id, paymentData) => {
  return await api.put(`/payments/${id}`, paymentData);
};

const paymentService = {
  getAllPaymentMethods,
  processPayment,
  confirmPayment,
  checkPaymentStatus,
  createPayment,
  updatePayment
};

export default paymentService; 