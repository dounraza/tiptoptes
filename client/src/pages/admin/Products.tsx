import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import { productApi } from '../../lib/api';

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [productData, setProductData] = useState({
    name: '',
    price: 0,
    category: 'Femmes',
    stock: 0,
    image_url: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Erreur products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentProductId(null);
    setProductData({ name: '', price: 0, category: 'Femmes', stock: 0, image_url: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (product: any) => {
    setIsEditing(true);
    setCurrentProductId(product.id);
    setProductData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image_url: product.image_url
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentProductId) {
        await productApi.updateProduct(currentProductId, productData);
      } else {
        await productApi.addProduct(productData);
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      try {
        await productApi.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error("Erreur suppression:", error);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 relative bg-black min-h-full">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        <div>
          <h1 className="text-2xl font-black text-[#00ffff] tracking-widest uppercase">GESTION PACKS / OFFRES</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="RECHERCHER..."
              className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-[#00ffff]/10 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-[#00ffff]/50 outline-none transition-all tracking-widest"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-[#7000ff] text-white text-xs font-black uppercase rounded-xl hover:bg-[#8521ff] transition-all shadow-[0_0_20px_rgba(112,0,255,0.4)] tracking-widest active:scale-95"
          >
            <Plus size={18} />
            AJOUTER OFFER
          </button>
        </div>
      </div>

      <div className="bg-[#050505] rounded-xl overflow-hidden border border-[#00ffff]/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#0f0f0f] border-b border-[#00ffff]/10 text-[11px] font-black text-[#00ffff] uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Visual</th>
                <th className="px-8 py-6">Name</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Price</th>
                <th className="px-8 py-6">Stock</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00ffff]/5">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-10 bg-[#050505]"></td>
                  </tr>
                ))
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#00ffff]/5 transition-colors group">
                  <td className="px-8 py-5">
                    <img src={product.image_url} alt={product.name} className="w-14 h-14 rounded-lg object-cover border border-[#00ffff]/10 shadow-lg" />
                  </td>
                  <td className="px-8 py-5 font-bold text-gray-200 tracking-wide">{product.name}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-[#00ffff]/10 text-[#00ffff] text-[10px] font-black uppercase rounded-md tracking-widest">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-black text-[#00ffff] tracking-widest">
                    {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA', maximumFractionDigits: 0 }).format(product.price)}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`font-bold tracking-wide ${product.stock <= 5 ? 'text-red-500' : 'text-gray-300'}`}>
                      {product.stock} PCS
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
                      <button 
                        onClick={() => handleOpenEdit(product)}
                        className="p-2.5 text-[#00ffff] hover:bg-[#00ffff]/10 rounded-lg transition-colors border border-[#00ffff]/20" title="Modifier">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20" title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-500 tracking-[0.2em] font-black text-xs uppercase">
                    AUCUN PRODUIT TROUVÉ.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Produit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] w-full max-w-lg rounded-2xl p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200 border border-[#00ffff]/20">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-[#00ffff] tracking-widest uppercase">
                {isEditing ? 'MODIFIER ARTICLE' : 'NOUVEL ARTICLE'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-500 hover:text-[#00ffff] rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#00ffff]/60 mb-3">DÉSIGNATION</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-5 py-4 bg-black border border-[#00ffff]/10 rounded-xl focus:border-[#00ffff] text-white outline-none transition-all font-bold tracking-widest text-sm"
                  value={productData.name}
                  onChange={e => setProductData({...productData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#00ffff]/60 mb-3">PRIX (MGA)</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full px-5 py-4 bg-black border border-[#00ffff]/10 rounded-xl focus:border-[#00ffff] text-white outline-none transition-all font-bold tracking-widest text-sm"
                    value={productData.price}
                    onChange={e => setProductData({...productData, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#00ffff]/60 mb-3">STOCK</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full px-5 py-4 bg-black border border-[#00ffff]/10 rounded-xl focus:border-[#00ffff] text-white outline-none transition-all font-bold tracking-widest text-sm"
                    value={productData.stock}
                    onChange={e => setProductData({...productData, stock: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#00ffff]/60 mb-3">CATÉGORIE</label>
                <select 
                  className="w-full px-5 py-4 bg-black border border-[#00ffff]/10 rounded-xl focus:border-[#00ffff] text-white outline-none transition-all font-bold tracking-widest text-sm appearance-none"
                  value={productData.category}
                  onChange={e => setProductData({...productData, category: e.target.value})}
                >
                  <option value="LEVEL UP">LEVEL UP</option>
                  <option value="ABONNEMENT">ABONNEMENT</option>
                  <option value="TOP UP BONUS">TOP UP BONUS</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#00ffff]/60 mb-3">IMAGE URL</label>
                <input 
                  type="url" 
                  required 
                  className="w-full px-5 py-4 bg-black border border-[#00ffff]/10 rounded-xl focus:border-[#00ffff] text-white outline-none transition-all font-bold tracking-widest text-sm"
                  value={productData.image_url}
                  onChange={e => setProductData({...productData, image_url: e.target.value})}
                />
              </div>
              <div className="pt-8">
                <button 
                  type="submit" 
                  className="w-full py-5 bg-[#7000ff] text-white font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#8521ff] transition-all shadow-[0_0_30px_rgba(112,0,255,0.3)] active:scale-95 text-xs"
                >
                  {isEditing ? 'METTRE À JOUR' : 'AJOUTER AU CATALOGUE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
