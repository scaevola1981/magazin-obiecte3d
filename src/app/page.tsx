import ProductCard from '@/components/ProductCard';
import MobileProductCard from '@/components/MobileProductCard';
import { products } from '@/data/products';
import { Layers, Activity, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000000] text-white font-sans selection:bg-primary selection:text-black pb-24 md:pb-0">
      {/* Mobile layout */}
      <section className="md:hidden px-4 pt-20 pb-28 flex flex-col gap-8 max-w-xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary"></div>
            <div className="text-lg font-display font-bold tracking-tight">Printly</div>
          </div>
          <div className="flex items-center gap-3 text-white/60 text-xs font-display uppercase tracking-[0.2em]">
            <span>Recent Prints</span>
            <span className="w-8 h-[1px] bg-white/20"></span>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1503389152951-9f343605f61e?q=80&w=1400&auto=format&fit=crop"
            alt="Hero print"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute inset-0 p-6 flex flex-col justify-end gap-3">
            <div className="text-xs font-display uppercase tracking-[0.35em] text-secondary">Community Picks</div>
            <h1 className="text-3xl font-display font-black leading-tight">Print Your Reality</h1>
            <p className="text-sm text-white/70">
              Modele curente validate de comunitate, gata de print sau personalizare.
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || '40700000000'}?text=${encodeURIComponent('Salut! Aș vrea o ofertă pentru un print 3D personalizat.')}`}
              className="inline-flex w-fit items-center gap-2 px-4 py-3 bg-primary text-black font-display font-bold uppercase tracking-[0.2em] rounded-xl"
            >
              Cere ofertă
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['Toate', 'Arte', 'Tools', 'Spare Parts', 'Automotive', 'Cosplay'].map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 text-xs font-display uppercase tracking-[0.2em] rounded-full border border-white/10 bg-white/5 text-white/80 whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold tracking-tight">Trending Models</h2>
            <span className="text-xs text-secondary font-display uppercase tracking-[0.2em]">Browse All</span>
          </div>
          <div className="flex flex-col gap-5">
            {products.map((product) => (
              <MobileProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <div className="hidden md:block">
      {/* Desktop layout */}
      <section className="relative pt-32 md:pt-64 pb-24 px-6 md:px-12 flex flex-col items-center overflow-hidden border-b border-white/5">
        {/* Large Decorative HUD Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen opacity-10 pointer-events-none stroke-primary/30">
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 3" />
          </svg>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl w-full">
          {/* Main Title Area */}
          <div className="lg:col-span-8 flex flex-col gap-6 md:gap-12">
             <div className="flex flex-col md:flex-row items-baseline gap-6 text-center md:text-left">
                <h1 className="text-6xl md:text-[10rem] font-display font-black leading-[0.85] uppercase tracking-[-0.06em] text-white">
                  The <span className="text-primary drop-shadow-[0_0_30px_rgba(211,148,255,0.4)]">Kinetic</span>
                </h1>
                <div className="flex items-center gap-4 text-[10px] md:text-xs font-display font-bold tracking-[0.6em] uppercase text-secondary/60">
                  <div className="pulse-cyan"></div>
                  [ LIVE_PRINT_SYNC ]
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-12 mt-4 md:-mt-10">
                <div className="max-w-xs text-secondary/40 text-[9px] md:text-[10px] font-display font-bold leading-relaxed uppercase tracking-widest border-l border-secondary/20 pl-8 order-2 md:order-1 hidden lg:block">
                  Marketplace de printare 3D cu modele pregătite de fabricat, materiale verificate și livrare rapidă.
                </div>
                <h2 className="text-6xl md:text-[10rem] font-display font-black leading-[0.85] uppercase tracking-[-0.06em] text-white order-1 md:order-2 self-end">
                  Atelier
                </h2>
              </div>
              
              <div className="flex gap-4 mt-8 justify-center md:justify-start">
                  <button className="btn-neon font-display font-black tracking-[0.2em] text-[10px] md:text-xs">Launch Studio</button>
                  <button className="px-8 py-4 border border-white/20 hover:border-white transition-all font-display font-bold text-[10px] md:text-xs uppercase tracking-widest">View Showcase →</button>
              </div>
          </div>

          {/* Featured Material Card (Stitch: Obsidian Carbon) - Visible only on Desktop */}
          <div className="lg:col-span-4 hidden lg:flex flex-col justify-end">
             <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10 group-hover:bg-primary/20 transition-all"></div>
                
                <div className="flex items-center gap-4 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                   <div className="w-10 h-[1.5px] bg-primary"></div>
                   Featured_Material
                </div>
                
                <div className="flex items-start gap-4 mb-6">
                   <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <ShieldCheck size={24} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-display font-black tracking-tight uppercase leading-none mb-1">Obsididan Carbon</h3>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">High-Tensile Strength</p>
                   </div>
                </div>
                
                <p className="text-[11px] text-white/60 font-medium leading-[1.6] uppercase tracking-wide mb-8">
                   Industrial grade filament optimized for heavy-duty mechanical parts and aerodynamic housing.
                </p>
                
                <button className="w-full py-4 border border-white/10 hover:border-primary hover:text-primary transition-all text-[9px] font-display font-black uppercase tracking-[0.4em]">
                   Explore Materials
                </button>
             </div>
          </div>
        </div>

        {/* Scroll Indicator - HUD Style */}
        <div className="mt-24 md:mt-48 flex flex-col items-center gap-6 relative group cursor-pointer animate-pulse">
           <div className="w-px h-24 bg-linear-to-b from-primary/60 to-transparent"></div>
           <span className="text-[8px] font-display font-bold tracking-[0.5em] text-primary/60 uppercase">Seek_Gallery</span>
        </div>
      </section>

      {/* Product List Section - Asymmetrical Kinetic Grid */}
      <section id="produse" className="px-6 md:px-12 py-32 md:py-64 overflow-hidden relative border-b border-white/5">
        <div className="absolute inset-0 bg-radial-gradient from-primary/[0.02] to-transparent opacity-50"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col gap-48 md:gap-96">
           {/* Section Title as seen in Stitch */}
           <div className="flex flex-col md:flex-row justify-between items-baseline mb-32 group">
              <div>
                 <h2 className="text-4xl md:text-8xl font-display font-black uppercase italic tracking-tighter">Trending Prototypes</h2>
                 <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mt-4 ml-2">Top-rated blueprints from our global network.</p>
              </div>
              <button className="text-primary text-[11px] font-display font-black uppercase tracking-widest mt-8 md:mt-0 hover:tracking-[0.5em] transition-all">Browse All ::</button>
           </div>

          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </div>
      </section>

      {/* The Print Workshop - New Section as seen in Stitch */}
      <section className="bg-surface-low relative py-32 md:py-64 px-6 md:px-12 overflow-hidden border-b border-white/5">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-6 flex flex-col gap-10">
               <h2 className="text-6xl md:text-9xl font-display font-black italic skew-x-[-10deg] leading-[0.9] uppercase">
                  The <span className="text-secondary stroke-secondary stroke-1">Print</span> <br /> 
                  Workshop
               </h2>
               
               <p className="text-white/60 text-sm md:text-lg font-medium max-w-lg leading-relaxed uppercase tracking-wide">
                  Don't have a printer? No problem. Send your selected blueprints to our certified global hubs and receive your parts within 48 hours.
               </p>
               
               <div className="flex flex-col gap-6">
                  {[
                    "100+ Professional Materials",
                    "Automated Quality Assurance",
                    "Carbon Neutral Production"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-secondary text-[11px] font-display font-black uppercase tracking-widest">
                       <div className="w-2 h-2 bg-secondary rounded-full"></div>
                       {item}
                    </div>
                  ))}
               </div>
               
               <button className="px-12 py-5 bg-white text-black font-display font-black text-xs uppercase tracking-[0.4em] self-start mt-8 hover:bg-secondary transition-colors">
                  Find Local Hub
               </button>
            </div>
            
            {/* Visual Grid for Workshop */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className={`aspect-square bg-surface rounded-2xl overflow-hidden glass-card group`}>
                    <img 
                      src={`https://images.unsplash.com/photo-${[
                        '1581092160562-40aa08e78837',
                        '1531297484001-80022131f5a1',
                        '1635514562733-bd77da3b22cf',
                        '1603732551658-5fabbafa84eb'
                      ][i-1]}?q=80&w=800&auto=format&fit=crop`} 
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                      alt="3D Printing Workshop"
                    />
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer (Simplified as HUD) */}
      <footer className="py-24 px-6 md:px-12 flex flex-col md:flex-row justify-between items-end gap-12 font-display font-bold uppercase text-[9px] tracking-[0.4em] text-secondary/30 relative">
        <div className="flex flex-col gap-4">
          <div className="text-white text-2xl font-black mb-2 tracking-tighter italic">Print<span className="text-secondary">ly</span>.</div>
          <p>© 2026 Printly Lab // PROD_VER_2.1</p>
        </div>
        
        <div className="flex gap-16">
          <a href="#" className="hover:text-primary transition-colors">Archive</a>
          <a href="#" className="hover:text-primary transition-colors">Protocol</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
        </div>
      </footer>
      </div>
    </main>
  );
}
