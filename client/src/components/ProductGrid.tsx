import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { productApi, orderApi } from '../lib/api';
import { Smartphone, Info, Hash, Zap, X, ShieldCheck, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

const categories = ['Tout', 'LEVEL UP', 'TOP UP BONUS', 'ABONNEMENT'];

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tout');
  
  // Modal & Notification State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', uid: '', pseudo: '', reference: '' });
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const triggerOrder = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowModal(true);
    }
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        client_name: formData.name || formData.pseudo,
        client_email: formData.email,
        phone: formData.phone,
        uid_game: formData.uid,
        pseudo_game: formData.pseudo,
        payment_ref: formData.reference,
        total_amount: selectedProduct.price,
        items: [
          {
            product_id: selectedProduct.id,
            product_name: selectedProduct.name,
            quantity: 1,
            price: selectedProduct.price
          }
        ]
      };

      await orderApi.createOrder(orderData);
      
      setNotification({ type: 'success', message: `TOP-UP EN COURS POUR ${formData.pseudo.toUpperCase()} !` });
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', uid: '', pseudo: '', reference: '' });
    } catch (error) {
      setNotification({ type: 'error', message: "ERREUR SYSTÈME. CONTACTEZ LE SUPPORT." });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const filteredProducts = activeCategory === 'Tout' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="products" className="py-24 px-6 max-w-7xl mx-auto relative bg-black">
      {/* Promotional Title */}
      <div className="mb-24 text-center">
        <div className="inline-block py-2 px-6 mb-8 rounded-xl bg-[#00ffff]/10 border border-[#00ffff]/20 text-[#00ffff] text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(0,255,255,0.1)]">
          ⚡ SECURED TRANSACTION SYSTEM ⚡
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter leading-tight uppercase italic drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          ACHAT DIAMANT <span className="text-[#00ffff]">FREE FIRE</span> VIA UID
        </h2>
      </div>

      {/* Personalized Notification */}
      {notification && (
        <div className={`fixed top-24 right-6 z-[100] p-6 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border backdrop-blur-xl animate-in slide-in-from-right duration-300 ${
          notification.type === 'success' ? 'bg-black border-[#00ffff]/30 text-[#00ffff]' : 'bg-black border-red-500/30 text-red-500'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full animate-pulse ${notification.type === 'success' ? 'bg-[#00ffff] shadow-[0_0_10px_#00ffff]' : 'bg-red-500 shadow-[0_0_10px_#f00]'}`}></div>
            <p className="font-black text-[10px] uppercase tracking-[0.2em]">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Payment Info Box */}
      <div className="mb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="bg-[#050505] border border-[#00ffff]/10 rounded-[3rem] p-10 sm:p-16 shadow-2xl max-w-5xl mx-auto relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00ffff]/5 blur-[100px] -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7000ff]/5 blur-[100px] -ml-40 -mb-40"></div>
          
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="p-3 bg-[#00ffff]/10 border border-[#00ffff]/20 rounded-xl text-[#00ffff] shadow-[0_0_20px_rgba(0,255,255,0.1)]">
              <Smartphone size={24} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-[0.2em] uppercase italic">PROTOCOLE DE PAIEMENT</h2>
          </div>
          
          <p className="text-gray-500 text-[10px] font-black tracking-[0.3em] mb-12 uppercase flex items-center gap-3 relative z-10">
            <Info size={16} className="text-[#00ffff]" />
            EFFECTUEZ LE TRANSFERT AVANT DE REMPLIR LE FORMULAIRE :
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16 relative z-10">
            {/* MVOLA Card */}
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-amber-500/50 transition-all group/card shadow-xl">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center p-3 transition-transform group-hover/card:scale-110">
                  <span className="font-black text-amber-500 text-[10px] tracking-widest uppercase italic">MVOLA</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">RECEPTIONIST</span>
                  <span className="text-2xl font-black text-white tracking-widest group-hover/card:text-amber-500 transition-colors">034 78 711 39</span>
                  <span className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest mt-1">JOSIANE</span>
                </div>
              </div>
            </div>

            {/* ORANGE Card */}
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-orange-500/50 transition-all group/card shadow-xl">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center p-3 transition-transform group-hover/card:scale-110">
                  <span className="font-black text-orange-500 text-[10px] tracking-widest uppercase italic">ORANGE</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">RECEPTIONIST</span>
                  <span className="text-2xl font-black text-white tracking-widest group-hover/card:text-orange-500 transition-colors">037 78 391 76</span>
                  <span className="text-[10px] font-black text-orange-500/60 uppercase tracking-widest mt-1">MICKAEL</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#00ffff]/5 border border-[#00ffff]/10 text-[#00ffff] rounded-2xl p-6 flex items-center gap-5 shadow-inner relative z-10">
            <div className="w-12 h-12 rounded-full bg-[#00ffff]/10 border border-[#00ffff]/20 flex items-center justify-center shrink-0">
              <Zap size={20} className="fill-current" />
            </div>
            <p className="text-[10px] font-black tracking-[0.2em] uppercase leading-relaxed">
              RÉCUPÉREZ LA <span className="text-white">RÉFÉRENCE</span> DE TRANSACTION PUIS INITIALISEZ VOTRE COMMANDE CI-DESSOUS.
            </p>
          </div>
        </div>
      </div>

      {/* Editorial Header */}
      <div className="mb-24 flex flex-col items-center text-center">
        <h2 className="text-5xl font-black text-white sm:text-7xl tracking-tighter mb-12 uppercase italic">
          NOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] to-[#7000ff]">OFFRES</span> PACKS
        </h2>
        
        {/* Premium Navigation Filters */}
        <div className="inline-flex p-2 bg-[#050505] backdrop-blur-md rounded-2xl border border-white/5 overflow-x-auto no-scrollbar max-w-full shadow-2xl">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-xl px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeCategory === cat ? 'bg-[#00ffff] text-black shadow-[0_0_20px_rgba(0,255,255,0.4)]' : 'bg-transparent text-gray-500 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-8 bg-[#050505] p-8 rounded-3xl border border-white/5">
              <div className="bg-white/5 rounded-2xl aspect-square"></div>
              <div className="space-y-4">
                <div className="h-2 bg-white/5 rounded w-1/4 mx-auto"></div>
                <div className="h-4 bg-white/5 rounded w-3/4 mx-auto"></div>
                <div className="h-10 bg-white/5 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              {...product} 
              onOrder={triggerOrder} 
            />
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-40">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em]">AUCUNE OFFRE DISPONIBLE DANS CETTE SECTION.</p>
        </div>
      )}

      {/* Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#050505] rounded-[3rem] p-10 sm:p-12 w-full max-w-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-[#00ffff]/20 animate-in zoom-in-95 duration-300 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#00ffff] to-transparent"></div>
            
            <div className="flex flex-col items-center text-center mb-12">
              <div className="w-20 h-20 bg-[#00ffff]/5 border border-[#00ffff]/10 rounded-3xl flex items-center justify-center text-[#00ffff] mb-8 shadow-2xl">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-widest uppercase italic">FINALISER L'ACHAT</h3>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">PACK : <span className="text-[#00ffff]">{selectedProduct?.name}</span></p>
            </div>
            
            <form onSubmit={handleConfirmOrder} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-[#00ffff]/60 mb-3 ml-2">RÉFÉRENCE TRANSACTION</label>
                  <div className="relative group">
                    <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00ffff] transition-colors" size={18} />
                    <input 
                      required
                      type="text" 
                      value={formData.reference}
                      onChange={(e) => setFormData({...formData, reference: e.target.value})}
                      className="w-full pl-14 pr-6 py-5 rounded-2xl border border-white/5 bg-black focus:border-[#00ffff]/50 text-white outline-none transition-all font-black tracking-widest text-xs uppercase"
                      placeholder="NUMÉRO DE RÉFÉRENCE"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-[#00ffff]/60 mb-3 ml-2">PSEUDO IN-GAME</label>
                  <input 
                    required
                    type="text" 
                    value={formData.pseudo}
                    onChange={(e) => setFormData({...formData, pseudo: e.target.value})}
                    className="w-full px-6 py-5 rounded-2xl border border-white/5 bg-black focus:border-[#00ffff]/50 text-white outline-none transition-all font-black tracking-widest text-xs uppercase"
                    placeholder="NAME"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-[#00ffff]/60 mb-3 ml-2">UID FREE FIRE</label>
                  <input 
                    required
                    type="text" 
                    value={formData.uid}
                    onChange={(e) => setFormData({...formData, uid: e.target.value})}
                    className="w-full px-6 py-5 rounded-2xl border border-white/5 bg-black focus:border-[#00ffff]/50 text-white outline-none transition-all font-black tracking-widest text-xs uppercase"
                    placeholder="ID: 123456789"
                  />
                </div>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-6">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-8 py-5 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  ANNULER
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-8 py-5 rounded-2xl bg-[#7000ff] text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(112,0,255,0.3)] hover:bg-[#8521ff] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? 'ENVOI...' : (
                    <>
                      INITIALISER TOP-UP
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-10 right-10 text-gray-600 hover:text-[#00ffff] transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
