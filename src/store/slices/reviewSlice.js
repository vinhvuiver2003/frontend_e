import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewService } from '../../services';
import { toast } from 'react-toastify';
import axios from 'axios';

// Lấy đánh giá của một sản phẩm
export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async ({ productId, page = 0, size = 5 }, { rejectWithValue }) => {
    try {
      const response = await reviewService.getProductReviews(productId, page, size);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Lấy đánh giá của người dùng hiện tại
export const fetchMyReviews = createAsyncThunk(
  'reviews/fetchMyReviews',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await reviewService.getMyReviews(page, size);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Lấy chi tiết một đánh giá
export const fetchReviewById = createAsyncThunk(
  'reviews/fetchReviewById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await reviewService.getReviewById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Tạo đánh giá mới
export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const response = await axios.post('http://localhost:8080/api/reviews', reviewData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Đánh giá của bạn đã được gửi thành công!');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại sau.';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Cập nhật đánh giá
export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async (reviewData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      console.log("Sending update with data:", reviewData); // Ghi log dữ liệu gửi lên
      
      const response = await axios.put(`http://localhost:8080/api/reviews/${reviewData.id}`, reviewData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Update response:", response.data); // Ghi log phản hồi
      
      toast.success('Đánh giá của bạn đã được cập nhật thành công!');
      return response.data;
    } catch (error) {
      console.error("Update error:", error.response?.data || error); // Ghi log lỗi
      const errorMessage = error.response?.data?.message || 'Không thể cập nhật đánh giá. Vui lòng thử lại sau.';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Xóa đánh giá
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Đánh giá đã được xóa thành công!');
      return reviewId;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Không thể xóa đánh giá. Vui lòng thử lại sau.';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Kiểm tra tình trạng mua hàng (có thể đánh giá hay không)
export const checkPurchaseStatus = createAsyncThunk(
  'reviews/checkPurchaseStatus',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await reviewService.checkPurchaseStatus(productId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  productReviews: [],
  myReviews: {
    content: [],
    pagination: {
      totalElements: 0,
      totalPages: 0,
      page: 0,
      size: 10,
      last: true
    }
  },
  currentReview: null,
  canReview: false,
  loading: false,
  error: null,
  submitLoading: false,
  submitError: null,
  success: false
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviewErrors: (state) => {
      state.error = null;
      state.submitError = null;
    },
    clearCurrentReview: (state) => {
      state.currentReview = null;
    },
    clearReviewStatus: (state) => {
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý trạng thái khi lấy đánh giá
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.productReviews = action.payload;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Không thể tải đánh giá';
      })

      // Xử lý fetchMyReviews
      .addCase(fetchMyReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.myReviews.content = action.payload.content;
        state.myReviews.pagination = {
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          page: action.payload.page,
          size: action.payload.size,
          last: action.payload.last
        };
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể tải đánh giá của bạn';
      })

      // Xử lý fetchReviewById
      .addCase(fetchReviewById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReview = action.payload;
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể tải thông tin đánh giá';
      })

      // Xử lý trạng thái khi tạo đánh giá mới
      .addCase(createReview.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.success = true;
        // Thêm đánh giá mới vào đầu danh sách nếu có dữ liệu
        if (state.productReviews && state.productReviews.content) {
          state.productReviews.content.unshift(action.payload);
          if (state.productReviews.totalElements !== undefined) {
            state.productReviews.totalElements += 1;
          }
        }
        // Thêm vào đầu danh sách đánh giá của tôi
        state.myReviews.content.unshift(action.payload);
        state.myReviews.pagination.totalElements += 1;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload;
      })

      // Xử lý updateReview
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Cập nhật trong danh sách đánh giá sản phẩm
        if (state.productReviews && state.productReviews.content) {
          const productReviewIndex = state.productReviews.content.findIndex(review => review.id === action.payload.id);
          if (productReviewIndex !== -1) {
            state.productReviews.content[productReviewIndex] = action.payload;
          }
        }
        // Cập nhật trong danh sách đánh giá của tôi
        const myReviewIndex = state.myReviews.content.findIndex(review => review.id === action.payload.id);
        if (myReviewIndex !== -1) {
          state.myReviews.content[myReviewIndex] = action.payload;
        }
        // Cập nhật đánh giá hiện tại nếu đang xem
        if (state.currentReview && state.currentReview.id === action.payload.id) {
          state.currentReview = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Không thể cập nhật đánh giá';
      })

      // Xử lý deleteReview
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Xóa khỏi danh sách đánh giá sản phẩm
        if (state.productReviews && state.productReviews.content) {
          state.productReviews.content = state.productReviews.content.filter(review => review.id !== action.payload);
          if (state.productReviews.totalElements !== undefined && state.productReviews.totalElements > 0) {
            state.productReviews.totalElements -= 1;
          }
        }
        // Xóa khỏi danh sách đánh giá của tôi
        state.myReviews.content = state.myReviews.content.filter(review => review.id !== action.payload);
        if (state.myReviews.pagination.totalElements > 0) {
          state.myReviews.pagination.totalElements -= 1;
        }
        // Xóa đánh giá hiện tại nếu đang xem
        if (state.currentReview && state.currentReview.id === action.payload) {
          state.currentReview = null;
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Không thể xóa đánh giá';
      })

      // Xử lý checkPurchaseStatus
      .addCase(checkPurchaseStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkPurchaseStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.canReview = action.payload.canReview || false;
      })
      .addCase(checkPurchaseStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể kiểm tra trạng thái mua hàng';
        state.canReview = false;
      });
  }
});

export const { clearReviewErrors, clearCurrentReview, clearReviewStatus } = reviewSlice.actions;
export default reviewSlice.reducer; 