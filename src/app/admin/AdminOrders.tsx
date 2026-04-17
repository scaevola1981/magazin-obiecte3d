'use client';
import { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle, Clock, Package, Bell, Eye, ExternalLink, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type Order = {
  id: string;
  product_id: string;
  customer_name: string;
  custom_notes?: string;
  status: string;
  created_at: string;
  is_custom_order?: boolean;
  custom_description?: string;
  sketch_url?: string;
  products?: {
    name: string;
    thumbnail_url: string;
  }
};

export default function AdminOrders({ showCompletedOnly = false }: { showCompletedOnly?: boolean }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const lastOrderIdRef = useRef<string | null>(null);
  const isFirstLoadRef = useRef(true);

  const playNotificationSound = () => {
    const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3');
    audio.play().catch(err => console.log('Audio playback failed (interaction required):', err));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000); // Auto-hide after 5 seconds
  };

  const fetchOrders = async (isPoll = false) => {
    if (!isPoll) setIsLoading(true);
    try {
      const res = await fetch(`/api/orders?t=${Date.now()}`);
      const data = await res.json();
      if (data.orders) {
        const newOrders = data.orders;
        
        // Detect new orders if not the first load
        if (!isFirstLoadRef.current && newOrders.length > 0) {
          const latestId = newOrders[0].id;
          if (latestId !== lastOrderIdRef.current) {
            playNotificationSound();
          }
        }

        if (newOrders.length > 0) {
          lastOrderIdRef.current = newOrders[0].id;
        }
        
        setOrders(newOrders);
        isFirstLoadRef.current = false;
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!isPoll) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Poll for new orders every 10 seconds
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-purple-500" /></div>;
  }

  const filteredOrders = orders.filter(order => 
    showCompletedOnly ? order.status === 'finalizat' : order.status !== 'finalizat'
  );

  if (filteredOrders.length === 0) {
    return (
      <div className="py-20 text-center text-white/50 border border-white/10 rounded-2xl border-dashed">
        <Package className="mx-auto mb-2 opacity-50" />
        {showCompletedOnly ? 'Istoricul este gol.' : 'Nu există nicio comandă activă.'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-purple-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-purple-400/50 backdrop-blur-xl"
          >
            <div className="bg-white/20 p-2 rounded-full">
              <Bell size={18} className="animate-bounce" />
            </div>
            <div>
              <p className="font-bold text-sm">Comandă Nouă!</p>
              <p className="text-[10px] opacity-80">Verifică lista de comenzi recent primite.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {filteredOrders.map((order) => (
        <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-black/40 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                {order.is_custom_order && order.sketch_url && order.sketch_url !== 'NULL' ? (
                  <img src={order.sketch_url} alt="" className="w-full h-full object-cover" />
                ) : order.products?.thumbnail_url ? (
                  <img src={order.products.thumbnail_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-white/20" size={20} />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-white font-bold text-sm truncate">{order.products?.name || 'Produs sters'}</h3>
                <p className="text-white/50 text-xs mt-0.5 truncate">{order.customer_name}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md whitespace-nowrap ${
                order.status === 'finalizat' ? 'bg-green-500/20 text-green-400' :
                order.status === 'anulat' ? 'bg-red-500/20 text-red-400' :
                'bg-orange-500/20 text-orange-400'
              }`}>
                {order.status}
              </span>
              <p className="text-white/30 text-[10px] mt-2">
                {new Date(order.created_at).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}
              </p>
            </div>
          </div>
          
          {order.custom_notes && (
            <div className="p-3 bg-black/50 border border-white/5 rounded-xl mt-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400/80 mb-1 block flex items-center gap-1">Note Suplimentare</span>
              <p className="text-xs text-white/70 italic leading-relaxed">{order.custom_notes}</p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-3 border-t border-white/5">
            <button 
              onClick={() => updateStatus(order.id, 'în așteptare')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors ${order.status === 'în așteptare' ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
            >
              <Clock size={14} /> Așteaptă
            </button>
            <button 
              onClick={() => updateStatus(order.id, 'finalizat')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors ${order.status === 'finalizat' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
            >
              <CheckCircle size={14} /> Gata
            </button>
            <button 
              onClick={() => setSelectedOrder(order)}
              className="flex items-center justify-center p-2 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white rounded-lg transition-all"
              title="Vezi detalii"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>
      ))}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl z-[61] overflow-hidden"
            >
              <div className="p-6 md:p-8 flex flex-col gap-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        selectedOrder.is_custom_order ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/20' : 'bg-purple-500/20 text-purple-400 border border-purple-500/20'
                      }`}>
                        {selectedOrder.is_custom_order ? 'Comandă Custom' : 'Comandă Magazin'}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        selectedOrder.status === 'finalizat' ? 'bg-green-500/20 text-green-400' :
                        selectedOrder.status === 'anulat' ? 'bg-red-500/20 text-red-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Detalii Comandă</h2>
                    <p className="text-white/30 text-[10px] uppercase tracking-tighter mt-1 font-mono">ID: {selectedOrder.id}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/50 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-2 block">Client</label>
                    <p className="text-lg font-bold text-white">{selectedOrder.customer_name}</p>
                    <p className="text-xs text-white/40 mt-1">
                      Plasată pe: {new Date(selectedOrder.created_at).toLocaleString('ro-RO', { 
                        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </p>
                  </div>

                  {/* Product Details */}
                  {!selectedOrder.is_custom_order ? (
                    <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-full sm:w-32 h-32 rounded-xl bg-black overflow-hidden border border-white/10 shrink-0">
                        <img 
                          src={selectedOrder.products?.thumbnail_url || '/placeholder-product.jpg'} 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="text-center sm:text-left">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1 block">Produs Comandat</label>
                        <h3 className="text-xl text-white font-bold leading-tight">{selectedOrder.products?.name || 'Produs inexistent'}</h3>
                        <p className="text-xs text-white/40 mt-2 uppercase tracking-tighter font-bold">Varianta Magazin</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-6">
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-2 block">Descriere Piesă Custom</label>
                        <p className="text-sm text-white leading-relaxed">
                          {(selectedOrder.custom_description && selectedOrder.custom_description !== 'NULL') 
                            ? selectedOrder.custom_description 
                            : 'Nicio descriere furnizată'}
                        </p>
                      </div>
                      
                      {selectedOrder.is_custom_order && (
                        <div className="mt-2 p-2 bg-black/40 rounded-lg border border-white/5 overflow-hidden">
                          <p className="text-[9px] text-white/20 font-mono truncate">
                            DEBUG RAW URL: {selectedOrder.sketch_url || 'NULL/EMPTY'}
                          </p>
                        </div>
                      )}
                      
                      {selectedOrder.sketch_url && selectedOrder.sketch_url !== 'NULL' ? (
                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-3 block">Schiță / Referință Încărcată</label>
                          <div className="relative group rounded-xl overflow-hidden border border-white/20 bg-black aspect-square max-h-[400px]">
                            <img 
                              src={selectedOrder.sketch_url} 
                              alt="Referinta Custom" 
                              className="w-full h-full object-contain"
                            />
                            <a 
                              href={selectedOrder.sketch_url} 
                              target="_blank" 
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 text-white gap-3 scale-110 group-hover:scale-100"
                            >
                              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/20">
                                <ExternalLink size={24} />
                              </div>
                              <span className="font-bold text-xs uppercase tracking-widest">Vezi imaginea completă</span>
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-black/20 border border-white/5 p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
                          <ImageIcon className="text-white/10" size={40} />
                          <p className="text-xs text-white/30 font-medium">Nicio fotografie atașată acestei comenzi custom</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Extra Notes */}
                  {selectedOrder.custom_notes && (
                    <div className="bg-purple-500/5 border border-purple-500/10 p-4 rounded-2xl">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-purple-400/80 mb-2 block focus:none">Note Suplimentare / Opțiuni</label>
                      <p className="text-sm text-white/80 italic leading-relaxed whitespace-pre-wrap">{selectedOrder.custom_notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <button 
                      onClick={() => {
                        updateStatus(selectedOrder.id, selectedOrder.status === 'finalizat' ? 'în așteptare' : 'finalizat');
                        setSelectedOrder({...selectedOrder, status: selectedOrder.status === 'finalizat' ? 'în așteptare' : 'finalizat'});
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all ${
                        selectedOrder.status === 'finalizat' 
                          ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' 
                          : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                      }`}
                    >
                      {selectedOrder.status === 'finalizat' ? <Clock size={18} /> : <CheckCircle size={18} />}
                      {selectedOrder.status === 'finalizat' ? 'Pune în Așteptare' : 'Marchează Finalizat'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
