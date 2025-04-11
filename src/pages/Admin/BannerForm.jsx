import React, { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';

const BannerForm = ({ banner, onSubmit, onCancel, loading }) => {
    const [formData, setFormData] = useState({
        title: '',
        linkToCategory: '',
        displayOrder: 1,
        isActive: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (banner) {
            setFormData({
                title: banner.title,
                linkToCategory: banner.linkToCategory,
                displayOrder: banner.displayOrder,
                isActive: banner.isActive
            });
            setPreviewUrl(banner.imageUrl);
        }
    }, [banner]);

    const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            const response = await categoryService.getAllCategoriesNoPage();
            console.log("Dữ liệu danh mục:", response);
            
            // Kiểm tra cấu trúc dữ liệu và đảm bảo categories là một mảng
            let categoriesData = [];
            if (Array.isArray(response)) {
                categoriesData = response;
            } else if (response && response.data && Array.isArray(response.data)) {
                categoriesData = response.data;
            } else if (response && typeof response === 'object') {
                // Có thể response là một object chứa nhiều thông tin
                // Thử tìm mảng categories trong response
                const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
                if (possibleArrays.length > 0) {
                    categoriesData = possibleArrays[0];
                }
            }
            
            setCategories(categoriesData);
            console.log("Danh mục đã xử lý:", categoriesData);
        } catch (error) {
            console.error('Lỗi khi tải danh mục:', error);
            setCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Kiểm tra và chuyển đổi displayOrder thành số
        const processedData = {
            ...formData,
            displayOrder: Number(formData.displayOrder)
        };
        
        console.log('Dữ liệu form trước khi gửi:', processedData);
        console.log('File ảnh trước khi gửi:', imageFile);
        
        if (banner) {
            onSubmit(banner.id, processedData, imageFile);
        } else {
            onSubmit(processedData, imageFile);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    {banner ? 'Cập nhật Banner' : 'Thêm Banner mới'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Tiêu đề</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Liên kết đến danh mục</label>
                        <select
                            name="linkToCategory"
                            value={formData.linkToCategory}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                            disabled={loadingCategories}
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {Array.isArray(categories) && categories.map(category => (
                                <option key={category.id} value={`/products?category=${category.id}`}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {loadingCategories && (
                            <p className="text-sm text-gray-500 mt-1">Đang tải danh mục...</p>
                        )}
                        {!loadingCategories && (!Array.isArray(categories) || categories.length === 0) && (
                            <p className="text-sm text-red-500 mt-1">Không thể tải danh mục. Vui lòng thử lại sau.</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Thứ tự hiển thị</label>
                        <input
                            type="number"
                            name="displayOrder"
                            value={formData.displayOrder}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                            min="1"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-gray-700">Đang hoạt động</span>
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Ảnh banner</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-3 py-2 border rounded"
                            required={!banner}
                        />
                        {previewUrl && (
                            <div className="mt-2">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : (banner ? 'Cập nhật' : 'Thêm mới')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BannerForm; 