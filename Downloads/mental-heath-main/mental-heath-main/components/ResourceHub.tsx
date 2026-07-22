
import React, { useState } from 'react';
import { Resource } from '../types';

const resources: Resource[] = [
  {
    id: 1,
    title: "Managing Exam Anxiety",
    category: "Anxiety",
    description: "Practical breathing techniques and study scheduling to keep your cool during finals week.",
    icon: "🧘‍♀️"
  },
  {
    id: 2,
    title: "Overcoming Burnout",
    category: "Burnout",
    description: "Recognizing the signs of academic fatigue and how to rest effectively without guilt.",
    icon: "🕯️"
  },
  {
    id: 3,
    title: "Deep Focus Meditation",
    category: "Focus",
    description: "A 10-minute guided audio experience to help you center your mind before a study session.",
    icon: "🎧"
  },
  {
    id: 4,
    title: "The Pomodoro Method+",
    category: "Stress",
    description: "Advanced time-management specifically tweaked for neurodivergent student minds.",
    icon: "⏱️"
  },
  {
    id: 5,
    title: "Social Anxiety in Dorms",
    category: "Anxiety",
    description: "Navigating shared living spaces and building meaningful connections as an introvert.",
    icon: "🏘️"
  },
  {
    id: 6,
    title: "Sleep Hygiene for Students",
    category: "Stress",
    description: "How to fix your sleep cycle when you've been living on caffeine and late nights.",
    icon: "🌙"
  }
];

const ResourceHub: React.FC = () => {
  const [filter, setFilter] = useState<string | 'All'>('All');

  const filtered = filter === 'All' ? resources : resources.filter(r => r.category === filter);
  const categories = ['All', ...new Set(resources.map(r => r.category))];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-purple-400">Resource Library</h2>
          <p className="text-slate-500 mt-2">Curated articles and tools for the modern student.</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === cat 
                  ? 'bg-purple-600 text-purple-400 shadow-lg shadow-purple-950/40' 
                  : 'bg-black text-slate-500 border border-zinc-800 hover:border-purple-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(res => (
          <div key={res.id} className="bg-black/50 p-8 rounded-3xl shadow-sm border border-zinc-800 hover:-translate-y-1 transition-all duration-300 group">
            <div className="text-4xl mb-6">{res.icon}</div>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">{res.category}</span>
            <h3 className="text-xl font-bold mt-4 mb-3 text-purple-400 group-hover:text-purple-400 transition-colors">{res.title}</h3>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">{res.description}</p>
            <button className="flex items-center gap-2 text-purple-400 font-bold text-sm hover:gap-3 transition-all">
              Read Guide
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-black rounded-3xl border border-dashed border-zinc-800">
          <p className="text-slate-500 font-medium">No resources found in this category yet.</p>
        </div>
      )}
    </div>
  );
};

export default ResourceHub;
