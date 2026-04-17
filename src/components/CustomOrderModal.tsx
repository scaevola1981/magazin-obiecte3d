'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, MessageCircle, Upload, ImageIcon, CheckCircle2 } from 'lucide-react';

interface CustomOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomOrderModal({ isOpen, onClose }: CustomOrderModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || '40765181199';

  const handleFileSelect = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Tip de fișier nepermis. Acceptăm JPG, PNG, WEBP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Fișierul este prea mare (max 5MB).');
      return;
    }
    setError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Vă rugăm să introduceți un nume.'); return; }
    if (!description.trim()) { setError('Vă rugăm să descrieți piesa dorită.'); return; }

    setIsSubmitting(true);
    setError('');

    try {
      // Upload image if selected
      let sketchUrl: string | undefined;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        console.log('Starting image upload for:', selectedFile.name);
        
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();

        if (uploadRes.ok) {
          sketchUrl = uploadData.url;
          console.log('Image upload successful. URL:', sketchUrl);
        } else {
          console.error('Image upload failed:', uploadData.error);
          throw new Error(uploadData.error || 'Eroare la încărcarea imaginii. Vă rugăm să încercați din nou.');
        }
      }

      console.log('Submitting order with payload:', { 
        name, 
        isCustomOrder: true, 
        sketchUrl 
      });

      // Save to Supabase
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          isCustomOrder: true,
          customDescription: description.trim(),
          customNotes: notes.trim() || undefined,
          sketchUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Eroare la salvarea comenzii.');

      const orderId = data?.order?.id || 'NOUĂ';

      // Build WhatsApp message
      let message = `Salut! Sunt *${name.trim()}* și am trimis o cerere de printare custom (Comanda #${orderId}).\n\n`;
      message += `📋 *Descriere piesă:*\n${description.trim()}\n`;
      if (notes.trim()) message += `\n📝 *Detalii extra:*\n${notes.trim()}\n`;
      if (sketchUrl) message += `\n🖼️ *Schiță/Poză:*\n${sketchUrl}\n`;
      message += `\nAș dori să discutăm detaliile comenzii. Mulțumesc!`;

      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
      onClose();
      // Reset form
      setName(''); setDescription(''); setNotes('');
      setSelectedFile(null); setPreviewUrl(null); setGdprAccepted(false);
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] bg-[#111] rounded-3xl border border-white/10 w-[92%] md:max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-md bg-[linear-gradient(135deg,#ff00ff,hsl(30,100%,50%))] flex items-center justify-center">
                      <div className="w-3 h-3 bg-black rounded-sm rotate-45 scale-75" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-400">Comandă Custom</span>
                  </div>
                  <h3 className="text-xl font-display font-black tracking-tight text-white">Printare la Comandă</h3>
                  <p className="text-white/50 text-sm mt-1">Descrie piesa dorită și atașează o schiță sau poză de referință.</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors shrink-0"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                    Numele tău complet <span className="text-fuchsia-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Alin Popescu"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all font-medium"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                    Descrie piesa dorită <span className="text-fuchsia-400">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Doresc un ghiveci în formă de pisică, dimensiuni aprox. 15cm x 10cm, culoare albă, cu detalii fine pe exterior..."
                    rows={4}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all font-medium resize-none text-sm"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                    Schiță / Poză de referință <span className="text-white/30">(opțional)</span>
                  </label>

                  {previewUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-fuchsia-500/30 bg-black/40">
                      <img src={previewUrl} alt="Preview" className="w-full h-40 object-contain" />
                      <button
                        type="button"
                        onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                        className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black rounded-full transition-colors"
                      >
                        <X size={14} className="text-white" />
                      </button>
                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-fuchsia-500/20 border border-fuchsia-500/30 rounded-full px-2 py-1">
                        <CheckCircle2 size={12} className="text-fuchsia-400" />
                        <span className="text-[10px] text-fuchsia-300 font-bold">{selectedFile?.name}</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                        isDragging
                          ? 'border-fuchsia-500 bg-fuchsia-500/10'
                          : 'border-white/10 hover:border-fuchsia-500/50 hover:bg-white/5 bg-black/30'
                      }`}
                    >
                      <div className="p-3 rounded-full bg-white/5 border border-white/10">
                        <Upload size={20} className="text-white/40" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-white/60 font-medium">Trage o imagine sau <span className="text-fuchsia-400 underline">selectează</span></p>
                        <p className="text-[11px] text-white/30 mt-1">JPG, PNG, WEBP · max 5MB</p>
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                    Detalii extra <span className="text-white/30">(culoare, material, termen)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Prefer PETG alb, urgent în 3 zile..."
                    rows={2}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all font-medium resize-none text-sm"
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                {/* GDPR */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="gdpr-custom"
                    required
                    checked={gdprAccepted}
                    onChange={(e) => setGdprAccepted(e.target.checked)}
                    className="mt-1 bg-[#111] border-white/20 rounded focus:ring-fuchsia-500 accent-fuchsia-500 cursor-pointer"
                  />
                  <label htmlFor="gdpr-custom" className="text-white/40 text-[10px] leading-tight select-none cursor-pointer">
                    Am citit și sunt de acord cu{' '}
                    <a href="#" target="_blank" className="text-fuchsia-400 hover:text-fuchsia-300 underline">
                      Politica de Confidențialitate
                    </a>
                    . Înțeleg că datele mele vor fi transmise prin WhatsApp pentru procesarea comenzii.
                  </label>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || !description.trim() || !gdprAccepted}
                    className="w-full relative group overflow-hidden bg-[#25D366] text-black font-display font-bold text-sm uppercase tracking-widest px-6 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    {isSubmitting ? (
                      <Loader2 size={18} className="animate-spin relative z-10" />
                    ) : (
                      <>
                        <MessageCircle size={18} className="relative z-10" />
                        <span className="relative z-10">Trimite cererea pe WhatsApp</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-white/30 text-[10px] uppercase tracking-widest mt-4">
                    Vei fi contactat pentru confirmare și preț.
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
