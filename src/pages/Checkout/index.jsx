import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCartAsync } from '../../store/slices/cartSlice';
import { checkoutOrder } from '../../store/slices/orderSlice';
import { toast } from 'react-toastify';

// Hàm tiện ích để format giá
const formatPrice = (price) => {
    if (price === undefined || price === null) {
        return '0';
    }
    return price.toLocaleString('vi-VN');
};

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items, totalAmount, cartId, promotion, discountAmount } = useSelector(state => state.cart);
    const { isAuthenticated, user } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        notes: '',
        paymentMethod: 'vnpay',
        shippingMethod: 'standard',
        saveInfo: true,
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Điều hướng người dùng về trang đăng nhập nếu chưa đăng nhập
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/checkout' } });
        }
    }, [isAuthenticated, navigate]);

    // Điều hướng người dùng về trang giỏ hàng nếu giỏ hàng trống
    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
        }
    }, [items.length, navigate]);

    // Điền thông tin người dùng nếu đã đăng nhập
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.firstName + ' ' + user.lastName,
                email: user.email,
                phone: user.phone || '',
                address: user.address || '',
            }));
        }
    }, [user]);

    // Xác thực form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Họ tên là bắt buộc';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s+/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Địa chỉ là bắt buộc';
        }

        if (!formData.city) {
            newErrors.city = 'Thành phố là bắt buộc';
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        // Xóa lỗi khi người dùng sửa trường đó
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: undefined
            });
        }
    };

    const handleCityChange = (e) => {
        setFormData({
            ...formData,
            city: e.target.value
        });

        if (errors.city) {
            setErrors({
                ...errors,
                city: undefined
            });
        }
    };

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        // Format to groups of 4 digits
        if (value.length > 0) {
            value = value.match(/.{1,4}/g).join(' ');
        }
        
        // Limit to 16 digits (plus spaces)
        value = value.substring(0, 19);
        
        setFormData({
            ...formData,
            cardNumber: value
        });
    };

    const handleCardExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        setFormData({
            ...formData,
            cardExpiry: value
        });
    };

    const handleCardCvcChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
        setFormData({
            ...formData,
            cardCvc: value
        });
    };

    // Mở rộng hàm handlePayment để xử lý các phương thức thanh toán khác
    const handlePayment = async () => {
        setIsLoading(true);
        
        try {
            // Chuẩn bị dữ liệu đặt hàng
            const checkoutData = {
                cartId: cartId,
                userId: user?.id,
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                shippingAddress: `${formData.address}, ${formData.city}`,
                note: formData.notes,
                paymentMethod: formData.paymentMethod,
                shippingMethod: formData.shippingMethod,
            };
            
            // Thêm promotionCode vào dữ liệu nếu có
            if (promotion) {
                checkoutData.promotionCode = promotion.code;
            }
            
            // Xử lý thanh toán dựa trên phương thức đã chọn
            if (formData.paymentMethod === 'card') {
                // Thêm thông tin thẻ
                checkoutData.cardInfo = {
                    cardNumber: formData.cardNumber.replace(/\s+/g, ''),
                    cardName: formData.cardName,
                    cardExpiry: formData.cardExpiry,
                    cardCvc: formData.cardCvc
                };
            } else if (formData.paymentMethod === 'momo') {
                // Thêm thông tin MoMo
                checkoutData.momoPhone = formData.momoPhone;
            } else if (formData.paymentMethod === 'bank') {
                // Thông tin chuyển khoản có thể được xử lý ở backend
            }
            
            // Gọi API đặt hàng
            const result = await dispatch(checkoutOrder(checkoutData)).unwrap();
            
            // Hiển thị thông báo đặt hàng thành công bằng toast
            toast.success('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');
            
            // Lưu thông tin người dùng nếu được chọn
            if (formData.saveInfo) {
                // Lưu thông tin người dùng vào localStorage hoặc gửi lên API
                const userInfoToSave = {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city
                };
                
                localStorage.setItem('userShippingInfo', JSON.stringify(userInfoToSave));
            }
            
            // Xóa giỏ hàng sau khi đặt hàng thành công
            dispatch(clearCartAsync());
            
            // Chuyển hướng đến trang thành công
            navigate('/checkout/success', {
                state: {
                    orderInfo: {
                        orderId: result.id,
                        items: items,
                        subtotal: totalAmount,
                        discount: discountAmount,
                        shipping: formData.shippingMethod === 'express' ? 50000 : 20000,
                        total: totalAmount - discountAmount + (formData.shippingMethod === 'express' ? 50000 : 20000),
                        paymentMethod: formData.paymentMethod,
                        shippingMethod: formData.shippingMethod
                    }
                }
            });
        } catch (error) {
            console.error('Lỗi khi xử lý thanh toán:', error);
            toast.error('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.');
            setErrors({ form: 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm xử lý hủy đặt hàng
    const handleCancel = () => {
        toast.info('Đã hủy đặt hàng, quay về giỏ hàng');
        navigate('/cart');
    };

    // Cập nhật hàm handleSubmit để sử dụng hàm mới
    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        
        const validationErrors = validateForm();
        
        if (Object.keys(validationErrors).length === 0) {
            handlePayment();
        } else {
            setErrors(validationErrors);
            
            // Cuộn đến lỗi đầu tiên
            const firstError = document.querySelector('.text-red-500');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    // Tính phí vận chuyển (có thể thay đổi theo logic thực tế)
    const shippingFee = formData.shippingMethod === 'express' ? 50000 : 20000;

    const cities = [
        'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
        'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
        'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
        'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
        'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
        'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
        'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
        'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
        'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
        'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
        'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
        'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang',
        'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Thanh toán</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-medium mb-4">Thông tin người nhận</h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Họ tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                            errors.fullName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.fullName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                            errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                            errors.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                        Thành phố/Tỉnh <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleCityChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                            errors.city ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Chọn thành phố/tỉnh</option>
                                        {cities.map((city, index) => (
                                            <option key={index} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.city && (
                                        <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Địa chỉ chi tiết <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                        errors.address ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                                )}
                            </div>
                            
                            <div className="mt-4">
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ghi chú
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Ghi chú đặc biệt cho đơn hàng này"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                ></textarea>
                            </div>
                            
                            <div className="mt-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="saveInfo"
                                        checked={formData.saveInfo}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Lưu thông tin này cho lần sau
                                    </span>
                                </label>
                            </div>
                        </form>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-medium mb-4">Phương thức vận chuyển</h2>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    id="standard"
                                    name="shippingMethod"
                                    type="radio"
                                    value="standard"
                                    checked={formData.shippingMethod === 'standard'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="standard" className="ml-3 block">
                                    <span className="block text-sm font-medium text-gray-700">Giao hàng tiêu chuẩn (2-3 ngày)</span>
                                    <span className="block text-sm text-gray-500">20.000 đ</span>
                                </label>
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    id="express"
                                    name="shippingMethod"
                                    type="radio"
                                    value="express"
                                    checked={formData.shippingMethod === 'express'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="express" className="ml-3 block">
                                    <span className="block text-sm font-medium text-gray-700">Giao hàng nhanh (1-2 ngày)</span>
                                    <span className="block text-sm text-gray-500">50.000 đ</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium mb-4">Phương thức thanh toán</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    id="vnpay"
                                    name="paymentMethod"
                                    type="radio"
                                    value="vnpay"
                                    checked={true}
                                    readOnly
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="vnpay" className="ml-3 block text-sm font-medium text-gray-700">
                                    Thanh toán qua VNPAY QR
                                </label>
                            </div>
                            
                            <div className="pl-7 mt-2 p-3 bg-gray-50 rounded-md">
                                <p className="text-sm font-medium text-gray-700">Thông tin thanh toán:</p>
                                <p className="text-sm text-gray-600">Bạn sẽ được chuyển đến cổng thanh toán VNPAY để quét mã QR thanh toán.</p>
                                <p className="text-sm text-gray-600">Sau khi thanh toán thành công, đơn hàng sẽ được xử lý ngay lập tức.</p>
                                <div className="mt-2 flex justify-center">
                                    <img src="/images/vnpay-logo.png" alt="VNPAY" className="h-10" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                        <h2 className="text-lg font-medium mb-4">Tóm tắt đơn hàng</h2>
                        
                        <div className="border-t border-b py-4 mb-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-2">
                                    <div className="flex items-center">
                                        <div className="ml-0 flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">{item.productName || item.name || 'Sản phẩm không có tên'}</span>
                                            <span className="text-sm text-gray-500">
                                                {item.color && `${item.color}, `}
                                                {item.size && item.size}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {item.quantity || 1} x {formatPrice(item.unitPrice || item.price || 0)} đ
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatPrice((item.total || (item.unitPrice || item.price || 0) * (item.quantity || 1)))} đ
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tạm tính</span>
                                <span className="font-medium">{formatPrice(totalAmount)} đ</span>
                            </div>
                            
                            {promotion && (
                                <div className="flex justify-between text-green-600">
                                    <span>Giảm giá ({promotion.name})</span>
                                    <span>- {formatPrice(discountAmount)} đ</span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span className="text-gray-600">Phí vận chuyển</span>
                                <span className="font-medium">{formatPrice(shippingFee)} đ</span>
                            </div>

                            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                <span className="text-gray-800 font-medium">Tổng cộng</span>
                                <span className="text-xl font-bold text-red-600">
                                    {formatPrice(totalAmount - discountAmount + shippingFee)} đ
                                </span>
                            </div>
                            
                            <div className="flex justify-between pt-2">
                                <span className="text-gray-600">Phương thức thanh toán</span>
                                <span className="font-medium text-blue-600">VNPAY QR</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={isLoading}
                                onClick={handleSubmit}
                                className={`w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? 'Đang xử lý...' : 'Thanh toán qua VNPAY'}
                            </button>
                            
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isLoading}
                                className="w-full mt-3 py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Hủy và quay về giỏ hàng
                            </button>
                        </div>
                        
                        {errors.form && (
                            <div className="mt-4">
                                <div className="bg-red-50 p-3 rounded-md border border-red-200">
                                    <p className="text-red-600 text-sm">{errors.form}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;