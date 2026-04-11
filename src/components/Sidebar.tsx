'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Home, 
  Search,
  X,
  Settings,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import { useRef } from 'react';
import SettingsModal from './SettingsModal';
import CustomOrderModal from './CustomOrderModal';

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCustomOrderOpen, setIsCustomOrderOpen] = useState(false);
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || '40765181199';

  // Secret admin tap counter
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSecretTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      router.push('/admin');
    } else {
      tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 1500);
    }
  };

  // Sync URL → local state (when URL changes externally, e.g. from mobile nav)
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    setSearchValue(urlQuery);
  }, [searchParams]);

  // Local state → URL (debounced, only triggered by user typing)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const currentUrlQuery = searchParams.get('q') || '';
      if (searchValue === currentUrlQuery) return; // already in sync, skip

      const params = new URLSearchParams(searchParams.toString());
      if (searchValue) {
        params.set('q', searchValue);
      } else {
        params.delete('q');
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]); // ← only searchValue, NOT searchParams (avoids stale closure re-push)

  const handleHomeClick = () => {
    handleSecretTap(); // Add to click count for admin access
    setIsSearching(false);
    setSearchValue('');
    router.push('/', { scroll: false });
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0A0A0A] light-mode:!bg-gray-50 border-r border-white/5 light-mode:!border-black/10 z-50 pt-3">
      {/* Brand Logo */}
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[linear-gradient(135deg,#ff00ff,hsl(30,100%,50%))] border border-white/20 light-mode:!border-black/20 flex items-center justify-center">
          <div className="w-4 h-4 bg-black rounded-sm rotate-45"></div>
        </div>
        <span className="text-xl font-display font-black tracking-tighter uppercase text-white light-mode:!text-black hover:cursor-pointer" onClick={handleHomeClick}>
          BLOOM<span className="bg-[linear-gradient(135deg,#ff00ff,#ff1493)] bg-clip-text text-transparent">FORM</span>
        </span>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto no-scrollbar">
        {/* Navigation Group with Border */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-2 space-y-1">
          {/* Home Link */}
          <button
            onClick={handleHomeClick}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all group ${!searchParams.get('q') && !isSearching ? 'text-white bg-white/5 light-mode:!bg-black/5 light-mode:!text-black' : 'text-white/60 hover:text-white hover:bg-white/5 light-mode:!text-black/60 light-mode:hover:!text-black light-mode:hover:!bg-black/5'}`}
          >
            <Home size={20} className={`${!searchParams.get('q') && !isSearching ? 'text-primary' : 'group-hover:text-primary'} transition-colors`} />
            <span>Acasa</span>
          </button>

          {/* Search Button / Input */}
          {!isSearching && !searchParams.get('q') ? (
            <button
              onClick={() => setIsSearching(true)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 light-mode:!text-black/60 light-mode:hover:!text-black light-mode:hover:!bg-black/5 transition-all group"
            >
              <Search size={20} className="group-hover:text-secondary transition-colors" />
              <span>Cauta</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 mx-1">
              <Search size={18} className="text-secondary shrink-0" />
              <input 
                autoFocus
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
                className="flex-1 bg-transparent border-none text-sm text-white light-mode:!text-black placeholder:text-white/40 light-mode:placeholder:!text-black/40 focus:ring-0 outline-hidden h-8"
              />
              <button 
                onClick={() => {
                  setIsSearching(false);
                  setSearchValue('');
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete('q');
                  router.replace(`?${params.toString()}`, { scroll: false });
                }}
                className="p-1 hover:bg-white/10 rounded-full text-white/40 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Custom Order Button - WhatsApp */}
          <button
            onClick={() => setIsCustomOrderOpen(true)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-fuchsia-500 light-mode:!text-fuchsia-600 hover:text-fuchsia-400 hover:bg-purple-500/20 light-mode:hover:!bg-purple-600/10 group transition-all"
          >
            <div className="bg-purple-500/10 p-1.5 rounded-lg border border-purple-500/30 group-hover:bg-purple-500 group-hover:border-purple-500 transition-colors">
              <MessageCircle size={16} className="text-purple-400 group-hover:text-white" />
            </div>
            <span className="transition-colors">Printare la comanda</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 light-mode:!text-black/60 light-mode:hover:!text-black light-mode:hover:!bg-black/5 transition-all group"
          >
            <Settings size={20} className="transition-colors" />
            <span>Setări</span>
          </button>
        </div>
      </nav>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
      <CustomOrderModal
        isOpen={isCustomOrderOpen}
        onClose={() => setIsCustomOrderOpen(false)}
      />
    </aside>
  );
}
