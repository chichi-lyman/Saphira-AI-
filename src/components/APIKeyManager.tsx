import React, { useState, useEffect } from 'react';
import { KeyRound, Eye, EyeOff, Save, CheckCircle2, AlertCircle, RefreshCw, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const APIKeyManager = () => {
  const [keys, setKeys] = useState({
    openai: '',
    gemini: '',
    stripe: '',
    github: '',
    githubRepo: '',
    githubUser: '',
  });

  const [visible, setVisible] = useState({
    openai: false,
    gemini: false,
    stripe: false,
    github: false,
    githubRepo: true,
    githubUser: true,
  });

  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{success?: boolean; output?: string; error?: string} | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    // Load from local storage for simulation
    const storedKeys = localStorage.getItem('saphira_api_keys');
    if (storedKeys) {
      try {
        setKeys(JSON.parse(storedKeys));
      } catch (e) {
        console.error('Failed to parse stored API keys');
      }
    }
  }, []);

  const handleChange = (key: keyof typeof keys, value: string) => {
    setKeys(prev => ({ ...prev, [key]: value }));
    setSaved(false);
    setValidationError(null);
  };

  const toggleVisibility = (key: keyof typeof visible) => {
    setVisible(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isValidFormat = () => {
    if (keys.github && !keys.github.startsWith('ghp_') && !keys.github.startsWith('github_pat_')) {
      setValidationError("Invalid GitHub token format (expected 'ghp_' or 'github_pat_').");
      return false;
    }
    if (keys.openai && !keys.openai.startsWith('sk-')) {
      setValidationError("Invalid OpenAI key format (expected 'sk-').");
      return false;
    }
    if (keys.gemini && !keys.gemini.startsWith('AIza')) {
      setValidationError("Invalid Gemini key format (expected 'AIza').");
      return false;
    }
    if (keys.stripe && !keys.stripe.startsWith('sk_') && !keys.stripe.startsWith('rk_')) {
      setValidationError("Invalid Stripe key format (expected 'sk_' or 'rk_').");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    setValidationError(null);
    if (!isValidFormat()) return;
    
    // Check if at least one key is provided
    if (!keys.github && !keys.openai && !keys.gemini && !keys.stripe) {
      setValidationError("Please enter at least one API key to save.");
      return;
    }

    localStorage.setItem('saphira_api_keys', JSON.stringify(keys));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSync = async () => {
    setValidationError(null);
    if (!keys.github) {
      setValidationError("GitHub token is required for syncing. Please enter and save it first.");
      return;
    }
    if (!isValidFormat()) return;

    setSyncing(true);
    setSyncResult(null);

    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          token: keys.github,
          repo: keys.githubRepo,
          user: keys.githubUser 
        })
      });
      const data = await response.json();
      setSyncResult(data);
    } catch (err) {
      setSyncResult({ error: String(err) });
    } finally {
      setSyncing(false);
    }
  };

  const KeyInput = ({ name, label, icon: Icon, colorClass, borderClass }: { 
    name: keyof typeof keys, 
    label: string, 
    icon: any, 
    colorClass: string,
    borderClass: string 
  }) => (
    <div className="mb-4 last:mb-0">
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300 mb-1.5 pl-1">
        <Icon size={12} className={colorClass} />
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
          <KeyRound size={14} className="text-slate-500" />
        </div>
        <input
          type={visible[name] ? "text" : "password"}
          value={keys[name]}
          onChange={(e) => handleChange(name, e.target.value)}
          placeholder={`Enter ${label} API Key`}
          className={`w-full bg-slate-900/50 border ${borderClass} rounded-lg py-2 pl-9 pr-10 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-opacity-50 transition-all font-mono placeholder:text-slate-600`}
        />
        <button
          type="button"
          onClick={() => toggleVisibility(name)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          {visible[name] ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-5 border border-indigo-200/30 bg-slate-800 shadow-xl rounded-2xl mb-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />
      
      <div className="flex justify-between items-center mb-5 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-black uppercase text-amber-400 tracking-widest flex items-center gap-2">
            <KeyRound size={16} className="text-orange-500" />
            API Key Management & Sync
          </h3>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
            Secure vault for Saphira's external integrations
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/50 text-purple-400 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing..." : "Sync GitHub"}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <Save size={14} />
            Save Keys
          </button>
        </div>
      </div>

      <AnimatePresence>
        {validationError && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="p-3 rounded-lg border bg-amber-500/10 border-amber-500/30 text-amber-400 font-mono text-xs">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                <AlertCircle size={14} />
                {validationError}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {saved && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
          >
            <CheckCircle2 size={14} />
            Keys saved to secure local vault
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {syncResult && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className={`p-3 rounded-lg border ${syncResult.error ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'} font-mono text-xs`}>
              <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-wider">
                <Terminal size={12} />
                {syncResult.error ? "Sync Failed" : "Sync Successful"}
              </div>
              <pre className="whitespace-pre-wrap overflow-x-auto text-[10px] opacity-80">
                {syncResult.error || syncResult.output}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
          <KeyInput 
            name="github" 
            label="GitHub Sync Token" 
            icon={CheckCircle2} 
            colorClass="text-purple-400" 
            borderClass="border-purple-500/30 focus:border-purple-400 focus:ring-purple-400"
          />
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300 mb-1.5 pl-1">
                GitHub User
              </label>
              <input
                type="text"
                value={keys.githubUser}
                onChange={(e) => handleChange('githubUser', e.target.value)}
                placeholder="e.g. username"
                className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-opacity-50 transition-all font-mono placeholder:text-slate-600"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300 mb-1.5 pl-1">
                GitHub Repo
              </label>
              <input
                type="text"
                value={keys.githubRepo}
                onChange={(e) => handleChange('githubRepo', e.target.value)}
                placeholder="e.g. my-repo"
                className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-opacity-50 transition-all font-mono placeholder:text-slate-600"
              />
            </div>
          </div>
          <KeyInput 
            name="stripe" 
            label="Stripe Secret Key" 
            icon={CheckCircle2} 
            colorClass="text-blue-400" 
            borderClass="border-blue-500/30 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
          <KeyInput 
            name="openai" 
            label="OpenAI API Key" 
            icon={CheckCircle2} 
            colorClass="text-emerald-400" 
            borderClass="border-emerald-500/30 focus:border-emerald-400 focus:ring-emerald-400"
          />
          <KeyInput 
            name="gemini" 
            label="Gemini API Key" 
            icon={CheckCircle2} 
            colorClass="text-indigo-400" 
            borderClass="border-indigo-500/30 focus:border-indigo-400 focus:ring-indigo-400"
          />
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
        <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
        <p className="text-[10px] text-amber-200/70 font-mono leading-relaxed">
          <strong>Security Notice:</strong> Keys are stored locally in the browser for this prototype demonstration. In production, these should be managed via secure environment variables or a secret manager. GitHub token is required for the automated sync script. Stripe key is required for the Zero-Cost Wealth Engine.
        </p>
      </div>
    </div>
  );
};
