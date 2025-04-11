import axios from 'axios';

const API_URL = 'http://localhost:8080/api/banners';

// Hàm loại bỏ undefined từ object
const removeUndefined = (obj) => {
    const result = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] !== undefined) {
            result[key] = obj[key];
        }
    });
    return result;
};

const bannerService = {
    getAllBanners: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createBanner: async (bannerData, imageFile) => {
        try {
            // Đảm bảo tất cả dữ liệu đều đúng định dạng
            const cleanData = removeUndefined({
                title: bannerData.title || '',
                linkToCategory: bannerData.linkToCategory || '',
                displayOrder: Number(bannerData.displayOrder) || 1,
                isActive: bannerData.isActive !== undefined ? bannerData.isActive : true
            });
            
            console.log('Dữ liệu banner sau khi làm sạch:', cleanData);
            
            const formData = new FormData();
            
            // Đóng gói dữ liệu banner dưới dạng JSON string
            formData.append('banner', new Blob([JSON.stringify(cleanData)], {
                type: 'application/json'
            }));
            
            // Thêm file ảnh
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi tạo banner:', error);
            throw error;
        }
    },

    updateBanner: async (id, bannerData, imageFile) => {
        try {
            // Đảm bảo tất cả dữ liệu đều đúng định dạng
            const cleanData = removeUndefined({
                title: bannerData.title || '',
                linkToCategory: bannerData.linkToCategory || '',
                displayOrder: Number(bannerData.displayOrder) || 1,
                isActive: bannerData.isActive !== undefined ? bannerData.isActive : true
            });
            
            console.log('Dữ liệu banner sau khi làm sạch:', cleanData);
            
            const formData = new FormData();
            
            // Đóng gói dữ liệu banner dưới dạng JSON string
            formData.append('banner', new Blob([JSON.stringify(cleanData)], {
                type: 'application/json'
            }));
            
            // Thêm file ảnh nếu có
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await axios.put(`${API_URL}/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi cập nhật banner:', error);
            throw error;
        }
    },

    deleteBanner: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default bannerService; 