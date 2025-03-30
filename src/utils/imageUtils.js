import { API_URL } from '../config';

/**
 * Chuyển đổi đường dẫn ảnh tương đối từ server thành URL đầy đủ
 * @param {string} url - Đường dẫn ảnh cần xử lý
 * @param {string} fallback - Ảnh mặc định nếu url không tồn tại
 * @returns {string} URL hoàn chỉnh của ảnh
 */
export const getCompleteImageUrl = (url, fallback = 'https://via.placeholder.com/300x300') => {
    if (!url) return fallback;
    if (url.startsWith('http')) return url;
    if (url.startsWith('blob:')) return url;
    
    // Kiểm tra nếu là đường dẫn products/ (ảnh sản phẩm từ server)
    if (url.startsWith('products/')) {
        // Trả về URL đến static resource handler thay vì API endpoint
        const baseUrl = API_URL.replace('/api', ''); // Bỏ /api
        return `${baseUrl}/images/${url}`;
    }
    
    // Trường hợp mặc định
    return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}; 