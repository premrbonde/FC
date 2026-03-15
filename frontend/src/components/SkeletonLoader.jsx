import React from 'react';
import { motion } from 'framer-motion';

const pulseAnimation = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

const ProductSkeleton = () => {
  return (
    <motion.div
      {...pulseAnimation}
      className="bg-secondary rounded-xl overflow-hidden shadow-lg"
    >
      {/* Image placeholder */}
      <div className="w-full aspect-[3/4] bg-gray-800"></div>

      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      </div>
    </motion.div>
  );
};

const CartSkeleton = () => {
  return (
    <motion.div {...pulseAnimation} className="flex items-center space-x-4 border-b border-gray-800 py-4">
      <div className="w-24 h-24 bg-gray-800 rounded-md"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      </div>
    </motion.div>
  );
};

const OrderSkeleton = () => {
  return (
    <motion.div {...pulseAnimation} className="bg-secondary p-4 rounded-lg mb-4">
      <div className="flex justify-between mb-2">
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      </div>
      <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-800 rounded w-1/2"></div>
    </motion.div>
  );
};

export { ProductSkeleton, CartSkeleton, OrderSkeleton };
