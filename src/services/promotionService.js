import api from './api';

/**
 * Kiểm tra mã giảm giá
 * @param {string} code - Mã giảm giá
 * @returns {Promise<Object>} - Kết quả API
 */
const validatePromotion = async (code) => {
  try {
    const response = await api.get(`/promotions/validate-code?code=${code}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy danh sách khuyến mãi đang hoạt động
 * @returns {Promise<Object>} - Kết quả API
 */
const getActivePromotions = async () => {
  try {
    const response = await api.get('/promotions/active');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy khuyến mãi theo mã code
 * @param {string} code - Mã giảm giá
 * @returns {Promise<Object>} - Kết quả API
 */
const getPromotionByCode = async (code) => {
  try {
    const response = await api.get(`/promotions/code/${code}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const promotionService = {
  // Lấy danh sách khuyến mãi với phân trang, tìm kiếm và sắp xếp
  getAllPromotions: async (params = {}) => {
    const { page = 0, size = 10, sortBy = 'id', sortDir = 'asc', search = '' } = params;
    const response = await api.get('/promotions', {
      params: {
        page,
        size,
        sortBy,
        sortDir,
        search
      }
    });
    return response.data;
  },

  // Lấy thông tin chi tiết một khuyến mãi
  getPromotionById: async (id) => {
    const response = await api.get(`/promotions/${id}`);
    return response.data;
  },

  // Tạo khuyến mãi mới
  createPromotion: async (promotionData) => {
    const response = await api.post('/promotions', promotionData);
    return response.data;
  },

  // Cập nhật thông tin khuyến mãi
  updatePromotion: async (id, promotionData) => {
    const response = await api.put(`/promotions/${id}`, promotionData);
    return response.data;
  },

  // Xóa khuyến mãi
  deletePromotion: async (id) => {
    const response = await api.delete(`/promotions/${id}`);
    return response.data;
  },

  // Lấy các khuyến mãi có hiệu lực
  getActivePromotions: async () => {
    const response = await api.get('/promotions/active');
    return response.data;
  },

  // Kiểm tra mã khuyến mãi có hợp lệ không
  validatePromoCode: async (code, cartTotal) => {
    const response = await api.post('/promotions/validate', { code, cartTotal });
    return response.data;
  },

  // Áp dụng khuyến mãi cho đơn hàng
  applyPromotion: async (orderId, promoCode) => {
    const response = await api.post(`/orders/${orderId}/apply-promotion`, { promoCode });
    return response.data;
  },

  validatePromotion,
  getPromotionByCode
};

export default promotionService; 