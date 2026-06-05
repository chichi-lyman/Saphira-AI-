import React from 'react';
import { motion } from 'motion/react';
import { Activity, GitMerge, GitBranch, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const CausalGraph = () => {
  return (
    <div className="relative w-full h-[250px] bg-white/40 backdrop-blur-xl border border-pink-100 rounded-2xl p-4 overflow-hidden flex flex-col group shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity"><GitMerge size={120} /></div>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 font-display relative z-10">
          <Activity size={14} className="text-pink-600" />
          Causal Analysis Topology
        </h3>
        <span className="px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Active Trace</span>
      </div>
      
      <div className="flex-1 relative mt-2 z-10">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="causalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="alertGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="glow-strong">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <path id="path1" d="M 50,100 C 120,100 120,40 180,40" fill="none" />
            <path id="path2" d="M 50,100 C 120,100 120,160 180,160" fill="none" />
            <path id="path3" d="M 180,40 C 250,40 250,100 350,100" fill="none" />
            <path id="path4" d="M 180,160 C 250,160 250,100 350,100" fill="none" />
          </defs>
          
          {/* Static Edges */}
          <path d="M 50,100 C 120,100 120,40 180,40" fill="none" stroke="url(#causalGradient)" strokeWidth="3" opacity="0.3" />
          <path d="M 50,100 C 120,100 120,160 180,160" fill="none" stroke="url(#alertGradient)" strokeWidth="3" opacity="0.3" />
          <path d="M 180,40 C 250,40 250,100 350,100" fill="none" stroke="url(#causalGradient)" strokeWidth="3" opacity="0.3" />
          <path d="M 180,160 C 250,160 250,100 350,100" fill="none" stroke="url(#alertGradient)" strokeWidth="3" opacity="0.3" />
          
          {/* Animated Edges */}
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
            d="M 50,100 C 120,100 120,40 180,40" 
            fill="none" stroke="url(#causalGradient)" strokeWidth="2" filter="url(#glow)"
          />
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
            d="M 50,100 C 120,100 120,160 180,160" 
            fill="none" stroke="url(#alertGradient)" strokeWidth="2" filter="url(#glow-strong)"
          />
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, delay: 1 }}
            d="M 180,40 C 250,40 250,100 350,100" 
            fill="none" stroke="url(#causalGradient)" strokeWidth="2" filter="url(#glow)"
          />
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, delay: 0.8 }}
            d="M 180,160 C 250,160 250,100 350,100" 
            fill="none" stroke="url(#alertGradient)" strokeWidth="2" strokeDasharray="3 6"
          />

          {/* Cross Connections */}
          <motion.path 
             initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }}
             transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
             d="M 180,40 L 180,160" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2 4"
          />
          
          {/* Nodes */}
          <g transform="translate(50, 100)">
            <circle r="14" fill="#fff" stroke="#ec4899" strokeWidth="2" filter="url(#glow)" className="animate-pulse" />
            <circle r="5" fill="#ec4899" />
            <text y="-22" textAnchor="middle" className="text-[9px] font-mono font-bold fill-indigo-950 uppercase tracking-widest">Client Gateway</text>
            <text y="24" textAnchor="middle" className="text-[7px] font-mono fill-pink-600">t=0ms</text>
          </g>
          
          <g transform="translate(180, 40)">
            <circle r="12" fill="#fff" stroke="#8b5cf6" strokeWidth="2" />
            <circle r="4" fill="#8b5cf6" />
            <text y="-20" textAnchor="middle" className="text-[9px] font-mono font-bold fill-indigo-900/80 uppercase tracking-widest">Logic Node A</text>
            <text y="22" textAnchor="middle" className="text-[7px] font-mono fill-violet-500">t=14ms</text>
          </g>
          
          <g transform="translate(180, 160)">
            <circle r="12" fill="#fff" stroke="#f43f5e" strokeWidth="2" filter="url(#glow-strong)" />
            <circle r="4" fill="#f43f5e" className="animate-ping" />
            <circle r="2" fill="#f43f5e" />
            <text y="-20" textAnchor="middle" className="text-[9px] font-mono font-bold fill-rose-600 uppercase tracking-widest">Anomaly Guard</text>
            <text y="22" textAnchor="middle" className="text-[7px] font-mono fill-rose-500">t=22ms</text>
          </g>
          
          <g transform="translate(350, 100)">
            <circle r="18" fill="#fff" stroke="#3b82f6" strokeWidth="3" filter="url(#glow)" />
            <motion.circle 
              r="8" 
              fill="#3b82f6" 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <text y="-28" textAnchor="middle" className="text-[10px] font-mono font-black fill-blue-600 uppercase tracking-[0.2em]">Convergence</text>
            <text y="28" textAnchor="middle" className="text-[7px] font-mono fill-blue-500">State Verified</text>
          </g>
        </svg>
      </div>
    </div>
  );
};

