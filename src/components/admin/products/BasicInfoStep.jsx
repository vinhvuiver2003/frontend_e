import React from 'react';
import { useSelector } from 'react-redux';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

/**
 * Component hiển thị bước nhập thông tin cơ bản của sản phẩm
 * 
 * @param {Object} props - Props của component
 * @param {Object} props.formData - Dữ liệu form
 * @param {Function} props.handleInputChange - Hàm xử lý thay đổi input
 * @param {Object} props.formErrors - Lỗi của form
 * @returns {JSX.Element} Component BasicInfoStep
 */
const BasicInfoStep = ({ formData, handleInputChange, formErrors }) => {
  const { categories, loading: categoriesLoading } = useSelector(state => state.categories);
  const { brands, loading: brandsLoading } = useSelector(state => state.brands);
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium border-b pb-2">Thông tin cơ bản</h2>
      
      {/* Tên sản phẩm */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Tên sản phẩm <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Nhập tên sản phẩm"
          />
          {formErrors.name && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {formErrors.name && (
          <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
        )}
      </div>
      
      {/* Mô tả sản phẩm */}
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
          placeholder="Nhập mô tả sản phẩm"
        />
      </div>
      
      {/* Giá cơ bản */}
      <div>
        <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
          Giá cơ bản <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            id="basePrice"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${formErrors.basePrice ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Nhập giá cơ bản"
            min="0"
            step="1000"
          />
          {formErrors.basePrice && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {formErrors.basePrice && (
          <p className="mt-1 text-sm text-red-600">{formErrors.basePrice}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">Giá cơ bản của sản phẩm. Mỗi biến thể có thể có giá điều chỉnh riêng.</p>
      </div>
      
      {/* Danh mục và thương hiệu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Danh mục */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${formErrors.categoryId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              disabled={categoriesLoading}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {formErrors.categoryId && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {formErrors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{formErrors.categoryId}</p>
          )}
        </div>
        
        {/* Thương hiệu */}
        <div>
          <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 mb-1">
            Thương hiệu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="brandId"
              name="brandId"
              value={formData.brandId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${formErrors.brandId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              disabled={brandsLoading}
            >
              <option value="">-- Chọn thương hiệu --</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {formErrors.brandId && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {formErrors.brandId && (
            <p className="mt-1 text-sm text-red-600">{formErrors.brandId}</p>
          )}
        </div>
      </div>
      
      {/* Loại sản phẩm và trạng thái */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Loại sản phẩm */}
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
        
        {/* Trạng thái */}
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
            <option value="active">Đang bán</option>
            <option value="inactive">Ngừng bán</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep; 