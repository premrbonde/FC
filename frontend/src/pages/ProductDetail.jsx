import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { formatPrice } from '../utils/formatCurrency';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, wishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/products/${id}`);
      setProduct(res.data.data);
      setSelectedColor(res.data.data.colors[0] || '');
      setSelectedSize(res.data.data.sizes[0] || '');

      // Fetch recommended based on category
      const recRes = await api.get(`/api/products/recommended/${res.data.data.category}`);
      setRecommended(recRes.data.data.filter(p => p._id !== id).slice(0, 10));
    } catch (error) {
      console.error('Error fetching product', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    if (!selectedColor || !selectedSize) return alert('Please select color and size');
    if (product.stock === 0) return alert('This product is out of stock');

    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity, selectedColor, selectedSize);
      alert('Added to cart!');
    } catch (error) {
      alert('Error adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) return navigate('/login');
    if (product.stock === 0) return alert('This product is out of stock');
    await handleAddToCart();
    navigate('/cart');
  };

  if (loading) return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!product) return <div className="min-h-screen bg-primary flex items-center justify-center text-white text-2xl font-light tracking-wider">Product not found</div>;

  return (
    <div className="bg-primary min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16 mb-24">

        {/* Left Side: Images */}
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col md:flex-row gap-4 h-[600px]">
            {/* Vertical Thumbnails (Desktop) */}
            <div className="hidden md:flex flex-col gap-4 w-24 overflow-y-auto pr-2 custom-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-full aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === idx ? 'border-accent opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-secondary rounded-2xl overflow-hidden relative group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Horizontal Thumbnails (Mobile) */}
            <div className="flex md:hidden gap-4 overflow-x-auto pb-2 snap-x">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-none w-20 aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 snap-center ${selectedImage === idx ? 'border-accent opacity-100' : 'border-transparent opacity-60'}`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <p className="text-accent text-sm font-bold tracking-widest uppercase mb-4">{product.companyName}</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">{product.name}</h1>
          <p className="text-3xl text-white font-medium mb-8 flex items-center gap-4">
            {formatPrice(product.price)}
            {product.isNewArrival && <span className="text-xs bg-white text-black px-3 py-1 rounded-full font-bold uppercase tracking-wider">New Season</span>}
          </p>

          <div className="w-full h-px bg-gray-800 mb-8"></div>

          <p className="text-gray-400 mb-10 leading-relaxed font-light text-lg">
            {product.description}
          </p>

          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 font-medium text-center">Out of Stock</p>
            </div>
          )}

          {/* Colors */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium text-sm uppercase tracking-wider">Select Color</h3>
              <span className="text-gray-400 text-sm">{selectedColor}</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-6 py-3 border rounded-full transition-all duration-300 text-sm font-medium ${
                    selectedColor === color
                      ? 'border-accent text-black bg-accent shadow-[0_0_15px_rgba(255,193,7,0.3)]'
                      : 'border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium text-sm uppercase tracking-wider">Select Size</h3>
              <button className="text-gray-400 text-sm underline hover:text-accent transition-colors">Size Guide</button>
            </div>
            <div className="flex gap-3 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 flex items-center justify-center border rounded-full transition-all duration-300 font-medium ${
                    selectedSize === size
                      ? 'border-accent text-black bg-accent shadow-[0_0_15px_rgba(255,193,7,0.3)]'
                      : 'border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className={`flex-1 py-5 rounded-full font-bold transition-all duration-300 uppercase tracking-widest text-sm ${
                product.stock === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-black'
              } disabled:opacity-50`}
            >
              {product.stock === 0 ? 'Out of Stock' : addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className={`flex-1 py-5 rounded-full font-bold transition-all duration-300 uppercase tracking-widest text-sm ${
                product.stock === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-accent text-black hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,193,7,0.4)]'
              } disabled:opacity-50`}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Buy It Now'}
            </button>
          </div>

          {/* Shipping Info */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400 border-t border-gray-800 pt-8">
            <div className="flex items-center gap-2"><span className="text-accent">✓</span> Free Shipping</div>
            <div className="flex items-center gap-2"><span className="text-accent">✓</span> 30-Day Returns</div>
            <div className="flex items-center gap-2"><span className="text-accent">✓</span> Secure Checkout</div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      {recommended.length > 0 && (
        <section className="border-t border-gray-900 pt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-white uppercase tracking-wider">You May Also Like</h2>
            <div className="w-16 h-1 bg-accent mx-auto mt-6"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {recommended.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
