import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const CancelOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const reasons = [
    'Changed my mind',
    'Ordered by mistake',
    'Found a better price elsewhere',
    'Delivery time is too long',
    'Other'
  ];

  const handleCancel = async (e) => {
    e.preventDefault();
    if (!reason) return alert('Please select a cancellation reason');

    setLoading(true);
    try {
      await api.put(`/orders/${id}/cancel`, { cancellationReason: reason });
      alert('Order cancelled successfully.');
      navigate(`/order-confirmation/${id}`);
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary min-h-screen pt-24 pb-16 px-4 max-w-2xl mx-auto flex items-center justify-center">
      <div className="bg-secondary p-8 rounded-lg w-full border border-gray-800">
        <h1 className="text-2xl font-heading font-bold text-white mb-6">Cancel Order</h1>
        <p className="text-gray-400 mb-6">Are you sure you want to cancel order <span className="text-white font-mono">{id}</span>? Please let us know why.</p>

        <form onSubmit={handleCancel} className="space-y-6">
          <div className="space-y-3">
            {reasons.map((r) => (
              <label key={r} className={`flex items-center p-4 border rounded cursor-pointer transition-colors ${reason === r ? 'border-accent bg-accent/10' : 'border-gray-700 hover:border-gray-500'}`}>
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-4 h-4 accent-accent mr-3"
                />
                <span className="text-white">{r}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !reason}
              className="flex-1 bg-red-500 text-white py-3 rounded font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Cancellation'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-transparent text-white border border-gray-700 py-3 rounded font-bold hover:bg-gray-800 transition-colors"
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelOrder;
