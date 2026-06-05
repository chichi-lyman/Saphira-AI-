import React from 'react';
import { motion } from 'motion/react';
import { Database, Shield, Lock, Activity, EyeOff, Server, Terminal, Key } from 'lucide-react';
import { cn } from '../lib/utils';

export function SecureMemoryVault() {
  return (
    <div className="border border-indigo-200/50 bg-white/40 backdrop-blur-3xl p-6 mb-4 rounded-3xl shadow-[0_10px_40px_-10px_rgba(30,27,75,0.1)] relative group overflow-hidden text-indigo-950 mt-4">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none text-indigo-600">
        <Server size={120} className="-rotate-12" />
      </div>
      
      <div className="flex items-center justify-between mb-6 border-b border-indigo-100 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
            <Lock size={14} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-black text-[12px] uppercase tracking-widest text-indigo-950">Secure Memory Hosting</h3>
            <p className="text-[10px] text-indigo-900/40 uppercase tracking-wider font-semibold">Sovereign Data Integrity Tier</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
           <Shield size={10} />
           TEE Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
        {/* Zero-Knowledge Infrastructure */}
        <div className="glass-panel rounded-2xl p-4 border border-white hover:border-indigo-200 transition-colors">
          <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-900/50 mb-2 flex items-center gap-1.5">
            <EyeOff size={12} className="text-indigo-600" /> 
            Zero-Knowledge Infrastructure
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg text-[10px] font-bold uppercase">
              <span className="text-indigo-900/60">Encryption</span>
              <span className="text-indigo-950 flex gap-1 items-center"><Key size={10} /> AES-256 E2EE</span>
            </div>
            <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg text-[10px] font-bold uppercase">
              <span className="text-indigo-900/60">Vector DB</span>
              <span className="text-indigo-950 flex gap-1 items-center"><Database size={10} /> Local ChromaDB</span>
            </div>
          </div>
        </div>

        {/* Forensic Security Layer */}
        <div className="glass-panel rounded-2xl p-4 border border-white hover:border-indigo-200 transition-colors">
          <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-900/50 mb-2 flex items-center gap-1.5">
            <Terminal size={12} className="text-pink-600" /> 
            Forensic Security Layer
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg text-[10px] font-bold uppercase">
              <span className="text-indigo-900/60">Aura Layer</span>
              <span className="text-emerald-600">PII Scrubbing Active</span>
            </div>
            <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg text-[10px] font-bold uppercase">
              <span className="text-indigo-900/60">Agent 2</span>
              <span className="text-emerald-600 flex gap-1 items-center"><Activity size={10} /> Threat Monitoring</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
