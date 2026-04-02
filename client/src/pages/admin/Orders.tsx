import React, { useEffect, useState } from 'react';
import { Eye, CheckCircle, XCircle, Download, X, Search, Gamepad2, Hash } from 'lucide-react';
import { orderApi } from '../../lib/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getAdminOrders();
      setOrders(data);
    } catch (error) {
      console.error("Erreur orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await orderApi.updateOrderStatus(id, status);
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status });
    } catch (error) {
      console.error("Erreur update status:", error);
      alert("Impossible de mettre à jour le statut.");
    }
  };

  const exportToCSV = () => {
    if (orders.length === 0) return;
    
    const headers = ["ID", "Client", "Pseudo", "UID", "Ref Paiement", "Pack", "Total", "Statut", "Date"];
    const csvData = filteredOrders.map(o => [
      o.id,
      o.client_name || 'N/A',
      o.pseudo_game || 'N/A',
      o.uid_game || 'N/A',
      o.payment_ref || 'N/A',
      o.order_items?.map((i: any) => i.product_name).join(" | ") || 'N/A',
      o.total_amount,
      o.status,
      o.created_at
    ]);

    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `topups_ff_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const filteredOrders = orders.filter(o => 
    o.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.pseudo_game?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.uid_game?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.payment_ref?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 relative bg-black min-h-full">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-[#00ffff] tracking-widest uppercase">SUIVI DES TOP-UPS</h1>
          <p className="text-gray-500 font-bold mt-2 text-xs tracking-widest uppercase">Gérez les recharges et validez les paiements.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="PSEUDO, UID OU RÉF..."
              className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-[#00ffff]/10 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-[#00ffff]/50 outline-none transition-all tracking-widest"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-[#7000ff] text-white text-xs font-black uppercase rounded-xl hover:bg-[#8521ff] transition-all shadow-[0_0_20px_rgba(112,0,255,0.4)] tracking-widest active:scale-95"
          >
            <Download size={18} />
            EXPORTER
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#050505] rounded-xl overflow-hidden border border-[#00ffff]/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#0f0f0f] border-b border-[#00ffff]/10 text-[11px] font-black text-[#00ffff] uppercase tracking-[0.2em]">
                <th className="px-8 py-6">JOUEUR (PSEUDO / UID)</th>
                <th className="px-8 py-6">RÉF PAIEMENT</th>
                <th className="px-8 py-6">PACK</th>
                <th className="px-8 py-6">TOTAL</th>
                <th className="px-8 py-6">STATUT</th>
                <th className="px-8 py-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00ffff]/5">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-10 bg-[#050505]"></td>
                  </tr>
                ))
              ) : filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#00ffff]/5 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-gray-200 flex items-center gap-2 uppercase tracking-wide">
                      <Gamepad2 size={14} className="text-[#00ffff]" />
                      {order.pseudo_game || 'N/A'}
                    </p>
                    <p className="text-[10px] font-mono text-gray-500 mt-1 uppercase tracking-widest">UID: {order.uid_game || 'N/A'}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-mono font-black text-[#00ffff] bg-[#00ffff]/10 px-3 py-1 rounded-md border border-[#00ffff]/20 uppercase tracking-widest">
                      {order.payment_ref || 'N/A'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                      {order.order_items && order.order_items.length > 0 ? order.order_items[0].product_name : 'N/A'}
                    </p>
                  </td>
                  <td className="px-8 py-5 font-black text-[#00ffff] tracking-widest">
                    {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA', maximumFractionDigits: 0 }).format(order.total_amount)}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md border ${getStatusStyle(order.status)}`}>
                      {order.status === 'completed' ? 'LIVRÉ' : order.status === 'rejected' ? 'REJETÉ' : 'EN ATTENTE'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2.5 text-[#00ffff] hover:bg-[#00ffff]/10 rounded-lg transition-colors border border-[#00ffff]/20" title="Détails">
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => updateStatus(order.id, 'completed')}
                        className="p-2.5 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors border border-green-500/20" title="Valider & Livrer">
                        <CheckCircle size={18} />
                      </button>
                      <button 
                        onClick={() => updateStatus(order.id, 'rejected')}
                        className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20" title="Rejeter">
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-500 tracking-[0.3em] font-black text-xs uppercase">
                    AUCUN TOP-UP TROUVÉ.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200 border border-[#00ffff]/20">
            <div className="p-10 border-b border-[#00ffff]/10 flex items-center justify-between bg-[#050505]">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#00ffff]/10 border border-[#00ffff]/20 rounded-2xl flex items-center justify-center text-[#00ffff] shadow-lg shadow-[#00ffff]/5">
                  <Gamepad2 size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-widest uppercase italic">{selectedOrder.pseudo_game}</h3>
                  <p className="text-[10px] font-mono text-[#00ffff] uppercase font-black tracking-[0.3em] mt-1">UID: {selectedOrder.uid_game}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-3 text-gray-500 hover:text-[#00ffff] rounded-full transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00ffff]/60 mb-4">RÉFÉRENCE DE PAIEMENT</h4>
                    <div className="bg-black border border-amber-500/20 p-5 rounded-xl flex items-center gap-4">
                      <Hash size={20} className="text-amber-500" />
                      <span className="text-lg font-black text-amber-500 tracking-widest uppercase">{selectedOrder.payment_ref || 'AUCUNE RÉF'}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00ffff]/60 mb-4">CONTACT CLIENT</h4>
                    <div className="space-y-2">
                      <p className="text-xs font-black text-gray-200 tracking-widest uppercase">{selectedOrder.client_name}</p>
                      <p className="text-xs font-bold text-gray-400 tracking-widest">{selectedOrder.phone}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedOrder.client_email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black p-8 rounded-2xl border border-[#00ffff]/10 flex flex-col justify-center items-center text-center shadow-inner">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00ffff]/60 mb-6">PACK À LIVRER</h4>
                  <p className="text-lg font-black text-[#00ffff] uppercase tracking-[0.1em] mb-4">
                    {selectedOrder.order_items?.[0]?.product_name}
                  </p>
                  <div className="h-[1px] w-16 bg-[#00ffff]/20 mb-6"></div>
                  <p className="text-3xl font-black text-white tracking-widest">
                    {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA', maximumFractionDigits: 0 }).format(selectedOrder.total_amount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-10 border-t border-[#00ffff]/10 bg-[#050505] flex flex-col sm:flex-row justify-end gap-6">
              <button 
                onClick={() => updateStatus(selectedOrder.id, 'rejected')}
                className="px-10 py-5 text-xs font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-500/10 rounded-xl border border-red-500/20 transition-all"
              >
                REJETER
              </button>
              <button 
                onClick={() => updateStatus(selectedOrder.id, 'completed')}
                className="px-12 py-5 bg-[#7000ff] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(112,0,255,0.3)] hover:bg-[#8521ff] transition-all active:scale-95"
              >
                CONFIRMER LIVRAISON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
