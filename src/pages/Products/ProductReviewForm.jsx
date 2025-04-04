import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StarIcon } from '@heroicons/react/solid';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import { createReview, updateReview } from '../../store/slices/reviewSlice';

const ProductReviewForm = ({ productId, onSubmitSuccess, initialData = null, isEditing = false }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  // Khởi tạo form với dữ liệu ban đầu nếu đang trong chế độ chỉnh sửa
  useEffect(() => {
    if (initialData) {
      console.log("Initializing form with data:", initialData);
      setRating(initialData.rating || 0);
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
    }
  }, [initialData]);

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
      // Chuẩn bị dữ liệu đánh giá
      const reviewData = {
        productId,
        rating,
        title,
        content
      };

      console.log("Submitting review data:", reviewData);

      // Nếu đang trong chế độ chỉnh sửa, cập nhật đánh giá hiện có
      if (isEditing && initialData) {
        // Đảm bảo ID được gửi đi
        await dispatch(updateReview({ 
          id: initialData.id, 
          ...reviewData 
        })).unwrap();
      } else {
        // Tạo đánh giá mới
        await dispatch(createReview(reviewData)).unwrap();
      }
      
      // Reset form sau khi gửi thành công
      setRating(0);
      setTitle('');
      setContent('');
      setSubmitStatus('success');
      
      // Gọi callback từ component cha nếu có
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmitStatus('error');
      setErrors({ 
        submit: error.message || 'Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-4">
        {isEditing ? 'Chỉnh sửa đánh giá của bạn' : 'Viết đánh giá của bạn'}
      </h3>

      {submitStatus === 'success' && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          <span>
            {isEditing 
              ? 'Đánh giá của bạn đã được cập nhật thành công!' 
              : 'Cảm ơn bạn đã đánh giá sản phẩm! Đánh giá của bạn sẽ được hiển thị sau khi được phê duyệt.'}
          </span>
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

        <div>
          <button
            type="submit"
            disabled={isSubmitting || submitStatus === 'success'}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              (isSubmitting || submitStatus === 'success') ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Đang gửi...' : submitStatus === 'success' ? 'Đã gửi' : isEditing ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductReviewForm; 