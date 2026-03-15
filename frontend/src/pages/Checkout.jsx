import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../services/api';
import { formatPrice } from '../utils/formatCurrency';

const Checkout = () => {
  const { cart, fetchCart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedAddress = location.state?.selectedAddress;

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [deliverySettings, setDeliverySettings] = useState({ baseCharge: 50, freeDeliveryThreshold: 500 });

  useEffect(() => {
    if (!selectedAddress) {
      navigate('/address');
    }
  }, [selectedAddress, navigate]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/public/delivery-settings');
        if (res.data.success) {
          setDeliverySettings(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch delivery settings");
      }
    };
    fetchSettings();
  }, []);

  if (!selectedAddress) return null;
  if (cart?.items?.length === 0) return <Navigate to="/cart" />;

  const subtotal = cart?.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
  const deliveryCharge = subtotal > deliverySettings.freeDeliveryThreshold ? 0 : deliverySettings.baseCharge;
  const total = subtotal + deliveryCharge;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cart.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images[0],
          price: item.price,
          quantity: item.quantity,
          color: item.color,
          size: item.size
        })),
        shippingAddress: selectedAddress._id,
        paymentMethod,
        itemsPrice: subtotal,
        deliveryCharge,
        totalPrice: total
      };

      const res = await api.post('/orders', orderData);
      await fetchCart(); // Refresh cart to show empty
      navigate(`/order-confirmation/${res.data.data._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-10">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Address & Payment */}
        <div className="w-full lg:w-2/3 space-y-8">

          {/* Delivery Address Review */}
          <div className="bg-secondary p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-heading font-bold text-white">Delivery Address</h2>
              <button onClick={() => navigate('/address')} className="text-accent text-sm hover:underline">Change</button>
            </div>
            <p className="text-white font-bold mb-1">{selectedAddress.fullName} <span className="text-gray-400 font-normal ml-2">{selectedAddress.phone}</span></p>
            <p className="text-gray-400">{selectedAddress.shippingAddress}, {selectedAddress.town}, {selectedAddress.district}, {selectedAddress.pincode}</p>
          </div>

          {/* Payment Options */}
          <div className="bg-secondary p-6 rounded-lg">
            <h2 className="text-xl font-heading font-bold text-white mb-6">Payment Method</h2>

            <div className="space-y-4">
              {['UPI', 'Card', 'Cash on Delivery'].map((method) => (
                <label key={method} className={`flex items-center p-4 border rounded cursor-pointer transition-colors ${paymentMethod === method ? 'border-accent bg-accent/10' : 'border-gray-700 hover:border-gray-500'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 accent-accent mr-4"
                  />
                  <span className="text-white font-medium">{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-secondary p-6 rounded-lg sticky top-24">
            <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-gray-700 pb-4">Order Summary</h2>

            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {cart.items.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <div className="text-gray-400 flex-1 pr-4">
                    <span className="text-white">{item.quantity}x</span> {item.product.name}
                  </div>
                  <div className="text-white">{formatPrice((item.price * item.quantity))}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-6 border-t border-gray-700 pt-4">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery Charge</span>
                <span className="text-white">{formatPrice(deliveryCharge)}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold text-white border-t border-gray-700 pt-4 mb-8">
              <span>Total to Pay</span>
              <span className="text-accent">{formatPrice(total)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-accent text-primary py-4 rounded font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 text-lg"
            >
              {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
