import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { UserIcon, ShoppingBagIcon, CogIcon, LockClosedIcon, LogoutIcon } from '@heroicons/react/outline';

const AccountLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.auth);

    // Chuyển hướng nếu chưa đăng nhập
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    if (!isAuthenticated || !user) {
        return null; // Không hiển thị gì nếu chưa đăng nhập
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Tài khoản của tôi</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center space-x-4 mb-6 p-4 border-b">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <UserIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium">{user.firstName} {user.lastName}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            <NavLink
                                to="/account/profile"
                                className={({isActive}) =>
                                    `flex items-center px-4 py-2 rounded-md ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`
                                }
                            >
                                <UserIcon className="h-5 w-5 mr-3" />
                                Thông tin cá nhân
                            </NavLink>

                            <NavLink
                                to="/account/orders"
                                className={({isActive}) =>
                                    `flex items-center px-4 py-2 rounded-md ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`
                                }
                            >
                                <ShoppingBagIcon className="h-5 w-5 mr-3" />
                                Đơn hàng của tôi
                            </NavLink>

                            <NavLink
                                to="/account/change-password"
                                className={({isActive}) =>
                                    `flex items-center px-4 py-2 rounded-md ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`
                                }
                            >
                                <LockClosedIcon className="h-5 w-5 mr-3" />
                                Đổi mật khẩu
                            </NavLink>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                <LogoutIcon className="h-5 w-5 mr-3" />
                                Đăng xuất
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="md:col-span-3">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AccountLayout;