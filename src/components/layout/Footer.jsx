import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white pt-10 pb-5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center mb-4">

                            <h3 className="text-xl font-bold">VQL Store</h3>
                        </div>
                        <p className="text-gray-300 mb-4">
                            Cửa hàng thời trang chất lượng cao với đa dạng mẫu mã và phong cách.
                        </p>
                        <div className="flex space-x-4 mb-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                                </svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-400">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482l.001.001c-4.1-.195-7.742-2.173-10.158-5.143a4.92 4.92 0 001.523 6.574 4.928 4.928 0 01-2.229-.616 4.92 4.92 0 003.95 4.829 4.916 4.916 0 01-2.224.084 4.923 4.923 0 004.6 3.42 9.863 9.863 0 01-6.115 2.107 10.127 10.127 0 01-1.173-.069 13.932 13.932 0 007.548 2.208c9.142 0 14.307-7.721 13.995-14.646a10.246 10.246 0 002.495-2.571l.001-.001z" />
                                </svg>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-500">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Danh mục sản phẩm</h4>
                        <ul className="space-y-2">
                            <li><Link to="/products?category=1" className="text-gray-300 hover:text-white">Áo</Link></li>
                            <li><Link to="/products?category=2" className="text-gray-300 hover:text-white">Quần</Link></li>
                            <li><Link to="/products?category=3" className="text-gray-300 hover:text-white">Phụ kiện</Link></li>
                            <li><Link to="/products?category=4" className="text-gray-300 hover:text-white">Giày dép</Link></li>
                            <li><Link to="/products" className="text-gray-300 hover:text-white">Tất cả sản phẩm</Link></li>

                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Thông tin & Hỗ trợ</h4>
                        <ul className="space-y-2">
                            <li><Link to="/shipping-policy" className="text-gray-300 hover:text-white">Chính sách vận chuyển</Link></li>
                            <li><Link to="/return-policy" className="text-gray-300 hover:text-white">Chính sách đổi trả</Link></li>
                            <li><Link to="/size-guide" className="text-gray-300 hover:text-white">Hướng dẫn chọn size</Link></li>
                            <li><Link to="/faq" className="text-gray-300 hover:text-white">Câu hỏi thường gặp</Link></li>
                            <li><Link to="/about-us" className="text-gray-300 hover:text-white">Về chúng tôi</Link></li>
                            <li><Link to="/contact" className="text-gray-300 hover:text-white">Liên hệ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
                        <div className="flex items-start mb-3">
                            <svg className="w-5 h-5 mt-0.5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <p className="text-gray-300">123 Đường ABC, Quận XYZ, TP. HCM</p>
                        </div>
                        <div className="flex items-start mb-3">
                            <svg className="w-5 h-5 mt-0.5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <p className="text-gray-300">info@storeshop.com</p>
                        </div>
                        <div className="flex items-start mb-5">
                            <svg className="w-5 h-5 mt-0.5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            <p className="text-gray-300">(84) 123 456 789</p>
                        </div>
                        

                    </div>
                </div>

                <hr className="my-6 border-gray-700" />

                <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Fashion Store. Tất cả quyền được bảo lưu.</p>
                    <div className="mt-4 md:mt-0">
                        <Link to="/privacy-policy" className="hover:text-white mr-4">Chính sách riêng tư</Link>
                        <Link to="/terms-of-service" className="hover:text-white">Điều khoản sử dụng</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;