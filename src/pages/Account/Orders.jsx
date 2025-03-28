import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { fetchMyOrders } from '../../store/slices/orderSlice';
import { ChevronRightIcon, TagIcon, TruckIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/outline';

// Component để hiển thị trạng thái đơn hàng
const OrderStatusBadge = ({ status }) => {
    let bgColor, textColor, icon, text;

    switch (status) {
        case 'pending':
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
            icon = <TagIcon className="h-4 w-4 mr-1" />;
            text = 'Chờ xác nhận';
            break;
        case 'confirmed':
            bgColor = 'bg-indigo-100';
            textColor = 'text-indigo-800';
            icon = <TagIcon className="h-4 w-4 mr-1" />;
            text = 'Đã xác nhận';
            break;
        case 'processed':
            bgColor = 'bg-purple-100';
            textColor = 'text-purple-800';
            icon = <TagIcon className="h-4 w-4 mr-1" />;
            text = 'Đang xử lý';
            break;
        case 'shipped':
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            icon = <TruckIcon className="h-4 w-4 mr-1" />;
            text = 'Đang giao hàng';
            break;
        case 'delivered':
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            icon = <CheckCircleIcon className="h-4 w-4 mr-1" />;
            text = 'Đã giao hàng';
            break;
        case 'cancelled':
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            icon = <XCircleIcon className="h-4 w-4 mr-1" />;
            text = 'Đã hủy';
            break;
        default:
            bgColor = 'bg-gray-100';
            textColor = 'text-gray-800';
            icon = <TagIcon className="h-4 w-4 mr-1" />;
            text = 'Không xác định';
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
            {text}
    </span>
    );
};

// Component chính hiển thị danh sách đơn hàng
const Orders = () => {
    const dispatch = useDispatch();
    const { myOrders, loading, error } = useSelector(state => state.orders);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        dispatch(fetchMyOrders({ page: currentPage, size: 10 }));
    }, [dispatch, currentPage]);

    // Format giá tiền
    const formatPrice = (price) => {
        if (price === undefined || price === null) return '0';
        return price.toLocaleString('vi-VN') + '₫';
    };

    // Format ngày
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, 'HH:mm - dd/MM/yyyy', { locale: vi });
    };

    // Xử lý chuyển trang
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading && myOrders.content.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Đơn hàng của tôi</h2>
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Đơn hàng của tôi</h2>
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    <p>Đã xảy ra lỗi: {error}</p>
                    <button
                        className="mt-2 text-sm underline"
                        onClick={() => dispatch(fetchMyOrders({ page: currentPage, size: 10 }))}
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Đơn hàng của tôi</h2>

            {myOrders.content.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-md">
                    <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
                    <Link
                        to="/products"
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Mua sắm ngay
                    </Link>
                </div>
            ) : (
                <>
                    <div className="border rounded-md divide-y">
                        {myOrders.content.map((order) => (
                            <div key={order.id} className="p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-sm text-gray-500">Đơn hàng #{order.id}</p>
                                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <OrderStatusBadge status={order.orderStatus} />
                                </div>

                                <div className="mb-3">
                                    <div className="flex space-x-2 items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {order.items.length} sản phẩm
                    </span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-sm font-medium text-gray-700">
                      Tổng tiền: {formatPrice(order.finalAmount)}
                    </span>
                                    </div>

                                    <div className="text-sm text-gray-500 line-clamp-1">
                                        {order.items.map(item => item.product.name).join(', ')}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        {order.orderStatus === 'delivered' && (
                                            <span className="text-xs text-green-600">Đã giao hàng vào {formatDate(order.delivery?.deliveredDate)}</span>
                                        )}
                                        {order.orderStatus === 'cancelled' && (
                                            <span className="text-xs text-red-600">Đã hủy {order.cancelReason ? `(${order.cancelReason})` : ''}</span>
                                        )}
                                    </div>
                                    <Link
                                        to={`/account/orders/${order.id}`}
                                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Xem chi tiết
                                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {myOrders.pagination && myOrders.pagination.totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <nav className="flex items-center space-x-2">
                                <button
                                    disabled={currentPage === 0}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === 0
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Trước
                                </button>

                                {[...Array(myOrders.pagination.totalPages).keys()].map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === page
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {page + 1}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === myOrders.pagination.totalPages - 1}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === myOrders.pagination.totalPages - 1
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Tiếp
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Orders;