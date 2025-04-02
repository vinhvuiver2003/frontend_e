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
  validatePromotion,
  getActivePromotions,
  getPromotionByCode
};

export default promotionService; 