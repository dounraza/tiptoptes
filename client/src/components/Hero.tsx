import React from 'react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-black text-white py-20 lg:py-32">
      {/* Background Neon Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00ffff]/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#7000ff]/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid gap-16 lg:grid-cols-[1fr_450px] items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 rounded-xl border border-[#00ffff]/20 bg-[#00ffff]/5 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-[#00ffff] shadow-[0_0_20px_rgba(0,255,255,0.1)] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#00ffff] animate-pulse shadow-[0_0_10px_#00ffff]"></span>
              SYSTEM STATUS: ONLINE & SECURE
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] italic uppercase">
                DIAMANT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] to-[#7000ff] drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                  FREE FIRE
                </span>
              </h1>
              <p className="text-gray-400 max-w-xl text-lg font-bold tracking-wide leading-relaxed uppercase">
                LE TOP-UP LE PLUS RAPIDE DE MADAGASCAR. RÉCEPTION VIA UID EN MOINS DE 5 MINUTES.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a
                href="#products"
                className="inline-flex items-center justify-center rounded-xl bg-[#00ffff] px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-black shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[#00ffff]/50 active:scale-95 w-full sm:w-auto"
              >
                RECHARGER MAINTENANT
              </a>
              <a
                href="tel:0372027182"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/10 transition-all w-full sm:w-auto"
              >
                SUPPORT: 037 20 271 82
              </a>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {[
              { title: 'ULTRA FAST', description: 'LIVRAISON IMMÉDIATE APRÈS CONFIRMATION.', icon: '⚡' },
              { title: '100% SECURE', description: 'RECHARGE DIRECTE VIA VOTRE UID UNIQUEMENT.', icon: '🛡️' },
              { title: 'LOCAL PAY', description: 'MVola, Orange Money, Airtel Money.', icon: '🇲🇬' }
            ].map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-white/5 bg-[#050505] p-8 shadow-2xl transition-all hover:border-[#00ffff]/20 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-2xl opacity-20 group-hover:opacity-100 transition-opacity">{feature.icon}</div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-[#00ffff] mb-3">{feature.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed font-bold tracking-widest uppercase">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
