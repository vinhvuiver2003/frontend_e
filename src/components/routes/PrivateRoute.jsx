import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Component PrivateRoute bảo vệ các route yêu cầu đăng nhập
 * Nếu người dùng chưa đăng nhập, chuyển hướng tới trang đăng nhập 
 * và lưu lại đường dẫn hiện tại để quay lại sau khi đăng nhập
 */
const PrivateRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Nếu đang tải thông tin người dùng, hiển thị loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Nếu đã xác thực, hiển thị các route con
  // Nếu chưa xác thực, chuyển hướng tới trang đăng nhập kèm theo state chứa đường dẫn trước đó
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
};

export default PrivateRoute; 