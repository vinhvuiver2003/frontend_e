import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { StarIcon, XIcon, PhotographIcon } from '@heroicons/react/solid';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline';

const ProductReviewForm = ({ productId, onSubmitSuccess }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const fileInputRef = useRef(null);

  const handleRatingClick = (value) => {
    setRating(value);
    if (errors.rating) {
      const newErrors = { ...errors };
      delete newErrors.rating;
      setErrors(newErrors);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) {
      const newErrors = { ...errors };
      delete newErrors.title;
      setErrors(newErrors);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (errors.content) {
      const newErrors = { ...errors };
      delete newErrors.content;
      setErrors(newErrors);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Chỉ cho phép tối đa 5 ảnh
    if (images.length + files.length > 5) {
      setErrors({
        ...errors,
        images: 'Bạn chỉ có thể tải lên tối đa 5 ảnh'
      });
      return;
    }

    const newImages = [];
    const maxSize = 5 * 1024 * 1024; // 5MB

    files.forEach(file => {
      // Kiểm tra kích thước file
      if (file.size > maxSize) {
        setErrors({
          ...errors,
          images: 'Mỗi ảnh không được vượt quá 5MB'
        });
        return;
      }

      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        setErrors({
          ...errors,
          images: 'Chỉ hỗ trợ định dạng ảnh (JPG, PNG, GIF)'
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push(e.target.result);
        
        // Nếu đã đọc xong tất cả file, cập nhật state
        if (newImages.length === files.length) {
          setImages([...images, ...newImages]);
          if (errors.images) {
            const newErrors = { ...errors };
            delete newErrors.images;
            setErrors(newErrors);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset file input để có thể chọn lại cùng một file
    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const validateForm = () => {
    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = 'Vui lòng chọn số sao';
    }

    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề đánh giá';
    } else if (title.length > 100) {
      newErrors.title = 'Tiêu đề không được vượt quá 100 ký tự';
    }

    if (!content.trim()) {
      newErrors.content = 'Vui lòng nhập nội dung đánh giá';
    } else if (content.length < 10) {
      newErrors.content = 'Nội dung đánh giá phải có ít nhất 10 ký tự';
    } else if (content.length > 1000) {
      newErrors.content = 'Nội dung đánh giá không được vượt quá 1000 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setErrors({ auth: 'Vui lòng đăng nhập để đánh giá sản phẩm' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Mô phỏng API call để gửi đánh giá
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Đối tượng review để gửi lên server
      const reviewData = {
        productId,
        rating,
        title,
        content,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        images: images.map(img => img.file) // Trong thực tế, bạn cần upload ảnh lên server
      };

      console.log('Submitting review:', reviewData);

      // Reset form sau khi gửi thành công
      setRating(0);
      setTitle('');
      setContent('');
      setImages([]);
      setSubmitStatus('success');
      
      // Gọi callback từ component cha nếu có
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmitStatus('error');
      setErrors({ submit: 'Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-4">Viết đánh giá của bạn</h3>

      {submitStatus === 'success' && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          <span>Cảm ơn bạn đã đánh giá sản phẩm! Đánh giá của bạn sẽ được hiển thị sau khi được phê duyệt.</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
          <ExclamationCircleIcon className="h-5 w-5 mr-2" />
          <span>{errors.submit || 'Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại.'}</span>
        </div>
      )}

      {errors.auth && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          {errors.auth}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá của bạn <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => handleRatingClick(value)}
                className="w-8 h-8 focus:outline-none"
              >
                <StarIcon
                  className={`w-8 h-8 ${
                    (hoveredRating ? value <= hoveredRating : value <= rating)
                      ? 'text-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {rating > 0 ? `${rating} sao` : ''}
            </span>
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-500">{errors.rating}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="reviewTitle"
            value={title}
            onChange={handleTitleChange}
            placeholder="Tiêu đề ngắn gọn cho đánh giá của bạn"
            className={`w-full px-3 py-2 border ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="reviewContent" className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung đánh giá <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reviewContent"
            rows="4"
            value={content}
            onChange={handleContentChange}
            placeholder="Chi tiết trải nghiệm của bạn với sản phẩm này"
            className={`w-full px-3 py-2 border ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          ></textarea>
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thêm ảnh (tối đa 5 ảnh)
          </label>
          <div className="flex flex-wrap items-center gap-4">
            {images.map((src, index) => (
              <div key={index} className="relative w-20 h-20">
                <img
                  src={src}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400"
              >
                <PhotographIcon className="w-8 h-8" />
                <span className="text-xs mt-1">Thêm ảnh</span>
              </button>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          {errors.images && (
            <p className="mt-1 text-sm text-red-500">{errors.images}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting || submitStatus === 'success'}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              (isSubmitting || submitStatus === 'success') ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Đang gửi...' : submitStatus === 'success' ? 'Đã gửi' : 'Gửi đánh giá'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductReviewForm; 