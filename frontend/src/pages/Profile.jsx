import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { User, MapPin, Package, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [updateMsg, setUpdateMsg] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserData();
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    } else {
      navigate('/login');
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [ordersRes, addressRes] = await Promise.all([
        api.get('/orders/myorders'),
        api.get('/addresses')
      ]);
      setOrders(ordersRes.data.data || []);
      setAddresses(addressRes.data.data || []);
    } catch (error) {
      console.error('Error fetching profile data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Don't send empty string values - keep existing data when fields are blank
    const payload = {
      name: formData.name,
      email: formData.email,
    };
    if (formData.phone && formData.phone.trim()) {
      payload.phone = formData.phone;
    }

    try {
      setUpdateMsg('Updating...');
      const res = await api.put('/auth/updatedetails', payload);
      const updatedUser = res.data.data;

      // Update context/local storage so reload keeps the new data
      updateUser({
        ...user,
        name: updatedUser.name,
        phone: updatedUser.phone,
      });

      setFormData((prev) => ({
        ...prev,
        name: updatedUser.name || prev.name,
        phone: updatedUser.phone || prev.phone,
      }));

      setUpdateMsg('Profile updated successfully!');
      setTimeout(() => setUpdateMsg(''), 3000);
    } catch (error) {
      console.error('Profile update failed', error);
      setUpdateMsg('Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-heading font-bold text-white mb-8">My Account</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-secondary rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800 text-center">
              <div className="w-20 h-20 bg-primary rounded-full mx-auto flex items-center justify-center border border-gray-700 mb-4">
                <span className="text-2xl font-bold text-accent">{user?.name?.charAt(0)}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
            <nav className="p-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-primary text-accent border border-gray-700' : 'text-gray-300 hover:bg-gray-800'}`}
              >
                <User size={20} />
                <span>Profile Settings</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-primary text-accent border border-gray-700' : 'text-gray-300 hover:bg-gray-800'}`}
              >
                <Package size={20} />
                <span>My Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'addresses' ? 'bg-primary text-accent border border-gray-700' : 'text-gray-300 hover:bg-gray-800'}`}
              >
                <MapPin size={20} />
                <span>Addresses</span>
              </button>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors mt-4"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-secondary p-6 rounded-xl border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
              {updateMsg && <div className={`p-4 mb-6 rounded ${updateMsg.includes('success') ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>{updateMsg}</div>}

              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-primary text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-primary text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-accent"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-primary text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-accent"
                  />
                </div>
                <button type="submit" className="bg-accent text-primary px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
                  Save Changes
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-6">Order History</h2>
              {orders.length === 0 ? (
                <div className="bg-secondary p-12 text-center rounded-xl border border-gray-800">
                  <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl text-white mb-2">No orders yet</h3>
                  <p className="text-gray-400 mb-6">You haven't placed any orders.</p>
                  <button onClick={() => navigate('/products')} className="bg-accent text-primary px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-secondary border border-gray-800 rounded-xl p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-gray-800 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Order #{order._id}</p>
                          <p className="text-white font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-accent/20 text-accent'
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-xl font-bold text-white">₹{(order.totalPrice || 0).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {order.orderItems?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-primary p-3 rounded-lg border border-gray-800">
                            {item.image || item.product?.images?.[0] ? (
                              <img src={item.image || item.product.images[0]} alt={item.name || item.product?.name} className="w-16 h-16 object-cover rounded" />
                            ) : (
                              <div className="w-16 h-16 bg-gray-800 rounded"></div>
                            )}
                            <div>
                              <p className="text-sm text-white font-medium line-clamp-1">{item.name || item.product?.name || 'Product'}</p>
                              <p className="text-xs text-gray-400">Qty: {item.quantity} | Size: {item.size}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'addresses' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Saved Addresses</h2>
                <button onClick={() => navigate('/address')} className="text-accent hover:text-yellow-400 text-sm font-medium">
                  + Add New
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.length === 0 ? (
                  <p className="text-gray-400 col-span-2">No addresses found.</p>
                ) : (
                  addresses.map((address) => (
                    <div key={address._id} className="bg-secondary border border-gray-800 p-5 rounded-xl relative">
                      {address.isDefault && (
                        <span className="absolute top-4 right-4 bg-accent/20 text-accent text-xs px-2 py-1 rounded font-bold">Default</span>
                      )}
                      <h3 className="text-white font-bold mb-2">{address.fullName}</h3>
                      <p className="text-gray-400 text-sm mb-1">{address.shippingAddress}</p>
                      <p className="text-gray-400 text-sm mb-1">{address.town}, {address.district}</p>
                      <p className="text-gray-400 text-sm mb-1">{address.state}, {address.country} - {address.pincode}</p>
                      <p className="text-gray-400 text-sm mt-3 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                        </span>
                        {address.phone}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
