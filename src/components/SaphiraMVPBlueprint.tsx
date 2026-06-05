import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Database, Code, Smartphone, Rocket, FolderTree, X, ArrowRight, Zap, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

export const SaphiraMVPBlueprint = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-white text-indigo-950 overflow-y-auto font-sans"
    >
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, #f472b6 0%, transparent 100%)' }} />
      </div>

      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-pink-200/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center border border-pink-500/30">
            <Rocket size={16} className="text-pink-600" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter text-indigo-900">Zero-Cost MVP Blueprint</h1>
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
          <p className="text-pink-500 font-mono text-sm uppercase tracking-[0.2em] mb-4">Strategic Execution Directive</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none">
            Technical Architecture <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">PWA Deployment</span>
          </h2>
          <p className="text-slate-600 max-w-3xl text-lg leading-relaxed">
            The raw, zero-cost technical build blueprint. This is the exact architecture, technology stack, and file structure required to physically construct the Saphira Minimum Viable Product (MVP) as a Progressive Web App (PWA). Designed for immediate execution.
          </p>
        </header>

        <div className="space-y-8">
          {/* Phase 1 */}
          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600">
                <Terminal size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Phase 1: Local Environment Setup</h3>
            </div>
            <p className="text-slate-600 mb-6">Before writing code, your local machine must be configured with the necessary free development tools.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "VS Code", desc: "IDE (Code Editor)" },
                { name: "Python 3.10+", desc: "Backend Engine runtime" },
                { name: "Node.js (LTS)", desc: "Frontend Engine runtime" },
                { name: "Docker Desktop", desc: "Containerization sandbox" },
                { name: "GitHub & Git", desc: "Version Control" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <h4 className="font-bold text-indigo-900">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Phase 2 */}
          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600">
                <Layers size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Phase 2: The Tech Stack</h3>
            </div>
            <p className="text-slate-600 mb-6 font-medium">Free-Tier Infrastructure Integrations</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Frontend Framework", tech: "React.js", desc: "Using Vite for fast compiling" },
                { title: "UI Styling", tech: "Tailwind CSS", desc: "For precise control over pure white backgrounds, neon pink accents, and liquid glassmorphism" },
                { title: "Backend API", tech: "FastAPI", desc: "Python framework for its speed and native asynchronous support" },
                { title: "Session Memory", tech: "Upstash", desc: "Free serverless Redis database for conversation state" },
                { title: "User Profiles / Billing", tech: "Supabase", desc: "Free PostgreSQL database for user management" },
                { title: "Frontend Hosting", tech: "Vercel", desc: "Connects directly to GitHub to host the React UI for free" },
                { title: "Backend Hosting", tech: "Render", desc: "Connects to GitHub to host Python FastAPI for free" },
                { title: "LLM API", tech: "Foundation Model API", desc: "Connect via your preferred foundational model's developer API (free tier credits)" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-indigo-400 mb-1">{item.title}</h4>
                    <p className="font-bold text-indigo-950 text-lg mb-2">{item.tech}</p>
                  </div>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Phase 3 */}
          <section className="bg-[#0f172a] text-white rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                <FolderTree size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Phase 3: Master File Structure</h3>
            </div>
            <p className="text-slate-400 mb-6 text-sm">Maintain strict separation between the client-facing UI and the backend logic engine in VS Code.</p>
            <div className="bg-[#020617] p-6 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto text-emerald-400 leading-loose">
              <pre>
{`saphira-mvp/
│
├── frontend/                 # Hosted on Vercel
│   ├── public/               # Contains iridescent "S" logo and manifest.json (makes it a PWA)
│   ├── src/
│   │   ├── components/       # Glassmorphic chat bubbles, Stripe payment buttons
│   │   ├── App.jsx           # Main user interface logic
│   │   └── index.css         # Tailwind (Neon pink accents, pearlescent gradients)
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Frontend build configuration
│
├── backend/                  # Hosted on Render
│   ├── core/
│   │   ├── agent_zero.py     # Sandbox execution logic
│   │   ├── persona.py        # Filtered/Unfiltered toggle logic and Samantha DNA
│   │   └── memory.py         # Redis session state connections
│   ├── main.py               # FastAPI endpoints (receives messages, triggers Stripe)
│   ├── requirements.txt      # Python dependencies (FastAPI, Redis, Stripe SDK)
│   └── Dockerfile            # Blueprint for the Agent Zero multi-tenant sandbox
│
└── .gitignore                # Ensures API keys are never uploaded to GitHub`}
              </pre>
            </div>
          </section>

          {/* Phase 4 */}
          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-600">
                <Code size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Phase 4: Initialization Commands</h3>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-indigo-900 mb-2">1. Create the Master Folder</h4>
                <div className="bg-[#0f172a] text-pink-400 p-4 rounded-xl font-mono text-sm shadow-inner">
                  <pre>{`mkdir saphira-mvp\ncd saphira-mvp`}</pre>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-indigo-900 mb-2">2. Initialize the Frontend (React + Vite)</h4>
                <div className="bg-[#0f172a] text-blue-400 p-4 rounded-xl font-mono text-sm shadow-inner">
                  <pre>{`npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install tailwindcss postcss autoprefixer stripe
npx tailwindcss init -p`}</pre>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-indigo-900 mb-2">3. Initialize the Backend (Python + FastAPI)</h4>
                <div className="bg-[#0f172a] text-yellow-400 p-4 rounded-xl font-mono text-sm shadow-inner">
                  <pre>{`mkdir backend
cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn redis stripe docker
pip freeze > requirements.txt`}</pre>
                </div>
              </div>
            </div>
          </section>

          {/* Phase 5 */}
          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600">
                <Smartphone size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Phase 5: PWA Conversion & App Store Bypass</h3>
            </div>
            <p className="text-slate-600 mb-4">To make the web link act exactly like a native app downloaded from an app store, you must configure the Manifest File in <code className="bg-slate-200 px-2 py-0.5 rounded text-indigo-900">frontend/public/manifest.json</code>.</p>
            <div className="bg-[#0f172a] text-indigo-300 p-6 rounded-2xl font-mono text-xs overflow-x-auto shadow-inner">
              <pre>{`{
  "short_name": "Saphira",
  "name": "Saphira: Your AI Liaison",
  "icons": [
    { "src": "saphira_logo_192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "saphira_logo_512.png", "type": "image/png", "sizes": "512x512" }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#ffffff",
  "background_color": "#ffffff"
}`}</pre>
            </div>
            <p className="text-xs text-slate-500 italic mt-4">* Note: Drop the generated iridescent "S" logo into the public folder and name the files accordingly.</p>
          </section>

          {/* Phase 6 */}
          <section className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap size={160} />
            </div>
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white border border-white/30">
                <Rocket size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Phase 6: Deployment Sequence</h3>
            </div>
            
            <div className="space-y-4 relative z-10">
              {[
                { step: "Commit Code", desc: "Push the entire saphira-mvp folder to your free GitHub account." },
                { step: "Deploy Backend", desc: "Log into Render.com, select 'New Web Service', link your GitHub repository, and select the backend folder. Input your API keys into Render's secure 'Environment Variables' tab." },
                { step: "Deploy Frontend", desc: "Log into Vercel.com, select 'Add New Project', link your GitHub repository, and select the frontend folder. Add your backend's new Render URL to the frontend environment variables." },
                { step: "Live Status", desc: "Vercel will provide a live URL (e.g., saphira-liaison.vercel.app)." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start bg-black/20 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black shrink-0">{i+1}</div>
                  <div>
                    <h4 className="font-bold text-white uppercase text-sm tracking-widest">{item.step}</h4>
                    <p className="text-white/80 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/20 relative z-10 flex gap-4">
              <ArrowRight size={24} className="shrink-0 text-pink-300" />
              <p className="font-medium text-pink-100">Send this specific link to your first client. They will open it on Safari or Chrome, tap "Add to Home Screen," and Saphira will install directly onto their device as a standalone application, ready to capture capital via Stripe.</p>
            </div>
          </section>

        </div>
      </div>
    </motion.div>
  );
};
