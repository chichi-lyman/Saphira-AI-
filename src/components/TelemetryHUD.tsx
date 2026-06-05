import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Wind, CloudSun, Map } from 'lucide-react';

export function TelemetryHUD() {
  const [telemetry, setTelemetry] = useState({
    lat: 34.0522,
    lng: -118.2437,
    speed: 0,
    heading: 0,
    temp: 72,
    city: 'Los Angeles'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        speed: prev.speed + (Math.random() - 0.5) * 5,
        heading: (prev.heading + Math.random() * 2) % 360,
        lat: prev.lat + (Math.random() - 0.5) * 0.0001,
        lng: prev.lng + (Math.random() - 0.5) * 0.0001,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-8 left-8 z-[50] flex flex-col gap-2 pointer-events-none">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <MapPin size={18} className="text-indigo-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Spatial Context</span>
            <span className="text-[12px] font-bold text-white uppercase tracking-tighter">{telemetry.city}, CA</span>
          </div>
        </div>

        <div className="h-8 w-px bg-white/10" />

        <div className="flex items-center gap-6">
          <TelemetryItem 
            icon={<Navigation size={12} style={{ transform: `rotate(${telemetry.heading}deg)` }} />}
            label="Vector"
            value={`${Math.max(0, Math.round(telemetry.speed))} km/h`}
          />
          <TelemetryItem 
            icon={<CloudSun size={12} />}
            label="Ambient"
            value={`${telemetry.temp}°F`}
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-black text-emerald-400/80 uppercase tracking-[0.2em]">Live Audio Bridge Linked</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
          <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">{telemetry.lat.toFixed(4)}, {telemetry.lng.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
}

function TelemetryItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-indigo-300 opacity-50">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[7px] font-black uppercase tracking-widest text-white/20">{label}</span>
        <span className="text-[10px] font-mono text-white/80 font-bold">{value}</span>
      </div>
    </div>
  );
}
