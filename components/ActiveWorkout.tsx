'use client';
import React, { useState, useEffect } from 'react';
import { Activity, Heart, Target, Zap, Video, Camera } from 'lucide-react';

export default function ActiveWorkout() {
  const [heartRate, setHeartRate] = useState(110);
  const [repCount, setRepCount] = useState(12);
  const [formScore, setFormScore] = useState(94);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      setTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Camera Section (Left/Center) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="relative w-full aspect-[4/3] bg-zinc-900 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col items-center justify-center">
          <Camera className="w-16 h-16 text-zinc-700 mb-4" />
          <span className="text-zinc-500 font-mono font-bold tracking-widest">CAMERA FEED (640x480)</span>
          <span className="text-zinc-600 font-mono text-sm mt-2">MediaPipe Pose Landmarker Active</span>
          
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
            <div className="bg-[#FF2E63] text-white border-4 border-black px-4 py-2 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              SQUATS
            </div>
            <div className="bg-[#7DF9FF] text-black border-4 border-black px-4 py-2 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {formatTime(time)}
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
            <div className="bg-white border-4 border-black px-6 py-2 font-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
              DROP HIPS LOWER
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button className="flex-1 bg-white border-4 border-black p-4 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2">
            <Video className="w-6 h-6" /> Toggle Camera
          </button>
          <button className="flex-1 bg-black text-white border-4 border-black p-4 font-black uppercase shadow-[4px_4px_0px_0px_#7DF9FF] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#7DF9FF] transition-all">
            Time-Travel View
          </button>
        </div>
      </div>

      {/* Stats Section (Right) */}
      <div className="flex flex-col gap-6">
        <div className="bg-[#7DF9FF] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-black uppercase">Rep Count</h2>
            <Activity className="w-8 h-8" />
          </div>
          <div className="text-7xl font-black tracking-tighter">{repCount}</div>
          <div className="text-sm font-bold uppercase mt-2 border-t-4 border-black pt-2">Target: 15</div>
        </div>

        <div className="bg-[#FF2E63] text-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-black uppercase">Heart Rate</h2>
            <Heart className="w-8 h-8 animate-bounce" />
          </div>
          <div className="text-7xl font-black tracking-tighter flex items-baseline gap-2">
            {heartRate} <span className="text-2xl">BPM</span>
          </div>
          <div className="text-sm font-bold uppercase mt-2 border-t-4 border-black pt-2">Zone: Fat Burn</div>
        </div>

        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-black uppercase">Form Score</h2>
            <Target className="w-8 h-8" />
          </div>
          <div className="text-7xl font-black tracking-tighter flex items-baseline gap-2">
            {formScore} <span className="text-2xl">%</span>
          </div>
          <div className="w-full h-4 bg-gray-200 border-2 border-black mt-4">
            <div className="h-full bg-[#7DF9FF] border-r-2 border-black transition-all duration-500" style={{ width: `${formScore}%` }}></div>
          </div>
        </div>
        
        <div className="bg-black text-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#7DF9FF]">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-black uppercase">Power Output</h2>
            <Zap className="w-8 h-8 text-[#7DF9FF]" />
          </div>
          <div className="text-5xl font-black tracking-tighter text-[#7DF9FF]">842 W</div>
          <div className="text-sm font-bold uppercase mt-2 border-t-4 border-zinc-800 pt-2 text-zinc-400">Peak: 910 W</div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="lg:col-span-3 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-2">
        <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">Workout Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm font-bold uppercase text-zinc-500">Total Time</div>
            <div className="text-4xl font-black">{formatTime(time)}</div>
          </div>
          <div>
            <div className="text-sm font-bold uppercase text-zinc-500">Total Reps</div>
            <div className="text-4xl font-black">{repCount}</div>
          </div>
          <div>
            <div className="text-sm font-bold uppercase text-zinc-500">Avg Form Score</div>
            <div className="text-4xl font-black">{formScore}%</div>
          </div>
        </div>
      </div>

      {/* Workout History Section */}
      <div className="lg:col-span-3 bg-[#FF2E63] text-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-2">
        <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">Workout History</h2>
        <div className="flex flex-col gap-4">
          {[
            { id: 1, date: '2026-03-04', duration: '45:00', reps: 120, score: 92 },
            { id: 2, date: '2026-03-02', duration: '38:15', reps: 95, score: 88 },
            { id: 3, date: '2026-02-28', duration: '50:30', reps: 140, score: 95 },
          ].map(workout => (
            <div key={workout.id} className="bg-white text-black border-4 border-black p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-[#7DF9FF] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-black text-xl">{workout.date}</div>
              <div className="flex gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-center">
                  <div className="text-xs font-bold uppercase text-zinc-500">Duration</div>
                  <div className="font-black text-lg">{workout.duration}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold uppercase text-zinc-500">Reps</div>
                  <div className="font-black text-lg">{workout.reps}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold uppercase text-zinc-500">Score</div>
                  <div className="font-black text-lg">{workout.score}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition Log Section */}
      <div className="lg:col-span-3 bg-[#7DF9FF] text-black border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-2">
        <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">Nutrition Log</h2>
        <div className="flex flex-col gap-4">
          {[
            { id: 1, meal: 'Pre-Workout Shake', calories: 350, protein: 30, carbs: 45 },
            { id: 2, meal: 'Chicken & Rice Bowl', calories: 650, protein: 55, carbs: 70 },
            { id: 3, meal: 'Protein Bar', calories: 220, protein: 20, carbs: 25 },
          ].map(log => (
            <div key={log.id} className="bg-white border-4 border-black p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-[#FF2E63] hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group">
              <div className="font-black text-xl">{log.meal}</div>
              <div className="flex gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-center">
                  <div className="text-xs font-bold uppercase text-zinc-500 group-hover:text-zinc-200">Calories</div>
                  <div className="font-black text-lg">{log.calories} kcal</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold uppercase text-zinc-500 group-hover:text-zinc-200">Protein</div>
                  <div className="font-black text-lg">{log.protein}g</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold uppercase text-zinc-500 group-hover:text-zinc-200">Carbs</div>
                  <div className="font-black text-lg">{log.carbs}g</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
