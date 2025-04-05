import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAllOrders } from '../../store/slices/orderSlice';
import { 
  ShoppingBagIcon, 
  UserGroupIcon, 
  CashIcon, 
  ClipboardCheckIcon 
} from '@heroicons/react/outline';
import dashboardService from '../../services/dashboardService';
import SalesChart from '../../components/admin/SalesChart';
import OrderStatusChart from '../../components/admin/OrderStatusChart';
import TopSellingProducts from '../../components/admin/TopSellingProducts';
import LowStockProducts from '../../components/admin/LowStockProducts';
import CategorySalesChart from '../../components/admin/CategorySalesChart';

const StatCard = ({ title, value, icon, color, linkTo }) => {
  return (
    <Link 
      to={linkTo}
      className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
      </div>
    </Link>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { allOrders, loading: ordersLoading } = useSelector(state => state.orders);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalSales: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Tải dữ liệu đơn hàng
    dispatch(fetchAllOrders({ page: 0, size: 5 }));
    
    // Tải thống kê tổng quan từ API
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const dashboardStats = await dashboardService.getDashboardStats();
        setStats({
          totalProducts: dashboardStats.totalProducts || 0,
          totalOrders: dashboardStats.totalOrders || 0,
          totalUsers: dashboardStats.totalUsers || 0,
          totalSales: dashboardStats.totalSales || 0
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, [dispatch]);

  // Format giá tiền
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0';
    return price.toLocaleString('vi-VN') + '₫';
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
      <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Hôm nay: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Tổng sản phẩm" 
          value={stats.totalProducts} 
          icon={<ShoppingBagIcon className="h-6 w-6 text-white" />}
          color="bg-blue-500"
          linkTo="/admin/products"
        />
        
        <StatCard 
          title="Tổng đơn hàng" 
          value={stats.totalOrders} 
          icon={<ClipboardCheckIcon className="h-6 w-6 text-white" />}
          color="bg-green-500"
          linkTo="/admin/orders"
        />
        
        <StatCard 
          title="Tổng người dùng" 
          value={stats.totalUsers} 
          icon={<UserGroupIcon className="h-6 w-6 text-white" />}
          color="bg-purple-500"
          linkTo="/admin/users"
        />
        
        <StatCard 
          title="Doanh thu" 
          value={formatPrice(stats.totalSales)} 
          icon={<CashIcon className="h-6 w-6 text-white" />}
          color="bg-red-500"
          linkTo="/admin/orders"
        />
      </div>

      {/* Biểu đồ thống kê */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SalesChart />
        <OrderStatusChart />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CategorySalesChart />
        <TopSellingProducts />
      </div>

      {/* Đơn hàng mới nhất & Sản phẩm sắp hết hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium">Đơn hàng mới nhất</h2>
            <Link to="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800">
              Xem tất cả
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ordersLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : allOrders && allOrders.content && allOrders.content.length > 0 ? (
                  allOrders.content.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-900">
                          #{order.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.user ? `${order.user.firstName} ${order.user.lastName}` : order.receiverName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                          {order.orderStatus === 'pending' ? 'Chờ xác nhận' :
                           order.orderStatus === 'confirmed' ? 'Đã xác nhận' :
                           order.orderStatus === 'processed' ? 'Đang xử lý' :
                           order.orderStatus === 'shipped' ? 'Đang giao hàng' :
                           order.orderStatus === 'delivered' ? 'Đã giao hàng' :
                           order.orderStatus === 'cancelled' ? 'Đã hủy' : 'Không xác định'
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatPrice(order.finalAmount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      Không có đơn hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <LowStockProducts />
      </div>
    </div>
  );
};

export default Dashboard; 