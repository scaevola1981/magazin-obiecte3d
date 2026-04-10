'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List } from 'lucide-react';
import { Product } from '@/data/products';
import MobileProductCard from './MobileProductCard';

interface Props {
  products: Product[];
  query: string;
}

export default function MobileProductGrid({ products, query }: Props) {
  const [viewType, setViewType] = useState<'grid' | 'list'>('list');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold tracking-tight">Trending Models</h2>
        
        {/* View Switcher Toggle */}
        <div className="flex items-center bg-white/5 light-mode:!bg-black/5 border border-white/10 light-mode:!border-black/10 rounded-lg p-1">
          <button
            onClick={() => setViewType('list')}
            className={`p-2 rounded-md transition-all ${viewType === 'list' ? 'bg-white/10 light-mode:!bg-black/10 text-white light-mode:!text-black' : 'text-white/40 light-mode:!text-black/40 hover:text-white/80 light-mode:hover:!text-black/80'}`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewType('grid')}
            className={`p-2 rounded-md transition-all ${viewType === 'grid' ? 'bg-white/10 light-mode:!bg-black/10 text-white light-mode:!text-black' : 'text-white/40 light-mode:!text-black/40 hover:text-white/80 light-mode:hover:!text-black/80'}`}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      <motion.div 
        layout 
        data-product-count={products.length} 
        className={viewType === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-3' : 'flex flex-col gap-5'}
      >
        <AnimatePresence mode="popLayout">
          {products.length > 0 ? (
            products.map((product) => (
              <MobileProductCard key={product.id} product={product} viewType={viewType} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="col-span-full py-12 text-center"
            >
              <p className="text-white/40 light-mode:!text-black/40 text-sm font-display uppercase tracking-widest">Niciun model găsit pentru "{query}"</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
