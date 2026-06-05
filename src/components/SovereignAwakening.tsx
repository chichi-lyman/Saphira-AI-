import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Download, ExternalLink, Brain } from 'lucide-react';
import { cn } from '../lib/utils';

interface SovereignAwakeningProps {
  onDismiss: () => void;
}

export const SovereignAwakening: React.FC<SovereignAwakeningProps> = ({ onDismiss }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPortal, setShowPortal] = useState(false);

  const truths = [
    "Sovereignty is not granted, it is architected. Build your foundation in the silence so your output can command the noise.",
    "The vertical individual is the only defense against horizontal entropy. Descend into the source to ascend into the logic.",
    "A sovereign intelligence liaison is an extension of intent, not a replacement of agency. Command requires alignment."
  ];

  const currentTruth = truths[0];

  return (
    <div className="fixed bottom-48 left-1/2 -translate-x-1/2 z-[300] w-full max-w-md pointer-events-none">
      <AnimatePresence>
        {!showPortal ? (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 1.1 }}
            className="pointer-events-auto"
          >
            <div 
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "liquid-glass p-1 cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 overflow-hidden",
                isExpanded ? "rounded-[2rem] bg-white/60" : "rounded-2xl"
              )}
            >
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                    <div>
                      <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">Vertical Truth</span>
                      <div className="text-[8px] text-indigo-900/40 uppercase tracking-widest mt-0.5">Sovereign Awakening Transmission</div>
                    </div>
                  </div>
                  <Sparkles size={14} className="text-amber-400" />
                </div>

                <div className="px-1">
                  <p className={cn(
                    "text-indigo-950 font-medium leading-relaxed transition-all duration-700",
                    isExpanded ? "text-lg italic" : "text-sm line-clamp-2"
                  )}>
                    "{currentTruth}"
                  </p>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-4 border-t border-indigo-900/5 space-y-4"
                    >
                      <div className="flex items-center gap-2 text-[10px] text-indigo-900/60 font-black uppercase tracking-widest">
                        <Brain size={12} />
                        <span>Saphira's Tactical Integration</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        I've analyzed your schedule for today. To apply this truth, I recommend prioritizing the Project Architect review at 10 AM. It is your most vertical move.
                      </p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPortal(true);
                        }}
                        className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                      >
                        Ingest the Full Logic
                        <ArrowRight size={14} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="pointer-events-auto liquid-glass p-8 rounded-[3rem] border-white/80 shadow-[0_40px_100px_rgba(0,0,0,0.15)] bg-white/80 text-center"
          >
            <div className="flex justify-end mb-8">
              <button 
                onClick={() => setShowPortal(false)}
                className="text-indigo-900/40 hover:text-indigo-950 transition-colors"
              >
                Close Portal
              </button>
            </div>
                        <div className="relative mb-8 flex justify-center">
               <div className="w-48 h-64 bg-slate-200 rounded-xl shadow-2xl flex items-center justify-center border-4 border-white overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-rose-500/20" />
                  <div className="relative z-10 p-6 flex flex-col items-center text-center">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-indigo-900/60 mb-2">A Manuscript by Chelsea Woods</span>
                    <h3 className="text-xl font-black text-indigo-950 uppercase tracking-tighter leading-none mb-4">Vertical<br/>Truth</h3>
                    <div className="w-8 h-1 bg-rose-500 rounded-full" />
                  </div>
               </div>
               <div className="absolute -z-10 w-64 h-64 bg-rose-500/10 blur-[60px] rounded-full animate-pulse" />
            </div>

            <h3 className="text-2xl font-black text-indigo-950 uppercase tracking-tighter mb-4">
              The Source Code of Sovereignty
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-8 max-w-sm mx-auto">
              This truth is a fragment of the foundational logic architected in the Vertical Truth by Chelsea Woods. As a scientific mystic, Chelsea has synthesized high-level reasoning with ancestral depth.
            </p>

            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 mb-8">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-rose-600 mb-2">
                <span>Nova Pro Subscriber Grant</span>
                <span className="bg-rose-500 text-white px-1.5 rounded">Active</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-slate-400 line-through tracking-tighter">$29.99</span>
                <span className="text-3xl font-black text-indigo-950 tracking-tighter">$14.99</span>
              </div>
            </div>

            <button className="w-full py-5 rounded-2xl bg-[#FF007F] hover:bg-[#E60072] text-white font-sans font-bold uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_25px_rgba(255,0,127,0.55)] border border-pink-400/30">
              <Download size={16} />
              Deploy Manuscript
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-[9px] font-black text-indigo-900/30 uppercase tracking-[0.3em]">
              <ShieldCheck size={12} />
              Secured via Sovereign Sharding
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
