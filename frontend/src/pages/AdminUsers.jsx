import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trash2, UserCheck } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (error) {
      console.error('Error fetching users', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (id) => {
    if (!window.confirm('Promote this user to Admin?')) return;
    try {
      await api.put(`/admin/users/${id}/promote`);
      alert('User promoted to admin.');
      fetchUsers();
    } catch (error) {
      alert('Failed to promote user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      alert('User deleted successfully.');
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  if (loading) return <div className="text-accent py-20">Loading Users...</div>;

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-white mb-8">User Management</h1>

      <div className="bg-secondary rounded-lg border border-gray-800 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50 text-gray-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium border-b border-gray-700">Name</th>
              <th className="p-4 font-medium border-b border-gray-700">Email</th>
              <th className="p-4 font-medium border-b border-gray-700">Role</th>
              <th className="p-4 font-medium border-b border-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-700/50 hover:bg-gray-800/20 transition-colors">
                <td className="p-4">{u.name}</td>
                <td className="p-4 text-gray-400">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-accent/20 text-accent' : 'bg-gray-700 text-gray-300'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-3">
                  {u.role !== 'admin' && (
                    <button onClick={() => handlePromote(u._id)} title="Promote to Admin" className="text-blue-400 hover:text-blue-300 transition-colors">
                      <UserCheck size={20} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(u._id)} title="Delete User" className="text-red-500 hover:text-red-400 transition-colors">
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

export default AdminUsers;
