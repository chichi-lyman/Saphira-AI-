import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Scale, Lock, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const complianceSteps = [
  { id: 'nist', name: 'NIST AI 600-1', status: 'verified', description: 'Generative AI Risk Management Framework compliance active.' },
  { id: 'sovereign', name: 'Sovereign Node v9', status: 'verified', description: 'Distributed infrastructure sovereignty verified.' },
  { id: 'privacy', name: 'PII Shielding', status: 'active', description: 'Real-time anonymization protocols operational.' },
  { id: 'ethics', name: 'Alignment Check', status: 'verified', description: 'Moral-ethical bias mitigation at 99.8% precision.' },
];

export function SovereignComplianceModule() {
  return (
    <div className="nova-container p-6 mb-4 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity"><ShieldCheck size={120} /></div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
          <Scale size={20} className="text-emerald-600" />
        </div>
        <div>
          <h3 className="text-indigo-950 font-black text-[12px] uppercase tracking-[0.2em] font-display">Sovereign Compliance</h3>
          <p className="text-[9px] text-indigo-900/40 uppercase tracking-widest font-bold">NIST AI 600-1 Registered</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {complianceSteps.map((step, idx) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-4 p-3 bg-white/40 rounded-2xl border border-indigo-50/50 hover:border-emerald-200 transition-colors group/item"
          >
            <div className={cn(
              "mt-1 p-1 rounded-full",
              step.status === 'verified' ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"
            )}>
              {step.status === 'verified' ? <CheckCircle2 size={12} /> : <Activity size={12} className="" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-black text-indigo-950 uppercase tracking-wider">{step.name}</span>
                <span className={cn(
                  "text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
                  step.status === 'verified' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                )}>{step.status}</span>
              </div>
              <p className="text-[9px] text-indigo-900/60 leading-tight">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-indigo-50 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-2 text-indigo-900/40 font-bold uppercase tracking-widest">
           <Lock size={12} /> Data Sovereignty
        </div>
        <div className="text-emerald-600 font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded">
          Fully Compliant
        </div>
      </div>
    </div>
  );
}

const Activity = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
