import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UploadCloud, Trash2 } from 'lucide-react';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({ title: '', subtitle: '', linkUrl: '' });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await api.get('/api/admin/banners');
      setBanners(res.data.data);
    } catch (error) {
      console.error('Error fetching banners', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert('Please select an image file');
    if (banners.length >= 4) return alert('Maximum 4 banners allowed. Please delete one first.');

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('images', imageFile);

      const uploadRes = await api.post('/api/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const imageUrl = uploadRes.data.data[0];

      await api.post('/api/admin/banners', {
        ...formData,
        imageUrl
      });

      alert('Banner added successfully');
      setFormData({ title: '', subtitle: '', linkUrl: '' });
      setImageFile(null);
      fetchBanners();
    } catch (error) {
      console.error('Error uploading banner', error);
      alert(error.response?.data?.message || 'Failed to upload banner');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await api.delete(`/api/admin/banners/${id}`);
      fetchBanners();
    } catch (error) {
      alert('Failed to delete banner');
    }
  };

  if (loading) return <div className="text-accent py-20">Loading Banners...</div>;

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-white mb-8">Banner Management</h1>

      {/* Upload Form */}
      <div className="bg-secondary p-6 rounded-lg border border-gray-800 mb-12">
        <h2 className="text-xl font-bold text-white mb-6">Add New Banner (Max 4)</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Banner Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="bg-primary text-white border border-gray-700 p-3 rounded" />
            <input type="text" placeholder="Banner Subtitle" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="bg-primary text-white border border-gray-700 p-3 rounded" />
            <input type="text" placeholder="Link URL (e.g. /products?category=Shirts)" value={formData.linkUrl} onChange={(e) => setFormData({...formData, linkUrl: e.target.value})} className="bg-primary text-white border border-gray-700 p-3 rounded" />

            <div className="relative border border-gray-700 rounded bg-primary flex items-center px-3 cursor-pointer hover:border-accent">
              <input type="file" accept="image/*" onChange={handleFileChange} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <UploadCloud size={20} className="text-gray-400 mr-2" />
              <span className="text-gray-400 truncate">{imageFile ? imageFile.name : 'Select Desktop Banner Image'}</span>
            </div>
          </div>
          <button type="submit" disabled={uploading || banners.length >= 4} className="bg-accent text-primary px-8 py-3 rounded font-bold hover:bg-yellow-400 disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Save Banner'}
          </button>
          {banners.length >= 4 && <p className="text-red-500 text-sm mt-2">Maximum limit reached. Delete a banner to add a new one.</p>}
        </form>
      </div>

      {/* Current Banners Grid */}
      <h2 className="text-xl font-bold text-white mb-6">Current Banners ({banners.length}/4)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="relative rounded-lg overflow-hidden aspect-[21/9] border border-gray-800 group">
            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
              <h3 className="text-white font-heading font-bold text-xl mb-1">{banner.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{banner.subtitle}</p>
              <button onClick={() => handleDelete(banner._id)} className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBanners;
