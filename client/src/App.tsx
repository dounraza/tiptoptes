import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import Login from './pages/Login';
import { ShoppingBag, Search, User, Menu, Settings } from 'lucide-react';

const ClientHome = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    {/* Navigation */}
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-black text-indigo-600 tracking-tighter italic">IZY-FAST TOP UP 💎</Link>
          <div className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors">Accueil</Link>
            <a href="#products" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">Collection</a>
            <a href="#" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">À propos</a>
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <Search size={20} />
          </button>
          <Link to="/login" className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors" title="Connexion">
            <User size={20} />
          </Link>
          <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>

    {/* Main Content */}
    <main className="flex-grow pt-16">
      <Hero />
      <ProductGrid />
    </main>

    {/* Footer */}
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-black mb-6 tracking-tighter italic text-indigo-400">IZY-FAST TOP UP 💎</h2>
          <p className="text-gray-400 max-w-sm mb-4 font-medium">
            Votre partenaire de confiance pour toutes vos recharges Free Fire à Madagascar. Service rapide et livraison garantie via UID.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-md">#FreeFire</span>
            <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-md">#TopUpFF</span>
            <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-md">#DiamantFF</span>
            <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-md">#GamingMG</span>
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-6 uppercase text-xs tracking-widest text-indigo-400">Services</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Recharge UID</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Abonnements</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Support WhatsApp</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-6 uppercase text-xs tracking-widest text-indigo-400">Suivez-nous</h3>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer text-xs font-bold">FB</div>
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer text-xs font-bold">WA</div>
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer text-xs font-bold">TT</div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-gray-800 text-center text-gray-500 text-[10px] uppercase font-bold tracking-widest">
        &copy; 2026 IZY-FAST TOP UP. Tous droits réservés.
      </div>
    </footer>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<ClientHome />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
