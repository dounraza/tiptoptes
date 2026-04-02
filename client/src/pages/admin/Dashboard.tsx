import React, { useEffect, useState } from 'react';
import { ShoppingCart, Package, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { orderApi } from '../../lib/api';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await orderApi.getStats();
        setStats(data);
      } catch (error) {
        console.error("Erreur stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Chiffre d\'Affaires', value: stats?.total_revenue, icon: TrendingUp, color: 'text-[#00ffff] bg-[#00ffff]/10', isCurrency: true },
    { label: 'Total Commandes', value: stats?.total_orders, icon: ShoppingCart, color: 'text-[#7000ff] bg-[#7000ff]/10' },
    { label: 'En attente', value: stats?.pending_orders, icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Articles en Ligne', value: stats?.total_products, icon: Package, color: 'text-rose-500 bg-rose-500/10' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 bg-black min-h-full">
      <div>
        <h1 className="text-2xl font-black text-[#00ffff] tracking-[0.3em] uppercase">TABLEAU DE BORD</h1>
        <p className="text-gray-500 font-bold mt-2 text-sm tracking-widest uppercase">STATISTIQUES DE VOTRE BOUTIQUE</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-[#050505] p-8 rounded-2xl border border-[#00ffff]/5 flex flex-col gap-6 hover:border-[#00ffff]/20 transition-all duration-300 group shadow-2xl">
            <div className={`${stat.color} w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00ffff]/60 mb-2">{stat.label}</p>
              <p className="text-2xl font-black text-white tracking-widest">
                {stat.isCurrency 
                  ? new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA', maximumFractionDigits: 0 }).format(stat.value || 0)
                  : stat.value || 0}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#050505] rounded-2xl border border-[#00ffff]/5 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-[#00ffff]/10 flex justify-between items-center bg-[#0a0a0a]">
            <h2 className="text-lg font-black text-[#00ffff] tracking-widest uppercase">VENTES RÉCENTES</h2>
            <button className="text-[10px] font-black text-[#00ffff]/60 hover:text-[#00ffff] tracking-widest uppercase transition-colors">VOIR TOUT</button>
          </div>
          <div className="divide-y divide-[#00ffff]/5">
            {stats?.recent_sales?.map((sale: any) => (
              <div key={sale.id} className="p-6 flex items-center justify-between hover:bg-[#00ffff]/5 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#00ffff]/10 flex items-center justify-center text-[#00ffff] border border-[#00ffff]/20">
                    <CheckCircle size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-200 tracking-widest uppercase">{sale.client_name}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mt-1">
                      {sale.created_at ? new Date(sale.created_at).toLocaleDateString() : 'Date inconnue'}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-black text-[#00ffff] tracking-[0.1em]">
                  +{new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA', maximumFractionDigits: 0 }).format(sale.total_amount)}
                </p>
              </div>
            ))}
            {(!stats?.recent_sales || stats.recent_sales.length === 0) && (
              <div className="p-16 text-center text-gray-500 tracking-[0.3em] font-black text-xs uppercase">AUCUNE VENTE RÉCENTE.</div>
            )}
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-[#0a0a0a] rounded-2xl p-10 text-white shadow-2xl border border-[#00ffff]/10 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00ffff]/5 blur-3xl"></div>
          <div>
            <h2 className="text-xl font-black tracking-[0.2em] uppercase text-[#00ffff] mb-6">STATUS BOUTIQUE</h2>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#00ffff]/10 text-[#00ffff] rounded-lg border border-[#00ffff]/20 text-[10px] font-black uppercase tracking-[0.2em]">
              <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse shadow-[0_0_10px_#00ffff]"></div>
              EN LIGNE
            </div>
          </div>
          
          <div className="mt-12 space-y-8 text-sm text-gray-400 font-bold text-center">
            <p className="tracking-widest uppercase text-xs">VOTRE CATALOGUE CONTIENT <span className="text-[#00ffff] font-black">{stats?.total_products}</span> ARTICLES.</p>
            <div className="pt-8 border-t border-[#00ffff]/10">
              <p className="text-[#00ffff]/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">ACTIVITÉ</p>
              <p className="text-gray-200 tracking-widest uppercase text-xs leading-relaxed">
                VOUS AVEZ <span className="text-amber-400 font-black">{stats?.pending_orders}</span> COMMANDES EN ATTENTE.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
