import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProduct, updateProduct } from '../../store/slices/productSlice';

/**
 * Hook quản lý form sản phẩm
 * 
 * @param {boolean} isEditMode - Chế độ chỉnh sửa hay thêm mới
 * @returns {Object} Các state và hàm xử lý cho form sản phẩm
 */
const useProductForm = (isEditMode) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // State cho form cơ bản
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    categoryId: '',
    brandId: '',
    productType: 'clothing',
    status: 'active'
  });
  
  // State quản lý bước hiện tại của form
  const [activeStep, setActiveStep] = useState(1);
  const [isProcessingStep, setIsProcessingStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Khởi tạo form data
  const initializeFormData = useCallback((product) => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        basePrice: product.basePrice ? product.basePrice.toString() : '',
        categoryId: product.categoryId ? product.categoryId.toString() : '',
        brandId: product.brandId ? product.brandId.toString() : '',
        productType: product.productType || 'clothing',
        status: product.status || 'active'
      });
    }
  }, []);
  
  // Xử lý input thay đổi
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Xóa lỗi khi người dùng chỉnh sửa
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Xác thực form
  const validateBasicInfo = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập tên sản phẩm';
    }
    
    if (!formData.basePrice.trim()) {
      errors.basePrice = 'Vui lòng nhập giá sản phẩm';
    } else if (isNaN(formData.basePrice) || parseFloat(formData.basePrice) <= 0) {
      errors.basePrice = 'Giá sản phẩm phải là số dương';
    }
    
    if (!formData.categoryId) {
      errors.categoryId = 'Vui lòng chọn danh mục';
    }
    
    if (!formData.brandId) {
      errors.brandId = 'Vui lòng chọn thương hiệu';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Chuyển đến bước tiếp theo
  const goToNextStep = useCallback(() => {
    if (isProcessingStep) return;
    setIsProcessingStep(true);
    
    try {
      setActiveStep(prev => prev + 1);
    } finally {
      setIsProcessingStep(false);
    }
  }, [isProcessingStep]);
  
  // Quay lại bước trước
  const goToPreviousStep = useCallback(() => {
    if (activeStep > 1) {
      setActiveStep(prev => prev - 1);
    }
  }, [activeStep]);
  
  // Hủy form
  const handleCancel = useCallback(() => {
    navigate('/admin/products');
  }, [navigate]);
  
  // Submit form
  const handleSubmit = useCallback(async (variants, images, uploadImagesCallback) => {
    if (isSubmitting) return Promise.reject(new Error('Đang xử lý, vui lòng đợi'));
    
    setIsSubmitting(true);
    
    try {
      // Tạo đối tượng dữ liệu sản phẩm
      const productData = {
        name: formData.name,
        description: formData.description,
        basePrice: parseFloat(formData.basePrice),
        categoryId: parseInt(formData.categoryId),
        brandId: parseInt(formData.brandId),
        productType: formData.productType,
        status: formData.status,
        variants: variants
      };
      
      // Gọi API tạo hoặc cập nhật sản phẩm
      let result;
      
      if (isEditMode) {
        // Lấy ID sản phẩm từ URL
        const productId = window.location.pathname.split('/').pop();
        result = await dispatch(updateProduct({ 
          id: parseInt(productId), 
          productData 
        })).unwrap();
      } else {
        result = await dispatch(createProduct(productData)).unwrap();
      }
      
      // Upload hình ảnh nếu có
      if (images && images.length > 0 && uploadImagesCallback) {
        await uploadImagesCallback(result.id);
      }
      
      return result;
    } catch (error) {
      console.error('Error submitting product form:', error);
      setFormErrors({ submit: error.message || 'Có lỗi xảy ra khi lưu sản phẩm' });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, formData, isEditMode, isSubmitting]);
  
  return {
    formData,
    handleInputChange,
    formErrors,
    activeStep,
    isSubmitting,
    isProcessingStep,
    validateBasicInfo,
    goToNextStep,
    goToPreviousStep,
    handleSubmit,
    handleCancel,
    initializeFormData
  };
};

export default useProductForm; 