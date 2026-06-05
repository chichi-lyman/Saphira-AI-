import React from 'react';
import { motion } from 'framer-motion';

export const VisualIntelligenceOverlay = () => {
  return (
    <div className="p-4 border border-fuchsia-200 bg-white/80 shadow-md rounded-2xl mb-4 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-rose-500" />
      <h3 className="text-[10px] font-black uppercase text-fuchsia-800 tracking-widest mb-3 border-b border-fuchsia-50 pb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        Agentic & Visual Intelligence Matrix
      </h3>
      
      <div className="relative h-32 w-full bg-slate-900 rounded-xl overflow-hidden mb-4">
        {/* Simulating a computer vision / web scanning interface */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
        
        <motion.div 
          initial={{ top: 0 }}
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 4, ease: "linear", repeat: Infinity }}
          className="absolute w-full h-16 bg-gradient-to-b from-transparent to-fuchsia-500/20 border-b border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.5)]"
        />
        
        {/* Simulated Web Elements being scanned */}
        <div className="absolute inset-4 flex flex-col gap-2">
          <div className="w-1/2 h-2 bg-white/10 rounded flex items-center px-1">
             <div className="w-1 h-1 rounded-full bg-emerald-400 mr-2" />
             <div className="w-full h-[1px] bg-emerald-400/20 border-b border-emerald-400 border-dashed" />
          </div>
          <div className="w-3/4 h-2 bg-white/10 rounded" />
          <div className="w-1/3 h-2 bg-white/10 rounded" />
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute right-4 bottom-4 w-12 h-12 border border-rose-500 flex items-center justify-center p-1"
          >
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-rose-500" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-rose-500" />
            <span className="text-[6px] text-rose-500 font-mono tracking-widest">ANOMALY</span>
          </motion.div>
        </div>

        <div className="absolute bottom-1 right-2 text-[6px] text-fuchsia-300/50 font-mono">
          SCANNING DOM DOMAIN...
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-fuchsia-50/50 p-2 rounded-lg border border-fuchsia-100 flex flex-col items-center justify-center">
          <div className="text-[14px] font-black text-slate-800">PRE</div>
          <div className="text-[7px] uppercase tracking-widest text-slate-500 text-center">Process Reasoning Engine</div>
        </div>
        <div className="bg-rose-50/50 p-2 rounded-lg border border-rose-100 flex flex-col items-center justify-center">
          <div className="text-[14px] font-black text-rose-600">APA</div>
          <div className="text-[7px] uppercase tracking-widest text-rose-400 text-center">Agentic Process Auto</div>
        </div>
      </div>
    </div>
  );
};
