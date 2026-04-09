'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Home, 
  Search,
  X,
  Settings,
  HelpCircle
} from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');

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
    setIsSearching(false);
    setSearchValue('');
    router.push('/', { scroll: false });
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0A0A0A] border-r border-white/5 z-50 pt-6">
      {/* Brand Logo */}
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
          <div className="w-4 h-4 bg-black rounded-sm rotate-45"></div>
        </div>
        <span className="text-xl font-display font-black tracking-tighter uppercase text-white hover:cursor-pointer" onClick={handleHomeClick}>
          BLOOM<span className="text-secondary">FORM</span>
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-4 overflow-y-auto no-scrollbar">
        <div className="space-y-2">
          {/* Home Link */}
          <button
            onClick={handleHomeClick}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all group ${!searchParams.get('q') && !isSearching ? 'text-white bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <Home size={20} className={`${!searchParams.get('q') && !isSearching ? 'text-primary' : 'group-hover:text-primary'} transition-colors`} />
            <span>Home</span>
          </button>

          {/* Search Button / Input */}
          {!isSearching && !searchParams.get('q') ? (
            <button
              onClick={() => setIsSearching(true)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all group"
            >
              <Search size={20} className="group-hover:text-secondary transition-colors" />
              <span>Search</span>
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
                    // Just blur to confirm search, the debounce handles the routing
                    e.currentTarget.blur();
                  }
                }}
                className="flex-1 bg-transparent border-none text-sm text-white placeholder:text-white/40 focus:ring-0 outline-hidden h-8"
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
        </div>
      </nav>
    </aside>
  );
}
