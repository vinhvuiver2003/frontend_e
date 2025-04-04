import React from 'react';
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XIcon } from '@heroicons/react/solid';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

/**
 * Component hiển thị bước quản lý biến thể sản phẩm
 * 
 * @param {Object} props - Props của component
 * @param {Array} props.variants - Danh sách biến thể
 * @param {string} props.defaultVariantId - ID biến thể mặc định
 * @param {Object} props.currentVariant - Biến thể đang chỉnh sửa
 * @param {boolean} props.showVariantForm - Hiển thị form chỉnh sửa biến thể
 * @param {Object} props.variantErrors - Lỗi của biến thể
 * @param {string} props.productType - Loại sản phẩm
 * @param {Function} props.handleVariantInputChange - Hàm xử lý thay đổi input biến thể
 * @param {Function} props.handleSaveVariant - Hàm xử lý lưu biến thể
 * @param {Function} props.handleEditVariant - Hàm xử lý chỉnh sửa biến thể
 * @param {Function} props.handleRemoveVariant - Hàm xử lý xóa biến thể
 * @param {Function} props.setAsDefaultVariant - Hàm đặt biến thể mặc định
 * @param {Function} props.setShowVariantForm - Hàm hiển thị/ẩn form biến thể
 * @param {Function} props.resetVariantForm - Hàm reset form biến thể
 * @returns {JSX.Element} Component VariantsStep
 */
const VariantsStep = ({
  variants,
  defaultVariantId,
  currentVariant,
  showVariantForm,
  variantErrors,
  productType,
  handleVariantInputChange,
  handleSaveVariant,
  handleEditVariant,
  handleRemoveVariant,
  setAsDefaultVariant,
  setShowVariantForm,
  resetVariantForm
}) => {
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
  
  // Danh sách kích thước mẫu
  const sizeOptions = {
    clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    footwear: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    accessory: ['One Size']
  };
  
  // Hiển thị color chip
  const renderColorChip = (colorValue) => {
    const color = colorOptions.find(c => c.value === colorValue);
    const displayName = color ? color.name : colorValue;
    
    return (
      <div className="flex items-center">
        <div 
          className="w-4 h-4 mr-2 rounded-full border" 
          style={{ backgroundColor: colorValue }}
        />
        <span>{displayName}</span>
      </div>
    );
  };
  
  // Hiển thị form biến thể
  const renderVariantForm = () => {
    return (
      <div className="bg-gray-50 p-4 rounded-md border mb-4">
        <h3 className="text-md font-medium mb-4">
          {currentVariant.id ? 'Chỉnh sửa biến thể' : 'Thêm biến thể mới'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Màu sắc */}
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Màu sắc <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="color"
                name="color"
                value={currentVariant.color}
                onChange={handleVariantInputChange}
                className={`w-full px-3 py-2 border ${variantErrors.color ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">-- Chọn màu sắc --</option>
                {colorOptions.map(color => (
                  <option key={color.value} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>
              {variantErrors.color && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {variantErrors.color && (
              <p className="mt-1 text-sm text-red-600">{variantErrors.color}</p>
            )}
          </div>
          
          {/* Kích thước */}
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
              Kích thước <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="size"
                name="size"
                value={currentVariant.size}
                onChange={handleVariantInputChange}
                className={`w-full px-3 py-2 border ${variantErrors.size ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">-- Chọn kích thước --</option>
                {sizeOptions[productType].map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              {variantErrors.size && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {variantErrors.size && (
              <p className="mt-1 text-sm text-red-600">{variantErrors.size}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Mã SKU */}
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
              Mã SKU <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="sku"
                name="sku"
                value={currentVariant.sku}
                onChange={handleVariantInputChange}
                className={`w-full px-3 py-2 border ${variantErrors.sku ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Nhập mã SKU"
              />
              {variantErrors.sku && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {variantErrors.sku && (
              <p className="mt-1 text-sm text-red-600">{variantErrors.sku}</p>
            )}
          </div>
          
          {/* Số lượng tồn kho */}
          <div>
            <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng tồn kho <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                value={currentVariant.stockQuantity}
                onChange={handleVariantInputChange}
                className={`w-full px-3 py-2 border ${variantErrors.stockQuantity ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                min="0"
              />
              {variantErrors.stockQuantity && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {variantErrors.stockQuantity && (
              <p className="mt-1 text-sm text-red-600">{variantErrors.stockQuantity}</p>
            )}
          </div>
        </div>
        
        {/* Điều chỉnh giá */}
        <div className="mb-4">
          <label htmlFor="priceAdjustment" className="block text-sm font-medium text-gray-700 mb-1">
            Điều chỉnh giá
          </label>
          <input
            type="number"
            id="priceAdjustment"
            name="priceAdjustment"
            value={currentVariant.priceAdjustment}
            onChange={handleVariantInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            step="1000"
          />
          <p className="mt-1 text-sm text-gray-500">Điều chỉnh tăng (+) hoặc giảm (-) so với giá cơ bản.</p>
        </div>
        
        {/* Thông báo lỗi chung */}
        {variantErrors.duplicate && (
          <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-md">
            {variantErrors.duplicate}
          </div>
        )}
        
        {/* Nút hành động */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => {
              resetVariantForm();
              setShowVariantForm(false);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSaveVariant}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            {currentVariant.id ? 'Cập nhật' : 'Thêm biến thể'}
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium border-b pb-2">Biến thể sản phẩm</h2>
      
      {/* Thông báo khi chưa có biến thể */}
      {variants.length === 0 && !showVariantForm && (
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-300 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Sản phẩm cần có ít nhất một biến thể. Nhấn nút "Thêm biến thể" để bắt đầu.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Form biến thể */}
      {showVariantForm && renderVariantForm()}
      
      {/* Nút thêm biến thể */}
      {!showVariantForm && (
        <button
          type="button"
          onClick={() => {
            resetVariantForm();
            setShowVariantForm(true);
          }}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mb-4"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm biến thể
        </button>
      )}
      
      {/* Danh sách biến thể */}
      {variants.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Màu sắc
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kích thước
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá điều chỉnh
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mặc định
                </th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {variants.map((variant) => (
                <tr key={variant.id}>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderColorChip(variant.color)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {variant.size}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {variant.sku}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {variant.stockQuantity}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {parseInt(variant.priceAdjustment) === 0 ? (
                      <span>-</span>
                    ) : (
                      <span className={parseInt(variant.priceAdjustment) > 0 ? 'text-green-600' : 'text-red-600'}>
                        {parseInt(variant.priceAdjustment) > 0 ? '+' : ''}{parseInt(variant.priceAdjustment).toLocaleString('vi-VN')} đ
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="radio"
                      checked={variant.id === defaultVariantId}
                      onChange={() => setAsDefaultVariant(variant.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEditVariant(variant)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(variant.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VariantsStep; 