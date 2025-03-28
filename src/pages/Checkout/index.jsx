import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCartAsync } from '../../store/slices/cartSlice';

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

    const { items, totalAmount } = useSelector(state => state.cart);
    const { isAuthenticated, user } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        notes: '',
        paymentMethod: 'cod',
        shippingMethod: 'standard',
        saveInfo: true,
        cardNumber: '',
        cardName: '',
        cardExpiry: '',
        cardCvc: '',
        momoPhone: ''
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
        const errors = {};

        if (!formData.fullName.trim()) {
            errors.fullName = 'Vui lòng nhập họ tên';
        }

        if (!formData.email.trim()) {
            errors.email = 'Vui lòng nhập email';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            errors.email = 'Email không hợp lệ';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
            errors.phone = 'Số điện thoại không hợp lệ';
        }

        if (!formData.address.trim()) {
            errors.address = 'Vui lòng nhập địa chỉ';
        }

        if (!formData.city.trim()) {
            errors.city = 'Vui lòng chọn thành phố';
        }

        // Kiểm tra thông tin thẻ nếu chọn thanh toán qua thẻ
        if (formData.paymentMethod === 'card') {
            if (!formData.cardNumber.trim() || !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
                errors.cardNumber = 'Vui lòng nhập số thẻ hợp lệ (16 chữ số)';
            }

            if (!formData.cardName.trim()) {
                errors.cardName = 'Vui lòng nhập tên chủ thẻ';
            }

            if (!formData.cardExpiry.trim() || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) {
                errors.cardExpiry = 'Định dạng MM/YY không hợp lệ';
            }

            if (!formData.cardCvc.trim() || !/^\d{3,4}$/.test(formData.cardCvc)) {
                errors.cardCvc = 'Mã CVC không hợp lệ';
            }
        }

        // Kiểm tra số điện thoại MoMo nếu chọn thanh toán qua MoMo
        if (formData.paymentMethod === 'momo' && (!formData.momoPhone.trim() || !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.momoPhone))) {
            errors.momoPhone = 'Vui lòng nhập số điện thoại MoMo hợp lệ';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Hàm xử lý khi người dùng thay đổi thông tin thẻ
    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        // Format số thẻ thành nhóm 4 chữ số
        if (value) {
            value = value.match(/.{1,4}/g).join(' ');
        }
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
            // Xử lý thanh toán dựa trên phương thức đã chọn
            if (formData.paymentMethod === 'card') {
                // Giả lập xử lý thanh toán thẻ
                console.log('Xử lý thanh toán thẻ với thông tin:', {
                    cardNumber: formData.cardNumber,
                    cardName: formData.cardName,
                    cardExpiry: formData.cardExpiry,
                    cardCvc: formData.cardCvc
                });
                
                await new Promise(resolve => setTimeout(resolve, 1500));
            } else if (formData.paymentMethod === 'momo') {
                // Giả lập xử lý thanh toán MoMo
                console.log('Xử lý thanh toán MoMo với số điện thoại:', formData.momoPhone);
                
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else if (formData.paymentMethod === 'bank') {
                // Giả lập xử lý thanh toán chuyển khoản
                console.log('Xác nhận đặt hàng với thanh toán chuyển khoản');
                
                await new Promise(resolve => setTimeout(resolve, 800));
            } else {
                // Xử lý COD (mặc định)
                console.log('Xác nhận đặt hàng với thanh toán COD');
                
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
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
            
            // Xử lý đặt hàng
            dispatch(clearCartAsync());
            
            // Chuyển hướng đến trang thành công
            navigate('/checkout/success', {
                state: {
                    orderInfo: {
                        items: items,
                        subtotal: totalAmount,
                        shipping: 20000,
                        total: totalAmount + 20000,
                        paymentMethod: formData.paymentMethod,
                        shippingMethod: formData.shippingMethod
                    }
                }
            });
        } catch (error) {
            console.error('Lỗi khi xử lý thanh toán:', error);
            setErrors({ form: 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.' });
        } finally {
            setIsLoading(false);
        }
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
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ghi chú
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows="3"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ghi chú đặc biệt về đơn hàng của bạn (tùy chọn)"
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
                                            id="card"
                                            name="paymentMethod"
                                            type="radio"
                                            value="card"
                                            checked={formData.paymentMethod === 'card'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                                            Thanh toán bằng thẻ tín dụng/ghi nợ
                                        </label>
                                    </div>

                                    {formData.paymentMethod === 'card' && (
                                        <div className="ml-7 mt-3 p-4 bg-gray-50 rounded-md space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Số thẻ <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    value={formData.cardNumber}
                                                    onChange={handleCardNumberChange}
                                                    placeholder="1234 5678 9012 3456"
                                                    className={`w-full px-3 py-2 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                                />
                                                {errors.cardNumber && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Tên chủ thẻ <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cardName"
                                                    value={formData.cardName}
                                                    onChange={handleChange}
                                                    placeholder="NGUYEN VAN A"
                                                    className={`w-full px-3 py-2 border ${errors.cardName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                                />
                                                {errors.cardName && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.cardName}</p>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Ngày hết hạn <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="cardExpiry"
                                                        value={formData.cardExpiry}
                                                        onChange={handleCardExpiryChange}
                                                        placeholder="MM/YY"
                                                        className={`w-full px-3 py-2 border ${errors.cardExpiry ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                                    />
                                                    {errors.cardExpiry && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.cardExpiry}</p>
                                                    )}
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Mã CVC <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="cardCvc"
                                                        value={formData.cardCvc}
                                                        onChange={handleCardCvcChange}
                                                        placeholder="123"
                                                        className={`w-full px-3 py-2 border ${errors.cardCvc ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                                    />
                                                    {errors.cardCvc && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.cardCvc}</p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-center space-x-2 mt-2">
                                                <img src="/images/visa.svg" alt="Visa" className="h-8" />
                                                <img src="/images/mastercard.svg" alt="Mastercard" className="h-8" />
                                                <img src="/images/jcb.svg" alt="JCB" className="h-8" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <input
                                            id="bank"
                                            name="paymentMethod"
                                            type="radio"
                                            value="bank"
                                            checked={formData.paymentMethod === 'bank'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <label htmlFor="bank" className="ml-3 block text-sm font-medium text-gray-700">
                                            Chuyển khoản ngân hàng
                                        </label>
                                    </div>

                                    {formData.paymentMethod === 'bank' && (
                                        <div className="ml-7 mt-3 p-4 bg-gray-50 rounded-md">
                                            <p className="text-sm text-gray-700 mb-2">Thông tin tài khoản:</p>
                                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                <li>Ngân hàng: <span className="font-medium">Vietcombank</span></li>
                                                <li>Số tài khoản: <span className="font-medium">1234567890</span></li>
                                                <li>Chủ tài khoản: <span className="font-medium">CÔNG TY ABC</span></li>
                                                <li>Nội dung: <span className="font-medium">Thanh toán đơn hàng - {user?.email}</span></li>
                                            </ul>
                                            <p className="text-sm text-gray-700 mt-2">
                                                Sau khi chuyển khoản, đơn hàng của bạn sẽ được xử lý trong vòng 24 giờ.
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
                                            Thanh toán qua ví MoMo
                                        </label>
                                    </div>

                                    {formData.paymentMethod === 'momo' && (
                                        <div className="ml-7 mt-3 p-4 bg-gray-50 rounded-md">
                                            <div className="mb-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Số điện thoại MoMo <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="momoPhone"
                                                    value={formData.momoPhone}
                                                    onChange={handleChange}
                                                    placeholder="0912345678"
                                                    className={`w-full px-3 py-2 border ${errors.momoPhone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                                />
                                                {errors.momoPhone && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.momoPhone}</p>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-700">
                                                Sau khi đặt hàng, bạn sẽ nhận được hướng dẫn thanh toán qua MoMo.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium mb-4">Phương thức vận chuyển</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
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
                                            <label htmlFor="standard" className="ml-3 block text-sm font-medium text-gray-700">
                                                Giao hàng tiêu chuẩn (3-5 ngày)
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
                                                name="shippingMethod"
                                                type="radio"
                                                value="express"
                                                checked={formData.shippingMethod === 'express'}
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
                                            <span className="text-sm font-medium text-gray-900">{item.name || 'Sản phẩm không có tên'}</span>
                                            <span className="text-sm text-gray-500">
                                                {item.color && `${item.color}, `}
                                                {item.size && item.size}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {item.quantity || 1} x {formatPrice(item.price)} đ
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatPrice((item.price || 0) * (item.quantity || 1))} đ
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tạm tính</span>
                                <span className="font-medium">{formatPrice(totalAmount)} đ</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Phí vận chuyển</span>
                                <span className="font-medium">{formatPrice(shippingFee)} đ</span>
                            </div>

                            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                <span className="text-gray-800 font-medium">Tổng cộng</span>
                                <span className="text-xl font-bold text-red-600">
                                    {formatPrice(totalAmount + shippingFee)} đ
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