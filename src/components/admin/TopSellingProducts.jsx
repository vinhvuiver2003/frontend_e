import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';

const TopSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        
        // Gọi API để lấy dữ liệu thống kê tổng quan
        const stats = await dashboardService.getDashboardStats();
        
        if (stats && stats.topSellingProducts) {
          // Chuyển đổi dữ liệu từ object sang array để dễ hiển thị
          const topProducts = Object.entries(stats.topSellingProducts).map(([name, quantity]) => ({
            name,
            quantity
          }));
          
          setProducts(topProducts);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching top products:', err);
        setError('Không thể tải dữ liệu sản phẩm bán chạy');
        setLoading(false);
      }
    };
    
    fetchTopProducts();
  }, []);

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
        <h3 className="text-lg font-medium">Top sản phẩm bán chạy</h3>
        <Link to="/admin/products" className="text-sm text-blue-600 hover:text-blue-800">
          Xem tất cả
        </Link>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Không có dữ liệu sản phẩm bán chạy
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-800 font-semibold">{index + 1}</span>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-900 truncate" title={product.name}>
                    {product.name}
                  </h4>
                  <span className="text-sm font-medium text-gray-500">
                    {product.quantity} sản phẩm
                  </span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (product.quantity / (products[0]?.quantity || 1)) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopSellingProducts; 