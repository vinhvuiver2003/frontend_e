import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white pt-10 pb-5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Fashion Store</h3>
                        <p className="text-gray-300">
                            Cửa hàng thời trang chất lượng cao với đa dạng mẫu mã và phong cách.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Danh mục</h4>
                        <ul className="space-y-2">
                            <li><Link to="/products?category=1" className="text-gray-300 hover:text-white">Thời trang nam</Link></li>
                            <li><Link to="/products?category=2" className="text-gray-300 hover:text-white">Thời trang nữ</Link></li>
                            <li><Link to="/products?category=3" className="text-gray-300 hover:text-white">Phụ kiện</Link></li>
                            <li><Link to="/products?category=4" className="text-gray-300 hover:text-white">Giày dép</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Trợ giúp</h4>
                        <ul className="space-y-2">
                            <li><Link to="/shipping" className="text-gray-300 hover:text-white">Vận chuyển</Link></li>
                            <li><Link to="/returns" className="text-gray-300 hover:text-white">Đổi trả</Link></li>
                            <li><Link to="/size-guide" className="text-gray-300 hover:text-white">Hướng dẫn chọn size</Link></li>
                            <li><Link to="/faq" className="text-gray-300 hover:text-white">Câu hỏi thường gặp</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
                        <p className="text-gray-300 mb-2">Email: info@fashionstore.com</p>
                        <p className="text-gray-300 mb-2">Điện thoại: (84) 123 456 789</p>
                        <p className="text-gray-300">Địa chỉ: 123 Đường ABC, Quận XYZ, TP. HCM</p>
                    </div>
                </div>

                <hr className="my-6 border-gray-700" />

                <div className="text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Fashion Store. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;