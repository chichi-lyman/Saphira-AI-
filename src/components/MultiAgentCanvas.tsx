import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Shield, Terminal, Zap, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface MultiAgentCanvasProps {
  activeAgents: string[];
}

export const MultiAgentCanvas: React.FC<MultiAgentCanvasProps> = ({ activeAgents }) => {
  return (
    <div className="relative w-full h-64 mb-6 rounded-[28px] border border-white/10 bg-black/20 backdrop-blur-xl overflow-hidden flex items-center justify-center pointer-events-none">
      {/* Background routing lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
        <path d="M 200,80 Q 400,20 600,80 T 1000,80" fill="none" stroke="url(#glowGradient)" strokeWidth="1.5" />
        <path d="M 200,180 Q 400,240 600,180 T 1000,180" fill="none" stroke="url(#glowGradient)" strokeWidth="1.5" />
        <defs>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
      {/* Cascading light particles */}
      <motion.div 
        animate={{ x: [-100, 1000] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[80px] w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9)] z-0"
      />
      <motion.div 
        animate={{ x: [1000, -100] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 1 }}
        className="absolute top-[180px] w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9)] z-0"
      />

      {/* Agents */}
      <div className="relative z-10 flex items-center justify-center gap-12">
        <div className={cn("saphira-glass-panel p-4 flex flex-col items-center gap-2", activeAgents.includes('aura') && "active-pulse-border")}>
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-400 flex items-center justify-center">
            <Shield size={24} className="text-indigo-300" />
          </div>
          <span className="status-white text-[10px] font-black uppercase tracking-widest">Aura Target</span>
        </div>

        <div className={cn("saphira-glass-panel p-5 flex flex-col items-center gap-2 scale-110 shadow-[0_0_40px_rgba(236,72,153,0.3)]", activeAgents.includes('saphira') && "active-pulse-border")}>
          <div className="w-16 h-16 rounded-full bg-pink-500/20 border border-pink-400 flex items-center justify-center relative">
            <BrainCircuit size={32} className="text-pink-300 relative z-10" />
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-full bg-pink-500/20 z-0" />
          </div>
          <span className="status-white text-[11px] font-black uppercase tracking-widest luminescent-focus">Saphira ASI</span>
          <span className="telemetry-gray text-[8px] font-mono tracking-widest uppercase">Kernel Sync</span>
        </div>

        <div className={cn("saphira-glass-panel p-4 flex flex-col items-center gap-2", activeAgents.includes('agent_zero') && "active-pulse-border")}>
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
            <Terminal size={24} className="text-emerald-300" />
          </div>
          <span className="status-white text-[10px] font-black uppercase tracking-widest">Agent Zero</span>
        </div>
      </div>
    </div>
  );
};
