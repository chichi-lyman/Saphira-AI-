import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Activity, Globe, FileText, ShieldAlert, Terminal, Eye, Lock, Scale } from 'lucide-react';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const threatLevels = [
  { name: 'X-SS', value: 85, color: '#ef4444' },
  { name: 'DDoS', value: 30, color: '#f87171' },
  { name: 'Injection', value: 65, color: '#dc2626' },
  { name: 'C&C', value: 45, color: '#b91c1c' },
  { name: 'Brute', value: 20, color: '#991b1b' },
];

const mockAnomalies = [
  { id: 1, type: 'Origin Spoof', ip: '45.12.98.22', severity: 'High', status: 'Blocked' },
  { id: 2, type: 'Neural Intercept', ip: '192.168.1.104', severity: 'Critical', status: 'Neutralized' },
  { id: 3, type: 'Memory Leak Probe', ip: '88.201.12.5', severity: 'Medium', status: 'Logging' },
];

export function ThreatAssessmentView() {
  return (
    <div className="border border-rose-900/50 bg-black/90 backdrop-blur-3xl p-6 mb-4 rounded-3xl shadow-[0_20px_50px_-10px_rgba(255,0,0,0.2)] relative group overflow-hidden text-rose-100 mt-4 font-mono">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-rose-600 to-transparent opacity-50" />
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none text-rose-500"><ShieldAlert size={120} className="-rotate-12" /></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-rose-900/30 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-950 flex items-center justify-center border border-rose-900 shadow-[0_0_15px_rgba(225,29,72,0.4)]">
            <Activity size={18} className="text-rose-500 animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-[14px] uppercase tracking-[0.2em] text-rose-500">Live Threat Assessment</h3>
            <p className="text-[10px] text-rose-200/40 uppercase tracking-widest font-semibold flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
               Aura Security Protocol v10.4
            </p>
          </div>
        </div>
        <div className="px-4 py-1.5 rounded-lg bg-rose-950/50 text-rose-400 border border-rose-900/50 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
           <AlertTriangle size={12} className="text-rose-500" />
           Code Red
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10">
        <div className="bg-rose-950/30 rounded-2xl p-4 border border-rose-900/40 hover:bg-rose-950/40 transition-colors">
          <div className="text-[10px] font-bold uppercase tracking-widest text-rose-400/50 mb-1 flex items-center gap-1.5"><Globe size={12} /> Origin Points</div>
          <div className="text-2xl font-black text-rose-500">12</div>
          <div className="text-[9px] text-rose-300 font-bold mt-1 flex items-center gap-1 uppercase tracking-tighter">Distributed Attack Signature</div>
        </div>
        <div className="bg-rose-950/30 rounded-2xl p-4 border border-rose-900/40 hover:bg-rose-950/40 transition-colors">
          <div className="text-[10px] font-bold uppercase tracking-widest text-rose-400/50 mb-1 flex items-center gap-1.5"><Activity size={12} /> Risk Index</div>
          <div className="text-2xl font-black text-rose-500">8.9/10</div>
          <div className="text-[9px] text-rose-600 font-black mt-1 flex items-center gap-0.5 uppercase">Critical Threshold Breached</div>
        </div>
        <div className="bg-rose-950/30 rounded-2xl p-4 border border-rose-900/40 hover:bg-rose-950/40 transition-colors">
          <div className="text-[10px] font-bold uppercase tracking-widest text-rose-400/50 mb-1 flex items-center gap-1.5"><Eye size={12} /> Intercepts</div>
          <div className="text-2xl font-black text-rose-500">142k</div>
          <div className="text-[9px] text-rose-300/40 font-bold mt-1 uppercase tracking-tighter">Automated Pruning Active</div>
        </div>
      </div>

      {/* Middle Visual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10 mb-6">
         <div className="bg-rose-950/30 rounded-2xl p-4 border border-rose-900/40 flex flex-col h-64">
           <div className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-4 pb-2 border-b border-rose-900/30 flex items-center justify-between">
             Attack Vector Distribution
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-rose-500"></span>
               <span className="text-[8px] text-rose-400">Intensity</span>
             </div>
           </div>
           <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={threatLevels} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#f43f5e' }} width={60} />
                <Tooltip 
                  cursor={{ fill: 'rgba(244,63,94,0.05)' }}
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #4c0519', borderRadius: '8px', fontSize: '10px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {threatLevels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
         </div>

         <div className="bg-rose-950/30 rounded-2xl p-4 border border-rose-900/40 flex flex-col h-64">
           <div className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-4 pb-2 border-b border-rose-900/30 flex items-center justify-between">
             Anomalous Activity Logs
             <Terminal size={12} className="text-rose-700" />
           </div>
           <div className="flex-1 overflow-y-auto pr-2 nice-scrollbar space-y-3">
              {mockAnomalies.map((anomaly) => (
                <div key={anomaly.id} className="p-3 bg-black/40 rounded-xl border border-rose-900/20 hover:border-rose-900 transition-colors group/row">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-rose-400 leading-none">{anomaly.type}</span>
                    <span className={cn(
                      "text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
                      anomaly.severity === 'Critical' ? "bg-rose-900 text-rose-100" : "bg-rose-950/50 text-rose-500"
                    )}>{anomaly.severity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <code className="text-[9px] text-rose-300/40 group-hover/row:text-rose-300 transition-colors">{anomaly.ip}</code>
                    <span className="text-[8px] text-rose-600 uppercase font-black tracking-widest">{anomaly.status}</span>
                  </div>
                </div>
              ))}
           </div>
         </div>
      </div>

      {/* Subpoena Recommendation Section */}
      <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-6 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 mb-4 text-rose-500">
           <Scale size={20} />
           <h4 className="text-xs font-black uppercase tracking-[0.3em]">Subpoena Recommendation Matrix</h4>
        </div>
        <div className="space-y-4 text-rose-200/70 text-[11px] leading-relaxed">
          <p>
            Based on the persistent attack signatures mapped to <span className="text-rose-500 font-bold underline">Node 4-AF</span>, there is a 94.2% probability of state-sponsored identification.
          </p>
          <div className="flex items-center gap-4 py-3 border-y border-rose-900/30">
            <div className="flex-1">
              <span className="block text-[8px] text-rose-500 uppercase font-black mb-1">Legal Threshold</span>
              <div className="h-1.5 bg-rose-950 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  className="h-full bg-rose-600"
                />
              </div>
            </div>
            <div className="text-right shrink-0">
               <span className="block text-lg font-black text-rose-500">85%</span>
               <span className="block text-[7px] text-rose-400 uppercase font-bold tracking-tighter">Probable Cause</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
             <button className="flex-1 px-4 py-2 bg-rose-900/50 border border-rose-800 text-rose-100 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-800 transition-colors flex items-center justify-center gap-2">
               <FileText size={12} /> Export Evidence
             </button>
             <button className="flex-1 px-4 py-2 bg-rose-600 text-rose-950 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 transition-colors flex items-center justify-center gap-2">
               <ShieldAlert size={12} /> Contact Authorities
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
