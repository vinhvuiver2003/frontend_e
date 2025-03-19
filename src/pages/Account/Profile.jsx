import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../store/slices/authSlice';
import authService from '../../services/authService';

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
    });

    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Lấy thông tin người dùng khi component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Chỉ gọi API khi không có dữ liệu user từ Redux store
                if (!user || !user.email) {
                    const response = await authService.getCurrentUser();
                    if (response && response.data) {
                        // Cập nhật thông tin user vào Redux store
                        dispatch(updateUserProfile(response.data));
                        setFormData({
                            firstName: response.data.firstName || '',
                            lastName: response.data.lastName || '',
                            email: response.data.email || '',
                            phone: response.data.phone || '',
                            address: response.data.address || ''
                        });
                    }
                } else {
                    // Sử dụng dữ liệu từ Redux store
                    setFormData({
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        address: user.address || ''
                    });
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        };

        fetchUserProfile();
    }, [user, dispatch]);

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

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Vui lòng nhập tên';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Vui lòng nhập họ';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Gọi API để cập nhật thông tin người dùng
            // Ví dụ:
            // await authService.updateProfile(formData);

            // Update in Redux store
            dispatch(updateUserProfile(formData));

            setIsEditing(false);
            setSubmitSuccess(true);

            // Ẩn thông báo thành công sau 3 giây
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);
        } catch (error) {
            setErrors({ form: 'Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>

                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Chỉnh sửa
                    </button>
                )}
            </div>

            {submitSuccess && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    Thông tin đã được cập nhật thành công!
                </div>
            )}

            {errors.form && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {errors.form}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Form fields remain the same */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            Tên
                        </label>
                        {isEditing ? (
                            <div>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    disabled={!isEditing || isLoading}
                                    className={`w-full px-3 py-2 border ${
                                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                        !isEditing ? 'bg-gray-100' : ''
                                    }`}
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-900">{formData.firstName}</p>
                        )}
                    </div>

                    {/* Other form fields... */}
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Họ
                        </label>
                        {isEditing ? (
                            <div>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    disabled={!isEditing || isLoading}
                                    className={`w-full px-3 py-2 border ${
                                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                        !isEditing ? 'bg-gray-100' : ''
                                    }`}
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-900">{formData.lastName}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        {isEditing ? (
                            <div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing || isLoading}
                                    className={`w-full px-3 py-2 border ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                        !isEditing ? 'bg-gray-100' : ''
                                    }`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-900">{formData.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại
                        </label>
                        {isEditing ? (
                            <div>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing || isLoading}
                                    className={`w-full px-3 py-2 border ${
                                        errors.phone ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                        !isEditing ? 'bg-gray-100' : ''
                                    }`}
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-900">{formData.phone || '(Chưa cập nhật)'}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ
                        </label>
                        {isEditing ? (
                            <div>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    disabled={!isEditing || isLoading}
                                    className={`w-full px-3 py-2 border ${
                                        errors.address ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                        !isEditing ? 'bg-gray-100' : ''
                                    }`}
                                />
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-900">{formData.address || '(Chưa cập nhật)'}</p>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div className="flex items-center justify-end space-x-4 mt-4">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            disabled={isLoading}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                                isLoading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Profile;