'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Settings as SettingsIcon, Euro, Battery, Trash2 } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const { theme, toggleTheme, reducedMotion, toggleReducedMotion } = useTheme();

  const handleClearData = () => {
    if (confirm('Ești sigur că vrei să ștergi memoria locală (Likes & Setări)?')) {
      localStorage.clear();
      window.location.reload();
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
            className="fixed inset-0 bg-black/80 z-[101] backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 w-full z-[102] bg-[#111] light-mode:bg-white rounded-t-3xl border-t border-white/10 p-6 md:p-8 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  <SettingsIcon size={20} className="text-white light-mode:text-black" />
                </div>
                <h3 className="text-xl font-display font-black tracking-tight text-white light-mode:text-black">Preferințe</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white light-mode:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 bg-black/40 light-mode:bg-gray-100 rounded-2xl border border-white/5 light-mode:border-gray-200">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon size={20} className="text-purple-400" /> : <Sun size={20} className="text-orange-400" />}
                  <div>
                    <div className="font-bold text-sm text-white light-mode:text-black">Afișaj Sistem</div>
                    <div className="text-[10px] text-white/40 light-mode:text-black/40 uppercase tracking-widest">{theme === 'dark' ? 'Mod Noapte' : 'Mod Zi'}</div>
                  </div>
                </div>
                <button 
                  onClick={toggleTheme}
                  className="px-4 py-2 bg-white/10 light-mode:bg-white hover:bg-white/20 rounded-lg text-xs font-bold transition-all text-white light-mode:text-black light-mode:border light-mode:border-gray-200"
                >
                  {theme === 'dark' ? 'Schimbă la Zi' : 'Schimbă la Noapte'}
                </button>
              </div>

              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between p-4 bg-black/40 light-mode:bg-gray-100 rounded-2xl border border-white/5 light-mode:border-gray-200">
                <div className="flex items-center gap-3">
                  <Battery size={20} className={reducedMotion ? "text-green-400" : "text-white/40 light-mode:text-black/40"} />
                  <div>
                    <div className="font-bold text-sm text-white light-mode:text-black">Oprește Animațiile</div>
                    <div className="text-[10px] text-white/40 light-mode:text-black/40 uppercase tracking-widest">Economisire Baterie</div>
                  </div>
                </div>
                <button 
                  onClick={toggleReducedMotion}
                  className={`relative w-12 h-6 rounded-full transition-colors ${reducedMotion ? 'bg-green-500' : 'bg-white/20 light-mode:bg-gray-300'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${reducedMotion ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Currency Selector (Visual only for now) */}
              <div className="flex items-center justify-between p-4 bg-black/40 light-mode:bg-gray-100 rounded-2xl border border-white/5 light-mode:border-gray-200 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <Euro size={20} className="text-white/40 light-mode:text-black/40" />
                  <div>
                    <div className="font-bold text-sm text-white light-mode:text-black">Moneda (Curând)</div>
                    <div className="text-[10px] text-white/40 light-mode:text-black/40 uppercase tracking-widest">RON / EUR</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-white/40">RON</div>
              </div>

              {/* Clear Data */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <button 
                  onClick={handleClearData}
                  className="flex items-center gap-2 w-full justify-center px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors font-bold text-xs"
                >
                  <Trash2 size={16} />
                  Șterge Cache Local (Resetare)
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
