import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

// Async thunks
export const fetchAllUsers = createAsyncThunk(
    'users/fetchAll',
    async ({ page = 0, size = 10, sortBy = 'id', sortDir = 'asc', search = '', role = '' }) => {
        const response = await userService.getAllUsers(page, size, sortBy, sortDir, search, role);
        return response.data;
    }
);

export const fetchUserById = createAsyncThunk(
    'users/fetchById',
    async (id) => {
        const response = await userService.getUserById(id);
        return response.data;
    }
);

export const updateUser = createAsyncThunk(
    'users/update',
    async ({ id, userData }) => {
        const response = await userService.updateUser(id, userData);
        return response.data;
    }
);

export const deleteUser = createAsyncThunk(
    'users/delete',
    async (id) => {
        await userService.deleteUser(id);
        return id;
    }
);

export const toggleUserStatus = createAsyncThunk(
    'users/toggleStatus',
    async (id) => {
        const response = await userService.toggleUserStatus(id);
        return response.data;
    }
);

export const resetPassword = createAsyncThunk(
    'users/resetPassword',
    async (id) => {
        const response = await userService.resetPassword(id);
        return response.data;
    }
);

export const changePassword = createAsyncThunk(
    'users/changePassword',
    async (passwordData) => {
        const response = await userService.changePassword(passwordData);
        return response.data;
    }
);

// Slice
const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        currentUser: null,
        selectedUser: null,
        loading: false,
        error: null,
        pagination: {
            totalElements: 0,
            totalPages: 0,
            page: 0,
            size: 10,
            last: true
        }
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all users
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.data.content;
                state.pagination = {
                    totalElements: action.payload.data.totalElements,
                    totalPages: action.payload.data.totalPages,
                    page: action.payload.data.page,
                    size: action.payload.data.size,
                    last: action.payload.data.last
                };
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Toggle user status
            .addCase(toggleUserStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleUserStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload.data;
                state.users = state.users.map(user =>
                    user.id === updatedUser.id ? updatedUser : user
                );
            })
            .addCase(toggleUserStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Reset password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch user by id
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload.data;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Update user
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload.data;
                if (state.currentUser?.id === updatedUser.id) {
                    state.currentUser = updatedUser;
                }
                state.users = state.users.map(user =>
                    user.id === updatedUser.id ? updatedUser : user
                );
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Delete user
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(user => user.id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Change password
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearError, setCurrentUser } = userSlice.actions;
export default userSlice.reducer; 