import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const VerifyAccount = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const token = searchParams.get('token');

                if (!token) {
                    setError('Không tìm thấy token xác thực trong URL');
                    setLoading(false);
                    return;
                }

                // Gọi API để xác thực tài khoản
                const response = await axios.get(`${API_URL}/auth/verify?token=${token}`);
                
                if (response.data && response.data.success) {
                    setSuccess(true);
                } else {
                    setError(response.data?.message || 'Xác thực không thành công');
                }
            } catch (error) {
                setError(error.response?.data?.message || 'Đã xảy ra lỗi khi xác thực tài khoản');
            } finally {
                setLoading(false);
            }
        };

        verifyAccount();
    }, [location.search]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Xác thực tài khoản
                    </h2>
                </div>

                {loading ? (
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-gray-600">Đang xác thực tài khoản...</p>
                    </div>
                ) : success ? (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">
                                    Tài khoản của bạn đã được xác thực thành công!
                                </p>
                                <div className="mt-4">
                                    <Link to="/login" className="text-sm font-medium text-green-700 hover:text-green-600">
                                        Đăng nhập ngay
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    {error || 'Xác thực tài khoản thất bại.'}
                                </p>
                                <div className="mt-4">
                                    <Link to="/login" className="text-sm font-medium text-red-700 hover:text-red-600">
                                        Quay lại đăng nhập
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyAccount; 