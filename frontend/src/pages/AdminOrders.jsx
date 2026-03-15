import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle, Truck, Package, Check } from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/admin/orders');
      setOrders(res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error fetching orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (id) => {
    if (!window.confirm('Confirm this order and send email to user?')) return;
    try {
      await api.put(`/api/admin/orders/${id}/confirm`);
      alert('Order confirmed and email sent.');
      fetchOrders();
    } catch (error) {
      alert('Failed to confirm order');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/api/admin/orders/${id}/status`, { status });
      fetchOrders();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const toggleExpanded = (orderId) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'text-yellow-500 bg-yellow-500/10';
      case 'Shipped': return 'text-blue-500 bg-blue-500/10';
      case 'Delivered': return 'text-green-500 bg-green-500/10';
      case 'Cancelled': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) return <div className="text-accent py-20">Loading Orders...</div>;

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-white mb-8">Order Management</h1>

      <div className="bg-secondary rounded-lg border border-gray-800 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-800/50 text-gray-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium border-b border-gray-700">Order ID</th>
              <th className="p-4 font-medium border-b border-gray-700">Customer</th>
              <th className="p-4 font-medium border-b border-gray-700">Date</th>
              <th className="p-4 font-medium border-b border-gray-700">Total</th>
              <th className="p-4 font-medium border-b border-gray-700">Status</th>
              <th className="p-4 font-medium border-b border-gray-700">Items</th>
              <th className="p-4 font-medium border-b border-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <tr className="border-b border-gray-700/50 hover:bg-gray-800/20 transition-colors">
                  <td className="p-4 font-mono text-sm text-gray-400">{order._id.substring(0, 8)}...</td>
                  <td className="p-4">
                    <p className="font-medium">{order.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{order.user?.email || ''}</p>
                  </td>
                  <td className="p-4 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-accent">{formatPrice(order.totalPrice)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleExpanded(order._id)}
                      className="text-sm text-gray-300 hover:text-white underline"
                    >
                      {expandedOrders[order._id] ? 'Hide' : 'View'} items ({order.orderItems?.length || 0})
                    </button>
                  </td>
                  <td className="p-4 flex justify-end gap-3 items-center h-full pt-6">
                    {order.status === 'Processing' && (
                      <button
                        onClick={() => handleConfirmOrder(order._id)}
                        className="bg-accent text-primary px-4 py-1.5 rounded text-sm font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors"
                      >
                        <CheckCircle size={16} /> Confirm
                      </button>
                    )}
                    {order.status === 'Shipped' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'Out For Delivery')}
                        className="bg-blue-500 text-white px-4 py-1.5 rounded text-sm font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors"
                      >
                        <Truck size={16} /> Out For Delivery
                      </button>
                    )}
                    {order.status === 'Out For Delivery' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                        className="bg-green-500 text-white px-4 py-1.5 rounded text-sm font-bold flex items-center gap-2 hover:bg-green-600 transition-colors"
                      >
                        <Check size={16} /> Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
                {expandedOrders[order._id] && (
                  <tr className="bg-gray-900/60">
                    <td colSpan={7} className="p-4">
                      <div className="space-y-4">
                        {order.orderItems?.map((item, idx) => (
                          <div key={idx} className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <div className="w-20 h-20 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                              <img
                                src={item.product?.images?.[0] || item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-bold">{item.name}</p>
                              <p className="text-gray-400 text-sm">Size: {item.size} | Color: {item.color}</p>
                              <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                              <p className="text-gray-400 text-sm">Price: {formatPrice(item.price)}</p>
                              {typeof item.product?.stock === 'number' && (
                                <p className="text-gray-400 text-sm">Remaining stock: {item.product.stock}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
