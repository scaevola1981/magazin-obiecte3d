'use client';

import { motion } from 'framer-motion';
import { ThumbsUp, Download, CheckCircle2, Box } from 'lucide-react';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const handleWhatsAppOrder = () => {
    const message = `Salut! Vreau să comand ${product.name} (${product.price}).`;
    const encodedMessage = encodeURIComponent(message);
    const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || "40700000000";
    const whatsappUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group flex flex-col bg-[#111111] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all duration-300 min-h-[300px]"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0A0A]">
        <img 
          src={product.thumbnailUrl || '/placeholder-product.jpg'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badge Overlay */}
        <div className="absolute top-3 left-3 w-8 h-8 bg-black/60 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10">
          <Box size={16} className="text-primary" />
        </div>

        {/* Floating Price */}
        <div className="absolute bottom-3 right-3 bg-primary/90 backdrop-blur-md text-black px-3 py-1 rounded-lg font-display font-black text-sm skew-x-[-10deg]">
          {product.price}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mt-3">
            {/* Creator Info */}
            <div className="flex items-center gap-2 max-w-[60%]">
              <img 
                src={product.creator.avatar} 
                alt={product.creator.name} 
                className="w-5 h-5 rounded-full bg-white/10"
              />
              <span className="text-[11px] text-white/50 truncate hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                {product.creator.name}
                {product.creator.verified && <CheckCircle2 size={10} className="text-blue-400" />}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-white/30 text-[10px] font-bold">
              <div className="flex items-center gap-1">
                <Download size={12} />
                <span>{product.stats.downloads}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp size={12} />
                <span>{product.stats.likes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleWhatsAppOrder}
          className="mt-auto w-full py-2.5 bg-white/5 border border-white/5 hover:border-primary hover:bg-primary/5 text-white/40 hover:text-primary text-[10px] font-display font-black uppercase tracking-[0.2em] rounded-lg transition-all"
        >
          Comanda Acum
        </button>
      </div>
    </motion.div>
  );
}
