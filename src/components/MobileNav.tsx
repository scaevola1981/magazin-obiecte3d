'use client';

import { Home, Search, X, Grid, MessageCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MobileNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || '40765181199';
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');

  // Secret admin tap counter (5 taps on the nav bar edge)
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

  // Sync URL → local state
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    setSearchValue(urlQuery);
  }, [searchParams]);

  // Local state → URL (debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const currentUrlQuery = searchParams.get('q') || '';
      if (searchValue === currentUrlQuery) return;

      const params = new URLSearchParams(searchParams.toString());
      if (searchValue) {
        params.set('q', searchValue);
      } else {
        params.delete('q');
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const handleHomeClick = () => {
    setIsSearching(false);
    setSearchValue('');
    router.push('/', { scroll: false });
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] md:hidden px-4 pb-8">
      <div className={`bg-black/90 backdrop-blur-3xl border border-white/10 rounded-full h-16 flex items-center transition-all duration-500 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ${isSearching ? 'px-6 gap-3' : 'justify-between px-6'}`}>
        {/* Neon Indicator Background */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none rounded-full"></div>

        {/* Secret admin tap zone — invisible, top-right corner of nav bar */}
        {!isSearching && (
          <button
            onClick={handleSecretTap}
            aria-hidden="true"
            className="absolute right-4 top-0 w-8 h-8 opacity-0"
            tabIndex={-1}
          />
        )}

        {!isSearching ? (
          <>
            <button
              onClick={handleHomeClick}
              className={`flex flex-col items-center justify-center w-12 h-12 transition-colors ${!searchParams.get('q') && searchParams.get('tab') !== 'categories' && !isSearching ? 'text-secondary' : 'text-white/40 hover:text-white'}`}
            >
              <Home size={20} />
              <span className="text-[7px] font-display font-bold uppercase tracking-widest mt-1">Home</span>
              {(!searchParams.get('q') && searchParams.get('tab') !== 'categories') && <div className="w-1 h-1 bg-secondary rounded-full mt-1 animate-pulse absolute bottom-1"></div>}
            </button>

            <button
              onClick={() => { setIsSearching(false); router.push('/?tab=categories', { scroll: false }); }}
              className={`flex flex-col items-center justify-center w-12 h-12 transition-colors ${searchParams.get('tab') === 'categories' ? 'text-primary' : 'text-white/40 hover:text-white'}`}
            >
              <Grid size={20} />
              <span className="text-[7px] font-display font-bold uppercase tracking-widest mt-1">Catalog</span>
              {searchParams.get('tab') === 'categories' && <div className="w-1 h-1 bg-primary rounded-full mt-1 animate-pulse absolute bottom-1"></div>}
            </button>

            {/* Custom Order Button - Highlighted */}
            <a
              href={`https://wa.me/${waNumber}?text=Salut, vreau si eu o lucrare 3D la comanda. Putem discuta detaliile?`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center w-12 h-12 transition-all hover:scale-110 text-white group"
            >
              <div className="bg-purple-500/20 p-2.5 rounded-full border border-purple-500 group-hover:bg-purple-500 transition-colors">
                <MessageCircle size={18} className="text-purple-400 group-hover:text-white" />
              </div>
            </a>

            <button
              onClick={() => setIsSearching(true)}
              className={`flex flex-col items-center justify-center w-12 h-12 transition-colors ${searchParams.get('q') ? 'text-primary' : 'text-white/40 hover:text-white'}`}
            >
              <Search size={20} />
              <span className="text-[7px] font-display font-bold uppercase tracking-widest mt-1">Search</span>
              {searchParams.get('q') && <div className="w-1 h-1 bg-primary rounded-full mt-1 animate-pulse absolute bottom-1"></div>}
            </button>
          </>
        ) : (
          <div className="flex-1 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <Search size={18} className="text-primary shrink-0" />
             <input
               autoFocus
               type="text"
               placeholder="Search blueprints..."
               value={searchValue}
               onChange={(e) => setSearchValue(e.target.value)}
               className="flex-1 bg-transparent border-none text-sm text-white placeholder:text-white/40 focus:ring-0 outline-hidden h-full"
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
                <X size={18} />
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
