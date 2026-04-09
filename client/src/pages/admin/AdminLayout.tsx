import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ListOrdered, LogOut, Menu, X, User } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/admin/products', icon: ShoppingBag, label: 'Produits' },
    { to: '/admin/orders', icon: ListOrdered, label: 'Commandes' },
    { to: '/admin/password', icon: User, label: 'Mot de passe' },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-[#000000] text-white overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#050505] border-b border-[#00ffff]/20 flex items-center justify-between px-6 z-50">
        <h2 className="text-sm font-black tracking-tighter text-[#00ffff] italic uppercase text-center">RECHARGE DIAM'S</h2>
        <button onClick={toggleSidebar} className="p-2 text-[#00ffff]">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#050505] flex flex-col border-r border-[#00ffff]/20 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 hidden lg:block">
          <h2 className="text-xl font-black tracking-tighter text-[#00ffff] italic uppercase">RECHARGE DIAM'S</h2>
        </div>
        
        <nav className="flex-grow px-4 space-y-4 mt-20 lg:mt-0">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsSidebarOpen(false)}
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

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-grow overflow-auto pt-16 lg:pt-0">
        <div className="p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
