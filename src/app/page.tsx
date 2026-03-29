import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000000] text-white font-sans selection:bg-primary selection:text-black">
      {/* Hero Section - Kinetic HUD Header */}
      <section className="relative pt-48 pb-32 px-6 md:px-12 flex flex-col items-center overflow-hidden border-b border-white/5">
        {/* Large Decorative HUD Crosshair Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen opacity-10 pointer-events-none stroke-primary/30">
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 3" />
            <path d="M50 0 V100 M0 50 H100" stroke="currentColor" strokeWidth="0.05" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col gap-8 max-w-7xl w-full">
          <div className="flex flex-col md:flex-row items-baseline gap-6 justify-center text-center md:text-left">
            <h1 className="text-6xl md:text-[14rem] font-display font-black leading-[0.85] uppercase tracking-[-0.06em] text-white italic skew-x-[-10deg]">
              PURE <span className="text-primary drop-shadow-[0_0_30px_rgba(211,148,255,0.4)]">DIGITAL</span>
            </h1>
            <div className="flex items-center gap-4 text-[10px] md:text-xs font-display font-bold tracking-[0.6em] uppercase text-secondary/60">
              <div className="pulse-cyan"></div>
              [ SYSTEM_ACTIVE ]
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-12 mt-8 md:-mt-24">
            <div className="max-w-xs text-secondary/40 text-[9px] md:text-[10px] font-display font-bold leading-relaxed uppercase tracking-widest border-l border-secondary/20 pl-8 order-2 md:order-1">
              Exploring the convergence of physical form and digital synthesis through architectural 3D objects.
            </div>
            <h2 className="text-6xl md:text-[14rem] font-display font-black leading-[0.85] uppercase tracking-[-0.06em] text-white italic skew-x-[-10deg] order-1 md:order-2 self-end">
              LOVE <span className="text-secondary drop-shadow-[0_0_30px_rgba(0,227,253,0.4)]">3D</span>
            </h2>
          </div>
        </div>

        {/* HUD Data Trace Elements */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-32 hidden lg:flex">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col gap-2">
              <div className="w-1 h-32 bg-linear-to-b from-transparent via-primary/20 to-transparent"></div>
              <div className="text-[8px] font-display text-primary/30 rotate-90 origin-left ml-2">DATA_STREAM_00{i}</div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator - HUD Style */}
        <div className="mt-48 flex flex-col items-center gap-6 relative group cursor-pointer animate-pulse">
           <div className="w-px h-24 bg-linear-to-b from-primary/60 to-transparent"></div>
           <span className="text-[8px] font-display font-bold tracking-[0.5em] text-primary/60 uppercase">Seek_Gallery</span>
        </div>
      </section>

      {/* Product List Section - Asymmetrical Kinetic Grid */}
      <section id="produse" className="px-6 md:px-12 py-32 md:py-64 overflow-hidden relative">
        <div className="absolute inset-0 bg-radial-gradient from-primary/[0.02] to-transparent opacity-50"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col gap-48 md:gap-96">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Call to Action - Futuristic HUD */}
      <section className="bg-surface-low relative py-48 md:py-64 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent"></div>
        
        <h2 className="text-5xl md:text-[12rem] font-display font-black leading-none uppercase tracking-tighter mb-16 italic skew-x-[-10deg]">
          Start Your <br />
          <span className="text-transparent stroke-primary stroke-2">Collection</span>
        </h2>
        
        <a 
          href="https://wa.me/40700000000" 
          className="btn-neon group flex items-center gap-6 text-xl md:text-2xl font-display font-black"
        >
          SYNC_WHATSAPP
          <span className="text-3xl md:text-4xl transition-transform duration-500 group-hover:translate-x-4">→</span>
        </a>
      </section>

      {/* Footer - Minimal & HUD Aesthetic */}
      <footer className="py-24 px-6 md:px-12 flex flex-col md:flex-row justify-between items-end gap-12 font-display font-bold uppercase text-[9px] tracking-[0.4em] text-secondary/30 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-secondary/10 to-transparent"></div>
        
        <div className="flex flex-col gap-4">
          <div className="text-white text-2xl font-black mb-2 tracking-tighter italic">LOVE<span className="text-secondary opacity-100">3D</span>.</div>
          <p>© 2024 Kinetic Atelier LAB // PROD_VER_2.1</p>
          <p>Coordinates: 44.4268° N, 26.1025° E [Bucharest, RO]</p>
        </div>
        
        <div className="flex gap-16">
          <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full"></div>
            Archive
          </a>
          <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full"></div>
            Protocol
          </a>
          <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full"></div>
            Privacy
          </a>
        </div>
      </footer>
    </main>
  );
}
