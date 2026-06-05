import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, Compass, Navigation, Share2, Map as MapIcon, Route } from 'lucide-react';
import { cn } from '../lib/utils';
import { notify } from './NotificationOverlay';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const API_KEY = '';

function RouteDisplay({ origin, destination }: {
  origin: string | google.maps.LatLngLiteral;
  destination: string | google.maps.LatLngLiteral;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const [polylines, setPolylines] = useState<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !origin || !destination) return;
    
    // Clear previous
    polylines.forEach(p => p.setMap(null));

    routesLib.Route.computeRoutes({
      origin,
      destination,
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const newPolylines = routes[0].createPolylines();
        newPolylines.forEach(p => p.setMap(map));
        setPolylines(newPolylines);
        if (routes[0].viewport) map.fitBounds(routes[0].viewport);
      }
    });

    return () => polylines.forEach(p => p.setMap(null));
  }, [routesLib, map, origin, destination]);

  return null;
}

export const SpatialMapOverlay = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState(() => {
    const saved = localStorage.getItem('saphira_map_center');
    return saved ? JSON.parse(saved) : { lat: 37.7749, lng: -122.4194 };
  });
  const [zoom, setZoom] = useState(() => {
    const saved = localStorage.getItem('saphira_map_zoom');
    return saved ? JSON.parse(saved) : 12;
  });
  const [routeMode, setRouteMode] = useState(false);
  const [myLocation, setMyLocation] = useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      notify("Spatial Awareness", "Map engine fully synchronized with Saphira.", "success");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCameraChange = useCallback((ev: any) => {
    const newCenter = ev.detail.center;
    const newZoom = ev.detail.zoom;
    setCenter(newCenter);
    setZoom(newZoom);
    localStorage.setItem('saphira_map_center', JSON.stringify(newCenter));
    localStorage.setItem('saphira_map_zoom', JSON.stringify(newZoom));
  }, []);

  const locateUser = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setMyLocation(pos);
        setCenter(pos);
        setZoom(14);
        notify("Location Acquired", "Synchronizing spatial coordinates relative to your position.", "success");
      }, (err) => {
        notify("Location Error", "Cannot access physical location. Operating from last known coordinate.", "warn");
      });
    }
  };

  const shareLocation = () => {
    if (myLocation) {
        navigator.clipboard.writeText(`Latitude: ${myLocation.lat}, Longitude: ${myLocation.lng}`);
        notify("Location Copied", "Coordinates copied to clipboard for direct transfer to Agent Zero.", "info");
    } else {
        notify("No Signal", "Must acquire location first before sharing.", "warn");
    }
  };

  if (!API_KEY) {
     return (
       <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-md" onClick={onClose} />
          <div className="relative p-6 bg-indigo-950/90 border border-indigo-500/30 rounded-3xl max-w-sm w-full text-center">
             <MapIcon size={32} className="mx-auto mb-4 text-indigo-400 opacity-50" />
             <h3 className="text-white font-black mb-2">Maps Unavailable</h3>
             <p className="text-xs text-indigo-300 opacity-80 mb-6">The spatial engine is currently disabled.</p>
             <button onClick={onClose} className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl transition-colors">Close</button>
          </div>
       </div>
     );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-10">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-indigo-950/60 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl h-[80vh] bg-indigo-950/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-indigo-500/30 rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(99,102,241,0.5)] overflow-hidden flex flex-col"
      >
        <div className="flex z-10 items-center justify-between p-5 border-b border-indigo-500/20 bg-indigo-900/20 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-4 pl-2">
             <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500/40 to-pink-500/40 flex items-center justify-center text-white border border-indigo-400/30 shadow-inner">
               <Compass size={24} />
             </div>
             <div>
               <h2 className="text-xl font-black text-white tracking-tight">Embedded Spatial Protocol</h2>
               <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-[0.3em]">Saphira Active Rendering Engine</p>
             </div>
          </div>
          <div className="flex items-center gap-3 pr-2">
            <button
               onClick={() => setRouteMode(!routeMode)}
               className={cn(
                 "flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                 routeMode ? "bg-pink-500/20 text-pink-300 border-pink-500/50" : "bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20"
               )}
            >
               <Route size={14} /> Routes
            </button>
            <button onClick={shareLocation} className="p-3 text-indigo-300 hover:text-white transition-colors bg-indigo-500/10 rounded-xl hover:bg-indigo-500/30 border border-indigo-500/30">
              <Share2 size={16} />
            </button>
            <button onClick={onClose} className="p-3 text-indigo-300 hover:text-white transition-colors bg-indigo-500/10 border border-transparent rounded-xl hover:bg-rose-500/80 hover:border-rose-400 hover:text-white ml-2">
              <X size={18} strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="flex-1 relative bg-[#0f172a]">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-950 z-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-indigo-500/10 border-t-pink-500 rounded-full mb-6"
              />
              <span className="text-xs font-mono text-indigo-300 uppercase tracking-widest animate-pulse">Initializing Vector Graphics...</span>
            </div>
          ) : (
            <div className="absolute inset-0">
               <APIProvider apiKey={API_KEY} version="weekly">
                 <Map
                   center={center}
                   zoom={zoom}
                   onCameraChanged={handleCameraChange}
                   mapId="4b9b9c9f2b8b9f7"
                   disableDefaultUI={true}
                   internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                   style={{ width: '100%', height: '100%' }}
                 >
                   {/* Animated custom marker for headquarters/target */}
                   <AdvancedMarker position={{ lat: 37.7749, lng: -122.4194 }}>
                     <motion.div 
                       animate={{ y: [0, -10, 0] }}
                       transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                       className="relative flex flex-col items-center"
                     >
                       <div className="bg-indigo-950 p-2 rounded-xl border border-indigo-400 shadow-xl shadow-indigo-500/50">
                          <MapPin size={24} className="text-white" />
                       </div>
                       <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1 blur-sm opacity-50" />
                     </motion.div>
                   </AdvancedMarker>

                   {/* My Location Marker */}
                   {myLocation && (
                      <AdvancedMarker position={myLocation}>
                         <motion.div
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           className="w-6 h-6 bg-emerald-500 border-2 border-white rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)] relative flex items-center justify-center"
                         >
                            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                         </motion.div>
                      </AdvancedMarker>
                   )}

                   {/* Route Mode Overlay */}
                   {routeMode && myLocation && (
                      <RouteDisplay origin={myLocation} destination={{ lat: 37.7749, lng: -122.4194 }} />
                   )}
                 </Map>
               </APIProvider>
               
               <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(15,23,42,1)]" />
               <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between pointer-events-none">
                 <div className="bg-indigo-950/80 backdrop-blur-md border border-indigo-500/50 pl-4 pr-5 py-3 rounded-2xl flex items-center gap-4 shadow-xl">
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]" />
                   <div className="flex flex-col">
                     <span className="text-[11px] uppercase font-bold tracking-widest text-indigo-100 leading-tight">Live Telemetry Linked</span>
                     <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 mt-0.5">Vector Nodes Active.</span>
                   </div>
                 </div>
                 <button 
                   onClick={locateUser} 
                   className="bg-emerald-950/80 text-emerald-100 backdrop-blur-md border border-emerald-500/50 p-4 rounded-2xl pointer-events-auto cursor-pointer hover:bg-emerald-900 shadow-xl transition-all hover:scale-105 active:scale-95 group"
                 >
                   <Navigation size={24} className="group-hover:text-white transition-colors" />
                 </button>
               </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
