
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { chatWithCounselor } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: "Hello. I'm MindBuddy. I'm here to listen to anything on your mind—exam stress, burnout, or just a rough day. How are you holding up today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithCounselor(userText, messages.map(m => ({ role: m.role, text: m.text })));
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response || "I'm listening, but I might be having connection issues. Could you repeat that?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        text: "I hit a snag. Please check your internet connection.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-purple-500/10 mt-6 mb-6">
      <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-purple-400 shadow-lg shadow-purple-900/40">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-black text-purple-400 tracking-tight">MindBuddy AI</h3>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                Private Counseling
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
           <button 
            onClick={() => setMessages([messages[0]])}
            className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-purple-500 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto px-8 py-8 space-y-6 scrollbar-hide"
      >
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-[2rem] px-6 py-4 shadow-sm ${
              m.role === 'user' 
                ? 'bg-purple-600 text-purple-400 rounded-tr-none' 
                : 'bg-slate-800 text-slate-400 border border-slate-700 rounded-tl-none'
            }`}>
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                {m.text}
              </p>
              <div className={`mt-2 text-[8px] font-black uppercase tracking-widest ${m.role === 'user' ? 'text-purple-400 text-right' : 'text-slate-500'}`}>
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 px-6 py-4 rounded-[2rem] rounded-tl-none border border-slate-700 flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-150"></div>
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-300"></div>
              <span className="ml-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Thinking</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-8 py-6 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSend} className="relative flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me what's on your mind..."
            className="flex-1 bg-slate-800 border-2 border-slate-700 rounded-2xl px-6 py-4 focus:ring-0 focus:border-purple-500 outline-none text-purple-400 transition-all font-medium placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-purple-600 text-purple-400 px-8 rounded-2xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-950/40 disabled:opacity-50 active:scale-95 group"
          >
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </form>
        <p className="text-center mt-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
          Private, anonymous, and encrypted. Not a substitute for clinical care.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
