import React from 'react';
import { XIcon, PhotographIcon } from '@heroicons/react/solid';
import { getCompleteImageUrl } from '../../../utils/imageUtils';

/**
 * Component hiển thị bước quản lý hình ảnh sản phẩm
 * 
 * @param {Object} props - Props của component
 * @param {Array} props.images - Danh sách hình ảnh
 * @param {string} props.imageErrors - Lỗi hình ảnh
 * @param {React.RefObject} props.fileInputRef - Ref đến input file
 * @param {Function} props.handleImageUpload - Hàm xử lý tải lên hình ảnh
 * @param {Function} props.handleRemoveImage - Hàm xử lý xóa hình ảnh
 * @returns {JSX.Element} Component ImagesStep
 */
const ImagesStep = ({
  images,
  imageErrors,
  fileInputRef,
  handleImageUpload,
  handleRemoveImage
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium border-b pb-2">Hình ảnh sản phẩm</h2>
      
      {imageErrors && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">
          {imageErrors}
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
              
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2">
                  Ảnh chính
                </div>
              )}
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
        <p className="mt-2 text-sm text-gray-500">
          Hình ảnh đầu tiên sẽ được sử dụng làm ảnh chính cho sản phẩm.
          Có thể tải lên tối đa 10 ảnh, mỗi ảnh không quá 5MB.
        </p>
        
        {images.length === 0 && (
          <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md">
            Sản phẩm cần có ít nhất một hình ảnh. Vui lòng tải lên ít nhất một hình ảnh.
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesStep; 