import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  PencilAltIcon,
  TrashIcon,
  SearchIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  ExclamationIcon
} from '@heroicons/react/outline';
import promotionService from '../../services/promotionService';

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

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    fetchPromotions();
  }, [currentPage, sortBy, sortDir, searchTerm]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await promotionService.getAllPromotions({
        page: currentPage,
        size: 10,
        sortBy,
        sortDir,
        search: searchTerm
      });

      const data = response.data || response;
      setPromotions(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setLoading(false);
    } catch (err) {
      setError('Không thể tải danh sách khuyến mãi: ' + err.message);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchPromotions();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa chương trình khuyến mãi này?',
      onConfirm: async () => {
        try {
          await promotionService.deletePromotion(id);
          fetchPromotions();
          setConfirmModal({ isOpen: false });
        } catch (error) {
          console.error('Lỗi khi xóa khuyến mãi:', error);
          setError('Không thể xóa khuyến mãi: ' + error.message);
          setConfirmModal({ isOpen: false });
        }
      }
    });
  };

  const getPromotionStatus = (promotion) => {
    if (promotion.status) {
      return promotion.status;
    }
    
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (now < startDate) {
      return 'upcoming';
    } else if (now > endDate) {
      return 'expired';
    } else {
      return 'active';
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Đang áp dụng
          </span>
        );
      case 'upcoming':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            Sắp diễn ra
          </span>
        );
      case 'expired':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Đã kết thúc
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Không xác định
          </span>
        );
    }
  };

  const renderPromotionTypeLabel = (type) => {
    const apiType = type || '';
    
    switch (apiType.toUpperCase()) {
      case 'PERCENTAGE':
      case 'PERCENT': 
        return 'Giảm theo %';
      case 'FIXED_AMOUNT':
      case 'FIXED':
        return 'Giảm số tiền cố định';
      case 'FREE_SHIPPING':
        return 'Miễn phí vận chuyển';
      case 'BUY_X_GET_Y':
        return 'Mua X tặng Y';
      default:
        return type;
    }
  };

  const formatPrice = (price) => {
    return price?.toLocaleString('vi-VN') + '₫';
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return 'N/A';
    }
  };

  if (loading && promotions.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý khuyến mãi</h1>
        <Link
          to="/admin/promotions/new"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm khuyến mãi
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 border-b">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên khuyến mãi, mã giảm giá..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <SearchIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    ID
                    {sortBy === 'id' && (
                      <span className="ml-1">
                        {sortDir === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Tên khuyến mãi
                    {sortBy === 'name' && (
                      <span className="ml-1">
                        {sortDir === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Loại
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Giá trị
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('startDate')}
                >
                  <div className="flex items-center">
                    Thời gian
                    {sortBy === 'startDate' && (
                      <span className="ml-1">
                        {sortDir === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promotions.length > 0 ? (
                promotions.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {promotion.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{promotion.name}</div>
                      {promotion.code && (
                        <div className="text-xs text-gray-500">
                          Mã: <span className="font-mono font-medium">{promotion.code}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {renderPromotionTypeLabel(promotion.discountType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {promotion.discountType === 'percentage' || promotion.discountType === 'PERCENTAGE'
                        ? `${promotion.discountValue}%`
                        : promotion.discountType === 'fixed_amount' || promotion.discountType === 'FIXED_AMOUNT'
                        ? formatPrice(promotion.discountValue)
                        : promotion.discountType === 'free_shipping' || promotion.discountType === 'FREE_SHIPPING'
                        ? 'Miễn phí'
                        : promotion.discountValue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                        <span>
                          {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {renderStatusBadge(getPromotionStatus(promotion))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <Link
                          to={`/admin/promotions/${promotion.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Chỉnh sửa"
                        >
                          <PencilAltIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(promotion.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    Không tìm thấy chương trình khuyến mãi nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="px-6 py-3 flex items-center justify-between border-t">
            <div className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{promotions.length}</span> trong{' '}
              <span className="font-medium">{totalElements}</span> kết quả
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

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

export default PromotionManagement; 