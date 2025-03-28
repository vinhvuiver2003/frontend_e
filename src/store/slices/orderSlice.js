import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

// Lấy danh sách đơn hàng của người dùng hiện tại
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await orderService.getMyOrders(page, size);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Lấy chi tiết đơn hàng theo ID
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thanh toán giỏ hàng (checkout)
export const checkoutOrder = createAsyncThunk(
  'orders/checkoutOrder',
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await orderService.checkout(checkoutData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Xác nhận đã nhận hàng
export const confirmOrderDelivery = createAsyncThunk(
  'orders/confirmOrderDelivery',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.confirmDelivery(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Hủy đơn hàng
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ id, cancelReason }, { rejectWithValue }) => {
    try {
      const response = await orderService.cancelOrder(id, cancelReason);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Admin: Lấy tất cả đơn hàng
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async ({ page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await orderService.getAllOrders(page, size, sortBy, sortDir);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Admin: Cập nhật trạng thái đơn hàng
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await orderService.updateOrderStatus(id, status);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Admin: Lấy thống kê doanh số
export const fetchSalesStats = createAsyncThunk(
  'orders/fetchSalesStats',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await orderService.getSalesStats(startDate, endDate);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  myOrders: {
    content: [],
    pagination: {
      totalElements: 0,
      totalPages: 0,
      page: 0,
      size: 10,
      last: true
    }
  },
  allOrders: {
    content: [],
    pagination: {
      totalElements: 0,
      totalPages: 0,
      page: 0,
      size: 10,
      last: true
    }
  },
  currentOrder: null,
  lastCreatedOrder: null,
  salesStats: null,
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearLastCreatedOrder: (state) => {
      state.lastCreatedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý fetchMyOrders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders.content = action.payload.content;
        state.myOrders.pagination = {
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          page: action.payload.page,
          size: action.payload.size,
          last: action.payload.last
        };
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể tải danh sách đơn hàng';
      })

      // Xử lý fetchOrderById
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể tải thông tin đơn hàng';
      })

      // Xử lý checkoutOrder
      .addCase(checkoutOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCreatedOrder = action.payload;
        // Nếu đã lấy danh sách đơn hàng, thêm đơn hàng mới vào đầu danh sách
        if (state.myOrders.content.length > 0) {
          state.myOrders.content.unshift(action.payload);
          state.myOrders.pagination.totalElements += 1;
        }
      })
      .addCase(checkoutOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể tạo đơn hàng';
      })

      // Xử lý confirmOrderDelivery
      .addCase(confirmOrderDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmOrderDelivery.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật trong danh sách đơn hàng
        const orderIndex = state.myOrders.content.findIndex(order => order.id === action.payload.id);
        if (orderIndex !== -1) {
          state.myOrders.content[orderIndex] = action.payload;
        }
        // Cập nhật đơn hàng hiện tại nếu đang xem
        if (state.currentOrder && state.currentOrder.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(confirmOrderDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể xác nhận đã nhận hàng';
      })

      // Xử lý cancelOrder
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật trong danh sách đơn hàng
        const orderIndex = state.myOrders.content.findIndex(order => order.id === action.payload.id);
        if (orderIndex !== -1) {
          state.myOrders.content[orderIndex] = action.payload;
        }
        // Cập nhật đơn hàng hiện tại nếu đang xem
        if (state.currentOrder && state.currentOrder.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể hủy đơn hàng';
      })

      // Admin: Xử lý fetchAllOrders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders.content = action.payload.content;
        state.allOrders.pagination = {
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          page: action.payload.page,
          size: action.payload.size,
          last: action.payload.last
        };
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể tải danh sách đơn hàng';
      })

      // Admin: Xử lý updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật trong danh sách tất cả đơn hàng nếu có
        const orderIndex = state.allOrders.content.findIndex(order => order.id === action.payload.id);
        if (orderIndex !== -1) {
          state.allOrders.content[orderIndex] = action.payload;
        }
        // Cập nhật đơn hàng hiện tại nếu đang xem
        if (state.currentOrder && state.currentOrder.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể cập nhật trạng thái đơn hàng';
      })

      // Admin: Xử lý fetchSalesStats
      .addCase(fetchSalesStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesStats.fulfilled, (state, action) => {
        state.loading = false;
        state.salesStats = action.payload;
      })
      .addCase(fetchSalesStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể tải thống kê doanh số';
      });
  }
});

export const { clearOrderError, clearCurrentOrder, clearLastCreatedOrder } = orderSlice.actions;

export default orderSlice.reducer; 