import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Database, BrainCircuit, Activity, CheckCircle, Settings, 
  BarChart, FileText, Download, Play, AlertCircle, Server, Shield, Code2, Copy, Globe, Cpu, Network
} from 'lucide-react';
import { SaphiraLogo } from './SaphiraLogo';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { SyntheticDataGenerator } from './SyntheticDataGenerator';

const mockLossData = Array.from({ length: 20 }, (_, i) => ({
  step: i * 100,
  loss: Math.max(0.5, 3.5 * Math.exp(-0.2 * i) + (Math.random() * 0.2)),
  eval: Math.max(0.6, 3.8 * Math.exp(-0.18 * i) + (Math.random() * 0.3)),
}));

interface LLMFineTuningProps {
  onClose: () => void;
}

export function LLMFineTuningDashboard({ onClose }: LLMFineTuningProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'pipeline' | 'evaluation' | 'services' | 'stack' | 'blueprints'>('upload');
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateTraining = () => {
    setIsTraining(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          setActiveTab('evaluation');
          return 100;
        }
        return p + 2;
      });
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#0A0F1E]/95 backdrop-blur-3xl overflow-y-auto">
      <div className="w-full max-w-6xl bg-gradient-to-br from-[#131A2A] to-[#0A0F1E] rounded-[2rem] border border-indigo-500/20 shadow-[0_0_100px_rgba(99,102,241,0.1)] overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-indigo-500/20 flex items-center justify-between sticky top-0 bg-[#131A2A]/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400">
              <BrainCircuit size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Nova AI Forge</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Private Intelligence Infrastructure</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-8 pt-6 border-b border-indigo-500/10 flex gap-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'upload', icon: <Upload size={16} />, label: 'Data Ingestion' },
            { id: 'pipeline', icon: <Server size={16} />, label: 'Training Pipeline' },
            { id: 'evaluation', icon: <BarChart size={16} />, label: 'Evaluation Metrics' },
            { id: 'services', icon: <Shield size={16} />, label: 'Service Ladders & MRR' },
            { id: 'stack', icon: <Database size={16} />, label: 'Architecture Stack' },
            { id: 'blueprints', icon: <Code2 size={16} />, label: 'Technical Blueprints' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 pb-4 text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap border-b-2",
                activeTab === tab.id 
                  ? "text-pink-400 border-pink-400" 
                  : "text-slate-500 border-transparent hover:text-slate-300"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="p-8 flex-1 overflow-y-auto min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Legal Documents', 'Medical Records', 'Internal Wikis'].map((type, i) => (
                      <div key={type} className="border border-indigo-500/20 bg-white/5 rounded-2xl p-6 hover:border-pink-500/50 transition-colors cursor-pointer group">
                        <FileText className="text-indigo-400 mb-4 group-hover:text-pink-400 transition-colors" size={32} />
                        <h3 className="text-white font-bold mb-2">{type}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">Upload domain-specific raw datasets for parsing and tokenization.</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-2 border-dashed border-indigo-500/30 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-[#0A0F1E]/50">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
                      <Upload className="text-indigo-400" size={24} />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">Secure Dataset Upload</h3>
                    <p className="text-slate-400 text-sm mb-6 max-w-md">Drag and drop JSONL, CSV, or raw text files. Data is encrypted at rest and automatically sanitized for PII before staging.</p>
                    <button className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest transition-colors">
                      Browse Files
                    </button>
                  </div>
                  
                  <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex flex-shrink-0 items-center justify-center">
                      <Shield className="text-emerald-400" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-emerald-400 font-bold mb-1">Zero-Shot Data Retention Protocol Active</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Raw client data is scrubbed of PII before training, hosted in isolated, single-tenant environments, and completely destroyed from the training cluster immediately post-delivery.
                      </p>
                    </div>
                    <div className="px-4 py-2 border border-emerald-500/30 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest shrink-0">
                      Compliant
                    </div>
                  </div>
                  
                  <SyntheticDataGenerator />
                </div>
              )}

              {/* Pipeline Tab */}
              {activeTab === 'pipeline' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">RLHF Training Loop</h3>
                      <p className="text-slate-400 text-sm">Base Model: <span className="text-indigo-400 font-mono">llama-3-8b-instruct</span></p>
                    </div>
                    {!isTraining ? (
                      <button onClick={simulateTraining} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                        <Play size={16} /> Execute Run
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="text-pink-400 font-mono text-sm tracking-wider">{progress}%</div>
                        <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { step: 1, label: 'Data Preprocessing', desc: 'Tokenization & formatting', active: progress > 0, done: progress > 15 },
                      { step: 2, label: 'Supervised Fine-Tuning', desc: 'QLoRA Chaining', active: progress > 15, done: progress > 50 },
                      { step: 3, label: 'RM & RLHF Optimization', desc: 'Reward modeling', active: progress > 50, done: progress > 85 },
                      { step: 4, label: 'Checkpoint Compilation', desc: 'Weight merging', active: progress > 85, done: progress >= 100 },
                    ].map((s) => (
                      <div key={s.step} className={cn("p-5 rounded-2xl border transition-all relative overflow-hidden", s.active ? "bg-indigo-500/10 border-indigo-500/50" : "bg-white/5 border-white/10")}>
                        {s.active && !s.done && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 animate-pulse" />}
                        <div className="flex items-start justify-between mb-2">
                          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold", s.done ? "bg-emerald-500/20 text-emerald-400" : s.active ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-400")}>
                            {s.done ? <CheckCircle size={12} /> : s.step}
                          </div>
                          {s.active && !s.done && <Activity size={14} className="text-indigo-400 animate-spin-slow" />}
                        </div>
                        <h4 className={cn("font-bold text-sm mb-1", s.active ? "text-white" : "text-slate-400")}>{s.label}</h4>
                        <p className="text-[11px] text-slate-500">{s.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border border-indigo-500/20 bg-[#0A0F1E] rounded-2xl p-6 h-64 relative font-mono text-[10px] text-slate-300 overflow-hidden flex flex-col justify-end">
                    <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#0A0F1E] to-transparent z-10" />
                    <div className="space-y-2 opacity-80">
                      <div className="text-indigo-400"># System Output</div>
                      {progress > 5 && <div>[Epoch 0] Loading dataset: domain_knowledge_v3.jsonl (45,210 samples)</div>}
                      {progress > 15 && <div>[Epoch 1] Starting SFT phase. Batch size: 16, LR: 2e-5</div>}
                      {progress > 30 && <div>[Epoch 1] Step 200/1200 - Loss: 1.842</div>}
                      {progress > 50 && <div>[Epoch 2] Initiating DPO alignment (Direct Preference Optimization)...</div>}
                      {progress > 70 && <div>[Epoch 2] Step 800/1200 - Reward margin: +0.42</div>}
                      {progress > 90 && <div>[System] Merging adapter weights with base model...</div>}
                      {progress >= 100 && <div className="text-emerald-400">=== FINE-TUNING COMPLETE. Artifacts saved. ===</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Evaluation Tab */}
              {activeTab === 'evaluation' && (
                <div className="space-y-6 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">Golden Architecture Evaluation</h3>
                      <p className="text-slate-400 text-sm">Automated regression suites: MMLU, RAGAS, Hallucination detection.</p>
                    </div>
                    <div className="px-4 py-2 border border-emerald-500/30 rounded-lg bg-emerald-500/10 flex items-center gap-2">
                       <Shield className="text-emerald-400" size={16} />
                       <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Deployment Approved</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">MMLU (Accuracy)</div>
                      <div className="text-3xl font-black text-white">82.4%</div>
                      <div className="text-emerald-400 text-[10px] mt-1 font-mono">PASS (Threshold: 80%)</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">RAGAS Score</div>
                      <div className="text-3xl font-black text-white">0.94</div>
                      <div className="text-emerald-400 text-[10px] mt-1 font-mono">PASS (Threshold: 0.90)</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Hallucination</div>
                      <div className="text-3xl font-black text-white">0.3%</div>
                      <div className="text-emerald-400 text-[10px] mt-1 font-mono">PASS (Threshold: &lt;1%)</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Jailbreak Resist</div>
                      <div className="text-3xl font-black text-white">100%</div>
                      <div className="text-emerald-400 text-[10px] mt-1 font-mono">PASS (0 Leaks Allowed)</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 relative min-h-[250px]">
                    <h3 className="text-white font-bold text-sm mb-6 absolute top-6 left-6 z-10">MMLU Baseline Tracking (Loss Regression)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockLossData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorEval" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f472b6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="step" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0A0F1E', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="loss" name="Training Loss" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorLoss)" />
                        <Area type="monotone" dataKey="eval" name="Eval Loss" stroke="#f472b6" strokeWidth={2} fillOpacity={1} fill="url(#colorEval)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Services Tab */}
              {activeTab === 'services' && (
                <div className="max-w-4xl mx-auto space-y-10 mt-4">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-black text-white mb-4">Service Ladder & Recurring Revenue Engines</h3>
                    <p className="text-slate-400 max-w-2xl mx-auto">Transform one-off engagements into scalable, enterprise-grade recurring revenue streams via our proprietary intelligence manufacturing process.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                      { tier: 1, name: 'RAG Optimization', cost: '$5,000+', desc: 'Knowledge extraction and retrieval enhancement.' },
                      { tier: 2, name: 'LoRA Fine-Tuning', cost: '$10,000+', desc: 'Behavioral and stylistic alignment via adapter training.' },
                      { tier: 3, name: 'Proprietary Assistant', cost: '$20,000+', desc: 'Full custom intelligence and dedicated front-end.' },
                      { tier: 4, name: 'Sovereign On-Prem', cost: '$50,000+', desc: 'Air-gapped deployment in client VPC, full audit compliance.' },
                      { tier: 5, name: 'Continuous Ops', cost: '$5k/mo', desc: 'Retraining cycles, MMLU regression tests, SLA support.' },
                    ].map((t) => (
                      <div key={t.tier} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-pink-500/30 transition-colors relative group">
                        <div className="text-pink-400 font-bold mb-2">Tier {t.tier}</div>
                        <h4 className="text-white font-bold leading-tight mb-2 text-sm">{t.name}</h4>
                        <div className="text-xl font-black text-indigo-400 mb-3">{t.cost}</div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{t.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#131A2A] border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
                    <h3 className="text-xl font-bold text-white mb-6">Recurring Revenue Architecture (MRR)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                          <Activity className="text-indigo-400 shrink-0 mt-1" size={18} />
                          <div>
                            <div className="font-bold text-white mb-1">API Usage & Inference</div>
                            <div className="text-slate-400 text-xs">Per-token billing layered on top of base vLLM inference costs, scaled automatically.</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                          <Server className="text-indigo-400 shrink-0 mt-1" size={18} />
                          <div>
                            <div className="font-bold text-white mb-1">Managed Hosting</div>
                            <div className="text-slate-400 text-xs">Monthly guarantees for uptime and isolated compute capacity.</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                          <Database className="text-pink-400 shrink-0 mt-1" size={18} />
                          <div>
                            <div className="font-bold text-white mb-1">Retraining Operations</div>
                            <div className="text-slate-400 text-xs">Quarterly model parameter updates based on newly ingested domain data.</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                          <Shield className="text-pink-400 shrink-0 mt-1" size={18} />
                          <div>
                            <div className="font-bold text-white mb-1">Compliance & SLA Support</div>
                            <div className="text-slate-400 text-xs">Premium enterprise agreements, compliance guarantees, and prioritized support tier.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Architecture Stack Tab */}
              {activeTab === 'stack' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">Recommended Tech Stack</h3>
                      <p className="text-slate-400 text-sm">Enterprise-grade tooling for sovereign private intelligence infrastructure.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors">
                      <h4 className="text-indigo-400 font-bold mb-4 flex items-center gap-2"><Globe size={18} /> Intake Layer</h4>
                      <ul className="space-y-3">
                        <li><a href="https://konghq.com/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-300 font-bold text-sm block">Kong Gateway</a><span className="text-slate-500 text-xs">API Gateway</span></li>
                        <li><a href="https://auth0.com/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-300 font-bold text-sm block">Auth0 / Clerk</a><span className="text-slate-500 text-xs">Authentication</span></li>
                        <li><a href="https://min.io/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-300 font-bold text-sm block">MinIO</a><span className="text-slate-500 text-xs">File Upload & Storage</span></li>
                        <li><a href="https://www.rabbitmq.com/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-300 font-bold text-sm block">RabbitMQ / Apache Kafka</a><span className="text-slate-500 text-xs">Queueing & Events</span></li>
                      </ul>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-pink-500/30 transition-colors">
                      <h4 className="text-pink-400 font-bold mb-4 flex items-center gap-2"><FileText size={18} /> ETL & Parsing</h4>
                      <ul className="space-y-3">
                        <li><a href="https://unstructured.io/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-300 font-bold text-sm block">Unstructured.io</a><span className="text-slate-500 text-xs">Parsing PDFs/docs</span></li>
                        <li><a href="https://www.llamaindex.ai/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-300 font-bold text-sm block">LlamaIndex</a><span className="text-slate-500 text-xs">Semantic ingestion</span></li>
                        <li><a href="https://github.com/tesseract-ocr/tesseract?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-300 font-bold text-sm block">Tesseract OCR</a><span className="text-slate-500 text-xs">Optical Character Recognition</span></li>
                        <li><a href="https://airflow.apache.org/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-300 font-bold text-sm block">Apache Airflow</a><span className="text-slate-500 text-xs">Workflow orchestration</span></li>
                      </ul>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
                      <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2"><Shield size={18} /> PII & Compliance</h4>
                      <ul className="space-y-3">
                        <li><a href="https://microsoft.github.io/presidio/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-emerald-300 font-bold text-sm block">Microsoft Presidio</a><span className="text-slate-500 text-xs">PII Detection</span></li>
                        <li><a href="https://github.com/trufflesecurity/trufflehog?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-emerald-300 font-bold text-sm block">TruffleHog</a><span className="text-slate-500 text-xs">Secrets Scanning</span></li>
                      </ul>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-colors">
                      <h4 className="text-amber-400 font-bold mb-4 flex items-center gap-2"><Cpu size={18} /> Training Engine</h4>
                      <ul className="space-y-3">
                        <li><a href="https://huggingface.co/docs/transformers/index?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-amber-300 font-bold text-sm block">HF Transformers</a><span className="text-slate-500 text-xs">Fine-tuning</span></li>
                        <li><a href="https://github.com/huggingface/peft?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-amber-300 font-bold text-sm block">PEFT (QLoRA)</a><span className="text-slate-500 text-xs">Parameter-Efficient FT</span></li>
                        <li><a href="https://www.deepspeed.ai/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-amber-300 font-bold text-sm block">DeepSpeed</a><span className="text-slate-500 text-xs">Distributed Training</span></li>
                        <li><a href="https://www.runpod.io/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-amber-300 font-bold text-sm block">RunPod</a><span className="text-slate-500 text-xs">GPU Scheduling</span></li>
                        <li><a href="https://wandb.ai/site?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-amber-300 font-bold text-sm block">Weights & Biases</a><span className="text-slate-500 text-xs">Experiment Tracking</span></li>
                      </ul>
                    </div>
                    
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors">
                      <h4 className="text-cyan-400 font-bold mb-4 flex items-center gap-2"><Network size={18} /> Deployment Layer</h4>
                      <ul className="space-y-3">
                        <li><a href="https://vllm.ai/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-300 font-bold text-sm block">vLLM</a><span className="text-slate-500 text-xs">Fast Inference</span></li>
                        <li><a href="https://www.docker.com/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-300 font-bold text-sm block">Docker</a><span className="text-slate-500 text-xs">Containerization</span></li>
                        <li><a href="https://kubernetes.io/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-300 font-bold text-sm block">Kubernetes</a><span className="text-slate-500 text-xs">Orchestration</span></li>
                        <li><a href="https://fastapi.tiangolo.com/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-300 font-bold text-sm block">FastAPI</a><span className="text-slate-500 text-xs">API Serving</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Blueprints Tab */}
              {activeTab === 'blueprints' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">Architecture Blueprints</h3>
                      <p className="text-slate-400 text-sm">Deployment-ready Python scripts for the fine-tuning pipeline.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="border border-indigo-500/20 bg-[#0A0F1E] rounded-2xl p-6 relative group overflow-hidden">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <Code2 className="text-indigo-400" size={20} />
                          <h4 className="text-white font-bold">1. QLoRA Training Script (train.py)</h4>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors text-xs font-bold uppercase tracking-widest">
                          <Copy size={14} /> Copy Source
                        </button>
                      </div>
                      <div className="bg-[#131A2A] rounded-xl p-4 overflow-x-auto text-[11px] font-mono text-slate-300 font-medium leading-relaxed border border-white/5">
<pre>{`from datasets import load_dataset
from trl import SFTTrainer
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments

# 1. Load Foundation Model (Llama-3-8B)
model_id = "meta-llama/Meta-Llama-3-8B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id, load_in_4bit=True, device_map="auto"
)

# 2. Configure Parameter-Efficient Fine Tuning (QLoRA)
peft_config = LoraConfig(
    r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05, bias="none", task_type="CAUSAL_LM"
)
model = get_peft_model(model, peft_config)

# 3. Initialize Domain Dataset
dataset = load_dataset("json", data_files="domain_qa_pairs.jsonl", split="train")

# 4. Supervised Fine-Tuning
trainer = SFTTrainer(
    model=model, train_dataset=dataset,
    args=TrainingArguments(
        per_device_train_batch_size=4, gradient_accumulation_steps=4,
        warmup_steps=100, max_steps=1000, learning_rate=2e-4,
        fp16=True, logging_steps=10, output_dir="outputs"
    )
)
trainer.train()
trainer.model.save_pretrained("final_lora_weights")`}</pre>
                      </div>
                    </div>

                    <div className="border border-indigo-500/20 bg-[#0A0F1E] rounded-2xl p-6 relative group overflow-hidden">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <Code2 className="text-pink-400" size={20} />
                          <h4 className="text-white font-bold">2. Synthetic QA Generation (synth.py)</h4>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors text-xs font-bold uppercase tracking-widest">
                          <Copy size={14} /> Copy Source
                        </button>
                      </div>
                      <div className="bg-[#131A2A] rounded-xl p-4 overflow-x-auto text-[11px] font-mono text-slate-300 font-medium leading-relaxed border border-white/5">
<pre>{`import asyncio
from google.genai import GoogleGenAI
import json

ai = GoogleGenAI(api_key="GEMINI_API_KEY")

async def generate_domain_qa(raw_text_chunk):
    prompt = f"""
    You are an expert domain analyst. Read the following text and generate 5 highly technical, 
    specific Question-Answer pairs that capture the core knowledge.
    Format as JSON lines: {"question": "...", "answer": "..."}
    
    TEXT:
    {raw_text_chunk}
    """
    
    response = await ai.models.generate_content(
        model='gemini-3.1-pro',
        contents=prompt
    )
    return response.text

# Extract to QA dataset loop...`}</pre>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
