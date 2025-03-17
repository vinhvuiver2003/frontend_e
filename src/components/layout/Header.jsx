import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SearchIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/outline';  // Importing icons

const Header = () => {
    const { totalQuantity } = useSelector((state) => state.cart);

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold flex items-center">
                    <span>Fashion Store</span>
                </Link>

                <div className="flex-1 max-w-xl mx-4">
                    <form className="flex">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full border rounded-l px-4 py-2 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-r"
                        >
                            <SearchIcon className="w-5 h-5 text-white" /> {/* Search Icon */}
                        </button>
                    </form>
                </div>

                <nav className="flex items-center space-x-4">
                    <Link to="/products" className="hover:text-blue-500 flex items-center">
                        <span>Sản phẩm</span>
                    </Link>
                    <Link to="/cart" className="hover:text-blue-500 relative flex items-center">
                        <ShoppingCartIcon className="w-5 h-5" /> {/* Shopping Cart Icon */}
                        {totalQuantity > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {totalQuantity}
                            </span>
                        )}
                    </Link>
                    <Link to="/login" className="flex items-center px-4 py-2 rounded border hover:bg-gray-50">
                        <UserIcon className="w-5 h-5 mr-2" /> {/* User Icon */}
                        Đăng nhập
                    </Link>
                    <Link to="/register" className="flex items-center px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                        <UserIcon className="w-5 h-5 mr-2" /> {/* User Icon */}
                        Đăng ký
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
