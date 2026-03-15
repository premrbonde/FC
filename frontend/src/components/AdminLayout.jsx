import React, { useContext } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, ShoppingCart, Image as ImageIcon, Truck, Layers, LayoutTemplate } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen bg-primary flex items-center justify-center text-accent">Loading...</div>;

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminLayout = () => {
  const { user } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Banners', path: '/admin/banners', icon: ImageIcon },
    { name: 'Content Blocks', path: '/admin/content-blocks', icon: LayoutTemplate },
    { name: 'Delivery Settings', path: '/admin/delivery', icon: Truck },
  ];

  return (
    <div className="bg-primary min-h-screen pt-20 px-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0 mb-8 md:mb-0">
        <div className="bg-secondary p-6 rounded-lg sticky top-24 border border-gray-800">
          <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-gray-700 pb-4">
            Admin Panel
            <span className="block text-sm text-gray-400 font-normal mt-1">Welcome, {user?.name}</span>
          </h2>
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    isActive
                      ? 'bg-accent text-primary font-bold'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
    </div>
  );
};

export { AdminRoute, AdminLayout };
