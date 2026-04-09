'use client';
import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, Clock, Package } from 'lucide-react';

type Order = {
  id: string;
  product_id: string;
  customer_name: string;
  custom_notes?: string;
  status: string;
  created_at: string;
  products?: {
    name: string;
    thumbnailUrl: string;
  }
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-black overflow-hidden shrink-0 border border-white/5">
                <img src={order.products?.thumbnailUrl || '/placeholder-product.jpg'} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">{order.products?.name || 'Produs sters'}</h3>
                <p className="text-white/50 text-xs mt-0.5">{order.customer_name}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
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
