'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Loader2, MessageCircle } from 'lucide-react';
import { Product } from '@/data/products';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  waNumber: string;
}

export default function OrderModal({ isOpen, onClose, product, waNumber }: OrderModalProps) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vă rugăm să introduceți un nume.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Create the order in Supabase
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: name.trim(),
          customNotes: notes.trim()
        })
      });

      if (!res.ok) {
        throw new Error('Nu s-a putut salva comanda. Vă rugăm să ne contactați direct.');
      }

      const data = await res.json();
      const orderId = data?.order?.id || 'NOUĂ';

      // Generate WhatsApp message
      let message = `Salut! Sunt ${name.trim()} și am înregistrat automat comanda #${orderId} pentru "${product.name}" (${product.price} RON).`;
      if (notes.trim()) {
        message += `\n\nDetalii extra din formular: ${notes.trim()}`;
      }
      message += `\n\nMă puteți ajuta cu mai multe detalii?`;
      
      // Open WhatsApp
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
      
      // Close modal
      onClose();
    } catch (err: any) {
      setError(err.message || 'Eroare necunoscută.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] bg-[#111] rounded-3xl border border-white/10 w-[90%] md:max-w-md shadow-2xl overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-display font-black tracking-tight text-white mb-2">Finalizare Comandă</h3>
                  <p className="text-white/60 text-sm">Ne bucurăm de alegerea ta! Lasă-ne numele tău înainte de a merge spre WhatsApp.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 mb-6">
                <img 
                  src={product.thumbnailUrl || '/placeholder-product.jpg'} 
                  alt={product.name} 
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-display font-bold text-white text-sm line-clamp-1">{product.name}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="font-mono text-base font-bold text-ag-accent">{product.price}</span>
                    <span className="font-mono text-[10px] text-ag-accent">RON</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Numele tău complet</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Alin Popescu"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                    required
                  />
                  {error && <p className="text-red-400 text-xs mt-2 font-medium">{error}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Detalii opționale (Culoare, Dimensiuni)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Îl doresc pe culoarea roșu, varianta mare..."
                    rows={2}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium resize-none text-sm"
                  />
                </div>

                <div className="flex items-start gap-2 pt-2 mb-4">
                  <input 
                      type="checkbox" 
                      id="gdpr" 
                      required
                      checked={gdprAccepted}
                      onChange={(e) => setGdprAccepted(e.target.checked)}
                      className="mt-1 bg-[#111] border-white/20 rounded focus:ring-purple-500 accent-purple-500 cursor-pointer"
                  />
                  <label htmlFor="gdpr" className="text-white/40 text-[10px] leading-tight select-none cursor-pointer">
                    Am citit și sunt de acord cu <a href="#" target="_blank" className="text-purple-400 hover:text-purple-300 underline">Politica de Confidențialitate</a>. Înțeleg că datele mele (nume și număr de telefon) vor fi procesate prin WhatsApp pentru onorarea comenzii.
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || !gdprAccepted}
                    className="w-full relative group overflow-hidden bg-[#25D366] text-black font-display font-bold text-sm uppercase tracking-widest px-6 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                    {isSubmitting ? (
                      <Loader2 size={18} className="animate-spin relative z-10" />
                    ) : (
                      <>
                        <MessageCircle size={18} className="relative z-10" />
                        <span className="relative z-10">Deschide WhatsApp</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-white/30 text-[10px] uppercase tracking-widest mt-4">Niciun card necesar. Plata se face ulterior.</p>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
