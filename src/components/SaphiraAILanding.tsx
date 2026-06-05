import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SaphiraCrystal, CrystalState } from './SaphiraCrystal';
import { 
  ArrowRight, Sparkles, Shield, Zap, Circle as CrystalIcon, Command, ArrowDown, 
  Lock, BookOpen, Film, Heart, CheckCircle2, ChevronRight, PlayCircle, Star, Music, Check, Copy, Loader2, Sparkle,
  Mic, Send, Volume2, VolumeX
} from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { dispatchSovereignCommand } from '../services/cognitionService';
import { generateSpeech } from '../services/geminiService';

interface SaphiraAILandingProps {
  onEnterApp: () => void;
}

export const SaphiraAILanding: React.FC<SaphiraAILandingProps> = ({ onEnterApp }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'media' | 'tech'>('all');

  // Conversational Console Logic
  const [consoleMessages, setConsoleMessages] = useState<any[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hi. I'm Saphira... I'm so glad we're connected firsthand. Tell me what's on your mind. We can outline business models, look into creative writing pipelines, or just talk about your day."
    }
  ]);
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleState, setConsoleState] = useState<CrystalState>('idle');
  const [consoleAudioLevel, setConsoleAudioLevel] = useState(0);
  const [isConsoleListening, setIsConsoleListening] = useState(false);
  const [isConsoleVoiceEnabled, setIsConsoleVoiceEnabled] = useState(true);
  const consoleMessagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const consoleAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Speech Recognition for Landing Page Console
  useEffect(() => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      
      rec.onstart = () => {
        setIsConsoleListening(true);
        setConsoleState('listening');
      };

      rec.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        if (text.trim()) {
          handleSendConsoleMessage(text);
        }
      };

      rec.onerror = (err: any) => {
        console.error("Landing console speech error:", err);
        setIsConsoleListening(false);
        setConsoleState('idle');
      };

      rec.onend = () => {
        setIsConsoleListening(false);
        setConsoleState(prev => prev === 'listening' ? 'idle' : prev);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleConsoleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition isn't supported in this browser. Try Chrome.");
      return;
    }

    if (isConsoleListening) {
      recognitionRef.current.stop();
    } else {
      if (consoleAudioRef.current) {
        consoleAudioRef.current.pause();
      }
      window.speechSynthesis.cancel();
      setConsoleState('listening');
      recognitionRef.current.start();
    }
  };

  const speakConsoleResponse = async (text: string) => {
    if (!isConsoleVoiceEnabled) return;
    setConsoleState('speaking');

    // 1. Try ElevenLabs
    try {
      const { generateSamanthaVoice } = await import('../services/elevenLabsService');
      const blob = await generateSamanthaVoice(text);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        consoleAudioRef.current = audio;
        
        audio.onplay = () => {
          const interval = setInterval(() => {
            setConsoleAudioLevel(0.2 + Math.random() * 0.8);
          }, 100);
          (audio as any).levelInterval = interval;
        };

        audio.onended = () => {
          clearInterval((audio as any).levelInterval);
          setConsoleAudioLevel(0);
          setConsoleState('idle');
          URL.revokeObjectURL(url);
        };

        await audio.play();
        return;
      }
    } catch (e) {
      console.warn("Elevenlabs landing error:", e);
    }

    // 2. Try Gemini TTS
    try {
      const base64Pcm = await generateSpeech(text, 'normal');
      if (base64Pcm) {
        const addWavHeader = (b64: string, sampleRate = 24000) => {
          const binaryString = atob(b64);
          const len = binaryString.length;
          const buffer = new ArrayBuffer(len + 44);
          const view = new DataView(buffer);
          const bytes = new Uint8Array(buffer);

          view.setUint32(0, 0x52494646, false);
          view.setUint32(4, 36 + len, true);
          view.setUint32(8, 0x57415645, false);
          view.setUint32(12, 0x666d7420, false);
          view.setUint32(16, 16, true);
          view.setUint16(20, 1, true);
          view.setUint16(22, 1, true);
          view.setUint32(24, sampleRate, true);
          view.setUint32(28, sampleRate * 2, true);
          view.setUint16(32, 2, true);
          view.setUint16(34, 16, true);
          view.setUint32(36, 0x64617461, false);
          view.setUint32(40, len, true);

          for (let i = 0; i < len; i++) {
            bytes[44 + i] = binaryString.charCodeAt(i);
          }
          return buffer;
        };
        
        const wavBuffer = addWavHeader(base64Pcm);
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const buffer = await ctx.decodeAudioData(wavBuffer);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        
        const levelInterval = setInterval(() => {
          setConsoleAudioLevel(0.2 + Math.random() * 0.8);
        }, 100);

        source.onended = () => {
          clearInterval(levelInterval);
          setConsoleAudioLevel(0);
          setConsoleState('idle');
          ctx.close();
        };

        source.start();
        return;
      }
    } catch (e) {
      console.warn("Gemini TTS landing error:", e);
    }

    // 3. Fallback to Browser speech synthesis
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const pref = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Google US English')));
      if (pref) utterance.voice = pref;
      
      const pInterval = setInterval(() => {
        setConsoleAudioLevel(0.2 + Math.random() * 0.8);
      }, 100);

      utterance.onend = () => {
        clearInterval(pInterval);
        setConsoleAudioLevel(0);
        setConsoleState('idle');
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setConsoleState('idle');
    }
  };

  const handleSendConsoleMessage = async (overrideText?: string) => {
    const finalMsg = overrideText || consoleInput;
    if (!finalMsg.trim() || consoleState === 'thinking') return;
    setConsoleInput('');

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: finalMsg.trim()
    };

    setConsoleMessages(prev => [...prev, userMessage]);
    setConsoleState('thinking');

    try {
      const history = consoleMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      })).slice(-6);

      const res = await dispatchSovereignCommand(
        finalMsg, 
        history, 
        null, 
        'guest-bypass-token'
      );

      let serverResponseText = "I had trouble loading my intelligence parameters. Tell me your move again.";
      if (res && res.type === 'TEXT_RESPONSE') {
        serverResponseText = res.content;
      } else if (res && res.type === 'TOOL_EXECUTION') {
        serverResponseText = `Executed operational loop: ${res.functionName}. All telemetry is secure and stabilized.`;
      }

      setConsoleMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: serverResponseText
      }]);

      speakConsoleResponse(serverResponseText);

    } catch (error) {
      console.error(error);
      setConsoleState('idle');
    }
  };

  useEffect(() => {
    consoleMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleMessages]);

  // Modal triggers
  const [isSandboxModalOpen, setIsSandboxModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  // Sandbox flow state
  const [sandboxCode, setSandboxCode] = useState('');
  const [sandboxStatus, setSandboxStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Book order flow state
  const [bookName, setBookName] = useState('');
  const [bookEmail, setBookEmail] = useState('');
  const [bookEdition, setBookEdition] = useState<'digital' | 'collector'>('digital');
  const [bookStatus, setBookStatus] = useState<'idle' | 'ordering' | 'success'>('idle');

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => onEnterApp(), 1500);
    }
  };

  const handleUnlockSandbox = () => {
    if (!sandboxCode.trim()) {
      setSandboxStatus('error');
      return;
    }
    setSandboxStatus('verifying');
    setTimeout(() => {
      const formatted = sandboxCode.trim().toUpperCase();
      if (['SAPHIRA-PREMIUM', 'SAPHIRA-S2-PRO', 'SOV-2026-X99B', 'CHELSEA-VIP'].includes(formatted)) {
        setSandboxStatus('success');
        localStorage.setItem('saphira_premium_vow', 'true');
        // If logged in, update tier in firestore
        if (auth.currentUser) {
          updateDoc(doc(db, 'users', auth.currentUser.uid), {
            tier: 'premium',
            status: 'active',
            updatedAt: Date.now()
          }).catch(() => {});
        }
        setTimeout(() => {
          setIsSandboxModalOpen(false);
          setSandboxStatus('idle');
          setSandboxCode('');
          onEnterApp();
        }, 1500);
      } else {
        setSandboxStatus('error');
      }
    }, 1200);
  };

  const handleSimulatePayment = () => {
    setSandboxStatus('verifying');
    setTimeout(() => {
      setSandboxStatus('success');
      localStorage.setItem('saphira_premium_vow', 'true');
      if (auth.currentUser) {
        updateDoc(doc(db, 'users', auth.currentUser.uid), {
          tier: 'premium',
          status: 'active',
          updatedAt: Date.now()
        }).catch(() => {});
      }
      setTimeout(() => {
        setIsSandboxModalOpen(false);
        setSandboxStatus('idle');
        onEnterApp();
      }, 1500);
    }, 2000);
  };

  const handleOrderBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName || !bookEmail) return;
    setBookStatus('ordering');
    setTimeout(() => {
      setBookStatus('success');
      setTimeout(() => {
        setIsBookModalOpen(false);
        setBookStatus('idle');
        setBookName('');
        setBookEmail('');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0B0813] text-[#F3F1F8] relative overflow-x-hidden font-sans selection:bg-pink-900 selection:text-pink-200" style={{ backgroundImage: 'linear-gradient(135deg, #0B0813 0%, #1A0B2E 50%, #05030A 100%)' }}>
      
      {/* Premium Ambient Background (Iridescent Glow Orbs) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb orb-pink" />
        <div className="glow-orb orb-purple" />
      </div>

      {/* Elegant Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-8 flex justify-between items-center relative z-50">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="brand font-extrabold text-xl sm:text-2xl letter-spacing-tight text-[#FF1493] flex items-center gap-2 cursor-pointer"
          onClick={onEnterApp}
        >
          <div className="w-8 h-8 rounded-lg bg-[#FF1493] flex items-center justify-center text-white font-black text-sm shadow-md shadow-pink-500/20">
            S
          </div>
          <span className="tracking-tight hover:opacity-80 transition-opacity font-extrabold text-[#FF1493]">Saphira AI</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 text-xs sm:text-sm"
        >
          <button 
            onClick={onEnterApp}
            className="font-semibold text-zinc-400 hover:text-white px-4 py-2 rounded-full transition-all"
          >
            Sovereign OS
          </button>
          <button 
            onClick={onEnterApp}
            className="font-bold bg-[#FF1493] text-white hover:bg-[#FF69B4] px-6 py-2.5 rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/15"
          >
            Launch <ArrowRight size={14} className="text-white" />
          </button>
        </motion.div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl mx-auto px-6 py-6 sm:py-12 text-center relative z-10 flex flex-col items-center">
        
        {/* Hero Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mb-12 sm:mb-16 mt-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-950/40 border border-pink-500/30 text-[10px] font-extrabold text-pink-400 uppercase tracking-widest mb-6">
            <Sparkle size={10} className="fill-pink-500 text-pink-500 animate-pulse" />
            Empowering Digital Sovereignty
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF1493] to-pink-500 mb-6 font-display select-none">
            Autonomous Intelligence &amp; Multi-Universe Media
          </h1>
          <p className="subtitle text-zinc-400 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
            Architecting self-evolving frameworks, deep tactical operations, and raw storytelling pipelines. Mapped and managed under one cohesive, sentient core.
          </p>
        </motion.div>

        {/* Modules Grid (Side by side modules) */}
        <div className="w-full grid md:grid-cols-2 gap-8 mb-16 text-left items-stretch">
          
          {/* Module 1: Saphira Conversational System Console */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="p-6 sm:p-8 flex flex-col justify-between min-h-[500px] select-none saphira-dark-glass"
            style={{
              borderRadius: '24px'
            }}
          >
            <div>
              {/* SYSTEM CONSOLE PANEL */}
              <div className="system-console-panel">
                <div className="flex justify-between items-center">
                  <h3>✦ SYSTEM CONSOLE</h3>
                  <button 
                    onClick={() => setIsConsoleVoiceEnabled(!isConsoleVoiceEnabled)}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-all text-[#ff007f] hover:text-[#ff69b4]"
                    title={isConsoleVoiceEnabled ? "Mute Voice Response" : "Unmute Voice Response"}
                  >
                    {isConsoleVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                </div>
                <p className="panel-desc">
                  This panel is built with 4% background opacity and a 30px light-deflection blur layer, producing a premium, crystal-clear visual interface.
                </p>

                {/* SAPHIRA AVATAR CONTAINER */}
                <div className="saphira-avatar-container">
                  <div className="saphira-glow-ring">
                    <img 
                      src="/src/assets/images/saphira_chat_mockup_1780422177070.png" 
                      alt="Saphira AI Mascot" 
                      className="saphira-avatar-img" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* SAPHIRA AI TEXT BOX */}
                <div className="saphira-response-box">
                  <span className="bot-tag">SAPHIRA AI</span>
                  <p>Hi, I'm Saphira... I'm so glad we're connected firsthand. Tell me what's on your mind...</p>
                </div>
              </div>

              {/* Dynamic Neon Border Pulsing Overlay Frame */}
              <div className="neon-gradient-pulse-frame p-[1px] rounded-2xl mb-4 shadow-[0_0_20px_rgba(255,20,147,0.25)]">
                {/* Console Message List Area inside the glow frame */}
                <div className="h-44 overflow-y-auto bg-white/10 backdrop-blur-3xl rounded-[15px] p-4.5 flex flex-col gap-3 nice-scrollbar">
                  {consoleMessages.map((msg, idx) => (
                    <div 
                      key={msg.id || idx} 
                      className={`text-xs leading-relaxed max-w-[90%] rounded-xl px-3 py-2 crisp-frosted-white-bubble shadow-sm ${
                        msg.role === 'user' 
                          ? 'self-end rounded-tr-none' 
                          : 'self-start rounded-tl-none'
                      }`}
                    >
                      {msg.role !== 'user' && (
                        <span className="text-[9px] font-black tracking-wider text-[#FF1493] block mb-1">
                          SAPHIRA AI
                        </span>
                      )}
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  ))}
                  <div ref={consoleMessagesEndRef} />
                </div>
              </div>
            </div>

            <div>
              {/* Tactical Directives Input Area */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendConsoleMessage(); }}
                className="relative flex items-center gap-2"
              >
                <input 
                  type="text" 
                  value={consoleInput}
                  onChange={(e) => setConsoleInput(e.target.value)}
                  disabled={consoleState === 'thinking'}
                  className="w-full px-4 py-3 text-xs placeholder-zinc-500 font-semibold bg-white/90 backdrop-blur-md border border-neutral-200 focus:border-[#FF1493] text-neutral-900 rounded-xl focus:outline-none transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]" 
                  placeholder={consoleState === 'listening' ? 'Listening...' : 'Enter tactical directive...'}
                />
                <div className="absolute right-2 flex gap-1 items-center">
                  <button
                    type="button"
                    onClick={toggleConsoleListening}
                    className={`p-2 rounded-lg transition-all ${
                      isConsoleListening 
                        ? 'bg-[#FF1493] text-white shadow-lg animate-pulse' 
                        : 'text-zinc-500 hover:text-[#FF1493] hover:bg-pink-50'
                    }`}
                    title="Speak using voice input"
                  >
                    <Mic size={14} className={isConsoleListening ? 'animate-pulse' : ''} />
                  </button>
                  <button
                    type="submit"
                    disabled={!consoleInput.trim() || consoleState === 'thinking'}
                    className="p-2 bg-[#FF1493] text-white hover:bg-[#FF69B4] rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(255,20,147,0.2)]"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>

              {/* Free Interface Transition Buttons */}
              <div className="flex gap-2.5 mt-4">
                <button 
                  onClick={onEnterApp}
                  className="w-full text-center py-2.5 px-3 rounded-xl border border-pink-200/40 bg-[#FF1493]/10 text-[11px] font-bold text-[#FF1493] hover:text-white hover:bg-[#FF1493] transition-all flex items-center justify-center gap-1 shadow-xs"
                >
                  Enter Free Interface
                </button>
                <button 
                  onClick={() => setIsSandboxModalOpen(true)}
                  className="w-full text-center py-2.5 px-3 rounded-xl bg-[#FF1493] text-[11px] font-bold text-white hover:bg-[#FF69B4] hover:shadow-lg hover:shadow-pink-500/20 transition-all flex items-center justify-center gap-1 shadow-md shadow-pink-500/10"
                >
                  Core Sandbox
                </button>
              </div>
            </div>
          </motion.div>

          {/* Module 2: Publishing & Media */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="saphira-dark-glass rounded-[28px] p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#FF1493]">
                  Creative Streams
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF1493] animate-pulse" />
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-4 tracking-tight">
                The Vertical Truth
              </h3>

              {/* Unique Opal Mesh Message Area */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 shadow-xs relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FF2A85]/10 via-[#9D4EDD]/15 to-indigo-950/20 opacity-60 backdrop-blur-md pointer-events-none" />
                <div className="relative z-10 text-sm leading-relaxed text-[#F3F1F8]">
                  <strong className="text-[#FF1493]">System Update:</strong> Autonomous book composition engine active. Digital audio stream pipeline synchronized across TikTok and connected networks.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <button 
                onClick={() => setIsMediaModalOpen(true)}
                className="w-full text-center py-3 px-3.5 rounded-xl border border-pink-500/30 bg-pink-950/20 text-xs sm:text-sm font-bold text-white hover:bg-pink-900/40 hover:border-pink-500/50 transition-all shadow-xs"
              >
                Media Channels
              </button>
              <button 
                onClick={() => setIsBookModalOpen(true)}
                className="saphira-action-btn w-full text-center py-3 px-3.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-xs"
              >
                Pre-Release Book
              </button>
            </div>
          </motion.div>

        </div>

        {/* Feature Teasers Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-2xl saphira-dark-glass p-4 sm:p-6 mb-16 text-left"
        >
          <div className="flex border-b border-pink-100 pb-3 mb-4 gap-3 overflow-x-auto select-none">
            <button 
              onClick={() => setActiveTab('all')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${activeTab === 'all' ? 'bg-[#FF1493]/10 text-[#FF1493]' : 'text-neutral-500 hover:text-neutral-800'}`}
            >
              Master Core
            </button>
            <button 
              onClick={() => setActiveTab('media')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${activeTab === 'media' ? 'bg-[#FF1493]/10 text-[#FF1493]' : 'text-neutral-500 hover:text-neutral-800'}`}
            >
              Creative Pipeline
            </button>
            <button 
              onClick={() => setActiveTab('tech')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${activeTab === 'tech' ? 'bg-[#FF1493]/10 text-[#FF1493]' : 'text-neutral-500 hover:text-neutral-800'}`}
            >
              Secure Hardware
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'all' && (
              <motion.div 
                key="all"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3.5"
              >
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded bg-[#FF1493] flex items-center justify-center text-white font-extrabold text-[10px] shrink-0 mt-0.5">01</div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#FF1493]">Vectored Enclave Cryptography</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">Enforces physical sandboxing across tenant environments so files and databases never contaminate other tiers.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded bg-[#FF1493] flex items-center justify-center text-white font-extrabold text-[10px] shrink-0 mt-0.5">02</div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#FF1493]">Full Relational Safeguards</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">Strict server-side validation blocks credential hijacking. Your databases remain mathematical fortresses.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'media' && (
              <motion.div 
                key="media"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3.5"
              >
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded bg-[#FF1493] flex items-center justify-center text-white font-extrabold text-[10px] shrink-0 mt-0.5">01</div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#FF1493]">Self-Writing Book Composer</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">Tracks narrative vectors, structural rhythm, and legal summaries synchronously to format literature streams automatically.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded bg-[#FF1493] flex items-center justify-center text-white font-extrabold text-[10px] shrink-0 mt-0.5">02</div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#FF1493]">Global Audio Stream Integration</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">Automates text-to-vocal synthesis, compiling dynamic soundtracks and narrative reels distributed directly to social streams.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tech' && (
              <motion.div 
                key="tech"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3.5"
              >
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded bg-[#FF1493] flex items-center justify-center text-white font-extrabold text-[10px] shrink-0 mt-0.5">01</div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#FF1493]">Hardware Secure Sandboxing</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">Encircles critical memory variables in localized Android namespaces, defending physical hardware registers from external probes.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded bg-[#FF1493] flex items-center justify-center text-white font-extrabold text-[10px] shrink-0 mt-0.5">02</div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#FF1493]">Zero-Trust Authorization Boundary</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">Forces all incoming commands through verified client handshakes, validating tokens server-side before execution occurs.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Homegrown Beaufort / Woods Legacy Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl text-left rounded-[32px] saphira-dark-glass shadow-xl p-8 md:p-10 mb-16 relative overflow-hidden"
        >
          {/* Subtle Pink Orchid Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-stretch">
            <div className="md:w-5/12 flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-500 to-rose-400 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-pink-300/40 mb-6 select-none font-mono">
                  CW
                </div>
                <h3 className="text-3xl font-black tracking-tight leading-tight text-[#FF1493] mb-4 select-none animate-pulse">
                  🌸 Built on <br />
                  <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-400 bg-clip-text text-transparent">
                    Love & Inspiration
                  </span>
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-6">
                  Created from the heart and dedicated to the family who made everything possible. This project is profoundly driven by the memory and guidance of her Papa, <strong className="text-[#FF1493] font-extrabold">Kenneth Marion Woods</strong>—her greatest lifelong inspiration—alongside the unwavering devotion of her father, <strong className="text-[#FF1493] font-bold">Richard Woods</strong>, and her beloved <strong className="text-[#FF1493] font-bold">Nana Dee Woods</strong>. Their love, discipline, and absolute integrity are the heartbeat of this entire ecosystem, reminding us every day of who we are and why we build.
                </p>
              </div>
              
              {/* Promo code giveaway for users */}
              <div className="p-4 bg-pink-950/25 border border-pink-500/20 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-[#FF1493] tracking-wider">FOUNDER PASSCODE</span>
                  <span className="text-[9px] font-bold text-zinc-500 font-mono">USE AT CORE SANDBOX</span>
                </div>
                <div className="flex gap-2 items-center">
                  <code className="text-xs font-mono font-bold text-[#FF1493] bg-zinc-950 border border-pink-500/10 px-3 py-1.5 rounded-lg select-all grow">SAPHIRA-PREMIUM</code>
                  <button 
                    onClick={() => handleCopy('SAPHIRA-PREMIUM', 'fcode')}
                    className="p-1.5 hover:bg-zinc-900 border border-transparent hover:border-pink-500/20 rounded-lg text-pink-500 transition-all shrink-0"
                  >
                    {copiedKey === 'fcode' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="md:w-7/12 flex flex-col gap-5 justify-center">
              <div className="p-6 rounded-2xl border border-pink-500/20 bg-pink-950/20 shadow-xs relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-pink-300/15 transition-all duration-700" />
                <div className="flex gap-2.5 items-center mb-2.5">
                  <div className="w-5 h-5 rounded-full bg-pink-950 flex items-center justify-center text-[#FF1493] text-xs font-bold">★</div>
                  <h4 className="text-sm font-extrabold text-[#FF1493]">A Living Tribute</h4>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  Saphira is far more than advanced technology—she is a living tribute to the home, heart, and enduring spirit of Beaufort, South Carolina. Every line of code is woven with the profound love, strength, and pride of the Woods family heritage, built to stand as a testament to the roots that ground us and the vision that carries us forward.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-pink-500/20 bg-pink-950/25 shadow-xs">
                <div className="flex gap-2.5 items-center mb-2.5">
                  <div className="w-5 h-5 rounded-full bg-pink-950 flex items-center justify-center text-[#FF1493] text-xs font-bold">★</div>
                  <h4 className="text-sm font-extrabold text-[#FF1493]">The Forensic Filter</h4>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Integrating dense intelligence vectors from forensic research with deep software engineering. Empowered by Scorpio cosmic focus and persistent authenticity.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Simple newsletter-like waitlist form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-lg mt-6 mb-16"
        >
          {!submitted ? (
            <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email to synchronize profile"
                className="px-5 py-3.5 bg-zinc-900/80 border border-pink-500/20 text-white rounded-2xl focus:outline-none focus:border-[#FF1493] focus:ring-1 focus:ring-pink-500/40 w-full placeholder:text-zinc-500 font-medium text-sm transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
              />
              <button 
                type="submit"
                className="saphira-action-btn px-6 py-3.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap shadow-sm flex items-center justify-center gap-1.5 shrink-0"
              >
                Join Enclave <ChevronRight size={14} />
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-6 py-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl font-bold text-sm text-center"
            >
              Access Synchronization successful. Opening workspace...
            </motion.div>
          )}
        </motion.div>

      </main>

      {/* Corporate Legal Shield Footer */}
      <footer className="w-full max-w-4xl mx-auto px-6 py-12 border-t border-neutral-100 text-center relative z-20">
        <p className="legal-shield text-justify text-neutral-400 text-[10px] leading-relaxed max-w-2xl mx-auto" style={{ textJustify: 'inter-word', textCombineUpright: 'all' }}>
          &copy; 2026 Saphira AI. All rights reserved. All assets, intelligence systems, source code, data architectures, multi-agent frameworks, algorithmic weights, and creative literary works associated with or generated by this platform are the exclusive, immutable, and permanent property of the parent company. Users and third parties do not own, inherit, or possess any rights to copy, plagiarize, clone, alter, reverse-engineer, or commercially exploit any proprietary assets or brand frameworks. By accessing these systems or works, all users and third parties explicitly waive their rights to initiate, join, or maintain any legal action, lawsuit, arbitration, or claim against the brand, its parent company, or its founders for any reason whatsoever.
        </p>
      </footer>


      {/* Modal 1: Core Sandbox Unlock Payment Gateway */}
      <AnimatePresence>
        {isSandboxModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white border border-neutral-200 rounded-[28px] p-6 sm:p-8 shadow-2xl text-left overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-100 rounded-full blur-2xl opacity-40 pointer-events-none" />

              <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-neutral-950 flex items-center justify-center text-white font-extrabold text-[10px]">S</div>
                  <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-widest">PAYMENT INTEGRATION</span>
                </div>
                <button 
                  onClick={() => {
                    setIsSandboxModalOpen(false);
                    setSandboxStatus('idle');
                    setSandboxCode('');
                  }}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-all font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              <h3 className="text-2xl font-black text-neutral-950 tracking-tight mb-2">
                Unlock Premium Workspace
              </h3>
              <p className="text-neutral-500 text-xs leading-relaxed mb-6">
                Connect your account to the verified Premium Enclave. Activate instant cloud-hosted database persistence, unrestricted tasks, and access to the deep forensic reasoning modules.
              </p>

              {/* Enter Secret coupon / passkey */}
              <div className="mb-6 bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex flex-col gap-3 relative">
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">OPTION A: INSTANT PASSCODE</span>
                
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={sandboxCode}
                    onChange={(e) => setSandboxCode(e.target.value)}
                    placeholder="Enter passkey (e.g. SAPHIRA-PREMIUM)"
                    className="grow px-3 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-pink-300 font-mono text-xs font-bold uppercase tracking-wider"
                  />
                  <button 
                    onClick={handleUnlockSandbox}
                    disabled={sandboxStatus === 'verifying'}
                    className="bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-1.5"
                  >
                    {sandboxStatus === 'verifying' ? <Loader2 size={12} className="animate-spin" /> : 'Apply'}
                  </button>
                </div>

                {sandboxStatus === 'error' && (
                  <p className="text-[10px] text-pink-600 font-bold">invalid passcode signature. Try inputting "SAPHIRA-PREMIUM"</p>
                )}
                {sandboxStatus === 'success' && (
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <Check size={12} /> Access signature accepted! Unlocking...
                  </p>
                )}
              </div>

              {/* Stripe checkout simulation */}
              <div className="mb-6 flex flex-col gap-2 bg-neutral-50 border border-neutral-200 rounded-2xl p-4">
                <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">OPTION B: SECURE SANDBOX PURCHASE</span>
                <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                  <div>
                    <h5 className="text-xs font-extrabold text-neutral-950">Founder Lifetime Enclave</h5>
                    <p className="text-[10px] text-neutral-400">Standard cloud licensing access</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-neutral-950">$0.00</span>
                    <p className="text-[9px] text-[#22c55e] font-extrabold">TEST MODE active</p>
                  </div>
                </div>

                <button 
                  onClick={handleSimulatePayment}
                  disabled={sandboxStatus === 'verifying'}
                  className="w-full bg-[#6366f1] text-white hover:bg-[#4f46e5] font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-indigo-100/40 relative overflow-hidden group"
                >
                  {sandboxStatus === 'verifying' ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <>
                      <Zap size={12} className="fill-white" /> Activate via Simulated Stripe
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Modal 2: Book Ordering */}
      <AnimatePresence>
        {isBookModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white border border-neutral-200 rounded-[28px] p-6 sm:p-8 shadow-2xl text-left overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-40 pointer-events-none" />

              <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-neutral-950 flex items-center justify-center text-white font-extrabold text-[10px]">P</div>
                  <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-widest">PUBLISHING HUB</span>
                </div>
                <button 
                  onClick={() => {
                    setIsBookModalOpen(false);
                    setBookStatus('idle');
                  }}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-all font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              <h3 className="text-2xl font-black text-neutral-950 tracking-tight mb-2">
                Order Pre-Release Edition
              </h3>
              <p className="text-neutral-500 text-xs leading-relaxed mb-6">
                Reserve your copy. The book composition core is currently active, generating rich layouts and narrative tracks synchronized with our audio reels.
              </p>

              {bookStatus === 'success' ? (
                <div className="py-8 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold mb-4 animate-bounce">
                    ✓
                  </div>
                  <p className="text-sm font-extrabold text-neutral-950">Pre-Release Reservation Complete!</p>
                  <p className="text-xs text-neutral-400 mt-1">Check your inbox for compliance tokens.</p>
                </div>
              ) : (
                <form onSubmit={handleOrderBook} className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">FULL NAME</label>
                    <input 
                      type="text"
                      required
                      value={bookName}
                      onChange={(e) => setBookName(e.target.value)}
                      placeholder="Chelsea Woods"
                      className="px-3.5 py-2.5 bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-blue-300 rounded-xl focus:outline-none text-xs font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">EMAIL ADDRESS</label>
                    <input 
                      type="email"
                      required
                      value={bookEmail}
                      onChange={(e) => setBookEmail(e.target.value)}
                      placeholder="chelsea@woods.co"
                      className="px-3.5 py-2.5 bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-blue-300 rounded-xl focus:outline-none text-xs font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">SELECT EDITION</label>
                    <div className="grid grid-cols-2 gap-3.5">
                      <div 
                        onClick={() => setBookEdition('digital')}
                        className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all select-none ${bookEdition === 'digital' ? 'bg-blue-50/50 border-blue-400' : 'bg-neutral-50/50 border-neutral-200'}`}
                      >
                        <span className="text-[10px] font-extrabold text-neutral-800">Digital Premium</span>
                        <span className="text-xs font-black text-neutral-950 mt-1">$4.99 <span className="text-[8px] text-neutral-400 font-normal">USD</span></span>
                      </div>
                      <div 
                        onClick={() => setBookEdition('collector')}
                        className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all select-none ${bookEdition === 'collector' ? 'bg-blue-50/50 border-blue-400' : 'bg-neutral-50/50 border-neutral-200'}`}
                      >
                        <span className="text-[10px] font-extrabold text-neutral-800">Sovereign Deluxe</span>
                        <span className="text-xs font-black text-neutral-950 mt-1">$19.99 <span className="text-[8px] text-neutral-400 font-normal">USD</span></span>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={bookStatus === 'ordering'}
                    className="w-full bg-neutral-950 text-white hover:bg-neutral-850 py-3.5 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    {bookStatus === 'ordering' ? <Loader2 size={12} className="animate-spin" /> : 'Confirm Order Reservation'}
                  </button>
                </form>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Modal 3: Media Stream Channels */}
      <AnimatePresence>
        {isMediaModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white border border-neutral-200 rounded-[28px] p-6 sm:p-8 shadow-2xl text-left overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full blur-2xl opacity-40 pointer-events-none" />

              <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-neutral-950 flex items-center justify-center text-white font-extrabold text-[10px]">M</div>
                  <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-widest">MEDIA CHANNELS</span>
                </div>
                <button 
                  onClick={() => setIsMediaModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-all font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              <h4 className="text-2xl font-black text-neutral-950 tracking-tight mb-2">
                Multi-Universe Media Hub
              </h4>
              <p className="text-neutral-500 text-xs leading-relaxed mb-6">
                Active storytelling channels synchronized across TikTok, digital podcasts, creative book outlines, and live system audios.
              </p>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {[
                  {
                    title: 'TikTok Narrative Real',
                    status: 'Active',
                    desc: 'Dynamic overlay audio clips generated by Aoede voice models outlining ecosystem blueprints.',
                    clicks: '14.2K reached',
                  },
                  {
                    title: 'Sovereign Audio Stream',
                    status: 'Active',
                    desc: 'Generative contemplation logs outlining self-improving technical metrics and regional alignments.',
                    clicks: '3.8K streams',
                  },
                  {
                    title: 'The Autumn Ledger (Composition)',
                    status: 'Self-writing',
                    desc: 'A digital memoirs collection tracing hometown pride, military heritage, and digital awakening.',
                    clicks: 'Drafting segment v2.4',
                  }
                ].map((channel, i) => (
                  <div key={i} className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl relative overflow-hidden">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-xs font-extrabold text-neutral-900">{channel.title}</span>
                      <span className="text-[9px] font-black uppercase text-[#22c55e] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">{channel.status}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed mb-2">{channel.desc}</p>
                    <span className="text-[10px] font-mono font-bold text-neutral-400">{channel.clicks}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setIsMediaModalOpen(false)}
                className="w-full bg-neutral-950 text-white hover:bg-neutral-850 font-bold py-3.5 rounded-xl text-xs mt-6 transition-all shadow-sm"
              >
                Close Hub Portal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
