import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [],
    totalQuantity: 0,
    totalAmount: 0,
};

// Hàm tiện ích để tính toán lại tổng giỏ hàng
const recalculateCart = (state) => {
    state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
    state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    // Lưu vào localStorage
    localStorage.setItem('cartItems', JSON.stringify(state.items));
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { productId, variantId, quantity = 1, price, name, image, color, size } = action.payload;

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const existingItem = state.items.find(
                item => item.productId === productId && item.variantId === variantId
            );

            if (existingItem) {

                existingItem.quantity += quantity;
            } else {

                state.items.push({
                    id: Date.now().toString(),
                    productId,
                    variantId,
                    name,
                    price,
                    image,
                    color,
                    size,
                    quantity
                });
            }

            recalculateCart(state);
        },

        removeFromCart: (state, action) => {
            const { cartItemId } = action.payload;
            state.items = state.items.filter(item => item.id !== cartItemId);

            recalculateCart(state);
        },

        updateQuantity: (state, action) => {
            const { cartItemId, quantity } = action.payload;
            const item = state.items.find(item => item.id === cartItemId);

            if (item) {
                item.quantity = quantity;
            }

            recalculateCart(state);
        },

        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
            localStorage.removeItem('cartItems');
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;