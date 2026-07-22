
import React, { useState, useRef, useEffect } from 'react';
import { WellnessVideo } from '../types';
import { generateWellnessVideo } from '../services/geminiService';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const initialVideos: WellnessVideo[] = [
  {
    id: 'mot1',
    title: 'Unstoppable: Finding Your Inner Resilience',
    category: 'Motivation',
    duration: '04:12',
    thumbnail: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'jee1',
    title: 'JEE Mastery: Cracking the Code with a Calm Mind',
    category: 'Academic Prep',
    duration: '08:15',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
  },
  {
    id: 'jee2',
    title: 'JEE Advanced: Subject-wise Focus & Time Allocation',
    category: 'Academic Prep',
    duration: '12:40',
    thumbnail: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  },
  {
    id: 'neet1',
    title: 'NEET Success Secrets: Managing Rank Pressure',
    category: 'Academic Prep',
    duration: '07:30',
    thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
  },
  {
    id: 'neet2',
    title: 'NEET Biology: Visualizing Complex Diagrams',
    category: 'Academic Prep',
    duration: '10:15',
    thumbnail: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
  },
  {
    id: 'mot2',
    title: 'The Gift of Failure: Growth Beyond Grades',
    category: 'Motivation',
    duration: '06:45',
    thumbnail: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  },
  {
    id: 'str1',
    title: 'Deep Breathing: 5-Minute Anxiety Reset',
    category: 'Stress Relief',
    duration: '05:00',
    thumbnail: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  }
];

