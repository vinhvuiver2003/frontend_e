import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';

const ProductDetail = () => {
  const [randomProducts, setRandomProducts] = useState([]);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        setIsLoadingRandom(true);
        const response = await axios.get('/api/products/random?limit=4');
        setRandomProducts(response.data);
      } catch (error) {
        console.error('Error fetching random products:', error);
      } finally {
        setIsLoadingRandom(false);
      }
    };

    fetchRandomProducts();
  }, []);

  return (
    <div>
      {!isLoadingRandom && randomProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Sản phẩm khác</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {randomProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group"
              >
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {formatPrice(product.basePrice)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail; 