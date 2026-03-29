'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] py-4 md:py-6 px-6 md:px-12 flex justify-between items-center transition-all duration-500 overflow-hidden`}>
      {/* Background HUD Glass Layer */}
      <div className={`absolute inset-0 transition-all duration-500 ${isScrolled ? 'bg-black/80 backdrop-blur-2xl border-b border-white/5 opacity-100' : 'bg-transparent opacity-0'}`}></div>
      
      {/* HUD Scanner Line */}
      <div className={`absolute bottom-0 left-0 h-[1px] bg-linear-to-r from-transparent via-primary/30 to-transparent transition-all duration-1000 ${isScrolled ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>

      <div className="relative flex justify-between items-center w-full max-w-7xl mx-auto">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
          <span className="text-xl md:text-2xl font-display font-black tracking-tighter uppercase whitespace-nowrap text-white">
            Print<span className="text-secondary">ly</span>
          </span>
        </Link>
        
        {/* Desktop Primary Nav (as seen in Stitch) */}
        <div className="hidden lg:flex items-center gap-10 text-[9px] font-display font-bold uppercase tracking-[0.4em] text-white/60">
          <Link href="#produse" className="hover:text-primary transition-colors hover:tracking-[0.5em] transition-all">Discover</Link>
          <Link href="#" className="hover:text-primary transition-colors">Materials</Link>
          <Link href="#" className="hover:text-primary transition-colors">Printers</Link>
          <Link href="#" className="hover:text-primary transition-colors">Studio</Link>
          <Link href="#" className="hover:text-primary transition-colors">Community</Link>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden lg:flex items-center gap-6 text-white/40">
            <button className="hover:text-secondary transition-colors"><Search size={18} /></button>
            <button className="hover:text-secondary transition-colors"><ShoppingCart size={18} /></button>
            <button className="hover:text-secondary transition-colors"><User size={18} /></button>
          </div>
          
          <Link 
            href={process.env.NEXT_PUBLIC_WA_NUMBER ? `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}` : "https://wa.me/40700000000"}
            className="px-6 py-2 border border-secondary text-secondary hover:bg-secondary hover:text-black transition-all duration-500 font-display font-bold text-[9px] uppercase tracking-[0.2em] relative overflow-hidden group hidden md:block"
          >
            <span className="relative z-10">Comandă WA</span>
          </Link>

          {/* Mobile Menu Toggle (only if needed, but we have bottom nav now) */}
          <button className="lg:hidden text-white/60 hover:text-white">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
