import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services';
import { toast } from 'react-toastify';

// Async thunk để lấy tất cả đơn hàng
export const fetchAllOrders = createAsyncThunk(
    'orders/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderService.getAllOrders();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Lỗi khi lấy dữ liệu đơn hàng');
        }
    }
);

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

// Async thunk để lấy đơn hàng của người dùng
export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await orderService.getOrdersByUser(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Lỗi khi lấy dữ liệu đơn hàng');
        }
    }
);

// Async thunk để lấy đơn hàng theo trạng thái
export const fetchOrdersByStatus = createAsyncThunk(
    'orders/fetchOrdersByStatus',
    async (status, { rejectWithValue }) => {
        try {
            const response = await orderService.getOrdersByStatus(status);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Lỗi khi lấy dữ liệu đơn hàng');
        }
    }
);

// Thanh toán giỏ hàng (checkout)
export const checkoutOrder = createAsyncThunk(
  'orders/checkoutOrder',
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await orderService.checkout(checkoutData);
      toast.success('Đặt hàng thành công');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi đặt hàng');
      return rejectWithValue(error.response?.data || 'Lỗi khi đặt hàng');
    }
  }
);

// Xác nhận đã nhận hàng
export const confirmOrderDelivery = createAsyncThunk(
  'orders/confirmOrderDelivery',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.confirmDelivery(id);
      toast.success('Xác nhận đã nhận hàng thành công');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi xác nhận đã nhận hàng');
      return rejectWithValue(error.response?.data || 'Lỗi khi xác nhận đã nhận hàng');
    }
  }
);

// Async thunk để cập nhật trạng thái đơn hàng
export const updateOrderStatus = createAsyncThunk(
    'orders/updateStatus',
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const response = await orderService.updateOrderStatus(orderId, status);
            toast.success('Cập nhật trạng thái đơn hàng thành công');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái đơn hàng');
            return rejectWithValue(error.response?.data || 'Lỗi khi cập nhật trạng thái đơn hàng');
        }
    }
);

// Async thunk để xóa đơn hàng
export const deleteOrder = createAsyncThunk(
    'orders/delete',
    async (orderId, { rejectWithValue }) => {
        try {
            await orderService.deleteOrder(orderId);
            toast.success('Xóa đơn hàng thành công');
            return orderId;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi xóa đơn hàng');
            return rejectWithValue(error.response?.data || 'Lỗi khi xóa đơn hàng');
        }
    }
);

// Xác nhận đã nhận hàng
export const confirmDelivery = createAsyncThunk(
    'orders/confirmDelivery',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await orderService.confirmDelivery(orderId);
            toast.success('Xác nhận đã nhận hàng thành công');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi xác nhận đã nhận hàng');
            return rejectWithValue(error.response?.data || 'Lỗi khi xác nhận đã nhận hàng');
        }
    }
);

// Hủy đơn hàng
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ id, cancelReason }, { rejectWithValue }) => {
    try {
      const response = await orderService.cancelOrder(id, cancelReason);
      toast.success('Hủy đơn hàng thành công');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi hủy đơn hàng');
      return rejectWithValue(error.response?.data || 'Lỗi khi hủy đơn hàng');
    }
  }
);

