import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCartAsync } from '../../store/slices/cartSlice';
import { getCompleteImageUrl } from '../../utils/imageUtils';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    if (!product) {
        return null;
    }

    // Lấy giá cuối cùng (có thể là giá khuyến mãi)
    const finalPrice = product.salePrice || product.basePrice || 0;
    
    // Lấy URL ảnh chính
    const imageUrl = product.mainImageUrl || 
        (product.images && product.images.length > 0 ? getCompleteImageUrl(product.images[0]) : 'https://via.placeholder.com/300x300');

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Nếu có nhiều biến thể, sử dụng biến thể mặc định hoặc biến thể đầu tiên
        const defaultVariant = product.defaultVariant || 
                             (product.variants && product.variants.length > 0 ? product.variants[0] : null);
        
        dispatch(addToCartAsync({
            productId: product.id,
            variantId: defaultVariant?.id || 1,
            name: product.name,
            price: finalPrice,
            image: imageUrl,
            quantity: 1
        }));

        alert('Sản phẩm đã được thêm vào giỏ hàng!');
    };

    return (
        <Link to={`/products/${product.id}`} className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
                <div className="relative h-64 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={product.name || 'Sản phẩm'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <button
                        onClick={handleAddToCart}
                        disabled={product.status === "inactive" || product.status === "discontinued"}
                        className={`absolute bottom-4 right-4 bg-white text-gray-800 p-2 rounded-full shadow ${
                            product.status === "inactive" || product.status === "discontinued" 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-gray-100 transition-colors'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </button>
                    
                    {/* Hiển thị badge giảm giá nếu có */}
                    {product.salePrice && product.salePrice < product.basePrice && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {Math.round((1 - product.salePrice / product.basePrice) * 100)}% GIẢM
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-500 transition-colors">
                        {product.name || 'Sản phẩm không tên'}
                    </h3>

                    {(product.status === "inactive" || product.status === "discontinued") && (
                        <span className="inline-block px-2 py-1 mb-2 text-xs bg-red-100 text-red-800 rounded">
                            {product.status === "inactive" ? "Không hoạt động" : "Ngừng kinh doanh"}
                        </span>
                    )}

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold text-lg">{finalPrice.toLocaleString('vi-VN')} đ</p>
                            {product.salePrice && product.salePrice < product.basePrice && (
                                <p className="text-sm text-gray-500 line-through">
                                    {product.basePrice.toLocaleString('vi-VN')} đ
                                </p>
                            )}
                        </div>
                        
                        {product.averageRating > 0 && (
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                <span className="ml-1 text-sm text-gray-600">{product.averageRating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;