import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, Key, Shield, HardDrive, CheckCircle2 } from 'lucide-react';

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeysModal({ isOpen, onClose }: ApiKeysModalProps) {
  const [keys, setKeys] = useState({
    openai: '',
    gemini: '',
    stripe: '',
    github: ''
  });
  
  const [visibility, setVisibility] = useState({
    openai: false,
    gemini: false,
    stripe: false,
    github: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Load from mock local storage on mount
    const saved = localStorage.getItem('saphira_api_keys');
    if (saved) {
      try {
        setKeys(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const validateKey = (keyName: keyof typeof keys, value: string): string => {
    if (!value) return '';
    switch (keyName) {
        case 'openai':
            if (!value.startsWith('sk-')) return 'OpenAI key must start with "sk-"';
            break;
        case 'gemini':
            if (!value.startsWith('AIza')) return 'Gemini key must start with "AIza"';
            break;
        case 'github':
            if (!value.startsWith('ghp_') && !value.startsWith('github_pat_')) return 'GitHub PAT must start with "ghp_" or "github_pat_"';
            break;
        case 'stripe':
            if (!value.match(/^(sk|pk|rk|whsec)_(test|live)_[a-zA-Z0-9]+$/)) return 'Invalid Stripe key format (e.g., sk_live_..., pk_test_...)';
            break;
    }
    return '';
  };

  const handleSave = () => {
    let hasError = false;
    const newErrors: Record<string, string> = {};
    (Object.keys(keys) as Array<keyof typeof keys>).forEach(keyName => {
        const error = validateKey(keyName, keys[keyName]);
        if (error) {
            newErrors[keyName] = error;
            hasError = true;
        }
    });

    if (hasError) {
        setErrors(newErrors);
        return;
    }

    setIsSaving(true);
    // Simulate encryption and save
    setTimeout(() => {
      localStorage.setItem('saphira_api_keys', JSON.stringify(keys));
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 800);
  };

  const toggleVisibility = (key: keyof typeof visibility) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleKeyChange = (key: keyof typeof keys, value: string) => {
    setKeys(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-indigo-950/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100 flex flex-col"
          >
            <div className="p-6 border-b border-indigo-50 bg-gradient-to-r from-pink-50/50 to-indigo-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-indigo-950 font-display flex items-center gap-2">
                  <Shield className="text-pink-500" size={24} />
                  Sovereign Key Vault
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-indigo-900/40 mt-1 font-bold">
                  Local-Only Encryption Protocol
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white rounded-full transition-colors text-indigo-900/40 hover:text-rose-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {(Object.keys(keys) as Array<keyof typeof keys>).map((keyName) => (
                  <div key={keyName} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-950 ml-1 flex items-center gap-2">
                      <Key size={12} className={errors[keyName] ? "text-rose-500" : "text-pink-500"} />
                      {keyName.toUpperCase()} API KEY
                    </label>
                    <div className="relative group">
                      <input 
                        type={visibility[keyName] ? "text" : "password"}
                        value={keys[keyName]}
                        onChange={(e) => handleKeyChange(keyName, e.target.value)}
                        onBlur={() => {
                          const error = validateKey(keyName, keys[keyName]);
                          if (error) {
                            setErrors(prev => ({ ...prev, [keyName]: error }));
                          }
                        }}
                        placeholder={
                          keyName === 'openai' ? 'sk-...' :
                          keyName === 'gemini' ? 'AIza...' :
                          keyName === 'github' ? 'ghp_... or github_pat_...' :
                          keyName === 'stripe' ? 'sk_live_... or pk_test_...' :
                          `${keyName} key...`
                        }
                        className={`w-full bg-indigo-50/50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all text-indigo-950 font-mono pr-12 ${
                          errors[keyName] ? 'border-rose-300 focus:border-rose-500 focus:bg-rose-50/10' : 'border-indigo-100 focus:border-pink-500 focus:bg-white'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleVisibility(keyName)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-indigo-900/40 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-100"
                      >
                        {visibility[keyName] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors[keyName] && (
                      <p className="text-[10px] font-bold text-rose-500 ml-1 uppercase tracking-widest">{errors[keyName]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-indigo-50 bg-indigo-950/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-indigo-900/40">
                <HardDrive size={14} className={saveSuccess ? "text-emerald-500" : ""} />
                <span>{saveSuccess ? "Synced to Local Enclave" : "Client-Side Storage"}</span>
              </div>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-indigo-500 text-white rounded-xl text-[10px] uppercase font-black tracking-widest shadow-lg shadow-pink-500/20 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                    Encrypting...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 size={16} />
                    Secured
                  </>
                ) : (
                  'Lock Vault'
                )}
              </button>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
