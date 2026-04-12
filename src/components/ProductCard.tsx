'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Download, CheckCircle2, Box, Loader2 } from 'lucide-react';
import { Product } from '@/data/products';
import OrderModal from './OrderModal';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [likes, setLikes] = useState(product.stats.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if user already liked this product previously
    const liked = localStorage.getItem(`liked-${product.id}`);
    if (liked) setHasLiked(true);
  }, [product.id]);

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked || isLiking) return;
    setIsLiking(true);

    try {
      setLikes(prev => prev + 1); // Optimistic UI update
      setHasLiked(true);
      localStorage.setItem(`liked-${product.id}`, 'true');

      const res = await fetch('/api/products/like', {
        method: 'POST',
        body: JSON.stringify({ productId: product.id })
      });
      if (!res.ok) throw new Error('Like failed');
    } catch (err) {
      // Rollback on failure
      setLikes(prev => prev - 1);
      setHasLiked(false);
      localStorage.removeItem(`liked-${product.id}`);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group flex flex-col bg-[#111111] border border-white/5 light-mode:!border-black/20 rounded-xl overflow-hidden hover:border-white/10 light-mode:hover:!border-black transition-all duration-300 min-h-[300px]"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0A0A] light-mode:!bg-gray-100">
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
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 skew-x-[-10deg]">
          <div className="flex items-center gap-1 skew-x-[10deg]">
            <span className="font-mono text-xl font-bold text-ag-accent">{product.price}</span>
            <span className="font-mono text-xs text-ag-accent">RON</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="text-sm font-bold text-white light-mode:!text-black group-hover:text-primary transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-[10px] text-white/50 light-mode:!text-black light-mode:!font-black leading-relaxed line-clamp-2 mt-1">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            {/* Creator Info */}
            <div className="flex items-center gap-2 max-w-[60%]">
              <img 
                src={product.creator.avatar} 
                alt={product.creator.name} 
                className="w-5 h-5 rounded-full bg-white/10"
              />
              <span className="text-[11px] text-white/50 light-mode:!text-black light-mode:!font-black truncate hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                {product.creator.name}
                {product.creator.verified && <CheckCircle2 size={10} className="text-blue-400" />}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-white/30 light-mode:!text-black text-[10px] light-mode:!font-black font-bold">
              <div className="flex items-center gap-1 cursor-help title-='Număr de comenzi la acest produs'">
                <Download size={12} />
                <span>{product.stats.downloads}</span>
              </div>
              <button 
                onClick={handleLike}
                disabled={hasLiked || isLiking}
                className={`flex items-center gap-1 transition-colors ${hasLiked ? 'text-purple-400' : 'hover:text-purple-400 disabled:opacity-50'}`}
              >
                {isLiking ? <Loader2 size={12} className="animate-spin" /> : <ThumbsUp size={12} className={hasLiked ? 'fill-purple-400' : ''} />}
                <span>{likes}</span>
              </button>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleWhatsAppOrder}
          className="mt-auto w-full py-2.5 bg-white/5 border border-white/5 hover:border-primary hover:bg-primary/5 text-white/40 hover:text-primary text-[10px] font-display font-black uppercase tracking-[0.2em] rounded-lg transition-all light-mode:!bg-black light-mode:!text-white light-mode:!border-black light-mode:hover:!bg-primary light-mode:hover:!border-primary"
        >
          Comanda Acum
        </button>
      </div>
      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={product} 
        waNumber="40770636284" 
      />
    </motion.div>
  );
}
