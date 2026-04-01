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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border border-amber-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(o => 
    o.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.pseudo_game?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.uid_game?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.payment_ref?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Suivi des Top-ups</h1>
          <p className="text-gray-500 font-medium">Gérez les recharges diamants et validez les paiements.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Pseudo, UID ou Réf paiement..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={exportToCSV}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
          >
            <Download size={18} />
            Exporter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Joueur (Pseudo / UID)</th>
                <th className="px-8 py-5">Réf Paiement</th>
                <th className="px-8 py-5">Pack</th>
                <th className="px-8 py-5">Total</th>
                <th className="px-8 py-5">Statut</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Gamepad2 size={14} className="text-indigo-500" />
                      {order.pseudo_game || 'N/A'}
                    </p>
                    <p className="text-[10px] font-mono text-gray-400">UID: {order.uid_game || 'N/A'}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                      {order.payment_ref || 'N/A'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-gray-700">
                      {order.order_items && order.order_items.length > 0 ? order.order_items[0].product_name : 'N/A'}
                    </p>
                  </td>
                  <td className="px-8 py-5 font-black text-gray-900">
                    {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA', maximumFractionDigits: 0 }).format(order.total_amount)}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-full ${getStatusColor(order.status)}`}>
                      {order.status === 'completed' ? 'Livré' : order.status === 'rejected' ? 'Rejeté' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Détails">
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => updateStatus(order.id, 'completed')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Valider & Livrer">
                        <CheckCircle size={18} />
                      </button>
                      <button 
                        onClick={() => updateStatus(order.id, 'rejected')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Rejeter">
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic font-medium">
                    Aucun top-up trouvé pour "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Gamepad2 size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">{selectedOrder.pseudo_game}</h3>
                  <p className="text-xs font-mono text-indigo-600 uppercase font-bold tracking-widest">UID: {selectedOrder.uid_game}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Référence de paiement</h4>
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3">
                      <Hash size={18} className="text-amber-600" />
                      <span className="text-lg font-black text-amber-700">{selectedOrder.payment_ref || 'AUCUNE RÉF'}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Contact Client</h4>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-900">{selectedOrder.client_name}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.phone}</p>
                      <p className="text-xs text-gray-400">{selectedOrder.client_email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex flex-col justify-center items-center text-center">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Pack à livrer</h4>
                  <p className="text-xl font-black text-indigo-600 uppercase mb-2">
                    {selectedOrder.order_items?.[0]?.product_name}
                  </p>
                  <div className="h-px w-12 bg-indigo-200 mb-4"></div>
                  <p className="text-2xl font-black text-gray-900">
                    {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA', maximumFractionDigits: 0 }).format(selectedOrder.total_amount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-end gap-4">
              <button 
                onClick={() => updateStatus(selectedOrder.id, 'rejected')}
                className="px-8 py-4 text-sm font-black uppercase tracking-widest text-red-600 hover:bg-red-50 rounded-2xl transition-all"
              >
                Rejeter
              </button>
              <button 
                onClick={() => updateStatus(selectedOrder.id, 'completed')}
                className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
              >
                Confirmer la livraison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
