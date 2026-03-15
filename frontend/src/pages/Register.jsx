import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    shippingAddress: '',
    deliveryAddress: '',
    pincode: '',
    district: '',
    taluka: '',
    town: '',
    country: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {
    name,
    email,
    phone,
    password,
    shippingAddress,
    deliveryAddress,
    pincode,
    district,
    taluka,
    town,
    country,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const inputClassName = "appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-primary text-white placeholder-gray-500 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm transition-colors";
  const labelClassName = "block text-sm font-medium text-gray-300";

  return (
    <div className="min-h-screen bg-primary flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-heading font-extrabold text-white">
          Create an account
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl mb-12"
      >
        <div className="bg-secondary py-8 px-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] sm:rounded-lg sm:px-10 border border-gray-800">
          {error && (
            <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClassName}>Full Name</label>
                <div className="mt-1">
                  <input name="name" type="text" required value={name} onChange={onChange} className={inputClassName} />
                </div>
              </div>

              <div>
                <label className={labelClassName}>Email</label>
                <div className="mt-1">
                  <input name="email" type="email" required value={email} onChange={onChange} className={inputClassName} />
                </div>
              </div>

              <div>
                <label className={labelClassName}>Phone Number</label>
                <div className="mt-1">
                  <input name="phone" type="text" required value={phone} onChange={onChange} className={inputClassName} />
                </div>
              </div>

              <div>
                <label className={labelClassName}>Password</label>
                <div className="mt-1">
                  <input name="password" type="password" required value={password} onChange={onChange} className={inputClassName} />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClassName}>Shipping Address</label>
                <div className="mt-1">
                  <input name="shippingAddress" type="text" required value={shippingAddress} onChange={onChange} className={inputClassName} />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClassName}>Delivery Address</label>
                <div className="mt-1">
                  <input name="deliveryAddress" type="text" required value={deliveryAddress} onChange={onChange} className={inputClassName} />
                </div>
              </div>

              <div>
                <label className={labelClassName}>Town</label>
                <div className="mt-1">
                  <input name="town" type="text" required value={town} onChange={onChange} className={inputClassName} />
                </div>
              </div>

              <div>
                <label className={labelClassName}>Taluka</label>
                <div className="mt-1">
                  <input name="taluka" type="text" required value={taluka} onChange={onChange} className={inputClassName} />
                </div>
              </div>

              <div>
                <label className={labelClassName}>District</label>
                <div className="mt-1">
                  <input name="district" type="text" required value={district} onChange={onChange} className={inputClassName} />
                </div>
              </div>

              <div>
                <label className={labelClassName}>Pincode</label>
                <div className="mt-1">
                  <input name="pincode" type="text" required value={pincode} onChange={onChange} className={inputClassName} />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClassName}>Country</label>
                <div className="mt-1">
                  <input name="country" type="text" required value={country} onChange={onChange} className={inputClassName} />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0px 0px 8px rgb(255,193,7)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-primary bg-accent hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-secondary transition-all"
              >
                Register
              </motion.button>
            </div>

            <div className="mt-6 text-center border-t border-gray-800 pt-6">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-accent hover:text-yellow-300 transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
