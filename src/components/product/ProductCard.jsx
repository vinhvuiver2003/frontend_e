import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCartAsync } from '../../store/slices/cartSlice';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        dispatch(addToCartAsync({
            productId: product.id,
            variantId: product.variants && product.variants.length > 0 ? product.variants[0].id : 1,
            name: product.name,
            price: product.basePrice,
            image: product.image || 'https://via.placeholder.com/300x300',
            quantity: 1
        }));

        alert('Sản phẩm đã được thêm vào giỏ hàng!');
    };

    return (
        <Link to={`/products/${product.id}`} className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
                <div className="relative h-64 overflow-hidden">
                    <img
                        src={product.image || 'https://via.placeholder.com/300x300'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <button
                        onClick={handleAddToCart}
                        className="absolute bottom-4 right-4 bg-white text-gray-800 p-2 rounded-full shadow hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </button>
                </div>

                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-500 transition-colors">
                        {product.name}
                    </h3>

                    <div className="flex justify-between items-center">
                        <p className="font-bold text-lg">{product.basePrice?.toLocaleString('vi-VN')} đ</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;