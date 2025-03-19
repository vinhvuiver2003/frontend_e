import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { SearchIcon, ShoppingCartIcon, UserIcon, LogoutIcon, MenuIcon } from '@heroicons/react/outline';

const Header = () => {
    const dispatch = useDispatch();
    const { totalQuantity } = useSelector((state) => state.cart);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        setDropdownOpen(false);
    };

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold flex items-center">
                    <span>Fashion Store</span>
                </Link>

                {/* Search bar - hidden on mobile */}
                <div className="hidden md:flex flex-1 max-w-xl mx-4">
                    <form className="flex w-full">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full border rounded-l px-4 py-2 focus:outline-none"
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
                    <Link to="/products" className="hover:text-blue-500 flex items-center">
                        <span>Sản phẩm</span>
                    </Link>
                    <Link to="/cart" className="hover:text-blue-500 relative flex items-center">
                        <ShoppingCartIcon className="w-5 h-5" />
                        {totalQuantity > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {totalQuantity}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center px-4 py-2 rounded border hover:bg-gray-50 focus:outline-none"
                            >
                                <UserIcon className="w-5 h-5 mr-2" />
                                {user?.firstName || 'Tài khoản'}
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    <Link
                                        to="account/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Thông tin tài khoản
                                    </Link>
                                    <Link
                                        to="/orders"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Đơn hàng của tôi
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

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 py-2">
                    <div className="px-4 py-2">
                        <form className="flex w-full">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-full border rounded-l px-4 py-2 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-r"
                            >
                                <SearchIcon className="w-5 h-5 text-white" />
                            </button>
                        </form>
                    </div>
                    <Link
                        to="/products"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Sản phẩm
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/profile"
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Thông tin tài khoản
                            </Link>
                            <Link
                                to="/orders"
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Đơn hàng của tôi
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col px-4 py-2 space-y-2">
                            <Link
                                to="/login"
                                className="flex items-center justify-center px-4 py-2 rounded border hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <UserIcon className="w-5 h-5 mr-2" />
                                Đăng nhập
                            </Link>
                            <Link
                                to="/register"
                                className="flex items-center justify-center px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;