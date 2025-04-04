import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

// Custom hooks
import useProductForm from '../../../hooks/products/useProductForm';
import useProductVariants from '../../../hooks/products/useProductVariants';
import useProductImages from '../../../hooks/products/useProductImages';

// Components
import StepIndicator from './StepIndicator';
import BasicInfoStep from './BasicInfoStep';
import VariantsStep from './VariantsStep';
import ImagesStep from './ImagesStep';
import FormActionsFooter from './FormActionsFooter';

// Services and actions
import { fetchProduct } from '../../../store/slices/productSlice';
import { fetchCategories } from '../../../store/slices/categorySlice';
import { fetchBrands } from '../../../store/slices/brandSlice';

/**
 * Component wrapper chính cho form quản lý sản phẩm
 * 
 * @returns {JSX.Element} Component ProductFormWrapper
 */
const ProductFormWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = !!id;
  
  // Custom hooks
  const {
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
  } = useProductForm(isEditMode);
  
  const {
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
  } = useProductVariants(isEditMode);
  
  const {
    images,
    imageErrors,
    fileInputRef,
    handleImageUpload,
    handleRemoveImage,
    setMainImage,
    uploadProductImages,
    validateImages,
    initializeImages
  } = useProductImages(isEditMode);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
    
    if (isEditMode) {
      dispatch(fetchProduct(id))
        .unwrap()
        .then((product) => {
          initializeFormData(product);
          initializeVariants(product.variants);
          initializeImages(product);
        })
        .catch((error) => {
          toast.error('Lỗi khi lấy thông tin sản phẩm: ' + error.message);
          navigate('/admin/products');
        });
    }
  }, [dispatch, id, isEditMode, navigate, initializeFormData, initializeVariants, initializeImages]);
  
  // Các handlers
  const handleNextStep = () => {
    if (activeStep === 1) {
      if (validateBasicInfo()) {
        goToNextStep();
      }
    } else if (activeStep === 2) {
      if (validateVariants()) {
        goToNextStep();
      }
    }
  };
  
  const handleFinalSubmit = () => {
    if (validateImages()) {
      const variants = prepareVariantsForSubmit();
      
      handleSubmit(variants, images, uploadProductImages)
        .then(() => {
          toast.success(`Sản phẩm đã ${isEditMode ? 'cập nhật' : 'tạo'} thành công!`);
          navigate('/admin/products');
        })
        .catch((error) => {
          toast.error(`Lỗi khi ${isEditMode ? 'cập nhật' : 'tạo'} sản phẩm: ${error.message}`);
        });
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h1>
        
        <StepIndicator activeStep={activeStep} isProcessingStep={isProcessingStep} />
        
        <div className="mt-6">
          {activeStep === 1 && (
            <BasicInfoStep 
              formData={formData}
              handleInputChange={handleInputChange}
              formErrors={formErrors}
            />
          )}
          
          {activeStep === 2 && (
            <VariantsStep 
              variants={variants}
              defaultVariantId={defaultVariantId}
              currentVariant={currentVariant}
              showVariantForm={showVariantForm}
              variantErrors={variantErrors}
              productType={formData.productType}
              handleVariantInputChange={handleVariantInputChange}
              addOrUpdateVariant={addOrUpdateVariant}
              editVariant={editVariant}
              removeVariant={removeVariant}
              setDefaultVariant={setDefaultVariant}
              resetVariantForm={resetVariantForm}
              toggleVariantForm={toggleVariantForm}
            />
          )}
          
          {activeStep === 3 && (
            <ImagesStep
              images={images}
              imageErrors={imageErrors}
              fileInputRef={fileInputRef}
              handleImageUpload={handleImageUpload}
              handleRemoveImage={handleRemoveImage}
              setMainImage={setMainImage}
            />
          )}
        </div>
        
        <FormActionsFooter
          activeStep={activeStep}
          isSubmitting={isSubmitting}
          isProcessingStep={isProcessingStep}
          goToPreviousStep={goToPreviousStep}
          goToNextStep={handleNextStep}
          handleSubmit={handleFinalSubmit}
          handleCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ProductFormWrapper; 