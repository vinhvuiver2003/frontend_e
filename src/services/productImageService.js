import api from './api';

/**
 * Upload ảnh cho sản phẩm
 * @param {File} file - File ảnh cần upload
 * @param {number} productId - ID của sản phẩm
 * @param {number|null} variantId - ID của biến thể (null nếu là ảnh chung)
 * @param {boolean} isMainImage - Có phải ảnh chính không
 * @returns {Promise<Object>} - Kết quả API
 */
export const uploadProductImage = async (file, productId, variantId = null, isMainImage = false) => {
  const formData = new FormData();
  formData.append('files', file);
  
  if (variantId) {
    formData.append('variantId', variantId);
  }
  formData.append('isMainImage', isMainImage.toString());
  
  return await api.post(
    `/product-images/upload/${productId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

/**
 * Lấy tất cả ảnh của một sản phẩm
 * @param {number} productId - ID của sản phẩm
 * @returns {Promise<Object>} - Kết quả API
 */
export const getProductImages = async (productId) => {
  return await api.get(`/product-images/product/${productId}/all`);
};

/**
 * Xóa một ảnh sản phẩm và file liên quan
 * @param {number} imageId - ID của ảnh cần xóa
 * @returns {Promise<Object>} - Kết quả API
 */
export const deleteProductImage = async (imageId) => {
  return await api.delete(`/product-images/file/${imageId}`);
};

/**
 * Upload ảnh cho biến thể sản phẩm
 * @param {File} file - File ảnh cần upload
 * @param {number} variantId - ID của biến thể
 * @param {number} productId - ID của sản phẩm
 * @returns {Promise<Object>} - Kết quả API
 */
export const uploadVariantImage = async (file, variantId, productId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('productId', productId);
  
  return await api.post(
    `/product-images/upload/variant/${variantId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

const productImageService = {
  uploadProductImage,
  getProductImages,
  deleteProductImage,
  uploadVariantImage
};

export default productImageService; 