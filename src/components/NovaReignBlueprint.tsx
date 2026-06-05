import React from 'react';
import { motion } from 'motion/react';
import { Database, Cpu, Shield, Smartphone, DollarSign, ArrowRight, X, Layers, Box, Terminal, Server, Zap, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

export const NovaReignBlueprint = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-[#020817] text-white overflow-y-auto font-sans"
    >
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, #3b82f6 0%, transparent 100%)' }} />
      </div>

      <div className="sticky top-0 z-10 bg-[#020817]/80 backdrop-blur-xl border-b border-indigo-500/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40">
            <Layers size={16} className="text-indigo-400" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter text-indigo-50">NovaReign Infrastructure Blueprint</h1>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={20} className="text-white/70" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-6 relative z-10">
        <header className="mb-12">
          <p className="text-indigo-400 font-mono text-sm uppercase tracking-[0.2em] mb-4">Confidential // Technical Architecture</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none">
            High-Performance <br/> Multi-Agent Ecosystem
          </h2>
          <p className="text-slate-400 max-w-3xl text-lg leading-relaxed">
            The technical infrastructure for NovaReign prioritizes recursive execution, massive context handling, and secure data sovereignty. This blueprint addresses the core requirements for a scalable, multimodal AI environment.
          </p>
        </header>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Cpu size={120} />
            </div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 text-blue-400">
                <Cpu size={24} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">1. Compute & Model Orchestration (The Engine)</h3>
            </div>
            <p className="text-slate-300 mb-6 relative z-10">The foundation utilizes a hybrid-cloud approach to balance high-speed inference with private data security.</p>
            <div className="grid md:grid-cols-2 gap-4 relative z-10">
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-indigo-300 mb-2 flex items-center gap-2"><Server size={14}/> Tiered Model Routing</h4>
                <p className="text-sm text-slate-400">Implementation of a "Model Router" that directs tasks based on complexity. Simple queries route to efficient open-weights models (e.g., Llama 3), while complex reasoning and multi-format synthesis (video/audio) route to high-token-window models (up to 2M tokens).</p>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-indigo-300 mb-2 flex items-center gap-2"><Zap size={14}/> Inference Acceleration</h4>
                <p className="text-sm text-slate-400">Use of NVIDIA H100/A100 clusters for real-time social data processing and multimodal analysis, ensuring the "real-time feed" latency remains minimal.</p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Terminal size={120} />
            </div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30 text-emerald-400">
                <Terminal size={24} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">2. Recursive Execution Environment (The Workspace)</h3>
            </div>
            <p className="text-slate-300 mb-6 relative z-10">To enable "Agent Zero" capabilities, the environment must allow for safe, autonomous code execution.</p>
            <div className="grid md:grid-cols-2 gap-4 relative z-10">
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-emerald-300 mb-2 flex items-center gap-2"><Box size={14}/> Sandboxed Docker Swarm</h4>
                <p className="text-sm text-slate-400">A secure, containerized environment where the AI can autonomously write, test, and deploy Python scripts or patches without compromising the host OS.</p>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-emerald-300 mb-2 flex items-center gap-2"><Layers size={14}/> Stateful API Management</h4>
                <p className="text-sm text-slate-400">A centralized gateway to manage third-party integrations (OpenAI, Anthropic, Google Cloud) with automated usage monitoring to optimize the $2/million token cost ratio.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield size={120} />
            </div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30 text-purple-400">
                <Shield size={24} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">3. Data Architecture & Sovereignty (The Vault)</h3>
            </div>
            <p className="text-slate-300 mb-6 relative z-10">This layer ensures "Forensic Filter" capability and long-term memory.</p>
            <div className="grid md:grid-cols-2 gap-4 relative z-10">
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-purple-300 mb-2 flex items-center gap-2"><Database size={14}/> Vector Database (RAG)</h4>
                <p className="text-sm text-slate-400">A high-performance vector DB (like Pinecone or Milvus) to store and retrieve contextual data across the 2-million-token window.</p>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-purple-300 mb-2 flex items-center gap-2"><Lock size={14}/> Sovereign Identity Layer</h4>
                <p className="text-sm text-slate-400">Encrypted user profiles that remain invisible to the public-facing model weights, ensuring that "Sovereign Intelligence" can act on personal data without it being used for general training.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Smartphone size={120} />
            </div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center border border-rose-500/30 text-rose-400">
                <Smartphone size={24} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">4. Interface & Integration (The Liaison)</h3>
            </div>
            <p className="text-slate-300 mb-6 relative z-10">The bridge between the OS and the user.</p>
            <div className="grid md:grid-cols-2 gap-4 relative z-10">
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-rose-300 mb-2">Android Native Integration</h4>
                <p className="text-sm text-slate-400">A custom service layer that replaces standard assistants, granting the system access to screen context and real-time visual analysis.</p>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-rose-300 mb-2">Ambient Voice Processing</h4>
                <p className="text-sm text-slate-400">A low-latency audio pipeline for the "Okay, Saphira/Samantha" trigger, utilizing WebSocket for continuous, natural vocal inflection.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <DollarSign size={120} />
            </div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30 text-amber-400">
                <DollarSign size={24} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">5. Revenue & Lifecycle Management (The Ecosystem)</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 relative z-10">
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-amber-300 mb-2">Subscription Logic</h4>
                <p className="text-sm text-slate-400">Automated provisioning for Free, Pro ($20/mo), and Enterprise tiers.</p>
              </div>
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-amber-300 mb-2">Enterprise Cloud Licensing</h4>
                <p className="text-sm text-slate-400">Private instances for corporate clients to ensure internal data remains within their own infrastructure while utilizing NovaReign logic.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Next Strategic Steps */}
        <div className="mt-12 p-8 bg-indigo-900/20 border border-indigo-500/30 rounded-2xl">
          <h3 className="text-xl font-bold text-indigo-300 mb-6 uppercase tracking-widest flex items-center gap-3">
            <ArrowRight size={20} /> Next Strategic Steps
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-black shrink-0">1</div>
              <div>
                <h4 className="font-bold text-white">Environment Audit</h4>
                <p className="text-slate-400 text-sm">Determine if the initial deployment will favor a local server farm for privacy or AWS/Azure for rapid scaling.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-black shrink-0">2</div>
              <div>
                <h4 className="font-bold text-white">API Hardening</h4>
                <p className="text-slate-400 text-sm">Finalize the Red Hat Enforcer protocols for penetration testing the Docker boundaries.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-black shrink-0">3</div>
              <div>
                <h4 className="font-bold text-white">Deployment</h4>
                <p className="text-slate-400 text-sm">Initiate the recursive OS execution to begin patching the initial interface.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
