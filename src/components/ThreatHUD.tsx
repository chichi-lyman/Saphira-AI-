import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Activity, Wifi, Lock, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ThreatHUDProps {
  active: boolean;
  onClose: () => void;
}

export function ThreatHUD({ active, onClose }: ThreatHUDProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-4 pointer-events-none"
        >
          <div className="nova-container p-4 bg-rose-950/80 backdrop-blur-3xl border border-rose-500/30 shadow-[0_0_50px_rgba(225,29,72,0.2)] pointer-events-auto overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShieldAlert size={20} className="text-rose-500 animate-pulse" />
                  <div className="absolute inset-0 bg-rose-500 blur-lg opacity-50" />
                </div>
                <div>
                   <h3 className="text-[10px] font-black text-rose-100 uppercase tracking-[0.2em] leading-none">Quantum Threat Monitoring</h3>
                   <span className="text-[7px] text-rose-400/60 uppercase font-bold tracking-widest">Active Surveillance Mode</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-rose-500/10 rounded-md transition-colors text-rose-400"
              >
                <X size={14} className="" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
               <HUDMetric icon={<Activity size={10} />} label="Entropy" value="S-Tier" color="text-rose-400" />
               <HUDMetric icon={<Wifi size={10} />} label="Origin" value="12 Nodes" color="text-amber-400" />
               <HUDMetric icon={<Lock size={10} />} label="Integrity" value="99.9%" color="text-emerald-400" />
               <HUDMetric icon={<AlertTriangle size={10} />} label="Risk" value="CRITICAL" color="text-rose-600 animate-pulse" />
            </div>

            <div className="mt-4 pt-3 border-t border-rose-500/10 flex items-center justify-between">
               <div className="text-[8px] text-rose-300/40 uppercase font-black tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  Live Stream: Node-9 Divergence
               </div>
               <div className="text-[7px] font-mono text-rose-500 selection:bg-rose-500/20">
                  0xFA4..92C
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HUDMetric({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="p-2 bg-black/40 rounded-xl border border-rose-500/10 flex flex-col items-center justify-center">
       <div className="text-rose-500/40 mb-1">{icon}</div>
       <div className="text-[7px] text-rose-300/40 uppercase font-black mb-0.5">{label}</div>
       <div className={cn("text-[9px] font-black uppercase tracking-tighter", color)}>{value}</div>
    </div>
  );
}

const X = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
