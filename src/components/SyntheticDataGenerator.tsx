import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Database, Zap, FileJson, Play, Code2, Copy, CheckCircle, BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';
import { SaphiraLogo } from './SaphiraLogo';

export function SyntheticDataGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [datasetSize, setDatasetSize] = useState(100);

  const startGeneration = () => {
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return p + Math.random() * 5 + 1;
      });
    }, 150);
  };

  return (
    <div className="bg-[#0A0F1E] border border-indigo-500/20 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px]" />
      
      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
          <Database size={24} className="text-pink-400" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">Synthetic Data Forge</h3>
          <p className="text-indigo-200/50 text-sm">High-fidelity QA generation via parameter manipulation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div className="space-y-6">
          <div className="bg-[#131A2A] rounded-2xl p-6 border border-white/5">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" /> Generator Configuration
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 block">Seed Context</label>
                <textarea 
                  className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl p-3 text-sm text-slate-300 h-24 focus:border-pink-500/50 transition-colors placeholder:text-slate-600 focus:outline-none"
                  placeholder="Paste core operational logic, legal framework, or medical guidelines to seed generation..."
                  defaultValue="Article 4.2.1: The compliance threshold dictates that inter-vlan traffic must traverse the DPI engine unless authenticated via mutual TLS."
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 flex justify-between">
                  <span>Dataset Volume</span>
                  <span className="text-indigo-400">{datasetSize} Pairs</span>
                </label>
                <input 
                  type="range" 
                  min="10" max="1000" step="10"
                  value={datasetSize}
                  onChange={(e) => setDatasetSize(parseInt(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={startGeneration}
                  disabled={isGenerating}
                  className={cn(
                    "w-full py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all",
                    isGenerating ? "bg-indigo-500/20 text-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-pink-600 to-indigo-600 text-white hover:opacity-90 shadow-lg"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <BrainCircuit size={16} className="animate-pulse" /> Generating... {Math.floor(progress)}%
                    </>
                  ) : (
                    <>
                      <Play size={16} /> Ignite Generation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-bold flex items-center gap-2">
              <FileJson size={16} className="text-emerald-400" /> Output Artifacts
            </h4>
            <div className="text-[10px] text-slate-500 font-mono tracking-wider">synthetic_ds_v1.jsonl</div>
          </div>
          
          <div className="bg-[#131A2A] rounded-2xl p-4 border border-white/5 h-[340px] overflow-y-auto font-mono text-xs relative">
            {progress === 0 && !isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                <Code2 size={32} className="mb-2 opacity-50" />
                <span>Awaiting initiation...</span>
              </div>
            )}
            
            <div className="space-y-4 text-slate-300">
              {progress > 10 && (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <div className="text-emerald-400 mb-1">{"{"}</div>
                  <div className="pl-4">
                    <span className="text-pink-400">"instruction":</span> "How should inter-vlan traffic be handled according to Article 4.2.1?",<br/>
                    <span className="text-indigo-400">"response":</span> "All inter-vlan traffic must traverse the DPI (Deep Packet Inspection) engine, unless it has been authenticated using mutual TLS."
                  </div>
                  <div className="text-emerald-400">{"}"}</div>
                </div>
              )}
              {progress > 40 && (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <div className="text-emerald-400 mb-1">{"{"}</div>
                  <div className="pl-4">
                    <span className="text-pink-400">"instruction":</span> "Can mutual TLS completely bypass the DPI engine?",<br/>
                    <span className="text-indigo-400">"response":</span> "Yes, per Article 4.2.1, inter-vlan traffic authenticated via mutual TLS is exempted from mandatory DPI engine traversal."
                  </div>
                  <div className="text-emerald-400">{"}"}</div>
                </div>
              )}
              {progress > 80 && (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <div className="text-emerald-400 mb-1">{"{"}</div>
                  <div className="pl-4">
                    <span className="text-pink-400">"instruction":</span> "What happens if inter-vlan traffic is neither mutually TLS authenticated nor routed to DPI?",<br/>
                    <span className="text-indigo-400">"response":</span> "Such traffic would violate Article 4.2.1 of the compliance threshold as it must meet at least one of those conditions."
                  </div>
                  <div className="text-emerald-400">{"}"}</div>
                </div>
              )}
            </div>

            {progress >= 100 && (
              <div className="mt-6 flex flex-col items-center justify-center pt-4 border-t border-white/5 animate-in fade-in">
                <CheckCircle size={24} className="text-emerald-400 mb-2" />
                <span className="font-bold text-white mb-4">Dataset Built Successfully</span>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors uppercase tracking-widest font-bold">
                  <Copy size={16} /> Export JSONL
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
