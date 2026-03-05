'use client';
import React, { useState } from 'react';
import ActiveWorkout from '@/components/ActiveWorkout';
import MapTracker from '@/components/MapTracker';
import NutritionScanner from '@/components/NutritionScanner';
import CoachChat from '@/components/CoachChat';
import { Activity, Map, ScanLine, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'train'|'trail'|'fuel'|'coach'>('train');

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-black p-4 md:p-8 selection:bg-[#FF2E63] selection:text-white flex flex-col">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border-4 border-black overflow-hidden bg-gradient-to-br from-[#7DF9FF] to-[#FF2E63] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
            <span className="font-black text-xl text-black tracking-tighter">FM</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">ForgeFlow</h1>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: 'train', label: 'Train', icon: Activity },
            { id: 'trail', label: 'Trail', icon: Map },
            { id: 'fuel', label: 'Fuel', icon: ScanLine },
            { id: 'coach', label: 'Coach', icon: MessageSquare },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 border-4 border-black font-black uppercase transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-[#FF2E63] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px]' 
                  : 'bg-white text-black hover:bg-[#7DF9FF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <tab.icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto">
        {activeTab === 'train' && <ActiveWorkout />}
        {activeTab === 'trail' && <MapTracker />}
        {activeTab === 'fuel' && <NutritionScanner />}
        {activeTab === 'coach' && <div className="max-w-3xl mx-auto"><CoachChat /></div>}
      </main>
    </div>
  );
}
