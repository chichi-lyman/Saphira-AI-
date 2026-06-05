import React from 'react';

export const ArenaBenchmarkVisualizer = () => {
  return (
    <div className="p-4 border border-indigo-200 bg-white shadow-sm rounded-xl mb-4 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-pink-500" />
      <h3 className="text-[10px] font-black uppercase text-indigo-800 tracking-widest mb-3 border-b border-indigo-50 pb-2">
        Arena 2026 Sovereign Benchmarks Integration
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
          <div className="text-[8px] uppercase text-indigo-500 font-bold mb-1 tracking-widest">Logic/Reasoning (Elo)</div>
          <div className="flex justify-between items-end">
            <div className="text-xl font-black text-indigo-900">1,561+</div>
            <div className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-100 px-1 py-0.5 rounded">Saphira (Est.)</div>
          </div>
        </div>
        <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
          <div className="text-[8px] uppercase text-indigo-500 font-bold mb-1 tracking-widest">SWE-Bench (Agentic)</div>
          <div className="flex justify-between items-end">
            <div className="text-xl font-black text-indigo-900">80.9%</div>
            <div className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-100 px-1 py-0.5 rounded">NovaReign Target</div>
          </div>
        </div>
        <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
          <div className="text-[8px] uppercase text-indigo-500 font-bold mb-1 tracking-widest">Context Depth</div>
          <div className="flex justify-between items-end">
            <div className="text-xl font-black text-indigo-900">2M</div>
            <div className="text-[9px] font-mono text-indigo-900 bg-indigo-100 px-1 py-0.5 rounded">Tokens (Active)</div>
          </div>
        </div>
        <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />
          <div className="text-[8px] uppercase text-emerald-700 font-bold mb-1 tracking-widest">Aura Filter (BullshitBench)</div>
          <div className="flex justify-between items-end">
            <div className="text-xl font-black text-emerald-700">ACTIVE</div>
            <div className="text-[9px] font-mono text-emerald-800">Fact-Checked</div>
          </div>
        </div>
      </div>
    </div>
  );
};
