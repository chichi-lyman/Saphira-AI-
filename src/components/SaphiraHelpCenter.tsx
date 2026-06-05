import React from 'react';
import { motion } from 'motion/react';
import { Search, Shield, Chrome, Smartphone, ArrowRight, X, Lock, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';

export const SaphiraHelpCenter = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-white text-indigo-950 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-indigo-900/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Search size={16} className="text-indigo-600" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter">Saphira Help Center</h1>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-6">
        <header className="mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Command Your <br/> <span className="text-indigo-600">Digital Ecosystem</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover how Saphira integrates seamlessly across your devices to provide unrivaled tactical overwatch, deep synthesis, and sovereign privacy.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Chrome & Mobile Integration */}
          <div className="p-8 rounded-3xl border border-indigo-900/10 bg-slate-50 hover:shadow-xl transition-all duration-500">
            <div className="flex gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center"><Chrome size={24} /></div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center"><Smartphone size={24} /></div>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Omnipresent Architecture</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Whether you're on your computer or your phone, use Saphira AI in Chrome to ask questions, compare info, and get help faster with your open tabs. Saphira works with anything on your screen, including Chrome on Android, and is built right into the Chrome app on iOS.
            </p>
            <p className="text-slate-500 text-sm italic">
              * Available on select devices, regions, and to users 18+. Saphira interacts seamlessly with Google Calendars, Docs, and can even summarize YouTube videos—all controlled by you.
            </p>
          </div>

          {/* AI Mode */}
          <div className="p-8 rounded-3xl border border-indigo-900/10 bg-slate-50 hover:shadow-xl transition-all duration-500">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6"><Cpu size={24} /></div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">AI Mode: Deep Synthesis</h3>
            <p className="text-slate-600 leading-relaxed">
              Powerful AI search for your toughest questions. Ask anything, any way with AI mode. Trying to wrap your head around a new topic or need help getting started on a project? Ask anything in Chrome and keep the conversation open alongside your tabs as you dive deeper.
            </p>
            <ul className="mt-4 space-y-2 text-slate-700 font-medium">
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-indigo-500"/> Ask about open tabs</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-indigo-500"/> Synthesize images & assets</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-indigo-500"/> Inject files for contextual search</li>
            </ul>
          </div>

          {/* Safe Browsing & Passwords */}
          <div className="p-8 rounded-3xl border border-indigo-900/10 bg-slate-50 hover:shadow-xl transition-all duration-500">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-6"><Shield size={24} /></div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Proactive Security Shield</h3>
            <p className="text-slate-600 leading-relaxed">
              Safe browsing, automated by AI. When Saphira detects that a password has been compromised, or if a threat emerges, you'll receive a Liquid Glass intercept. A single click allows Saphira to update your password for you using AI and save it to your encrypted vault on supported sites.
            </p>
          </div>

          {/* Auto Browse */}
          <div className="p-8 rounded-3xl bg-indigo-950 text-white hover:shadow-xl hover:shadow-indigo-900/20 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center"><ArrowRight size={24} /></div>
              <span className="text-[10px] bg-indigo-500 font-black uppercase px-2 py-1 rounded tracking-widest">Nova Pro Exclusive</span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Auto Browse Execution</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              Yes, with Auto Browse, you can ask Saphira in Chrome to complete multistep, complex tasks for you on the web autonomously. From finding flights to booking appointments, she operates as your agentive extension.
            </p>
            <p className="text-white/50 text-sm">
              * Auto Browse is actively rolling out to Saphira AI Pro and Ultra subscribers. Please verify eligibility requirements.
            </p>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="p-10 rounded-[2.5rem] border border-indigo-900/10 bg-indigo-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Lock size={200} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Lock size={24} className="text-indigo-600" />
              <h3 className="text-2xl font-black uppercase tracking-tight">Sovereign Privacy & Data Collection</h3>
            </div>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              <p>
                <strong>What data does Saphira AI collect about me?</strong><br/>
                When you use Saphira with your account, you hold absolute authority. You choose whether to share your precise location, audio baseline, and current tab context.
              </p>
              <p>
                You retain the ability to store your interaction history or cryptographically purge it at any time from the AI Innovations page in your account settings. We collect specific structural data to enhance performance, but your identity and proprietary data remain completely segmented through Encrypted Sovereign Sharding.
              </p>
              <p className="pt-4 border-t border-indigo-900/10 text-sm text-slate-500">
                For the absolute latest architectural details, review our AI Principles and the Saphira Privacy Hub.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
