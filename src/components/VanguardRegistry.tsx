import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Target, Star, Shield, Users } from 'lucide-react';
import { cn } from '../lib/utils';

interface VanguardUser {
  id: string;
  rank: number;
  si: number; // Sovereign Influence
  aa: number; // Alignment Accuracy
  status: 'Lead Architect' | 'Endowed' | 'Guardian';
  isMe?: boolean;
}

const VANGUARD_DATA: VanguardUser[] = [
  { id: 'S-001', rank: 1, si: 982, aa: 99, status: 'Lead Architect' },
  { id: 'S-042', rank: 2, si: 854, aa: 98, status: 'Lead Architect' },
  { id: 'S-109', rank: 3, si: 721, aa: 95, status: 'Guardian' },
  { id: 'S-215', rank: 4, si: 690, aa: 92, status: 'Endowed' },
  { id: 'S-NULL', rank: 12, si: 450, aa: 88, status: 'Endowed', isMe: true }
];

interface VanguardRegistryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VanguardRegistry: React.FC<VanguardRegistryProps> = ({ isOpen, onClose }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full max-w-md z-[200] liquid-glass rounded-none border-l border-white/60 shadow-2xl p-0 flex flex-col"
    >
      <div className="absolute inset-0 bg-white/40 -z-10" />
      
      {/* Header */}
      <div className="p-8 border-b border-indigo-900/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Trophy size={20} className="text-indigo-600" />
            <h2 className="text-xl font-black text-indigo-950 uppercase tracking-tighter">Vanguard Registry</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <Users size={18} className="text-indigo-400" />
          </button>
        </div>
        <p className="text-[10px] font-black text-indigo-900/40 uppercase tracking-[0.3em] leading-relaxed">
          Tactical Ranking of Sovereign Architects & Alignment Specialists
        </p>
      </div>

      {/* List */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {VANGUARD_DATA.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "group relative p-5 rounded-2xl border transition-all duration-500",
              user.isMe ? "bg-indigo-500/10 border-indigo-500/30" : "bg-white/40 border-transparent hover:border-indigo-200"
            )}
          >
            {user.rank <= 3 && (
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center border font-mono text-sm font-black",
                  user.rank <= 3 ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-500"
                )}>
                  {user.rank}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-indigo-950 uppercase tracking-widest">{user.id}</span>
                    {user.isMe && <span className="text-[8px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-black uppercase">Me</span>}
                  </div>
                  <div className="text-[9px] font-black text-indigo-900/40 uppercase tracking-[0.2em] mt-1">
                    {user.status}
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-right">
                  <div className="text-[8px] font-black text-indigo-900/40 uppercase tracking-widest">SI</div>
                  <div className="text-xs font-black text-indigo-950">{user.si}</div>
                </div>
                <div className="text-right">
                   <div className="text-[8px] font-black text-indigo-900/40 uppercase tracking-widest">AA</div>
                   <div className="text-xs font-black text-emerald-600">{user.aa}%</div>
                </div>
              </div>
            </div>

            {/* Glyph representation */}
            <div className="mt-4 flex gap-1 items-end h-4">
              {Array.from({ length: 24 }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-1 rounded-full bg-indigo-500/10",
                    i < (user.si / 40) ? (user.rank <= 3 ? "bg-rose-500/40 h-full" : "bg-indigo-500/40 h-full") : "h-1"
                  )}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-8 border-t border-indigo-900/5 bg-white/20">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[9px] font-black text-indigo-900/60 uppercase tracking-widest">Global AA Baseline</span>
          <span className="text-[10px] font-mono text-emerald-600 font-bold">94.8%</span>
        </div>
        <div className="h-1.5 w-full bg-indigo-900/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '94.8%' }}
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
          />
        </div>
        <p className="mt-4 text-[8px] font-black text-indigo-900/30 uppercase tracking-[0.2em] text-center">
          Nova Umbrella Authority Node Sync: Active
        </p>
      </div>
    </motion.div>
  );
};
