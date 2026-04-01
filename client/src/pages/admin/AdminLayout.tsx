import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ListOrdered, Home } from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
        <div className="p-6">
          <h2 className="text-2xl font-black tracking-tighter text-indigo-400 italic">IZY-FAST TOP UP ADMIN</h2>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            <LayoutDashboard size={20} />
            Tableau de bord
          </Link>
          <Link
            to="/admin/products"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ShoppingBag size={20} />
            Produits
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ListOrdered size={20} />
            Commandes
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <Home size={20} />
            Retour Boutique
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
