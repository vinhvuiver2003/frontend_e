import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import authService from '../../services/authService';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  ViewListIcon, 
  ChartBarIcon, 
  CogIcon, 
  LogoutIcon,
  TagIcon,
  ArchiveIcon 
} from '@heroicons/react/outline';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  // Chuyển hướng nếu chưa đăng nhập hoặc không phải là admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!authService.isAdmin(user)) {
      console.log('Vai trò của người dùng:', user.roles);
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Ngừng render nếu người dùng không phải admin
  if (!isAuthenticated || !user || !authService.isAdmin(user)) {
    return null; // Không hiển thị gì nếu chưa đăng nhập hoặc không phải admin
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r">
          {/* Logo và thông tin admin */}
          <div className="h-16 flex items-center px-6 border-b">
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-3 px-6 py-3 border-b">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <UserGroupIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex flex-col flex-grow py-4">
            <nav className="flex-1 space-y-1 px-3">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <HomeIcon className="h-5 w-5 mr-3" />
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <ShoppingBagIcon className="h-5 w-5 mr-3" />
                Quản lý sản phẩm
              </NavLink>

              <NavLink
                to="/admin/categories"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <TagIcon className="h-5 w-5 mr-3" />
                Danh mục
              </NavLink>

              <NavLink
                to="/admin/brands"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <ArchiveIcon className="h-5 w-5 mr-3" />
                Thương hiệu
              </NavLink>

              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <ViewListIcon className="h-5 w-5 mr-3" />
                Quản lý đơn hàng
              </NavLink>

              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <UserGroupIcon className="h-5 w-5 mr-3" />
                Quản lý người dùng
              </NavLink>

              <NavLink
                to="/admin/statistics"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <ChartBarIcon className="h-5 w-5 mr-3" />
                Thống kê
              </NavLink>

              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <CogIcon className="h-5 w-5 mr-3" />
                Cài đặt
              </NavLink>

              <hr className="my-4 border-gray-200" />
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
              >
                <LogoutIcon className="h-5 w-5 mr-3" />
                Đăng xuất
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Mobile menu button */}
      <div className="md:hidden flex items-center px-4 border-b h-16">
        <button 
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => document.getElementById('mobile-menu').classList.toggle('hidden')}
        >
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="ml-4 text-xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>
      
      {/* Mobile menu */}
      <div id="mobile-menu" className="md:hidden hidden absolute top-16 left-0 right-0 z-10 bg-white border-b shadow-lg">
        <nav className="px-4 py-2 space-y-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
            onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}
          >
            <HomeIcon className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
            onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}
          >
            <ShoppingBagIcon className="h-5 w-5 mr-3" />
            Quản lý sản phẩm
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
            onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}
          >
            <ViewListIcon className="h-5 w-5 mr-3" />
            Quản lý đơn hàng
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
            onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}
          >
            <UserGroupIcon className="h-5 w-5 mr-3" />
            Quản lý người dùng
          </NavLink>

          <button
            onClick={() => {
              document.getElementById('mobile-menu').classList.add('hidden');
              handleLogout();
            }}
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
          >
            <LogoutIcon className="h-5 w-5 mr-3" />
            Đăng xuất
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 