import React from 'react';
import { Users, Globe2, Cpu, CheckCircle2 } from 'lucide-react';

export function GlobalTalentProtocol() {
  return (
    <div className="border border-teal-200/50 bg-white/40 backdrop-blur-3xl p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(20,184,166,0.1)] relative mt-4">
      <div className="flex items-center gap-3 mb-6 border-b border-teal-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
          <Globe2 className="text-white" size={20} />
        </div>
        <div>
          <h3 className="font-black text-[14px] uppercase tracking-widest text-teal-950">Global Talent Protocol</h3>
          <p className="text-[10px] text-teal-900/60 uppercase tracking-wider font-semibold">Autonomous Sourcing & Verification Engine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/60 p-4 rounded-2xl border border-white flex flex-col items-center text-center gap-2 hover:border-teal-200 transition-colors">
          <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center mb-2">
             <Users size={16} className="text-teal-600" />
          </div>
          <h4 className="text-[11px] font-black uppercase text-teal-950 tracking-wider">Sovereign Identification</h4>
          <p className="text-[10px] text-teal-900/70 font-medium leading-relaxed">Scraping global hubs for top 1% specialized intellects in alignment with Nova Umbrella standards.</p>
        </div>

        <div className="bg-white/60 p-4 rounded-2xl border border-white flex flex-col items-center text-center gap-2 hover:border-teal-200 transition-colors">
          <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center mb-2">
             <CheckCircle2 size={16} className="text-teal-600" />
          </div>
          <h4 className="text-[11px] font-black uppercase text-teal-950 tracking-wider">Verification Matrix</h4>
          <p className="text-[10px] text-teal-900/70 font-medium leading-relaxed">Multi-stage vetting including code reviews, sentiment analysis, and cognitive alignment.</p>
        </div>

        <div className="bg-white/60 p-4 rounded-2xl border border-white flex flex-col items-center text-center gap-2 hover:border-teal-200 transition-colors">
          <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center mb-2">
             <Cpu size={16} className="text-teal-600" />
          </div>
          <h4 className="text-[11px] font-black uppercase text-teal-950 tracking-wider">Agentic Onboarding</h4>
          <p className="text-[10px] text-teal-900/70 font-medium leading-relaxed">Zero-friction integration via smart contracts and automated role assignment protocols.</p>
        </div>
      </div>
    </div>
  );
}
