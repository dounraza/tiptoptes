import React from 'react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.45),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.28),transparent_30%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/90" />
      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-28 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 shadow-xl backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Service FAST & sécurisé à Madagascar
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
                Diamant <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Free Fire</span> instantané.
              </h1>
              <p className="text-slate-200 max-w-2xl text-lg sm:text-xl leading-8">
                Le top-up le plus rapide via UID. Recevez vos diamants en moins de 5 minutes. Simple, fiable et sécurisé.
              </p>
              <div className="flex flex-wrap gap-3 text-indigo-400 text-xs font-bold font-mono">
                <span>#FreeFire</span>
                <span>#TopUpFF</span>
                <span>#DiamantFF</span>
                <span>#GamingMG</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#products"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-500 px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-2xl shadow-fuchsia-500/20 transition-all hover:scale-105"
              >
                Recharger maintenant
              </a>
              <a
                href="tel:0347871139"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-bold text-white/90 hover:text-white transition-colors"
              >
                Contact : 034 78 711 39
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Top up haingana', description: 'Livraison immédiate après confirmation.' },
              { title: 'Sécurisé', description: 'Recharge directe via votre UID uniquement.' },
              { title: 'Paiement local', description: 'Orange Money, MVola et Airtel Money.' },
              { title: 'Support 24/7', description: 'Assistance via WhatsApp et Facebook.' }
            ].map((feature) => (
              <div key={feature.title} className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/10 backdrop-blur-2xl group hover:border-indigo-500/50 transition-colors">
                <p className="text-xs uppercase tracking-[0.2em] font-black text-indigo-300">{feature.title}</p>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
