import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { UploadCloud } from 'lucide-react';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '', companyName: 'FCmenswear', description: '', price: '', category: 'T-Shirts',
    colors: '', sizes: '', stock: 0, isNewArrival: false, images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const res = await api.get(`/api/products/${id}`);
          const p = res.data.data;
          setFormData({
            ...p,
            colors: p.colors.join(', '),
            sizes: p.sizes.join(', ')
          });
        } catch (error) {
          console.error('Error fetching product', error);
        } finally {
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImageUrls = formData.images;

      // If new images selected, upload them to Cloudinary
      if (imageFiles.length > 0) {
        const uploadData = new FormData();
        imageFiles.forEach(file => uploadData.append('images', file));

        const uploadRes = await api.post('/api/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        uploadedImageUrls = uploadRes.data.data;
      }

      if (uploadedImageUrls.length === 0) {
        alert('Please provide at least 1 image.');
        setLoading(false);
        return;
      }

      const productPayload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
        images: uploadedImageUrls
      };

      if (isEdit) {
        await api.put(`/api/admin/products/${id}`, productPayload);
        alert('Product updated successfully!');
      } else {
        await api.post('/api/admin/products', productPayload);
        alert('Product created successfully!');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product', error);
      alert('Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-accent py-20">Loading...</div>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-heading font-bold text-white mb-8">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

      <form onSubmit={handleSubmit} className="bg-secondary p-8 rounded-lg border border-gray-800 space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Product Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-primary border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Company Name</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full bg-primary border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-accent" />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full bg-primary border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-accent"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Price (₹)</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="w-full bg-primary border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Stock</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="w-full bg-primary border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-primary border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-accent">
              <option value="T-Shirts">T-Shirts</option>
              <option value="Shirts">Shirts</option>
              <option value="Pants">Pants</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Colors (comma separated)</label>
            <input type="text" name="colors" value={formData.colors} onChange={handleChange} placeholder="e.g. Red, Blue, Black" required className="w-full bg-primary border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Sizes (comma separated)</label>
            <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} placeholder="e.g. S, M, L, XL" required className="w-full bg-primary border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-accent" />
          </div>
        </div>

        <div className="flex items-center gap-3 py-2">
          <input type="checkbox" name="isNewArrival" id="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} className="w-5 h-5 accent-accent" />
          <label htmlFor="isNewArrival" className="text-white font-medium">Mark as New Arrival</label>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <label className="block text-gray-400 text-sm mb-2">Product Images (Max 5)</label>
          <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-accent transition-colors">
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <UploadCloud className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-white font-medium">Click or drag images to upload</p>
            <p className="text-gray-500 text-sm mt-1">{imageFiles.length > 0 ? `${imageFiles.length} files selected` : 'Select up to 5 images'}</p>
          </div>
          {isEdit && formData.images.length > 0 && imageFiles.length === 0 && (
             <p className="text-gray-400 text-sm mt-2">Currently keeping {formData.images.length} existing images.</p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="flex-1 bg-accent text-primary py-4 rounded font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="flex-1 bg-transparent border border-gray-700 text-white py-4 rounded font-bold hover:bg-gray-800 transition-colors">
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminProductForm;
