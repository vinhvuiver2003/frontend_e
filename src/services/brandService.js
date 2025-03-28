import api from './api';

// Lấy tất cả thương hiệu
export const getAllBrands = async () => {
  return await api.get('/brands');
};

// Lấy thương hiệu theo ID
export const getBrandById = async (id) => {
  return await api.get(`/brands/${id}`);
};

// Tạo thương hiệu mới (chỉ ADMIN)
export const createBrand = async (brandData) => {
  return await api.post('/brands', brandData);
};

// Cập nhật thương hiệu (chỉ ADMIN)
export const updateBrand = async (id, brandData) => {
  return await api.put(`/brands/${id}`, brandData);
};

// Xóa thương hiệu (chỉ ADMIN)
export const deleteBrand = async (id) => {
  return await api.delete(`/brands/${id}`);
};

const brandService = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
};

export default brandService; 