import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, changePassword } from '../../store/slices/userSlice';

const UserProfile = () => {
    const dispatch = useDispatch();
    const { currentUser, loading, error } = useSelector(state => state.users);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [formData, setFormData] = useState({
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        address: currentUser?.address || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateUser({ 
                id: currentUser.id, 
                userData: formData 
            })).unwrap();
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Mật khẩu mới không khớp!');
            return;
        }
        try {
            await dispatch(changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword
            })).unwrap();
            setShowPasswordForm(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            alert('Đổi mật khẩu thành công!');
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    if (!currentUser) {
        return (
            <div className="text-center py-8">
                Vui lòng đăng nhập để xem thông tin cá nhân.
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-8">Thông tin cá nhân</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Họ
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Họ và tên</p>
                                    <p className="font-medium">{currentUser.firstName} {currentUser.lastName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{currentUser.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                    <p className="font-medium">{currentUser.phone || 'Chưa cập nhật'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Địa chỉ</p>
                                    <p className="font-medium">{currentUser.address || 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Chỉnh sửa thông tin
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Đổi mật khẩu</h2>
                    {showPasswordForm ? (
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mật khẩu hiện tại
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full p-2 border rounded"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Xác nhận mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordForm(false)}
                                    className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Đang lưu...' : 'Đổi mật khẩu'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                        >
                            Đổi mật khẩu
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile; 