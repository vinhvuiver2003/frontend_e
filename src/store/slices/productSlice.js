import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services';

// Các hàm async thunk để lấy dữ liệu sản phẩm
// Trong giai đoạn đầu này, sẽ sử dụng dữ liệu mẫu

// Lấy danh sách sản phẩm
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (params, { rejectWithValue }) => {
        try {
            const { 
                page = 0, 
                size = 12, 
                sortBy = 'id', 
                sortDir = 'desc',
                categoryId,
                brandId,
                keyword,
                minPrice,
                maxPrice
            } = params || {};
            
            let response;
            
            // Nếu có từ khóa tìm kiếm, gọi API tìm kiếm
            if (keyword) {
                const searchResponse = await productService.searchProducts(
                    keyword, page, size, sortBy, sortDir
                );
                response = searchResponse;
            } 
            // Nếu có danh mục, gọi API lọc theo danh mục
            else if (categoryId) {
                const categoryResponse = await productService.getProductsByCategory(
                    categoryId, page, size, sortBy, sortDir
                );
                response = categoryResponse;
            }
            // Nếu có thương hiệu, gọi API lọc theo thương hiệu
            else if (brandId) {
                const brandResponse = await productService.getProductsByBrand(
                    brandId, page, size, sortBy, sortDir
                );
                response = brandResponse;
            }
            // Nếu có khoảng giá, gọi API lọc theo giá
            else if ((minPrice !== undefined && minPrice > 0) || (maxPrice !== undefined && maxPrice < 10000000)) {
                const priceResponse = await productService.filterProductsByPrice(
                    minPrice || 0, maxPrice || 10000000, page, size, sortBy, sortDir
                );
                response = priceResponse;
            }
            // Nếu không có điều kiện đặc biệt, lấy tất cả sản phẩm
            else {
                const allResponse = await productService.getAllProducts(
                    page, size, sortBy, sortDir
                );
                response = allResponse;
            }
            
            console.log('API Response:', response);
            
            // Đảm bảo response.data.data tồn tại
            if (!response.data || !response.data.data) {
                return rejectWithValue('Cấu trúc dữ liệu không hợp lệ');
            }
            
            return response.data.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Lấy chi tiết sản phẩm
export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await productService.getProductById(id);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Lấy sản phẩm theo danh mục
export const fetchProductsByCategory = createAsyncThunk(
    'products/fetchProductsByCategory',
    async ({ categoryId, page = 0, size = 12 }, { rejectWithValue }) => {
        try {
            const response = await productService.getProductsByCategory(categoryId, page, size);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Lấy sản phẩm theo thương hiệu
export const fetchProductsByBrand = createAsyncThunk(
    'products/fetchProductsByBrand',
    async ({ brandId, page = 0, size = 12 }, { rejectWithValue }) => {
        try {
            const response = await productService.getProductsByBrand(brandId, page, size);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Tìm kiếm sản phẩm
export const searchProducts = createAsyncThunk(
    'products/searchProducts',
    async ({ keyword, page = 0, size = 12 }, { rejectWithValue }) => {
        try {
            const response = await productService.searchProducts(keyword, page, size);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Lọc sản phẩm theo giá
export const filterProductsByPrice = createAsyncThunk(
    'products/filterProductsByPrice',
    async ({ minPrice, maxPrice, page = 0, size = 12 }, { rejectWithValue }) => {
        try {
            const response = await productService.filterProductsByPrice(minPrice, maxPrice, page, size);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Lấy sản phẩm mới
export const fetchNewArrivals = createAsyncThunk(
    'products/fetchNewArrivals',
    async (limit = 8, { rejectWithValue }) => {
        try {
            const response = await productService.getNewArrivals(limit);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Lấy sản phẩm được đánh giá cao
export const fetchTopRatedProducts = createAsyncThunk(
    'products/fetchTopRatedProducts',
    async (limit = 8, { rejectWithValue }) => {
        try {
            const response = await productService.getTopRatedProducts(limit);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Admin: Tạo sản phẩm mới
export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await productService.createProduct(productData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Admin: Cập nhật sản phẩm
export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await productService.updateProduct(id, productData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Admin: Xóa sản phẩm
export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            await productService.deleteProduct(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getProductsByCategoryAndBrand = createAsyncThunk(
    'products/getByCategoryAndBrand',
    async ({ categoryId, brandId, page, size, sortBy, sortDir }, { rejectWithValue }) => {
        try {
            const response = await productService.getProductsByCategoryAndBrand(
                categoryId, brandId, page, size, sortBy, sortDir
            );
            // Kiểm tra cấu trúc response và trả về dữ liệu phù hợp
            if (response.data && response.data.data) {
                return response.data.data;
            } else if (response.data) {
                return response.data;
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    products: [],
    newArrivals: [],
    topRated: [],
    product: null,
    loading: false,
    error: null,
    pagination: {
        totalElements: 0,
        totalPages: 0,
        page: 0,
        size: 12,
        last: true
    }
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearProductError: (state) => {
            state.error = null;
        },
        clearProductDetail: (state) => {
            state.product = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý fetchProducts
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.content;
                state.pagination = {
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    page: action.payload.page,
                    size: action.payload.size,
                    last: action.payload.last
                };
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tải danh sách sản phẩm';
            })

            // Xử lý fetchProductById
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tải thông tin sản phẩm';
            })

            // Xử lý fetchProductsByCategory
            .addCase(fetchProductsByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.content;
                state.pagination = {
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    page: action.payload.page,
                    size: action.payload.size,
                    last: action.payload.last
                };
            })
            .addCase(fetchProductsByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tải sản phẩm theo danh mục';
            })

            // Xử lý fetchProductsByBrand
            .addCase(fetchProductsByBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByBrand.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.content;
                state.pagination = {
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    page: action.payload.page,
                    size: action.payload.size,
                    last: action.payload.last
                };
            })
            .addCase(fetchProductsByBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tải sản phẩm theo thương hiệu';
            })

            // Xử lý searchProducts
            .addCase(searchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.content;
                state.pagination = {
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    page: action.payload.page,
                    size: action.payload.size,
                    last: action.payload.last
                };
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tìm kiếm sản phẩm';
            })

            // Xử lý filterProductsByPrice
            .addCase(filterProductsByPrice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(filterProductsByPrice.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.content;
                state.pagination = {
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    page: action.payload.page,
                    size: action.payload.size,
                    last: action.payload.last
                };
            })
            .addCase(filterProductsByPrice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể lọc sản phẩm theo giá';
            })

            // Xử lý fetchNewArrivals
            .addCase(fetchNewArrivals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNewArrivals.fulfilled, (state, action) => {
                state.loading = false;
                state.newArrivals = action.payload;
            })
            .addCase(fetchNewArrivals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tải sản phẩm mới';
            })

            // Xử lý fetchTopRatedProducts
            .addCase(fetchTopRatedProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTopRatedProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.topRated = action.payload;
            })
            .addCase(fetchTopRatedProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tải sản phẩm đánh giá cao';
            })

            // Admin: Xử lý createProduct
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.unshift(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tạo sản phẩm mới';
            })

            // Admin: Xử lý updateProduct
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
                if (state.product && state.product.id === action.payload.id) {
                    state.product = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể cập nhật sản phẩm';
            })

            // Admin: Xử lý deleteProduct
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(p => p.id !== action.payload);
                if (state.product && state.product.id === action.payload) {
                    state.product = null;
                }
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể xóa sản phẩm';
            })

            // Xử lý getProductsByCategoryAndBrand
            .addCase(getProductsByCategoryAndBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductsByCategoryAndBrand.fulfilled, (state, action) => {
                state.loading = false;
                // Kiểm tra cấu trúc dữ liệu trả về
                const data = action.payload;
                state.products = data.content || data.products || [];
                state.pagination = {
                    totalElements: data.totalElements || 0,
                    totalPages: data.totalPages || 0,
                    page: data.page || 0,
                    size: data.size || 12,
                    last: data.last || true
                };
            })
            .addCase(getProductsByCategoryAndBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearProductError, clearProductDetail } = productSlice.actions;

export default productSlice.reducer;