import api from './api';

/**
 * Lấy tất cả danh mục
 * @param {number} page - Trang hiện tại
 * @param {number} size - Số lượng danh mục trên mỗi trang
 * @param {string} sortBy - Trường sắp xếp
 * @param {string} sortDir - Hướng sắp xếp
 * @returns {Promise<Object>} - Kết quả API
 */
const getAllCategories = async (page = 0, size = 10, sortBy = 'name', sortDir = 'asc') => {
  try {
    const response = await api.get(`/categories?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy tất cả danh mục không phân trang
 * @returns {Promise<Object>} - Kết quả API
 */
const getAllCategoriesNoPage = async () => {
  try {
    const response = await api.get('/categories/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy danh mục cha
 * @returns {Promise<Object>} - Kết quả API
 */
const getParentCategories = async () => {
  try {
    const response = await api.get('/categories/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy danh mục con
 * @param {number} parentId - ID của danh mục cha
 * @returns {Promise<Object>} - Kết quả API
 */
const getSubcategories = async (parentId) => {
  try {
    const response = await api.get(`/categories/${parentId}/subcategories`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy danh mục theo ID
 * @param {number} id - ID của danh mục
 * @returns {Promise<Object>} - Kết quả API
 */
const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Tạo danh mục mới
 * @param {Object} categoryData - Dữ liệu danh mục
 * @returns {Promise<Object>} - Kết quả API
 */
const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cập nhật danh mục
 * @param {number} id - ID của danh mục
 * @param {Object} categoryData - Dữ liệu danh mục
 * @returns {Promise<Object>} - Kết quả API
 */
const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Xóa danh mục
 * @param {number} id - ID của danh mục
 * @returns {Promise<Object>} - Kết quả API
 */
const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const categoryService = {
  getAllCategories,
  getAllCategoriesNoPage,
  getParentCategories,
  getSubcategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};

export default categoryService; 