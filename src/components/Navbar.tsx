'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
    <nav className={`fixed top-0 left-0 w-full z-50 py-6 md:py-8 px-6 md:px-12 flex justify-between items-center transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-md py-4 md:py-6' : 'bg-transparent'}`}>
      <Link href="/" className={`text-2xl font-black md:text-3xl tracking-tighter uppercase whitespace-nowrap transition-colors duration-500 ${isScrolled ? 'text-black' : 'text-black md:text-white md:mix-blend-difference'}`}>
        LOVE3D
      </Link>
      
      <div className="flex items-center gap-6 md:gap-12 text-[10px] font-bold uppercase tracking-[0.4em]">
        <Link href="#produse" className={`hover:opacity-50 transition-all duration-500 ${isScrolled ? 'text-black' : 'text-black md:text-white md:mix-blend-difference'}`}>
          Gallery
        </Link>
        <Link 
          href="https://wa.me/40700000000" 
          className={`px-4 py-2 transition-all duration-500 ${isScrolled ? 'bg-black text-white' : 'bg-black text-white md:bg-white md:text-black hover:bg-gray-200'}`}
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}
