import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Trash2, Edit, Plus } from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products?limit=100'); // Assuming admin needs to see all easily
      setProducts(res.data.data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      fetchProducts();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  if (loading) return <div className="text-accent py-20">Loading Products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-white">Product Management</h1>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded font-bold hover:bg-yellow-400 transition-colors"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-secondary rounded-lg border border-gray-800 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50 text-gray-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium border-b border-gray-700">Image</th>
              <th className="p-4 font-medium border-b border-gray-700">Name</th>
              <th className="p-4 font-medium border-b border-gray-700">Category</th>
              <th className="p-4 font-medium border-b border-gray-700">Price</th>
              <th className="p-4 font-medium border-b border-gray-700">Stock</th>
              <th className="p-4 font-medium border-b border-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {products.map((p) => (
              <tr key={p._id} className="border-b border-gray-700/50 hover:bg-gray-800/20 transition-colors">
                <td className="p-4">
                  <div className="w-12 h-16 bg-gray-800 rounded overflow-hidden">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4 text-gray-400">{p.category}</td>
                <td className="p-4 font-bold text-accent">{formatPrice(p.price)}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4 flex justify-end gap-3 items-center h-full pt-8">
                  <button onClick={() => navigate(`/admin/products/edit/${p._id}`)} className="text-blue-400 hover:text-blue-300">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-400">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
