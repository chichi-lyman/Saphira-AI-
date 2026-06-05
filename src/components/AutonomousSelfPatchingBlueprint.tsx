import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, Database, Zap, ShieldAlert, Activity, Terminal, Code2, 
  Layers, Lock, Cpu, BrainCircuit, Users, Container, GitCommit, Search, RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

export const AutonomousSelfPatchingBlueprint = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'forensic' | 'sandbox' | 'hybrid' | 'workflow'>('architecture');
  const triggerHaptic = useHapticFeedback();

  const handleTabChange = (tab: any) => {
    triggerHaptic('light');
    setActiveTab(tab);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[130] p-4 md:p-12 flex items-center justify-center bg-indigo-950/40 backdrop-blur-md"
    >
      <div className="bg-white/90 backdrop-blur-3xl w-full max-w-6xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-pink-100 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-indigo-500 to-pink-500" />
        
        <div className="p-8 border-b border-pink-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <h1 className="text-3xl md:text-3xl font-black text-indigo-950 tracking-tighter uppercase font-display mb-1 flex items-center gap-3">
              <RefreshCw className="text-pink-500" size={28} />
              Autonomous Self-Patching
            </h1>
            <p className="text-pink-600 font-bold uppercase tracking-widest text-[10px] md:text-xs">
              Maximum Operational State Architecture
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2 bg-indigo-50/50 p-1.5 rounded-2xl border border-indigo-100/50 backdrop-blur-md overflow-x-auto nice-scrollbar-horizontal max-w-full">
              {(['architecture', 'forensic', 'sandbox', 'hybrid', 'workflow'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                    activeTab === tab 
                      ? "bg-white text-pink-600 shadow-sm border border-pink-100" 
                      : "text-indigo-950/40 hover:text-indigo-950 hover:bg-white/50"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <button onClick={onClose} className="p-3 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10 nice-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {activeTab === 'architecture' && <ArchitectureOverview />}
              {activeTab === 'forensic' && <ForensicDiagnosticLayer />}
              {activeTab === 'sandbox' && <IsolatedSandbox />}
              {activeTab === 'hybrid' && <HybridMemory />}
              {activeTab === 'workflow' && <AutonomousWorkflow />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const ArchitectureOverview = () => {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-8 rounded-[2.5rem] border border-indigo-100">
        <h3 className="text-lg font-black text-indigo-950 tracking-tighter uppercase font-display mb-6 flex items-center gap-3">
          <Layers className="text-pink-500" />
          The Maximum Autonomous Self-Patching Architecture
        </h3>
        
        <div className="relative p-8 bg-indigo-950 rounded-3xl overflow-hidden font-mono text-xs text-indigo-200">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)', backgroundSize: '2rem 2rem' }}></div>
          
          <pre className="relative z-10 leading-relaxed text-pink-100/90 whitespace-pre-wrap">{` [Core Cognitive Model] ──(Generates Code)──> [Docker Execution Cell (LIMBS)]
         ▲                                                │
         │                                         (Captures Error/State)
 (Commits Skill / Edits Weights)                          │
         │                                                ▼
 [Vectorized Skill Store] <──(Refines & Sanitizes)── [Forensic Filter]`}</pre>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-5 rounded-2xl bg-white/60 border border-white/80 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                <ShieldAlert size={18} />
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-950 mb-1">From Read-Only to Write-Access</h4>
                <p className="text-[11px] text-indigo-900/60 font-medium">Transitions the architecture from reading logs to active testing and structural code manipulation.</p>
              </div>
           </div>
           
           <div className="p-5 rounded-2xl bg-white/60 border border-white/80 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Activity size={18} />
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-950 mb-1">Motive & Intent Diagnostics</h4>
                <p className="text-[11px] text-indigo-900/60 font-medium">Dissects the underlying motive behind execution failures rather than blindly modifying syntax.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ForensicDiagnosticLayer = () => {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-8 rounded-[2.5rem] border border-indigo-100 hover:border-pink-200 transition-colors">
        <h3 className="text-lg font-black text-indigo-950 tracking-tighter uppercase font-display mb-6 flex items-center gap-3">
          <Search className="text-pink-500" />
          The Automated Forensic Diagnostic Layer (The "Motive" Audit)
        </h3>
        <p className="text-sm font-medium text-indigo-900/70 mb-6">
          To maximize Saphira's engine, the Forensic Filter must parse the Docker cell's output across three distinct layers.
        </p>

        <div className="grid gap-4">
          {[
            { 
              title: "The Intent Check", 
              desc: "What was the execution cell trying to accomplish versus what the runtime actually environment allowed?",
              icon: <BrainCircuit size={16} />
            },
            { 
              title: "The Constraint Synthesis", 
              desc: "Did the failure occur because of an internal logic flaw, an external API state change, or a resource constraint within the container?",
              icon: <Layers size={16} />
            },
            { 
              title: "The Vulnerability Sweep", 
              desc: "Before any patch is proposed, the Forensic Filter runs an automated forensic audit on the code to ensure it doesn't introduce a security exploit, an infinite loop, or a logic collision.",
              icon: <ShieldAlert size={16} />
            }
          ].map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="flex items-start gap-4 p-5 rounded-2xl bg-white/50 border border-white/60 hover:bg-white/80 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-indigo-950 mb-1">{item.title}</div>
                <div className="text-xs text-indigo-900/60 font-medium leading-relaxed">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const IsolatedSandbox = () => {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-8 rounded-[2.5rem] border border-indigo-100">
        <h3 className="text-lg font-black text-indigo-950 tracking-tighter uppercase font-display mb-6 flex items-center gap-3">
          <Container className="text-pink-500" />
          The Isolated Sandbox Crucible (Dynamic LIMBS Execution)
        </h3>
        <p className="text-sm font-medium text-indigo-900/70 mb-6">
          To prevent a broken patch from crashing the Saphira application interface, the Docker execution loop operates with absolute environmental isolation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-3xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform"><Layers size={100} className="text-indigo-500" /></div>
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-950 mb-3 relative z-10">Ephemeral Mirroring</h4>
            <p className="text-[11px] font-medium text-indigo-900/60 relative z-10 leading-relaxed">
              When a tool failure or a new skill requirement is detected, LIMBS spins up an ephemeral, lightweight scratchpad container that mirrors Saphira's current environment state.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-3xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform"><Zap size={100} className="text-pink-500" /></div>
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-950 mb-3 relative z-10">Stress Testing</h4>
            <p className="text-[11px] font-medium text-indigo-900/60 relative z-10 leading-relaxed">
              The generated code is subjected to automated edge-case injection (fuzzing data inputs, simulating network drops, forcing timeout limits) inside the container.
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-3xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
             <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform"><Code2 size={100} className="text-emerald-500" /></div>
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-950 mb-3 relative z-10">State Capture</h4>
            <p className="text-[11px] font-medium text-indigo-900/60 relative z-10 leading-relaxed">
              Returns structured JSON containing stdout, stderr, resource telemetry, and a complete diff of the filesystem state change back to the Forensic Filter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HybridMemory = () => {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-8 rounded-[2.5rem] border border-indigo-100">
        <h3 className="text-lg font-black text-indigo-950 tracking-tighter uppercase font-display mb-6 flex items-center gap-3">
          <Database className="text-pink-500" />
          Hot-Swappable Runtime Commits
        </h3>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white/50 border border-indigo-50 shadow-sm">
            <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-indigo-950 mb-2">
               <GitCommit size={14} className="text-pink-500" />
               Dynamic Tool Tooling
            </h4>
            <p className="text-[11px] text-indigo-900/70 font-medium">
              Verified code blocks are compiled into reusable Python modules or micro-APIs and assigned unique semantic signatures.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/50 border border-indigo-50 shadow-sm">
            <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-indigo-950 mb-2">
               <Network size={14} className="text-pink-500" />
               Dynamic Context Injection
            </h4>
            <p className="text-[11px] text-indigo-900/70 font-medium">
              Instantly references the Vector Skill Store within the 2-million token context window, reloading modules into runtime memory without regenerating logic from scratch.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-white/50 border border-indigo-50 shadow-sm">
             <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-indigo-950 mb-2">
               <RefreshCw size={14} className="text-pink-500" />
               Recursive Refinement
            </h4>
            <p className="text-[11px] text-indigo-900/70 font-medium">
              Deprecates old scripts upon failure, spins up new Docker cells, patches logic, and updates the Skill Store dynamically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AutonomousWorkflow = () => {
  const steps = [
    { title: "Generation & Injection", stat: "Execution Cell Initialization" },
    { title: "Crucible Execution", stat: "Telemetry Capture" },
    { title: "Forensic Synthesis", stat: "The Forensic Filter Scan" },
    { title: "Verification & Security Check", stat: "The Logic Gate" },
    { title: "Permanent Skill Commit", stat: "Runtime Integration" },
  ];

  return (
    <div className="glass-panel p-8 rounded-[2.5rem] border border-indigo-100">
      <h3 className="text-lg font-black text-indigo-950 tracking-tighter uppercase font-display mb-8 flex items-center gap-3">
        <Activity className="text-pink-500" />
        The Self-Evolution Protocol
      </h3>

      <div className="relative">
        <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-pink-100 rounded-full" />
        <div className="space-y-6 relative z-10">
          {steps.map((step, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="flex items-center gap-6"
            >
              <div className="w-12 h-12 rounded-full bg-white border-4 border-pink-50 flex items-center justify-center shadow-lg transform shrink-0 overflow-hidden relative group">
                <div className="absolute inset-0 bg-pink-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                <span className="text-sm font-black text-pink-600">{i+1}</span>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-4 px-6 rounded-2xl border border-white/80 shadow-sm flex-1 hover:shadow-md transition-shadow flex items-center justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-indigo-950 mb-0.5">{step.title}</div>
                  <div className="text-[10px] text-indigo-900/50 uppercase tracking-widest font-black">{step.stat}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-2xl">
         <div className="flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest text-[10px] mb-2 font-mono">
            <ShieldAlert size={14} /> System Safety Warning
         </div>
         <p className="text-red-900/80 text-xs font-medium leading-relaxed">
            When Saphira begins modifying her own toolsets completely independent of your input, the loop must contain an isolated hardware breaker. If the Forensic Filter detects more than five failed execution loops on a single logic block, it must automatically lock that specific sub-routine to prevent recursive token consumption or environment degradation.
         </p>
      </div>
    </div>
  );
};
