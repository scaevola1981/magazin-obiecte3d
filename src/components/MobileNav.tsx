'use client';

import { Home, Search, PlusSquare, ShoppingBag, User } from 'lucide-react';

export default function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] md:hidden px-4 pb-8">
      <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full h-16 flex items-center justify-around px-2 relative overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {/* Neon Indicator Background */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none"></div>
        
        {/* HUD Scanner Line (Static) */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-secondary/30 to-transparent"></div>

        <button className="flex flex-col items-center justify-center w-12 h-12 text-secondary group">
          <Home size={20} />
          <span className="text-[7px] font-display font-bold uppercase tracking-widest mt-1">Home</span>
          <div className="w-1 h-1 bg-secondary rounded-full mt-1 animate-pulse"></div>
        </button>

        <button className="flex flex-col items-center justify-center w-12 h-12 text-white/40 hover:text-white transition-colors">
          <Search size={20} />
          <span className="text-[7px] font-display font-bold uppercase tracking-widest mt-1">Search</span>
        </button>

        <button className="flex flex-col items-center justify-center w-14 h-14 bg-primary text-black rounded-full -mt-6 shadow-[0_0_20px_rgba(211,148,255,0.4)] active:scale-90 transition-transform">
          <PlusSquare size={24} />
        </button>

        <button className="flex flex-col items-center justify-center w-12 h-12 text-white/40 hover:text-white transition-colors">
          <ShoppingBag size={20} />
          <span className="text-[7px] font-display font-bold uppercase tracking-widest mt-1">Orders</span>
        </button>

        <button className="flex flex-col items-center justify-center w-12 h-12 text-white/40 hover:text-white transition-colors">
          <User size={20} />
          <span className="text-[7px] font-display font-bold uppercase tracking-widest mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
}
