import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

const ProductDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector(state => state.products);

    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Lưu trữ các màu và kích thước có sẵn
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);

    // Trạng thái đã chọn
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    // Tải thông tin sản phẩm
    useEffect(() => {
        dispatch(fetchProductById(parseInt(id)));
    }, [dispatch, id]);

    // Cập nhật màu và kích thước có sẵn mỗi khi sản phẩm thay đổi
    useEffect(() => {
        if (product && product.variants) {
            // Lấy danh sách các màu duy nhất
            const uniqueColors = [...new Set(product.variants.map(v => v.color))];
            setColors(uniqueColors);

            // Thiết lập màu mặc định
            if (uniqueColors.length > 0 && !selectedColor) {
                setSelectedColor(uniqueColors[0]);
            }
        }
    }, [product, selectedColor]);

    // Cập nhật kích thước dựa trên màu đã chọn
    useEffect(() => {
        if (product && product.variants && selectedColor) {
            // Lọc các kích thước dựa trên màu đã chọn
            const sizesForColor = product.variants
                .filter(v => v.color === selectedColor)
                .map(v => v.size);

            setSizes(sizesForColor);

            // Thiết lập kích thước mặc định
            if (sizesForColor.length > 0 && !selectedSize) {
                setSelectedSize(sizesForColor[0]);
            } else if (sizesForColor.length > 0 && !sizesForColor.includes(selectedSize)) {
                // Nếu kích thước hiện tại không có sẵn cho màu mới, đặt lại kích thước
                setSelectedSize(sizesForColor[0]);
            }
        }
    }, [product, selectedColor, selectedSize]);

    // Cập nhật biến thể đã chọn dựa trên màu và kích thước
    useEffect(() => {
        if (product && product.variants && selectedColor && selectedSize) {
            const variant = product.variants.find(v =>
                v.color === selectedColor && v.size === selectedSize
            );

            setSelectedVariant(variant || null);
        } else {
            setSelectedVariant(null);
        }
    }, [product, selectedColor, selectedSize]);

    // Kiểm tra nếu số lượng vượt quá tồn kho
    useEffect(() => {
        if (selectedVariant && quantity > selectedVariant.stockQuantity) {
            setQuantity(selectedVariant.stockQuantity);
        }
    }, [selectedVariant, quantity]);

    const handleColorChange = (color) => {
        setSelectedColor(color);
    };

    const handleSizeChange = (size) => {
        setSelectedSize(size);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        if (selectedVariant && quantity < selectedVariant.stockQuantity) {
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = () => {
        if (selectedVariant) {
            dispatch(addToCart({
                productId: product.id,
                variantId: selectedVariant.id,
                name: product.name,
                price: selectedVariant.finalPrice,
                image: product.image,
                color: selectedVariant.color,
                size: selectedVariant.size,
                quantity: quantity
            }));

            alert('Sản phẩm đã được thêm vào giỏ hàng!');
        }
    };

    const previousImage = () => {
        setActiveImageIndex((prev) =>
            prev === 0 ? (product.images.length - 1) : prev - 1
        );
    };

    const nextImage = () => {
        setActiveImageIndex((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Đã xảy ra lỗi: {error}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <p className="text-gray-600">Không tìm thấy sản phẩm.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Đường dẫn điều hướng */}
            <nav className="mb-8">
                <ol className="flex items-center space-x-1 text-sm text-gray-500">
                    <li>
                        <Link to="/" className="hover:text-blue-500">Trang chủ</Link>
                    </li>
                    <li>
                        <span className="mx-1">/</span>
                    </li>
                    <li>
                        <Link to="/products" className="hover:text-blue-500">Sản phẩm</Link>
                    </li>
                    <li>
                        <span className="mx-1">/</span>
                    </li>
                    <li>
                        <Link to={`/products?category=${product.categoryId}`} className="hover:text-blue-500">
                            {product.categoryName}
                        </Link>
                    </li>
                    <li>
                        <span className="mx-1">/</span>
                    </li>
                    <li className="text-gray-700 font-medium">
                        {product.name}
                    </li>
                </ol>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Hình ảnh sản phẩm */}
                <div>
                    <div className="relative h-80 md:h-96 lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden mb-4">
                        {product.images && product.images.length > 0 ? (
                            <>
                                <img
                                    src={product.images[activeImageIndex]}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                />

                                {/* Nút điều hướng */}
                                <button
                                    onClick={previousImage}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </button>

                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <img
                                src={product.image || 'https://via.placeholder.com/500x500?text=No+Image'}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>

                    {/* Các hình ảnh thu nhỏ */}
                    {product.images && product.images.length > 0 && (
                        <div className="grid grid-cols-5 gap-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImageIndex(index)}
                                    className={`h-16 md:h-20 border-2 rounded overflow-hidden ${
                                        index === activeImageIndex ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} - ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Thông tin sản phẩm */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>

                    <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className={`w-5 h-5 ${i < Math.floor(product.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <span className="ml-2 text-gray-600">{product.averageRating} ({product.reviewCount} đánh giá)</span>
                    </div>

                    <div className="mb-6">
                        <span className="text-2xl font-bold text-red-600">
                            {selectedVariant ? selectedVariant.finalPrice.toLocaleString('vi-VN') : product.basePrice.toLocaleString('vi-VN')} đ
                        </span>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <div className="mb-4">
                            <h2 className="text-sm font-medium text-gray-900 mb-2">Màu sắc</h2>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => handleColorChange(color)}
                                        className={`px-4 py-2 border rounded-md ${
                                            selectedColor === color
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-sm font-medium text-gray-900 mb-2">Kích thước</h2>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size) => {
                                    // Tìm biến thể tương ứng với màu và kích thước hiện tại
                                    const variant = product.variants.find(v => v.color === selectedColor && v.size === size);
                                    const isOutOfStock = variant && variant.stockQuantity === 0;

                                    return (
                                        <button
                                            key={size}
                                            onClick={() => !isOutOfStock && handleSizeChange(size)}
                                            disabled={isOutOfStock}
                                            className={`px-4 py-2 border rounded-md ${
                                                isOutOfStock
                                                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : selectedSize === size
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            {size}
                                            {isOutOfStock && ' (Hết hàng)'}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-sm font-medium text-gray-900 mb-2">Số lượng</h2>
                            <div className="flex items-center">
                                <button
                                    onClick={decreaseQuantity}
                                    disabled={quantity <= 1}
                                    className={`px-3 py-1 border border-r-0 rounded-l ${
                                        quantity <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100'
                                    }`}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedVariant?.stockQuantity || 1}
                                    value={quantity}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (!isNaN(value) && value >= 1 && (!selectedVariant || value <= selectedVariant.stockQuantity)) {
                                            setQuantity(value);
                                        }
                                    }}
                                    className="w-16 text-center border-t border-b"
                                />
                                <button
                                    onClick={increaseQuantity}
                                    disabled={!selectedVariant || quantity >= selectedVariant.stockQuantity}
                                    className={`px-3 py-1 border border-l-0 rounded-r ${
                                        !selectedVariant || quantity >= selectedVariant.stockQuantity
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    +
                                </button>

                                {selectedVariant && (
                                    <span className="ml-3 text-sm text-gray-500">
                                        Còn {selectedVariant.stockQuantity} sản phẩm
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mb-8">
                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
                                className={`w-full py-3 px-6 flex items-center justify-center rounded-md ${
                                    !selectedVariant || selectedVariant.stockQuantity === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                <ShoppingCartIcon className="w-5 h-5 mr-2" />
                                {!selectedVariant
                                    ? 'Vui lòng chọn biến thể'
                                    : selectedVariant.stockQuantity === 0
                                        ? 'Hết hàng'
                                        : 'Thêm vào giỏ hàng'
                                }
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <h2 className="text-lg font-medium mb-2">Thông tin sản phẩm</h2>
                        <div className="prose prose-sm max-w-none text-gray-600">
                            <p>{product.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phần đánh giá sản phẩm */}
            <div className="mt-12">
                <h2 className="text-xl font-bold mb-4">Đánh giá sản phẩm</h2>

                {product.reviewCount > 0 ? (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <p>Sẽ hiển thị đánh giá sản phẩm ở đây...</p>
                    </div>
                ) : (
                    <div className="bg-gray-100 rounded-lg p-6 text-center">
                        <p className="text-gray-600">Sản phẩm chưa có đánh giá.</p>
                        <button className="mt-2 text-blue-600 hover:text-blue-800">
                            Đánh giá sản phẩm này
                        </button>
                    </div>
                )}
            </div>

            {/* Sản phẩm liên quan */}
            <div className="mt-12">
                <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sẽ hiển thị sản phẩm liên quan ở đây */}
                    <div className="bg-gray-100 rounded-lg p-6 text-center">
                        <p className="text-gray-600">Sản phẩm liên quan sẽ hiển thị ở đây...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;