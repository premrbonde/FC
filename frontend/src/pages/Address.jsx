import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Address = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    shippingAddress: '',
    deliveryAddress: '',
    pincode: '',
    district: '',
    taluka: '',
    town: '',
    country: '',
    isDefault: true
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/api/addresses');
      setAddresses(res.data.data);
      if (res.data.data.length === 0) setShowForm(true);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await api.put(`/api/addresses/${formData._id}`, formData);
      } else {
        await api.post('/api/addresses', formData);
      }
      setShowForm(false);
      fetchAddresses();
      setFormData({
        fullName: user?.name || '', phone: user?.phone || '', shippingAddress: '', deliveryAddress: '',
        pincode: '', district: '', taluka: '', town: '', country: '', isDefault: true
      });
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address.');
    }
  };

  const handleEdit = (addr) => {
    setFormData(addr);
    setShowForm(true);
  };

  const handleSelectAddress = (addr) => {
    // Navigate to checkout with selected address
    navigate('/checkout', { state: { selectedAddress: addr } });
  };

  if (loading) return <div className="min-h-screen bg-primary flex items-center justify-center text-accent">Loading...</div>;

  return (
    <div className="bg-primary min-h-screen pt-24 pb-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-10">Shipping Address</h1>

      {!showForm && (
        <div className="space-y-6 mb-8">
          {addresses.map(addr => (
            <div key={addr._id} className="bg-secondary p-6 rounded-lg border border-gray-700 relative">
              {addr.isDefault && <span className="absolute top-4 right-4 bg-accent/20 text-accent text-xs font-bold px-2 py-1 rounded">Default</span>}
              <h3 className="text-lg font-bold text-white mb-2">{addr.fullName} <span className="text-gray-400 font-normal ml-2">{addr.phone}</span></h3>
              <p className="text-gray-400 mb-1">{addr.shippingAddress}, {addr.deliveryAddress}</p>
              <p className="text-gray-400 mb-4">{addr.town}, {addr.taluka}, {addr.district}, {addr.country} - {addr.pincode}</p>

              <div className="flex gap-4">
                <button
                  onClick={() => handleSelectAddress(addr)}
                  className="bg-accent text-primary px-6 py-2 rounded font-bold hover:bg-yellow-400 transition-colors"
                >
                  Deliver Here
                </button>
                <button
                  onClick={() => handleEdit(addr)}
                  className="text-white border border-gray-600 px-6 py-2 rounded font-bold hover:bg-gray-800 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              setFormData({ fullName: '', phone: '', shippingAddress: '', deliveryAddress: '', pincode: '', district: '', taluka: '', town: '', country: '', isDefault: true });
              setShowForm(true);
            }}
            className="w-full py-4 border-2 border-dashed border-gray-700 text-gray-400 rounded-lg hover:text-accent hover:border-accent transition-colors font-bold"
          >
            + Add New Address
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-secondary p-6 rounded-lg">
          <h2 className="text-xl font-heading font-bold text-white mb-6">{formData._id ? 'Edit Address' : 'Add New Address'}</h2>
          <form onSubmit={handleSaveAddress} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required className="bg-primary text-white p-3 rounded border border-gray-700 w-full" />
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required className="bg-primary text-white p-3 rounded border border-gray-700 w-full" />
            </div>
            <textarea name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} placeholder="Shipping Address (House No, Building, Street, Area)" required className="bg-primary text-white p-3 rounded border border-gray-700 w-full h-24"></textarea>
            <input type="text" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} placeholder="Delivery Address (Landmark, etc.)" required className="bg-primary text-white p-3 rounded border border-gray-700 w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" required className="bg-primary text-white p-3 rounded border border-gray-700 w-full" />
              <input type="text" name="town" value={formData.town} onChange={handleChange} placeholder="Town/City" required className="bg-primary text-white p-3 rounded border border-gray-700 w-full" />
              <input type="text" name="taluka" value={formData.taluka} onChange={handleChange} placeholder="Taluka" required className="bg-primary text-white p-3 rounded border border-gray-700 w-full" />
              <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="District" required className="bg-primary text-white p-3 rounded border border-gray-700 w-full" />
              <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" required className="bg-primary text-white p-3 rounded border border-gray-700 w-full" />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" name="isDefault" id="isDefault" checked={formData.isDefault} onChange={handleChange} className="w-4 h-4 accent-accent" />
              <label htmlFor="isDefault" className="text-gray-400">Make this my default address</label>
            </div>

            <div className="flex gap-4 mt-8">
              <button type="submit" className="flex-1 bg-accent text-primary py-3 rounded font-bold hover:bg-yellow-400 transition-colors">
                Save Address
              </button>
              {addresses.length > 0 && (
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-transparent text-white border border-gray-700 py-3 rounded font-bold hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Address;