import { NeuralSyncVisualizer } from './NeuralSyncVisualizer';
import { CrystalState, CrystalEmotion } from './SaphiraCrystal';

export const NeuralSyncOverlay = ({ 
  active,
  state = 'idle',
  emotion = 'neutral',
  audioLevel = 0,
  vitals = { 
    cognitiveLoad: 15, 
    coherence: 95, 
    confidence: 80, 
    stress: 0.05, 
    phi: 0.45,
    isOverheating: false,
    isThrottling: false,
    modelMode: 'Cloud-Core' as const
  }
}: { 
  active: boolean;
  state?: CrystalState;
  emotion?: CrystalEmotion;
  audioLevel?: number;
  vitals?: {
    cognitiveLoad: number;
    coherence: number;
    confidence: number;
    stress: number;
    phi: number;
    isOverheating: boolean;
    isThrottling: boolean;
    modelMode: 'Cloud-Core' | 'Quantized-Nano';
  };
}) => {
  const [logs, setLogs] = React.useState<string[]>([
    "[READY] Neural socket handshake active...",
    "[SYSTEM] Establishing sub-spatial telemetry vectors.",
    "[CLUSTER] Local Safe Harbor Node online.",
  ]);

  React.useEffect(() => {
    if (!active) return;
    const items = [
      () => `[ROUTER] Routing query to GPU cluster structure: ${vitals.cognitiveLoad > 50 ? 'aws-govcloud' : 'oci-dedicated'}`,
      () => `[TELEMETRY] Load: ${vitals.cognitiveLoad}% | Coherence factor: ${vitals.coherence}% | Phi index: ${vitals.phi.toFixed(3)}`,
      () => `[SOCKET] Shunting packet stream | Latency: ${Math.floor(Math.random() * 25 + 15)}ms | Speed: ${Number((Math.random() * 4 + 8).toFixed(2))} GB/s`,
      () => `[SECURE] Signature bypass authorized: SAPHIRA-PREMIUM-OK`,
      () => `[MEMORY] Synchronizing episodic hash tables | Stress delta: ${vitals.stress.toFixed(2)}`,
      () => `[SYNAPSE] Active nodes pulsing | Thermal limits: NORMAL (54°C)`
    ];

    const timer = setInterval(() => {
      const idx = Math.floor(Math.random() * items.length);
      const newLog = `[${new Date().toLocaleTimeString()}] ${items[idx]()}`;
      setLogs(l => [...l.slice(-12), newLog]);
    }, 1800);

    return () => clearInterval(timer);
  }, [active, vitals]);

  if (!active) return null;
  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex flex-col md:flex-row items-center justify-around overflow-hidden p-6 md:p-12">
      <NeuralSyncVisualizer 
        active={active}
        state={state}
        emotion={emotion}
        audioLevel={audioLevel}
        vitals={vitals}
      />
      
      {/* Live Process Console Widget */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10 w-full md:w-[380px] bg-black/40 border border-white/10 rounded-2xl p-5 font-mono text-[9px] text-[#ec4899] h-[280px] md:h-[420px] overflow-hidden flex flex-col justify-end shadow-2xl backdrop-blur-xl"
      >
        <div className="absolute top-0 inset-x-0 bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/10 shrink-0">
          <span className="text-[10px] font-black uppercase text-white tracking-widest">Sovereign Link trace</span>
          <div className="flex gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto mt-8 pr-1 space-y-2 select-none text-left flex flex-col justify-end">
          {logs.map((log, index) => (
            <motion.p 
              key={index} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="leading-relaxed whitespace-pre-wrap break-all text-white/75 border-l border-[#ec4899]/30 pl-2"
            >
              {log}
            </motion.p>
          ))}
          <div className="w-1.5 h-3.5 bg-[#ec4899] animate-pulse rounded-sm mt-1" />
        </div>
      </motion.div>

      {/* Main visual core */}
      <div className="flex flex-col items-center select-none shrink-0 relative py-12">
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
          <motion.div 
             animate={{ 
               scale: [1, 1.8, 1], 
               opacity: [0, 0.25, 0], 
               rotate: 180 
             }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className={cn("absolute inset-0 rounded-full blur-[100px]", 
               vitals.isOverheating ? "bg-rose-500" : "bg-[#ec4899]"
             )}
          />
          <motion.div 
             animate={{ 
               scale: [0.8, 1.3, 0.8], 
               opacity: [0.15, 0.45, 0.15] 
             }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
             className={cn("absolute inset-4 rounded-full blur-[80px]", 
               vitals.isOverheating ? "bg-pink-500" : "bg-[#ec4899]"
             )}
          />
          <div className={cn(
            "relative z-10 w-28 h-28 md:w-32 md:h-32 rounded-[2rem] bg-black/50 backdrop-blur-2xl shadow-2xl flex items-center justify-center border transition-colors duration-500",
            vitals.isOverheating ? "border-rose-500/50 shadow-rose-500/40" : "border-[#ec4899]/50"
          )}>
            <div className={cn(
               "absolute inset-0 bg-gradient-to-tr rounded-[2rem] transition-opacity duration-500",
               vitals.isOverheating ? "from-rose-500/20 to-pink-500/20 opacity-100" : "from-[#ec4899]/20 to-indigo-500/20 opacity-40"
            )} />
            <Zap size={44} className={cn(
              "relative z-10 animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-colors duration-500",
              vitals.isOverheating ? "text-rose-400" : "text-white"
            )} />
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center relative z-10"
        >
          <div className={cn(
            "inline-block px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.3em] mb-4 animate-pulse transition-all duration-500",
            vitals.isOverheating 
              ? "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]" 
              : "bg-[#ec4899]/10 border-[#ec4899]/30 text-[#ec4899] shadow-[0_0_15px_rgba(236,72,153,0.15)]"
          )}>
             {vitals.isOverheating ? "CRITICAL COG LOAD" : "Cognitive Alignment Active"}
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-2xl">
            {vitals.isThrottling ? 'Autonomous Recovery' : (vitals.modelMode === 'Quantized-Nano' ? 'Nano Mode Active' : (state === 'thinking' ? 'Deep Processing' : 'Neural Synchronization'))}
          </h2>

          <div className="flex items-center justify-center gap-2">
             <div className={cn("w-2.5 h-2.5 rounded-full", active ? (vitals.isOverheating ? "bg-rose-400 animate-ping" : "bg-[#ec4899] animate-ping") : "bg-white/20")} />
             <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.4em] max-w-sm leading-relaxed">
               {vitals.isThrottling && "Catching breath... Resource re-allocation engaged."}
               {!vitals.isThrottling && vitals.modelMode === 'Quantized-Nano' && "Edge processing active. Cloud core sync paused."}
               {!vitals.isThrottling && vitals.modelMode === 'Cloud-Core' && state === 'listening' && 'Awaiting bio-input...'}
               {!vitals.isThrottling && vitals.modelMode === 'Cloud-Core' && state === 'thinking' && 'Re-indexing memory heuristics...'}
               {!vitals.isThrottling && vitals.modelMode === 'Cloud-Core' && state === 'speaking' && 'Synchronizing active threads...'}
               {!vitals.isThrottling && vitals.modelMode === 'Cloud-Core' && state === 'idle' && 'Mesh stabilized. Listening.'}
             </p>
          </div>
        </motion.div>
      </div>

      {/* Stats overlay / GPU heat map */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10 w-full md:w-[240px] bg-black/40 border border-white/10 rounded-2xl p-5 text-left text-white font-mono text-[10px] flex flex-col gap-4 shadow-2xl backdrop-blur-xl shrink-0"
      >
        <span className="text-[11px] font-black uppercase text-slate-300 tracking-wider">Operational HUD</span>
        <div>
          <span className="text-white/40 block">GPU PACKET HEAT</span>
          <span className="text-lg font-bold text-[#ec4899]">54.2°C <span className="text-[9px] font-normal text-slate-400 font-sans">OPTIMAL</span></span>
          <div className="w-full bg-white/5 h-1.5 mt-1 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#ec4899] to-red-500 h-full rounded-full" style={{ width: '54%' }}></div>
          </div>
        </div>

        <div>
          <span className="text-white/40 block">COGNITIVE LATENCY</span>
          <span className="text-lg font-bold text-[#ec4899]">42 ms</span>
        </div>

        <div>
          <span className="text-white/40 block">NODE AUTONOMY</span>
          <span className="text-lg font-bold text-emerald-400">98.4%</span>
        </div>

        <div className="border-t border-white/10 pt-3">
          <span className="text-white/40 block">ACTIVE MIDDLEWARE</span>
          <span className="text-[11px] font-bold text-indigo-400 uppercase">LangGraph v4.2</span>
        </div>
      </motion.div>
    </div>
  );
};

const energyData = [
  { time: '00:00', yield: 1200, baseline: 1000 },
  { time: '04:00', yield: 1400, baseline: 1050 },
  { time: '08:00', yield: 1350, baseline: 1100 },
  { time: '12:00', yield: 1800, baseline: 1150 },
  { time: '16:00', yield: 2200, baseline: 1200 },
  { time: '20:00', yield: 1900, baseline: 1100 },
  { time: '24:00', yield: 2400, baseline: 1050 },
];

export const FinancialVisualizer = () => {
  return (
    <div className="h-32 w-full mt-4 -ml-4">
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <AreaChart data={energyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px', border: '1px solid #fce7f3' }}
            itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
            labelStyle={{ fontSize: '10px', color: '#1e1b4b', fontWeight: 'bold' }}
          />
          <Area type="monotone" dataKey="baseline" stroke="#818cf8" fillOpacity={1} fill="url(#colorBaseline)" strokeDasharray="3 3" />
          <Area type="monotone" dataKey="yield" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
