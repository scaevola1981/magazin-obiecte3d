import ProductCard from '@/components/ProductCard';
import MobileProductCard from '@/components/MobileProductCard';
import Sidebar from '../components/Sidebar';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Suspense } from 'react';
import { mapDbToProduct, products as localProducts } from '@/data/products';
import { supabase, getSupabaseConfigStatus } from '@/lib/supabase';
import { Flame, Star, Zap, Clock, AlertTriangle, Search } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.trim().toLowerCase() : '';
  const activeTab = typeof params.tab === 'string' ? params.tab : 'trending';
  const activeCat = typeof params.cat === 'string' ? params.cat.toLowerCase() : 'all';

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

  // Map and deduplicate database products by name + price
  const productsMap = new Map();
  
  dbProducts.forEach(dbProduct => {
    const product = mapDbToProduct(dbProduct);
    const key = `${product.name.trim().toLowerCase()}-${product.price}`;
    
    if (!productsMap.has(key)) {
      productsMap.set(key, product);
    } else {
      // If we have a duplicate, prioritize the one with a proper image URL
      const currentHasImage = product.thumbnailUrl?.startsWith('http');
      const existing = productsMap.get(key);
      const existingHasImage = existing.thumbnailUrl?.startsWith('http');
      
      if (currentHasImage && !existingHasImage) {
        productsMap.set(key, product);
      }
    }
  });

  let products = Array.from(productsMap.values());

  // Apply sorting based on active tab
  if (activeTab === 'new') {
    products = [...products].reverse();
  } else if (activeTab === 'categories') {
    products = [...products].sort((a, b) => a.category.localeCompare(b.category));
  } else {
    // Default to 'trending' - sort by likes descending
    products = [...products].sort((a, b) => {
      // Prioritize likes. If likes are equal, fallback to downloads. Give extra weight to downloads.
      const scoreA = (a.stats?.likes || 0) * 2 + (a.stats?.downloads || 0);
      const scoreB = (b.stats?.likes || 0) * 2 + (b.stats?.downloads || 0);
      return scoreB - scoreA;
    });
  }

  // Filter by category
  if (activeCat !== 'all') {
    products = products.filter(p => p.category.toLowerCase() === activeCat);
  }

  // Filter by search query if present
  if (query) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }

  // Build category list from all (unfiltered) products for display in buttons
  const allProducts = Array.from(productsMap.values());
  const categoryList = ['all', ...new Set(allProducts.map(p => p.category.toLowerCase()))];

  // Find the absolute top 3 most popular products for the Hero section
  const topProducts = [...allProducts].sort((a, b) => {
    const scoreA = (a.stats?.likes || 0) * 2 + (a.stats?.downloads || 0);
    const scoreB = (b.stats?.likes || 0) * 2 + (b.stats?.downloads || 0);
    return scoreB - scoreA;
  }).slice(0, 3);

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

        {topProducts.length > 0 ? (
          <div className="relative w-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 pb-2">
            {topProducts.map((p, i) => (
              <div key={p.id} className="relative min-w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl snap-center shrink-0">
                <img
                  src={p.thumbnailUrl || '/placeholder-product.jpg'}
                  alt={p.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end gap-3">
                  <div className="flex items-center gap-2 text-xs font-display uppercase tracking-[0.35em] text-purple-400">
                    <Star size={14} className="fill-purple-400" />
                    Community Pick #{i + 1}
                  </div>
                  <h1 className="text-3xl font-display font-black leading-tight line-clamp-2">{p.name}</h1>
                  <p className="text-sm text-white/70 italic line-clamp-2 break-words">
                    {p.description || "Cel mai apreciat model de către comunitate."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
        )}

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {categoryList.map((cat) => {
            const isActive = activeCat === cat;
            const label = cat === 'all' ? 'Toate' : cat;
            const href = cat === 'all' ? '/' : `?cat=${encodeURIComponent(cat)}`;
            return (
              <Link
                key={cat}
                href={href}
                scroll={false}
                className={`px-4 py-2 text-xs font-display font-bold uppercase tracking-[0.2em] rounded-full border whitespace-nowrap transition-colors ${
                  isActive 
                    ? 'border-purple-500 bg-purple-500/20 text-purple-400' 
                    : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold tracking-tight">Trending Models</h2>
          </div>
          <div data-product-count={products.length} className="flex flex-col gap-5">
            {products.length > 0 ? (
              products.map((product) => (
                <MobileProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-white/40 text-sm font-display uppercase tracking-widest">Niciun model găsit pentru "{query}"</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Desktop Dashboard Layout */}
      <div className="hidden md:flex">
        {/* Sidebar Container */}
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>

        {/* Main Content Area */}
        <div className="flex-1 ml-64 min-h-screen flex flex-col bg-[#050505]">
          <div className="md:hidden">
            <Navbar />
          </div>

          {/* Hero / Banner Area */}
          <section className="mt-0 px-12 py-10">
             {activeTab === 'trending' && topProducts.length > 0 && (
               <div className="relative w-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-6 pb-4 cursor-grab active:cursor-grabbing">
                 {topProducts.map((p, i) => (
                   <div key={p.id} className="relative min-w-full h-[320px] rounded-2xl overflow-hidden group snap-center shrink-0">
                      <img 
                        src={p.thumbnailUrl || '/placeholder-product.jpg'} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                        alt={p.name} 
                      />
                      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent"></div>
                      <div className="absolute inset-0 p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 text-purple-400 text-xs font-bold uppercase tracking-[0.4em] mb-4">
                          <Star size={16} className="fill-purple-400" />
                          Community Pick #{i + 1}
                        </div>
                        <h2 className="text-5xl font-display font-black leading-tight uppercase tracking-tighter text-white mb-4 line-clamp-2 max-w-2xl">
                          {p.name}
                        </h2>
                        <p className="max-w-md text-white/60 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                          {p.description || "Descoperă cele mai apreciate și comandate planuri și produse 3D din comunitate."}
                        </p>
                        <button className="w-fit px-8 py-4 bg-purple-500 text-white font-display font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-purple-400 transition-all">
                          Vezi Produsul
                        </button>
                      </div>
                   </div>
                 ))}
               </div>
             )}
             
             {(!topProducts || topProducts.length === 0 || activeTab !== 'trending') && (
               <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-display font-black uppercase tracking-widest text-white">
                        {activeTab === 'new' ? 'Produse Noi' : 'Categorized Models'}
                      </h2>
                      <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold mt-1">
                       Exploreaza si comanda direct prin WhatsApp!
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {products.slice(0, 3).map((p, i) => (
                        <div key={i} className="w-16 h-16 rounded-lg bg-black/40 border border-white/5 overflow-hidden">
                          <img src={p.thumbnailUrl} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
             )}
          </section>

          {/* Categories & Filter Area */}
          <section className="px-12 pb-24">
             <div className="flex flex-col gap-8">
                {/* Filter Tabs */}
                <div className="flex items-center justify-between border-b border-white/5">
                   <div className="flex items-center gap-10">
                      {[
                        { icon: Flame, label: 'Trending', id: 'trending' },
                        { icon: Zap, label: 'Produse Noi', id: 'new' },
                        { icon: Clock, label: 'Categories', id: 'categories' }
                      ].map((item) => (
                        <Link 
                          key={item.id} 
                          href={`/?tab=${item.id}${query ? `&q=${query}` : ''}`}
                          scroll={false}
                          className={`flex items-center gap-2 pb-4 text-[11px] font-display font-bold uppercase tracking-[0.2em] relative transition-all ${activeTab === item.id ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                        >
                          <item.icon size={14} />
                          {item.label}
                          {activeTab === item.id && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>}
                        </Link>
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

                {/* Sub-tag Cloud — real categories from DB */}
                 <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
                    {categoryList.map((cat) => {
                      const isActive = activeCat === cat;
                      const label = cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1);
                      const count = cat === 'all' ? allProducts.length : allProducts.filter(p => p.category.toLowerCase() === cat).length;
                      const href = cat === 'all' ? '/' : `?cat=${encodeURIComponent(cat)}`;
                      return (
                        <a
                          key={cat}
                          href={href}
                          className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                            isActive
                              ? 'bg-white text-black'
                              : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {label} <span className="opacity-50">({count})</span>
                        </a>
                      );
                    })}
                 </div>

                {/* Product Grid Header & Diagnostics */}
                <div className="mb-4 flex flex-col gap-1">
                  <div className="text-xs text-white/20 uppercase tracking-widest font-bold">
                    Showing {products.length} models
                  </div>
                  {fetchError && (
                    <div className="flex flex-col gap-3 p-4 bg-red-500/5 rounded-xl border border-red-500/20 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-[10px] text-red-500 font-bold uppercase tracking-wider">
                        <AlertTriangle size={12} />
                        Sync Alert: {fetchError}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[9px] font-mono text-white/40 uppercase">
                        <div className="flex flex-col gap-1">
                          <span className="text-white/20">ENDPOINT:</span>
                          <span className={getSupabaseConfigStatus().hasUrl ? 'text-white/60' : 'text-red-500'}>
                            {getSupabaseConfigStatus().hasUrl ? `CONNECTED (${getSupabaseConfigStatus().urlStart})` : 'MISSING'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-white/20">SECURITY:</span>
                          <span className={getSupabaseConfigStatus().hasKey ? 'text-white/60' : 'text-red-500'}>
                            {getSupabaseConfigStatus().hasKey ? `KEY ACTIVE (${getSupabaseConfigStatus().keyLength} CH)` : 'KEY MISSING'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-white/20">PROTOCOL:</span>
                          <span className={getSupabaseConfigStatus().isHttps ? 'text-green-500/60' : 'text-yellow-500/60'}>
                            {getSupabaseConfigStatus().isHttps ? 'HTTPS SECURE' : 'INSECURE / NONE'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-white/20">DOMAIN:</span>
                          <span className={getSupabaseConfigStatus().isValidHost ? 'text-white/60' : 'text-red-500'}>
                            {getSupabaseConfigStatus().isValidHost ? 'SUPABASE.CO' : 'INVALID HOST'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-white/30 lowercase italic mt-1 border-t border-white/5 pt-2">
                        Verify your .env.local settings. Try restarting dev server if changes don't reflect.
                      </p>
                    </div>
                  )}
                </div>

                <div data-product-count={products.length} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
                  {/* Debug Info */}
                  <div className="hidden">
                    DEBUG_PRODUCTS: {products.map(p => p.name).join(' | ')}
                  </div>
                  {products.length > 0 ? (
                    products.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))
                  ) : (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center gap-4 bg-white/5 border border-white/10 rounded-2xl border-dashed">
                      <Search size={40} className="text-white/10" />
                      <div className="text-center">
                        <p className="text-white/40 text-sm font-display uppercase tracking-widest font-bold">Niciun model găsit</p>
                        <p className="text-white/20 text-[10px] uppercase tracking-widest mt-1">Încearcă alte cuvinte cheie sau verifică ortografia</p>
                      </div>
                    </div>
                  )}
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
                   <span>Last Sync: {new Date().toISOString()}</span>
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
