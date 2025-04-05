import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById, updateUser } from '../../store/slices/userSlice';
import userService from '../../services/userService';
import { ArrowLeftIcon } from '@heroicons/react/outline';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedUser, loading, error } = useSelector(state => state.users);
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        role: 'USER',
        password: '', // Chỉ sử dụng khi thêm mới
        confirmPassword: '' // Chỉ sử dụng khi thêm mới
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            dispatch(fetchUserById(id));
        }
    }, [dispatch, id, isEditMode]);

    useEffect(() => {
        if (isEditMode && selectedUser) {
            setFormData({
                username: selectedUser.username || '',
                email: selectedUser.email || '',
                firstName: selectedUser.firstName || '',
                lastName: selectedUser.lastName || '',
                phone: selectedUser.phone || '',
                address: selectedUser.address || '',
                role: selectedUser.role || 'USER',
                password: '',
                confirmPassword: ''
            });
        }
    }, [selectedUser, isEditMode]);

    const validateForm = () => {
        const errors = {};
        
        if (!formData.username) {
            errors.username = 'Tên đăng nhập là bắt buộc';
        }
        
        if (!formData.email) {
            errors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email không hợp lệ';
        }
        
        if (!isEditMode) {
            if (!formData.password) {
                errors.password = 'Mật khẩu là bắt buộc';
            } else if (formData.password.length < 6) {
                errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            }
            
            if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            }
        }
        
        if (!formData.firstName) {
            errors.firstName = 'Họ là bắt buộc';
        }
        
        if (!formData.lastName) {
            errors.lastName = 'Tên là bắt buộc';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!validateForm()) {
            return;
        }

        try {
            if (isEditMode) {
                // Cập nhật người dùng
                const { password, confirmPassword, ...updateData } = formData;
                await dispatch(updateUser({ id, userData: updateData })).unwrap();
                navigate('/admin/users');
            } else {
                // Thêm mới người dùng
                const response = await userService.createUser(formData);
                if (response.data.success) {
                    navigate('/admin/users');
                } else {
                    setSubmitError(response.data.message || 'Có lỗi xảy ra khi tạo người dùng');
                }
            }
        } catch (error) {
            setSubmitError(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Xóa lỗi khi người dùng bắt đầu nhập
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                    <h1 className="text-2xl font-bold">
                        {isEditMode ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
                    </h1>
                </div>

                {(error || submitError) && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error || submitError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Tên đăng nhập
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={isEditMode}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                    formErrors.username ? 'border-red-500' : ''
                                } ${isEditMode ? 'bg-gray-100' : ''}`}
                            />
                            {formErrors.username && (
                                <p className="text-red-500 text-xs italic">{formErrors.username}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                    formErrors.email ? 'border-red-500' : ''
                                }`}
                            />
                            {formErrors.email && (
                                <p className="text-red-500 text-xs italic">{formErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                                Họ
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                    formErrors.firstName ? 'border-red-500' : ''
                                }`}
                            />
                            {formErrors.firstName && (
                                <p className="text-red-500 text-xs italic">{formErrors.firstName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                                Tên
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                    formErrors.lastName ? 'border-red-500' : ''
                                }`}
                            />
                            {formErrors.lastName && (
                                <p className="text-red-500 text-xs italic">{formErrors.lastName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                                Vai trò
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="USER">Người dùng</option>
                                <option value="ADMIN">Quản trị viên</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                                Địa chỉ
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        {!isEditMode && (
                            <>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                        Mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                            formErrors.password ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {formErrors.password && (
                                        <p className="text-red-500 text-xs italic">{formErrors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                        Xác nhận mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                            formErrors.confirmPassword ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {formErrors.confirmPassword && (
                                        <p className="text-red-500 text-xs italic">{formErrors.confirmPassword}</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center justify-end mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/users')}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {isEditMode ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm; 