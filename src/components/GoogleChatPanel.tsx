import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X, MessageSquare, Send, RefreshCw } from 'lucide-react';
import { getAccessToken } from '../lib/firebase';
import { notify } from './NotificationOverlay';

export const GoogleChatPanel = ({ onClose }: { onClose: () => void }) => {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(true);
  const [selectedSpace, setSelectedSpace] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    setLoadingSpaces(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        notify('Authentication Error', 'No access token available. Please sign in again.', 'error');
        setLoadingSpaces(false);
        return;
      }
      const res = await fetch('https://chat.googleapis.com/v1/spaces', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSpaces(data.spaces || []);
      } else {
        notify('Chat Error', data.error?.message || 'Failed to fetch spaces', 'error');
      }
    } catch (e: any) {
      notify('Chat Error', e.message, 'error');
    }
    setLoadingSpaces(false);
  };

  const fetchMessages = async (spaceName: string) => {
    setLoadingMessages(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
      } else {
        notify('Chat Error', data.error?.message || 'Failed to fetch messages', 'error');
      }
    } catch (e: any) {
      notify('Chat Error', e.message, 'error');
    }
    setLoadingMessages(false);
  };

  const selectSpace = (space: any) => {
    setSelectedSpace(space);
    fetchMessages(space.name);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedSpace) return;
    
    // Explicit user confirmation (MANDATORY per SKILL.md for destructive operations)
    const confirmed = window.confirm(`Are you sure you want to send this message to "${selectedSpace.displayName}"?`);
    if (!confirmed) return;

    setSending(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`https://chat.googleapis.com/v1/${selectedSpace.name}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: input
        })
      });
      const data = await res.json();
      if (res.ok) {
        setInput('');
        fetchMessages(selectedSpace.name); // Refresh messages
        notify('Message Sent', 'Your message has been posted to Google Chat.', 'success');
      } else {
        notify('Chat Error', data.error?.message || 'Failed to send message', 'error');
      }
    } catch (e: any) {
      notify('Chat Error', e.message, 'error');
    }
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-indigo-950/60 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl h-[80vh] bg-indigo-950/90 backdrop-blur-2xl border border-indigo-500/30 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="flex z-10 items-center justify-between p-5 border-b border-indigo-500/20 bg-indigo-900/20 shadow-xl">
          <div className="flex items-center gap-4 pl-2">
             <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500/40 to-pink-500/40 flex items-center justify-center text-white border border-indigo-400/30 shadow-inner">
               <MessageSquare size={24} />
             </div>
             <div>
               <h2 className="text-xl font-black text-white tracking-tight">Google Chat</h2>
               <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-[0.3em]">{selectedSpace ? selectedSpace.displayName : 'Select a Space'}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-3 text-indigo-300 hover:text-white transition-colors bg-indigo-500/10 border border-transparent rounded-xl hover:bg-rose-500/80 hover:border-rose-400 hover:text-white ml-2">
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-indigo-500/20 flex flex-col">
            <div className="p-3 border-b border-indigo-500/10 flex justify-between items-center">
              <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-widest pl-2">Spaces</h3>
              <button onClick={fetchSpaces} className="p-1 text-indigo-400 hover:text-indigo-200"><RefreshCw size={14}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {loadingSpaces ? (
                <div className="text-center p-4 text-xs text-indigo-400">Loading spaces...</div>
              ) : spaces.length === 0 ? (
                <div className="text-center p-4 text-xs text-indigo-400">No spaces found.</div>
              ) : (
                spaces.map((space) => (
                  <div
                    key={space.name}
                    onClick={() => selectSpace(space)}
                    className={`p-3 rounded-xl cursor-pointer text-sm font-semibold transition-colors ${selectedSpace?.name === space.name ? 'bg-indigo-500/20 text-white border border-indigo-500/30' : 'text-indigo-200 hover:bg-indigo-500/10 border border-transparent'}`}
                  >
                    {space.displayName || 'Unnamed Space'}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col bg-indigo-950/30">
            {!selectedSpace ? (
              <div className="flex-1 flex items-center justify-center text-indigo-400 text-sm font-medium">
                Select a space to view messages
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="text-center p-4 text-xs text-indigo-400">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center p-4 text-xs text-indigo-400">No messages in this space.</div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.name} className={`flex flex-col ${msg.sender?.type === 'USER' ? 'items-end' : 'items-start'}`}>
                        <div className={`text-[10px] text-indigo-400 mb-1 ${msg.sender?.type === 'USER' ? 'mr-2' : 'ml-2'}`}>
                          {msg.sender?.displayName || 'Unknown'} - {new Date(msg.createTime).toLocaleTimeString()}
                        </div>
                        <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.sender?.type === 'USER' ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-100 rounded-tr-sm' : 'bg-white/5 border border-white/10 text-indigo-200 rounded-tl-sm'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="p-4 border-t border-indigo-500/20 bg-indigo-950/50">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 bg-white/5 border border-indigo-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder:text-indigo-400/50 focus:outline-none focus:border-indigo-400 focus:bg-white/10 transition-colors"
                      disabled={sending}
                    />
                    <button 
                      onClick={sendMessage}
                      disabled={!input.trim() || sending}
                      className="p-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 disabled:opacity-50 disabled:hover:bg-indigo-500 transition-colors"
                    >
                      {sending ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
