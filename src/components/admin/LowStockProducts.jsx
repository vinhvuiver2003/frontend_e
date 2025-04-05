import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';

const LowStockProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        setLoading(true);
        
        // Gọi API để lấy dữ liệu sản phẩm sắp hết hàng
        const lowStockProducts = await dashboardService.getLowStockProducts(10);
        
        if (lowStockProducts) {
          setProducts(lowStockProducts);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching low stock products:', err);
        setError('Không thể tải dữ liệu sản phẩm sắp hết hàng');
        setLoading(false);
      }
    };
    
    fetchLowStockProducts();
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
        <h3 className="text-lg font-medium">Sản phẩm sắp hết hàng</h3>
        <Link to="/admin/products" className="text-sm text-blue-600 hover:text-blue-800">
          Xem tất cả
        </Link>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Không có sản phẩm nào sắp hết hàng
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.images && product.images[0] ? (
                        <img 
                          src={product.images[0].url} 
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover mr-3" 
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-200 mr-3 flex items-center justify-center text-gray-500">
                          No img
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={product.name}>
                        {product.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock <= 5 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.stock} sản phẩm
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      to={`/admin/products/${product.id}/edit`} 
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Cập nhật
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LowStockProducts; 