import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDelivery = () => {
  const [settings, setSettings] = useState({ baseCharge: '', freeDeliveryThreshold: '', chargePerKm: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/delivery-settings');
      setSettings(res.data.data);
    } catch (error) {
      console.error('Error fetching settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/delivery-settings', {
        baseCharge: Number(settings.baseCharge),
        freeDeliveryThreshold: Number(settings.freeDeliveryThreshold),
        chargePerKm: Number(settings.chargePerKm)
      });
      alert('Delivery settings updated successfully.');
    } catch (error) {
      alert('Failed to update delivery settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-accent py-20">Loading Settings...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-heading font-bold text-white mb-8">Delivery Settings</h1>

      <div className="bg-secondary p-8 rounded-lg border border-gray-800">
        <form onSubmit={handleSave} className="space-y-6">

          <div>
            <label className="block text-gray-400 text-sm mb-2">Base Delivery Charge (₹)</label>
            <p className="text-xs text-gray-500 mb-3">The default fixed amount charged for deliveries.</p>
            <input
              type="number"
              name="baseCharge"
              value={settings.baseCharge}
              onChange={handleChange}
              required
              className="w-full bg-primary border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Delivery Charge Per Kilometer (₹)</label>
            <p className="text-xs text-gray-500 mb-3">Dynamic rate added based on customer distance (if integrated with map API).</p>
            <input
              type="number"
              step="0.1"
              name="chargePerKm"
              value={settings.chargePerKm}
              onChange={handleChange}
              required
              className="w-full bg-primary border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Free Delivery Threshold (₹)</label>
            <p className="text-xs text-gray-500 mb-3">Order amount above which delivery charge is waived ($0).</p>
            <input
              type="number"
              name="freeDeliveryThreshold"
              value={settings.freeDeliveryThreshold}
              onChange={handleChange}
              required
              className="w-full bg-primary border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-accent"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent text-primary px-8 py-4 rounded font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminDelivery;
