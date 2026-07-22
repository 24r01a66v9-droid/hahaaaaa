
import React, { useState, useMemo } from 'react';
import { StudentStory, StoryReply } from '../types';

const initialStories: StudentStory[] = [
  {
    id: 's1',
    name: 'Karan Mehra',
    title: 'How I defeated the 4 AM Mock Test Panic',
    content: "I used to wake up at 4 AM sweating because of JEE Mains. The pressure was unreal. I started using MindEase's '60-second calm' breathing pacer every time the panic set in. It took about 2 weeks, but now I can actually focus on the problems instead of my heartbeat.",
    tags: ['JEE Mains', 'Anxiety'],
    date: 'March 15, 2024',
    likes: 245,
    replies: [
      { id: 'r1', author: 'Sameer', content: 'This helped me too! Stay strong.', date: 'March 16, 2024' }
    ]
  },
  {
    id: 's2',
    name: 'Ishita S.',
    title: 'Finding Joy in Campus Gardening',
    content: "NEET prep made me a recluse. I hadn't seen the sun in weeks. The Zen Zone suggested 'Campus Gardening'. I planted three succulents in the dorm balcony. It sounds small, but watching them grow gave me something to look forward to other than biology notes.",
    tags: ['NEET', 'Burnout'],
    date: 'April 02, 2024',
    likes: 189,
    replies: []
  },
  {
    id: 's3',
    name: 'Vikram Singh',
    title: 'The Power of Anonymous Venting',
    content: "My parents expect a top 100 rank. I couldn't tell them I was struggling. MindBuddy AI became the only place I could be weak. After venting for 30 minutes, I felt 10kg lighter and could actually finish my physics module.",
    tags: ['Academic Pressure', 'Anonymous Support'],
    date: 'April 10, 2024',
    likes: 412,
    replies: []
  }
];

const Stories: React.FC = () => {
  const [stories, setStories] = useState<StudentStory[]>(initialStories);
  const [showForm, setShowForm] = useState(false);
  const [newStory, setNewStory] = useState({ title: '', content: '' });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStories = useMemo(() => {
    if (!searchQuery.trim()) return stories;
    const lower = searchQuery.toLowerCase();
    return stories.filter(s => 
      s.title.toLowerCase().includes(lower) || 
      s.content.toLowerCase().includes(lower) || 
      s.tags.some(t => t.toLowerCase().includes(lower))
    );
  }, [stories, searchQuery]);

  const handleLike = (id: string) => {
    setStories(prev => prev.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s));
  };

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStory.title || !newStory.content) return;
    const s: StudentStory = {
      id: Date.now().toString(),
      name: 'Anonymous Student',
      title: newStory.title,
      content: newStory.content,
      tags: ['Community Share'],
      date: 'Just now',
      likes: 0,
      replies: []
    };
    setStories([s, ...stories]);
    setNewStory({ title: '', content: '' });
    setShowForm(false);
  };

  const handlePostReply = (storyId: string) => {
    if (!replyContent.trim()) return;
    const newReply: StoryReply = {
      id: Date.now().toString(),
      author: 'You',
      content: replyContent,
      date: 'Just now'
    };
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, replies: [...(s.replies || []), newReply] } : s));
    setReplyContent('');
    setReplyingTo(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-purple-400 tracking-tight">Student Stories</h2>
          <p className="text-slate-400 mt-2 font-medium">Personal accounts of overcoming the student struggle.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-purple-400 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-purple-700 transition-all shadow-xl shadow-purple-950/40 whitespace-nowrap active:scale-95"
        >
          {showForm ? 'Close Form' : 'Share Your Story'}
        </button>
      </div>

      <div className="relative group">
        <input 
          type="text" 
          placeholder="Search stories by topic, tag, or text..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border-2 border-slate-800 rounded-[2rem] px-12 py-5 focus:border-purple-500/50 outline-none transition-all text-purple-400 shadow-sm placeholder:text-slate-600"
        />
        <svg className="w-6 h-6 text-slate-700 absolute left-4 top-5 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-4 top-5 text-slate-700 hover:text-purple-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmitStory} className="bg-slate-900 p-8 rounded-[2.5rem] border-2 border-purple-500/10 shadow-2xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 backdrop-blur-xl">
           <h3 className="text-xl font-black text-purple-400">What's your triumph?</h3>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Story Title</label>
              <input 
                type="text" 
                value={newStory.title}
                onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 text-purple-400" 
                placeholder="e.g. My first week of deep focus" 
              />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Detailed Story</label>
              <textarea 
                value={newStory.content}
                onChange={(e) => setNewStory({...newStory, content: e.target.value})}
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 h-40 resize-none text-purple-400" 
                placeholder="What happened? What helped you?"
              />
           </div>
           <button type="submit" className="w-full bg-purple-600 text-purple-400 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-purple-950/40 hover:bg-purple-700 transition-all active:scale-[0.98]">Post Story Anonymously</button>
        </form>
      )}

      <div className="space-y-8">
        {filteredStories.length > 0 ? filteredStories.map(s => (
          <div key={s.id} className="bg-slate-900/50 p-10 rounded-[3rem] shadow-sm border border-slate-800 hover:border-purple-500/30 transition-all group backdrop-blur-xl">
            <div className="flex justify-between items-start mb-6">
               <div className="space-y-1">
                 <h3 className="text-2xl font-black text-purple-400 leading-tight group-hover:text-purple-400 transition-colors">{s.title}</h3>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.name} • {s.date}</span>
               </div>
               <div className="flex flex-wrap gap-2">
                  {s.tags.map(t => (
                    <span key={t} className="bg-purple-500/10 text-purple-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-purple-500/20">{t}</span>
                  ))}
               </div>
            </div>
            <p className="text-slate-400 leading-relaxed mb-8 text-lg font-medium whitespace-pre-wrap">"{s.content}"</p>
            
            {(s.replies && s.replies.length > 0) && (
              <div className="mb-8 space-y-4 ml-6 border-l-2 border-slate-800 pl-6">
                {s.replies.map(r => (
                  <div key={r.id} className="bg-slate-950/50 p-4 rounded-2xl relative border border-slate-800/50">
                    <p className="text-sm text-slate-400 font-medium">{r.content}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{r.author}</span>
                      <span className="text-[9px] text-slate-600 font-bold uppercase">{r.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {replyingTo === s.id && (
              <div className="mb-8 ml-6 animate-in fade-in slide-in-from-top-2">
                <textarea 
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a supportive reply..."
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-purple-500 h-24 resize-none text-purple-400"
                />
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => handlePostReply(s.id)}
                    className="bg-purple-600 text-purple-400 px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md hover:bg-purple-700 active:scale-95"
                  >
                    Post Reply
                  </button>
                  <button 
                    onClick={() => {setReplyingTo(null); setReplyContent('');}}
                    className="text-slate-500 px-6 py-2 text-[9px] font-black uppercase tracking-widest hover:text-purple-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-6 border-t border-slate-800 pt-6">
               <button 
                onClick={() => handleLike(s.id)}
                className="flex items-center gap-2 text-purple-400 font-black text-xs uppercase tracking-widest hover:scale-110 transition-transform"
               >
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/></svg>
                 {s.likes} Inspiring
               </button>
               <button 
                onClick={() => setReplyingTo(replyingTo === s.id ? null : s.id)}
                className="text-slate-500 font-black text-xs uppercase tracking-widest hover:text-purple-400 transition-colors flex items-center gap-2"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                 Reply
               </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-800">
             <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No stories found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
