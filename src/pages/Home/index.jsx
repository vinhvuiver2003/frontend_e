import React from 'react';
import ProductCard from '../../components/product/ProductCard';

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
    return (
        <div>
            {/* Banner */}
            <div className="bg-blue-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Fashion Store</h1>
                    <p className="text-xl mb-8">Khám phá bộ sưu tập thời trang mới nhất năm 2025</p>
                    <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                        Mua sắm ngay
                    </button>
                </div>
            </div>

            {/* Featured Products */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Sản phẩm nổi bật</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sampleProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Danh mục sản phẩm</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-xl font-semibold mb-2">Thời trang nam</h3>
                            <p className="text-gray-600 mb-4">Áo thun, quần jeans, áo khoác và nhiều hơn nữa</p>
                            <button className="text-blue-600 font-semibold hover:underline">Xem ngay</button>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-xl font-semibold mb-2">Thời trang nữ</h3>
                            <p className="text-gray-600 mb-4">Đầm, áo sơ mi, chân váy và nhiều hơn nữa</p>
                            <button className="text-blue-600 font-semibold hover:underline">Xem ngay</button>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-xl font-semibold mb-2">Phụ kiện</h3>
                            <p className="text-gray-600 mb-4">Túi xách, mũ nón, thắt lưng và nhiều hơn nữa</p>
                            <button className="text-blue-600 font-semibold hover:underline">Xem ngay</button>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-xl font-semibold mb-2">Giày dép</h3>
                            <p className="text-gray-600 mb-4">Giày thể thao, giày cao gót, dép và nhiều hơn nữa</p>
                            <button className="text-blue-600 font-semibold hover:underline">Xem ngay</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;