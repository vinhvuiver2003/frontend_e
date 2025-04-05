import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import dashboardService from '../../services/dashboardService';

// Đăng ký các components cần thiết cho ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CategorySalesChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Các màu cho biểu đồ
  const backgroundColors = [
    'rgba(54, 162, 235, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(255, 159, 64, 0.6)',
  ];

  useEffect(() => {
    const fetchCategorySales = async () => {
      try {
        setLoading(true);
        
        // Gọi API để lấy dữ liệu thống kê tổng quan
        const stats = await dashboardService.getDashboardStats();
        
        if (stats && stats.salesByCategory) {
          // Chuyển đổi dữ liệu cho biểu đồ
          const categories = Object.keys(stats.salesByCategory);
          const salesValues = Object.values(stats.salesByCategory).map(value => Number(value));
          
          setChartData({
            labels: categories,
            datasets: [
              {
                label: 'Doanh thu',
                data: salesValues,
                backgroundColor: backgroundColors,
                borderWidth: 1,
              }
            ]
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching category sales data:', err);
        setError('Không thể tải dữ liệu doanh thu theo danh mục');
        setLoading(false);
      }
    };
    
    fetchCategorySales();
  }, []);

  // Options cho biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Doanh thu theo danh mục',
      },
      tooltip: {
        callbacks: {
          label: (context) => `Doanh thu: ${context.raw.toLocaleString('vi-VN')}₫`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString('vi-VN')}₫`
        }
      }
    }
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
      <h3 className="text-lg font-medium mb-4">Doanh thu theo danh mục</h3>
      <div className="h-60">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
};

export default CategorySalesChart; 