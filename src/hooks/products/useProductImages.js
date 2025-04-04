import { useState, useRef, useCallback } from 'react';
import productImageService from '../../services/productImageService';

/**
 * Hook quản lý hình ảnh sản phẩm
 * 
 * @param {boolean} isEditMode - Chế độ chỉnh sửa hay thêm mới
 * @returns {Object} Các state và hàm xử lý cho quản lý hình ảnh
 */
const useProductImages = (isEditMode) => {
  // State quản lý danh sách hình ảnh
  const [images, setImages] = useState([]);
  
  // State quản lý lỗi hình ảnh
  const [imageErrors, setImageErrors] = useState([]);
  
  // Ref cho input file
  const fileInputRef = useRef(null);
  
  // Khởi tạo hình ảnh từ sản phẩm
  const initializeImages = useCallback(async (product) => {
    if (product && product.id) {
      try {
        const productImages = await productImageService.getProductImages(product.id);
        
        if (productImages && productImages.length > 0) {
          // Chuyển đổi dữ liệu hình ảnh từ API
          const formattedImages = productImages.map(img => ({
            id: img.id,
            url: img.url,
            name: img.name || 'product-image.jpg',
            isMain: img.isMain || false,
            file: null, // Không có file thực khi tải từ server
            isExisting: true, // Đánh dấu là hình ảnh đã tồn tại
          }));
          
          setImages(formattedImages);
        }
      } catch (error) {
        console.error('Error fetching product images:', error);
        setImageErrors(['Không thể tải hình ảnh sản phẩm. Vui lòng thử lại sau.']);
      }
    }
  }, []);
  
  // Xử lý upload hình ảnh
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const errors = [];
    
    // Kiểm tra số lượng hình ảnh
    if (images.length + files.length > 10) {
      errors.push('Chỉ được phép tải lên tối đa 10 hình ảnh.');
      setImageErrors(errors);
      return;
    }
    
    // Xử lý từng file
    const newImages = files.map(file => {
      // Kiểm tra dung lượng (5MB)
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`Hình ảnh ${file.name} vượt quá dung lượng cho phép (5MB).`);
        return null;
      }
      
      // Kiểm tra định dạng
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        errors.push(`Hình ảnh ${file.name} không đúng định dạng (chỉ chấp nhận JPG, PNG, WEBP).`);
        return null;
      }
      
      return {
        id: `temp-${Date.now()}-${file.name}`,
        name: file.name,
        url: URL.createObjectURL(file),
        file: file,
        isMain: images.length === 0, // Hình ảnh đầu tiên là hình chính
        isExisting: false
      };
    }).filter(Boolean);
    
    // Cập nhật state
    if (newImages.length > 0) {
      setImages(prevImages => [...prevImages, ...newImages]);
    }
    
    // Cập nhật lỗi nếu có
    if (errors.length > 0) {
      setImageErrors(errors);
    } else {
      setImageErrors([]);
    }
    
    // Reset input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Xóa hình ảnh
  const handleRemoveImage = useCallback((id) => {
    // Tìm hình ảnh cần xóa
    const imageToRemove = images.find(img => img.id === id);
    
    if (imageToRemove) {
      // Nếu là URL từ object, thu hồi để tránh rò rỉ bộ nhớ
      if (imageToRemove.url && imageToRemove.url.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      
      // Kiểm tra nếu là hình ảnh chính và hình ảnh khác tồn tại
      if (imageToRemove.isMain && images.length > 1) {
        // Tìm hình ảnh đầu tiên khác hình hiện tại
        const nextMainImage = images.find(img => img.id !== id);
        if (nextMainImage) {
          // Thiết lập hình ảnh đó làm hình chính
          setImages(prevImages => 
            prevImages.map(img => 
              img.id === nextMainImage.id 
                ? { ...img, isMain: true } 
                : img
            )
          );
        }
      }
      
      // Xóa hình ảnh đã tồn tại trên server nếu đang ở chế độ chỉnh sửa
      if (isEditMode && imageToRemove.isExisting) {
        try {
          productImageService.deleteProductImage(imageToRemove.id);
        } catch (error) {
          console.error('Error deleting image from server:', error);
          // Tiếp tục xóa khỏi UI ngay cả khi API lỗi
        }
      }
      
      // Xóa hình ảnh khỏi danh sách
      setImages(prevImages => prevImages.filter(img => img.id !== id));
    }
  }, [images, isEditMode]);
  
  // Thiết lập hình ảnh chính
  const setMainImage = useCallback((id) => {
    setImages(prevImages => 
      prevImages.map(img => ({
        ...img,
        isMain: img.id === id
      }))
    );
  }, []);
  
  // Upload hình ảnh lên server
  const uploadProductImages = useCallback(async (productId) => {
    // Lọc những hình ảnh mới cần upload
    const newImages = images.filter(img => !img.isExisting && img.file);
    
    if (newImages.length === 0) {
      return [];
    }
    
    try {
      // Tạo FormData với các hình ảnh
      const formData = new FormData();
      
      // Thêm productId
      formData.append('productId', productId);
      
      // Thêm các hình ảnh vào formData
      newImages.forEach(img => {
        formData.append('files', img.file);
        formData.append('isMain', img.isMain);
      });
      
      // Gọi API upload
      const uploadedImages = await productImageService.uploadProductImages(formData);
      return uploadedImages;
      
    } catch (error) {
      console.error('Error uploading product images:', error);
      throw new Error('Lỗi khi tải hình ảnh lên server');
    }
  }, [images]);
  
  // Xác thực hình ảnh
  const validateImages = useCallback(() => {
    const errors = [];
    
    if (images.length === 0) {
      errors.push('Vui lòng thêm ít nhất một hình ảnh cho sản phẩm.');
    }
    
    // Kiểm tra hình ảnh chính
    const hasMainImage = images.some(img => img.isMain);
    if (images.length > 0 && !hasMainImage) {
      errors.push('Vui lòng chọn một hình ảnh làm hình chính.');
    }
    
    setImageErrors(errors);
    return errors.length === 0;
  }, [images]);
  
  return {
    images,
    imageErrors,
    fileInputRef,
    handleImageUpload,
    handleRemoveImage,
    setMainImage,
    uploadProductImages,
    validateImages,
    initializeImages
  };
};

export default useProductImages; 