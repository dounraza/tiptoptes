import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ListOrdered, Home, Gamepad2, Layers, CreditCard, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/admin/products', icon: ShoppingBag, label: 'Produits' },
    { to: '/admin/orders', icon: ListOrdered, label: 'Commandes' },
  ];

  return (
    <div className="flex h-screen bg-[#000000] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#050505] flex flex-col border-r border-[#00ffff]/20">
        <div className="p-8">
          <h2 className="text-xl font-black tracking-tighter text-[#00ffff] italic uppercase">IZY-FAST TOP UP</h2>
        </div>
        
        <nav className="flex-grow px-4 space-y-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-bold rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#00ffff] text-black shadow-[0_0_15px_rgba(0,255,255,0.3)]' 
                    : 'text-gray-400 hover:text-[#00ffff] hover:bg-[#00ffff]/5'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6">
          <Link
            to="/"
            className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors w-full"
          >
            <LogOut size={20} />
            Logout (Boutique)
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-auto">
        <div className="p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
