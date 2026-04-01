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
    <div className="space-y-6 relative">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestion du Catalogue</h1>
          <p className="text-gray-500 font-medium">Contrôlez vos stocks et vos articles en un clin d'œil.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-gray-900 text-white font-black rounded-xl hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
          >
            <Plus size={20} />
            Nouveau Produit
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Visuel</th>
                <th className="px-8 py-5">Désignation</th>
                <th className="px-8 py-5">Catégorie</th>
                <th className="px-8 py-5">Prix</th>
                <th className="px-8 py-5">Stock</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-10 bg-gray-50/20"></td>
                  </tr>
                ))
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm" />
                  </td>
                  <td className="px-8 py-4 font-bold text-gray-900">{product.name}</td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase rounded-full tracking-wider">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-4 font-black text-indigo-600">
                    {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA', maximumFractionDigits: 0 }).format(product.price)}
                  </td>
                  <td className="px-8 py-4">
                    <span className={`font-bold ${product.stock <= 5 ? 'text-red-500' : 'text-gray-900'}`}>
                      {product.stock} pcs
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenEdit(product)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Modifier">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic font-medium">
                    Aucun produit trouvé pour "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Produit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                {isEditing ? 'Modifier Article' : 'Nouvel Article'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Désignation</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all font-medium"
                  value={productData.name}
                  onChange={e => setProductData({...productData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Prix (MGA)</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all font-medium"
                    value={productData.price}
                    onChange={e => setProductData({...productData, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Stock disponible</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all font-medium"
                    value={productData.stock}
                    onChange={e => setProductData({...productData, stock: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Catégorie</label>
                <select 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all font-medium appearance-none"
                  value={productData.category}
                  onChange={e => setProductData({...productData, category: e.target.value})}
                >
                  <option>Femmes</option>
                  <option>Hommes</option>
                  <option>Accessoires</option>
                  <option>Chaussures</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Image URL</label>
                <input 
                  type="url" 
                  required 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all font-medium"
                  value={productData.image_url}
                  onChange={e => setProductData({...productData, image_url: e.target.value})}
                />
              </div>
              <div className="pt-6">
                <button 
                  type="submit" 
                  className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
                >
                  {isEditing ? 'Mettre à jour' : 'Ajouter au catalogue'}
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
