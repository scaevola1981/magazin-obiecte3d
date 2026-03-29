'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
    <nav className={`fixed top-0 left-0 w-full z-[100] py-6 md:py-8 px-6 md:px-12 flex justify-between items-center transition-all duration-500 overflow-hidden`}>
      {/* Background HUD Glass Layer */}
      <div className={`absolute inset-0 transition-all duration-500 ${isScrolled ? 'bg-black/40 backdrop-blur-xl border-b border-white/5 opacity-100' : 'bg-transparent opacity-0'}`}></div>
      
      {/* HUD Scanner Line */}
      <div className={`absolute bottom-0 left-0 h-[1px] bg-linear-to-r from-transparent via-primary/30 to-transparent transition-all duration-1000 ${isScrolled ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>

      <div className="relative flex justify-between items-center w-full max-w-7xl mx-auto">
        <Link href="/" className={`text-2xl font-display font-black md:text-3xl tracking-tighter uppercase whitespace-nowrap transition-colors duration-500 text-white flex items-center gap-2 group`}>
          <div className="w-2 h-2 bg-secondary rounded-full group-hover:scale-150 transition-transform"></div>
          LOVE<span className="text-secondary font-light">3D</span>
          <span className="ml-2 text-[8px] tracking-[0.4em] opacity-30 hidden md:block">ver. 2.0_HUD</span>
        </Link>
        
        <div className="flex items-center gap-6 md:gap-12 text-[10px] font-display font-bold uppercase tracking-[0.4em]">
          <Link href="#produse" className={`hover:text-primary transition-all duration-300 relative group`}>
            Gallery
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            href="https://wa.me/40700000000" 
            className={`px-6 py-2 border border-secondary text-secondary hover:bg-secondary hover:text-black transition-all duration-500 font-bold tracking-[0.2em] relative overflow-hidden group`}
          >
            <span className="relative z-10">Contact</span>
            <div className="absolute inset-x-0 top-0 h-px bg-white/20"></div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
