
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Week 1', stress: 0, relief: 0 },
  { name: 'Week 2', stress: 0, relief: 0 },
  { name: 'Week 3', stress: 0, relief: 0 },
  { name: 'Week 4', stress: 0, relief: 0 },
  { name: 'Week 5', stress: 0, relief: 0 },
];

const stats = [
  { label: 'Total Sessions', value: '0' },
  { label: 'Active Students', value: '0' },
  { label: 'Success Rate', value: 'Coming Soon' },
  { label: 'Crisis Calls Averted', value: '0' },
];

const Impact: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-16">
      <div className="text-center space-y-4">
        <div className="inline-block px-4 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest border border-purple-500/20 mb-4">
          Development Phase
        </div>
        <h2 className="text-5xl font-black text-purple-400 tracking-tight">Our Future Impact</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">We are currently in the final stages of development. Soon, we will measure success by the smiles returned and the ranks achieved through a calm state of mind.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-black p-8 rounded-[2rem] border border-zinc-800 shadow-sm text-center group hover:bg-purple-600 hover:text-purple-400 transition-all duration-500">
            <span className="block text-3xl font-black mb-1">{s.value}</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
           <h3 className="text-3xl font-black text-purple-400 leading-tight">Projected Student Stress Reduction</h3>
           <p className="text-slate-400 leading-relaxed">As we prepare for deployment, our models project a significant drop in exam-related anxiety for students who engage with MindBuddy AI consistently.</p>
           
           <div className="space-y-4">
              <div className="bg-purple-500/5 p-6 rounded-2xl border border-purple-500/10">
                <span className="block text-purple-400 font-black text-xl mb-1">Target: 40%+ Burnout Reduction</span>
                <span className="text-sm text-slate-500">Our goal is to support medical and engineering aspirants through their most rigorous months.</span>
              </div>
              <div className="bg-black p-6 rounded-2xl border border-zinc-800">
                <span className="block text-slate-400 font-black text-xl mb-1">Enhanced Focus Tools</span>
                <span className="text-sm text-slate-500">The Zen Zone is designed to boost concentration using scientifically-backed sensory grounding.</span>
              </div>
           </div>
        </div>

        <div className="bg-black p-10 rounded-[3rem] border border-zinc-800 shadow-2xl h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                cursor={{fill: 'transparent'}} 
                contentStyle={{backgroundColor: '#000000', borderRadius: '16px', border: '1px solid #1e293b', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)'}} 
                itemStyle={{color: '#a855f7'}}
              />
              <Bar dataKey="relief" fill="#9333ea" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Pending Baseline Deployment Data</span>
          </div>
        </div>
      </div>

      <div className="bg-purple-600 rounded-[3rem] p-12 text-purple-400 flex flex-col md:flex-row items-center gap-12 border border-purple-500/30 shadow-2xl shadow-purple-950/20">
        <div className="flex-1 space-y-6 text-center md:text-left">
           <h3 className="text-4xl font-black leading-tight">The MindEase Vision</h3>
           <blockquote className="text-xl text-purple-400 italic leading-relaxed">
             "We aren't just building an app. We are crafting a digital support system for the generation carrying the world's academic pressure. Our mission begins on launch day."
           </blockquote>
           <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full border border-purple-400 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <span className="block font-bold">Project Team</span>
                <span className="text-xs text-purple-400 uppercase font-black">MindEase Development</span>
              </div>
           </div>
        </div>
        <div className="w-64 h-64 bg-purple-500/10 rounded-full flex items-center justify-center border-4 border-purple-500/5 animate-pulse">
           <svg className="w-32 h-32 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
             <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
           </svg>
        </div>
      </div>
    </div>
  );
};

export default Impact;
