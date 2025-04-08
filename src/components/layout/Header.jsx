import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { SearchIcon, ShoppingCartIcon, UserIcon, MenuIcon, ChevronDownIcon } from '@heroicons/react/outline';
import authService from '../../services/authService';
import categoryService from '../../services/categoryService';

const Header = () => {
    const dispatch = useDispatch();
    const { totalQuantity } = useSelector((state) => state.cart);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // Kiểm tra xem người dùng có phải là admin không
    const isAdmin = isAuthenticated && user && authService.isAdmin(user);

    // Lấy danh sách danh mục
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getAllCategoriesNoPage();
                if (response && response.data) {
                    // Lọc chỉ lấy các danh mục chính (không có parent) và đang hoạt động
                    const mainCategories = response.data.filter(
                        category => !category.parentId && category.status === 'active'
                    ).slice(0, 5); // Lấy tối đa 5 danh mục
                    setCategories(mainCategories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        setDropdownOpen(false);
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4">
                {/* Top header with logo, search, cart, account */}
                <div className="flex items-center justify-between mb-4">
                    <Link to="/" className="text-2xl font-bold flex items-center">

                        <span>VQL STORE</span>
                    </Link>

                    {/* Search bar - hidden on mobile */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-4">
                        <form className="flex w-full" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-full border rounded-l px-4 py-2 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-r"
                            >
                                <SearchIcon className="w-5 h-5 text-white" />
                            </button>
                        </form>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4">

                        
                        <Link to="/cart" className="hover:text-blue-500 relative flex items-center">
                            <ShoppingCartIcon className="w-5 h-5" />
                            <span className="text-sm ml-1">Giỏ hàng</span>
                            {totalQuantity > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {totalQuantity}
                                </span>
                            )}
                        </Link>

                        {/* Hiển thị link Admin Dashboard nếu là admin */}
                        {isAdmin && (
                            <Link 
                                to="/admin" 
                                className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md"
                            >
                                Quản lý
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center px-4 py-2 rounded border hover:bg-gray-50 focus:outline-none"
                                >
                                    <UserIcon className="w-5 h-5 mr-2" />
                                    <span>{user?.firstName || 'Tài khoản'}</span>
                                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                        <Link
                                            to="/account/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Thông tin tài khoản
                                        </Link>
                                        <Link
                                            to="/account/orders"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Đơn hàng của tôi
                                        </Link>
                                        <Link
                                            to="/account/change-password"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Đổi mật khẩu
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login" className="flex items-center px-4 py-2 rounded border hover:bg-gray-50">
                                    <UserIcon className="w-5 h-5 mr-2" />
                                    Đăng nhập
                                </Link>
                                <Link to="/register" className="flex items-center px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <Link to="/cart" className="mr-4 relative">
                            <ShoppingCartIcon className="w-6 h-6" />
                            {totalQuantity > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {totalQuantity}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Main navigation - categories */}
                <div className="hidden md:block border-t border-gray-200">
                    <nav className="flex items-center py-2">
                        <div className="relative group mr-6">
                            <button 
                                className="flex items-center text-gray-700 hover:text-blue-500 font-medium"
                                onClick={() => setCategoriesOpen(!categoriesOpen)}
                            >
                                <span>Danh mục</span>
                                <ChevronDownIcon className="w-4 h-4 ml-1" />
                            </button>
                            
                            {categoriesOpen && (
                                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    {categories.map(category => (
                                        <Link
                                            key={category.id}
                                            to={`/products?category=${category.id}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setCategoriesOpen(false)}
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                    <Link
                                        to="/products"
                                        className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100 border-t"
                                        onClick={() => setCategoriesOpen(false)}
                                    >
                                        Xem tất cả danh mục
                                    </Link>
                                </div>
                            )}
                        </div>
                        
                        <Link to="/products" className="mr-6 text-gray-700 hover:text-blue-500">
                            Sản phẩm
                        </Link>

                        <Link to="/size-guide" className="mr-6 text-gray-700 hover:text-blue-500">
                            Hướng dẫn chọn size
                        </Link>
                        <Link to="/shipping-policy" className="mr-6 text-gray-700 hover:text-blue-500">
                            Chính sách vận chuyển
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 py-2">
                    <div className="px-4 py-2">
                        <form className="flex w-full" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-full border rounded-l px-4 py-2 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-r"
                            >
                                <SearchIcon className="w-5 h-5 text-white" />
                            </button>
                        </form>
                    </div>
                    <div className="px-4 py-2 space-y-2">
                        <Link
                            to="/products"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Sản phẩm
                        </Link>
                        <Link
                            to="/products/new-arrivals?limit=10"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Mới nhất
                        </Link>
                        <Link
                            to="/products?sortBy=discount-desc"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Khuyến mãi
                        </Link>
                        <Link
                            to="/size-guide"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Hướng dẫn chọn size
                        </Link>
                        <Link
                            to="/shipping-policy"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Chính sách vận chuyển
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/account/profile"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Thông tin tài khoản
                                </Link>
                                <Link
                                    to="/account/orders"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Đơn hàng của tôi
                                </Link>
                                <Link
                                    to="/account/change-password"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Đổi mật khẩu
                                </Link>
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Quản lý
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;