// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Async thunk để đăng nhập
export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ usernameOrEmail, password }, { rejectWithValue }) => {
        try {
            const response = await authService.login({ usernameOrEmail, password });
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Async thunk để đăng ký
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authService.register(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    user: (() => {
        const userData = localStorage.getItem('user');
        if (!userData || userData === 'undefined') return null;
        try {
            return JSON.parse(userData);
        } catch (error) {
            // Xóa dữ liệu không hợp lệ
            localStorage.removeItem('user');
            return null;
        }
    })(),
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        updateUserProfile: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý đăng nhập
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                
                // Kiểm tra cấu trúc dữ liệu trước khi truy cập
                if (action.payload && action.payload.data) {
                    // Cấu trúc data.user và accessToken từ API
                    state.user = action.payload.data.user;
                    state.token = action.payload.data.accessToken;
                    state.isAuthenticated = true;

                    localStorage.setItem('user', JSON.stringify(action.payload.data.user));
                    localStorage.setItem('token', action.payload.data.accessToken);
                } else if (action.payload && action.payload.user) {
                    // Cấu trúc trực tiếp với user và accessToken
                    state.user = action.payload.user;
                    state.token = action.payload.accessToken;
                    state.isAuthenticated = true;

                    localStorage.setItem('user', JSON.stringify(action.payload.user));
                    localStorage.setItem('token', action.payload.accessToken);
                } else {
                    // Log lỗi nếu không tìm thấy cấu trúc phù hợp
                    console.error('Cấu trúc phản hồi không đúng:', action.payload);
                    state.error = 'Định dạng phản hồi từ server không đúng';
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Đăng nhập thất bại';
            })

            // Xử lý đăng ký
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Đăng ký thất bại';
            });
    }
});

export const { logout, updateUserProfile, clearError } = authSlice.actions;

export default authSlice.reducer;