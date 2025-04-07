import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, getProductsByCategoryAndBrand } from '../../store/slices/productSlice';
import ProductCard from '../../components/product/ProductCard';
import { FilterIcon } from '@heroicons/react/solid';
import categoryService from '../../services/categoryService';
import brandService from '../../services/brandService';

const ProductList = () => {
    const dispatch = useDispatch();
    const { products, loading, error, pagination } = useSelector(state => state.products);
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilter, setShowFilter] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingBrands, setLoadingBrands] = useState(false);

    // Lấy tham số từ URL
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '12');
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '10000000');
    const sortBy = searchParams.get('sortBy') || 'id';
    const sortDir = searchParams.get('sortDir') || 'desc';

    // Fetch danh mục và thương hiệu khi component mount
    useEffect(() => {
        const fetchCategoriesAndBrands = async () => {
            setLoadingCategories(true);
            setLoadingBrands(true);
            try {
                const categoriesResponse = await categoryService.getAllCategoriesNoPage();
                setCategories(categoriesResponse.data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoadingCategories(false);
            }

            try {
                const brandsResponse = await brandService.getAllBrandsNoPage();
                setBrands(brandsResponse.data || []);
            } catch (error) {
                console.error('Error fetching brands:', error);
            } finally {
                setLoadingBrands(false);
            }
        };

        fetchCategoriesAndBrands();
    }, []);

    useEffect(() => {
        if (category && brand) {
            dispatch(getProductsByCategoryAndBrand({
                categoryId: category,
                brandId: brand,
                page,
                size,
                sortBy,
                sortDir
            }));
        } else {
            dispatch(fetchProducts({
                page,
                size,
                sortBy,
                sortDir,
                ...(category && { categoryId: category }),
                ...(brand && { brandId: brand }),
                ...(search && { keyword: search }),
                ...(minPrice > 0 && { minPrice }),
                ...(maxPrice > 0 && { maxPrice })
            }));
        }
    }, [dispatch, category, brand, search, page, size, minPrice, maxPrice, sortBy, sortDir]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        const params = {};
        for (const [key, val] of searchParams.entries()) {
            params[key] = val;
        }

        params[name] = value;

        // Reset về trang đầu tiên khi thay đổi bất kỳ bộ lọc hoặc sắp xếp nào
        if (name === 'category' || name === 'brand' || name === 'minPrice' || 
            name === 'maxPrice' || name === 'sortBy' || name === 'sortDir') {
            params.page = 0;
        }

        setSearchParams(params);
    };

    const handleSortChange = (e) => {
        const [newSortBy, newSortDir] = e.target.value.split('-');
        
        const params = {};
        for (const [key, val] of searchParams.entries()) {
            params[key] = val;
        }
        
        params.sortBy = newSortBy;
        params.sortDir = newSortDir;
        params.page = 0; // Reset về trang đầu tiên khi thay đổi sắp xếp
        
        setSearchParams(params);
    };

    if (loading && !products.length) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error && !products.length) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Đã xảy ra lỗi: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Tìm kiếm hiện tại - Đã di chuyển ra ngoài flex container */}
            {search && (
                <div className="w-full mb-4 bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <p className="text-sm">
                            Kết quả tìm kiếm cho: <span className="font-semibold">"{search}"</span>
                        </p>
                        <button 
                            onClick={() => {
                                const newParams = {};
                                for (const [key, value] of searchParams.entries()) {
                                    if (key !== 'search') {
                                        newParams[key] = value;
                                    }
                                }
                                setSearchParams(newParams);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800"
                        >
                            Xóa tìm kiếm
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
                {/* Bộ lọc cho mobile */}
                <div className="md:hidden mb-4">
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded-lg"
                    >
                        <span>Bộ lọc</span>
                        <FilterIcon className="w-5 h-5" />
                    </button>

                    {showFilter && (
                        <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Danh mục
                                </label>
                                <select
                                    name="category"
                                    value={category}
                                    onChange={handleFilterChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    disabled={loadingCategories}
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {loadingCategories ? (
                                        <option>Đang tải...</option>
                                    ) : (
                                        categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thương hiệu
                                </label>
                                <select
                                    name="brand"
                                    value={brand}
                                    onChange={handleFilterChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    disabled={loadingBrands}
                                >
                                    <option value="">Tất cả thương hiệu</option>
                                    {loadingBrands ? (
                                        <option>Đang tải...</option>
                                    ) : (
                                        brands.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Khoảng giá
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        name="minPrice"
                                        value={minPrice}
                                        onChange={handleFilterChange}
                                        placeholder="Giá thấp nhất"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        value={maxPrice}
                                        onChange={handleFilterChange}
                                        placeholder="Giá cao nhất"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sắp xếp theo
                                </label>
                                <select
                                    name="sortBy"
                                    value={`${sortBy}-${sortDir}`}
                                    onChange={handleSortChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="id-desc">Mới nhất</option>
                                    <option value="name-asc">Tên A-Z</option>
                                    <option value="name-desc">Tên Z-A</option>
                                    <option value="basePrice-asc">Giá thấp đến cao</option>
                                    <option value="basePrice-desc">Giá cao đến thấp</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bộ lọc cho desktop */}
                <div className="hidden md:block w-64 bg-white p-4 rounded-lg shadow-md h-fit">
                    <h2 className="text-lg font-semibold mb-4">Bộ lọc</h2>

                    <div className="mb-4">
                        <h3 className="text-md font-medium mb-2">Danh mục</h3>
                        <select
                            name="category"
                            value={category}
                            onChange={handleFilterChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            disabled={loadingCategories}
                        >
                            <option value="">Tất cả danh mục</option>
                            {loadingCategories ? (
                                <option>Đang tải...</option>
                            ) : (
                                categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-md font-medium mb-2">Thương hiệu</h3>
                        <select
                            name="brand"
                            value={brand}
                            onChange={handleFilterChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            disabled={loadingBrands}
                        >
                            <option value="">Tất cả thương hiệu</option>
                            {loadingBrands ? (
                                <option>Đang tải...</option>
                            ) : (
                                brands.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-md font-medium mb-2">Khoảng giá</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                name="minPrice"
                                value={minPrice}
                                onChange={handleFilterChange}
                                placeholder="Giá thấp nhất"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                                type="number"
                                name="maxPrice"
                                value={maxPrice}
                                onChange={handleFilterChange}
                                placeholder="Giá cao nhất"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-md font-medium mb-2">Sắp xếp theo</h3>
                        <select
                            name="sortBy"
                            value={`${sortBy}-${sortDir}`}
                            onChange={handleSortChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="id-desc">Mới nhất</option>
                            <option value="name-asc">Tên A-Z</option>
                            <option value="name-desc">Tên Z-A</option>
                            <option value="basePrice-asc">Giá thấp đến cao</option>
                            <option value="basePrice-desc">Giá cao đến thấp</option>
                        </select>
                    </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Sản phẩm</h1>
                        <p className="text-gray-600">
                            {loading ? 'Đang tải...' : `Hiển thị ${products.length} / ${pagination.totalElements || 0} sản phẩm`}
                        </p>
                    </div>

                    {loading && products.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-gray-100 rounded-lg p-8 text-center">
                            <p className="text-gray-600">Không tìm thấy sản phẩm phù hợp.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {loading && (
                                <div className="flex justify-center mt-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            )}

                            {/* Phân trang */}
                            {!loading && pagination.totalPages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <nav className="inline-flex rounded-md shadow">
                                        <button
                                            onClick={() => handleFilterChange({
                                                target: { name: 'page', value: Math.max(0, page - 1) }
                                            })}
                                            disabled={page === 0}
                                            className={`px-4 py-2 rounded-l-md border ${
                                                page === 0
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            Trước
                                        </button>

                                        {[...Array(pagination.totalPages).keys()].map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => handleFilterChange({
                                                    target: { name: 'page', value: pageNum }
                                                })}
                                                className={`px-4 py-2 border-t border-b ${
                                                    pageNum === page
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNum + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handleFilterChange({
                                                target: { name: 'page', value: Math.min(pagination.totalPages - 1, page + 1) }
                                            })}
                                            disabled={page === pagination.totalPages - 1}
                                            className={`px-4 py-2 rounded-r-md border ${
                                                page === pagination.totalPages - 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            Sau
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;