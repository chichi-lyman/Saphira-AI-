import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Copy, CheckCircle, Terminal, BrainCircuit, Rocket, Shield, 
  Layers, Database, Globe, Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

const PROMPT_TEXT = `You are a Principal Enterprise Architect and Systems Anthropologist. I need you to generate an exhaustive, production-grade Master Blueprint for my platform based on the context I will provide. Do not summarize or gloss over technical details. Treat this as the definitive source-of-truth documentation for the platform.

Structure the response by breaking down the blueprint into the following explicit categories, addressing the Who, What, When, Where, Why, and How for each.

For EVERY category, you must provide a detailed breakdown covering:
1. OVERVIEW & PURPOSE (The What & Why)
2. ARCHITECTURE & LIFECYCLE (The How, Where, & When)
3. ACTORS & PERMISSIONS (The Who)

---

### CATEGORY 1: CAPABILITY MATRIX (What It Can Do & Does)
- Detailed breakdown of every core feature, user-facing function, and automated background process.
- Operational boundaries: What is natively supported vs. what is out of scope.
- Input/Output specifications for main user actions.

### CATEGORY 2: SYSTEM ARCHITECTURE & TECH STACK (How It Works & Where)
- Complete technology stack (Frontend, Backend, Databases, Serverless Workers, Cloud Infrastructure).
- Data Flow & Orchestration: How data moves through the system from a client request to the database/API and back.
- State Management and Caching mechanics (e.g., ephemeral vs. persistent storage).

### CATEGORY 3: INTEGRATION & INTERFACE BLUEPRINT (Where & How It Connects)
- API Strategy: REST endpoints, WebSockets, or gRPC configurations (including authentication headers and payload types).
- Third-party integrations (e.g., Payment gateways, Auth providers, AI models/pipelines).
- Cross-platform scaling (Mobile, Tablet, Web responsive strategies).

### CATEGORY 4: SECURITY, PRIVACY & COMPLIANCE (The Safe & Ethical Who/How)
- Authentication & Authorization models (e.g., RBAC, OAuth, JWT handling).
- Data governance: PII redaction, encryption-at-rest/in-transit, and data siloing.
- Multi-tenant isolation boundaries (if applicable).

### CATEGORY 5: DEPLOYMENT & DEVOPS PIPELINE (When & How It Updates)
- CI/CD pipeline mechanics from code push to production deployment.
- Dependency optimization, asset bundling strategies, and build-time vs. run-time environment handling.
- Error handling, logging, monitoring, and failover recovery procedures.

---

### EXECUTION INSTRUCTIONS:
- Write in clear, professional, and highly technical language.
- Adopt a deep-dive, structural breakdown format using nested markdown headers, bullet points, and code/data blocks where appropriate to keep it highly organized.
- Do not stop writing until the entire blueprint is exhaustively detailed. If you run out of token space, pause and ask me to say "continue".

Here is all the source text, notes, raw code fragments, and context about my platform to build the blueprint from:

[PASTE YOUR PLATFORM NOTES, CORE TEXT, CODE SNIPPETS, OR PREVIOUS SUMMARY HERE]`;

