
import React, { useState, useEffect, useRef } from 'react';
import { ViewState, UserProfile } from '../types';

interface HeaderProps {
  currentView: ViewState;
  isLoggedIn: boolean;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, isLoggedIn, onNavigate, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoggedIn) {
      const saved = localStorage.getItem('mindease_profile');
      if (saved) setUserProfile(JSON.parse(saved));
    }
  }, [isLoggedIn, currentView]);

  const navItems: { label: string; view: ViewState }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Buddy', view: 'chat' },
    { label: 'Videos', view: 'videoLounge' },
    { label: 'Games', view: 'games' },
    { label: 'Stories', view: 'stories' },
    { label: 'Care', view: 'professionalCare' },
    { label: 'Zen', view: 'activities' },
  ];

  const searchable = [
    { title: 'Wellness Videos', view: 'videoLounge' as ViewState },
    { title: 'Exam Anxiety Tips', view: 'resources' as ViewState },
    { title: 'Anonymous Venting', view: 'chat' as ViewState },
    { title: 'Success Stories', view: 'stories' as ViewState },
    { title: 'Yoga for Focus', view: 'activities' as ViewState },
    { title: 'Book a Doctor', view: 'professionalCare' as ViewState },
    { title: 'Stress Relief Games', view: 'games' as ViewState },
    { title: 'User Reviews', view: 'reviews' as ViewState },
    { title: 'My Profile', view: 'profile' as ViewState },
  ];

  const results = searchQuery.length > 1 
    ? searchable.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isLoggedIn) return null;

  return (
    <header className="sticky top-0 z-50 glass border-b border-purple-500/20 px-4 md:px-6 py-4 flex justify-between items-center gap-6">
      <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => onNavigate('home')}>
        <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-purple-950/20 group hover:scale-105 transition-transform overflow-hidden p-2 border border-purple-500/30">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-purple-500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" fill="currentColor" fillOpacity="0.05" />
            <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" className="text-fuchsia-500" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" className="text-fuchsia-400" />
            <path d="M12 8V4" />
            <path d="M12 20v-4" />
            <path d="M16 12h4" />
            <path d="M4 12h4" />
            <path d="m15 9 2-2" />
            <path d="m7 17 2-2" />
            <path d="m15 15 2 2" />
            <path d="m7 7 2 2" />
          </svg>
        </div>
        <div className="flex flex-col -space-y-1 hidden lg:block">
          <h1 className="text-lg font-black tracking-tighter bg-gradient-to-r from-purple-500 to-fuchsia-400 bg-clip-text text-transparent uppercase">Healthy Mindset</h1>
          <span className="text-[7px] font-black uppercase tracking-[0.4em] text-purple-500/50">Student Wellness</span>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <nav className="hidden xl:flex items-center gap-5">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`font-black transition-all text-[10px] uppercase tracking-[0.15em] whitespace-nowrap py-2 ${
                currentView === item.view ? 'text-purple-400 border-b-2 border-purple-500' : 'text-slate-400 hover:text-purple-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="relative hidden md:block" ref={searchRef}>
          <div className="flex items-center bg-black/50 border border-zinc-800/50 rounded-2xl px-4 py-2 group focus-within:bg-zinc-900 focus-within:border-purple-500/50 transition-all">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onFocus={() => setShowResults(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-medium px-3 w-24 lg:w-32 text-purple-400"
            />
          </div>
          
          {showResults && results.length > 0 && (
            <div className="absolute top-full mt-2 right-0 w-64 bg-black border border-zinc-800 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2">
              {results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => { onNavigate(r.view); setShowResults(false); setSearchQuery(''); }}
                  className="w-full text-left px-4 py-3 hover:bg-zinc-900 rounded-xl transition-colors flex items-center justify-between group"
                >
                  <span className="text-xs font-bold text-slate-400 group-hover:text-purple-500">{r.title}</span>
                  <svg className="w-3 h-3 text-slate-600 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-xl overflow-hidden border-2 border-zinc-800 hover:border-purple-500/50 transition-all shadow-lg active:scale-95"
          >
            <img src={userProfile?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="Profile" className="w-full h-full object-cover" />
          </button>
          <button 
            onClick={onLogout}
            className="w-10 h-10 flex items-center justify-center bg-black/50 border border-zinc-800/50 rounded-xl text-slate-500 hover:text-purple-500 hover:border-purple-500/30 transition-all active:scale-95"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
