'use client';

import { motion } from 'framer-motion';
import ModelViewer from './ModelViewer';

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  modelUrl: string;
  thumbnailUrl?: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const isEven = index % 2 === 0;

  const handleWhatsAppOrder = () => {
    const message = `Buna ziua! Sunt interesat de produsul ${product.name} (${product.price}). Puteți confirma disponibilitatea și materialul recomandat?`;
    const encodedMessage = encodeURIComponent(message);
    const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || "40700000000";
    const whatsappUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex flex-col pt-12 md:pt-24 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}
    >
      {/* HUD Index Overlay */}
      <div className="absolute top-0 left-0 flex items-center gap-4 text-[9px] font-display font-bold tracking-[0.4em] uppercase text-primary/40">
        <span className="w-8 h-px bg-primary/20"></span>
        [ UNIT_REF_00{product.id} ]
      </div>

      {/* Model Viewer Container - Glassmorphism style */}
      <div className="relative aspect-square bg-[#0E0E0E] group overflow-visible border border-white/5 rounded-2xl shadow-2xl glass-card transition-all duration-700 hover:border-primary/20">
        {/* Refractive Edge Strobe (Top-stroke simulator) */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary-dim/30 to-transparent"></div>
        
        <ModelViewer 
          src={product.modelUrl} 
          alt={product.name} 
          poster={product.thumbnailUrl}
        />
        
        {/* Cyber Price Tag */}
        <div className="absolute -bottom-4 md:-bottom-6 -right-2 md:-right-4 bg-primary text-black px-6 md:px-8 py-3 md:py-4 font-display text-xl md:text-3xl font-black italic tracking-tighter z-20 skew-x-[-12deg] shadow-[0_0_20px_rgba(211,148,255,0.4)]">
          {product.price}
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-8 md:mt-16 flex flex-col md:flex-row justify-between items-start gap-8 border-t border-white/5 pt-12 md:pt-16">
        <div className="max-w-md">
          <h3 className="text-4xl md:text-7xl font-display font-black leading-none mb-6 uppercase tracking-tighter text-white group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-400 text-[10px] md:text-xs font-medium leading-relaxed uppercase tracking-[0.2em] border-l-2 border-primary/20 pl-6">
            {product.description}
          </p>
        </div>
        
        <button
          onClick={handleWhatsAppOrder}
          className="group relative w-full md:w-auto px-12 py-6 bg-transparent border border-white/10 text-[10px] font-display font-bold uppercase tracking-[0.4em] overflow-hidden transition-all duration-500 hover:border-primary"
        >
          <span className="relative z-10 text-white group-hover:text-black">Comandă HUD_INT</span>
          <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
          
          {/* Decorative Corner Brackets */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/40 group-hover:border-black opacity-100"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/40 group-hover:border-black opacity-100"></div>
        </button>
      </div>

      {/* Background Decorative Data Trace */}
      <div className="absolute -z-10 bottom-0 left-12 h-64 w-px bg-linear-to-b from-primary/10 to-transparent opacity-20 hidden md:block"></div>
    </motion.div>
  );
}
