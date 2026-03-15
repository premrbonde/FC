import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/SkeletonLoader';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filters
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const { categoryName } = useParams();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryCat = params.get('category') || '';
    const initialCat = categoryName || queryCat;
    setCategory(initialCat);
    fetchProducts({ category: initialCat, color, minPrice, maxPrice, page: 1, reset: true });
  }, [location.search, categoryName]);

  const fetchProducts = async ({ category, color, minPrice, maxPrice, page, reset = false }) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      let query = `?page=${page}&limit=15`;
      if (category) query += `&category=${category}`;
      if (color) query += `&color=${color}`;
      if (minPrice) query += `&minPrice=${minPrice}`;
      if (maxPrice) query += `&maxPrice=${maxPrice}`;

      const res = await api.get(`/api/products${query}`);

      if (reset) {
        setProducts(res.data.data);
      } else {
        setProducts((prev) => [...prev, ...res.data.data]);
      }

      setHasMore(res.data.page < res.data.pages);
      setPage(res.data.page);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchProducts({ category, color, minPrice, maxPrice, page: 1, reset: true });
  };

  const loadMore = () => {
    fetchProducts({ category, color, minPrice, maxPrice, page: page + 1 });
  };

  return (
    <div className="bg-primary min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Filters Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-secondary p-6 rounded-lg sticky top-24">
            <h2 className="text-xl font-heading font-bold text-white mb-6">Filters</h2>

            <form onSubmit={applyFilters} className="space-y-6">
              {/* Category Filter */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-primary border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
                >
                  <option value="">All Categories</option>
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Shirts">Shirts</option>
                  <option value="Pants">Pants</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Color Filter */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Black, Red"
                  className="w-full bg-primary border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
                />
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Price Range (₹)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full bg-primary border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full bg-primary border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-accent text-primary font-bold py-2 rounded hover:bg-yellow-400 transition-colors"
              >
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-heading font-bold text-white">Products</h1>
            <p className="text-gray-400">{products.length} Items</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            ) : products.length > 0 ? (
              products.map((product) => <ProductCard key={product._id} product={product} />)
            ) : (
              <div className="col-span-full text-center py-20 text-gray-400">
                No products found matching your criteria.
              </div>
            )}
          </div>

          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="mt-12 text-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="bg-transparent border border-accent text-accent hover:bg-accent hover:text-primary font-bold py-3 px-8 rounded transition-colors disabled:opacity-50"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductList;
