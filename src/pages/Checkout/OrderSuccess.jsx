import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { useSelector } from 'react-redux';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const { items } = useSelector(state => state.cart);

    // Nếu người dùng truy cập trực tiếp vào trang này mà không qua luồng đặt hàng, chuyển về trang chủ
    useEffect(() => {
        if (items.length > 0) {
            navigate('/');
        }
    }, [items.length, navigate]);

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />

                <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>

                <p className="text-gray-600 mb-6">
                    Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
                </p>

                <p className="text-gray-600 mb-8">
                    Một email xác nhận đã được gửi đến địa chỉ email của bạn với các chi tiết đơn hàng.
                </p>

                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <Link
                        to="/"
                        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Về trang chủ
                    </Link>

                    <Link
                        to="/orders"
                        className="px-6 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Xem đơn hàng
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;