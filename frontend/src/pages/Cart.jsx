import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';
import api from '../services/api';

const Cart = () => {
  const { cart, loading, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();
  const [deliverySettings, setDeliverySettings] = useState({ baseCharge: 50, freeDeliveryThreshold: 500 });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/api/public/delivery-settings');
        if (res.data.success) {
          setDeliverySettings(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch delivery settings");
      }
    };
    fetchSettings();
  }, []);

  const subtotal = cart?.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
  const deliveryCharge = subtotal > deliverySettings.freeDeliveryThreshold ? 0 : deliverySettings.baseCharge;
  const total = subtotal + (cart?.items?.length > 0 ? deliveryCharge : 0);

  if (loading) return <div className="min-h-screen bg-primary flex items-center justify-center text-accent">Loading...</div>;

  return (
    <div className="bg-primary min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-10">Shopping Cart</h1>

      {cart?.items?.length === 0 ? (
        <div className="text-center py-20 bg-secondary rounded-lg">
          <p className="text-gray-400 text-lg mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-block bg-accent text-primary px-6 py-2 rounded font-bold hover:bg-yellow-400 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart Items */}
          <div className="w-full lg:w-2/3 space-y-6">
            {cart.items.map((item) => (
              <div key={item._id} className="bg-secondary p-4 rounded-lg flex gap-6 relative">
                <div className="w-24 h-32 shrink-0 bg-gray-800 rounded overflow-hidden">
                  <img src={item.product?.images?.[0]} alt={item.product?.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-heading font-bold text-white mb-1">{item.product?.name}</h3>
                  <p className="text-accent font-bold mb-2">{formatPrice(item.price)}</p>

                  <div className="text-gray-400 text-sm space-y-1 mb-4">
                    <p>Color: <span className="text-white">{item.color}</span></p>
                    <p>Size: <span className="text-white">{item.size}</span></p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-gray-700 rounded-md bg-primary">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-1 text-white font-medium border-x border-gray-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-400 transition-colors p-2"
                      title="Remove Item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-secondary p-6 rounded-lg sticky top-24">
              <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-gray-700 pb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery Charge</span>
                  <span className="text-white">{formatPrice(deliveryCharge)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-white border-t border-gray-700 pt-4 mb-8">
                <span>Total</span>
                <span className="text-accent">{formatPrice(total)}</span>
              </div>

              <button
                onClick={() => navigate('/address')}
                className="w-full bg-accent text-primary py-3 rounded font-bold hover:bg-yellow-400 transition-colors"
              >
                Proceed to Payment
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
