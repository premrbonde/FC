import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-gray-900 mt-auto pt-16 pb-8 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-block text-3xl font-heading font-bold tracking-widest text-accent hover:scale-105 transition-transform">
              FC<span className="text-white font-light">menswear</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium menswear designed for the modern lifestyle. We blend classic styles with modern trends, ensuring you look sharp for any occasion.
            </p>
            <div className="flex space-x-4">
              <motion.a whileHover={{ y: -3, color: '#FFC107' }} href="#" className="text-gray-400 transition-colors">
                <Instagram size={20} />
              </motion.a>
              <motion.a whileHover={{ y: -3, color: '#FFC107' }} href="#" className="text-gray-400 transition-colors">
                <Facebook size={20} />
              </motion.a>
              <motion.a whileHover={{ y: -3, color: '#FFC107' }} href="#" className="text-gray-400 transition-colors">
                <Twitter size={20} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-6 text-white uppercase tracking-widest text-sm">Quick Links</h3>
            <ul className="space-y-4">
              {['Categories', 'New Arrivals', 'Orders', 'My Account'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-400 hover:text-accent transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-0 h-px bg-accent mr-0 transition-all duration-300 group-hover:w-4 group-hover:mr-2"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-6 text-white uppercase tracking-widest text-sm">Company</h3>
            <ul className="space-y-4">
              {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-400 hover:text-accent transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-0 h-px bg-accent mr-0 transition-all duration-300 group-hover:w-4 group-hover:mr-2"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-6 text-white uppercase tracking-widest text-sm">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400 text-sm">
                <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
                <span>123 Fashion Street, New York, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Phone size={18} className="text-accent flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Mail size={18} className="text-accent flex-shrink-0" />
                <span>support@fcmenswear.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} FCmenswear. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
