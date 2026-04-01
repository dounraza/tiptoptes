import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { productApi, orderApi } from '../lib/api';
import { Smartphone, Info, Hash } from 'lucide-react';

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
      
      setNotification({ type: 'success', message: `Top-up en cours pour ${formData.pseudo} ! Livraison immédiate.` });
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', uid: '', pseudo: '', reference: '' });
    } catch (error) {
      setNotification({ type: 'error', message: "Désolé, une erreur est survenue. Contactez-nous sur Facebook." });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const filteredProducts = activeCategory === 'Tout' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="products" className="py-20 px-4 max-w-7xl mx-auto sm:py-32 relative">
      {/* Promotional Title */}
      <div className="mb-16 text-center animate-in fade-in zoom-in duration-1000">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-relaxed">
          💎 ACHAT DIAMANT FREE FIRE VIA UID 💎<br/>
          <span className="text-indigo-600">⚡ Service FAST & sécurisé ⚡</span>
        </h2>
      </div>

      {/* Personalized Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-[100] p-4 rounded-xl shadow-2xl border animate-in slide-in-from-right duration-300 ${
          notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <p className="font-semibold text-sm">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-1 bg-gray-200 rounded-full mb-6"></div>
              <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Finaliser votre achat</h3>
              <p className="text-gray-500 text-sm">Pack : <span className="font-bold text-indigo-600 uppercase tracking-wider">{selectedProduct?.name}</span></p>
            </div>
            
            <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Référence de paiement</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
                  <input 
                    required
                    type="text" 
                    value={formData.reference}
                    onChange={(e) => setFormData({...formData, reference: e.target.value})}
                    className="w-full pl-11 pr-5 py-4 rounded-2xl border-2 border-indigo-100 bg-indigo-50/30 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all text-sm font-bold placeholder:text-indigo-300"
                    placeholder="Entrez le numéro de transaction / réf"
                  />
                </div>
                <p className="mt-2 text-[10px] text-gray-400 font-medium italic">Veuillez effectuer le paiement avant de valider.</p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Pseudo In-game</label>
                <input 
                  required
                  type="text" 
                  value={formData.pseudo}
                  onChange={(e) => setFormData({...formData, pseudo: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all text-sm font-medium"
                  placeholder="Votre nom dans Free Fire"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">UID Free Fire</label>
                <input 
                  required
                  type="text" 
                  value={formData.uid}
                  onChange={(e) => setFormData({...formData, uid: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all text-sm font-medium"
                  placeholder="Ex: 123456789"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Téléphone (WhatsApp)</label>
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all text-sm font-medium"
                  placeholder="Ex: 034 00 000 00"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Nom Complet</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all text-sm font-medium"
                  placeholder="Votre nom réel"
                />
              </div>
              
              <div className="sm:col-span-2 pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-8 py-4 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-8 py-4 rounded-2xl bg-gray-900 text-white text-sm font-bold shadow-xl shadow-gray-200 hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Traitement...' : 'Confirmer le Top-up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Info Box */}
      <div className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-indigo-500/10 max-w-4xl mx-auto relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl -mr-20 -mt-20"></div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Smartphone size={20} />
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Comment payer ?</h2>
          </div>
          
          <p className="text-gray-500 text-sm mb-8 font-medium italic flex items-center gap-2">
            <Info size={14} className="text-indigo-500" />
            Envoyez le montant exact sur l'un de ces numéros :
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {/* MVOLA Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 hover:border-amber-400 transition-colors">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center p-2">
                <span className="font-black text-amber-600 text-xs italic">MVOLA</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Numéro MVOLA</span>
                <span className="text-xl font-black text-gray-900">034 78 711 39</span>
                <span className="text-xs font-bold text-amber-600 italic">Josiane</span>
              </div>
            </div>

            {/* ORANGE Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 hover:border-orange-500 transition-colors">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center p-2">
                <span className="font-black text-orange-600 text-xs italic">ORANGE</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Numéro ORANGE</span>
                <span className="text-xl font-black text-gray-900">037 78 391 76</span>
                <span className="text-xs font-bold text-orange-600 italic">Mickael</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 text-white rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <span className="font-black text-lg">!</span>
            </div>
            <p className="text-sm font-bold tracking-tight">
              Récupérez la <span className="text-indigo-300 uppercase">Référence</span> de la transaction puis remplissez le formulaire ci-dessous.
            </p>
          </div>
        </div>
      </div>

      {/* Editorial Header */}
      <div className="mb-20 flex flex-col items-center text-center">
        <span className="inline-block py-1.5 px-4 mb-6 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-100">
          💎 Packs Disponibles
        </span>
        <h2 className="text-5xl font-black text-gray-900 sm:text-7xl tracking-tighter mb-8">
          Choisissez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Recharge</span>
        </h2>
      </div>

      {/* Premium Navigation Filters */}
      <div className="flex justify-center mb-20">
        <div className="inline-flex p-2 bg-gray-100/50 backdrop-blur-sm rounded-full border border-gray-200 overflow-x-auto no-scrollbar max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-full px-10 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-white text-gray-900 shadow-xl' : 'bg-transparent text-gray-400 hover:text-gray-900'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-8">
              <div className="bg-gray-100 rounded-[2.5rem] aspect-[3/4]"></div>
              <div className="flex flex-col items-center gap-3">
                <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                <div className="h-5 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
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
        <div className="text-center py-32">
          <p className="text-gray-400 text-lg font-medium italic">Aucun pack disponible dans cette catégorie.</p>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
