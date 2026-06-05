import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Database, Code, Smartphone, Rocket, Settings, CheckCircle2, MonitorSmartphone, Plus, Sparkles, X, ArrowRight, Zap, Layers } from 'lucide-react';
import { cn } from '../lib/utils';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export const AndroidPromptBlueprint = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-white text-indigo-950 overflow-y-auto font-sans"
    >
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, #10b981 0%, transparent 100%)' }} />
      </div>

      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-emerald-200/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
            <MonitorSmartphone size={16} className="text-emerald-600" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter text-indigo-900">Android AI Prompt Workflow Blueprint</h1>
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
          <p className="text-emerald-500 font-mono text-sm uppercase tracking-[0.2em] mb-4">Strategic Execution Directive</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none">
            Native AI Integration <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">Android Studio + Gemini</span>
          </h2>
          <p className="text-slate-600 max-w-3xl text-lg leading-relaxed">
            The operational blueprint designed to refine and accelerate the development cycle of mobile platforms. 
            Leverages Google AI Studio for prototyping AI mechanics, and Android Studio's native Gemini agent to construct rigorous Kotlin architecture structures through text prompts.
          </p>
        </header>

        <div className="space-y-8">
          {/* Phase 1 */}
          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600">
                <Settings size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Phase 1: Design & Test in AI Studio</h3>
            </div>
            <p className="text-slate-600 mb-6">Before generating a layout, prototype the core logic and prompt mechanics that will power the application.</p>
            <div className="space-y-3">
              {[
                { title: "Define Mechanics", desc: "Write system instructions detailing precise persona, tasks, and structural limits." },
                { title: "Iterate Prompts", desc: "Input text prompts and iterate until the model yields flawless, high-quality results." },
                { title: "Export to SDK", desc: "Click 'Get Code' and select 'Kotlin' for a pre-configured Google AI SDK snippet." },
                { title: "Acquire API Key", desc: "Generate a free-tier token for Android Studio integration." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs shrink-0">{i+1}</div>
                  <div>
                    <h4 className="font-bold text-indigo-900">{item.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Phase 2 */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                <Code size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Phase 2: App Generation</h3>
            </div>
            <p className="text-slate-600 mb-6 font-medium">Use Android Studio's Gemini template to construct the application shell via raw text prompts.</p>
            
            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm mb-6">
              <h4 className="font-bold text-indigo-900 mb-3 text-sm uppercase tracking-widest text-emerald-600">Architectural Generation Prompt</h4>
              <div className="bg-[#0f172a] text-emerald-400 p-5 rounded-xl font-mono text-xs shadow-inner leading-relaxed">
                Build a multi-screen Android application using Jetpack Compose that implements a clean architecture pattern (Data, Domain, Presentation). The application must feature:
                <br/><br/>
                1. A single-activity, multi-screen navigation graph handled by Jetpack Compose Navigation.
                <br/>
                2. A local SQLite database managed via Room for persistent message logging and offline state caching.
                <br/>
                3. A repository pattern layer that seamlessly switches between the local Room cache and a remote API gateway.
                <br/>
                4. An SDK integration layer using the Google AI SDK for Android to manage multimodal token streams (text, image blobs, and audio file URIs).
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm">
                 <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><Plus size={16} className="text-emerald-500" /> Start Wizard</h4>
                 <p className="text-sm text-slate-600">Select "New Project" and choose "Create with AI" / Gemini API starter template.</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm">
                 <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><Terminal size={16} className="text-emerald-500" /> Generator Inject</h4>
                 <p className="text-sm text-slate-600">Paste API key and generate structural scaffolding, Gradle files, and Kotlin architecture.</p>
              </div>
            </div>
          </section>

          {/* Phase 3 */}
          <section className="bg-[#0f172a] text-white rounded-3xl p-8 shadow-xl">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                <Sparkles size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Phase 3: Deep Context Calibration</h3>
            </div>
            <p className="text-slate-400 mb-6 text-sm">Fine-tuning the Google AI SDK Kotlin snippet to eliminate bottlenecks during heavy token streaming.</p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={18} />
                <div>
                  <h4 className="font-bold text-indigo-200">Asynchronous Streaming</h4>
                  <p className="text-sm text-slate-400 mt-1">Leverage Kotlin <code className="bg-white/10 px-1 rounded">Flow</code> and <code className="bg-white/10 px-1 rounded">generateContentStream</code> for real-time generation instead of blocking callbacks.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={18} />
                <div>
                  <h4 className="font-bold text-indigo-200">Context Preservation</h4>
                  <p className="text-sm text-slate-400 mt-1">Persist states inside Room DB to feed sequences into chat history (Content arrays tagged with user/model roles).</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-[#020617] p-6 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto text-pink-400 leading-loose shadow-inner">
              <div className="text-slate-500 mb-2">// System Instructions Enforcement in Kotlin SDK</div>
              <pre>{`val generativeModel = GenerativeModel(
    modelName = "gemini-1.5-pro",
    apiKey = BuildConfig.apiKey,
    generationConfig = generationConfig {
        temperature = 0.2f
        topK = 40
        topP = 0.95f
    },
    systemInstruction = content { text("Insert precise persona behavioral parameters and structural limits here.") }
)`}</pre>
            </div>
          </section>

          {/* Phase 4 & 5 */}
          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-600">
                <Database size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Phase 4: Ide Refinement & Testing</h3>
            </div>
            
            <div className="space-y-8">
              <div>
                 <h4 className="font-bold text-indigo-900 mb-3 border-b pb-2">Interactive Chat Tweaks (View {'->'} Tool Windows {'->'} Gemini)</h4>
                 <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-xl">
                   <p className="italic text-sm text-indigo-900 mb-2">"Modify this custom Jetpack Compose surface component to employ a dark-mode optimized color palette, featuring a translucent background with crisp borders, a minimum of 16dp inner padding, and an animated lazy column list that smoothly scrolls to the newest item upon database append actions."</p>
                 </div>
              </div>

              <div>
                 <h4 className="font-bold text-indigo-900 mb-3 border-b pb-2">Automated Error Recovery</h4>
                 <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl">
                   <p className="italic text-sm text-rose-900 mb-2">"Analyze this compilation log. Identify if the mismatch arises from an outdated dependency in the build.gradle.kts file or an unaligned datatype mapping within the Room Entity definition, and supply the precise corrective patch."</p>
                 </div>
              </div>
              
              <div>
                 <h4 className="font-bold text-indigo-900 mb-3 border-b pb-2">Contextual Testing Generation</h4>
                 <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl">
                   <p className="italic text-sm text-emerald-900 mb-2">"Generate a comprehensive JUnit test class using MockK to validate that the repository properly falls back to the local database cache when the remote API gateway throws an HttpRequestException."</p>
                   <p className="text-xs text-emerald-700 mt-3 font-medium">Use the "Execute target (Run)" functionality inside Android Studio targeting modern AVD API levels to validate build performance.</p>
                 </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </motion.div>
  );
};
