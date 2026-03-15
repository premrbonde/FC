import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, Globe, EyeOff, LayoutTemplate } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminContentBlocks = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlock, setCurrentBlock] = useState({
    identifier: '',
    title: '',
    content: '',
    location: 'homepage_top',
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const res = await api.get('/api/content-blocks');
      setBlocks(res.data.data);
    } catch (err) {
      setError('Failed to fetch content blocks');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (block = null) => {
    if (block) {
      setCurrentBlock({
        ...block,
        location: block.location || 'homepage_top',
      });
    } else {
      setCurrentBlock({ identifier: '', title: '', content: '', location: 'homepage_top', isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBlock({ identifier: '', title: '', content: '', location: 'homepage_top', isActive: true });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (currentBlock._id) {
        await api.put(`/api/admin/content-blocks/${currentBlock._id}`, currentBlock);
      } else {
        await api.post('/api/admin/content-blocks', currentBlock);
      }

      fetchBlocks();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to save content block');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content block?')) return;
    try {
      await api.delete(`/api/admin/content-blocks/${id}`);
      fetchBlocks();
    } catch (err) {
      setError('Failed to delete content block');
    }
  };

  if (loading) return <div className="p-8 text-center text-white">Loading content blocks...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Content Blocks</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
        >
          <Plus size={20} /> Add Block
        </button>
      </div>

      {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6">{error}</div>}

      <div className="bg-secondary border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50 border-b border-gray-800">
              <th className="p-4 text-gray-400 font-medium">Identifier</th>
              <th className="p-4 text-gray-400 font-medium">Title</th>
              <th className="p-4 text-gray-400 font-medium">Location</th>
              <th className="p-4 text-gray-400 font-medium">Status</th>
              <th className="p-4 text-gray-400 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <tr key={block._id} className="border-b border-gray-800 hover:bg-gray-800/20 transition-colors">
                <td className="p-4 font-mono text-sm text-gray-300">{block.identifier}</td>
                <td className="p-4 font-medium text-white">{block.title || '-'}</td>
                <td className="p-4">
                  <span className="flex items-center gap-2 text-gray-400 text-sm bg-gray-800 px-2 py-1 rounded w-max">
                    <LayoutTemplate size={14} /> {block.location}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`flex items-center gap-1 w-max px-2 py-1 text-xs rounded-full ${block.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {block.isActive ? <><Globe size={12} /> Published</> : <><EyeOff size={12} /> Draft</>}
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-end">
                  <button onClick={() => handleOpenModal(block)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(block._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {blocks.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">No content blocks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-secondary border border-gray-800 rounded-xl w-full max-w-2xl my-8">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{currentBlock._id ? 'Edit Content Block' : 'Add Content Block'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Identifier (unique, e.g. about_us)</label>
                  <input
                    type="text"
                    required
                    value={currentBlock.identifier}
                    onChange={(e) => setCurrentBlock({...currentBlock, identifier: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                    className="w-full bg-primary text-white border border-gray-700 rounded-lg px-4 py-2 focus:border-accent outline-none font-mono"
                    disabled={!!currentBlock._id}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Location</label>
                  <select
                    value={currentBlock.location}
                    onChange={(e) => setCurrentBlock({...currentBlock, location: e.target.value})}
                    className="w-full bg-primary text-white border border-gray-700 rounded-lg px-4 py-2 focus:border-accent outline-none"
                  >
                    <option value="homepage_top">Homepage Top</option>
                    <option value="homepage_middle">Homepage Middle</option>
                    <option value="homepage_bottom">Homepage Bottom</option>
                    <option value="footer">Footer</option>
                    <option value="about_page">About Page</option>
                    <option value="custom">Custom Location</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Title (Optional)</label>
                <input
                  type="text"
                  value={currentBlock.title}
                  onChange={(e) => setCurrentBlock({...currentBlock, title: e.target.value})}
                  className="w-full bg-primary text-white border border-gray-700 rounded-lg px-4 py-2 focus:border-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Content (HTML or Text)</label>
                <textarea
                  required
                  value={currentBlock.content}
                  onChange={(e) => setCurrentBlock({...currentBlock, content: e.target.value})}
                  className="w-full bg-primary text-white border border-gray-700 rounded-lg px-4 py-2 focus:border-accent outline-none min-h-[200px] font-mono text-sm"
                ></textarea>
                <p className="text-gray-500 text-xs mt-1">You can write HTML directly in this field.</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={currentBlock.isActive}
                  onChange={(e) => setCurrentBlock({...currentBlock, isActive: e.target.checked})}
                  className="w-4 h-4 bg-primary border-gray-700 rounded focus:ring-accent accent-accent"
                />
                <label htmlFor="isActive" className="text-white text-sm">Published (Visible to users)</label>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-800">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="bg-accent text-primary px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Block'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminContentBlocks;
