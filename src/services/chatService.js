import axios from 'axios';
import { API_URL, CHAT_STORAGE_KEY, MAX_CHAT_HISTORY } from '../config';

const chatService = {
  /**
   * Gửi tin nhắn đến chatbot và nhận phản hồi
   * @param {string} message - Tin nhắn người dùng gửi đến chatbot
   * @returns {Promise} - Promise chứa phản hồi từ chatbot
   */
  sendMessage: async (message) => {
    try {
      const response = await axios.post(`${API_URL}/chatbot/ask`, { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      throw error;
    }
  },

  /**
   * Lưu lịch sử chat vào localStorage
   * @param {Array} chatHistory - Mảng chứa lịch sử chat
   */
  saveChatHistory: (chatHistory) => {
    // Giới hạn số lượng tin nhắn trong lịch sử
    const limitedHistory = chatHistory.slice(-MAX_CHAT_HISTORY);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(limitedHistory));
  },

  /**
   * Lấy lịch sử chat từ localStorage
   * @returns {Array} - Mảng chứa lịch sử chat hoặc mảng rỗng nếu không có lịch sử
   */
  getChatHistory: () => {
    const history = localStorage.getItem(CHAT_STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  },

  /**
   * Xóa lịch sử chat từ localStorage
   */
  clearChatHistory: () => {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  }
};

export default chatService; 