import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/product/ProductCard';
import bannerService from '../../services/bannerService';

// API Base URL
const API_BASE_URL = 'http://localhost:8080';

// Hàm tạo URL đầy đủ cho ảnh
const getFullImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // Nếu đã là URL đầy đủ
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // Thêm đường dẫn truy cập ảnh
    return `${API_BASE_URL}/images/${imagePath}`;
};

// Dữ liệu mẫu
const sampleProducts = [
    {
        id: 1,
        name: "Áo thun nam basic",
        basePrice: 250000,
        image: "https://via.placeholder.com/300x300?text=T-Shirt"
    },
    {
        id: 2,
        name: "Quần jeans nữ rách gối",
        basePrice: 450000,
        image: "https://via.placeholder.com/300x300?text=Jeans"
    },
    {
        id: 3,
        name: "Áo khoác nữ dáng rộng",
        basePrice: 650000,
        image: "https://via.placeholder.com/300x300?text=Jacket"
    },
    {
        id: 4,
        name: "Giày thể thao nam",
        basePrice: 850000,
        image: "https://via.placeholder.com/300x300?text=Shoes"
    }
];

const Home = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [randomProducts, setRandomProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy dữ liệu mẫu mặc định nếu không có dữ liệu từ API
    const defaultBanners = [
        {
            id: 1,
            title: "Bộ sưu tập mới nhất 2025",
            description: "Khám phá xu hướng thời trang mới nhất",
            imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            linkToCategory: "/products?sortBy=createdAt-desc"
        },
        {
            id: 2,
            title: "Giảm giá đến 50%",
            description: "Ưu đãi đặc biệt cho các sản phẩm cao cấp",
            imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            linkToCategory: "/products?sortBy=discount-desc"
        },
        {
            id: 3,
            title: "Phụ kiện độc đáo",
            description: "Hoàn thiện phong cách với bộ sưu tập phụ kiện mới",
            imageUrl: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1530&q=80",
            linkToCategory: "/products?category=3"
        }
    ];

    // Danh mục sản phẩm
    const categories = [
        {
            id: 1,
            name: "Thời trang nam",
            description: "Áo thun, quần jeans, áo khoác và nhiều hơn nữa",
            image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
            link: "/products?category=1"
        },
        {
            id: 2,
            name: "Thời trang nữ",
            description: "Đầm, áo sơ mi, chân váy và nhiều hơn nữa",
            image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80",
            link: "/products?category=2"
        },
        {
            id: 3,
            name: "Phụ kiện",
            description: "Túi xách, mũ nón, thắt lưng và nhiều hơn nữa",
            image: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
            link: "/products?category=3"
        },
        {
            id: 4,
            name: "Giày dép",
            description: "Giày thể thao, giày cao gót, dép và nhiều hơn nữa",
            image: "https://images.unsplash.com/photo-1518049362265-d5b2a6b00b37?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
            link: "/products?category=4"
        }
    ];

    // Brand logos
    const brandLogos = [
        { id: 1, name: "Nike", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png", link: "/products?brand=1" },
        { id: 2, name: "Adidas", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/2560px-Adidas_Logo.svg.png", link: "/products?brand=2" },
        { id: 3, name: "Gucci", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/1960s_Gucci_Logo.svg/2560px-1960s_Gucci_Logo.svg.png", link: "/products?brand=3" },
        { id: 4, name: "Zara", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/1280px-Zara_Logo.svg.png", link: "/products?brand=4" },
        { id: 5, name: "H&M", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/2560px-H%26M-Logo.svg.png", link: "/products?brand=5" },
        { id: 6, name: "Uniqlo", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UNIQLO_logo.svg/1280px-UNIQLO_logo.svg.png", link: "/products?brand=6" }
    ];

    // Auto slide chuyển banner
    useEffect(() => {
        // Chỉ chạy auto slide khi có banner
        if (banners.length > 0) {
            const interval = setInterval(() => {
                setActiveSlide((current) => (current === banners.length - 1 ? 0 : current + 1));
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [banners.length]);

    // Fetch sản phẩm ngẫu nhiên và brands
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch banner từ API
                try {
                    const bannersResponse = await bannerService.getAllBanners();
                    console.log('Banners từ API:', bannersResponse);
                    // Chỉ lấy banner đang hoạt động (isActive=true) và sắp xếp theo displayOrder
                    const activeBanners = Array.isArray(bannersResponse) 
                        ? bannersResponse
                            .filter(banner => banner.isActive)
                            .sort((a, b) => a.displayOrder - b.displayOrder)
                        : [];
                    
                    setBanners(activeBanners.length > 0 ? activeBanners : defaultBanners);
                } catch (error) {
                    console.error('Lỗi khi tải banner, sử dụng dữ liệu mẫu:', error);
                    setBanners(defaultBanners);
                }

                // Fetch sản phẩm ngẫu nhiên
                const productsResponse = await axios.get('http://localhost:8080/api/products/random?limit=8');
                setRandomProducts(productsResponse.data.data || []);

                // Fetch brands từ API (hoặc sử dụng dữ liệu mẫu nếu API không có sẵn)
                try {
                    const brandsResponse = await axios.get('http://localhost:8080/api/brands/all');
                    setBrands(brandsResponse.data.data || brandLogos);
                } catch (error) {
                    console.error('Error fetching brands, using sample data:', error);
                    setBrands(brandLogos);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setRandomProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {/* Hero Banner Slider */}
            <div className="relative">
                <div className="overflow-hidden h-96 md:h-[500px]">
                    {banners.map((banner, index) => (
                        <div 
                            key={banner.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                                index === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50"></div>
                            <img 
                                src={getFullImageUrl(banner.imageUrl)} 
                                alt={banner.title} 
                                className="w-full h-full object-cover object-center"
                                onError={(e) => {
                                    console.error('Lỗi tải ảnh banner:', banner.imageUrl);
                                    e.target.src = 'https://via.placeholder.com/1400x500?text=Banner+Image';
                                }}
                            />
                            <div className="absolute inset-0 flex items-center">
                                <div className="container mx-auto px-4">
                                    <div className="max-w-md text-white">
                                        <h1 className="text-3xl md:text-5xl font-bold mb-4">{banner.title}</h1>
                                        <p className="text-lg md:text-xl mb-6">{banner.description || 'Xem sản phẩm ngay hôm nay'}</p>
                                        <Link 
                                            to={banner.linkToCategory} 
                                            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                                        >
                                            Xem ngay
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Banner navigation */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveSlide(index)}
                            className={`w-3 h-3 rounded-full ${
                                index === activeSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        ></button>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-2 text-center">Danh mục sản phẩm</h2>
                    <p className="text-gray-600 mb-8 text-center">Khám phá các danh mục sản phẩm đa dạng của chúng tôi</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map(category => (
                            <Link 
                                key={category.id} 
                                to={category.link}
                                className="group relative overflow-hidden rounded-lg shadow-lg h-64"
                            >
                                <img 
                                    src={category.image} 
                                    alt={category.name}
                                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                                    <p className="text-gray-200 text-sm mb-3">{category.description}</p>
                                    <span className="text-white text-sm font-medium underline group-hover:no-underline">
                                        Xem ngay
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Brands */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-2 text-center">Thương hiệu nổi bật</h2>
                    <p className="text-gray-600 mb-8 text-center">Khám phá các thương hiệu thời trang hàng đầu</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {brands.map(brand => (
                            <Link 
                                key={brand.id} 
                                to={`/products?brand=${brand.id}`}
                                className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center h-24 hover:shadow-md transition-shadow"
                            >
                                <img 
                                    src={brand.logoUrl} 
                                    alt={brand.name}
                                    className="max-h-12 max-w-full object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/150?text=No+Logo";
                                    }}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-2 text-center">Sản phẩm nổi bật</h2>
                    <p className="text-gray-600 mb-8 text-center">Khám phá các sản phẩm được yêu thích nhất</p>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : randomProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {randomProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-12">
                            Không có sản phẩm nào để hiển thị.
                        </div>
                    )}

                    <div className="text-center mt-10">
                        <Link 
                            to="/products" 
                            className="inline-block px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded hover:bg-blue-600 hover:text-white transition"
                        >
                            Xem tất cả sản phẩm
                        </Link>
                    </div>
                </div>
            </section>

            {/* Promo Section */}
            <section className="py-12 bg-blue-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <h2 className="text-3xl font-bold mb-4">Đăng ký nhận khuyến mãi</h2>
                            <p className="text-lg mb-6">Nhận thông tin về các chương trình khuyến mãi và sản phẩm mới nhất của chúng tôi.</p>
                            <form className="flex flex-col sm:flex-row gap-2">
                                <input 
                                    type="email" 
                                    placeholder="Nhập địa chỉ email của bạn" 
                                    className="px-4 py-3 rounded-md text-gray-900 flex-1"
                                />
                                <button 
                                    type="submit"
                                    className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-100"
                                >
                                    Đăng ký
                                </button>
                            </form>
                        </div>
                        <div className="md:w-5/12">
                            <img 
                                src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                                alt="Sales promotion" 
                                className="rounded-lg shadow-lg object-cover h-60 w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;