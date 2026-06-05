import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, TrendingUp, DollarSign, Package, ArrowUpRight, Copy, CreditCard } from 'lucide-react';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockSalesData = [
  { name: 'Mon', sales: 400 },
  { name: 'Tue', sales: 300 },
  { name: 'Wed', sales: 550 },
  { name: 'Thu', sales: 450 },
  { name: 'Fri', sales: 700 },
  { name: 'Sat', sales: 900 },
  { name: 'Sun', sales: 850 },
];

const mockProducts = [
  { id: 1, name: 'Sovereign Digital Guide', price: '$49', img: 'https://images.unsplash.com/photo-1544396821-4ea7ee3b4e6b?w=400&h=400&fit=crop', status: 'Active', margin: '98%' },
  { id: 2, name: 'Glassmorphism UI Kit', price: '$129', img: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=400&h=400&fit=crop', status: 'Popular', margin: '95%' },
  { id: 3, name: 'Forensic System Audit', price: '$499', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop', status: 'Enterprise', margin: '80%' },
];

export function EtsyDynamicView() {
  return (
    <div className="border border-pink-200/50 bg-white/40 backdrop-blur-3xl p-6 mb-4 rounded-3xl shadow-[0_10px_40px_-10px_rgba(30,27,75,0.1)] relative group overflow-hidden text-indigo-950 mt-4">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-50" />
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none text-pink-600"><ShoppingBag size={120} className="-rotate-12" /></div>
      
      <div className="flex items-center justify-between mb-6 border-b border-indigo-100 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center border border-pink-100 shadow-sm">
            <ShoppingBag size={14} className="text-pink-600" />
          </div>
          <div>
            <h3 className="font-black text-[12px] uppercase tracking-widest text-indigo-950">Etsy Integration Active</h3>
            <p className="text-[10px] text-indigo-900/40 uppercase tracking-wider font-semibold">Live Storefront Sync</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           Connected
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10">
        <div className="glass-panel rounded-2xl p-4 border border-white">
          <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-900/50 mb-1 flex items-center gap-1.5"><DollarSign size={12} /> Target $8,500/mo</div>
          <div className="text-2xl font-display font-black text-indigo-950">$3,420</div>
          <div className="text-[10px] text-pink-600 font-bold mt-1 flex items-center gap-0.5"><ArrowUpRight size={12} /> +12% this week</div>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-white">
          <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-900/50 mb-1 flex items-center gap-1.5"><TrendingUp size={12} /> Profit Margin</div>
          <div className="text-2xl font-display font-black text-indigo-950">92%</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5"><ArrowUpRight size={12} /> Optimal Range</div>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-white">
          <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-900/50 mb-1 flex items-center gap-1.5"><Package size={12} /> Active Listings</div>
          <div className="text-2xl font-display font-black text-indigo-950">42</div>
          <div className="text-[10px] text-indigo-900/40 font-bold mt-1 line-clamp-1">3 Drafts waiting</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
         <div className="glass-panel rounded-2xl p-4 border border-white flex flex-col h-64">
           <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-950 mb-4 pb-2 border-b border-indigo-100 flex items-center justify-between">
             Sales Velocity
             <button className="text-pink-600 hover:text-pink-700 font-black tracking-widest flex items-center gap-1"><Copy size={10} /> Report</button>
           </div>
           <div className="flex-1 min-h-0 w-full h-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={mockSalesData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6366f1' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(236,72,153,0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="sales" fill="url(#colorSales)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
           </div>
         </div>

         <div className="glass-panel rounded-2xl p-4 border border-white flex flex-col h-64">
           <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-950 mb-4 pb-2 border-b border-indigo-100 flex items-center justify-between">
             Product Mockups
             <button className="text-pink-600 hover:text-pink-700 font-black tracking-widest flex items-center gap-1"><CreditCard size={10} /> Boost API</button>
           </div>
           <div className="flex-1 overflow-y-auto pr-2 nice-scrollbar flex flex-col gap-3">
              {mockProducts.map((prod) => (
                <div key={prod.id} className="flex gap-3 items-center group/prod">
                  <div className="w-12 h-12 rounded-xl border border-indigo-100 overflow-hidden shrink-0 shadow-sm relative">
                    <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover/prod:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-indigo-950 truncate leading-none mb-1">{prod.name}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-pink-600 font-bold text-[10px]">{prod.price}</span>
                      <span className="text-[9px] font-semibold text-indigo-900/40 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">{prod.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                     <span className="block text-[9px] font-black uppercase text-emerald-600">{prod.margin}</span>
                     <span className="block text-[8px] font-semibold text-indigo-400 uppercase">Margin</span>
                  </div>
                </div>
              ))}
           </div>
         </div>
      </div>
    </div>
  );
}
