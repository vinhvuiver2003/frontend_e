import api from './api';

// Lấy danh sách tất cả sản phẩm với phân trang
export const getAllProducts = async (page = 0, size = 12, sortBy = 'id', sortDir = 'desc') => {
  return await api.get(`/products?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
};

// Lấy thông tin chi tiết một sản phẩm theo ID
export const getProductById = async (id) => {
  return await api.get(`/products/${id}`);
};

// Lấy danh sách sản phẩm theo danh mục
export const getProductsByCategory = async (categoryId, page = 0, size = 12, sortBy = 'id', sortDir = 'desc') => {
  return await api.get(`/products/category/${categoryId}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
};

// Lấy danh sách sản phẩm theo thương hiệu
export const getProductsByBrand = async (brandId, page = 0, size = 12, sortBy = 'id', sortDir = 'desc') => {
  return await api.get(`/products/brand/${brandId}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
};

// Tìm kiếm sản phẩm theo từ khóa
export const searchProducts = async (keyword, page = 0, size = 12, sortBy = 'id', sortDir = 'desc') => {
  return await api.get(`/products/search?keyword=${keyword}&page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
};

// Lọc sản phẩm theo khoảng giá
export const filterProductsByPrice = async (minPrice, maxPrice, page = 0, size = 12, sortBy = 'id', sortDir = 'desc') => {
  return await api.get(`/products/filter/price?minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
};

// Lấy danh sách sản phẩm mới nhất
export const getNewArrivals = async (limit = 8) => {
  return await api.get(`/products/new-arrivals?limit=${limit}`);
};

// Lấy danh sách sản phẩm được đánh giá cao nhất
export const getTopRatedProducts = async (limit = 8) => {
  return await api.get(`/products/top-rated?limit=${limit}`);
};

// Lấy danh sách sản phẩm có tồn kho thấp (chỉ ADMIN)
export const getLowStockProducts = async (threshold = 10) => {
  return await api.get(`/products/low-stock?threshold=${threshold}`);
};

// Tạo mới một sản phẩm (chỉ ADMIN)
export const createProduct = async (productData) => {
  return await api.post('/products', productData);
};

// Cập nhật thông tin một sản phẩm (chỉ ADMIN)
export const updateProduct = async (id, productData) => {
  return await api.put(`/products/${id}`, productData);
};

// Xóa một sản phẩm (chỉ ADMIN)
export const deleteProduct = async (id) => {
  return await api.delete(`/products/${id}`);
};

const productService = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsByBrand,
  searchProducts,
  filterProductsByPrice,
  getNewArrivals,
  getTopRatedProducts,
  getLowStockProducts,
  createProduct,
  updateProduct,
  deleteProduct
};

export default productService; 