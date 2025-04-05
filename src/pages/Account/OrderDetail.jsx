import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById, cancelOrder, confirmDelivery } from '../../store/slices/orderSlice';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { toast } from 'react-toastify';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentOrder, loading, error } = useSelector(state => state.orders);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmDeliveryModal, setShowConfirmDeliveryModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  // Format giá tiền
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0';
    return price.toLocaleString('vi-VN') + '₫';
  };

  // Format ngày
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'HH:mm - dd/MM/yyyy', { locale: vi });
  };

  // Xử lý hủy đơn hàng
  const handleCancelOrder = () => {
    // Kiểm tra lại một lần nữa trước khi hủy
    if (!canCancelOrder()) {
      toast.error('Không thể hủy đơn hàng này');
      setShowCancelModal(false);
      return;
    }

    if (!cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy đơn hàng');
      return;
    }
    
    dispatch(cancelOrder({ id, cancelReason }))
      .unwrap()
      .then(() => {
        setShowCancelModal(false);
        setCancelReason('');
        // Sau khi hủy đơn hàng thành công, tải lại thông tin đơn hàng
        dispatch(fetchOrderById(id));
      })
      .catch(err => {
        console.error('Lỗi khi hủy đơn hàng:', err);
      });
  };

  // Xử lý xác nhận đã nhận hàng
  const handleConfirmDelivery = () => {
    // Kiểm tra lại một lần nữa trước khi xác nhận
    if (!canConfirmDelivery()) {
      toast.error('Không thể xác nhận đã nhận hàng cho đơn hàng này');
      setShowConfirmDeliveryModal(false);
      return;
    }

    dispatch(confirmDelivery(id))
      .unwrap()
      .then(() => {
        setShowConfirmDeliveryModal(false);
        // Sau khi xác nhận nhận hàng thành công, tải lại thông tin đơn hàng
        dispatch(fetchOrderById(id));
      })
      .catch(err => {
        console.error('Lỗi khi xác nhận đã nhận hàng:', err);
      });
  };

  // Kiểm tra nếu có thể hủy đơn hàng
  const canCancelOrder = () => {
    return currentOrder && 
           (currentOrder.orderStatus === 'pending' || 
            currentOrder.orderStatus === 'processing') &&
           currentOrder.orderStatus !== 'cancelled' &&
           currentOrder.orderStatus !== 'delivered';
  };

  // Kiểm tra nếu có thể xác nhận đã nhận hàng
  const canConfirmDelivery = () => {
    return currentOrder && 
           currentOrder.orderStatus === 'shipped' &&
           currentOrder.orderStatus !== 'cancelled' &&
           currentOrder.orderStatus !== 'delivered';
  };

  // Component hiển thị trạng thái đơn hàng
  const OrderStatusBadge = ({ status }) => {
    let bgColor, textColor, text;

    switch (status) {
      case 'pending':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        text = 'Chờ xác nhận';
        break;
      case 'processing':
        bgColor = 'bg-indigo-100';
        textColor = 'text-indigo-800';
        text = 'Đang xử lý';
        break;
      case 'shipped':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        text = 'Đang giao hàng';
        break;
      case 'delivered':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        text = 'Đã giao hàng';
        break;
      case 'cancelled':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        text = 'Đã hủy';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        text = status;
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {text}
      </span>
    );
  };

  if (loading && !currentOrder) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>Đã xảy ra lỗi: {error}</p>
          <button
            className="mt-2 text-sm underline"
            onClick={() => dispatch(fetchOrderById(id))}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Không tìm thấy thông tin đơn hàng</p>
          <Link
            to="/account/orders"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/account/orders')}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Chi tiết đơn hàng #{currentOrder.id}
            </h1>
          </div>
          <OrderStatusBadge status={currentOrder.orderStatus} />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Đặt hàng vào {formatDate(currentOrder.createdAt)}
        </p>
      </div>

      {/* Thông tin chung */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thông tin đơn hàng */}
        <div className="col-span-2 space-y-6">
          {/* Danh sách sản phẩm */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sản phẩm đã đặt</h2>
            <div className="border rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {currentOrder.items.map((item) => (
                  <div key={item.id} className="p-4 flex">
                    <div className="ml-0 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            <Link to={`/products/${item.productId}`} className="hover:text-blue-600">
                              {item.productName}
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.color && `Màu: ${item.color}`} 
                            {item.color && item.size && ' | '} 
                            {item.size && `Kích thước: ${item.size}`}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(item.total)}
                        </p>
                      </div>
                      <div className="mt-1 flex justify-between text-sm text-gray-500">
                        <p>Số lượng: {item.quantity}</p>
                        <p>{formatPrice(item.unitPrice)} / sản phẩm</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Thông tin vận chuyển */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Thông tin vận chuyển</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Địa chỉ giao hàng</p>
                  <p className="mt-1 text-sm text-gray-900">{currentOrder.delivery?.shippingAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                  <p className="mt-1 text-sm text-gray-900">{currentOrder.delivery?.contactPhone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phương thức vận chuyển</p>
                  <p className="mt-1 text-sm text-gray-900">{currentOrder.delivery?.shippingMethod || 'Giao hàng tiêu chuẩn'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentOrder.delivery?.shippingStatus === 'pending' && 'Đang chuẩn bị'}
                    {currentOrder.delivery?.shippingStatus === 'processing' && 'Đang xử lý'}
                    {currentOrder.delivery?.shippingStatus === 'shipped' && 'Đang giao hàng'}
                    {currentOrder.delivery?.shippingStatus === 'delivered' && 'Đã giao hàng'}
                    {currentOrder.delivery?.shippingStatus === 'failed' && 'Giao hàng thất bại'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nút hành động (chỉ hiển thị khi có thể thực hiện hành động) */}
          {(canCancelOrder() || canConfirmDelivery()) && (
            <div className="flex space-x-4 mt-6">
              {canCancelOrder() && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Hủy đơn hàng
                </button>
              )}
              {canConfirmDelivery() && (
                <button
                  onClick={() => setShowConfirmDeliveryModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Xác nhận đã nhận hàng
                </button>
              )}
            </div>
          )}
        </div>

        {/* Thông tin thanh toán */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Thông tin thanh toán</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tổng tiền hàng:</span>
                <span className="font-medium">{formatPrice(currentOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Giảm giá:</span>
                <span className="font-medium">-{formatPrice(currentOrder.discountAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phí vận chuyển:</span>
                <span className="font-medium">{formatPrice(currentOrder.shippingFee)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Tổng thanh toán:</span>
                  <span className="font-medium text-blue-600">{formatPrice(currentOrder.finalAmount)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Phương thức thanh toán</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentOrder.payment?.bankAccount ? 'Chuyển khoản ngân hàng' : 'Thanh toán khi nhận hàng (COD)'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Trạng thái thanh toán</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentOrder.payment?.status === 'pending' && 'Chờ thanh toán'}
                    {currentOrder.payment?.status === 'completed' && 'Đã thanh toán'}
                    {currentOrder.payment?.status === 'failed' && 'Thanh toán thất bại'}
                  </p>
                </div>
                {currentOrder.payment?.bankAccount && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tài khoản ngân hàng</p>
                    <p className="mt-1 text-sm text-gray-900">{currentOrder.payment.bankAccount}</p>
                  </div>
                )}
                {currentOrder.payment?.bankTransferCode && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mã giao dịch</p>
                    <p className="mt-1 text-sm text-gray-900">{currentOrder.payment.bankTransferCode}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xác nhận hủy đơn hàng */}
      {showCancelModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Hủy đơn hàng
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.
                      </p>
                      <div className="mt-4">
                        <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700">
                          Lý do hủy đơn*
                        </label>
                        <textarea
                          id="cancel-reason"
                          rows="3"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          placeholder="Vui lòng nhập lý do hủy đơn hàng"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCancelOrder}
                >
                  Hủy đơn hàng
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowCancelModal(false)}
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận đã nhận hàng */}
      {showConfirmDeliveryModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Xác nhận đã nhận hàng
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn đã nhận được hàng không? Sau khi xác nhận, trạng thái đơn hàng sẽ được chuyển thành "Đã giao hàng".
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirmDelivery}
                >
                  Xác nhận đã nhận hàng
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowConfirmDeliveryModal(false)}
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