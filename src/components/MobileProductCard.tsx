'use client';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: string;
  thumbnailUrl: string;
  description: string;
}

interface Props {
  product: Product;
}

export default function MobileProductCard({ product }: Props) {
  const message = encodeURIComponent(
    `Salut! Vreau să comand ${product.name} (${product.price}).`
  );
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER;

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
        <p className="text-xs text-white/60 leading-relaxed">
          {product.description}
        </p>
        <a
          href={`https://wa.me/${waNumber}?text=${message}`}
          className="mt-2 inline-flex items-center justify-center w-full px-4 py-3 text-sm font-display font-bold uppercase tracking-[0.2em] bg-primary text-black rounded-xl hover:-translate-y-[1px] transition"
        >
          Cere pe WhatsApp
        </a>
      </div>
    </motion.div>
  );
}
