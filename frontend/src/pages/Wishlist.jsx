import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { wishlist, loading } = useContext(WishlistContext);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="bg-primary min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">My Wishlist</h1>
      <p className="text-gray-400 mb-10">{wishlist?.products?.length || 0} items saved</p>

      {loading ? (
        <div className="text-accent">Loading wishlist...</div>
      ) : wishlist?.products?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary rounded-lg">
          <p className="text-gray-400 text-lg mb-4">Your wishlist is empty.</p>
          <a href="/products" className="inline-block bg-accent text-primary px-6 py-2 rounded font-bold hover:bg-yellow-400 transition-colors">
            Explore Products
          </a>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
