import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService, promotionService } from '../../services';

// Tạo hoặc lấy sessionId cho khách chưa đăng nhập
const getSessionId = () => {
  let sessionId = localStorage.getItem('guest_session_id');
  if (!sessionId) {
    sessionId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('guest_session_id', sessionId);
  }
  return sessionId;
};

// Lấy giỏ hàng từ server
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      let response;

      if (auth.isAuthenticated) {
        try {
          // Nếu đã đăng nhập, lấy giỏ hàng theo user
          response = await cartService.getMyCart();
        } catch (error) {
          // Nếu không tìm thấy giỏ hàng (404) hoặc có lỗi khác
          if (error.response && error.response.status === 404) {
            // Tạo giỏ hàng mới cho người dùng đã đăng nhập
            console.log('Người dùng chưa có giỏ hàng, đang tạo giỏ hàng mới...');
            response = await cartService.addItemToCart(null, {
              productId: null,  // Không cần sản phẩm, chỉ cần tạo giỏ hàng trống
              quantity: 0
            });
            return response.data.data || { id: response.data.data.id, items: [], totalQuantity: 0, totalAmount: 0 };
          }
          throw error; // Nếu là lỗi khác, ném ra để xử lý ở catch bên ngoài
        }
      } else {
        // Nếu chưa đăng nhập, tạo hoặc lấy sessionId và lấy giỏ hàng theo sessionId
        const sessionId = getSessionId();
        response = await cartService.getGuestCart(sessionId);
      }

      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Nếu giỏ hàng không tồn tại, trả về giỏ hàng trống
        return { id: null, items: [], totalQuantity: 0, totalAmount: 0 };
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thêm sản phẩm vào giỏ hàng
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (cartItem, { rejectWithValue, getState, dispatch }) => {
    try {
      const { cart, auth } = getState();
      
      // Nếu chưa có cartId, cần lấy giỏ hàng trước
      if (!cart.cartId) {
        await dispatch(fetchCart());
        // Lấy lại state sau khi fetchCart
        const updatedState = getState();
        if (!updatedState.cart.cartId) {
          // Nếu vẫn chưa có cartId, tạo giỏ hàng mới
          if (auth.isAuthenticated) {
            // Tạo giỏ hàng cho user đã đăng nhập
            const response = await cartService.addItemToCart(null, cartItem);
            return response.data.data;
          } else {
            // Tạo giỏ hàng cho khách
            const sessionId = getSessionId();
            const guestCartItem = { ...cartItem, sessionId };
            const response = await cartService.addItemToCart(null, guestCartItem);
            return response.data.data;
          }
        }
      }

      // Thêm vào giỏ hàng đã có
      const response = await cartService.addItemToCart(getState().cart.cartId, cartItem);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItemAsync',
  async ({ cartItemId, quantity }, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      if (!cart.cartId) {
        throw new Error('Không tìm thấy giỏ hàng');
      }
      
      const response = await cartService.updateCartItem(cart.cartId, cartItemId, quantity);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (cartItemId, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      if (!cart.cartId) {
        throw new Error('Không tìm thấy giỏ hàng');
      }
      
      const response = await cartService.removeItemFromCart(cart.cartId, cartItemId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Xóa toàn bộ giỏ hàng
export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      if (!cart.cartId) return { success: true };
      
      await cartService.clearCart(cart.cartId);
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Hợp nhất giỏ hàng sau khi đăng nhập
export const mergeCartsAsync = createAsyncThunk(
  'cart/mergeCartsAsync',
  async (_, { rejectWithValue }) => {
    try {
      const sessionId = localStorage.getItem('guest_session_id');
      if (!sessionId) return { success: false };
      
      const response = await cartService.mergeGuestCart(sessionId);
      // Xóa sessionId sau khi đã hợp nhất thành công
      localStorage.removeItem('guest_session_id');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thêm action async để áp dụng mã giảm giá
export const applyPromotionAsync = createAsyncThunk(
  'cart/applyPromotionAsync',
  async (code, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      const totalAmount = cart.totalAmount;

      // Lấy thông tin mã giảm giá từ server
      const response = await promotionService.validatePromotion(code);
      const promotion = response.data;

      // Kiểm tra điều kiện giá trị đơn hàng tối thiểu
      if (promotion.minimumOrder && totalAmount < promotion.minimumOrder) {
        return rejectWithValue({
          message: `Đơn hàng của bạn cần đạt giá trị tối thiểu ${promotion.minimumOrder.toLocaleString()}đ để sử dụng mã này!`,
          promotion: promotion,
          currentTotal: totalAmount
        });
      }

      return promotion;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  cartId: null,
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  loading: false,
  error: null,
  promotion: null,
  discountAmount: 0,
  invalidPromotion: null
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
    // Thay đổi giỏ hàng khi đăng nhập/đăng xuất (nếu cần)
    resetCart: (state) => {
      state.cartId = null;
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.error = null;
      state.promotion = null;
      state.discountAmount = 0;
      state.invalidPromotion = null;
    },
    removePromotion: (state) => {
      state.promotion = null;
      state.discountAmount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartId = action.payload.id;
        state.items = action.payload.items || [];
        
        // Tính toán lại tổng số lượng từ các mục trong giỏ hàng
        state.totalQuantity = state.items.reduce((total, item) => total + (item.quantity || 0), 0);
        
        // Sử dụng totalAmount từ backend hoặc tính lại nếu không có
        state.totalAmount = action.payload.totalAmount || 
                           state.items.reduce((total, item) => {
                             const itemPrice = item.unitPrice || item.price || 0;
                             return total + itemPrice * (item.quantity || 1);
                           }, 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể tải giỏ hàng';
      })

      // Xử lý addToCartAsync
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.cartId = action.payload.id;
        state.items = action.payload.items;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể thêm sản phẩm vào giỏ hàng';
      })

      // Xử lý updateCartItemAsync
      .addCase(updateCartItemAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể cập nhật số lượng sản phẩm';
      })

      // Xử lý removeFromCartAsync
      .addCase(removeFromCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể xóa sản phẩm khỏi giỏ hàng';
      })

      // Xử lý clearCartAsync
      .addCase(clearCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalQuantity = 0;
        state.totalAmount = 0;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể xóa giỏ hàng';
      })

      // Xử lý mergeCartsAsync
      .addCase(mergeCartsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCartsAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.id) {
          state.cartId = action.payload.id;
          state.items = action.payload.items;
          state.totalQuantity = action.payload.totalQuantity;
          state.totalAmount = action.payload.totalAmount;
        }
      })
      .addCase(mergeCartsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể hợp nhất giỏ hàng';
      })

      // Xử lý applyPromotionAsync
      .addCase(applyPromotionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyPromotionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.promotion = action.payload;
        
        // Tính toán giảm giá
        if (action.payload && state.totalAmount > 0) {
          if (action.payload.discountType === 'percentage') {
            // Giảm giá theo phần trăm
            const percentage = parseFloat(action.payload.discountValue);
            state.discountAmount = (state.totalAmount * percentage) / 100;
          } else {
            // Giảm giá cố định
            state.discountAmount = parseFloat(action.payload.discountValue);
            // Đảm bảo giảm giá không vượt quá tổng giá trị đơn hàng
            if (state.discountAmount > state.totalAmount) {
              state.discountAmount = state.totalAmount;
            }
          }
        }
      })
      .addCase(applyPromotionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Mã giảm giá không hợp lệ';
        state.invalidPromotion = action.payload?.promotion || null;
        state.promotion = null;
        state.discountAmount = 0;
      });
  }
});

export const { clearCartError, resetCart, removePromotion } = cartSlice.actions;

export default cartSlice.reducer;