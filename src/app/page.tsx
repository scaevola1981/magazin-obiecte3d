import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black font-sans">
      {/* Hero Section - Asymmetrical & Bold */}
      <section className="relative pt-48 pb-24 px-6 md:px-12 flex flex-col items-center overflow-hidden">
        {/* Large Background Letter - Reduced on Mobile */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[80vw] md:text-[40vw] font-display font-black text-gray-100/30 md:text-gray-100/50 pointer-events-none select-none z-0 overflow-hidden leading-none">
          3D
        </div>

        <div className="relative z-10 flex flex-col gap-4 max-w-7xl w-full">
          <div className="flex flex-col md:flex-row items-baseline gap-4">
            <h1 className="text-7xl md:text-[12rem] font-display font-black leading-[0.8] uppercase tracking-[-0.04em]">
              PURE <span className="text-[#F2F2F2] stroke-black stroke-2">DIGITAL</span>
            </h1>
          </div>
          
          <div className="flex flex-col md:flex-row justify-end items-end gap-12 mt-4 md:-mt-12">
            <p className="max-w-xs md:max-w-md text-gray-500 text-xs md:text-lg font-medium leading-relaxed uppercase tracking-wide text-center md:text-right">
              Exploring the convergence of physical form and digital synthesis through architectural 3D objects.
            </p>
            <h2 className="text-5xl sm:text-7xl md:text-[12rem] font-display font-black leading-[0.9] md:leading-[0.8] uppercase tracking-[-0.04em]">
              LOVE 3D
            </h2>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-32 flex flex-col items-center gap-4 animate-bounce">
          <div className="w-px h-16 bg-black"></div>
        </div>
      </section>

      {/* Product List Section - Architectural Grid */}
      <section id="produse" className="px-6 md:px-12 pb-64 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col gap-32 md:gap-64">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Call to Action - Massive */}
      <section className="bg-black text-white py-48 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden">
        <h2 className="text-6xl md:text-[10rem] font-display font-black leading-none uppercase tracking-tighter mb-12">
          Start Your <br />
          <span className="text-gray-800">Collection</span>
        </h2>
        <a 
          href="https://wa.me/40700000000" 
          className="group text-2xl md:text-4xl font-display font-bold uppercase tracking-tight flex items-center gap-4 hover:gap-8 transition-all duration-300"
        >
          Contact via WhatsApp <span className="text-4xl md:text-6xl">→</span>
        </a>
      </section>

      {/* Footer - Minimal & Geometric */}
      <footer className="py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-end gap-12 font-bold uppercase text-[10px] tracking-[0.2em] text-gray-400">
        <div className="flex flex-col gap-2">
          <div className="text-black text-xl mb-4">LOVE3D.</div>
          <p>© 2024 Digital Artifacts LAB</p>
          <p>Bucharest, RO / Digital Space</p>
        </div>
        <div className="flex gap-12">
          <a href="#" className="hover:text-black transition-colors">Archive</a>
          <a href="#" className="hover:text-black transition-colors">License</a>
          <a href="#" className="hover:text-black transition-colors">Privacy</a>
        </div>
      </footer>
    </main>
  );
}
