import ProductCard from '@/components/ProductCard';
import MobileProductCard from '@/components/MobileProductCard';
import Sidebar from '../components/Sidebar';
import Navbar from '@/components/Navbar';
import { mapDbToProduct, products as localProducts } from '@/data/products';
import { supabase, getSupabaseConfigStatus } from '@/lib/supabase';
import { Flame, Star, Zap, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  let dbProducts = [];
  let fetchError = null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Supabase error:', error.message);
      fetchError = error.message;
    } else {
      dbProducts = data || [];
    }
  } catch (err: any) {
    console.error('Failed to fetch from Supabase:', err);
    fetchError = err?.message || 'Unknown error';
  }

  // Map and deduplicate database products by name
  const productsMap = new Map();
  
  // 1. First, add all LOCAL products to the map
  localProducts.forEach(lp => {
    productsMap.set(lp.name, lp);
  });

  // 2. Then, overwrite or add from database products if any
  dbProducts.forEach(dbProduct => {
    const product = mapDbToProduct(dbProduct);
    if (product.name) {
      // If we already have a local version, decide if we want the DB one
      // Usually, DB should win if it's not a placeholder
      productsMap.set(product.name, product);
    }
  });

  let finalProducts = Array.from(productsMap.values());
  
  // Debug check to ensure we have at least local products
  if (finalProducts.length === 0) {
    finalProducts = localProducts;
  }

  const products = finalProducts.sort((a, b) => {
    const aOk = a.thumbnailUrl?.startsWith('http') || a.thumbnailUrl?.startsWith('/');
    const bOk = b.thumbnailUrl?.startsWith('http') || b.thumbnailUrl?.startsWith('/');
    if (aOk && !bOk) return -1;
    if (!aOk && bOk) return 1;
    return 0;
  });

  return (
    <main className="min-h-screen bg-[#000000] text-white font-sans selection:bg-primary selection:text-black">
      {/* Mobile layout (Remains mostly same but slightly adjusted) */}
      <section className="md:hidden px-4 pt-20 pb-28 flex flex-col gap-8 max-w-xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary"></div>
            <div className="text-lg font-display font-bold tracking-tight">BLOOM<span className="text-secondary">FORM</span></div>
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
            <p className="text-sm text-white/70 italic">
              Blueprints for the future, ready to print today.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['Toate', 'Arte', 'Tools', 'Household', 'Automotive', 'Cosplay'].map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 text-xs font-display font-bold uppercase tracking-[0.2em] rounded-full border border-white/10 bg-white/5 text-white/80 whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold tracking-tight">Trending Models ({products.length})</h2>
          </div>
          <div data-product-count={products.length} className="flex flex-col gap-5">
            {products.map((product, index) => (
              <MobileProductCard key={`${product.id}-${index}`} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Desktop Dashboard Layout */}
      <div className="hidden md:flex">
        {/* Sidebar Container */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 ml-64 min-h-screen flex flex-col bg-[#050505]">
          {/* Header */}
          <Navbar />

          {/* Hero / Banner Area */}
          <section className="mt-20 px-12 py-10">
             <div className="relative h-[320px] rounded-2xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1635514562733-bd77da3b22cf?q=80&w=2000&auto=format&fit=crop" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  alt="Featured model" 
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-primary text-xs font-bold uppercase tracking-[0.4em] mb-4">
                    <Star size={16} />
                    Model of the Month
                  </div>
                  <h2 className="text-6xl font-display font-black leading-tight uppercase tracking-tighter text-white mb-6">
                    KINETIC <br /> ATELIER_01
                  </h2>
                  <p className="max-w-md text-white/60 text-sm font-medium leading-relaxed uppercase tracking-wider mb-8">
                    Discover new possibilities in 3D fabrication with our curated selection of high-precision blueprints.
                  </p>
                  <button className="w-fit px-8 py-4 bg-primary text-black font-display font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-white transition-all">
                    Explore Blueprint
                  </button>
                </div>
             </div>
          </section>

          {/* Categories & Filter Area */}
          <section className="px-12 pb-24">
             <div className="flex flex-col gap-8">
                {/* Filter Tabs */}
                <div className="flex items-center justify-between border-b border-white/5">
                   <div className="flex items-center gap-10">
                      {[
                        { icon: Flame, label: 'Trending' },
                        { icon: Zap, label: 'New Arrival' },
                        { icon: Clock, label: 'Categories' },
                        { icon: Star, label: 'Featured' }
                      ].map((item, i) => (
                        <button 
                          key={item.label} 
                          className={`flex items-center gap-2 pb-4 text-[11px] font-display font-bold uppercase tracking-[0.2em] relative transition-all ${i === 0 ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                        >
                          <item.icon size={14} />
                          {item.label}
                          {i === 0 && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>}
                        </button>
                      ))}
                   </div>
                   <div className="flex items-center gap-4 mb-4">
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Sort by:</span>
                      <select className="bg-transparent border-none text-[10px] font-bold text-white/60 uppercase tracking-widest focus:ring-0 cursor-pointer">
                        <option>Popularity</option>
                        <option>Recent</option>
                        <option>Downloads</option>
                      </select>
                   </div>
                </div>

                {/* Sub-tag Cloud */}
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
                   {['All', 'Household', 'Tools', 'Art', 'Mechanical', 'Miniatures', 'Prop & Cosplay', 'Hobby & DIY'].map((tag, i) => (
                      <button 
                         key={tag} 
                         className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${i === 0 ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white'}`}
                      >
                         {tag}
                      </button>
                   ))}
                </div>

                {/* Product Grid */}
                <div className="mb-4 flex flex-col gap-1">
                  <div className="text-xs text-white/20 uppercase tracking-widest font-bold">
                    Showing {products.length} models
                  </div>
                  {fetchError && (
                    <div className="flex flex-col gap-2 p-3 bg-red-500/5 rounded border border-red-500/10">
                      <div className="text-[10px] text-red-500/50 uppercase font-mono">
                        Supabase Sync Alert: {fetchError}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-[9px] font-mono text-white/30 uppercase">
                        <div>URL: {getSupabaseConfigStatus().hasUrl ? 'SET' : 'MISSING'} ({getSupabaseConfigStatus().urlStart})</div>
                        <div>KEY: {getSupabaseConfigStatus().hasKey ? `SET (${getSupabaseConfigStatus().keyLength} chars)` : 'MISSING'}</div>
                        <div>HTTPS: {getSupabaseConfigStatus().isHttps ? 'YES' : 'NO'}</div>
                      </div>
                    </div>
                  )}
                </div>
                <div data-product-count={products.length} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-4">
                  {/* Debug Info */}
                  <div className="hidden">
                    DEBUG_PRODUCTS: {products.map(p => p.name).join(' | ')}
                  </div>
                  {products.map((product, index) => (
                    <ProductCard key={`${product.id}-${index}`} product={product} index={index} />
                  ))}
                </div>
             </div>
          </section>

          {/* Dash Footer */}
          <footer className="mt-auto py-12 px-12 border-t border-white/5 bg-[#080808]">
             <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                   <span>© 2026 Printly Prototype Lab</span>
                   <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                   <span>System Status: Online</span>
                   <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                   <span>Last Sync: Apr 3, 2026</span>
                </div>
                <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                   <a href="#" className="hover:text-primary transition-colors">Documentation</a>
                   <a href="#" className="hover:text-primary transition-colors">API Protocol</a>
                   <a href="#" className="hover:text-primary transition-colors">Security</a>
                   <a href="#" className="hover:text-primary transition-colors">Contact</a>
                </div>
             </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
