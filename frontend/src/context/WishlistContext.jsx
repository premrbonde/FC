import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist({ products: [] });
    }
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await api.get('/wishlist');
      setWishlist(res.data.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      const res = await api.post('/wishlist/toggle', { productId });
      setWishlist(res.data.data);
      return res.data;
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      throw error;
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
