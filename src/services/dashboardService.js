import api from './api';

/**
 * Lấy thống kê tổng quan cho tháng hiện tại
 */
const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data.data;
};

/**
 * Lấy thống kê theo khoảng thời gian
 */
const getDashboardStatsByDateRange = async (startDate, endDate) => {
  const response = await api.get('/dashboard/stats/date-range', {
    params: { startDate, endDate }
  });
  return response.data.data;
};

/**
 * Lấy thống kê doanh số theo thời gian (ngày, tuần, tháng, năm)
 */
const getSalesByPeriod = async (period, startDate, endDate) => {
  const response = await api.get(`/dashboard/sales/${period}`, {
    params: { startDate, endDate }
  });
  return response.data.data;
};

/**
 * Lấy thống kê doanh số bán hàng
 */
const getSalesStats = async (startDate, endDate) => {
  const response = await api.get('/orders/stats/sales', {
    params: { startDate, endDate }
  });
  return response.data.data;
};

/**
 * Lấy danh sách sản phẩm được đánh giá cao nhất
 */
const getTopRatedProducts = async (limit = 8) => {
  const response = await api.get('/products/top-rated', {
    params: { limit }
  });
  return response.data.data;
};

/**
 * Lấy danh sách sản phẩm có tồn kho thấp
 */
const getLowStockProducts = async (threshold = 10) => {
  const response = await api.get('/products/low-stock', {
    params: { threshold }
  });
  return response.data.data;
};

const dashboardService = {
  getDashboardStats,
  getDashboardStatsByDateRange,
  getSalesByPeriod,
  getSalesStats,
  getTopRatedProducts,
  getLowStockProducts
};

export default dashboardService; 