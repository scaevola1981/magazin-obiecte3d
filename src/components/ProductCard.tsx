'use client';

import { Product } from '@/data/products';
import ModelViewer from './ModelViewer';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const handleWhatsAppOrder = () => {
    const phoneNumber = '40700000000'; // Placeholder
    const message = encodeURIComponent(
      `Salut! Doresc să comand produsul: ${product.name} (Pret: ${product.price}).`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      className={`relative flex flex-col pt-12 md:pt-24 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}
    >
      {/* Index Number */}
      <span className="absolute top-0 left-0 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-300">
        [ Model_Ref: 00{product.id} ]
      </span>

      {/* Model Viewer Container */}
      <div className="relative aspect-[4/5] bg-[#F9F9F9] group overflow-visible">
        <ModelViewer 
          src={product.modelUrl} 
          alt={product.name} 
          poster={product.thumbnailUrl}
        />
        
        {/* Overlapping Price */}
        <div className="absolute -bottom-6 -right-4 bg-black text-white px-6 py-3 font-display text-2xl tracking-tight z-20">
          {product.price}
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-12 flex flex-col md:flex-row justify-between items-start gap-6 border-b border-black/10 pb-12">
        <div className="max-w-xs">
          <h3 className="text-4xl md:text-5xl font-display font-bold leading-none mb-4 uppercase tracking-tighter">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed uppercase tracking-wider">
            {product.description}
          </p>
        </div>
        
        <button
          onClick={handleWhatsAppOrder}
          className="group relative px-8 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] overflow-hidden transition-all duration-300 hover:pr-12"
        >
          <span className="relative z-10 font-bold">Comandă Acum</span>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">→</span>
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold">WhatsApp Order</span>
        </button>
      </div>
    </motion.div>
  );
}
