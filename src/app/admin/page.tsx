'use client';

import { useState, useRef } from 'react';
import { Upload, Plus, CheckCircle, XCircle, Loader2, Lock, Image as ImageIcon, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  { value: 'planter', label: '🪴 Planter / Ghivece' },
  { value: 'birou', label: '✏️ Birou / Organizare' },
  { value: 'accesorii', label: '🎒 Accesorii' },
  { value: 'decor', label: '🎨 Decor' },
  { value: 'miniatures', label: '🎲 Miniaturi' },
  { value: 'altele', label: '📦 Altele' },
];

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('planter');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length > 3) setUnlocked(true);
    else setMessage('Parolă prea scurtă');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category) {
      setMessage('Completează toate câmpurile obligatorii.');
      return;
    }

    setStatus('uploading');
    setMessage('');

    let thumbnailUrl = null;

    // Step 1: upload image if selected
    if (imageFile) {
      const fd = new FormData();
      fd.append('password', password);
      fd.append('file', imageFile);
      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        setStatus('error');
        setMessage(uploadData.error || 'Upload eșuat');
        return;
      }
      thumbnailUrl = uploadData.url;
    }

    // Step 2: save product
    setStatus('saving');
    const res = await fetch('/api/admin/product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, name, description, price, category, thumbnailUrl }),
    });
    const data = await res.json();

    if (!res.ok) {
      setStatus('error');
      setMessage(data.error || 'Eroare la salvare');
      return;
    }

    setStatus('success');
    setMessage(`✅ Produs "${name}" adăugat cu succes!`);
    setName(''); setDescription(''); setPrice(''); setCategory('planter');
    setImageFile(null); setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Lock className="text-purple-400" size={24} />
            <h1 className="text-white font-bold text-xl tracking-tight">Admin Panel</h1>
          </div>
          <form onSubmit={handleUnlock} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Parolă admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500 text-sm"
            />
            {message && <p className="text-red-400 text-xs">{message}</p>}
            <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl transition-colors text-sm uppercase tracking-widest">
              Intră
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-16">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pt-4">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Plus size={16} className="text-purple-400" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Adaugă Produs</h1>
            <p className="text-white/30 text-xs">Printly Admin Panel</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Image Upload */}
          <div>
            <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Fotografie</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 transition-colors overflow-hidden"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-white/30">
                  <ImageIcon size={32} />
                  <span className="text-xs">Apasă pentru a alege foto</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Name */}
          <div>
            <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Nume produs *</label>
            <input
              type="text"
              placeholder="ex: Ghiveci Forma Inimă"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Preț *</label>
            <input
              type="text"
              placeholder="ex: 45 RON"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

          {/* Category Dropdown Custom */}
          <div className="relative z-50">
            <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Categorie *</label>
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-500 text-base text-left flex items-center justify-between transition-colors"
            >
              <span>{CATEGORIES.find(c => c.value === category)?.label}</span>
              <ChevronDown size={20} className={`text-white/50 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-[#111111] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => { setCategory(c.value); setIsCategoryOpen(false); }}
                    className={`w-full text-left px-4 py-4 text-base transition-colors hover:bg-white/10 ${category === c.value ? 'bg-purple-500/20 text-purple-300' : 'text-white'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2 block">Descriere</label>
            <textarea
              placeholder="Scurtă descriere a produsului..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500 text-sm resize-none"
            />
          </div>

          {/* Status Message */}
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
              status === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              status === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
              'bg-white/5 text-white/60 border border-white/10'
            }`}>
              {status === 'success' && <CheckCircle size={16} />}
              {status === 'error' && <XCircle size={16} />}
              {(status === 'uploading' || status === 'saving') && <Loader2 size={16} className="animate-spin" />}
              {message || (status === 'uploading' ? 'Se încarcă imaginea...' : 'Se salvează produsul...')}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'uploading' || status === 'saving'}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-sm uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {status === 'uploading' || status === 'saving' ? (
              <><Loader2 size={16} className="animate-spin" /> {status === 'uploading' ? 'Încarc imaginea...' : 'Salvez produsul...'}</>
            ) : (
              <><Plus size={16} /> Adaugă Produs</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
