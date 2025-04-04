import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { MdOutlineLocalShipping, MdPayment } from 'react-icons/md';
import { BsExclamationCircle } from 'react-icons/bs';
import { toast } from 'react-toastify';

const formatPrice = (price) => {
    if (price === undefined || price === null) {
        return '0';
    }
    return price.toLocaleString('vi-VN');
};

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderInfo = location.state?.orderInfo;

    useEffect(() => {
        // Nếu không có thông tin đơn hàng, điều hướng về trang chủ
        if (!orderInfo) {
            navigate('/');
        } else {
            // Hiển thị thông báo thành công
            toast.success('Đơn hàng đã được đặt thành công!');
        }
    }, [orderInfo, navigate]);

    if (!orderInfo) {
        return <div className="text-center p-10">Đang chuyển hướng...</div>;
    }

    const getPaymentMethodText = (method) => {
        switch(method) {
            case 'cod':
                return 'Thanh toán khi nhận hàng (COD)';
            case 'bank':
                return 'Chuyển khoản ngân hàng';
            case 'sepay':
                return 'Thanh toán qua SEPAY';
            default:
                return 'Thanh toán qua SEPAY';
        }
    };

    const getShippingMethodText = (method) => {
        switch (method) {
            case 'standard':
                return 'Giao hàng tiêu chuẩn (2-3 ngày)';
            case 'express':
                return 'Giao hàng nhanh (1-2 ngày)';
            default:
                return 'Phương thức vận chuyển không xác định';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <IoMdCheckmarkCircleOutline className="text-green-500 text-6xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-green-600 mb-2">Đặt hàng thành công!</h1>
                    <p className="text-gray-600">
                        Đơn hàng của bạn đã được tiếp nhận và đang được xử lý. Mã đơn hàng: <span className="font-semibold">{orderInfo.orderId}</span>
                    </p>
                </div>

                <div className="border-t border-gray-200 pt-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-50 p-4 rounded-md">
                            <div className="flex items-center mb-3">
                                <MdOutlineLocalShipping className="text-blue-500 text-xl mr-2" />
                                <h3 className="font-medium">Phương thức vận chuyển</h3>
                            </div>
                            <p className="text-gray-700">{getShippingMethodText(orderInfo.shippingMethod)}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-md">
                            <div className="flex items-center mb-3">
                                <MdPayment className="text-blue-500 text-xl mr-2" />
                                <h3 className="font-medium">Phương thức thanh toán</h3>
                            </div>
                            <p className="text-gray-700">{getPaymentMethodText(orderInfo.paymentMethod)}</p>
                            
                            {orderInfo.paymentMethod === 'sepay' && (
                                <div className="mb-4">
                                    <h3 className="text-lg font-medium mb-2">Thông tin thanh toán</h3>
                                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                                        <p className="text-sm text-gray-600">Phương thức: SEPAY</p>
                                        <div className="flex items-center">
                                            <img src="/images/sepay-logo.png" alt="SEPAY" className="h-8" onError={(e) => e.target.style.display = 'none'} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mb-4">
                        <h3 className="font-medium mb-3">Sản phẩm đã đặt</h3>
                        
                        <div className="mb-4">
                            {orderInfo.items.map((item) => (
                                <div key={item.id} className="flex justify-between py-2 border-b border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">{item.productName || item.name || 'Sản phẩm không có tên'}</span>
                                        <span className="text-xs text-gray-500">
                                            {item.color && `${item.color}, `}
                                            {item.size && item.size}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {item.quantity || 1} x {formatPrice(item.unitPrice || item.price || 0)} đ
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatPrice((item.total || (item.unitPrice || item.price || 0) * (item.quantity || 1)))} đ
                                    </span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="space-y-1 pt-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tạm tính</span>
                                <span>{formatPrice(orderInfo.subtotal)} đ</span>
                            </div>
                            
                            {orderInfo.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Giảm giá</span>
                                    <span>- {formatPrice(orderInfo.discount)} đ</span>
                                </div>
                            )}
                            
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Phí vận chuyển</span>
                                <span>{formatPrice(orderInfo.shipping)} đ</span>
                            </div>
                            
                            <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                                <span className="font-semibold">Tổng cộng</span>
                                <span className="font-bold text-red-600">{formatPrice(orderInfo.total)} đ</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <BsExclamationCircle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Bạn sẽ nhận được email xác nhận đơn hàng với đầy đủ thông tin chi tiết.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Tiếp tục mua sắm
                    </button>
                    
                    <button
                        onClick={() => navigate('/account/orders')}
                        className="bg-white text-blue-600 border border-blue-600 py-2 px-6 rounded-md hover:bg-blue-50 transition-colors"
                    >
                        Xem đơn hàng của tôi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess; 