import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProductList from './pages/Products/ProductList';
import ProductDetail from './pages/Products/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/Checkout/OrderSuccess';
import AccountLayout from './pages/Account/Layout';
import Profile from './pages/Account/Profile';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
    const { isAuthenticated } = useSelector(state => state.auth);

    return (
        <Router>
            <div className="App flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/order-success" element={<OrderSuccess />} />

                        {/* Routes cho trang tài khoản */}
                        <Route path="/account" element={<AccountLayout />}>
                            <Route path="profile" element={<Profile />} />
                            {/* Các route con khác sẽ được thêm sau */}
                        </Route>

                        {/* Thêm các routes khác khi phát triển */}
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;