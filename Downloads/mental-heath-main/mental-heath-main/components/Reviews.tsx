
import React, { useState } from 'react';
import { UserReview } from '../types';

const initialReviews: UserReview[] = [
  {
    id: 'r1',
    userName: 'Aryan K.',
    rating: 5,
    comment: 'MindBuddy literally saved my sanity during the week leading up to NEET. Just having someone to talk to at 3 AM made the difference.',
    date: '2 days ago',
    tag: 'NEET Aspirant'
  }
];

const Reviews: React.FC = () => {
  const [reviews, setStories] = useState<UserReview[]>(initialReviews);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    const r: UserReview = {
      id: Date.now().toString(),
      userName: 'You',
      rating,
      comment: newReview,
      date: 'Just now',
      tag: 'Student'
    };
    setStories([r, ...reviews]);
    setNewReview('');
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl font-black text-purple-400 tracking-tight">Community Voices</h2>
        <p className="text-slate-400 text-lg">Real stories from students who found their calm with Healthy Mindset.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-black/50 p-8 rounded-[2rem] border border-purple-500/10 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-black text-purple-400">{rev.userName}</h4>
                  <span className="text-[10px] uppercase font-bold text-purple-400 tracking-widest">{rev.tag}</span>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < rev.rating ? 'text-purple-400' : 'text-slate-700'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed italic">"{rev.comment}"</p>
              <span className="text-[10px] text-slate-500 mt-4 block">{rev.date}</span>
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <form onSubmit={handleSubmit} className="bg-black rounded-[2.5rem] p-8 text-purple-400 space-y-6 shadow-2xl border border-purple-500/10">
            <h3 className="text-xl font-bold">Share Your Experience</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Rating</label>
              <div className="flex gap-2">
                 {[1,2,3,4,5].map(num => (
                   <button 
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${rating === num ? 'bg-purple-600 text-purple-400' : 'bg-zinc-900 text-slate-500 hover:bg-zinc-800 border border-zinc-800'}`}
                   >
                     {num}
                   </button>
                 ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Review</label>
              <textarea 
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-4 text-purple-400 outline-none focus:border-purple-500 h-32 resize-none transition-all"
                placeholder="How did Healthy Mindset help you today?"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-purple-400 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-purple-950/40"
            >
              Post Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
