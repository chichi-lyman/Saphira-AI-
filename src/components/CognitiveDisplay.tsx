import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface CognitiveDisplayProps {
  transcript: string[];
  synthesis: string[];
  vitals: {
    phi: number;
    stress: number;
  };
}

export const CognitiveDisplay: React.FC<CognitiveDisplayProps> = ({ transcript, synthesis, vitals }) => {
  return (
    <>
      {/* Ambient Transcript: The Safety Net */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 pointer-events-none z-10 overflow-hidden">
        <div className="flex flex-col-reverse gap-2 opacity-20">
          <AnimatePresence initial={false}>
            {transcript.slice(-4).map((text, i) => (
              <motion.div
                key={`${text}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1 - i * 0.2, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-[10px] font-mono text-indigo-900/60 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Tactical Overlay: Forensic Synthesis */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 pointer-events-none z-[60]">
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {synthesis.map((point, index) => (
              <motion.div
                key={`${point}-${index}`}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "liquid-glass p-4 flex items-start gap-4 border-l-2",
                  point.toLowerCase().includes('contradiction') || point.toLowerCase().includes('anomaly')
                    ? "border-l-rose-500 bg-rose-500/5 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-pulse"
                    : "border-l-indigo-400 bg-white/40 shadow-sm"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg shrink-0",
                  point.toLowerCase().includes('contradiction') ? "bg-rose-500/10 text-rose-500" : "bg-indigo-500/10 text-indigo-500"
                )}>
                  {point.toLowerCase().includes('contradiction') ? <Target size={14} /> : <Zap size={14} />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-[0.2em]",
                      point.toLowerCase().includes('contradiction') ? "text-rose-600" : "text-indigo-600"
                    )}>
                      {point.toLowerCase().includes('contradiction') ? 'Neural Discrepancy' : 'Strategic Synthesis'}
                    </span>
                    {point.toLowerCase().includes('contradiction') && (
                      <span className="bg-rose-500 text-white text-[8px] px-1 rounded font-bold animate-pulse">Critical</span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed">
                    {point}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
