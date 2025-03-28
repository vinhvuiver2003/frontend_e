import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewService } from '../../services';

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
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await reviewService.createReview(reviewData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Cập nhật đánh giá
export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewService.updateReview(id, reviewData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Xóa đánh giá
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id, { rejectWithValue }) => {
    try {
      await reviewService.deleteReview(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
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
  productReviews: {
    content: [],
    pagination: {
      totalElements: 0,
      totalPages: 0,
      page: 0,
      size: 5,
      last: true
    }
  },
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
  error: null
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
    clearCurrentReview: (state) => {
      state.currentReview = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý fetchProductReviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.productReviews.content = action.payload.content;
        state.productReviews.pagination = {
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          page: action.payload.page,
          size: action.payload.size,
          last: action.payload.last
        };
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể tải đánh giá sản phẩm';
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

      // Xử lý createReview
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        // Thêm vào đầu danh sách đánh giá sản phẩm nếu cùng sản phẩm
        if (state.productReviews.content.length > 0 && 
            action.payload.productId === state.productReviews.content[0]?.productId) {
          state.productReviews.content.unshift(action.payload);
          state.productReviews.pagination.totalElements += 1;
        }
        // Thêm vào đầu danh sách đánh giá của tôi
        state.myReviews.content.unshift(action.payload);
        state.myReviews.pagination.totalElements += 1;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể tạo đánh giá';
      })

      // Xử lý updateReview
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật trong danh sách đánh giá sản phẩm
        const productReviewIndex = state.productReviews.content.findIndex(review => review.id === action.payload.id);
        if (productReviewIndex !== -1) {
          state.productReviews.content[productReviewIndex] = action.payload;
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
        state.error = action.payload?.message || 'Không thể cập nhật đánh giá';
      })

      // Xử lý deleteReview
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        // Xóa khỏi danh sách đánh giá sản phẩm
        state.productReviews.content = state.productReviews.content.filter(review => review.id !== action.payload);
        if (state.productReviews.pagination.totalElements > 0) {
          state.productReviews.pagination.totalElements -= 1;
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
        state.error = action.payload?.message || 'Không thể xóa đánh giá';
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

export const { clearReviewError, clearCurrentReview } = reviewSlice.actions;

export default reviewSlice.reducer; 