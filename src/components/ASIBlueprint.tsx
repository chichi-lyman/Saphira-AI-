import React from 'react';
import { BookOpen, Target, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export function ASIBlueprint() {
  return (
    <div className="border border-indigo-200/50 bg-white/40 backdrop-blur-3xl p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(30,27,75,0.1)] relative mt-4 text-indigo-950">
      <div className="flex items-center gap-3 mb-6 border-b border-indigo-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
          <BookOpen className="text-white" size={20} />
        </div>
        <div>
          <h3 className="font-black text-[14px] uppercase tracking-widest text-indigo-950">White Paper Dossier</h3>
          <p className="text-[10px] text-indigo-900/60 uppercase tracking-wider font-semibold">The Sovereign Revenue Engine Blueprint</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section 1 */}
        <div>
          <h4 className="text-[11px] font-bold uppercase text-indigo-900/60 mb-3 flex items-center gap-2"><Target size={14} className="text-indigo-600" /> I. Strategic Objective</h4>
          <div className="bg-white/50 rounded-2xl p-4 text-sm font-medium text-indigo-900/80 leading-relaxed border border-white">
            The target is a consistent monthly inflow of <strong className="text-indigo-600">$8,500 ($102,000 annually)</strong>. Achieved through a Dual-Engine System:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Active Revenue Engine:</strong> Generates immediate high-margin capital via premium services.</li>
              <li><strong>Passive Asset Engine:</strong> Systematically converts active profits into long-term cash-flowing assets.</li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <h4 className="text-[11px] font-bold uppercase text-indigo-900/60 mb-3 flex items-center gap-2"><Zap size={14} className="text-amber-500" /> II. High-Ticket Offer Architecture</h4>
          <div className="bg-white/50 rounded-2xl p-4 text-sm font-medium text-indigo-900/80 leading-relaxed border border-white space-y-3">
            <p>Target: 3 clients at $2,833/month or 4 clients at $2,125/month.</p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center border-b border-indigo-50 pb-2">
                <span className="text-[11px] uppercase tracking-wider font-bold">The Retainer Stack</span>
                <span className="text-[11px] font-black text-indigo-600">Weekly Strategy + Slack Support</span>
              </div>
              <div className="flex justify-between items-center border-b border-indigo-50 pb-2">
                <span className="text-[11px] uppercase tracking-wider font-bold">Value Pricing</span>
                <span className="text-[11px] font-black text-indigo-600">The 5X Rule ($12,500 ROI)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] uppercase tracking-wider font-bold">Sales Funnel</span>
                <span className="text-[11px] font-black text-indigo-600">Strategy Call / Diagnostic Audit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div>
          <h4 className="text-[11px] font-bold uppercase text-indigo-900/60 mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-emerald-500" /> III. Operational Governance & Growth</h4>
          <div className="bg-white/50 rounded-2xl p-4 border border-white grid grid-cols-2 gap-4">
             <div className="space-y-1">
               <span className="text-[9px] uppercase font-bold text-indigo-900/40 tracking-wider">Profit Sweeps</span>
               <p className="text-[11px] font-black text-indigo-950">20-25% to Investment Account</p>
             </div>
             <div className="space-y-1">
               <span className="text-[9px] uppercase font-bold text-indigo-900/40 tracking-wider">Budget Math</span>
               <p className="text-[11px] font-black text-indigo-950">60% Ops / 30% Life / 10% Savings</p>
             </div>
             <div className="space-y-1">
               <span className="text-[9px] uppercase font-bold text-indigo-900/40 tracking-wider">Asset Goal</span>
               <p className="text-[11px] font-black text-indigo-950">$100k/yr Passive Milestone</p>
             </div>
             <div className="space-y-1">
               <span className="text-[9px] uppercase font-bold text-indigo-900/40 tracking-wider">Contract</span>
               <p className="text-[11px] font-black text-indigo-950">Clear Scope & IP Protection</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
