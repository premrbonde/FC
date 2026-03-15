import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatPrice } from '../utils/formatCurrency';

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-primary flex items-center justify-center text-accent">Loading...</div>;
  if (!order) return <div className="min-h-screen bg-primary flex items-center justify-center text-white">Order not found.</div>;

  return (
    <div className="bg-primary min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
      <div className="bg-secondary p-8 rounded-lg shadow-xl border border-gray-800 text-center mb-8">
        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Order Confirmed!</h1>
        <p className="text-gray-400 mb-6">Thank you for your purchase. We've sent a confirmation email to {order.user.email}.</p>
        <div className="inline-block bg-primary px-6 py-3 rounded-md border border-gray-700">
          <span className="text-gray-400 text-sm block mb-1">Order ID</span>
          <span className="text-accent font-mono font-bold">{order._id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-secondary p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-heading font-bold text-white mb-4 border-b border-gray-700 pb-2">Delivery Details</h2>
          <p className="text-white font-medium mb-1">{order.shippingAddress.fullName}</p>
          <p className="text-gray-400 text-sm mb-1">{order.shippingAddress.shippingAddress}</p>
          <p className="text-gray-400 text-sm mb-1">{order.shippingAddress.town}, {order.shippingAddress.district}</p>
          <p className="text-gray-400 text-sm mb-3">{order.shippingAddress.pincode}</p>
          <p className="text-gray-400 text-sm">Phone: {order.shippingAddress.phone}</p>
        </div>

        <div className="bg-secondary p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-heading font-bold text-white mb-4 border-b border-gray-700 pb-2">Payment Details</h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Method</span>
            <span className="text-white font-medium">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Items Total</span>
            <span className="text-white">{formatPrice(order.itemsPrice)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-400">Delivery</span>
            <span className="text-white">{formatPrice(order.deliveryCharge)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-700">
            <span className="text-white font-bold">Total Paid</span>
            <span className="text-accent font-bold">{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </div>

      <div className="bg-secondary p-6 rounded-lg border border-gray-800 mb-8">
        <h2 className="text-xl font-heading font-bold text-white mb-4 border-b border-gray-700 pb-2">Order Items</h2>
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div key={item._id} className="flex gap-4 items-center">
              <div className="w-16 h-20 bg-gray-800 rounded overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{item.name}</h3>
                <p className="text-gray-400 text-sm">Qty: {item.quantity} | Color: {item.color} | Size: {item.size}</p>
              </div>
              <div className="text-white font-bold">{formatPrice((item.price * item.quantity))}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/')}
          className="bg-accent text-primary px-8 py-3 rounded font-bold hover:bg-yellow-400 transition-colors"
        >
          Return Home
        </button>
        {order.status !== 'Cancelled' && (
          <button
            onClick={() => navigate(`/cancel-order/${order._id}`)}
            className="bg-transparent text-red-500 border border-red-500 px-8 py-3 rounded font-bold hover:bg-red-500 hover:text-white transition-colors"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
