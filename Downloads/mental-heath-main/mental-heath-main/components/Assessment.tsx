
import React, { useState } from 'react';
import { runAssessment } from '../services/geminiService';
import { AssessmentResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Assessment: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const data = await runAssessment(userInput);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = result ? [{ name: 'Wellness', score: result.score }] : [];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {!result ? (
        <div className="space-y-8 bg-slate-900/50 p-10 rounded-[2.5rem] shadow-xl border border-purple-500/10 backdrop-blur-xl">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-purple-400">Personal Well-being Pulse</h2>
            <p className="text-slate-400">How have you been navigating student life lately? Be as honest as you like; this space is private.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <textarea
              className="w-full h-40 p-6 rounded-3xl bg-slate-950 border-2 border-slate-800 focus:border-purple-500 outline-none transition-all resize-none text-lg text-purple-400 placeholder:text-slate-600"
              placeholder="e.g., I'm feeling quite burnt out. The workload is heavy and I haven't been social lately..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            
            <button
              type="submit"
              disabled={!userInput.trim() || isSubmitting}
              className="w-full bg-purple-600 text-purple-400 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-950/40 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
            >
              {isSubmitting ? 'Analyzing...' : 'Generate My Wellness Plan'}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800 text-center">
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-6">Current Resilience</h3>
              <div className="h-32 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" hide />
                    <Bar dataKey="score" radius={[0, 10, 10, 0]} barSize={40}>
                       <Cell fill={result.score > 70 ? '#a855f7' : result.score > 40 ? '#9333ea' : '#7e22ce'} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-6xl font-black text-purple-500">{result.score}%</p>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800 flex flex-col justify-center">
              <h3 className="text-xl font-black text-purple-400 mb-2">Internal State</h3>
              <p className="text-slate-400 italic font-medium">"{result.sentiment}"</p>
            </div>
          </div>

          <div className="bg-purple-600 p-10 rounded-[2.5rem] text-purple-400 space-y-4 shadow-2xl shadow-purple-950/40 border border-purple-500/20">
             <h3 className="text-2xl font-black">Your Suggested Path</h3>
             <p className="text-purple-400 font-medium text-lg leading-relaxed">{result.plan}</p>
             <div className="pt-4 grid md:grid-cols-2 gap-4">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="bg-purple-500/10 backdrop-blur-sm p-4 rounded-2xl border border-purple-500/20 flex gap-3">
                    <span className="font-black text-purple-400">0{i+1}</span>
                    <span className="text-sm font-bold">{rec}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={() => setResult(null)}
              className="text-purple-400 font-black uppercase tracking-widest text-[10px] hover:text-purple-400 transition-colors"
            >
              Start New Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessment;
