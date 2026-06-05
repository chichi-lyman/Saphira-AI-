import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserCircle, Settings, Moon, Sun, Volume2, Mic, Activity, Key, X, Image as ImageIcon, CheckCircle, Upload } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const UserProfileSettings = ({ 
  user,
  isOpen, 
  onClose,
  isDarkMode,
  setIsDarkMode,
  voiceRate,
  setVoiceRate,
  saveProfile,
  onSignOut,
  isWakeWordActive,
  setIsWakeWordActive,
  onOpenApiKeys,
  customBackground,
  setCustomBackground,
  voiceProfile,
  setVoiceProfile,
  voiceSoftness,
  setVoiceSoftness
}: any) => {
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [bgUrl, setBgUrl] = useState(customBackground || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName, photoURL });
      }
      setCustomBackground(bgUrl);
      saveProfile({ customBackground: bgUrl });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isAvatar: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (isAvatar) {
            setPhotoURL(event.target.result as string);
          } else {
            setBgUrl(event.target.result as string);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-indigo-950/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-pink-100 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-pink-50 dark:border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-900/50 flex items-center justify-center text-pink-500 dark:text-pink-400">
               <Settings size={20} />
             </div>
             <div>
               <h2 className="text-lg font-black text-indigo-950 dark:text-white tracking-tight">System Preferences</h2>
               <p className="text-xs text-pink-500 font-bold uppercase tracking-widest">Architect Configuration</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-indigo-900/50 hover:text-pink-500 dark:text-slate-400 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {photoURL ? (
                   <img src={photoURL} alt="User" className="w-16 h-16 rounded-full border-2 border-pink-200 dark:border-slate-700 object-cover group-hover:opacity-50 transition-opacity" />
                ) : (
                   <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                     <UserCircle size={32} className="text-indigo-300 dark:text-slate-500 group-hover:text-pink-400" />
                   </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload size={16} className="text-pink-500" />
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, true)} />
              </div>
              <div className="flex-1">
                 <input 
                   type="text" 
                   value={displayName} 
                   onChange={(e) => setDisplayName(e.target.value)} 
                   placeholder="Your Identity Name"
                   className="w-full bg-transparent border-b-2 border-indigo-100 dark:border-slate-700 focus:border-pink-400 text-lg font-bold text-indigo-950 dark:text-white placeholder:text-indigo-900/30 focus:outline-none transition-colors pb-1"
                 />
                 <p className="text-sm text-indigo-900/40 dark:text-slate-400 mt-1 font-medium">{user?.email}</p>
              </div>
            </div>
            
            <div className="pt-2">
              <span className="block text-sm font-bold text-indigo-950 dark:text-white mb-2">Custom App Background</span>
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={bgUrl} 
                  onChange={(e) => setBgUrl(e.target.value)} 
                  placeholder="https://image-url.com or Upload"
                  className="flex-1 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-indigo-950 dark:text-white focus:outline-none focus:border-pink-400"
                />
                <button onClick={() => bgInputRef.current?.click()} className="p-2 bg-pink-50 dark:bg-pink-900/20 text-pink-500 rounded-xl hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors">
                  <Upload size={18} />
                </button>
                <input type="file" ref={bgInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, false)} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-pink-400/80">Interface & Feedback</h4>
            
            <div className="flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-slate-800/50 rounded-2xl border border-indigo-100/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-indigo-500 dark:text-indigo-400">
                  {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                </div>
                <div>
                  <span className="block text-sm font-bold text-indigo-950 dark:text-white">Dark Mode</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-900/50 dark:text-slate-400">Reduce visual strain</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  const newMode = !isDarkMode;
                  setIsDarkMode(newMode);
                  saveProfile({ isDarkMode: newMode });
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <motion.div 
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  animate={{ x: isDarkMode ? 24 : 0 }}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-emerald-500 dark:text-emerald-400">
                  <Mic size={16} />
                </div>
                <div>
                  <span className="block text-sm font-bold text-indigo-950 dark:text-white">Wake Word</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-900/50 dark:text-slate-400">"Okay Saphira" Listener</span>
                </div>
              </div>
              <button 
                onClick={() => setIsWakeWordActive(!isWakeWordActive)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${isWakeWordActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <motion.div 
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  animate={{ x: isWakeWordActive ? 24 : 0 }}
                />
              </button>
            </div>

            <div className="flex flex-col gap-4 p-4 bg-indigo-50/50 dark:bg-slate-800/50 rounded-2xl border border-indigo-100/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-indigo-500 dark:text-indigo-400">
                  <Volume2 size={16} />
                </div>
                <div>
                  <span className="block text-sm font-bold text-indigo-950 dark:text-white">Vocal Cadence Rate</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-900/50 dark:text-slate-400">Adjust synthesis speed</span>
                </div>
              </div>
              <div className="flex items-center gap-4 pl-12 pr-2">
                <span className="text-xs font-mono text-indigo-900/50 dark:text-slate-400 font-bold">0.5x</span>
                <input 
                  type="range" 
                  min="0.5" max="2.0" step="0.1"
                  value={voiceRate}
                  onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                  onMouseUp={() => saveProfile({ voiceRate })}
                  onMouseLeave={() => saveProfile({ voiceRate })}
                  className="flex-1 accent-indigo-500"
                />
                <span className="text-xs font-mono text-indigo-900/50 dark:text-slate-400 font-bold">2.0x</span>
              </div>
            </div>

            {/* AI Voice Persona Selection */}
            <div className="flex flex-col gap-4 p-4 bg-pink-50/10 dark:bg-slate-800/10 rounded-2xl border border-pink-100/50 dark:border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-pink-500">
                  <Volume2 size={16} />
                </div>
                <div>
                  <span className="block text-sm font-bold text-indigo-950 dark:text-white">AI Voice Matrix (Persona Tweak)</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-900/50 dark:text-slate-400">Select vocal profile and softness</span>
                </div>
              </div>
              
              {/* Profile Picker Buttons */}
              <div className="grid grid-cols-2 gap-2 pl-12">
                {[
                  { id: 'samantha', label: 'Soft Samantha', desc: 'Late 20s, breathy, textured, warm Her replica.' },
                  { id: 'chelsea', label: 'Classic Saphira', desc: 'Crystalline, maternal authoritative contralto.' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setVoiceProfile(p.id);
                      localStorage.setItem('saphira_voiceProfile', p.id);
                      if (saveProfile) saveProfile({ voiceProfile: p.id });
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      voiceProfile === p.id 
                        ? 'border-pink-500 bg-pink-500/5 text-pink-600 focus:outline-none ring-2 ring-pink-500/20' 
                        : 'border-indigo-100 dark:border-slate-700 bg-transparent text-indigo-950 dark:text-slate-200 hover:border-pink-300'
                    }`}
                  >
                    <span className="block text-[11px] font-bold leading-normal">{p.label}</span>
                    <span className="block text-[8px] opacity-75 mt-0.5 leading-normal">{p.desc}</span>
                  </button>
                ))}
              </div>

              {/* Softness Ratio Slider */}
              <div className="pl-12 space-y-1">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-indigo-950/50 dark:text-slate-400">
                  <span>Acoustic Softness / Breathiness</span>
                  <span>{Math.round(voiceSoftness * 100)}%</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-mono text-indigo-900/40 dark:text-slate-500 font-bold">Crisp</span>
                  <input 
                    type="range" 
                    min="0.1" max="1.0" step="0.05"
                    value={voiceSoftness}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setVoiceSoftness(val);
                      localStorage.setItem('saphira_voiceSoftness', val.toString());
                    }}
                    onMouseUp={() => {
                      if (saveProfile) saveProfile({ voiceSoftness });
                    }}
                    className="flex-1 accent-pink-500"
                  />
                  <span className="text-[9px] font-mono text-indigo-900/40 dark:text-slate-500 font-bold">Ultra-Breathy</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => { onClose(); onOpenApiKeys(); }}
              className="w-full flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 rounded-2xl border border-indigo-100/50 dark:border-slate-700/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-pink-500 dark:text-pink-400">
                  <Key size={16} />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold text-indigo-950 dark:text-white group-hover:text-pink-500 dark:group-hover:text-pink-300 transition-colors">API Keys</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-900/50 dark:text-slate-400">Manage external tokens</span>
                </div>
              </div>
            </button>
            
          </div>
        </div>

        <div className="p-6 bg-indigo-50/50 dark:bg-slate-800/80 border-t border-indigo-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer" onClick={() => { onClose(); onSignOut(); }}>
            <Activity size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
          </div>
          <button 
            onClick={handleUpdateProfile}
            disabled={isSaving}
            className="px-6 py-2 bg-pink-500 dark:bg-pink-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Apply Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
