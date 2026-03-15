import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { formatPrice } from '../utils/formatCurrency';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const isWishlisted = wishlist?.products?.some(p => (p._id || p) === product._id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      await toggleWishlist(product._id);
    } catch (error) {
      console.error('Error toggling wishlist', error);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');

    // Check if product has colors and sizes. If so, redirect to product details
    // since we need them selected before adding to cart from the listing page
    if (product.colors && product.sizes && (product.colors.length > 0 || product.sizes.length > 0)) {
        return navigate(`/products/${product._id}`);
    }

    // Otherwise, generic add to cart (fallback if no colors/sizes)
    try {
        await addToCart(product._id, 1, product.colors?.[0] || 'Default', product.sizes?.[0] || 'Default');
        alert('Added to cart!');
    } catch (error) {
        console.error('Error adding to cart', error);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-secondary rounded-xl overflow-hidden shadow-lg group relative border border-gray-800 flex flex-col"
    >
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden aspect-[3/4]">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          src={product.images[0] || 'https://via.placeholder.com/300x400?text=No+Image'}
          alt={product.name}
          className="object-cover w-full h-full"
        />
        {product.isNewArrival && (
          <span className="absolute top-3 left-3 bg-accent text-primary text-xs font-bold px-2 py-1 rounded">
            NEW
          </span>
        )}
      </Link>

      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 p-2 bg-primary bg-opacity-50 rounded-full text-white hover:text-accent hover:bg-opacity-100 transition-all z-10"
        aria-label="Add to wishlist"
      >
        <Heart
            size={20}
            className={`transition-colors ${isWishlisted ? 'fill-accent text-accent' : 'hover:fill-accent hover:text-accent'}`}
        />
      </button>

      <div className="p-5 flex flex-col flex-1">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-heading font-medium text-white mb-1 group-hover:text-accent transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="text-xl font-bold text-white">
            {formatPrice(product.price)}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="bg-accent text-primary px-4 py-2 rounded font-semibold text-sm hover:shadow-[0_0_15px_rgba(255,193,7,0.5)] transition-shadow"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