// Admin: Lấy tất cả đơn hàng
export const fetchAdminOrders = createAsyncThunk(
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

// Async thunk để lấy thống kê doanh số
export const fetchSalesStats = createAsyncThunk(
    'orders/salesStats',
    async ({ startDate, endDate }, { rejectWithValue }) => {
        try {
            const response = await orderService.getSalesStats(startDate, endDate);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi lấy thống kê doanh số');
            return rejectWithValue(error.response?.data || 'Lỗi khi lấy thống kê doanh số');
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
        setCurrentOrder: (state, action) => {
            state.currentOrder = action.payload;
        },
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
            // fetchAllOrders
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.allOrders.content = action.payload.content || action.payload;
                if (action.payload.totalElements) {
                    state.allOrders.pagination = {
                        totalElements: action.payload.totalElements,
                        totalPages: action.payload.totalPages,
                        page: action.payload.page,
                        size: action.payload.size,
                        last: action.payload.last
                    };
                }
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tải danh sách đơn hàng';
            })
            
            // fetchUserOrders
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.myOrders.content = action.payload.content || action.payload;
                if (action.payload.totalElements) {
                    state.myOrders.pagination = {
                        totalElements: action.payload.totalElements,
                        totalPages: action.payload.totalPages,
                        page: action.payload.page,
                        size: action.payload.size,
                        last: action.payload.last
                    };
                }
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tải danh sách đơn hàng';
            })
            
            // fetchOrdersByStatus
            .addCase(fetchOrdersByStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.filteredOrders = action.payload;
            })
            .addCase(fetchOrdersByStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tải danh sách đơn hàng';
            })
            
            // updateOrderStatus
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                
                // Cập nhật trong allOrders
                const index = state.allOrders.content.findIndex(order => order.id === action.payload.id);
                if (index !== -1) {
                    state.allOrders.content[index] = action.payload;
                }
                
                // Cập nhật trong userOrders
                const userOrderIndex = state.myOrders.content.findIndex(order => order.id === action.payload.id);
                if (userOrderIndex !== -1) {
                    state.myOrders.content[userOrderIndex] = action.payload;
                }
                
                // Cập nhật currentOrder nếu đang xem
                if (state.currentOrder && state.currentOrder.id === action.payload.id) {
                    state.currentOrder = action.payload;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể cập nhật trạng thái đơn hàng';
            })
            
            // deleteOrder
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                
                // Xóa khỏi allOrders
                state.allOrders.content = state.allOrders.content.filter(order => order.id !== action.payload);
                
                // Xóa khỏi userOrders
                state.myOrders.content = state.myOrders.content.filter(order => order.id !== action.payload);
                
                // Reset currentOrder nếu đang xem order bị xóa
                if (state.currentOrder && state.currentOrder.id === action.payload) {
                    state.currentOrder = null;
                }
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể xóa đơn hàng';
            })
            
            // confirmDelivery
            .addCase(confirmDelivery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmDelivery.fulfilled, (state, action) => {
                state.loading = false;
                
                // Cập nhật trong các danh sách
                const index = state.allOrders.content.findIndex(order => order.id === action.payload.id);
                if (index !== -1) {
                    state.allOrders.content[index] = action.payload;
                }
                
                const userOrderIndex = state.myOrders.content.findIndex(order => order.id === action.payload.id);
                if (userOrderIndex !== -1) {
                    state.myOrders.content[userOrderIndex] = action.payload;
                }
                
                if (state.currentOrder && state.currentOrder.id === action.payload.id) {
                    state.currentOrder = action.payload;
                }
            })
            .addCase(confirmDelivery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể xác nhận đã nhận hàng';
            })
            
            // checkoutOrder
            .addCase(checkoutOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkoutOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.lastCreatedOrder = action.payload;
                // Thêm đơn hàng mới vào đầu danh sách đơn hàng của người dùng
                if (state.myOrders.content.length > 0) {
                    state.myOrders.content.unshift(action.payload);
                    state.myOrders.pagination.totalElements += 1;
                }
            })
            .addCase(checkoutOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tạo đơn hàng';
            })
            
            // fetchSalesStats
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
            })
            
            // cancelOrder
            .addCase(cancelOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading = false;
                
                // Cập nhật trong các danh sách
                const index = state.allOrders.content.findIndex(order => order.id === action.payload.id);
                if (index !== -1) {
                    state.allOrders.content[index] = action.payload;
                }
                
                const userOrderIndex = state.myOrders.content.findIndex(order => order.id === action.payload.id);
                if (userOrderIndex !== -1) {
                    state.myOrders.content[userOrderIndex] = action.payload;
                }
                
                if (state.currentOrder && state.currentOrder.id === action.payload.id) {
                    state.currentOrder = action.payload;
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể hủy đơn hàng';
            });
    }
});

export const { setCurrentOrder, clearOrderError, clearCurrentOrder, clearLastCreatedOrder } = orderSlice.actions;

export default orderSlice.reducer; 