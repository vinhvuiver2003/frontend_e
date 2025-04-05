import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, mergeCartsAsync } from './store/slices/cartSlice';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import VerifyAccount from './pages/Auth/VerifyAccount';
import ProductList from './pages/Products/ProductList';
import ProductDetail from './pages/Products/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/Checkout/OrderSuccess';
import AccountLayout from './pages/Account/Layout';
import Profile from './pages/Account/Profile';
import ChangePassword from './pages/Account/ChangePassword';
import Orders from './pages/Account/Orders';
import UserOrderDetail from './pages/Account/OrderDetail';
import AdminLayout from './pages/Admin/Layout';
import Dashboard from './pages/Admin/Dashboard';
import ProductsManagement from './pages/Admin/ProductsManagement';
import ProductForm from './pages/Admin/ProductForm';
import OrdersManagement from './pages/Admin/OrdersManagement';
import AdminOrderDetail from './pages/Admin/OrderDetail';
import UserManagement from './pages/Admin/UserManagement';
import CategoriesManagement from './pages/Admin/CategoriesManagement';
import BrandsManagement from './pages/Admin/BrandsManagement';
import UserForm from './pages/Admin/UserForm';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';
import AuthErrorAlert from './components/common/AuthErrorAlert';
import PromotionManagement from './pages/Admin/PromotionManagement';
import PromotionForm from './pages/Admin/PromotionForm';

function App() {
    const { isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    // Khởi tạo giỏ hàng khi ứng dụng được tải
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
        }
    }, [isAuthenticated, dispatch]);

    // Kiểm tra và thực hiện hợp nhất giỏ hàng sau khi đăng nhập
    useEffect(() => {
        if (isAuthenticated && localStorage.getItem('should_merge_cart') === 'true') {
            // Xóa cờ hợp nhất giỏ hàng
            localStorage.removeItem('should_merge_cart');
            // Thực hiện hợp nhất giỏ hàng
            dispatch(mergeCartsAsync());
        }
    }, [dispatch, isAuthenticated]);

    return (
        <Router>
            <div className="App flex flex-col min-h-screen">
                <Header />
                <AuthErrorAlert />
                <main className="flex-grow">
                    <Routes>
                        {/* Public Routes - Ai cũng truy cập được */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/verify-account" element={<VerifyAccount />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        
                        {/* Protected Routes - Cần đăng nhập */}
                        <Route element={<PrivateRoute />}>
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/order-success" element={<OrderSuccess />} />

                            {/* Routes cho trang tài khoản */}
                            <Route path="/account" element={<AccountLayout />}>
                                <Route path="profile" element={<Profile />} />
                                <Route path="change-password" element={<ChangePassword />} />
                                <Route path="orders" element={<Orders />} />
                                <Route path="orders/:id" element={<UserOrderDetail />} />
                                {/* Các route con khác sẽ được thêm sau */}
                            </Route>
                        </Route>

                        {/* Admin Routes - Chỉ dành cho admin */}
                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="products" element={<ProductsManagement />} />
                                <Route path="products/new" element={<ProductForm />} />
                                <Route path="products/:id/edit" element={<ProductForm />} />
                                <Route path="categories" element={<CategoriesManagement />} />
                                <Route path="brands" element={<BrandsManagement />} />
                                <Route path="promotions" element={<PromotionManagement />} />
                                <Route path="promotions/new" element={<PromotionForm />} />
                                <Route path="promotions/:id/edit" element={<PromotionForm />} />
                                <Route path="orders" element={<OrdersManagement />} />
                                <Route path="orders/:id" element={<AdminOrderDetail />} />
                                <Route path="users" element={<UserManagement />} />
                                <Route path="users/new" element={<UserForm />} />
                                <Route path="users/:id/edit" element={<UserForm />} />
                            </Route>
                        </Route>

                        {/* Fallback Route - Khi không tìm thấy trang */}
                        <Route path="*" element={
                            <div className="flex flex-col items-center justify-center h-screen">
                                <h1 className="text-4xl font-bold mb-4">404</h1>
                                <p className="text-xl mb-8">Không tìm thấy trang bạn yêu cầu</p>
                                <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                                    Quay về trang chủ
                                </a>
                            </div>
                        } />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;