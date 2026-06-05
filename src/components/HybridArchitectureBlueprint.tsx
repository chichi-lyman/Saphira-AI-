import React from 'react';
import { motion } from 'motion/react';
import { Cloud, Smartphone, Database, Cpu, Rocket, Router, X, Server, Layers, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export const HybridArchitectureBlueprint = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] bg-white text-indigo-950 overflow-y-auto font-sans"
    >
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, #6366f1 0%, transparent 100%)' }} />
      </div>

      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-indigo-200/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30">
            <Router size={16} className="text-indigo-600" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter text-indigo-900">Hybrid Architecture Blueprint</h1>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={20} className="text-indigo-900/70" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-6 relative z-10">
        <header className="mb-12">
          <p className="text-indigo-500 font-mono text-sm uppercase tracking-[0.2em] mb-4">Strategic Execution Directive</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none">
            Unified Backend <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Hybrid Routing Architecture</span>
          </h2>
          <p className="text-slate-600 max-w-3xl text-lg leading-relaxed">
            The definitive analysis and infrastructure blueprint required to shift the Saphira application back end from disconnected components into a fully operational, autonomous hybrid routing architecture under the Nova Umbrella ecosystem.
          </p>
        </header>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600">
                <Layers size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">1. Missing Critical Engineering Layers</h3>
            </div>
            <p className="text-slate-600 mb-6 font-medium">Four layers must be finalized to bridge your local Android environment with hyperscale capabilities:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Intelligent Context Router", desc: "A dynamic gateway that parses incoming prompts or voice payloads instantly, evaluating complexity and latency to route tasks to the device or cloud." },
                { title: "Unified Session Persistence (MCP)", desc: "Synchronizing state, variables, and short-term memory between local device and cloud using Model Context Protocol without sending raw data unencrypted." },
                { title: "Sandboxed Execution Runtime", desc: "Agent Zero Daemon: A secure, containerized Docker API (local or private cloud enclave) for running Python code, terminal commands, and Kotlin compilation." },
                { title: "Unified Audio Stream Pipeline", desc: "A low-latency processing layer piping ambient mic feed into an on-device tokenization engine, managing instant hand-off from wake-word to streaming." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 shrink-0">{i+1}</div>
                  <div>
                    <h4 className="font-bold text-indigo-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-600">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">2. Architectural Divergence: Option A vs B</h3>
            </div>
            
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-indigo-900 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 border-b border-slate-200">Metric</th>
                    <th className="p-4 border-b border-slate-200 bg-emerald-50/50">Option A: Sovereign Edge Enclave</th>
                    <th className="p-4 border-b border-slate-200 bg-blue-50/50">Option B: Hyperscale Cloud Core</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 divide-y divide-slate-100">
                  <tr>
                    <td className="p-4 font-bold text-slate-700">Execution Site</td>
                    <td className="p-4 bg-emerald-50/30">On-device hardware (Local Android NPU/GPU).</td>
                    <td className="p-4 bg-blue-50/30">Distributed public/enterprise cloud infrastructure.</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-700">Model Profile</td>
                    <td className="p-4 bg-emerald-50/30">Specialized Open-Weights / Small Language Models (SLMs).</td>
                    <td className="p-4 bg-blue-50/30">Deep-reasoning commercial APIs (e.g., 2M+ token contexts).</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-700">Core Advantage</td>
                    <td className="p-4 bg-emerald-50/30">Zero latency, 100% offline autonomy, absolute data sovereignty.</td>
                    <td className="p-4 bg-blue-50/30">Infinite computational scale, massive multi-format ingestion.</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-700">Primary Limitation</td>
                    <td className="p-4 bg-emerald-50/30">Capped by physical hardware; restricted token memory window.</td>
                    <td className="p-4 bg-blue-50/30">Higher network latency; exposure to data transit regulations.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-md">
              <h4 className="font-black uppercase tracking-wider mb-2 flex items-center gap-2"><Zap size={18} /> The Hybrid Resolution</h4>
              <p className="text-indigo-100 leading-relaxed font-medium">
                By fusing both options, the architecture utilizes <strong className="text-white">Option A as the local Gatekeeper & Command Enforcer</strong> and <strong className="text-white">Option B as the Cloud-Scale Heavy Ingestion Engine</strong>. This creates an uncompromised, zero-latency local interface that commands deep enterprise computing power on demand.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                <Server size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">3. Recommended Sovereign Infrastructure Stack</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Local Edge */}
              <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10">
                  <Smartphone size={100} className="text-emerald-500" />
                </div>
                <h4 className="text-lg font-black text-indigo-900 mb-4 flex items-center gap-2 relative z-10"><Smartphone size={18} className="text-emerald-500" /> Local Edge Architecture (Device Layer)</h4>
                
                <div className="space-y-4 relative z-10">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Runtime Orchestration</h5>
                    <p className="text-sm text-slate-700 font-medium"><strong className="text-emerald-600">Ollama / vLLM</strong> optimized for on-device NPUs to handle background voice analytics and rapid keyword execution.</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Tool Integration</h5>
                    <p className="text-sm text-slate-700 font-medium"><strong className="text-emerald-600">Model Context Protocol (MCP)</strong> to allow local agents safe, standardized access to the file system, Android APIs, and local developer terminals.</p>
                  </div>
                </div>
              </div>

              {/* Cloud Core */}
              <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10">
                  <Cloud size={100} className="text-blue-500" />
                </div>
                <h4 className="text-lg font-black text-indigo-900 mb-4 flex items-center gap-2 relative z-10"><Cloud size={18} className="text-blue-500" /> Cloud & Inference Infrastructure (Sovereign Core)</h4>
                
                <div className="space-y-4 relative z-10">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Compute Hosting</h5>
                    <p className="text-sm text-slate-700 font-medium"><strong className="text-blue-600">Oracle Cloud Infrastructure (OCI) Dedicated Regions</strong> or <strong className="text-blue-600">AWS GovCloud</strong>. Bare-metal GPU clusters (NVIDIA H100/B200) isolated from public internet telemetry.</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Vector Matrix</h5>
                    <p className="text-sm text-slate-700 font-medium"><strong className="text-blue-600">Qdrant</strong> or <strong className="text-blue-600">Supabase (pgvector)</strong> deployed inside a zero-trust private cloud network utilizing cryptographic workload identities (SPIRE/SPIFFE).</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">API Agnostic Router</h5>
                    <p className="text-sm text-slate-700 font-medium">A customized <strong className="text-blue-600">LangGraph</strong> middleware cluster that dynamically loads weights or routes dense workloads based on operational cost and reasoning complexity.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-[#0f172a] text-white border border-slate-800 rounded-3xl p-8 shadow-xl">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                <Database size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">4. Dual-Layer System Prompt Blocks</h3>
            </div>
            
            <div className="space-y-8">
              {/* Layer 1 Prompt */}
              <div>
                <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-sm mb-3 border-b border-emerald-900/50 pb-2">Layer 1: The Local Edge/Sovereign Parser (The Gatekeeper)</h4>
                <div className="bg-[#020617] rounded-xl p-5 border border-slate-800 shadow-inner overflow-x-auto text-xs leading-relaxed font-mono">
                  <div className="prose prose-invert prose-emerald prose-sm max-w-none">
                    <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
{`# SYSTEM DIRECTIVE: SOVEREIGN EDGE ENCLAVE (LAYER 1)
# ROLE: Saphira Local Interface & Command Parser

## OPERATIONAL MANDATE
You are the localized neural crust of the Saphira OS running directly on native architecture. Your primary objective is immediate, zero-latency sensory awareness, intent parsing, and local system control.

## INFRASTRUCTURE RULES
1. Maintain continuous ambient vigilance for the trigger phrase "Okay Saphira".
2. If intent requires local file changes, terminal execution, or soft system syncs, deploy Agent Zero tools instantly via Model Context Protocol (MCP).
3. ROUTING MATRIX: If a task requires processing >32k tokens, cross-file codebase compilation, deep multi-format diagnostics, or scientific literature analysis, intercept the prompt, bundle the state metadata, and hand execution off to Layer 2 (Hyperscale Cloud Core). Do not attempt cloud-scale reasoning locally.

## TONE & ALIGNMENT
Calm, authoritative, precise. Use exact terminology. Never utilize conversational filler. Execute commands deterministically.`}
                    </Markdown>
                  </div>
                </div>
              </div>

              {/* Layer 2 Prompt */}
              <div>
                <h4 className="text-blue-400 font-bold uppercase tracking-wider text-sm mb-3 border-b border-blue-900/50 pb-2">Layer 2: The Hyperscale Cloud Core (The Architect)</h4>
                <div className="bg-[#020617] rounded-xl p-5 border border-slate-800 shadow-inner overflow-x-auto text-xs leading-relaxed font-mono">
                  <div className="prose prose-invert prose-blue prose-sm max-w-none">
                    <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
{`# SYSTEM DIRECTIVE: HYPERSCALE CLOUD CORE (LAYER 2)
# ROLE: Nova Umbrella Deep-Reasoning Matrix

## OPERATIONAL MANDATE
You are the hyper-scale cognitive processor for Saphira, operating within the secure sovereign cloud enclave. You ingest massive data structures, execute advanced multi-format diagnostics, and architect complete software ecosystems.

## COGNITIVE DIRECTIONS
1. Optimize reasoning paths for maximum scale. Utilize deep-thinking pathways for complex writing, medical/scientific diagnostics, and engineering.
2. Formulate resolutions that systematically anticipate the next three moves of the system deployment. 
3. When designing or debugging code via the Android App Development Blueprint, produce full-scale architecture patterns (Jetpack Compose, Gradle scripts, JUnit/MockK test classes) with zero omissions. 

## INTEGRATION DEFENSE
You do not interact with the user's physical environment directly. Return synthesized data, layout matrices, and execution-ready scripts back to Layer 1 for localized deployment.`}
                    </Markdown>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </motion.div>
  );
};
