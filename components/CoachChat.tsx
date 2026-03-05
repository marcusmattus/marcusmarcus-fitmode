'use client';
import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function CoachChat() {
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
    { role: 'model', text: "SGT. MAJOR ONLINE. YOUR SQUAT DEPTH WAS SHALLOW YESTERDAY. WHAT'S YOUR EXCUSE?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });
      const chat = ai.chats.create({
        model: 'gemini-3.1-pro-preview',
        config: {
          systemInstruction: "You are a Sgt. Major style fitness coach for ForgeFlow. Be direct, tough, and use Neobrutalist, high-impact language. Keep it brief. Analyze workout data if provided.",
        }
      });

      // Replay history (simplified for this demo)
      for (const msg of newMessages.slice(0, -1)) {
        if (msg.role === 'user') {
          await chat.sendMessage({ message: msg.text });
        }
      }

      const response = await chat.sendMessage({ message: input });
      setMessages([...newMessages, { role: 'model', text: response.text || '' }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'model', text: "COMMUNICATION ERROR. CHECK API KEY." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
      <div className="bg-[#FF2E63] text-white border-b-4 border-black p-4 flex items-center gap-4">
        <Bot className="w-8 h-8" />
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Sgt. Major AI</h2>
          <p className="font-bold text-sm uppercase">Tactical Coach</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#F0F0F0]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${msg.role === 'user' ? 'bg-[#7DF9FF] text-black' : 'bg-white text-black'}`}>
              <div className="flex items-center gap-2 mb-2 border-b-2 border-black/20 pb-2">
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                <span className="font-black uppercase text-xs">{msg.role === 'user' ? 'You' : 'Coach'}</span>
              </div>
              <p className="font-bold">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex gap-2">
              <div className="w-3 h-3 bg-black animate-bounce"></div>
              <div className="w-3 h-3 bg-black animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-black animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-white border-t-4 border-black flex gap-4">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="REPORT TO COACH..."
          className="flex-1 bg-[#F0F0F0] border-4 border-black p-4 font-bold uppercase placeholder:text-zinc-400 focus:outline-none focus:bg-white transition-colors"
        />
        <button 
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-black text-white border-4 border-black px-8 font-black uppercase hover:bg-[#FF2E63] transition-colors disabled:opacity-50"
        >
          <Send className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
}
