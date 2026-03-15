import React, { useState } from 'react';
import api from '../services/api';
import { Search, Package, CheckCircle, Truck, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await api.get(`/orders/track/${orderId}`);
      setOrder(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Order not found. Please check your order ID.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = ['Pending', 'Processing', 'Accepted', 'Shipped', 'Out For Delivery', 'Delivered'];
    return steps.indexOf(status);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading font-bold text-white mb-4">Track Your Order</h1>
        <p className="text-gray-400">Enter your Order ID to see real-time updates on your shipment.</p>
      </div>

      <div className="bg-secondary p-6 md:p-8 rounded-xl border border-gray-800 shadow-2xl mb-8">
        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter Order ID (e.g. 65f3a...)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-primary text-white border border-gray-700 rounded-lg py-4 pl-12 pr-4 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-primary px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-colors disabled:opacity-70 whitespace-nowrap"
          >
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      {order && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-secondary border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Order #{order._id}</p>
              <h2 className="text-2xl font-bold text-white">Status: <span className="text-accent">{order.status}</span></h2>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">Order Date</p>
              <p className="text-white font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="p-6 md:p-8 border-b border-gray-800">
            {/* Tracking Timeline */}
            <div className="relative pt-8 pb-4">
              <div className="absolute top-12 left-0 w-full h-1 bg-gray-800 -z-10"></div>

              {order.status === 'Cancelled' ? (
                <div className="text-center text-red-500 font-bold text-xl py-4">This order has been cancelled.</div>
              ) : (
                <div className="flex justify-between items-center z-10">
                  {[
                    { label: 'Placed', icon: Package, status: 'Pending' },
                    { label: 'Processing', icon: CheckCircle, status: 'Processing' },
                    { label: 'Shipped', icon: Truck, status: 'Shipped' },
                    { label: 'Delivered', icon: MapPin, status: 'Delivered' }
                  ].map((step, idx) => {
                    const currentStep = getStatusStep(order.status);

                    let calculatedCompleted = false;
                    if (step.status === 'Pending') calculatedCompleted = currentStep >= 0;
                    if (step.status === 'Processing') calculatedCompleted = currentStep >= 1;
                    if (step.status === 'Shipped') calculatedCompleted = currentStep >= 3;
                    if (step.status === 'Delivered') calculatedCompleted = currentStep >= 5;

                    const isCompleted = calculatedCompleted;
                    const Icon = step.icon;

                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${isCompleted ? 'bg-accent text-primary shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'bg-gray-800 text-gray-500'}`}>
                          <Icon size={20} />
                        </div>
                        <span className={`text-xs md:text-sm font-medium ${isCompleted ? 'text-white' : 'text-gray-500'}`}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-primary p-3 rounded-lg border border-gray-800">
                    <img src={item.image || item.product?.images?.[0] || 'https://via.placeholder.com/64'} alt={item.name || item.product?.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium">{item.name || item.product?.name || 'Product'}</h4>
                      <p className="text-gray-400 text-xs">Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <div className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Shipping Details</h3>
              <div className="bg-primary p-5 rounded-lg border border-gray-800">
                <p className="text-white font-medium mb-1">{order.shippingAddress?.fullName}</p>
                <p className="text-gray-400 text-sm mb-1">{order.shippingAddress?.shippingAddress}</p>
                <p className="text-gray-400 text-sm mb-1">{order.shippingAddress?.town}, {order.shippingAddress?.district}</p>
                <p className="text-gray-400 text-sm">{order.shippingAddress?.country} - {order.shippingAddress?.pincode}</p>

                <div className="mt-6 pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Total Amount</span>
                    <span className="text-2xl font-bold text-accent">${(order.totalPrice || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Payment Status</span>
                    <span className="text-green-400 text-sm font-bold uppercase">{order.isPaid ? 'Paid' : 'Pending'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderTracking;
