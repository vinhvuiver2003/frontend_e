import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  fetchOrderById, 
  confirmOrderDelivery, 
  cancelOrder,
  clearOrderError 
} from '../../store/slices/orderSlice';
import { 
  ArrowLeftIcon, 
  CheckCircleIcon, 
  TruckIcon, 
  XCircleIcon,
  ClockIcon,
  CreditCardIcon,
  LocationMarkerIcon,
  PhoneIcon,
  UserIcon
} from '@heroicons/react/outline';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentOrder, loading, error } = useSelector(state => state.orders);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
    
    // Cleanup khi unmount
    return () => {
      dispatch(clearOrderError());
    };
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

  // Xác nhận đã nhận hàng
  const handleConfirmDelivery = () => {
    dispatch(confirmOrderDelivery(id))
      .unwrap()
      .then(() => {
        setShowConfirmModal(false);
      })
      .catch((err) => console.error('Lỗi khi xác nhận đã nhận hàng:', err));
  };

  // Hủy đơn hàng
  const handleCancelOrder = () => {
    if (!cancelReason.trim()) {
      alert('Vui lòng nhập lý do hủy đơn hàng');
      return;
    }

    dispatch(cancelOrder({ id, cancelReason }))
      .unwrap()
      .then(() => {
        setShowCancelModal(false);
        setCancelReason('');
      })
      .catch((err) => console.error('Lỗi khi hủy đơn hàng:', err));
  };

  if (loading && !currentOrder) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/account/orders')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Quay lại danh sách đơn hàng
          </button>
        </div>
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
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/account/orders')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Quay lại danh sách đơn hàng
          </button>
        </div>
        <div className="text-center py-10">
          <p className="text-gray-500">Không tìm thấy thông tin đơn hàng</p>
        </div>
      </div>
    );
  }

  // Hiển thị trạng thái đơn hàng
  const renderOrderStatus = () => {
    switch (currentOrder.orderStatus) {
      case 'pending':
        return (
          <div className="flex items-center text-blue-600">
            <ClockIcon className="h-5 w-5 mr-2" />
            <span>Chờ xác nhận</span>
          </div>
        );
      case 'confirmed':
        return (
          <div className="flex items-center text-indigo-600">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <span>Đã xác nhận</span>
          </div>
        );
      case 'processed':
        return (
          <div className="flex items-center text-purple-600">
            <ClockIcon className="h-5 w-5 mr-2" />
            <span>Đang xử lý</span>
          </div>
        );
      case 'shipped':
        return (
          <div className="flex items-center text-yellow-600">
            <TruckIcon className="h-5 w-5 mr-2" />
            <span>Đang giao hàng</span>
          </div>
        );
      case 'delivered':
        return (
          <div className="flex items-center text-green-600">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <span>Đã giao hàng</span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex items-center text-red-600">
            <XCircleIcon className="h-5 w-5 mr-2" />
            <span>Đã hủy</span>
          </div>
        );
      default:
        return <span className="text-gray-600">Không xác định</span>;
    }
  };

  // Hiển thị trạng thái vận chuyển
  const renderShippingStatus = () => {
    if (!currentOrder.delivery) return null;
    
    switch (currentOrder.delivery.shippingStatus) {
      case 'pending':
        return (
          <div className="text-sm text-blue-600">
            Chờ xử lý
          </div>
        );
      case 'processing':
        return (
          <div className="text-sm text-indigo-600">
            Đang chuẩn bị hàng
          </div>
        );
      case 'shipped':
        return (
          <div className="text-sm text-yellow-600">
            Đang vận chuyển
            {currentOrder.delivery.shippedDate && (
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(currentOrder.delivery.shippedDate)}
              </div>
            )}
          </div>
        );
      case 'delivered':
        return (
          <div className="text-sm text-green-600">
            Đã giao hàng
            {currentOrder.delivery.deliveredDate && (
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(currentOrder.delivery.deliveredDate)}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/account/orders')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Quay lại danh sách đơn hàng
        </button>
        
        <div>
          {/* Các nút hành động */}
          {currentOrder.orderStatus === 'pending' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 mr-2"
            >
              Hủy đơn hàng
            </button>
          )}
          
          {currentOrder.orderStatus === 'shipped' && (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100"
            >
              Xác nhận đã nhận hàng
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <h2 className="text-lg font-semibold">Đơn hàng #{currentOrder.id}</h2>
          {renderOrderStatus()}
        </div>
        <div className="text-sm text-gray-500">
          Đặt hàng lúc: {formatDate(currentOrder.createdAt)}
        </div>
        
        {currentOrder.cancelReason && (
          <div className="mt-2 text-sm text-red-600">
            Lý do hủy: {currentOrder.cancelReason}
          </div>
        )}
      </div>
      
      {/* Thông tin sản phẩm */}
      <div className="mb-6">
        <h3 className="text-base font-medium mb-3">Sản phẩm đã đặt</h3>
        <div className="border rounded-md overflow-hidden">
          {currentOrder.items.map((item, index) => (
            <div key={item.id} className={`p-4 flex ${index < currentOrder.items.length - 1 ? 'border-b' : ''}`}>
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {item.product.imageUrl ? (
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.name || 'Sản phẩm'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Không có ảnh
                  </div>
                )}
              </div>
              
              <div className="ml-4 flex-grow">
                <Link 
                  to={`/products/${item.product.id}`}
                  className="text-sm font-medium hover:text-blue-600"
                >
                  {item.product.name || 'Sản phẩm không có tên'}
                </Link>
                
                {item.variant && (
                  <div className="text-xs text-gray-500 mt-1">
                    Phân loại: {item.variant.name}
                  </div>
                )}
                
                <div className="mt-2 flex justify-between">
                  <div className="text-sm text-gray-500">
                    {formatPrice(item.unitPrice)} x {item.quantity}
                  </div>
                  <div className="text-sm font-medium">
                    {formatPrice(item.total)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Thông tin thanh toán */}
      <div className="mb-6">
        <h3 className="text-base font-medium mb-3">Thông tin thanh toán</h3>
        <div className="bg-gray-50 rounded-md p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Phương thức thanh toán</div>
              <div className="flex items-center">
                <CreditCardIcon className="h-4 w-4 mr-1 text-gray-400" />
                <span className="text-sm">
                  {currentOrder.payment ? 
                    (currentOrder.payment.paymentMethod === 'cash' ? 'Thanh toán khi nhận hàng' : 'Thanh toán qua thẻ') 
                    : 'Không có thông tin'
                  }
                </span>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Trạng thái thanh toán</div>
              <div className="text-sm">
                {currentOrder.payment ? 
                  (currentOrder.payment.paymentStatus === 'paid' ? 
                    <span className="text-green-600">Đã thanh toán</span> : 
                    <span className="text-yellow-600">Chưa thanh toán</span>
                  ) 
                  : 'Không có thông tin'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Thông tin giao hàng */}
      <div className="mb-6">
        <h3 className="text-base font-medium mb-3">Thông tin giao hàng</h3>
        <div className="bg-gray-50 rounded-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Người nhận</div>
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-1 text-gray-400" />
                <span className="text-sm">{currentOrder.receiverName}</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Số điện thoại</div>
              <div className="flex items-center">
                <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                <span className="text-sm">{currentOrder.delivery?.contactPhone || 'Không có thông tin'}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Địa chỉ giao hàng</div>
            <div className="flex items-start">
              <LocationMarkerIcon className="h-4 w-4 mr-1 mt-0.5 text-gray-400" />
              <span className="text-sm">{currentOrder.delivery?.shippingAddress || 'Không có thông tin'}</span>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">Trạng thái vận chuyển</div>
            {renderShippingStatus()}
          </div>
        </div>
      </div>
      
      {/* Thông tin tổng thanh toán */}
      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Tạm tính</span>
          <span className="text-sm">{formatPrice(currentOrder.subtotal)}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-sm">Phí vận chuyển</span>
          <span className="text-sm">{formatPrice(currentOrder.shippingFee)}</span>
        </div>
        
        {currentOrder.discount > 0 && (
          <div className="flex justify-between mb-2 text-green-600">
            <span className="text-sm">Giảm giá</span>
            <span className="text-sm">-{formatPrice(currentOrder.discount)}</span>
          </div>
        )}
        
        <div className="flex justify-between mt-4 pt-4 border-t">
          <span className="font-medium">Tổng thanh toán</span>
          <span className="font-medium text-lg text-red-600">{formatPrice(currentOrder.finalAmount)}</span>
        </div>
      </div>
      
      {/* Modal xác nhận đã nhận hàng */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Xác nhận đã nhận hàng</h3>
            <p className="text-gray-600 mb-6">
              Bạn xác nhận đã nhận được đơn hàng này? Hành động này không thể hoàn tác.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                onClick={() => setShowConfirmModal(false)}
              >
                Hủy
              </button>
              <button 
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={handleConfirmDelivery}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal hủy đơn hàng */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Hủy đơn hàng</h3>
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
            </p>
            
            <div className="mb-4">
              <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700 mb-1">
                Lý do hủy đơn hàng *
              </label>
              <textarea
                id="cancel-reason"
                rows="3"
                className="w-full border rounded-md p-2 text-sm"
                placeholder="Vui lòng cho biết lý do bạn muốn hủy đơn hàng"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                onClick={() => setShowCancelModal(false)}
              >
                Không hủy
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleCancelOrder}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Hủy đơn hàng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail; 