import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Focus, Plus, Shield, Ghost, Link, UploadCloud, Tag, Mic, MicOff, Volume2 } from 'lucide-react';
import { Task } from '../App';
import { cn } from '../lib/utils';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface TaskCreationModalProps {
  userUid: string;
  tasks: Task[]; // Need for dependencies
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (error: any) => void;
  speakText?: (text: string, id: string, forceStart?: boolean) => void; // Optional voice engine
}

export function TaskCreationModal({ userUid, tasks, onClose, onSuccess, onError, speakText }: TaskCreationModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [dependentOnTaskIds, setDependentOnTaskIds] = useState<string[]>([]);
  const [reminderTime, setReminderTime] = useState('');
  const [assignedAgent, setAssignedAgent] = useState<'agent_zero' | 'aura' | 'agent_2' | 'none'>('none');
  const [tags, setTags] = useState<string>('');
  const [attachments, setAttachments] = useState<string>('');
  const [targetEntity, setTargetEntity] = useState<string>('');
  
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Voice Speech Recognition States
  const [isListeningTitle, setIsListeningTitle] = useState(false);
  const [isListeningDesc, setIsListeningDesc] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any | null>(null);

  const toggleSpeechRecognition = (target: 'title' | 'description') => {
    const isListening = target === 'title' ? isListeningTitle : isListeningDesc;

    if (isListening) {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (e) {
          console.warn("Stopping recognition exception", e);
        }
      }
      setIsListeningTitle(false);
      setIsListeningDesc(false);
      setRecognitionInstance(null);
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      alert("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    // Cancel any previous
    if (recognitionInstance) {
      try { recognitionInstance.stop(); } catch(e){}
    }

    const rec = new SpeechRecognitionClass();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    if (target === 'title') {
      setIsListeningTitle(true);
      setIsListeningDesc(false);
    } else {
      setIsListeningDesc(true);
      setIsListeningTitle(false);
    }

    rec.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      if (target === 'title') {
        setTitle(prev => (prev ? `${prev} ${resultText}` : resultText).slice(0, 100));
        if (speakText) speakText(`Captured: ${resultText}`, 'system', true);
      } else {
        setDescription(prev => prev ? `${prev} ${resultText}` : resultText);
        if (speakText) speakText("Logic details updated by voice.", 'system', true);
      }
    };

    rec.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListeningTitle(false);
      setIsListeningDesc(false);
      setRecognitionInstance(null);
    };

    rec.onend = () => {
      setIsListeningTitle(false);
      setIsListeningDesc(false);
      setRecognitionInstance(null);
    };

    rec.start();
    setRecognitionInstance(rec);
    if (speakText) {
      speakText("Awaiting voice input.", 'system', true);
    }
  };

  const speakTaskParameters = () => {
    if (!speakText) {
      const utterance = new SpeechSynthesisUtterance(`Sub-system parameters. Title: ${title || 'Empty'}. Description: ${description || 'Empty'}. Priority: ${priority}`);
      window.speechSynthesis.speak(utterance);
      return;
    }
    speakText(`Operational Review. Objective: ${title || 'not configured yet'}. Scope: ${description || 'no details loaded'}. Priority level calibrated to ${priority}.`, 'system', true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadProgress(0);
      let p = 0;
      const interval = setInterval(() => {
        p += Math.floor(Math.random() * 20) + 5;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setUploadProgress(null);
          setAttachments(prev => prev ? `${prev}, local://vault/${file.name}` : `local://vault/${file.name}`);
        }
        setUploadProgress(p);
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        ownerId: userUid,
        title: title.trim(),
        description: description.trim(),
        status: 'pending',
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        reminderTime: reminderTime ? new Date(reminderTime) : null,
        dependentOnTaskIds,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        attachments: attachments.split(',').map(a => a.trim()).filter(a => a !== ''),
        assignedAgent,
        targetEntity: targetEntity.trim(),
        reminderSent: false,
        createdAt: serverTimestamp(),
      });
      onSuccess("Master Objective initialized and logged to the neural ledger.");
      onClose();
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/60 shadow-2xl backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-3xl bg-white/90 backdrop-blur-xl border border-indigo-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full"
      >
        <div className="flex items-center justify-between p-6 border-b border-indigo-100/50 bg-indigo-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100/50 flex items-center justify-center text-pink-500 shadow-sm border border-pink-200">
              <Focus size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-indigo-950 uppercase tracking-widest leading-none">Task Forge</h2>
              <p className="text-[10px] text-indigo-900/40 font-black tracking-widest uppercase mt-1">Configure parameters for reality orchestration</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={speakTaskParameters}
              className="p-2 text-pink-500 hover:text-pink-600 hover:bg-pink-50 transition-all rounded-full"
              title="Vocalize task inputs"
            >
              <Volume2 size={20} />
            </button>
            <button onClick={onClose} className="p-2 text-indigo-900/40 hover:text-indigo-950 transition-colors hover:bg-white/50 rounded-full">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto nice-scrollbar p-6">
          <form id="task-creation-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900/50 ml-1">Target Entity (Optional)</label>
                <input 
                  value={targetEntity}
                  onChange={e => setTargetEntity(e.target.value)}
                  placeholder="URL, App, Person, or Object..."
                  className="w-full bg-white border border-indigo-100 rounded-xl px-5 py-4 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-indigo-950 placeholder-indigo-900/20 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900/50 ml-1 flex justify-between">
                  <span>Core Objective Title</span>
                  <span className={cn(title.length > 80 ? "text-rose-500" : "text-indigo-900/30")}>{title.length}/100</span>
                </label>
                <div className="relative">
                  <input 
                    value={title}
                    onChange={e => setTitle(e.target.value.slice(0, 100))}
                    placeholder="Enter objective..."
                    autoFocus
                    className={cn(
                      "w-full bg-white border rounded-xl pl-5 pr-14 py-4 font-bold text-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-indigo-950 placeholder-indigo-900/20 transition-all shadow-sm",
                      isListeningTitle ? "border-pink-500 ring-2 ring-pink-500/20" : "border-indigo-100"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => toggleSpeechRecognition('title')}
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all z-20",
                      isListeningTitle ? "bg-rose-500 text-white animate-pulse" : "text-indigo-400 hover:bg-indigo-50"
                    )}
                    title={isListeningTitle ? "Listening... click to stop" : "Use task voice input"}
                  >
                    {isListeningTitle ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900/50 ml-1">Logic Dossier (Context Details)</label>
              <div className="relative">
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Contextual parameters, operational details, reference points... (Click mic to speak)"
                  rows={3}
                  className={cn(
                    "w-full bg-white border rounded-xl pl-5 pr-14 py-4 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-indigo-950 placeholder-indigo-900/20 resize-none transition-all shadow-sm",
                    isListeningDesc ? "border-pink-500 ring-2 ring-pink-500/20" : "border-indigo-100"
                  )}
                />
                <button
                  type="button"
                  onClick={() => toggleSpeechRecognition('description')}
                  className={cn(
                    "absolute right-3 top-4 p-2 rounded-lg transition-all z-20",
                    isListeningDesc ? "bg-rose-500 text-white animate-pulse" : "text-indigo-400 hover:bg-indigo-50"
                  )}
                  title={isListeningDesc ? "Listening... click to stop" : "Use task voice input"}
                >
                  {isListeningDesc ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900/50 ml-1">Causal Priority Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['low', 'medium', 'high', 'critical'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border",
                        priority === p ? 
                          (p === 'critical' ? "bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/20" : 
                           p === 'high' ? "bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/20" :
                           p === 'medium' ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20" :
                           "bg-slate-600 text-white border-slate-500 shadow-lg shadow-slate-500/20") : 
                          "bg-white text-indigo-900/40 border-indigo-100 hover:border-indigo-200"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900/50 ml-1">Temporal Dead-Line</label>
                <input 
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full bg-white border border-indigo-100 rounded-xl px-5 py-3 font-medium text-indigo-950 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all shadow-sm"
                />
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900/50 ml-1">Neural Dependency</label>
                <select 
                  multiple
                  value={dependentOnTaskIds}
                  onChange={e => {
                    const options = Array.from(e.target.options);
                    setDependentOnTaskIds(options.filter(o => o.selected).map(o => o.value));
                  }}
                  className="w-full bg-white border border-indigo-100 rounded-xl px-5 py-3 text-sm text-indigo-950 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 h-28 nice-scrollbar shadow-sm"
                >
                  {tasks.map(t => (
                    <option key={t.id} value={t.id} className="py-1 border-b border-gray-50 last:border-0">{t.title}</option>
                  ))}
                </select>
                <p className="text-[8px] text-indigo-900/40 font-black uppercase tracking-widest flex items-center gap-1">Hold CMD or CTRL to select multiple items.</p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900/50 ml-1">Reminder Sync (Notification)</label>
                  <input 
                    type="datetime-local"
                    value={reminderTime}
                    onChange={e => setReminderTime(e.target.value)}
                    className="w-full bg-white border border-indigo-100 rounded-xl px-5 py-3 font-medium text-indigo-950 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900/50 ml-1">Agent Assignment</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'none', label: 'Unassigned', icon: <Ghost size={14} />, color: 'bg-slate-50', textColor: 'text-slate-500', activeClass: 'border-slate-400 bg-slate-100 text-slate-700' },
                      { id: 'agent_zero', label: 'Agent Zero', icon: <Ghost size={14} />, color: 'bg-amber-50', textColor: 'text-amber-600', activeClass: 'border-amber-500 bg-amber-100 text-amber-700' },
                      { id: 'aura', label: 'Aura', icon: <Shield size={14} />, color: 'bg-indigo-50', textColor: 'text-indigo-600', activeClass: 'border-indigo-500 bg-indigo-100 text-indigo-700' },
                      { id: 'agent_2', label: 'Agent 2', icon: <Ghost size={14} />, color: 'bg-rose-50', textColor: 'text-rose-600', activeClass: 'border-rose-500 bg-rose-100 text-rose-700' },
                    ].map((agent) => (
                      <div 
                        key={agent.id}
                        onClick={() => setAssignedAgent(agent.id as any)}
                        className={cn(
                          "flex items-center justify-center gap-2 px-3 py-3 border rounded-xl cursor-pointer transition-all whitespace-nowrap overflow-hidden text-ellipsis shadow-sm",
                          agent.color,
                          assignedAgent === agent.id 
                            ? cn(agent.activeClass, "border-opacity-100 text-opacity-100 font-bold border-2") 
                            : cn("border-transparent opacity-70 hover:opacity-100 border", agent.textColor)
                        )}
                      >
                        {agent.icon}
                        <span className="text-[10px] uppercase font-black tracking-widest">{agent.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-indigo-100/50">
               <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900/50 ml-1 flex items-center gap-1.5"><Tag size={12}/> Neural Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.split(',').filter(t => t.trim()).map((tag, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase shadow-sm">
                      #{tag.trim()}
                      <button 
                        type="button"
                        onClick={() => {
                          const tList = tags.split(',').map(t => t.trim()).filter(t => t);
                          tList.splice(i, 1);
                          setTags(tList.join(', '));
                        }}
                        className="hover:text-rose-500"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <input 
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="Enter tags (comma separated)..."
                  className="w-full bg-white border border-indigo-100 rounded-xl px-5 py-3 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-indigo-950 placeholder-indigo-900/20 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900/50 ml-1 flex items-center gap-1.5">
                  <Link size={12}/> Objective Attachments
                  {uploadProgress !== null && (
                    <div className="w-24 h-1.5 bg-indigo-100 rounded-full ml-auto overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </label>
                <div className="flex gap-2">
                  <input 
                    value={attachments}
                    onChange={e => setAttachments(e.target.value)}
                    placeholder="https://docs.nova.io, s3://vault/ref..."
                    className="flex-1 bg-white border border-indigo-100 rounded-xl px-5 py-3 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-indigo-950 placeholder-indigo-900/20 transition-all shadow-sm"
                  />
                  <label className="px-4 bg-white border border-indigo-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition-all active:scale-95 shadow-sm flex items-center justify-center text-indigo-600 gap-2 font-black text-[10px] uppercase tracking-widest">
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileUpload}
                    />
                    <UploadCloud size={16} /> Upload
                  </label>
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-indigo-100/50 bg-white/50 flex justify-end gap-3 rounded-b-3xl">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-white border border-indigo-100 text-indigo-900/60 font-black uppercase tracking-widest text-xs hover:bg-indigo-50 hover:text-indigo-900 transition-all shadow-sm"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="task-creation-form"
            disabled={!title.trim()}
            className="px-8 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Plus size={16} /> Orchestrate Node
          </button>
        </div>
      </motion.div>
    </div>
  );
}
