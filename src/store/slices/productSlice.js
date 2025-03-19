import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Các hàm async thunk để lấy dữ liệu sản phẩm
// Trong giai đoạn đầu này, sẽ sử dụng dữ liệu mẫu

// Lấy danh sách sản phẩm
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            // Mô phỏng gọi API
            const response = await new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        data: {
                            content: [
                                {
                                    id: 1,
                                    name: "Áo thun nam basic",
                                    basePrice: 250000,
                                    image: "https://via.placeholder.com/300x300?text=T-Shirt+1",
                                    categoryName: "Áo nam",
                                    brandName: "Nike",
                                    averageRating: 4.5,
                                    reviewCount: 12
                                },
                                {
                                    id: 2,
                                    name: "Quần jeans nữ rách gối",
                                    basePrice: 450000,
                                    image: "https://via.placeholder.com/300x300?text=Jeans+1",
                                    categoryName: "Quần nữ",
                                    brandName: "Zara",
                                    averageRating: 4.2,
                                    reviewCount: 8
                                },
                                {
                                    id: 3,
                                    name: "Áo khoác nữ dáng rộng",
                                    basePrice: 650000,
                                    image: "https://via.placeholder.com/300x300?text=Jacket+1",
                                    categoryName: "Áo khoác nữ",
                                    brandName: "H&M",
                                    averageRating: 4.7,
                                    reviewCount: 15
                                },
                                {
                                    id: 4,
                                    name: "Giày thể thao nam",
                                    basePrice: 850000,
                                    image: "https://via.placeholder.com/300x300?text=Shoes+1",
                                    categoryName: "Giày nam",
                                    brandName: "Adidas",
                                    averageRating: 4.8,
                                    reviewCount: 22
                                },
                                {
                                    id: 5,
                                    name: "Áo sơ mi nam kẻ sọc",
                                    basePrice: 350000,
                                    image: "https://via.placeholder.com/300x300?text=Shirt+1",
                                    categoryName: "Áo nam",
                                    brandName: "Uniqlo",
                                    averageRating: 4.3,
                                    reviewCount: 9
                                },
                                {
                                    id: 6,
                                    name: "Váy đầm nữ công sở",
                                    basePrice: 550000,
                                    image: "https://via.placeholder.com/300x300?text=Dress+1",
                                    categoryName: "Váy đầm",
                                    brandName: "Zara",
                                    averageRating: 4.6,
                                    reviewCount: 17
                                }
                            ],
                            totalElements: 6,
                            totalPages: 1,
                            page: 0,
                            size: 10,
                            last: true
                        }
                    });
                }, 500);
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Lấy chi tiết sản phẩm
export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (id, { rejectWithValue }) => {
        try {
            // Mô phỏng gọi API
            const response = await new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        data: {
                            id: id,
                            name: "Áo thun nam basic",
                            description: "Áo thun nam chất liệu cotton 100%, thấm hút mồ hôi tốt, thiết kế basic phù hợp với mọi dáng người.",
                            basePrice: 250000,
                            image: "https://via.placeholder.com/300x300?text=T-Shirt+1",
                            categoryId: 1,
                            categoryName: "Áo nam",
                            brandId: 1,
                            brandName: "Nike",
                            averageRating: 4.5,
                            reviewCount: 12,
                            images: [
                                "https://via.placeholder.com/800x600?text=T-Shirt+Main",
                                "https://via.placeholder.com/800x600?text=T-Shirt+Front",
                                "https://via.placeholder.com/800x600?text=T-Shirt+Back",
                                "https://via.placeholder.com/800x600?text=T-Shirt+Detail"
                            ],
                            variants: [
                                {
                                    id: 1,
                                    color: "Trắng",
                                    size: "S",
                                    stockQuantity: 15,
                                    priceAdjustment: 0,
                                    finalPrice: 250000,
                                    image: "https://via.placeholder.com/100x100?text=White+S"
                                },
                                {
                                    id: 2,
                                    color: "Trắng",
                                    size: "M",
                                    stockQuantity: 20,
                                    priceAdjustment: 0,
                                    finalPrice: 250000,
                                    image: "https://via.placeholder.com/100x100?text=White+M"
                                },
                                {
                                    id: 3,
                                    color: "Trắng",
                                    size: "L",
                                    stockQuantity: 18,
                                    priceAdjustment: 0,
                                    finalPrice: 250000,
                                    image: "https://via.placeholder.com/100x100?text=White+L"
                                },
                                {
                                    id: 4,
                                    color: "Đen",
                                    size: "S",
                                    stockQuantity: 12,
                                    priceAdjustment: 0,
                                    finalPrice: 250000,
                                    image: "https://via.placeholder.com/100x100?text=Black+S"
                                },
                                {
                                    id: 5,
                                    color: "Đen",
                                    size: "M",
                                    stockQuantity: 22,
                                    priceAdjustment: 0,
                                    finalPrice: 250000,
                                    image: "https://via.placeholder.com/100x100?text=Black+M"
                                },
                                {
                                    id: 6,
                                    color: "Đen",
                                    size: "L",
                                    stockQuantity: 16,
                                    priceAdjustment: 0,
                                    finalPrice: 250000,
                                    image: "https://via.placeholder.com/100x100?text=Black+L"
                                }
                            ]
                        }
                    });
                }, 500);
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    products: [],
    product: null,
    loading: false,
    error: null,
    pagination: {
        totalElements: 0,
        totalPages: 0,
        page: 0,
        size: 10,
        last: true
    }
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
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
                state.error = action.payload || 'Không thể tải danh sách sản phẩm';
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
                state.error = action.payload || 'Không thể tải thông tin sản phẩm';
            });
    }
});

export default productSlice.reducer;