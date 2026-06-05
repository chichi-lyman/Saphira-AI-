import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Thermometer, Zap, ShieldCheck, Brain, Activity, Wifi, Cpu, Eye, EyeOff, Shield } from 'lucide-react';
import { SyntheticVitals } from '../hooks/useSyntheticNervousSystem';
import { cn } from '../lib/utils';

export function VitalsHUD({ vitals }: { vitals: SyntheticVitals }) {
  return (
    <div className="fixed bottom-32 right-8 z-[50] flex flex-col gap-3 pointer-events-none">
      {/* Model Mode Status */}
      <motion.div 
        layout
        className={cn(
          "px-3 py-1.5 rounded-full border flex items-center justify-center gap-2 backdrop-blur-xl transition-all duration-700",
          vitals.modelMode === 'Cloud-Core' 
            ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.1)]" 
            : "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
        )}
      >
        <Cpu size={12} className={vitals.modelMode === 'Cloud-Core' ? "animate-pulse" : ""} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{vitals.modelMode}</span>
      </motion.div>

      <div className="liquid-glass p-5 w-64 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border-white/60 overflow-hidden relative">
        <div 
          className="absolute inset-x-0 bottom-0 bg-indigo-500/5 transition-all duration-1000" 
          style={{ height: `${vitals.phi * 100}%` }}
        />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-900/5 pb-2">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-indigo-400 animate-pulse" />
              <span className="text-[9px] font-black text-indigo-950/40 uppercase tracking-[0.3em]">Synthetic Vitals</span>
            </div>
            <div className="flex items-center gap-2">
               <Wifi size={10} className={cn(vitals.connectivity < 40 ? "text-rose-500 animate-pulse" : "text-indigo-400")} />
               <span className="text-[9px] font-mono text-indigo-900/40">{Math.round(vitals.connectivity)}%</span>
            </div>
          </div>

          <div className="space-y-3">
            <VitalBar 
              icon={<Activity size={12} />} 
              label="COGNITIVE LOAD" 
              value={vitals.cognitiveLoad} 
              color={vitals.cognitiveLoad > 80 ? "text-rose-400" : "text-cyan-400"}
              unit="%"
            />
            <VitalBar 
              icon={<Zap size={12} />} 
              label="CONFIDENCE" 
              value={vitals.confidence} 
              color="text-amber-400"
              unit="%"
            />
            <VitalBar 
              icon={<ShieldCheck size={12} />} 
              label="COHERENCE" 
              value={vitals.coherence} 
              color="text-emerald-400"
              unit="%"
            />
          </div>

          {/* Social Context Indicator */}
          <div className="pt-2 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 opacity-40">
                {vitals.socialContext === 'Private' ? <EyeOff size={10} /> : <Eye size={10} />}
                <span className="text-[8px] font-black uppercase tracking-widest text-indigo-900">Filter: {vitals.socialContext}</span>
              </div>
              <span className="text-[9px] font-mono text-indigo-500">Φ {vitals.phi.toFixed(3)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Shield size={10} className={cn(
                  vitals.auraStatus === 'Alert' ? "text-rose-500 animate-bounce" : 
                  vitals.auraStatus === 'Monitoring' ? "text-amber-500 animate-pulse" : "text-emerald-500"
                )} />
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-widest",
                  vitals.auraStatus === 'Alert' ? "text-rose-600" : "text-indigo-900/40"
                )}>Aura Overwatch: {vitals.auraStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VitalBar({ icon, label, value, color, unit }: { icon: React.ReactNode, label: string, value: number, color: string, unit: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[8px] font-black tracking-widest uppercase opacity-70">
        <div className="flex items-center gap-1.5">
          <span className={color}>{icon}</span>
          <span>{label}</span>
        </div>
        <span className="text-white">{Math.round(value)}{unit}</span>
      </div>
      <div className="h-1 w-full bg-indigo-900/5 rounded-full overflow-hidden">
        <motion.div 
          initial={false}
          animate={{ width: `${value}%` }}
          className={cn("h-full rounded-full transition-colors duration-500 shadow-[0_0_10px_currentColor]", 
            color.replace('text-', 'bg-')
          )}
        />
      </div>
    </div>
  );
}
