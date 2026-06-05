import React from 'react';
import { motion } from 'motion/react';
import { Globe, Heart, CloudSun, Zap, Wind } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const sentimentData = [
  { subject: 'Optimism', A: 120, fullMark: 150 },
  { subject: 'Stability', A: 98, fullMark: 150 },
  { subject: 'Fear', A: 32, fullMark: 150 },
  { subject: 'Excitement', A: 145, fullMark: 150 },
  { subject: 'Trust', A: 85, fullMark: 150 },
  { subject: 'Anxiety', A: 48, fullMark: 150 },
];

export function GlobalSentimentTracker() {
  return (
    <div className="nova-container p-6 mb-4 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity"><Globe size={120} /></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 shadow-lg shadow-pink-500/10">
            <Heart size={20} className="text-pink-600 animate-pulse" />
          </div>
          <div>
            <h3 className="text-indigo-950 font-black text-[12px] uppercase tracking-[0.2em] font-display">Global Sentiment</h3>
            <p className="text-[9px] text-indigo-900/40 uppercase tracking-widest font-bold flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
               Real-time Emotive Mesh
            </p>
          </div>
        </div>
        <div className="text-right">
           <div className="text-xl font-black text-indigo-950">+8.4%</div>
           <div className="text-[8px] text-emerald-600 font-bold uppercase tracking-tighter">Aggregate Rise</div>
        </div>
      </div>

      <div className="h-64 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sentimentData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 800, fill: '#1e1b4b' }} />
            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
            <Radar
              name="Sentiment"
              dataKey="A"
              stroke="#ec4899"
              fill="#ec4899"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 relative z-10">
         <div className="p-2 bg-white/40 rounded-xl border border-indigo-50 text-center">
            <CloudSun size={14} className="mx-auto text-amber-500 mb-1" />
            <div className="text-[10px] font-black text-indigo-950">64%</div>
            <div className="text-[7px] text-indigo-900/40 uppercase font-bold uppercase">Clarity</div>
         </div>
         <div className="p-2 bg-white/40 rounded-xl border border-indigo-50 text-center">
            <Zap size={14} className="mx-auto text-pink-500 mb-1" />
            <div className="text-[10px] font-black text-indigo-950">92k</div>
            <div className="text-[7px] text-indigo-900/40 uppercase font-bold uppercase">Impulses</div>
         </div>
         <div className="p-2 bg-white/40 rounded-xl border border-indigo-50 text-center">
            <Wind size={14} className="mx-auto text-blue-500 mb-1" />
            <div className="text-[10px] font-black text-indigo-950">Low</div>
            <div className="text-[7px] text-indigo-900/40 uppercase font-bold uppercase">Turbulence</div>
         </div>
      </div>
    </div>
  );
}
