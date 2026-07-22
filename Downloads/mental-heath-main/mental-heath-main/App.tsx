
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import Assessment from './components/Assessment';
import ResourceHub from './components/ResourceHub';
import LoginPage from './components/LoginPage';
import Activities from './components/Activities';
import ProfessionalCare from './components/ProfessionalCare';
import Reviews from './components/Reviews';
import Crisis from './components/Crisis';
import Stories from './components/Stories';
import Games from './components/Games';
import Profile from './components/Profile';
import InfoPages from './components/InfoPages';
import VideoLounge from './components/VideoLounge';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('mindease_session');
    if (session) {
      setIsLoggedIn(true);
      setCurrentView('home');
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('mindease_session', 'true');
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('mindease_session');
    setIsLoggedIn(false);
    setCurrentView('login');
  };

  const renderView = () => {
    if (!isLoggedIn) return < LoginPage onLogin={handleLogin} />;

    switch (currentView) {
      case 'home':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'chat':
        return <ChatInterface />;
      case 'games':
        return <Games />;
      case 'assessment':
        return <Assessment />;
      case 'activities':
        return <Activities />;
      case 'professionalCare':
        return <ProfessionalCare />;
      case 'resources':
        return <ResourceHub />;
      case 'reviews':
        return <Reviews />;
      case 'stories':
        return <Stories />;
      case 'profile':
        return <Profile />;
      case 'videoLounge':
        return <VideoLounge />;
      case 'crisis':
        return <Crisis onStartChat={() => setCurrentView('chat')} />;
      case 'safety':
        return <InfoPages type="safety" />;
      case 'privacy':
        return <InfoPages type="privacy" />;
      case 'support':
        return <InfoPages type="support" />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-purple-600 selection:text-purple-400">
      <Header 
        currentView={currentView} 
        isLoggedIn={isLoggedIn} 
        onNavigate={setCurrentView} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1">
        {renderView()}
      </main>

      {isLoggedIn && (
        <footer className="bg-black border-t border-zinc-900 py-12 px-6 mt-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-sm">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
              <div className="w-10 h-10 bg-zinc-950 rounded-lg flex items-center justify-center p-2 border border-purple-500/20">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-purple-500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" fill="currentColor" fillOpacity="0.05" />
                  <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" className="text-fuchsia-500" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" className="text-fuchsia-400" />
                  <path d="M12 8V4" />
                  <path d="M12 20v-4" />
                  <path d="M16 12h4" />
                  <path d="M4 12h4" />
                </svg>
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="font-black text-purple-400 uppercase tracking-tighter text-base">Healthy Mindset</span>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-purple-500/50">Student Wellness</span>
              </div>
            </div>
            
            <div className="flex gap-8 font-black uppercase tracking-widest text-[10px]">
              <button onClick={() => setCurrentView('safety')} className="hover:text-purple-500 transition-colors uppercase">Safety Protocols</button>
              <button onClick={() => setCurrentView('privacy')} className="hover:text-purple-500 transition-colors uppercase">Privacy Policy</button>
              <button onClick={() => setCurrentView('support')} className="hover:text-purple-500 transition-colors uppercase">Support Center</button>
            </div>

            <p className="max-w-xs text-center md:text-right text-[10px] text-slate-600 font-bold uppercase tracking-tight">
              Healthy Mindset is an AI wellness coach. Not a medical substitute.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
