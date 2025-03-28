import api from './api';

// Lấy tất cả danh mục
export const getAllCategories = async () => {
  return await api.get('/categories');
};

// Lấy danh mục theo ID
export const getCategoryById = async (id) => {
  return await api.get(`/categories/${id}`);
};

// Lấy danh mục con
export const getSubcategories = async (parentId) => {
  return await api.get(`/categories/parent/${parentId}`);
};

// Lấy các danh mục cấp cao nhất (không có parent)
export const getRootCategories = async () => {
  return await api.get('/categories/roots');
};

// Tạo danh mục mới (chỉ ADMIN)
export const createCategory = async (categoryData) => {
  return await api.post('/categories', categoryData);
};

// Cập nhật danh mục (chỉ ADMIN)
export const updateCategory = async (id, categoryData) => {
  return await api.put(`/categories/${id}`, categoryData);
};

// Xóa danh mục (chỉ ADMIN)
export const deleteCategory = async (id) => {
  return await api.delete(`/categories/${id}`);
};

const categoryService = {
  getAllCategories,
  getCategoryById,
  getSubcategories,
  getRootCategories,
  createCategory,
  updateCategory,
  deleteCategory
};

export default categoryService; 