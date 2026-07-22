
import React from 'react';

interface CrisisProps {
  onStartChat: () => void;
}

const Crisis: React.FC<CrisisProps> = ({ onStartChat }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-8 animate-in fade-in duration-500">
      <div className="bg-black border-2 border-purple-600/20 p-10 md:p-16 rounded-[3rem] text-center space-y-6 shadow-2xl shadow-purple-950/20 backdrop-blur-xl">
        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/30 animate-pulse border-4 border-purple-500/20">
           <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
           </svg>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-purple-400 tracking-tight">You're Not Alone.</h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">
          If you are feeling overwhelmed or in immediate danger, please reach out to these 24/7 services right now.
        </p>

        <div className="grid md:grid-cols-2 gap-6 pt-8">
          <a href="tel:988" className="bg-purple-600 text-purple-400 p-8 rounded-3xl flex flex-col items-center justify-center gap-2 group hover:bg-purple-700 transition-all shadow-xl shadow-purple-950/40 active:scale-95">
             <span className="text-3xl font-black">988</span>
             <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Call Crisis Lifeline</span>
          </a>
          <button onClick={() => window.open('https://988lifeline.org/chat/', '_blank')} className="bg-black border-2 border-zinc-800 text-purple-400 p-8 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-zinc-900 transition-all shadow-lg active:scale-95">
             <span className="text-3xl font-black">SMS</span>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Text "HOME" to 741741</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-black border border-zinc-800 p-8 rounded-[2.5rem] space-y-4 shadow-sm hover:border-purple-500/30 transition-all">
          <h3 className="text-xl font-black text-purple-400">Talk to MindBuddy AI</h3>
          <p className="text-slate-400 text-sm font-medium">Need to vent immediately? Our AI is here to listen without judgment 24/7.</p>
          <button 
            onClick={onStartChat}
            className="w-full bg-purple-600 text-purple-400 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-purple-700 transition-all shadow-lg shadow-purple-950/40 active:scale-95"
          >
            Start Crisis Chat
          </button>
        </div>

        <div className="bg-black border border-zinc-800 p-8 rounded-[2.5rem] space-y-4 shadow-sm group">
          <h3 className="text-xl font-black text-purple-400">60-Second Calm</h3>
          <p className="text-slate-400 text-sm font-medium">Follow the rhythm to regulate your breathing and lower your heart rate.</p>
          <div className="flex justify-center py-4">
            <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-purple-500 animate-spin group-hover:border-t-purple-400"></div>
          </div>
        </div>
      </div>

      <div className="text-center pb-12">
        <p className="text-slate-600 text-[10px] uppercase tracking-widest font-black">
          International? Contact your local emergency services immediately.
        </p>
      </div>
    </div>
  );
};

export default Crisis;
