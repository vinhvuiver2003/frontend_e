// Cấu hình chung cho ứng dụng

// API URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Cấu hình cho các request API
export const API_TIMEOUT = 15000; // 15 giây

// Cấu hình cho phân trang
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

// Cấu hình cho upload ảnh
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Cấu hình cho chatbot
export const CHAT_STORAGE_KEY = 'chatHistory';
export const MAX_CHAT_HISTORY = 50; // Số tin nhắn tối đa lưu trong lịch sử

// Các cấu hình khác
export const APP_NAME = 'Shop Thời Trang';
export const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/150'; 