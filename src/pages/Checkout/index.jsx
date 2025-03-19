import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../store/slices/cartSlice';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items, totalAmount } = useSelector(state => state.cart);
    const { isAuthenticated, user } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        note: '',
        paymentMethod: 'cod',
        shipMethod: 'standard'
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ tên';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Vui lòng nhập địa chỉ';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'Vui lòng chọn thành phố';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Mô phỏng gọi API thanh toán
            setTimeout(() => {
                // Xóa giỏ hàng sau khi đặt hàng thành công
                dispatch(clearCart());

                // Chuyển hướng đến trang thông báo đặt hàng thành công
                navigate('/order-success');
                setIsLoading(false);
            }, 1500);
        } catch (error) {
            console.error('Checkout error:', error);
            setErrors({ form: 'Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.' });
            setIsLoading(false);
        }
    };

    // Tính phí vận chuyển (có thể thay đổi theo logic thực tế)
    const shippingFee = formData.shipMethod === 'express' ? 50000 : 20000;

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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form thông tin giao hàng */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium mb-4">Thông tin giao hàng</h2>

                        {errors.form && (
                            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {errors.form}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border ${
                                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.fullName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                                        className={`w-full px-3 py-2 border ${
                                            errors.email ? 'border-red-500' : 'border-gray-300'
                                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
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
                                        className={`w-full px-3 py-2 border ${
                                            errors.phone ? 'border-red-500' : 'border-gray-300'
                                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Địa chỉ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border ${
                                        errors.address ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border ${
                                        errors.city ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                >
                                    <option value="">-- Chọn tỉnh/thành phố --</option>
                                    {cities.map((city, index) => (
                                        <option key={index} value={city}>{city}</option>
                                    ))}
                                </select>
                                {errors.city && (
                                    <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ghi chú
                                </label>
                                <textarea
                                    id="note"
                                    name="note"
                                    rows="3"
                                    value={formData.note}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                                ></textarea>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium mb-4">Phương thức thanh toán</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            id="cod"
                                            name="paymentMethod"
                                            type="radio"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                                            Thanh toán khi nhận hàng (COD)
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="bank_transfer"
                                            name="paymentMethod"
                                            type="radio"
                                            value="bank_transfer"
                                            checked={formData.paymentMethod === 'bank_transfer'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <label htmlFor="bank_transfer" className="ml-3 block text-sm font-medium text-gray-700">
                                            Chuyển khoản ngân hàng
                                        </label>
                                    </div>

                                    {formData.paymentMethod === 'bank_transfer' && (
                                        <div className="ml-7 mt-2 p-4 bg-gray-50 rounded border border-gray-200">
                                            <p className="text-sm text-gray-600">
                                                Vui lòng chuyển khoản vào tài khoản sau:
                                            </p>
                                            <p className="mt-2 text-sm">
                                                <span className="font-medium">Ngân hàng:</span> Vietcombank
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Số tài khoản:</span> 1234567890
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Chủ tài khoản:</span> FASHION STORE
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Nội dung:</span> Thanh toan don hang #{new Date().getTime().toString().slice(-6)}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <input
                                            id="momo"
                                            name="paymentMethod"
                                            type="radio"
                                            value="momo"
                                            checked={formData.paymentMethod === 'momo'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <label htmlFor="momo" className="ml-3 block text-sm font-medium text-gray-700">
                                            Thanh toán MoMo
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium mb-4">Phương thức vận chuyển</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                id="standard"
                                                name="shipMethod"
                                                type="radio"
                                                value="standard"
                                                checked={formData.shipMethod === 'standard'}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <label htmlFor="standard" className="ml-3 block text-sm font-medium text-gray-700">
                                                Giao hàng tiêu chuẩn (2-3 ngày)
                                            </label>
                                        </div>
                                        <span className="text-gray-900 font-medium">
                                            20.000 đ
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                id="express"
                                                name="shipMethod"
                                                type="radio"
                                                value="express"
                                                checked={formData.shipMethod === 'express'}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <label htmlFor="express" className="ml-3 block text-sm font-medium text-gray-700">
                                                Giao hàng nhanh (1-2 ngày)
                                            </label>
                                        </div>
                                        <span className="text-gray-900 font-medium">
                                            50.000 đ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Thông tin đơn hàng */}
                <div className="lg:col-span-5">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium mb-4">Đơn hàng của bạn</h2>

                        <div className="border-t border-b py-4 mb-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-2">
                                    <div className="flex items-center">
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            <img
                                                src={item.image || 'https://via.placeholder.com/150'}
                                                alt={item.name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>
                                        <div className="ml-4 flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                            <span className="text-sm text-gray-500">
                                                {item.color && `${item.color}, `}
                                                {item.size && item.size}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {item.quantity} x {item.price.toLocaleString('vi-VN')} đ
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tạm tính</span>
                                <span className="font-medium">{totalAmount.toLocaleString('vi-VN')} đ</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Phí vận chuyển</span>
                                <span className="font-medium">{shippingFee.toLocaleString('vi-VN')} đ</span>
                            </div>

                            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                <span className="text-gray-800 font-medium">Tổng cộng</span>
                                <span className="text-xl font-bold text-red-600">
                                    {(totalAmount + shippingFee).toLocaleString('vi-VN')} đ
                                </span>
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
                                {isLoading ? 'Đang xử lý...' : 'Đặt hàng'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;