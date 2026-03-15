import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, ShoppingBag, ShoppingCart, DollarSign } from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, sales: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/admin/dashboard');
      setStats(res.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-accent py-20">Loading Dashboard...</div>;

  const statCards = [
    { title: 'Total Sales', value: `${formatPrice(stats.sales)}`, icon: DollarSign, color: 'text-green-500' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-blue-500' },
    { title: 'Total Products', value: stats.products, icon: ShoppingBag, color: 'text-yellow-500' },
    { title: 'Total Users', value: stats.users, icon: Users, color: 'text-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-white mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-secondary p-6 rounded-lg border border-gray-800 flex items-center gap-4">
            <div className={`p-4 rounded-full bg-primary/50 ${card.color}`}>
              <card.icon size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
