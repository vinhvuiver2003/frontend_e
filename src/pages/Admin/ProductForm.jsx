import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, fetchProductById, clearProductError } from '../../store/slices/productSlice';
import { fetchAllCategories } from '../../store/slices/categorySlice';
import { fetchAllBrands } from '../../store/slices/brandSlice';
import { XIcon, PhotographIcon, PlusIcon, ExclamationCircleIcon, PencilIcon } from '@heroicons/react/solid';
import axios from 'axios';
import { API_URL } from '../../config';
import { getCompleteImageUrl } from '../../utils/imageUtils';
import { productImageService } from '../../services';
import { v4 as uuidv4 } from 'uuid';
import {
  MinusIcon,
  ChevronRightIcon,
  CheckIcon
} from '@heroicons/react/outline';

const ProductForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isEditMode = !!id;
  
  const { product, loading: productLoading, error: productError } = useSelector(state => state.products);
  const { categories, loading: categoriesLoading, error: categoriesError } = useSelector(state => state.categories);
  const { brands, loading: brandsLoading, error: brandsError } = useSelector(state => state.brands);
  
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
  
  // State cho các biến thể
  const [variants, setVariants] = useState([]);
  const [defaultVariantId, setDefaultVariantId] = useState(null);
  const [showVariantForm, setShowVariantForm] = useState(false);
  
  // State cho biến thể đang chỉnh sửa
  const [currentVariant, setCurrentVariant] = useState({
    color: '',
    size: '',
    sku: '',
    stockQuantity: 1,
    priceAdjustment: 0
  });
  
  // State cho phần UI
  const [activeStep, setActiveStep] = useState(1); // 1: Thông tin cơ bản, 2: Biến thể, 3: Hình ảnh
  const [images, setImages] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [variantErrors, setVariantErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingStep, setIsProcessingStep] = useState(false); // State mới để theo dõi khi đang xử lý chuyển bước
  const fileInputRef = useRef(null);

  // Danh sách kích thước mẫu
  const sizeOptions = {
    clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    footwear: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    accessory: ['One Size']
  };
  
  // Danh sách màu sắc mẫu
  const colorOptions = [
    { name: 'Đen', value: 'black' },
    { name: 'Trắng', value: 'white' },
    { name: 'Đỏ', value: 'red' },
    { name: 'Xanh da trời', value: 'blue' },
    { name: 'Xanh lá', value: 'green' },
    { name: 'Vàng', value: 'yellow' },
    { name: 'Hồng', value: 'pink' },
    { name: 'Tím', value: 'purple' },
    { name: 'Cam', value: 'orange' },
    { name: 'Xám', value: 'gray' },
    { name: 'Nâu', value: 'brown' }
  ];

  // Tải thông tin danh mục và thương hiệu khi component mount
  useEffect(() => {
    // Tải danh mục và thương hiệu ngay từ đầu
    dispatch(fetchAllCategories());
    dispatch(fetchAllBrands());
    
    // Nếu là chế độ chỉnh sửa, tải thông tin sản phẩm
    if (isEditMode) {
      dispatch(fetchProductById(parseInt(id)));
    }
    
    // Cleanup
    return () => {
      dispatch(clearProductError());
    };
  }, [dispatch, id, isEditMode]);

  // Tải dữ liệu sản phẩm nếu đang ở chế độ chỉnh sửa
  useEffect(() => {
    if (isEditMode && product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        basePrice: product.basePrice ? product.basePrice.toString() : '',
        categoryId: product.categoryId || '',
        brandId: product.brandId || '',
        productType: product.productType || 'clothing',
        status: product.status || 'active'
      });
      
      // Cập nhật biến thể mặc định nếu có
      if (product.defaultVariantId) {
        setDefaultVariantId(product.defaultVariantId);
      }
      
      // Cập nhật hình ảnh và biến thể nếu có
      if (product.images && product.images.length > 0) {
        setImages(product.images.map(url => ({ 
          url, 
          file: null, 
          isExisting: true 
        })));
      }
      
      if (product.variants && product.variants.length > 0) {
        // Lưu serverId và originalSku cho mỗi biến thể để xác định những SKU đã thay đổi
        const variantsWithOriginalData = product.variants.map(variant => ({
          ...variant,
          serverId: variant.id, // Lưu ID thực từ server
          originalSku: variant.sku, // Lưu SKU ban đầu
        }));
        
        setVariants(variantsWithOriginalData);
      }
      
      // Tải ảnh sản phẩm
      productImageService.getProductImages(product.id)
        .then(response => {
          if (response.data.success && response.data.data) {
            const productImages = response.data.data;
            
            // Xử lý ảnh chung của sản phẩm (không có variantId)
            const generalImages = productImages
              .filter(img => !img.variantId)
              .map(img => ({
                id: img.id,
                url: img.imageURL,
                isExisting: true,
                isMain: img.sortOrder === 0
              }));
            
            setImages(generalImages);
          }
        })
        .catch(error => {
          console.error('Lỗi khi tải ảnh sản phẩm:', error);
        });
    }
  }, [isEditMode, product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Xóa lỗi khi người dùng chỉnh sửa
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Giới hạn số lượng ảnh
    if (images.length + files.length > 10) {
      setFormErrors(prev => ({
        ...prev,
        images: 'Chỉ được tải lên tối đa 10 ảnh'
      }));
      return;
    }

    const newImages = [];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      // Kiểm tra kích thước file
      if (file.size > maxSize) {
        setFormErrors(prev => ({
          ...prev,
          images: 'Kích thước ảnh không được vượt quá 5MB'
        }));
        continue;
      }

      // Tạo URL preview cho ảnh
      const imageUrl = URL.createObjectURL(file);
      newImages.push({ url: imageUrl, file, isExisting: false });
    }

    setImages(prev => [...prev, ...newImages]);
    
    // Reset input để có thể upload cùng một file nhiều lần
    e.target.value = null;
  };

  const handleRemoveImage = async (index) => {
    const newImages = [...images];
    const imageToRemove = newImages[index];
    
    try {
      // Nếu ảnh có URL từ createObjectURL, revoke nó để tránh memory leak
      if (imageToRemove.url.startsWith('blob:') && !imageToRemove.isExisting) {
        URL.revokeObjectURL(imageToRemove.url);
        newImages.splice(index, 1);
        setImages(newImages);
        return;
      }
      
      // Nếu ảnh là ảnh đã tồn tại trên server có ID
      if (imageToRemove.isExisting && imageToRemove.id) {
        // Gọi API xóa ảnh
        await productImageService.deleteProductImage(imageToRemove.id);
        console.log(`Đã xóa ảnh có ID: ${imageToRemove.id}`);
      }
      
      newImages.splice(index, 1);
      setImages(newImages);
    } catch (error) {
      console.error('Lỗi khi xóa ảnh:', error);
      alert('Không thể xóa ảnh. Vui lòng thử lại sau.');
    }
  };

  // Xử lý biến thể sản phẩm
  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setCurrentVariant(prev => ({ ...prev, [name]: value }));
    
    if (variantErrors[name]) {
      setVariantErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Kiểm tra SKU có tồn tại không
  const checkSkuExists = async (sku, excludeVariantId = null) => {
    try {
      // Gọi API để kiểm tra SKU đã tồn tại chưa
      const response = await fetch(`${API_URL}/products/check-sku?sku=${encodeURIComponent(sku)}${excludeVariantId ? `&excludeVariantId=${excludeVariantId}` : ''}`);
      const data = await response.json();
      
      return data.exists; // Trả về true nếu SKU đã tồn tại
    } catch (error) {
      console.error('Lỗi khi kiểm tra SKU:', error);
      return false; // Giả định không tồn tại nếu có lỗi
    }
  };

  // Xác thực thông tin biến thể
  const validateVariant = async () => {
    const errors = {};
    
    if (!currentVariant.color) {
      errors.color = 'Vui lòng chọn màu sắc';
    }
    
    if (!currentVariant.size) {
      errors.size = 'Vui lòng chọn kích thước';
    }
    
    if (!currentVariant.sku) {
      errors.sku = 'Vui lòng nhập mã SKU';
    } else {
      // Kiểm tra SKU trùng lặp trong danh sách biến thể hiện tại
      const isDuplicateInCurrentList = variants.some(v => 
        v.sku === currentVariant.sku && v.id !== currentVariant.id
      );
      
      if (isDuplicateInCurrentList) {
        errors.sku = 'Mã SKU đã tồn tại trong danh sách biến thể hiện tại';
      } else {
        // Kiểm tra SKU trùng lặp trong cơ sở dữ liệu
        try {
          // Nếu đang chỉnh sửa biến thể, cần loại trừ chính SKU của biến thể đó
          const excludeId = currentVariant.serverId || null;
          const skuExists = await checkSkuExists(currentVariant.sku, excludeId);
          
          if (skuExists) {
            errors.sku = 'Mã SKU đã tồn tại trong hệ thống. Vui lòng chọn mã SKU khác';
          }
        } catch (error) {
          console.error('Lỗi kiểm tra SKU:', error);
        }
      }
    }
    
    if (isNaN(parseInt(currentVariant.stockQuantity)) || parseInt(currentVariant.stockQuantity) < 0) {
      errors.stockQuantity = 'Số lượng phải là số không âm';
    }
    
    setVariantErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Thêm biến thể mới vào danh sách
  const addVariant = async () => {
    if (!(await validateVariant())) {
      return;
    }
    
    const newVariant = {
      ...currentVariant,
      id: currentVariant.id || Date.now(), // Giữ nguyên ID nếu đang sửa, nếu không thì tạo mới
      serverId: currentVariant.serverId || null, // Giữ serverId nếu đang sửa biến thể đã tồn tại
      originalSku: currentVariant.originalSku || currentVariant.sku, // Lưu SKU ban đầu
      stockQuantity: parseInt(currentVariant.stockQuantity),
      priceAdjustment: parseFloat(currentVariant.priceAdjustment) || 0
    };
    
    if (currentVariant.id) {
      // Nếu đang chỉnh sửa biến thể, cập nhật nó trong danh sách
      setVariants(variants.map(v => v.id === currentVariant.id ? newVariant : v));
    } else {
      // Thêm biến thể mới
      setVariants([...variants, newVariant]);
      
      // Nếu đây là biến thể đầu tiên, đặt làm mặc định
      if (variants.length === 0) {
        setDefaultVariantId(newVariant.id);
      }
    }
    
    // Reset form biến thể
    setCurrentVariant({
      color: '',
      size: '',
      sku: '',
      stockQuantity: 1,
      priceAdjustment: 0
    });
    
    setShowVariantForm(false);
  };
  
  // Chỉnh sửa biến thể hiện có
  const editVariant = (variantId) => {
    const variant = variants.find(v => v.id === variantId);
    if (variant) {
      setCurrentVariant({
        ...variant,
        // Giữ lại SKU ban đầu để biết có sự thay đổi hay không
        originalSku: variant.originalSku || variant.sku
      });
      setShowVariantForm(true);
    }
  };
  
  const removeVariant = (variantId) => {
    const newVariants = variants.filter(v => v.id !== variantId);
    setVariants(newVariants);
    
    // Nếu xóa biến thể mặc định, chọn biến thể đầu tiên làm mặc định (nếu có)
    if (defaultVariantId === variantId && newVariants.length > 0) {
      setDefaultVariantId(newVariants[0].id);
    } else if (newVariants.length === 0) {
      setDefaultVariantId(null);
    }
  };
  
  const setAsDefaultVariant = (variantId) => {
    setDefaultVariantId(variantId);
  };
  
  // Xử lý chuyển bước
  const goToNextStep = async () => {
    // Ngăn xử lý nếu đã đang xử lý
    if (isProcessingStep) {
      return;
    }
    
    try {
      setIsProcessingStep(true);
      
      if (activeStep === 1) {
        if (!validateBasicInfo()) {
          return;
        }
      } else if (activeStep === 2) {
        // Kiểm tra số lượng biến thể
        if (variants.length === 0) {
          setFormErrors(prev => ({ ...prev, variants: 'Vui lòng thêm ít nhất một biến thể sản phẩm' }));
          return;
        }
        
        // Kiểm tra biến thể mặc định
        if (!defaultVariantId) {
          setFormErrors(prev => ({ ...prev, variants: 'Vui lòng chọn biến thể mặc định' }));
          return;
        }
        
        // Kiểm tra SKU trùng lặp trước khi chuyển sang bước 3
        try {
          const { isValid, errors } = await validateVariantsBeforeSubmit();
          if (!isValid) {
            setFormErrors(prev => ({ ...prev, ...errors }));
            return;
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra SKU:", error);
          setFormErrors(prev => ({ 
            ...prev, 
            variants: 'Đã xảy ra lỗi khi kiểm tra SKU. Vui lòng thử lại.' 
          }));
          return;
        }
      }
      
      // Nếu không có lỗi, tăng bước
      setActiveStep(prev => prev + 1);
    } finally {
      setIsProcessingStep(false); // Luôn đặt lại trạng thái xử lý
    }
  };
  
  // Quay lại bước trước đó
  const goToPreviousStep = () => {
    // Tránh xử lý nếu đang có quá trình xử lý khác
    if (isProcessingStep || isSubmitting) {
      return;
    }
    setActiveStep(prev => Math.max(1, prev - 1));
  };
  
  // Validate thông tin cơ bản
  const validateBasicInfo = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập tên sản phẩm';
    }
    
    if (!formData.basePrice.trim()) {
      errors.basePrice = 'Vui lòng nhập giá sản phẩm';
    } else if (isNaN(parseFloat(formData.basePrice)) || parseFloat(formData.basePrice) < 0) {
      errors.basePrice = 'Giá sản phẩm không hợp lệ';
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

  const validateForm = () => {
    // Kiểm tra thông tin cơ bản
    if (!validateBasicInfo()) {
      setActiveStep(1);
      return false;
    }
    
    // Kiểm tra biến thể
    if (variants.length === 0) {
      setFormErrors(prev => ({ ...prev, variants: 'Vui lòng thêm ít nhất một biến thể sản phẩm' }));
      setActiveStep(2);
      return false;
    }
    
    // Kiểm tra biến thể mặc định
    if (!defaultVariantId) {
      setFormErrors(prev => ({ ...prev, defaultVariant: 'Vui lòng chọn biến thể mặc định' }));
      setActiveStep(2);
      return false;
    }
    
    // Kiểm tra hình ảnh (ít nhất 1 ảnh)
    if (images.length === 0) {
      setFormErrors(prev => ({ ...prev, images: 'Vui lòng thêm ít nhất một hình ảnh' }));
      setActiveStep(3);
      return false;
    }
    
    return true;
  };

  // Hàm để lấy URL ảnh hoàn chỉnh
  const getCompleteImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('blob:')) return imageUrl;
    
    // Kiểm tra nếu là đường dẫn products/ (ảnh sản phẩm từ server)
    if (imageUrl.startsWith('products/')) {
      // Trả về URL đến static resource handler thay vì API endpoint
      const baseUrl = API_URL.replace('/api', ''); // Bỏ /api
      return `${baseUrl}/images/${imageUrl}`;
    }
    
    // Trường hợp mặc định khác
    return `${API_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  // Hàm upload ảnh thực tế lên server
  const uploadProductImage = async (file, productId, variantId = null, isMainImage = false) => {
    try {
      const response = await productImageService.uploadProductImage(file, productId, variantId, isMainImage);
      
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        return response.data.data[0].imageURL;
      }
      throw new Error('Upload ảnh không thành công');
    } catch (error) {
      console.error('Lỗi khi upload ảnh:', error);
      throw error;
    }
  };

  // Hàm upload nhiều ảnh
  const uploadMultipleImages = async (files, productId) => {
    const uploadPromises = [];
    const errors = [];
    
    // Upload ảnh sản phẩm chung (không liên kết với biến thể cụ thể)
    const generalImages = files.filter(img => !img.variantId);
    for (const imageData of generalImages) {
      if (!imageData.file || imageData.isExisting) continue;
      
      try {
        const uploadPromise = uploadProductImage(
          imageData.file, 
          productId, 
          null, 
          imageData.isMain || false
        );
        uploadPromises.push(uploadPromise);
      } catch (error) {
        errors.push(`Lỗi upload ảnh ${imageData.file.name}: ${error.message}`);
      }
    }
    
   

    
    if (errors.length > 0) {
      console.error('Có lỗi khi upload một số ảnh:', errors);
    }
    
    try {
      const uploadedImageUrls = await Promise.all(uploadPromises);
      return uploadedImageUrls;
    } catch (error) {
      console.error('Lỗi khi upload ảnh:', error);
      return [];
    }
  };

  // Kiểm tra biến thể trùng lặp SKU trước khi submit
  const validateVariantsBeforeSubmit = async () => {
    const errors = {};
    const seenSkus = new Set();
    
    // Kiểm tra trùng lặp SKU giữa các biến thể trong form
    for (const variant of variants) {
      if (seenSkus.has(variant.sku)) {
        errors.variants = `Có nhiều biến thể sử dụng cùng mã SKU "${variant.sku}". Mỗi biến thể phải có mã SKU riêng.`;
        break;
      }
      seenSkus.add(variant.sku);
    }
    
    // Khi đang ở chế độ chỉnh sửa, cần kiểm tra SKU không trùng với các SKU khác trong hệ thống 
    // nhưng phải loại trừ chính các biến thể đang chỉnh sửa
    if (isEditMode) {
      // Chỉ kiểm tra các biến thể mới hoặc biến thể có SKU đã thay đổi
      for (const variant of variants) {
        // Biến thể mới sẽ không có ID từ server hoặc SKU đã được thay đổi
        const isNewOrModified = !variant.serverId || variant.originalSku !== variant.sku;
        
        if (isNewOrModified) {
          try {
            // Truyền ID thực của biến thể (nếu có) để loại trừ khỏi việc kiểm tra
            const skuExists = await checkSkuExists(variant.sku, variant.serverId || null);
            
            if (skuExists) {
              errors.variants = `Mã SKU "${variant.sku}" đã tồn tại trong hệ thống. Vui lòng sửa lại.`;
              break;
            }
          } catch (error) {
            console.error('Lỗi kiểm tra SKU:', error);
          }
        }
      }
    } else {
      // Nếu đang thêm mới, kiểm tra tất cả các SKU
      for (const variant of variants) {
        try {
          const skuExists = await checkSkuExists(variant.sku);
          if (skuExists) {
            errors.variants = `Mã SKU "${variant.sku}" đã tồn tại trong hệ thống. Vui lòng sửa lại.`;
            break;
          }
        } catch (error) {
          console.error('Lỗi kiểm tra SKU:', error);
        }
      }
    }
    
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Xử lý submit form, activeStep:', activeStep);
    
    // Nếu đang ở bước 3 mới xử lý submit, tránh trường hợp submit khi chưa hoàn thành
    if (activeStep !== 3) {
      console.log('Bỏ qua submit vì chưa ở bước 3, activeStep hiện tại:', activeStep);
      return;
    }
    
    // Nếu đang xử lý, không làm gì
    if (isSubmitting || isProcessingStep) {
      console.log('Đang xử lý, bỏ qua submit mới');
      return;
    }
    
    if (!validateForm()) {
      console.log('Form không hợp lệ, dừng submit');
      return;
    }
    
    try {
      // Kiểm tra biến thể trùng lặp SKU
      console.log('Kiểm tra SKU trùng lặp trước khi submit');
      const { isValid, errors } = await validateVariantsBeforeSubmit();
      if (!isValid) {
        console.log('Phát hiện lỗi SKU:', errors);
        setFormErrors(prev => ({ ...prev, ...errors }));
        // Chuyển về tab biến thể nếu có lỗi về biến thể
        if (errors.variants) {
          setActiveStep(2);
        }
        return;
      }
      
      console.log('Bắt đầu xử lý submit sản phẩm');
      setIsSubmitting(true);
      setFormErrors({});
      
      try {
        // Tìm biến thể mặc định
        const defaultVariant = variants.find(v => v.id === defaultVariantId);
        const defaultVariantIndex = variants.findIndex(v => v.id === defaultVariantId);
        
        // Chuẩn bị dữ liệu sản phẩm
        const productData = {
          name: formData.name,
          description: formData.description,
          basePrice: parseFloat(formData.basePrice),
          categoryId: parseInt(formData.categoryId),
          brandId: parseInt(formData.brandId),
          productType: formData.productType,
          status: formData.status,
          defaultVariantIndex: defaultVariantIndex, // Gửi index của biến thể mặc định thay vì ID
          variants: variants.map(variant => ({
            // Nếu đang ở chế độ chỉnh sửa và biến thể có ID từ server, thì gửi ID đó
            ...(variant.serverId ? { id: variant.serverId } : {}),
            color: variant.color,
            size: variant.size,
            sku: variant.sku,
            stockQuantity: variant.stockQuantity,
            priceAdjustment: variant.priceAdjustment,
            isDefault: variant.id === defaultVariantId // Thêm flag đánh dấu biến thể mặc định
          }))
        };
        
        // Hiển thị thông báo đang xử lý
        console.log("Đang gửi dữ liệu sản phẩm...", productData);
        
        let createdProduct;
        
        // Gửi request API tạo/cập nhật sản phẩm
        try {
          if (isEditMode) {
            createdProduct = await dispatch(updateProduct({ id, productData })).unwrap();
          } else {
            createdProduct = await dispatch(createProduct(productData)).unwrap();
          }
          console.log("Kết quả tạo/cập nhật sản phẩm:", createdProduct);
        } catch (apiError) {
          console.error("Lỗi khi gọi API tạo/cập nhật sản phẩm:", apiError);
          throw apiError;
        }
        
        // Nếu tạo sản phẩm thành công và có ID sản phẩm, upload ảnh
        if (createdProduct && createdProduct.id) {
          const productId = createdProduct.id;
          console.log(`Sản phẩm đã được tạo với ID: ${productId}`);
          
          // 1. Upload ảnh chung của sản phẩm
          const newGeneralImages = images.filter(img => !img.isExisting && img.file);
          if (newGeneralImages.length > 0) {
            console.log(`Đang upload ${newGeneralImages.length} ảnh chung cho sản phẩm`);
            try {
              // Đánh dấu ảnh đầu tiên là ảnh chính nếu có
              if (newGeneralImages[0]) {
                newGeneralImages[0].isMain = true;
              }
              await uploadMultipleImages(newGeneralImages, productId);
            } catch (uploadError) {
              console.error('Lỗi khi upload ảnh chung:', uploadError);
              // Tiếp tục xử lý mặc dù có lỗi upload ảnh
            }
          }
          
          console.log("Hoàn tất xử lý, chuyển hướng về trang quản lý sản phẩm");
          // Chuyển hướng về trang quản lý sản phẩm
          navigate('/admin/products');
        } else {
          throw new Error('Không thể lấy ID sản phẩm sau khi tạo/cập nhật');
        }
      } catch (err) {
        console.error('Lỗi khi lưu sản phẩm:', err);
        // Xử lý lỗi SKU trùng lặp
        if (err.message && err.message.includes('Duplicate entry') && err.message.includes('product_variant.UKivtjmjnhkb977nvkx92oyujw8')) {
          // Trích xuất SKU bị trùng lặp từ thông báo lỗi
          const skuMatch = err.message.match(/Duplicate entry '([^']+)'/);
          const duplicateSku = skuMatch ? skuMatch[1] : 'không xác định';
          
          setFormErrors(prev => ({ 
            ...prev, 
            variants: `Mã SKU "${duplicateSku}" đã tồn tại trong hệ thống. Vui lòng sửa lại.`,
            submit: `Lỗi khi lưu sản phẩm: Mã SKU "${duplicateSku}" đã tồn tại trong hệ thống`
          }));
          
          // Chuyển về bước biến thể
          setActiveStep(2);
        } else {
          setFormErrors(prev => ({ 
            ...prev, 
            submit: `Lỗi khi lưu sản phẩm: ${err.message || 'Lỗi không xác định'}` 
          }));
        }
        throw err; // Ném lỗi để catch bên ngoài xử lý
      }
    } catch (error) {
      console.error("Lỗi tổng thể khi xử lý submit form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hiển thị thông báo lỗi chung
  const renderErrors = () => {
    const errors = [];
    
    if (categoriesError) {
      errors.push(`Lỗi tải danh mục: ${categoriesError}`);
    }
    
    if (brandsError) {
      errors.push(`Lỗi tải thương hiệu: ${brandsError}`);
    }
    
    if (productError && isEditMode) {
      errors.push(`Lỗi tải thông tin sản phẩm: ${productError}`);
    }
    
    if (errors.length > 0) {
      return (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
          <div className="flex items-start">
            <ExclamationCircleIcon className="h-5 w-5 mr-2 mt-0.5 text-red-500" />
            <div>
              <p className="font-medium">Đã xảy ra lỗi:</p>
              <ul className="mt-1 list-disc list-inside text-sm">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Kiểm tra danh mục và thương hiệu có sẵn không
  const hasCategoriesData = Array.isArray(categories) && categories.length > 0;
  const hasBrandsData = Array.isArray(brands) && brands.length > 0;

  // Hiển thị cảnh báo nếu không có dữ liệu
  const renderDataWarnings = () => {
    const warnings = [];
    
    if (!hasCategoriesData) {
      warnings.push("Không có danh mục sản phẩm. Vui lòng thêm danh mục trước khi tạo sản phẩm.");
    }
    
    if (!hasBrandsData) {
      warnings.push("Không có thương hiệu. Vui lòng thêm thương hiệu trước khi tạo sản phẩm.");
    }
    
    if (warnings.length > 0) {
      return (
        <div className="mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-md">
          <div className="flex items-start">
            <ExclamationCircleIcon className="h-5 w-5 mr-2 mt-0.5 text-yellow-500" />
            <div>
              <p className="font-medium">Lưu ý:</p>
              <ul className="mt-1 list-disc list-inside text-sm">
                {warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Hiển thị loading khi đang tải dữ liệu
  if ((isEditMode && productLoading) || categoriesLoading || brandsLoading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h1>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Hiển thị thanh điều hướng bước
  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            activeStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            activeStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <div className={`flex-1 h-1 mx-2 ${activeStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            activeStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
        </div>
        
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <div className={activeStep === 1 ? 'font-bold text-blue-600' : ''}>Thông tin cơ bản</div>
          <div className={activeStep === 2 ? 'font-bold text-blue-600' : ''}>Biến thể sản phẩm</div>
          <div className={activeStep === 3 ? 'font-bold text-blue-600' : ''}>Hình ảnh</div>
        </div>
      </div>
    );
  };

  // Hiển thị thông tin cơ bản (Bước 1)
  const renderBasicInfoStep = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 md:col-span-2">
          <h2 className="text-lg font-medium border-b pb-2">Thông tin cơ bản</h2>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả sản phẩm
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
            Giá cơ bản <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="basePrice"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${formErrors.basePrice ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₫</span>
            </div>
          </div>
          {formErrors.basePrice && (
            <p className="mt-1 text-sm text-red-500">{formErrors.basePrice}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="discontinued">Ngừng kinh doanh</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${formErrors.categoryId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {formErrors.categoryId && (
            <p className="mt-1 text-sm text-red-500">{formErrors.categoryId}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 mb-1">
            Thương hiệu <span className="text-red-500">*</span>
          </label>
          <select
            id="brandId"
            name="brandId"
            value={formData.brandId}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${formErrors.brandId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="">-- Chọn thương hiệu --</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          {formErrors.brandId && (
            <p className="mt-1 text-sm text-red-500">{formErrors.brandId}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-1">
            Loại sản phẩm
          </label>
          <select
            id="productType"
            name="productType"
            value={formData.productType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="clothing">Quần áo</option>
            <option value="footwear">Giày dép</option>
            <option value="accessory">Phụ kiện</option>
          </select>
        </div>
      </div>
    );
  };

  // Hiển thị bước biến thể (Bước 2)
  const renderVariantsStep = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-medium border-b pb-2">Biến thể sản phẩm</h2>
        
        {/* Hiển thị lỗi biến thể */}
        {formErrors.variants && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
            <ExclamationCircleIcon className="h-5 w-5 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
            <span>{formErrors.variants}</span>
          </div>
        )}
        
        {/* Danh sách biến thể */}
        <div className="space-y-4">
          {variants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Màu sắc</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kích thước</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điều chỉnh giá</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mặc định</th>
                    <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {variants.map((variant) => {
                    // Kiểm tra nếu SKU của biến thể này trùng với SKU của biến thể khác
                    const hasDuplicateSku = variants.some(v => v.id !== variant.id && v.sku === variant.sku);
                    
                    return (
                      <tr key={variant.id} className={hasDuplicateSku ? "bg-red-50" : "hover:bg-gray-50"}>
                        <td className="px-3 py-4 whitespace-nowrap">{variant.color}</td>
                        <td className="px-3 py-4 whitespace-nowrap">{variant.size}</td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={hasDuplicateSku ? "text-red-600 font-medium" : ""}>{variant.sku}</span>
                            {hasDuplicateSku && (
                              <ExclamationCircleIcon className="h-5 w-5 ml-1 text-red-500" title="SKU trùng lặp" />
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">{variant.stockQuantity}</td>
                        <td className="px-3 py-4 whitespace-nowrap">{variant.priceAdjustment > 0 ? `+${variant.priceAdjustment}` : variant.priceAdjustment}</td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <input
                            type="radio"
                            checked={defaultVariantId === variant.id}
                            onChange={() => setAsDefaultVariant(variant.id)}
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => editVariant(variant.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => removeVariant(variant.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <XIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">Chưa có biến thể nào. Vui lòng thêm biến thể cho sản phẩm.</p>
            </div>
          )}
          
          {variants.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              <p>Lưu ý: Mỗi biến thể phải có mã SKU duy nhất. SKU là mã định danh cho từng biến thể sản phẩm.</p>
            </div>
          )}
          
          {/* Form thêm biến thể */}
          {showVariantForm ? (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-md font-medium mb-4">
                {currentVariant.id ? 'Chỉnh sửa biến thể' : 'Thêm biến thể mới'}
              </h3>
              
              {currentVariant.id && currentVariant.originalSku && (
                <div className="mb-4 p-3 bg-blue-50 rounded-md text-blue-700">
                  <p className="text-sm">
                    <span className="font-medium">Đang chỉnh sửa biến thể: </span> 
                    {currentVariant.color} - {currentVariant.size} (SKU: {currentVariant.originalSku})
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                    Màu sắc <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="color"
                    name="color"
                    value={currentVariant.color}
                    onChange={handleVariantChange}
                    className={`w-full px-3 py-2 border ${variantErrors.color ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">-- Chọn màu sắc --</option>
                    {colorOptions.map(color => (
                      <option key={color.value} value={color.value}>{color.name}</option>
                    ))}
                  </select>
                  {variantErrors.color && (
                    <p className="mt-1 text-sm text-red-500">{variantErrors.color}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                    Kích thước <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="size"
                    name="size"
                    value={currentVariant.size}
                    onChange={handleVariantChange}
                    className={`w-full px-3 py-2 border ${variantErrors.size ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">-- Chọn kích thước --</option>
                    {sizeOptions[formData.productType].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  {variantErrors.size && (
                    <p className="mt-1 text-sm text-red-500">{variantErrors.size}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                    Mã SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={currentVariant.sku}
                    onChange={handleVariantChange}
                    className={`w-full px-3 py-2 border ${variantErrors.sku ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {variantErrors.sku && (
                    <p className="mt-1 text-sm text-red-500">{variantErrors.sku}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Mã SKU phải là duy nhất trong toàn bộ hệ thống. Nên sử dụng định dạng như SP001-RED-XL.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    min="0"
                    value={currentVariant.stockQuantity}
                    onChange={handleVariantChange}
                    className={`w-full px-3 py-2 border ${variantErrors.stockQuantity ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {variantErrors.stockQuantity && (
                    <p className="mt-1 text-sm text-red-500">{variantErrors.stockQuantity}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="priceAdjustment" className="block text-sm font-medium text-gray-700 mb-1">
                    Điều chỉnh giá
                  </label>
                  <input
                    type="number"
                    id="priceAdjustment"
                    name="priceAdjustment"
                    value={currentVariant.priceAdjustment}
                    onChange={handleVariantChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Điều chỉnh so với giá cơ bản. Có thể là giá trị âm.</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowVariantForm(false);
                    // Reset form khi hủy
                    setCurrentVariant({
                      color: '',
                      size: '',
                      sku: '',
                      stockQuantity: 1,
                      priceAdjustment: 0
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {currentVariant.id ? 'Cập nhật biến thể' : 'Thêm biến thể'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowVariantForm(true)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-5 w-5 mr-2 text-gray-500" />
                Thêm biến thể sản phẩm
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Hiển thị bước hình ảnh (Bước 3)
  const renderImagesStep = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-medium border-b pb-2">Hình ảnh sản phẩm</h2>
        
        {formErrors.images && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            {formErrors.images}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hình ảnh cho sản phẩm
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative h-32 border rounded-md overflow-hidden group">
                <img
                  src={getCompleteImageUrl(image.url)}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-md p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400"
            >
              <PhotographIcon className="w-8 h-8 mb-2" />
              <span className="text-sm">Thêm ảnh</span>
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">Hình ảnh đầu tiên sẽ được sử dụng làm ảnh chính cho sản phẩm.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
      </h1>
      
      {renderErrors()}
      {renderDataWarnings()}
      
      {/* Hiển thị lỗi submit nếu có */}
      {formErrors.submit && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
          <div className="flex items-start">
            <ExclamationCircleIcon className="h-5 w-5 mr-2 mt-0.5 text-red-500" />
            <span>{formErrors.submit}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Thanh trạng thái hiển thị bước hiện tại */}
        {renderStepIndicator()}
        
        {/* Hiển thị nội dung theo bước */}
        <div className="mb-8">
          {activeStep === 1 && renderBasicInfoStep()}
          {activeStep === 2 && renderVariantsStep()}
          {activeStep === 3 && renderImagesStep()}
        </div>
        
        {/* Nút điều hướng và submit */}
        <div className="flex justify-between">
          <div>
            {activeStep > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  goToPreviousStep();
                }}
                disabled={isProcessingStep || isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Quay lại
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            
            {activeStep < 3 ? (
              <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  await goToNextStep();
                }}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting || isProcessingStep || !hasCategoriesData || !hasBrandsData}
              >
                {isProcessingStep ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Đang xử lý...</span>
                  </div>
                ) : 'Tiếp theo'}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || isProcessingStep || !hasCategoriesData || !hasBrandsData}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  isEditMode ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 