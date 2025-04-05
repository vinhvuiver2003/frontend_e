import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import dashboardService from '../../services/dashboardService';

// Đăng ký các components cần thiết cho ChartJS
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const OrderStatusChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Các màu cho biểu đồ
  const backgroundColors = [
    'rgba(54, 162, 235, 0.6)',  // xanh dương
    'rgba(255, 206, 86, 0.6)',  // vàng
    'rgba(75, 192, 192, 0.6)',  // xanh lá
    'rgba(153, 102, 255, 0.6)', // tím
    'rgba(255, 99, 132, 0.6)',  // hồng
    'rgba(255, 159, 64, 0.6)',  // cam
  ];

  // Ánh xạ trạng thái đơn hàng từ tiếng Anh sang tiếng Việt
  const statusMapping = {
    'pending': 'Chờ xác nhận',
    'confirmed': 'Đã xác nhận',
    'processed': 'Đang xử lý',
    'shipped': 'Đang giao hàng',
    'delivered': 'Đã giao hàng',
    'cancelled': 'Đã hủy',
    'refunded': 'Đã hoàn tiền'
  };

  // Lấy thông tin thống kê đơn hàng
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        
        // Gọi API để lấy dữ liệu thống kê tổng quan
        const stats = await dashboardService.getDashboardStats();
        
        if (stats && stats.orderStatusDistribution) {
          // Chuyển đổi dữ liệu cho biểu đồ
          const statuses = Object.keys(stats.orderStatusDistribution);
          const statusCounts = Object.values(stats.orderStatusDistribution);
          
          // Chuyển đổi tên trạng thái sang tiếng Việt
          const vietnameseLabels = statuses.map(status => statusMapping[status] || status);
          
          setChartData({
            labels: vietnameseLabels,
            datasets: [
              {
                label: 'Số lượng đơn hàng',
                data: statusCounts,
                backgroundColor: backgroundColors,
                borderWidth: 1,
              }
            ]
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order status data:', err);
        setError('Không thể tải dữ liệu trạng thái đơn hàng');
        setLoading(false);
      }
    };
    
    fetchOrderData();
  }, []);

  // Options cho biểu đồ
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        align: 'start',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Phân phối trạng thái đơn hàng',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, current) => acc + current, 0);
            const percentage = Math.round(value / total * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium mb-4">Phân phối đơn hàng theo trạng thái</h3>
      <div className="h-80">
        <Doughnut options={options} data={chartData} />
      </div>
    </div>
  );
};

export default OrderStatusChart; 