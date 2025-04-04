import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook quản lý biến thể sản phẩm
 * 
 * @param {boolean} isEditMode - Chế độ chỉnh sửa hay thêm mới
 * @returns {Object} Các state và hàm xử lý cho quản lý biến thể
 */
const useProductVariants = (isEditMode) => {
  // State quản lý danh sách biến thể
  const [variants, setVariants] = useState([]);
  
  // State quản lý biến thể hiện tại đang chỉnh sửa
  const [currentVariant, setCurrentVariant] = useState({
    id: null,
    color: '',
    size: '',
    sku: '',
    stockQuantity: '',
    priceAdjustment: '0'
  });
  
  // State hiển thị form biến thể
  const [showVariantForm, setShowVariantForm] = useState(false);
  
  // State biến thể mặc định
  const [defaultVariantId, setDefaultVariantId] = useState(null);
  
  // State lỗi biến thể
  const [variantErrors, setVariantErrors] = useState({});
  
  // Reset form biến thể
  const resetVariantForm = useCallback(() => {
    setCurrentVariant({
      id: null,
      color: '',
      size: '',
      sku: '',
      stockQuantity: '',
      priceAdjustment: '0'
    });
    setVariantErrors({});
  }, []);
  
  // Khởi tạo biến thể từ sản phẩm
  const initializeVariants = useCallback((productVariants) => {
    if (productVariants && productVariants.length > 0) {
      const processedVariants = productVariants.map(variant => ({
        id: variant.id.toString(),
        color: variant.color || '',
        size: variant.size || '',
        sku: variant.sku || '',
        stockQuantity: variant.stockQuantity?.toString() || '',
        priceAdjustment: variant.priceAdjustment?.toString() || '0',
        isDefault: variant.isDefault || false
      }));
      
      setVariants(processedVariants);
      
      // Thiết lập biến thể mặc định
      const defaultVariant = processedVariants.find(v => v.isDefault);
      if (defaultVariant) {
        setDefaultVariantId(defaultVariant.id);
      } else if (processedVariants.length > 0) {
        setDefaultVariantId(processedVariants[0].id);
      }
    }
  }, []);
  
  // Xác thực biến thể
  const validateVariant = (variant) => {
    const errors = {};
    
    if (!variant.color) {
      errors.color = 'Vui lòng chọn màu sắc';
    }
    
    if (!variant.size) {
      errors.size = 'Vui lòng chọn kích thước';
    }
    
    if (!variant.sku.trim()) {
      errors.sku = 'Vui lòng nhập mã SKU';
    }
    
    if (!variant.stockQuantity) {
      errors.stockQuantity = 'Vui lòng nhập số lượng tồn kho';
    } else if (isNaN(variant.stockQuantity) || parseInt(variant.stockQuantity) < 0) {
      errors.stockQuantity = 'Số lượng tồn kho phải là số không âm';
    }
    
    // Kiểm tra trùng lặp
    const isDuplicate = variants.some(v => 
      v.id !== variant.id && 
      v.color.toLowerCase() === variant.color.toLowerCase() && 
      v.size.toLowerCase() === variant.size.toLowerCase()
    );
    
    if (isDuplicate) {
      errors.duplicate = 'Biến thể với màu sắc và kích thước này đã tồn tại';
    }
    
    const isDuplicateSku = variants.some(v => 
      v.id !== variant.id && 
      v.sku.toLowerCase() === variant.sku.toLowerCase()
    );
    
    if (isDuplicateSku) {
      errors.sku = 'Mã SKU này đã được sử dụng cho biến thể khác';
    }
    
    setVariantErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Xác thực tất cả biến thể
  const validateVariants = useCallback(() => {
    if (variants.length === 0) {
      setVariantErrors({ general: 'Vui lòng thêm ít nhất một biến thể sản phẩm' });
      return false;
    }
    
    if (!defaultVariantId) {
      setVariantErrors({ general: 'Vui lòng chọn một biến thể mặc định' });
      return false;
    }
    
    return true;
  }, [variants, defaultVariantId]);
  
  // Xử lý khi input biến thể thay đổi
  const handleVariantInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVariant(prev => ({ ...prev, [name]: value }));
    
    // Xóa lỗi khi người dùng chỉnh sửa
    if (variantErrors[name]) {
      setVariantErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Thêm hoặc cập nhật biến thể
  const addOrUpdateVariant = () => {
    // Kiểm tra thông tin biến thể
    if (!validateVariant(currentVariant)) {
      return;
    }
    
    if (currentVariant.id) {
      // Cập nhật biến thể hiện có
      setVariants(prevVariants => 
        prevVariants.map(v => 
          v.id === currentVariant.id ? { ...currentVariant } : v
        )
      );
    } else {
      // Thêm biến thể mới
      const newVariant = {
        ...currentVariant,
        id: uuidv4()
      };
      
      setVariants(prevVariants => [...prevVariants, newVariant]);
      
      // Nếu là biến thể đầu tiên, đặt làm mặc định
      if (variants.length === 0) {
        setDefaultVariantId(newVariant.id);
      }
    }
    
    // Reset form biến thể
    resetVariantForm();
    setShowVariantForm(false);
  };
  
  // Bắt đầu chỉnh sửa biến thể
  const editVariant = (id) => {
    const variantToEdit = variants.find(v => v.id === id);
    if (variantToEdit) {
      setCurrentVariant({ ...variantToEdit });
      setShowVariantForm(true);
    }
  };
  
  // Xóa biến thể
  const removeVariant = (id) => {
    setVariants(prevVariants => prevVariants.filter(v => v.id !== id));
    
    // Nếu xóa biến thể mặc định, thiết lập biến thể mặc định mới
    if (id === defaultVariantId) {
      const remainingVariants = variants.filter(v => v.id !== id);
      if (remainingVariants.length > 0) {
        setDefaultVariantId(remainingVariants[0].id);
      } else {
        setDefaultVariantId(null);
      }
    }
  };
  
  // Thiết lập biến thể mặc định
  const setDefaultVariant = (id) => {
    setDefaultVariantId(id);
  };
  
  // Hiển thị/ẩn form biến thể
  const toggleVariantForm = () => {
    if (showVariantForm) {
      resetVariantForm();
    }
    setShowVariantForm(prev => !prev);
  };
  
  // Chuẩn bị biến thể để submit
  const prepareVariantsForSubmit = useCallback(() => {
    return variants.map(variant => ({
      ...variant,
      isDefault: variant.id === defaultVariantId,
      priceAdjustment: parseFloat(variant.priceAdjustment || 0),
      stockQuantity: parseInt(variant.stockQuantity || 0)
    }));
  }, [variants, defaultVariantId]);
  
  return {
    variants,
    currentVariant,
    variantErrors,
    showVariantForm,
    defaultVariantId,
    handleVariantInputChange,
    addOrUpdateVariant,
    editVariant,
    removeVariant,
    setDefaultVariant,
    resetVariantForm,
    toggleVariantForm,
    validateVariants,
    prepareVariantsForSubmit,
    initializeVariants
  };
};

export default useProductVariants; 