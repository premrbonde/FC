import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: '', description: '', isActive: true });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setCurrentCategory(category);
    } else {
      setCurrentCategory({ name: '', description: '', isActive: true });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCategory({ name: '', description: '', isActive: true });
    setImageFile(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = currentCategory.imageUrl;

      // Upload image if user selected a new file
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('images', imageFile);
        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.data[0];
      }

      const payload = {
        name: currentCategory.name,
        description: currentCategory.description,
        isActive: currentCategory.isActive,
        imageUrl,
      };

      if (!payload.imageUrl) {
        throw new Error('Please upload an image for the category');
      }

      if (currentCategory._id) {
        await api.put(`/admin/categories/${currentCategory._id}`, payload);
      } else {
        await api.post('/admin/categories', payload);
      }

      fetchCategories();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  if (loading) return <div className="p-8 text-center text-white">Loading categories...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Categories</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6">{error}</div>}

      <div className="bg-secondary border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50 border-b border-gray-800">
              <th className="p-4 text-gray-400 font-medium">Image</th>
              <th className="p-4 text-gray-400 font-medium">Name</th>
              <th className="p-4 text-gray-400 font-medium">Description</th>
              <th className="p-4 text-gray-400 font-medium">Status</th>
              <th className="p-4 text-gray-400 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-b border-gray-800 hover:bg-gray-800/20 transition-colors">
                <td className="p-4">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-12 h-12 object-cover rounded-lg border border-gray-700" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
                      <ImageIcon size={20} />
                    </div>
                  )}
                </td>
                <td className="p-4 font-medium text-white">{cat.name}</td>
                <td className="p-4 text-gray-400 truncate max-w-xs">{cat.description}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${cat.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-end">
                  <button onClick={() => handleOpenModal(cat)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-secondary border border-gray-800 rounded-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{currentCategory._id ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Category Name</label>
                <input
                  type="text"
                  required
                  value={currentCategory.name}
                  onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                  className="w-full bg-primary text-white border border-gray-700 rounded-lg px-4 py-2 focus:border-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Description</label>
                <textarea
                  value={currentCategory.description}
                  onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                  className="w-full bg-primary text-white border border-gray-700 rounded-lg px-4 py-2 focus:border-accent outline-none min-h-[100px]"
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Category Image</label>
                {currentCategory.imageUrl && !imageFile && (
                  <img src={currentCategory.imageUrl} alt="Current" className="w-24 h-24 object-cover rounded-lg mb-2" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full text-gray-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-800 file:text-white hover:file:bg-gray-700"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={currentCategory.isActive}
                  onChange={(e) => setCurrentCategory({...currentCategory, isActive: e.target.checked})}
                  className="w-4 h-4 bg-primary border-gray-700 rounded focus:ring-accent accent-accent"
                />
                <label htmlFor="isActive" className="text-white text-sm">Active</label>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="bg-accent text-primary px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
