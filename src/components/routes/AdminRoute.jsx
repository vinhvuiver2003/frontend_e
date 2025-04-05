import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import authService from '../../services/authService';

/**
 * Component AdminRoute bảo vệ các route chỉ dành cho admin
 * Nếu người dùng không phải admin, chuyển hướng tới trang chủ
 */
const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Kiểm tra xem người dùng có phải là admin không
  const isAdmin = authService.isAdmin(user);

  // Nếu đang tải thông tin người dùng, hiển thị loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, chuyển hướng tới trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Nếu đã đăng nhập nhưng không phải admin, chuyển hướng tới trang chủ
  if (!isAdmin) {
    console.log('Không có quyền admin. Vai trò hiện tại:', user.roles);
    return (
      <Navigate 
        to="/" 
        replace 
        state={{
          error: 'Bạn không có quyền truy cập vào trang này'
        }}
      />
    );
  }

  // Nếu là admin, hiển thị các route con
  return <Outlet />;
};

// Hàm kiểm tra quyền admin dựa trên thông tin người dùng
function checkUserIsAdmin(user) {
  if (!user) return false;
  
  // Kiểm tra trường hợp role là một chuỗi đơn (cấu trúc từ API)
  if (user.role) {
    console.log('Kiểm tra quyền với role:', user.role);
    return user.role === 'ADMIN';
  }
  
  // Kiểm tra nếu roles là chuỗi (VD: "ADMIN,USER")
  if (typeof user.roles === 'string') {
    const rolesArray = user.roles.split(',');
    return rolesArray.includes('ADMIN') || rolesArray.includes('ROLE_ADMIN');
  }
  
  // Kiểm tra nếu roles là mảng (VD: ["ADMIN", "USER"])
  if (Array.isArray(user.roles)) {
    return user.roles.includes('ADMIN') || user.roles.includes('ROLE_ADMIN');
  }
  
  return false;
}

export default AdminRoute; 