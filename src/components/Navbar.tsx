'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 py-8 px-6 md:px-12 flex justify-between items-center mix-blend-difference text-white">
      <Link href="/" className="text-2xl font-black md:text-3xl tracking-tighter uppercase whitespace-nowrap">
        Artifacts<span className="font-light">3D</span>
      </Link>
      <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em]">
        <Link href="#produse" className="hover:opacity-50 transition-opacity">
          Gallery
        </Link>
        <Link href="https://wa.me/40700000000" className="bg-white text-black px-4 py-2 hover:bg-gray-200 transition-colors">
          Contact
        </Link>
      </div>
    </nav>
  );
}