export const MasterBlueprintPromptOverlay = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'practices'>('prompt');
  const [isCopied, setIsCopied] = useState(false);
  const triggerHaptic = useHapticFeedback();

  const handleTabChange = (tab: any) => {
    triggerHaptic('light');
    setActiveTab(tab);
  };

  const copyToClipboard = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(PROMPT_TEXT);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[140] p-4 md:p-12 flex items-center justify-center bg-indigo-950/40 backdrop-blur-md"
    >
      <div className="bg-white/90 backdrop-blur-3xl w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-pink-100 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-indigo-500 to-pink-500" />
        
        <div className="p-8 border-b border-pink-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tighter uppercase font-display mb-1 flex items-center gap-3">
              <Terminal className="text-pink-500" size={28} />
              AI Studio Master Prompt
            </h1>
            <p className="text-pink-600 font-bold uppercase tracking-widest text-[10px] md:text-xs">
              Exhaustive Architectural Blueprint Generator
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2 bg-indigo-50/50 p-1.5 rounded-2xl border border-indigo-100/50 backdrop-blur-md overflow-x-auto nice-scrollbar-horizontal max-w-full">
              {(['prompt', 'practices'] as const).map(tab => (
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
                  {tab === 'prompt' ? 'The Prompt' : 'Best Practices'}
                </button>
              ))}
            </div>
            
            <button onClick={onClose} className="p-3 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative z-10 nice-scrollbar flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex-1 overflow-y-auto p-6 md:p-8"
            >
              {activeTab === 'prompt' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-indigo-900/60 max-w-2xl">
                      Because LLMs can sometimes summarize too aggressively, use this structured, hierarchical prompt to generate an exhaustive, end-to-end blueprint of your platform.
                    </p>
                    <button 
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 shrink-0"
                    >
                      {isCopied ? <CheckCircle size={14} /> : <Copy size={14} />}
                      {isCopied ? "Copied to Clipboard" : "Copy Prompt"}
                    </button>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-indigo-950/5 rounded-3xl -m-2 scale-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <pre className="relative bg-indigo-950 text-pink-50 p-6 md:p-8 rounded-2xl overflow-x-auto font-mono text-[11px] md:text-xs leading-relaxed shadow-inner border border-indigo-900/50 cursor-text selection:bg-pink-500/30 whitespace-pre-wrap">
                      {PROMPT_TEXT}
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'practices' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-panel p-8 rounded-[2.5rem] border border-indigo-100">
                    <h3 className="text-lg font-black text-indigo-950 tracking-tighter uppercase font-display mb-6 flex items-center gap-3">
                      <BrainCircuit className="text-pink-500" />
                      Best Practices for AI Studio
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-black flex items-center justify-center shrink-0">1</div>
                        <div>
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-950 mb-1">Choose the Right Model</h4>
                          <p className="text-[11px] text-indigo-900/60 font-medium leading-relaxed">Select <strong>Gemini 1.5 Pro</strong> (or the latest Pro model). The "Pro" models have superior reasoning capabilities for complex software architecture and long-form writing compared to "Flash".</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 font-black flex items-center justify-center shrink-0">2</div>
                        <div>
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-950 mb-1">Maximize Output Tokens</h4>
                          <p className="text-[11px] text-indigo-900/60 font-medium leading-relaxed">Slide the <strong>Output Token Limit</strong> all the way to maximum. This ensures the AI doesn't cut itself short mid-sentence.</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-black flex items-center justify-center shrink-0">3</div>
                        <div>
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-950 mb-1">Provide Rich Context</h4>
                          <p className="text-[11px] text-indigo-900/60 font-medium leading-relaxed">Replace the bracketed text at the bottom with your raw data, technical notes, dependency choices, and feature lists. The more raw data, the more detailed the output.</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 font-black flex items-center justify-center shrink-0">4</div>
                        <div>
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-950 mb-1">Use the "Continue" Trick</h4>
                          <p className="text-[11px] text-indigo-900/60 font-medium leading-relaxed">If the blueprint stops generating mid-thought, simply type <em>"Continue exactly where you left off without repeating yourself"</em> to bypass length limits.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-8 rounded-[2.5rem] border border-pink-100 flex flex-col justify-center bg-gradient-to-br from-indigo-50/50 to-pink-50/50">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl border border-pink-100 flex items-center justify-center mb-6 text-pink-500 shrink-0">
                      <Rocket size={40} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-indigo-950 mb-4">Architectural Supremacy</h3>
                    <p className="text-xs text-indigo-900/70 font-medium leading-relaxed mb-6">
                      By explicitly mandating hierarchical structures (Overview, Lifecycle, Actors) for every single category, you force the LLM to recursively evaluate the systemic design instead of writing shallow marketing copy.
                    </p>
                    <button 
                      onClick={() => handleTabChange('prompt')}
                      className="self-start px-6 py-3 bg-pink-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-pink-500/20 hover:scale-105 transition-all"
                    >
                      View The Prompt
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