const VideoLounge: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<WellnessVideo | null>(initialVideos[0]);
  const [filter, setFilter] = useState<'All' | 'Academic Prep' | 'Motivation' | 'Stress Relief' | 'AI Generated'>('All');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [generatedVideos, setGeneratedVideos] = useState<WellnessVideo[]>([]);
  const [showGenModal, setShowGenModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const allVideos = [...initialVideos, ...generatedVideos];
  const filteredVideos = filter === 'All' 
    ? allVideos 
    : filter === 'AI Generated' 
      ? generatedVideos 
      : allVideos.filter(v => v.category === filter);

  const handleGenerate = async () => {
    if (!generationPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      // Check for API key as required for Veo models
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
        // Proceeding as per guidelines: "assume the key selection was successful after triggering openSelectKey() and proceed to the app"
      }

      const videoUrl = await generateWellnessVideo(generationPrompt);
      const newVideo: WellnessVideo = {
        id: `ai-${Date.now()}`,
        title: `AI: ${generationPrompt.substring(0, 30)}...`,
        category: 'Motivation', // Default category for AI
        duration: '00:07', // Veo fast usually generates short clips
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
        videoUrl: videoUrl
      };
      
      setGeneratedVideos(prev => [newVideo, ...prev]);
      setSelectedVideo(newVideo);
      setFilter('AI Generated');
      setShowGenModal(false);
      setGenerationPrompt('');
    } catch (error) {
      console.error("Generation error:", error);
      alert("Failed to generate video. Please ensure you have a valid API key selected.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelect = (vid: WellnessVideo) => {
    setSelectedVideo(vid);
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (videoRef.current) {
        videoRef.current.load();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-purple-400 flex items-center gap-4">
             <div className="w-14 h-14 bg-purple-600 rounded-3xl flex items-center justify-center text-purple-400 shadow-xl shadow-purple-950/20">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
             </div>
             Wellness Lounge
          </h2>
          <p className="text-slate-400 text-lg max-w-xl font-medium">Recharge with curated high-quality video resources.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 bg-black/80 backdrop-blur-md p-2 rounded-2xl border border-zinc-800 shadow-lg">
          <button
            onClick={() => setShowGenModal(true)}
            className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-gradient-to-r from-purple-600 to-fuchsia-600 text-purple-400 shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate AI Video
          </button>
          <div className="w-px h-8 bg-slate-800 mx-1 self-center"></div>
          {(['All', 'Academic Prep', 'Motivation', 'Stress Relief', 'AI Generated'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-purple-600 text-purple-400 shadow-xl scale-105' : 'text-slate-500 hover:text-purple-400 hover:bg-zinc-900'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start">
        <div className="space-y-8 sticky top-24">
          {selectedVideo && (
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="aspect-video bg-black rounded-[3.5rem] overflow-hidden border-8 border-zinc-900 shadow-2xl relative group ring-1 ring-zinc-800">
                <video 
                  ref={videoRef}
                  key={selectedVideo.id} 
                  src={selectedVideo.videoUrl} 
                  className="w-full h-full object-cover" 
                  controls 
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  poster={selectedVideo.thumbnail}
                />
              </div>
              
              <div className="mt-8 p-12 bg-black/40 backdrop-blur-2xl rounded-[3.5rem] border border-zinc-800 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-purple-600/20 text-purple-400 font-black text-[9px] px-4 py-1.5 rounded-full uppercase tracking-widest border border-purple-500/20">{selectedVideo.category}</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black text-purple-400 tracking-tight leading-none">{selectedVideo.title}</h3>
                   </div>
                   <div className="flex-shrink-0 text-slate-500 font-black text-[10px] bg-black px-6 py-2.5 rounded-2xl border border-zinc-800 uppercase tracking-widest shadow-inner">
                      {selectedVideo.duration}
                   </div>
                </div>
                <div className="h-px w-full bg-slate-800 my-8"></div>
                <p className="text-slate-400 leading-relaxed font-medium text-lg relative z-10">
                  Recharge your motivation with this {selectedVideo.category.toLowerCase()} resource. Designed to help you maintain peak performance and mental focus.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Library Sidebar */}
        <div className="space-y-6 flex flex-col h-[calc(100vh-180px)]">
          <div className="flex items-center justify-between px-4">
            <h4 className="text-[10px] font-black uppercase text-purple-400 tracking-[0.4em]">Resource Library</h4>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{filteredVideos.length} Available</span>
          </div>
          
          <div className="space-y-4 overflow-y-auto pr-4 custom-scrollbar flex-1 pb-12">
            {filteredVideos.map((vid) => (
              <div 
                key={vid.id}
                onClick={() => handleSelect(vid)}
                className={`group cursor-pointer rounded-[2rem] overflow-hidden border transition-all duration-300 flex items-center gap-5 p-4 ${
                  selectedVideo?.id === vid.id 
                    ? 'bg-purple-600 border-purple-500 shadow-2xl scale-[1.03] z-10' 
                    : 'bg-black/60 border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-950'
                }`}
              >
                <div className="w-32 aspect-video relative flex-shrink-0 rounded-[1.25rem] overflow-hidden shadow-2xl ring-1 ring-purple-500/5">
                  <img src={vid.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={vid.title} />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-md text-purple-400 text-[8px] font-black px-2 py-0.5 rounded-lg border border-purple-500/10">
                     {vid.duration}
                  </div>
                </div>
                <div className="flex-1 pr-2">
                  <h5 className={`text-sm font-black leading-tight line-clamp-2 mb-2 ${selectedVideo?.id === vid.id ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-400'}`}>{vid.title}</h5>
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${selectedVideo?.id === vid.id ? 'text-purple-400' : 'text-slate-600'}`}>{vid.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Generation Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => !isGenerating && setShowGenModal(false)}></div>
          <div className="bg-black border border-purple-500/20 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-purple-400 mb-2">AI Video Generator</h3>
            <p className="text-slate-400 text-sm mb-6 font-medium">Describe the calming scene you want to visualize. Our AI will craft a unique wellness video for you.</p>
            
            <textarea
              value={generationPrompt}
              onChange={(e) => setGenerationPrompt(e.target.value)}
              placeholder="e.g., A peaceful forest with sunlight filtering through leaves and a gentle stream..."
              className="w-full bg-black border-2 border-zinc-800 rounded-2xl p-4 text-purple-400 placeholder:text-slate-700 focus:border-purple-500 transition-all outline-none h-32 mb-6 text-sm font-medium"
              disabled={isGenerating}
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowGenModal(false)}
                disabled={isGenerating}
                className="flex-1 py-4 rounded-2xl bg-zinc-900 text-slate-400 font-black uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !generationPrompt.trim()}
                className="flex-[2] py-4 rounded-2xl bg-purple-600 text-purple-400 font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-950/40 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <span className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Create Video
                  </>
                )}
              </button>
            </div>

            {isGenerating && (
              <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                <p className="text-purple-400 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                  Crafting your cinematic experience... this may take a minute.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLounge;
