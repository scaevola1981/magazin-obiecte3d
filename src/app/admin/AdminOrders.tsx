'use client';
import { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle, Clock, Package, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Order = {
  id: string;
  product_id: string;
  customer_name: string;
  custom_notes?: string;
  status: string;
  created_at: string;
  products?: {
    name: string;
    thumbnail_url: string;
  }
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
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
      const res = await fetch('/api/orders');
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

  if (orders.length === 0) {
    return (
      <div className="py-20 text-center text-white/50 border border-white/10 rounded-2xl border-dashed">
        <Package className="mx-auto mb-2 opacity-50" />
        Nu există nicio comandă încă.
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
      {orders.map((order) => (
        <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-black overflow-hidden shrink-0 border border-white/5">
                <img src={order.products?.thumbnail_url || '/placeholder-product.jpg'} alt="" className="w-full h-full object-cover" />
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
          </div>
        </div>
      ))}
    </div>
  );
}
