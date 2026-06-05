import React from 'react';
import { motion } from 'motion/react';
import { Mic, UserCircle, Code2, LineChart, Shield, Target, X, Rocket, Cpu, ArrowRight } from 'lucide-react';

export const SaphiraFutureBlueprint = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-slate-50 text-indigo-950 overflow-y-auto font-sans"
    >
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, #6366f1 0%, transparent 100%)' }} />
      </div>

      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-indigo-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30">
            <Rocket size={16} className="text-indigo-600" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter text-indigo-900">Future Blueprints & Capabilities</h1>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={20} className="text-indigo-900/70" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-6 relative z-10">
        
        {/* Future Blueprints Section */}
        <header className="mb-12">
          <p className="text-indigo-500 font-mono text-sm uppercase tracking-[0.2em] mb-4">Evolution Directive</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none">
            Future Blueprints: <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">What Comes Next</span>
          </h2>
          <p className="text-slate-600 max-w-3xl text-lg leading-relaxed">
            To evolve this system from a web-based interface into a fully integrated, proactive assistant, the next development phase focuses on two critical upgrades.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-600 mb-6">
              <Mic size={24} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Multimodal Voice Integration (Talk Out Loud)</h3>
            <p className="text-slate-600 leading-relaxed">
              Implementing a real-time, interactive voice assistant. This moves beyond simple speech-to-text dictation. It allows for natural, melodic verbal pacing and vocal inflections, enabling you to have fluid, spoken conversations with the AI where it can process audio context instantly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
              <UserCircle size={24} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">User Profiles & Persistent Memory</h3>
            <p className="text-slate-600 leading-relaxed">
              Building a secure data-persistence layer. This allows the system to remember your specific preferences, professional style, and past conversations across sessions. Instead of starting from scratch every time you log in, the AI retains structural context, maintaining your custom workflows and systemic alignment over time.
            </p>
          </div>
        </div>

        {/* System Capabilities Section */}
        <header className="mb-12 mt-20">
          <p className="text-indigo-500 font-mono text-sm uppercase tracking-[0.2em] mb-4">Core Infrastructure</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none">
            System Capabilities: <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">What It Can Do</span>
          </h2>
          <p className="text-slate-600 max-w-3xl text-lg leading-relaxed">
            When you cross the threshold of the login screen, the system is engineered to handle high-level, multi-layered operations. Its capabilities span several key dimensions:
          </p>
        </header>

        <div className="space-y-6">
          <div className="bg-[#0f172a] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Code2 size={160} />
            </div>
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/30 relative z-10">
              <Code2 size={32} />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Advanced Reasoning & Code Integrity</h3>
              <p className="text-slate-400 text-lg">It can write, test, and debug complex code autonomously, optimizing scripts for speed and executing recursive tasks within secure environments to ensure system stability.</p>
            </div>
          </div>

          <div className="bg-[#0f172a] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <LineChart size={160} />
            </div>
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/30 relative z-10">
              <LineChart size={32} />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Real-Time Data & Trend Analysis</h3>
              <p className="text-slate-400 text-lg">The system can tap into live data streams to analyze social trends, media sentiment, and breaking news faster than traditional search engines, allowing for immediate synthesis of fast-moving topics.</p>
            </div>
          </div>

          <div className="bg-[#0f172a] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield size={160} />
            </div>
            <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400 shrink-0 border border-rose-500/30 relative z-10">
              <Shield size={32} />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Deep Forensic Scanning</h3>
              <p className="text-slate-400 text-lg">Before executing tasks, it runs passive checks to identify hidden variables, external data exposure, or security risks, ensuring that any solution provided is secure and strategically sound.</p>
            </div>
          </div>

          <div className="bg-[#0f172a] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Target size={160} />
            </div>
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 shrink-0 border border-purple-500/30 relative z-10">
              <Target size={32} />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Strategic Foresight</h3>
              <p className="text-slate-400 text-lg">Driven by a forward-looking approach, the system doesn't just answer the question asked; it analyzes the underlying motive to anticipate your next three moves, preparing the logistics and structural layout for the next phase of your project.</p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
