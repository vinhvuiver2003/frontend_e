import api from './api';

/**
 * Lấy tất cả thương hiệu
 * @returns {Promise<Object>} - Kết quả API
 */
const getAllBrands = async (page = 0, size = 10, sortBy = 'name', sortDir = 'asc') => {
  try {
    const response = await api.get(`/brands?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllBrandsNoPage = async () => {
  try {
    const response = await api.get('/brands/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy thương hiệu theo ID
 * @param {number} id - ID của thương hiệu
 * @returns {Promise<Object>} - Kết quả API
 */
const getBrandById = async (id) => {
  try {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Tạo thương hiệu mới
 * @param {Object} brandData - Dữ liệu thương hiệu
 * @returns {Promise<Object>} - Kết quả API
 */
const createBrand = async (brandData) => {
  try {
    const response = await api.post('/brands', brandData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cập nhật thương hiệu
 * @param {number} id - ID của thương hiệu
 * @param {Object} brandData - Dữ liệu thương hiệu
 * @returns {Promise<Object>} - Kết quả API
 */
const updateBrand = async (id, brandData) => {
  try {
    const response = await api.put(`/brands/${id}`, brandData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Xóa thương hiệu
 * @param {number} id - ID của thương hiệu
 * @returns {Promise<Object>} - Kết quả API
 */
const deleteBrand = async (id) => {
  try {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const brandService = {
  getAllBrands,
  getAllBrandsNoPage,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
};

export default brandService; 