import React from 'react';

/**
 * Component hiển thị các nút điều hướng và hành động ở cuối form sản phẩm
 * 
 * @param {Object} props - Props của component
 * @param {number} props.activeStep - Bước hiện tại (1-3)
 * @param {boolean} props.isSubmitting - Đang submit form hay không
 * @param {boolean} props.isProcessingStep - Đang xử lý chuyển bước hay không
 * @param {function} props.goToPreviousStep - Hàm xử lý khi click nút quay lại
 * @param {function} props.goToNextStep - Hàm xử lý khi click nút tiếp theo
 * @param {function} props.handleSubmit - Hàm xử lý khi click nút hoàn thành
 * @param {function} props.handleCancel - Hàm xử lý khi click nút hủy
 * @returns {JSX.Element} Component FormActionsFooter
 */
const FormActionsFooter = ({ 
  activeStep, 
  isSubmitting,
  isProcessingStep,
  goToPreviousStep, 
  goToNextStep, 
  handleSubmit,
  handleCancel
}) => {
  return (
    <div className="flex justify-between pt-6 mt-8 border-t border-gray-200">
      <button
        type="button"
        onClick={handleCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Hủy
      </button>
      
      <div className="flex space-x-3">
        {activeStep > 1 && (
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={isProcessingStep || isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Quay lại
          </button>
        )}
        
        {activeStep < 3 ? (
          <button
            type="button"
            onClick={goToNextStep}
            disabled={isProcessingStep || isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Tiếp theo
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessingStep || isSubmitting}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting && (
              <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Hoàn thành
          </button>
        )}
      </div>
    </div>
  );
};

export default FormActionsFooter; 