import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component hiển thị thông báo lỗi phân quyền
 * Được hiển thị khi người dùng bị chuyển hướng do không có quyền truy cập
 */
const AuthErrorAlert = () => {
    const location = useLocation();
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Kiểm tra xem location.state có chứa thông báo lỗi không
        if (location.state && location.state.error) {
            setMessage(location.state.error);
            setVisible(true);
            
            // Tự động ẩn thông báo sau 5 giây
            const timer = setTimeout(() => {
                setVisible(false);
                
                // Xóa thông báo lỗi khỏi state để tránh hiển thị lại khi chuyển trang
                if (window.history.replaceState) {
                    const newState = { ...location.state };
                    delete newState.error;
                    window.history.replaceState({ ...newState }, '');
                }
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [location]);

    if (!visible) return null;

    return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-md max-w-md">
                <span className="block sm:inline">{message}</span>
                <button 
                    onClick={() => setVisible(false)}
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    aria-label="Đóng"
                >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default AuthErrorAlert; 