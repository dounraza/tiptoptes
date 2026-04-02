import React from 'react';
import { ShoppingCart, Zap } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  onOrder?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image_url, category, onOrder }) => {
  return (
    <div className="group relative flex flex-col transition-all duration-500 bg-[#050505] rounded-3xl border border-white/5 overflow-hidden hover:border-[#00ffff]/30 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)]">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-black">
        <img
          src={image_url}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        
        {/* Category Badge */}
        <div className="absolute top-5 left-5 rounded-lg bg-black/80 backdrop-blur-md border border-[#00ffff]/20 px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#00ffff]">
          {category}
        </div>

        {/* Price Overlay */}
        <div className="absolute bottom-5 right-5 rounded-xl bg-black/90 backdrop-blur-md border border-white/10 px-5 py-3 text-lg font-black text-white shadow-2xl tracking-widest group-hover:text-[#00ffff] transition-colors">
          {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA', maximumFractionDigits: 0 }).format(price)}
        </div>
      </div>

      {/* Info Container */}
      <div className="p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h3 className="text-[9px] font-black text-[#00ffff]/60 uppercase tracking-[0.3em]">{category}</h3>
          <h4 className="text-xl font-black text-white uppercase tracking-tighter leading-tight italic line-clamp-2">
            {name}
          </h4>
        </div>

        <button
          onClick={() => onOrder && onOrder(id)}
          className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#7000ff] px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl transition-all hover:bg-[#8521ff] hover:shadow-[#7000ff]/30 active:scale-95 group-hover:translate-y-0"
        >
          <Zap size={16} className="fill-current" />
          COMMANDER MAINTENANT
        </button>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#7000ff]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

export default ProductCard;
