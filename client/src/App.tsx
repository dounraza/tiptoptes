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
  <div className="min-h-screen bg-black flex flex-col selection:bg-[#00ffff] selection:text-black">
    {/* Navigation */}
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-[#00ffff]/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-black text-white tracking-tighter italic hover:text-[#00ffff] transition-colors">
            IZY-FAST <span className="text-[#00ffff]">TOP UP</span>
          </Link>
          <div className="hidden md:flex gap-8">
            <Link to="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00ffff] hover:text-white transition-colors">Accueil</Link>
            <a href="#products" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-[#00ffff] transition-colors">Packs FF</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-[#00ffff] transition-colors">Support</a>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="p-3 text-gray-500 hover:text-[#00ffff] hover:bg-[#00ffff]/5 rounded-xl transition-all border border-transparent hover:border-[#00ffff]/20">
            <Search size={20} />
          </button>
          <Link to="/login" className="p-3 text-gray-500 hover:text-[#7000ff] hover:bg-[#7000ff]/5 rounded-xl transition-all border border-transparent hover:border-[#7000ff]/20" title="Admin">
            <User size={20} />
          </Link>
          <button className="md:hidden p-3 text-gray-500 hover:text-[#00ffff] rounded-xl transition-all border border-[#00ffff]/10">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>

    {/* Main Content */}
    <main className="flex-grow pt-20">
      <Hero />
      <ProductGrid />
    </main>

    {/* Footer */}
    <footer className="bg-[#050505] text-white py-20 px-8 border-t border-[#00ffff]/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ffff]/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-3xl font-black mb-8 tracking-tighter italic text-white uppercase">
            IZY-FAST <span className="text-[#00ffff]">TOP UP</span>
          </h2>
          <p className="text-gray-500 max-w-sm mb-8 font-bold text-sm tracking-widest leading-relaxed uppercase">
            VOTRE PARTENAIRE DE CONFIANCE POUR TOUTES VOS RECHARGES FREE FIRE À MADAGASCAR. SERVICE ULTRA-RAPIDE.
          </p>
          <div className="flex flex-wrap gap-3 mb-12">
            <span className="text-[10px] font-black bg-[#00ffff]/5 text-[#00ffff] border border-[#00ffff]/10 px-3 py-1.5 rounded-md tracking-widest uppercase">#FreeFire</span>
            <span className="text-[10px] font-black bg-[#7000ff]/5 text-[#7000ff] border border-[#7000ff]/10 px-3 py-1.5 rounded-md tracking-widest uppercase">#TopUpFF</span>
            <span className="text-[10px] font-black bg-[#00ffff]/5 text-[#00ffff] border border-[#00ffff]/10 px-3 py-1.5 rounded-md tracking-widest uppercase">#DiamantFF</span>
          </div>
        </div>
        <div>
          <h3 className="font-black mb-8 uppercase text-[10px] tracking-[0.4em] text-[#00ffff]">SERVICES</h3>
          <ul className="space-y-5 text-gray-500 text-[10px] font-black tracking-[0.2em] uppercase">
            <li><a href="#" className="hover:text-[#00ffff] transition-colors">RECHARGE UID</a></li>
            <li><a href="#" className="hover:text-[#00ffff] transition-colors">ABONNEMENTS</a></li>
            <li><a href="#" className="hover:text-[#00ffff] transition-colors">SUPPORT WHATSAPP</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-black mb-8 uppercase text-[10px] tracking-[0.4em] text-[#7000ff]">CONNECT</h3>
          <div className="flex gap-5">
            {[
              { label: 'FB', color: 'hover:bg-blue-600' },
              { label: 'WA', color: 'hover:bg-green-600' },
              { label: 'TT', color: 'hover:bg-pink-600' }
            ].map((social) => (
              <div key={social.label} className={`w-12 h-12 bg-black border border-white/5 rounded-xl flex items-center justify-center transition-all cursor-pointer text-[10px] font-black tracking-widest ${social.color} hover:border-transparent hover:scale-110 shadow-lg`}>
                {social.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-16 mt-20 border-t border-white/5 text-center text-gray-600 text-[9px] uppercase font-black tracking-[0.5em]">
        &copy; 2026 IZY-FAST TOP UP. SECURED GAMING INFRASTRUCTURE.
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
