'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Download, Loader2 } from 'lucide-react';
import { Product } from '@/data/products';
import OrderModal from './OrderModal';

interface Props {
  product: Product;
  viewType?: 'grid' | 'list';
}

export default function MobileProductCard({ product, viewType = 'list' }: Props) {
  const message = encodeURIComponent(
    `Salut! Vreau să comand ${product.name} (${product.price}).`
  );
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER;

  const [likes, setLikes] = useState(product.stats?.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const liked = localStorage.getItem(`liked-${product.id}`);
    if (liked) setHasLiked(true);
  }, [product.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasLiked || isLiking) return;
    setIsLiking(true);

    try {
      setLikes(prev => prev + 1);
      setHasLiked(true);
      localStorage.setItem(`liked-${product.id}`, 'true');

      const res = await fetch('/api/products/like', {
        method: 'POST',
        body: JSON.stringify({ productId: product.id })
      });
      if (!res.ok) throw new Error('Like failed');
    } catch (err) {
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
      className={`relative bg-[#111111] rounded-2xl overflow-hidden border border-white/5 light-mode:border-black shadow-lg ${viewType === 'list' ? 'flex flex-row items-stretch' : 'flex flex-col'}`}
    >
      <motion.div layout className={`relative overflow-hidden shrink-0 bg-[#0A0A0A] light-mode:!bg-gray-100 ${viewType === 'list' ? 'w-[35%] aspect-square border-r border-white/5 light-mode:!border-black' : 'w-full aspect-[4/3] border-b border-white/5 light-mode:!border-black'}`}>
        <img
          src={product.thumbnailUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </motion.div>
      <div className={`flex flex-col ${viewType === 'list' ? 'p-4 w-[65%] gap-2' : 'p-3 gap-2 flex-1'}`}>
        <div className="flex justify-between items-start gap-2">
          <motion.h3 layout className={`font-display font-bold tracking-tight line-clamp-2 ${viewType === 'list' ? 'text-base md:text-lg' : 'text-xs'}`}>
            {product.name}
          </motion.h3>
          <motion.span layout className={`text-secondary light-mode:text-blue-600 font-black shrink-0 ${viewType === 'list' ? 'text-sm md:text-base' : 'text-[10px]'}`}>
            {product.price}
          </motion.span>
        </div>
        
        {viewType === 'list' && (
          <motion.p layout className="text-xs md:text-sm text-white/50 light-mode:!text-black light-mode:!font-black leading-relaxed line-clamp-3">
            {product.description}
          </motion.p>
        )}

        {/* Stats Row */}
        <motion.div layout className="flex items-center gap-3 text-white/30 light-mode:!text-black text-xs md:text-sm light-mode:!font-black font-bold mt-auto pt-1">
          <div className="flex items-center gap-1.5">
            <Download size={12} />
            <span>{product.stats?.downloads || 0}</span>
          </div>
          <button 
            onClick={handleLike}
            disabled={hasLiked || isLiking}
            className={`flex items-center gap-1.5 transition-colors ${hasLiked ? 'text-purple-400' : 'hover:text-purple-400 disabled:opacity-50'}`}
          >
            {isLiking ? <Loader2 size={12} className="animate-spin" /> : <ThumbsUp size={12} className={hasLiked ? 'fill-purple-400' : ''} />}
            <span>{likes}</span>
          </button>
        </motion.div>

        {viewType === 'grid' && (
          <motion.button 
            layout
            onClick={() => setIsModalOpen(true)}
            className="mt-2 w-full py-2 text-[10px] font-display font-bold uppercase tracking-[0.2em] rounded-lg text-white bg-[#980ffa] hover:bg-[#a82ffb] hover:shadow-[0_0_16px_#980ffa] transition-all duration-200"
          >
            Comandă
          </motion.button>
        )}
      </div>
      
      {viewType === 'list' && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-3 right-3 px-4 py-2 text-[9px] font-display font-black uppercase tracking-[0.2em] bg-[#980ffa] text-white rounded-lg hover:bg-[#a82ffb] hover:shadow-[0_0_16px_#980ffa] hover:scale-[1.02] transition-all duration-200 shadow-lg"
        >
          Comandă
        </button>
      )}
      
      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={product} 
        waNumber={process.env.NEXT_PUBLIC_WA_NUMBER || '40765181199'} 
      />
    </motion.div>
  );
}
