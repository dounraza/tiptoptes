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
    { label: 'Chiffre d\'Affaires', value: stats?.total_revenue, icon: TrendingUp, color: 'bg-emerald-500', isCurrency: true },
    { label: 'Total Commandes', value: stats?.total_orders, icon: ShoppingCart, color: 'bg-indigo-500' },
    { label: 'En attente', value: stats?.pending_orders, icon: Clock, color: 'bg-amber-500' },
    { label: 'Articles en Ligne', value: stats?.total_products, icon: Package, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Tableau de bord</h1>
        <p className="text-gray-500 font-medium mt-1">Bienvenue dans votre espace de gestion IZY-FAST TOP UP.</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-xl transition-all duration-300 group">
            <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">
                {stat.isCurrency 
                  ? new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA', maximumFractionDigits: 0 }).format(stat.value || 0)
                  : stat.value || 0}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Ventes Récentes (Terminées)</h2>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline">Voir tout</button>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.recent_sales?.map((sale: any) => (
              <div key={sale.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{sale.client_name}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                      {sale.created_at ? new Date(sale.created_at).toLocaleDateString() : 'Date inconnue'}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-black text-emerald-600">
                  +{new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA', maximumFractionDigits: 0 }).format(sale.total_amount)}
                </p>
              </div>
            ))}
            {(!stats?.recent_sales || stats.recent_sales.length === 0) && (
              <div className="p-10 text-center text-gray-400 italic font-medium">Aucune vente terminée récemment.</div>
            )}
          </div>
        </div>

        {/* Quick Tips or Status */}
        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/20 blur-3xl"></div>
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-4">Statut Boutique</h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase">
              En Ligne
            </div>
          </div>
          
          <div className="mt-8 space-y-4 text-sm text-gray-400 font-medium text-center">
            <p>Votre catalogue contient actuellement <span className="text-white font-bold">{stats?.total_products}</span> articles.</p>
            <div className="pt-4 border-t border-gray-800">
              <p className="text-gray-500 text-[10px] font-black uppercase mb-2">Activité</p>
              <p className="text-white">Vous avez <span className="text-amber-400 font-bold">{stats?.pending_orders}</span> commandes en attente de traitement.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
