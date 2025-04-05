import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  SaveIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/outline';
import promotionService from '../../services/promotionService';

const PromotionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minimumOrder: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    status: 'active'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      fetchPromotion();
    }
  }, [id]);

  const fetchPromotion = async () => {
    try {
      setLoading(true);
      const response = await promotionService.getPromotionById(id);
      const promotion = response.data || response;
      
      // Format dates to YYYY-MM-DDThh:mm
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        name: promotion.name || '',
        description: promotion.description || '',
        code: promotion.code || '',
        discountType: promotion.discountType || 'percentage',
        discountValue: promotion.discountValue || '',
        minimumOrder: promotion.minimumOrder || '',
        startDate: formatDate(promotion.startDate),
        endDate: formatDate(promotion.endDate),
        usageLimit: promotion.usageLimit || '',
        status: promotion.status || 'active'
      });
      
      setLoading(false);
    } catch (err) {
      setError('Không thể tải thông tin khuyến mãi: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Tên khuyến mãi không được để trống';
    }
    
    if (formData.discountType === 'percentage') {
      if (!formData.discountValue) {
        errors.discountValue = 'Giá trị không được để trống';
      } else if (parseFloat(formData.discountValue) <= 0 || parseFloat(formData.discountValue) > 100) {
        errors.discountValue = 'Giá trị phần trăm phải từ 0 đến 100';
      }
    } else if (formData.discountType === 'fixed_amount') {
      if (!formData.discountValue) {
        errors.discountValue = 'Giá trị không được để trống';
      } else if (parseFloat(formData.discountValue) <= 0) {
        errors.discountValue = 'Giá trị phải lớn hơn 0';
      }
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Ngày bắt đầu không được để trống';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'Ngày kết thúc không được để trống';
    } else if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }
    
    if (formData.minimumOrder && parseFloat(formData.minimumOrder) < 0) {
      errors.minimumOrder = 'Giá trị đơn hàng tối thiểu không được âm';
    }
    
    if (formData.usageLimit && parseInt(formData.usageLimit) <= 0) {
      errors.usageLimit = 'Số lần sử dụng phải lớn hơn 0';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {
      setLoading(true);
      
      // Format data for API
      const promotionData = {
        name: formData.name.trim(),
        description: formData.description || null,
        code: formData.code || null,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        minimumOrder: formData.minimumOrder ? parseFloat(formData.minimumOrder) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status
      };
      
      console.log('Sending data to API:', promotionData);
      
      if (isEditMode) {
        await promotionService.updatePromotion(id, promotionData);
      } else {
        await promotionService.createPromotion(promotionData);
      }
      
      setLoading(false);
      navigate('/admin/promotions');
    } catch (err) {
      console.error('Error saving promotion:', err);
      const errorMessage = err.response?.data?.message || err.message;
      setError('Lỗi khi lưu khuyến mãi: ' + errorMessage);
      setLoading(false);
    }
  };

  const renderTypeSpecificFields = () => {
    switch (formData.discountType) {
      case 'percentage':
        return (
          <>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
                Phần trăm giảm giá (%) *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="discountValue"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  className={`block w-full pr-12 border-gray-300 rounded-md ${
                    validationErrors.discountValue ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="10"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
              {validationErrors.discountValue && (
                <p className="mt-2 text-sm text-red-600">{validationErrors.discountValue}</p>
              )}
            </div>
          </>
        );
        
      case 'fixed_amount':
        return (
          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
              Số tiền giảm giá (VND) *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="discountValue"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                className={`block w-full border-gray-300 rounded-md ${
                  validationErrors.discountValue ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="50000"
                min="0"
                required
              />
            </div>
            {validationErrors.discountValue && (
              <p className="mt-2 text-sm text-red-600">{validationErrors.discountValue}</p>
            )}
          </div>
        );
        
      case 'free_shipping':
        return (
          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
              Giá trị miễn phí vận chuyển tối đa (VND, không bắt buộc)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="discountValue"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="30000"
                min="0"
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/admin/promotions')}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Quay lại danh sách
        </button>
      </div>
      
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {isEditMode ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {isEditMode 
                ? 'Cập nhật thông tin chương trình khuyến mãi.' 
                : 'Tạo chương trình khuyến mãi mới cho cửa hàng của bạn.'}
            </p>

            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Đã xảy ra lỗi</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Tên chương trình khuyến mãi *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.name ? 'border-red-300' : ''
                      }`}
                      placeholder="Khuyến mãi mùa hè"
                      required
                    />
                    {validationErrors.name && (
                      <p className="mt-2 text-sm text-red-600">{validationErrors.name}</p>
                    )}
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Mô tả
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description || ''}
                      onChange={handleChange}
                      rows="3"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Mô tả chi tiết về chương trình khuyến mãi"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                      Mã giảm giá
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="SUMMER2023"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">
                      Loại khuyến mãi *
                    </label>
                    <select
                      id="discountType"
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="percentage">Giảm theo phần trăm (%)</option>
                      <option value="fixed_amount">Giảm số tiền cố định</option>
                      <option value="free_shipping">Miễn phí vận chuyển</option>
                    </select>
                  </div>
                  
                  {/* Render fields specific to promotion type */}
                  {renderTypeSpecificFields()}
                  
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Ngày bắt đầu *
                    </label>
                    <input
                      type="datetime-local"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.startDate ? 'border-red-300' : ''
                      }`}
                      required
                    />
                    {validationErrors.startDate && (
                      <p className="mt-2 text-sm text-red-600">{validationErrors.startDate}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      Ngày kết thúc *
                    </label>
                    <input
                      type="datetime-local"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.endDate ? 'border-red-300' : ''
                      }`}
                      required
                    />
                    {validationErrors.endDate && (
                      <p className="mt-2 text-sm text-red-600">{validationErrors.endDate}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="minimumOrder" className="block text-sm font-medium text-gray-700">
                      Giá trị đơn hàng tối thiểu (VND, không bắt buộc)
                    </label>
                    <input
                      type="number"
                      id="minimumOrder"
                      name="minimumOrder"
                      value={formData.minimumOrder}
                      onChange={handleChange}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.minimumOrder ? 'border-red-300' : ''
                      }`}
                      placeholder="200000"
                      min="0"
                    />
                    {validationErrors.minimumOrder && (
                      <p className="mt-2 text-sm text-red-600">{validationErrors.minimumOrder}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700">
                      Số lần sử dụng tối đa (không bắt buộc)
                    </label>
                    <input
                      type="number"
                      id="usageLimit"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleChange}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.usageLimit ? 'border-red-300' : ''
                      }`}
                      placeholder="100"
                      min="0"
                    />
                    {validationErrors.usageLimit && (
                      <p className="mt-2 text-sm text-red-600">{validationErrors.usageLimit}</p>
                    )}
                  </div>

                  <div className="col-span-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="status"
                        name="status"
                        checked={formData.status === 'active'}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          status: e.target.checked ? 'active' : 'inactive'
                        }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="status" className="ml-2 block text-sm text-gray-700">
                        Kích hoạt khuyến mãi
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => navigate('/admin/promotions')}
                  className="mr-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang lưu...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <SaveIcon className="h-4 w-4 mr-1" />
                      {isEditMode ? 'Cập nhật' : 'Tạo khuyến mãi'}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromotionForm; 