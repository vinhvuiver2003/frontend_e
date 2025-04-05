import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, deleteUser } from '../../store/slices/userSlice';
import { Link } from 'react-router-dom';
import { 
    PencilAltIcon, 
    TrashIcon,
    SearchIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    UserAddIcon,
    FilterIcon,
    ExclamationIcon
} from '@heroicons/react/outline';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                        <ExclamationIcon className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-gray-500">{message}</p>
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-1/3 shadow-sm hover:bg-red-600 mr-2"
                        >
                            Xác nhận
                        </button>
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-1/3 shadow-sm hover:bg-gray-600"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserManagement = () => {
    const dispatch = useDispatch();
    const { users = [], loading, error, pagination } = useSelector(state => state.users);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [sortBy, setSortBy] = useState('id');
    const [sortDir, setSortDir] = useState('asc');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [showFilters, setShowFilters] = useState(false);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    useEffect(() => {
        dispatch(fetchAllUsers({ 
            page: currentPage, 
            sortBy, 
            sortDir,
            search: searchTerm,
            role: roleFilter !== 'ALL' ? roleFilter : ''
        }));
    }, [dispatch, currentPage, sortBy, sortDir, searchTerm, roleFilter]);

    const handleDelete = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.',
            onConfirm: async () => {
                try {
                    await dispatch(deleteUser(id)).unwrap();
                    dispatch(fetchAllUsers({ 
                        page: currentPage, 
                        sortBy, 
                        sortDir,
                        search: searchTerm,
                        role: roleFilter !== 'ALL' ? roleFilter : ''
                    }));
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
                setConfirmModal({ isOpen: false });
            }
        });
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDir('asc');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0);
    };

    const handleRoleFilterChange = (e) => {
        setRoleFilter(e.target.value);
        setCurrentPage(0);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                Lỗi: {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
                <Link
                    to="/admin/users/add"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                >
                    <UserAddIcon className="h-5 w-5 mr-2" />
                    Thêm người dùng
                </Link>
            </div>

            {/* Search and filter bar */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <div className="flex flex-col md:flex-row gap-4">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm theo tên, email..."
                            className="flex-1 p-2 border rounded"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            <SearchIcon className="h-5 w-5" />
                        </button>
                    </form>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 flex items-center"
                        >
                            <FilterIcon className="h-5 w-5 mr-2" />
                            Bộ lọc
                        </button>
                        
                        {showFilters && (
                            <select
                                value={roleFilter}
                                onChange={handleRoleFilterChange}
                                className="p-2 border rounded"
                            >
                                <option value="ALL">Tất cả vai trò</option>
                                <option value="ADMIN">Admin</option>
                                <option value="USER">Người dùng</option>
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {/* Users table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('id')}
                                >
                                    ID {sortBy === 'id' && (sortDir === 'asc' ? '↑' : '↓')}
                                </th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('username')}
                                >
                                    Tên đăng nhập {sortBy === 'username' && (sortDir === 'asc' ? '↑' : '↓')}
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Họ và tên
                                </th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('email')}
                                >
                                    Email {sortBy === 'email' && (sortDir === 'asc' ? '↑' : '↓')}
                                </th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('role')}
                                >
                                    Vai trò {sortBy === 'role' && (sortDir === 'asc' ? '↑' : '↓')}
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đăng nhập cuối
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {!users || users.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        Không tìm thấy người dùng nào
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {`${user.firstName} ${user.lastName}`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.role === 'ADMIN' 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.lastLogin ? format(new Date(user.lastLogin), 'dd/MM/yyyy HH:mm', { locale: vi }) : 'Chưa đăng nhập'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center space-x-3">
                                                <Link
                                                    to={`/admin/users/${user.id}/edit`}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    title="Chỉnh sửa"
                                                >
                                                    <PencilAltIcon className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Xóa người dùng"
                                                    disabled={user.role === 'ADMIN'}
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-700">
                        Hiển thị {users.length} trên tổng số {pagination.totalElements} người dùng
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 0}
                            className={`p-2 rounded ${
                                currentPage === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={pagination.last}
                            className={`p-2 rounded ${
                                pagination.last
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal({ isOpen: false })}
            />
        </div>
    );
};

export default UserManagement; 