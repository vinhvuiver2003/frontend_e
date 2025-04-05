import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, subDays, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import dashboardService from '../../services/dashboardService';

// Đăng ký các components cần thiết cho ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('monthly');

  // Lấy thông tin thống kê doanh số theo thời gian
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        
        // Tính toán ngày bắt đầu (mặc định là 30 ngày trước)
        const endDate = new Date();
        const startDate = subDays(endDate, 30);
        
        // Format ngày theo ISO string
        const formattedStartDate = startDate.toISOString();
        const formattedEndDate = endDate.toISOString();
        
        // Gọi API để lấy dữ liệu
        const salesData = await dashboardService.getSalesByPeriod(
          period, 
          formattedStartDate, 
          formattedEndDate
        );
        
        console.log('Sales API response:', salesData); // Debug log
        
        if (salesData && salesData.salesByPeriod) {
          // Chuyển đổi dữ liệu cho biểu đồ
          const labels = Object.keys(salesData.salesByPeriod).map(date => {
            // Format ngày tùy thuộc vào period
            try {
              if (period === 'daily') {
                return format(parseISO(date), 'dd/MM', { locale: vi });
              } else if (period === 'monthly') {
                // Xử lý khi format là YYYY-MM
                const [year, month] = date.split('-');
                return `${month}/${year}`;
              } else if (period === 'weekly') {
                return format(parseISO(date), 'dd/MM', { locale: vi }) + ' (Tuần)';
              } else {
                return date;
              }
            } catch (err) {
              console.error('Error formatting date:', date, err);
              return date;
            }
          });
          
          const salesValues = Object.values(salesData.salesByPeriod);
          
          setChartData({
            labels,
            datasets: [
              {
                label: 'Doanh số',
                data: salesValues,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.3
              }
            ]
          });
        } else if (salesData) {
          // Trường hợp không có salesByPeriod nhưng có dữ liệu
          // Tạo biểu đồ với thông tin tổng doanh số
          setChartData({
            labels: ['Tổng doanh số'],
            datasets: [
              {
                label: 'Doanh số',
                data: [salesData.totalSales || 0],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.3
              }
            ]
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sales data:', err);
        setError('Không thể tải dữ liệu doanh số');
        setLoading(false);
      }
    };
    
    fetchSalesData();
  }, [period]);

  // Options cho biểu đồ
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Biểu đồ doanh số theo thời gian',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `Doanh số: ${context.raw.toLocaleString('vi-VN')}₫`
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

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Biểu đồ doanh số</h3>
        <select 
          value={period} 
          onChange={handlePeriodChange}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          <option value="daily">Theo ngày</option>
          <option value="weekly">Theo tuần</option>
          <option value="monthly">Theo tháng</option>
        </select>
      </div>
      <div className="h-80">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
};

export default SalesChart; 