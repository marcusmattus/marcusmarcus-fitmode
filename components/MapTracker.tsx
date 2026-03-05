'use client';
import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Polyline } from '@react-google-maps/api';
import { Play, Square } from 'lucide-react';

const mapContainerStyle = { width: '100%', height: '100%' };
const center = { lat: 40.7128, lng: -74.0060 };
const options = {
  styles: [
    { elementType: "geometry", stylers: [{ color: "#000000" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#222222" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#ffffff" }, { weight: 2 }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#FF2E63" }] }
  ],
  disableDefaultUI: true,
};

export default function MapTracker() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [tracking, setTracking] = useState(false);
  const [path, setPath] = useState<{lat: number, lng: number}[]>([]);

  useEffect(() => {
    let watchId: number;
    if (tracking && 'geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setPath(prev => [...prev, { lat: pos.coords.latitude, lng: pos.coords.longitude }]);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [tracking]);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">The Forge Trail</h2>
          <p className="text-zinc-500 font-bold uppercase">GPS Telemetry Active</p>
        </div>
        <button 
          onClick={() => setTracking(!tracking)}
          className={`px-8 py-4 border-4 border-black font-black text-2xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 ${tracking ? 'bg-[#FF2E63] text-white' : 'bg-[#7DF9FF] text-black'}`}
        >
          {tracking ? <><Square className="w-6 h-6 fill-current" /> Stop</> : <><Play className="w-6 h-6 fill-current" /> Forge Start</>}
        </button>
      </div>

      <div className="flex-1 min-h-[400px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden bg-zinc-900">
        {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 text-white p-8 text-center">
            <div className="border-4 border-[#FF2E63] p-6 bg-black">
              <h3 className="text-2xl font-black text-[#FF2E63] mb-2">MAPS API KEY REQUIRED</h3>
              <p className="font-mono">Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.</p>
            </div>
          </div>
        )}
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={path[path.length - 1] || center}
            zoom={15}
            options={options}
          >
            <Polyline 
              path={path} 
              options={{ strokeColor: '#7DF9FF', strokeOpacity: 1, strokeWeight: 6 }} 
            />
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#7DF9FF] font-black text-2xl animate-pulse">
            INITIALIZING SATELLITE LINK...
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-sm font-bold uppercase text-zinc-500">Distance</div>
          <div className="text-3xl font-black">{(path.length * 0.01).toFixed(2)} KM</div>
        </div>
        <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-sm font-bold uppercase text-zinc-500">Pace</div>
          <div className="text-3xl font-black">5:30 /KM</div>
        </div>
        <div className="bg-[#7DF9FF] border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-sm font-bold uppercase text-black">Splits</div>
          <div className="text-3xl font-black">OPTIMAL</div>
        </div>
      </div>
    </div>
  );
}
