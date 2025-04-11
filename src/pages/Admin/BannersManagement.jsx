import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import bannerService from '../../services/bannerService';
import BannerForm from './BannerForm';

// Base URL cho các tài nguyên tĩnh từ server
const API_BASE_URL = 'http://localhost:8080';

const BannersManagement = () => {
    const [banners, setBanners] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    // Hàm tạo URL đầy đủ cho ảnh
    const getFullImageUrl = (imagePath) => {
        if (!imagePath) return '';
        
        // Nếu đã là URL đầy đủ
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // Thêm đường dẫn truy cập ảnh
        return `${API_BASE_URL}/images/${imagePath}`;
    };

    const fetchBanners = async () => {
        try {
            const response = await bannerService.getAllBanners();
            console.log('Banners fetched:', response);
            setBanners(response || []);
        } catch (error) {
            console.error('Lỗi khi tải danh sách banner:', error);
            toast.error('Lỗi khi tải danh sách banner');
        }
    };

    const handleCreate = async (bannerData, imageFile) => {
        try {
            setLoading(true);
            console.log('Tạo banner với dữ liệu:', bannerData);
            console.log('File ảnh:', imageFile);
            
            if (!imageFile) {
                toast.error('Vui lòng chọn ảnh banner');
                setLoading(false);
                return;
            }
            
            const response = await bannerService.createBanner(bannerData, imageFile);
            console.log('Kết quả tạo banner:', response);
            toast.success('Tạo banner thành công');
            setShowForm(false);
            fetchBanners();
        } catch (error) {
            console.error('Lỗi chi tiết khi tạo banner:', error);
            const errorMessage = error.response?.data?.message || 'Lỗi khi tạo banner';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id, bannerData, imageFile) => {
        try {
            setLoading(true);
            console.log('Cập nhật banner ID:', id);
            console.log('Dữ liệu cập nhật:', bannerData);
            console.log('File ảnh mới:', imageFile);
            
            const response = await bannerService.updateBanner(id, bannerData, imageFile);
            console.log('Kết quả cập nhật banner:', response);
            toast.success('Cập nhật banner thành công');
            setShowForm(false);
            setSelectedBanner(null);
            fetchBanners();
        } catch (error) {
            console.error('Lỗi chi tiết khi cập nhật banner:', error);
            const errorMessage = error.response?.data?.message || 'Lỗi khi cập nhật banner';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
            try {
                setLoading(true);
                await bannerService.deleteBanner(id);
                toast.success('Xóa banner thành công');
                fetchBanners();
            } catch (error) {
                console.error('Lỗi khi xóa banner:', error);
                toast.error('Lỗi khi xóa banner');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEdit = (banner) => {
        setSelectedBanner(banner);
        setShowForm(true);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý Banner</h1>
                <button
                    onClick={() => {
                        setSelectedBanner(null);
                        setShowForm(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Thêm Banner
                </button>
            </div>

            {showForm && (
                <BannerForm
                    banner={selectedBanner ? {
                        ...selectedBanner,
                        imageUrl: getFullImageUrl(selectedBanner.imageUrl)
                    } : null}
                    onSubmit={selectedBanner ? handleUpdate : handleCreate}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedBanner(null);
                    }}
                    loading={loading}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => (
                    <div key={banner.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img
                            src={getFullImageUrl(banner.imageUrl)}
                            alt={banner.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                                console.error('Lỗi tải ảnh:', banner.imageUrl);
                                e.target.src = 'https://via.placeholder.com/400x200?text=Lỗi+ảnh';
                            }}
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2">{banner.title}</h3>
                            <p className="text-gray-600 mb-2">Link: {banner.linkToCategory}</p>
                            <p className="text-gray-600 mb-2">Thứ tự: {banner.displayOrder}</p>
                            <p className="text-gray-600 mb-4">
                                Trạng thái: {banner.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                            </p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => handleEdit(banner)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(banner.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BannersManagement; 