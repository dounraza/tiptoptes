import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  onOrder?: (id: string) => void;
}

const categoryTagline: Record<string, string> = {
  Femmes: 'Élégance florale',
  Accessoires: 'Finition luxe',
  Hommes: 'Coupe moderne',
  Chaussures: 'Confort ultime'
};

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image_url, category, onOrder }) => {
  return (
    <div className="group relative flex flex-col transition-all duration-500">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-gray-200">
        <img
          src={image_url}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Category Badge - Glassmorphism */}
        <div className="absolute top-4 left-4 rounded-full bg-white/70 backdrop-blur-md border border-white/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900">
          {category}
        </div>

        {/* Hover Overlay with Button */}
        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <button
          onClick={() => onOrder && onOrder(id)}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-8 flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-xs font-bold text-white shadow-2xl opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-indigo-600 active:scale-95"
        >
          <ShoppingCart size={14} />
          Commander
        </button>
      </div>

      {/* Info Container */}
      <div className="mt-6 flex flex-col items-center text-center">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">{category}</h3>
        <h4 className="line-clamp-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-indigo-600 sm:text-xl">
          {name}
        </h4>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-xl font-black text-gray-900">
            {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA', maximumFractionDigits: 0 }).format(price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
