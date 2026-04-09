'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Download, Loader2 } from 'lucide-react';
import { Product } from '@/data/products';
import OrderModal from './OrderModal';

interface Props {
  product: Product;
}

export default function MobileProductCard({ product }: Props) {
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-low rounded-2xl overflow-hidden border border-white/5 shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.thumbnailUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-display font-bold tracking-tight">
            {product.name}
          </h3>
          <span className="text-sm text-secondary font-semibold">
            {product.price}
          </span>
        </div>
        <p className="text-xs text-white/60 leading-relaxed line-clamp-2 min-h-[32px]">
          {product.description}
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-white/30 text-xs font-bold mt-1">
          <div className="flex items-center gap-1.5">
            <Download size={14} />
            <span>{product.stats?.downloads || 0}</span>
          </div>
          <button 
            onClick={handleLike}
            disabled={hasLiked || isLiking}
            className={`flex items-center gap-1.5 transition-colors ${hasLiked ? 'text-purple-400' : 'hover:text-purple-400 disabled:opacity-50'}`}
          >
            {isLiking ? <Loader2 size={14} className="animate-spin" /> : <ThumbsUp size={14} className={hasLiked ? 'fill-purple-400' : ''} />}
            <span>{likes}</span>
          </button>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-2 inline-flex items-center justify-center w-full px-4 py-3 text-sm font-display font-bold uppercase tracking-[0.2em] bg-primary text-black rounded-xl hover:-translate-y-[1px] transition"
        >
          Cere pe WhatsApp
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
