import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCartAsync, updateCartItemAsync, clearCartAsync, fetchCart } from '../../store/slices/cartSlice';
import { TrashIcon, XIcon } from '@heroicons/react/outline';

// Hàm tiện ích để format giá
const formatPrice = (price) => {
    if (price === undefined || price === null) {
        return '0';
    }
    return price.toLocaleString('vi-VN');
};

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items, totalQuantity, totalAmount, loading } = useSelector(state => state.cart);
    const { isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        // Lấy dữ liệu giỏ hàng từ server khi component được tải
        dispatch(fetchCart());
    }, [dispatch]);

    const handleRemoveItem = (cartItemId) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            dispatch(removeFromCartAsync(cartItemId));
        }
    };

    const handleUpdateQuantity = (cartItemId, newQuantity) => {
        if (newQuantity > 0) {
            dispatch(updateCartItemAsync({ cartItemId, quantity: newQuantity }));
        }
    };

    const handleClearCart = () => {
        if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
            dispatch(clearCartAsync());
        }
    };

    const handleCheckout = () => {
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            if (window.confirm('Bạn cần đăng nhập để thanh toán. Bạn có muốn đăng nhập không?')) {
                navigate('/login', { state: { from: '/cart' } });
            }
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-8">Giỏ hàng</h1>
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <p className="text-xl text-gray-600">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-8">Giỏ hàng</h1>

                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-xl text-gray-600 mb-4">Giỏ hàng của bạn đang trống</p>
                    <Link
                        to="/products"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Giỏ hàng ({totalQuantity || 0} sản phẩm)</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Danh sách sản phẩm */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sản phẩm
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                    Đơn giá
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số lượng
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                    Thành tiền
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">

                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {items && items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-16 w-16">
                                                <img
                                                    className="h-16 w-16 object-cover"
                                                    src={item.image || 'https://via.placeholder.com/150'}
                                                    alt={item.name || 'Sản phẩm'}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    <Link to={`/products/${item.productId}`} className="hover:text-blue-600">
                                                        {item.name || 'Sản phẩm không có tên'}
                                                    </Link>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {item.color && <span>Màu: {item.color}</span>}
                                                    {item.size && <span className="ml-2">Size: {item.size}</span>}
                                                </div>
                                                <div className="md:hidden text-sm font-medium text-gray-900 mt-1">
                                                    {formatPrice(item.price)} đ
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                        <div className="text-sm text-gray-900">{formatPrice(item.price)} đ</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                                                className="px-2 py-1 border rounded-l"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity || 1}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value);
                                                    if (!isNaN(value) && value >= 1) {
                                                        handleUpdateQuantity(item.id, value);
                                                    }
                                                }}
                                                className="w-12 text-center border-t border-b"
                                            />
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                                                className="px-2 py-1 border rounded-r"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                        <div className="text-sm font-medium text-gray-900">
                                            {formatPrice((item.price || 0) * (item.quantity || 1))} đ
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <XIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex justify-between">
                        <Link
                            to="/products"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Tiếp tục mua sắm
                        </Link>

                        <button
                            onClick={handleClearCart}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                            <TrashIcon className="h-5 w-5 mr-2" />
                            Xóa tất cả
                        </button>
                    </div>
                </div>

                {/* Tổng tiền và thanh toán */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium mb-4">Tổng đơn hàng</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Tạm tính</span>
                                <span className="font-medium">{formatPrice(totalAmount)} đ</span>
                            </div>

                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Phí vận chuyển</span>
                                <span className="font-medium">Miễn phí</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-800 font-medium">Tổng cộng</span>
                                <span className="text-xl font-bold text-red-600">{formatPrice(totalAmount)} đ</span>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Tiến hành thanh toán
                                </button>
                            </div>

                            <div className="mt-4">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">hoặc</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <input
                                        type="text"
                                        placeholder="Nhập mã giảm giá"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button className="mt-2 w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                                        Áp dụng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;