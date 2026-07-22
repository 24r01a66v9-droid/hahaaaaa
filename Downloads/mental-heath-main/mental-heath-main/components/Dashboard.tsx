
import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [joinedCount, setJoinedCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('mindease_joined_groups');
    if (saved) {
      setJoinedCount(JSON.parse(saved).length);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-16">
      <section className="text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest mb-4 border border-purple-500/20">
          Empowering Competitive Success
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-purple-400 leading-none tracking-tight">
          Calm Minds. <br />
          <span className="bg-gradient-to-r from-purple-500 to-fuchsia-400 bg-clip-text text-transparent">Healthy Ranks.</span>
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Healthy Mindset is designed for high-pressure academic environments. AI support, interactive grounding games, and professional care in one place.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button 
            onClick={() => onNavigate('assessment')}
            className="bg-purple-600 text-purple-400 px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-2xl shadow-purple-950/40 flex items-center gap-3 active:scale-95"
          >
            Start Check-In
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          <button 
            onClick={() => onNavigate('videoLounge')}
            className="bg-black border border-zinc-800 text-slate-400 px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-zinc-900 transition-all flex items-center gap-3 active:scale-95 shadow-sm"
          >
            Watch Motivation
          </button>
        </div>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-black/50 p-10 rounded-[2.5rem] shadow-sm border border-zinc-800 hover:shadow-xl hover:border-purple-500/30 transition-all group cursor-pointer" onClick={() => onNavigate('chat')}>
          <div className="w-14 h-14 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform border border-purple-500/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black mb-3 text-purple-400">Mindset Buddy AI</h3>
          <p className="text-slate-400 mb-6 leading-relaxed">Anonymous, high-quality counseling available 24/7 for stress and burnout.</p>
          <span className="text-purple-400 font-black uppercase tracking-widest text-xs">Chat Now &rarr;</span>
        </div>

        <div className="bg-black/50 p-10 rounded-[2.5rem] shadow-sm border border-zinc-800 hover:shadow-xl hover:border-purple-500/30 transition-all group cursor-pointer" onClick={() => onNavigate('games')}>
          <div className="w-14 h-14 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-purple-500/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black mb-3 text-purple-400">Wellness Games</h3>
          <p className="text-slate-400 mb-6 leading-relaxed">Interactive mini-games designed to reduce anxiety and improve focus.</p>
          <span className="text-purple-400 font-black uppercase tracking-widest text-xs">Play Now &rarr;</span>
        </div>

        <div className="bg-black/50 p-10 rounded-[2.5rem] shadow-sm border border-zinc-800 hover:shadow-xl hover:border-purple-500/30 transition-all group cursor-pointer" onClick={() => onNavigate('videoLounge')}>
          <div className="w-14 h-14 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-purple-500/20">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
          </div>
          <h3 className="text-2xl font-black mb-3 text-purple-400">Video Lounge</h3>
          <p className="text-slate-400 mb-6 leading-relaxed">Curated motivational videos and stress relief guides for students.</p>
          <span className="text-purple-400 font-black uppercase tracking-widest text-xs">Watch Now &rarr;</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-zinc-950 p-10 rounded-[3rem] text-purple-400 space-y-6 group cursor-pointer border border-zinc-800" onClick={() => onNavigate('professionalCare')}>
           <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black tracking-tight">Support Groups</h3>
              <div className="w-12 h-12 bg-purple-500/5 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors border border-purple-500/10">🤝</div>
           </div>
           <p className="text-slate-400 text-lg">Join safe communities of students. Talk to people who actually get it.</p>
           <div className="flex items-center gap-4">
              <div className="flex -space-x-3 overflow-hidden">
                {[1,2,3,4].map(i => (
                  <div key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-zinc-950 bg-zinc-800 flex items-center justify-center text-[10px] font-black">{i}</div>
                ))}
              </div>
              {joinedCount > 0 && (
                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/30">
                  {joinedCount} Joined Communities
                </span>
              )}
           </div>
           <button className="bg-purple-400 text-zinc-950 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl">
             {joinedCount > 0 ? 'Go to My Groups' : 'Browse Groups'}
           </button>
        </div>

        <div className="bg-purple-500/10 p-10 rounded-[3rem] text-purple-400 space-y-6 group cursor-pointer border border-purple-500/20" onClick={() => onNavigate('reviews')}>
           <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black tracking-tight">Student Reviews</h3>
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-purple-400">✨</div>
           </div>
           <p className="text-slate-400 text-lg">"Healthy Mindset is the only thing that kept me sane during finals." – Read 500+ student testimonials.</p>
           <div className="flex gap-1 text-purple-400">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
           </div>
           <button className="bg-purple-600 text-purple-400 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl">See All Reviews</button>
        </div>
      </div>
      
      <div className="bg-purple-600 p-12 rounded-[3rem] text-purple-400 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl shadow-purple-950/40 border border-purple-500/30">
        <div className="space-y-4 max-w-xl text-center md:text-left">
           <h3 className="text-3xl font-black">Private & Anonymous</h3>
           <p className="text-purple-400 text-lg">Your mental health is personal. We provide a 100% anonymous space for you to seek help, vent, and recover without judgment.</p>
        </div>
        <div className="w-64 h-64 bg-purple-500/50 rounded-full flex items-center justify-center border-8 border-purple-400/30">
           <svg className="w-32 h-32 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
           </svg>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
