import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'T-Shirts', path: '/category/T-Shirts' },
    { name: 'Shirts', path: '/category/Shirts' },
    { name: 'Pants', path: '/category/Pants' },
    { name: 'Others', path: '/category/Others' },
    { name: 'Track Order', path: '/track-order' },
  ];

  return (
    <nav className="bg-black/70 backdrop-blur-md text-white sticky top-0 z-50 border-b border-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-3xl font-heading font-bold tracking-widest text-accent hover:scale-105 transition-transform">
              FC<span className="text-white font-light">menswear</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="group relative text-gray-300 hover:text-white px-2 py-2 text-sm font-medium transition-colors duration-300 uppercase tracking-widest"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    type="text"
                    placeholder="Search..."
                    className="absolute right-8 bg-secondary/80 text-white text-sm rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-accent border border-gray-700"
                  />
                )}
              </AnimatePresence>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-300 hover:text-accent transition-colors"
              >
                <Search size={22} />
              </motion.button>
            </div>

            <Link to="/wishlist" className="text-gray-300 hover:text-accent transition-colors relative">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Heart size={22} />
              </motion.div>
            </Link>

            <Link to="/cart" className="text-gray-300 hover:text-accent transition-colors relative">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ShoppingCart size={22} />
              </motion.div>
            </Link>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center text-gray-300 hover:text-accent transition-colors"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User size={22} />
                </motion.button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-48 bg-secondary border border-gray-800 rounded-md shadow-2xl py-1 z-10 flex flex-col overflow-hidden"
                    >
                      <Link to="/profile" className="block px-4 py-3 text-sm text-gray-300 hover:bg-black hover:text-accent transition-colors" onClick={() => setIsUserMenuOpen(false)}>Profile</Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-3 text-sm text-gray-300 hover:bg-black hover:text-accent transition-colors" onClick={() => setIsUserMenuOpen(false)}>Admin Dashboard</Link>
                      )}
                      <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-black hover:text-accent transition-colors">Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="text-gray-300 hover:text-accent transition-colors">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <User size={22} />
                </motion.div>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-300 hover:text-accent">
              <Search size={20} />
            </button>
            <Link to="/cart" className="text-gray-300 hover:text-accent">
              <ShoppingCart size={20} />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-accent focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expand */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden py-2"
            >
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-secondary text-white text-sm rounded-md py-2 px-4 focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-secondary"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-300 hover:text-accent hover:bg-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-gray-700 pt-4 pb-2">
                <Link to="/wishlist" className="flex items-center text-gray-300 hover:text-accent px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                  <Heart size={20} className="mr-3" /> Wishlist
                </Link>
                {user ? (
                  <>
                    <Link to="/profile" className="flex items-center text-gray-300 hover:text-accent px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                      <User size={20} className="mr-3" /> Profile
                    </Link>
                    <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center w-full text-left text-gray-300 hover:text-accent px-3 py-2 rounded-md text-base font-medium">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="flex items-center text-gray-300 hover:text-accent px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                    <User size={20} className="mr-3" /> Login / Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
