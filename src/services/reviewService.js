import api from './api';

// Lấy danh sách đánh giá của một sản phẩm
export const getProductReviews = async (productId, page = 0, size = 5) => {
  return await api.get(`/reviews/product/${productId}?page=${page}&size=${size}`);
};

// Lấy danh sách đánh giá của người dùng hiện tại
export const getMyReviews = async (page = 0, size = 10) => {
  return await api.get(`/reviews/my-reviews?page=${page}&size=${size}`);
};

// Lấy thông tin chi tiết một đánh giá theo ID
export const getReviewById = async (id) => {
  return await api.get(`/reviews/${id}`);
};

// Tạo đánh giá mới cho một sản phẩm
export const createReview = async (reviewData) => {
  return await api.post('/reviews', reviewData);
};

// Cập nhật một đánh giá
export const updateReview = async (id, reviewData) => {
  return await api.put(`/reviews/${id}`, reviewData);
};

// Xóa một đánh giá
export const deleteReview = async (id) => {
  return await api.delete(`/reviews/${id}`);
};

// Kiểm tra xem người dùng đã mua sản phẩm này chưa (điều kiện để đánh giá)
export const checkPurchaseStatus = async (productId) => {
  return await api.get(`/reviews/check-purchase/${productId}`);
};

const reviewService = {
  getProductReviews,
  getMyReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  checkPurchaseStatus
};

export default reviewService; 