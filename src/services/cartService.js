import api from './api';

// Lấy giỏ hàng của người dùng đã đăng nhập
export const getMyCart = async () => {
  return await api.get('/cart/my-cart');
};

// Lấy giỏ hàng của khách (chưa đăng nhập) theo sessionId
export const getGuestCart = async (sessionId) => {
  return await api.get(`/cart/guest-cart?sessionId=${sessionId}`);
};

// Lấy giỏ hàng theo ID
export const getCartById = async (id) => {
  return await api.get(`/cart/${id}`);
};

// Thêm sản phẩm vào giỏ hàng
export const addItemToCart = async (cartId, cartItemData) => {
  return await api.post(`/cart/${cartId}/items`, cartItemData);
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (cartId, itemId, quantity) => {
  return await api.put(`/cart/${cartId}/items/${itemId}?quantity=${quantity}`);
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeItemFromCart = async (cartId, itemId) => {
  return await api.delete(`/cart/${cartId}/items/${itemId}`);
};

// Xóa tất cả sản phẩm trong giỏ hàng
export const clearCart = async (cartId) => {
  return await api.delete(`/cart/${cartId}/clear`);
};

// Chuyển đổi giỏ hàng khách thành giỏ hàng của người dùng sau khi đăng nhập
export const mergeGuestCart = async (sessionId) => {
  return await api.post(`/cart/merge?sessionId=${sessionId}`);
};

// Tạo hoặc lấy sessionId cho khách
export const generateSessionId = () => {
  let sessionId = localStorage.getItem('guest_session_id');
  if (!sessionId) {
    sessionId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('guest_session_id', sessionId);
  }
  return sessionId;
};

const cartService = {
  getMyCart,
  getGuestCart,
  getCartById,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
  mergeGuestCart,
  generateSessionId
};

export default cartService; 