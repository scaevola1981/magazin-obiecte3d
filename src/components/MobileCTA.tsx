'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA only on mobile and only after scrolling past 500px
      const isMobile = window.innerWidth <= 768;
      const hasScrolled = window.scrollY > 500;
      setShow(isMobile && hasScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed bottom-8 left-0 w-full px-6 z-[100] md:hidden"
        >
          <a
            href="https://wa.me/40700000000"
            className="flex items-center justify-between w-full h-16 bg-black text-white px-8 rounded-full shadow-2xl active:scale-95 transition-transform"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Comandă pe WhatsApp</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Live Now</span>
            </div>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
