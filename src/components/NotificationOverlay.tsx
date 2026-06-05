import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Info, AlertTriangle, CheckCircle, X } from 'lucide-react';

export type NotificationType = 'info' | 'success' | 'warn' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
}

let addNotificationToGlobal: (n: Omit<Notification, 'id' | 'timestamp'>) => void = () => {};

export const notify = (title: string, message: string, type: NotificationType = 'info') => {
  addNotificationToGlobal({ title, message, type });
};

export const NotificationOverlay = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    addNotificationToGlobal = (n) => {
      setNotifications(prev => [...prev, { ...n, id: Date.now().toString() + Math.random(), timestamp: new Date() }]);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev => prev.filter(n => new Date().getTime() - n.timestamp.getTime() < 5000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none w-80">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, pointerEvents: 'none' }}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 relative overflow-hidden backdrop-blur-xl ${
              n.type === 'info' ? 'bg-indigo-950/80 border-indigo-500/30 text-indigo-100 shadow-indigo-500/20' :
              n.type === 'success' ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-100 shadow-emerald-500/20' :
              n.type === 'warn' ? 'bg-amber-950/80 border-amber-500/30 text-amber-100 shadow-amber-500/20' :
              'bg-rose-950/80 border-rose-500/30 text-rose-100 shadow-rose-500/20'
            }`}
          >
            <div className={`mt-0.5 ${
              n.type === 'info' ? 'text-indigo-400' :
              n.type === 'success' ? 'text-emerald-400' :
              n.type === 'warn' ? 'text-amber-400' :
              'text-rose-400'
            }`}>
              {n.type === 'info' && <Info size={16} />}
              {n.type === 'success' && <CheckCircle size={16} />}
              {n.type === 'warn' && <AlertTriangle size={16} />}
              {n.type === 'error' && <AlertTriangle size={16} />}
            </div>
            <div className="flex-1 pr-6">
              <h4 className="text-xs font-bold tracking-widest uppercase mb-1">{n.title}</h4>
              <p className="text-[10px] opacity-80 leading-relaxed">{n.message}</p>
            </div>
            <button 
              onClick={() => removeNotification(n.id)}
              className="absolute top-2 right-2 p-1 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
