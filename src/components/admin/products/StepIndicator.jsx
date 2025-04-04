import React from 'react';
import { CheckIcon } from '@heroicons/react/solid';

/**
 * Component hiển thị thanh tiến trình các bước của form sản phẩm
 * 
 * @param {Object} props - Props của component
 * @param {number} props.activeStep - Bước hiện tại (1-3)
 * @param {boolean} props.isProcessingStep - Đang xử lý chuyển bước hay không
 * @returns {JSX.Element} Component StepIndicator
 */
const StepIndicator = ({ activeStep, isProcessingStep }) => {
  const steps = [
    { id: 1, name: 'Thông tin cơ bản' },
    { id: 2, name: 'Biến thể sản phẩm' },
    { id: 3, name: 'Hình ảnh' }
  ];
  
  return (
    <div className="mb-8">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => (
          <li key={step.id} className={`flex items-center ${index !== steps.length - 1 ? 'w-full' : ''}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
              ${activeStep > step.id ? 'border-blue-600 bg-blue-600 text-white' : 
                activeStep === step.id ? 'border-blue-600 text-blue-600' : 
                'border-gray-300 text-gray-300'}`}>
              {activeStep > step.id ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            
            <span className={`ml-2 text-sm font-medium 
              ${activeStep > step.id ? 'text-blue-600' : 
                activeStep === step.id ? 'text-blue-600' : 
                'text-gray-400'}`}>
              {step.name}
            </span>
            
            {index !== steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 
                ${activeStep > step.id + 1 ? 'bg-blue-600' : 'bg-gray-200'}`}>
              </div>
            )}
          </li>
        ))}
      </ol>
      
      {isProcessingStep && (
        <div className="mt-2 flex justify-center items-center text-sm text-gray-500">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Đang xử lý...</span>
        </div>
      )}
    </div>
  );
};

export default StepIndicator; 