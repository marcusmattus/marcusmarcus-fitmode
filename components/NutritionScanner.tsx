'use client';
import React, { useState, useRef } from 'react';
import { Camera, ScanLine, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function NutritionScanner() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFood = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });
      const base64Data = image.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
          { text: 'Identify this food. Estimate calories, protein, and carbs. How does this affect a HIIT session? Format as a short, punchy receipt.' }
        ]
      });
      
      setResult(response.text || null);
    } catch (error) {
      console.error(error);
      setResult("ERROR: UNABLE TO PROCESS NUTRITIONAL TELEMETRY. CHECK API KEY.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Scanner Side */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter">Vision Scan</h2>
            <p className="text-zinc-500 font-bold uppercase">Macro Telemetry</p>
          </div>
        </div>

        <div className="flex-1 min-h-[400px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-zinc-900 relative flex flex-col items-center justify-center overflow-hidden">
          {image ? (
            <img src={image} alt="Food scan" className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="text-zinc-700 flex flex-col items-center">
              <Camera className="w-24 h-24 mb-4" />
              <span className="font-black text-2xl tracking-widest">AWAITING VISUALS</span>
            </div>
          )}
          
          {loading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <ScanLine className="w-32 h-32 text-[#7DF9FF] animate-pulse" />
            </div>
          )}
        </div>

        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleCapture}
        />

        <div className="flex gap-4">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-white border-4 border-black p-4 font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
          >
            <Camera className="w-6 h-6" /> Capture
          </button>
          <button 
            onClick={analyzeFood}
            disabled={!image || loading}
            className="flex-1 bg-[#7DF9FF] border-4 border-black p-4 font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ScanLine className="w-6 h-6" />} Analyze
          </button>
        </div>
      </div>

      {/* Receipt Side */}
      <div className="w-full lg:w-96 flex flex-col">
        <div className="jagged-receipt border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-[500px] flex flex-col">
          <div className="text-center border-b-4 border-black pb-4 mb-4">
            <div className="w-12 h-12 mx-auto border-4 border-black overflow-hidden bg-gradient-to-br from-[#7DF9FF] to-[#FF2E63] flex items-center justify-center mb-2">
              <span className="font-black text-xl text-black tracking-tighter">FM</span>
            </div>
            <h3 className="font-black text-2xl uppercase tracking-tighter">Nutrition Log</h3>
            <p className="font-mono text-sm text-zinc-500">{new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="flex-1 font-mono text-sm whitespace-pre-wrap">
            {result || "SCAN FOOD TO GENERATE MACRO RECEIPT..."}
          </div>

          <div className="border-t-4 border-black pt-4 mt-4 text-center">
            <p className="font-black uppercase text-xl">ForgeFlow AI</p>
            <p className="font-mono text-xs">END OF TRANSMISSION</p>
          </div>
        </div>
      </div>
    </div>
  );
}
