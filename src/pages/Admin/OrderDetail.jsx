import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById, updateOrderStatus } from '../../store/slices/orderSlice';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/outline';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentOrder, loading, error } = useSelector(state => state.orders);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const handleOpenStatusModal = () => {
    setNewStatus(currentOrder?.orderStatus || '');
    setShowStatusModal(true);
  };

  const handleUpdateStatus = () => {
    if (newStatus) {
      dispatch(updateOrderStatus({
        id: currentOrder.id,
        status: newStatus
      }))
        .unwrap()
        .then(() => {
          setShowStatusModal(false);
          // Refresh order data
          dispatch(fetchOrderById(id));
        })
        .catch((err) => console.error('Error updating order status:', err));
    }
  };

  // Format giá tiền
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0';
    return price.toLocaleString('vi-VN') + '₫';
  };

  // Format ngày
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render trạng thái đơn hàng
  const renderOrderStatus = (status) => {
    let statusClass = '';
    let statusText = '';

    switch (status) {
      case 'pending':
        statusClass = 'bg-yellow-100 text-yellow-800';
        statusText = 'Chờ xác nhận';
        break;
      case 'processing':
        statusClass = 'bg-blue-100 text-blue-800';
        statusText = 'Đang xử lý';
        break;
      case 'shipped':
        statusClass = 'bg-purple-100 text-purple-800';
        statusText = 'Đang giao hàng';
        break;
      case 'delivered':
        statusClass = 'bg-green-100 text-green-800';
        statusText = 'Đã giao hàng';
        break;
      case 'cancelled':
        statusClass = 'bg-red-100 text-red-800';
        statusText = 'Đã hủy';
        break;
      case 'refunded':
        statusClass = 'bg-orange-100 text-orange-800';
        statusText = 'Đã hoàn tiền';
        break;
      default:
        statusClass = 'bg-gray-100 text-gray-800';
        statusText = 'Không xác định';
    }

    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
        {statusText}
      </span>
    );
  };

  // Render trạng thái vận chuyển
  const renderShippingStatus = (status) => {
    let statusClass = '';
    let statusText = '';

    switch (status) {
      case 'pending':
        statusClass = 'bg-yellow-100 text-yellow-800';
        statusText = 'Chờ xử lý';
        break;
      case 'processing':
        statusClass = 'bg-blue-100 text-blue-800';
        statusText = 'Đang xử lý';
        break;
      case 'shipped':
        statusClass = 'bg-purple-100 text-purple-800';
        statusText = 'Đã gửi hàng';
        break;
      case 'delivered':
        statusClass = 'bg-green-100 text-green-800';
        statusText = 'Đã giao hàng';
        break;
      case 'failed':
        statusClass = 'bg-red-100 text-red-800';
        statusText = 'Giao hàng thất bại';
        break;
      default:
        statusClass = 'bg-gray-100 text-gray-800';
        statusText = 'Không xác định';
    }

    return (
      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
        {statusText}
      </span>
    );
  };

  // Render trạng thái thanh toán
  const renderPaymentStatus = (status) => {
    let statusClass = '';
    let statusText = '';

    switch (status) {
      case 'pending':
        statusClass = 'bg-yellow-100 text-yellow-800';
        statusText = 'Chờ thanh toán';
        break;
      case 'completed':
        statusClass = 'bg-green-100 text-green-800';
        statusText = 'Đã thanh toán';
        break;
      case 'failed':
        statusClass = 'bg-red-100 text-red-800';
        statusText = 'Thanh toán thất bại';
        break;
      default:
        statusClass = 'bg-gray-100 text-gray-800';
        statusText = 'Không xác định';
    }

    return (
      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
        {statusText}
      </span>
    );
  };

  if (loading && !currentOrder) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v4a1 1 0 11-2 0V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                className="mt-2 text-sm text-red-700 underline"
                onClick={() => dispatch(fetchOrderById(id))}
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tiêu đề và nút quay lại */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-gray-200"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng #{currentOrder?.id}</h1>
          </div>
          <button
            onClick={handleOpenStatusModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Cập nhật trạng thái
          </button>
        </div>

        {currentOrder && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phần bên trái - Thông tin đơn hàng */}
            <div className="md:col-span-2 space-y-6">
              {/* Thông tin đơn hàng */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Thông tin đơn hàng</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Ngày đặt: {formatDate(currentOrder.createdAt)}</p>
                  </div>
                  <div>
                    {renderOrderStatus(currentOrder.orderStatus)}
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Mã đơn hàng</dt>
                      <dd className="mt-1 text-sm text-gray-900">#{currentOrder.id}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Ngày cập nhật</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(currentOrder.updatedAt)}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Email khách hàng</dt>
                      <dd className="mt-1 text-sm text-gray-900">{currentOrder.username || currentOrder.guestEmail || 'Không có'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Ghi chú</dt>
                      <dd className="mt-1 text-sm text-gray-900">{currentOrder.note || 'Không có ghi chú'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Thông tin vận chuyển */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Thông tin vận chuyển</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Phương thức: {currentOrder.delivery?.shippingMethod || 'Chưa có'}</p>
                  </div>
                  <div>
                    {renderShippingStatus(currentOrder.delivery?.shippingStatus)}
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Địa chỉ giao hàng</dt>
                      <dd className="mt-1 text-sm text-gray-900">{currentOrder.delivery?.shippingAddress || 'Chưa có'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
                      <dd className="mt-1 text-sm text-gray-900">{currentOrder.delivery?.contactPhone || 'Chưa có'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Ngày gửi hàng</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(currentOrder.delivery?.shippedDate)}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Ngày giao hàng</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(currentOrder.delivery?.deliveredDate)}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Mã vận đơn</dt>
                      <dd className="mt-1 text-sm text-gray-900">{currentOrder.delivery?.trackingNumber || 'Chưa có'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Sản phẩm đã mua</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Tổng số: {currentOrder.items?.length || 0} sản phẩm
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sản phẩm
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Biến thể
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Đơn giá
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số lượng
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentOrder.items && currentOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-0">
                                  <div className="text-sm font-medium text-gray-900">
                                    <Link to={`/admin/products/${item.productId}`} className="hover:text-blue-600">
                                      {item.productName}
                                    </Link>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Mã: #{item.productId}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {item.color && <span className="inline-block mr-2">Màu: {item.color}</span>}
                                {item.size && <span className="inline-block">Kích thước: {item.size}</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatPrice(item.unitPrice)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatPrice(item.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Phần bên phải - Thanh toán */}
            <div className="md:col-span-1 space-y-6">
              {/* Thông tin thanh toán */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Thanh toán</h3>
                  </div>
                  <div>
                    {renderPaymentStatus(currentOrder.payment?.status)}
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Ngày thanh toán</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(currentOrder.payment?.paymentDate)}</dd>
                    </div>
                    {currentOrder.payment?.bankAccount && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Tài khoản ngân hàng</dt>
                        <dd className="mt-1 text-sm text-gray-900">{currentOrder.payment.bankAccount}</dd>
                      </div>
                    )}
                    {currentOrder.payment?.bankTransferCode && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Mã giao dịch</dt>
                        <dd className="mt-1 text-sm text-gray-900">{currentOrder.payment.bankTransferCode}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Tổng thanh toán</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-y-3">
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-500">Tạm tính</dt>
                      <dd className="text-gray-900">{formatPrice(currentOrder.totalAmount)}</dd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-500">Giảm giá</dt>
                      <dd className="text-gray-900">-{formatPrice(currentOrder.discountAmount)}</dd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-500">Phí vận chuyển</dt>
                      <dd className="text-gray-900">{formatPrice(currentOrder.shippingFee)}</dd>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-medium">
                        <dt className="text-gray-900">Tổng cộng</dt>
                        <dd className="text-blue-600">{formatPrice(currentOrder.finalAmount)}</dd>
                      </div>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal cập nhật trạng thái */}
      {showStatusModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Cập nhật trạng thái đơn hàng #{currentOrder?.id}
                </h3>
                
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái mới
                  </label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đang giao hàng</option>
                    <option value="delivered">Đã giao hàng</option>
                    <option value="cancelled">Đã hủy</option>
                    <option value="refunded">Đã hoàn tiền</option>
                  </select>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Trạng thái hiện tại: {renderOrderStatus(currentOrder?.orderStatus)}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleUpdateStatus}
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowStatusModal(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail; 