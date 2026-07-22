
import React, { useState, useEffect, useRef } from 'react';
import { findMentalHealthPlaces } from '../services/geminiService';
import { MedicalPlace, SupportGroup, Message } from '../types';

const featuredSpecialists: MedicalPlace[] = [
  {
    title: "Dr. Alok Sarin",
    specialty: "Senior Consultant Psychiatrist",
    experience: "30+ Years",
    address: "Sitaram Bhartia Institute, Qutub Institutional Area, New Delhi",
    phone: "+91 11 4211 1111",
    rating: 4.9,
    uri: "https://www.google.com/maps/search/Dr.+Alok+Sarin+Psychiatrist"
  },
  {
    title: "Dr. Achal Bhagat",
    specialty: "Senior Psychiatrist & Psychotherapist",
    experience: "28+ Years",
    address: "Apollo Hospitals, Sarita Vihar, New Delhi",
    phone: "+91 11 2692 5858",
    rating: 4.8,
    uri: "https://www.google.com/maps/search/Dr.+Achal+Bhagat"
  }
];

const featuredCounselors: MedicalPlace[] = [
  {
    title: "Ananya Kapoor",
    specialty: "Student Wellness Counselor",
    experience: "8 Years",
    address: "Online / South Delhi Wellness Hub",
    phone: "+91 98100 12345",
    rating: 4.7,
    uri: "https://www.google.com/maps/search/Student+Counselors+New+Delhi"
  },
  {
    title: "Rahul Verma",
    specialty: "Academic Stress Specialist",
    experience: "12 Years",
    address: "MindCare Center, Koramangala, Bangalore",
    phone: "+91 99000 54321",
    rating: 4.8,
    uri: "https://www.google.com/maps/search/Counselors+Bangalore"
  }
];

const mockSupportGroups: SupportGroup[] = [
  {
    id: 'g1',
    title: "JEE/NEET Warriors",
    description: "A space for competitive exam aspirants to share tips, vent about mock tests, and support each other's mental health.",
    members: 1240,
    nextSession: "Today at 8:00 PM",
    category: "Exam Stress",
    icon: "🔥"
  },
  {
    id: 'g2',
    title: "Night Owl Study Circle",
    description: "For those who study late and feel the isolation. Focus on maintaining a healthy sleep-study balance.",
    members: 850,
    nextSession: "Tomorrow at 10:00 PM",
    category: "Routine",
    icon: "🦉"
  },
  {
    id: 'g3',
    title: "Introvert Oasis",
    description: "Navigating campus social life as an introvert. Discussing boundaries and meaningful connections.",
    members: 620,
    nextSession: "Saturday at 5:00 PM",
    category: "Social",
    icon: "🌵"
  },
  {
    id: 'g4',
    title: "Beyond the Ranks",
    description: "Focusing on self-worth outside of academic achievements and grades. Rebuilding identity.",
    members: 410,
    nextSession: "Sunday at 11:00 AM",
    category: "Self-Worth",
    icon: "🌱"
  }
];

const ProfessionalCare: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'specialists' | 'counselors' | 'groups'>('counselors');
  const [query, setQuery] = useState('Best Counselors for Students');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ text: string, places: MedicalPlace[] } | null>(null);
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | undefined>();
  const [consultingProf, setConsultingProf] = useState<MedicalPlace | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<SupportGroup | null>(null);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [activeChat, setActiveChat] = useState<{ type: 'professional' | 'group', data: MedicalPlace | SupportGroup } | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedGroups = localStorage.getItem('mindease_joined_groups');
    if (savedGroups) {
      setJoinedGroupIds(JSON.parse(savedGroups));
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => console.log("Location access denied")
      );
    }
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const data = await findMentalHealthPlaces(query, location);
      setResults(data);
    } catch (error) {
      console.error(error);
      alert("Error finding local help. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const startChat = (type: 'professional' | 'group', data: MedicalPlace | SupportGroup) => {
    setActiveChat({ type, data });
    setConsultingProf(null);
    setSelectedGroup(null);
    
    const initialMessage: Message = {
      id: 'init',
      role: 'assistant',
      text: type === 'professional' 
        ? `Hello! This is a secure channel to reach out to ${data.title}. How can we assist you today?`
        : `Welcome to the ${data.title} community room. Respect others and share freely.`,
      timestamp: new Date()
    };
    setChatMessages([initialMessage]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: activeChat?.type === 'professional' 
          ? `Thank you for your message. ${activeChat.data.title} typically responds within 2 hours. Is this an emergency?`
          : "Your message has been shared with the group members. Someone will reply soon!",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const confirmBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSuccess(true);
      
      if (selectedGroup) {
        const updatedIds = [...new Set([...joinedGroupIds, selectedGroup.id])];
        setJoinedGroupIds(updatedIds);
        localStorage.setItem('mindease_joined_groups', JSON.stringify(updatedIds));
      }

      setTimeout(() => {
        setConsultingProf(null);
        setSelectedGroup(null);
        setBookingSuccess(false);
      }, 2000);
    }, 1500);
  };

  const handleLeaveGroup = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedIds = joinedGroupIds.filter(gid => gid !== id);
    setJoinedGroupIds(updatedIds);
    localStorage.setItem('mindease_joined_groups', JSON.stringify(updatedIds));
  };

  const categories = [
    { name: 'Counselors', icon: '🗣️' },
    { name: 'Psychiatrists', icon: '👨‍⚕️' },
    { name: 'Support Groups', icon: '🤝' }
  ];

  const joinedGroups = mockSupportGroups.filter(g => joinedGroupIds.includes(g.id));
  const availableGroups = mockSupportGroups.filter(g => !joinedGroupIds.includes(g.id));

  if (activeChat) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-160px)] flex flex-col">
        <div className="bg-black rounded-t-[2.5rem] p-6 border-b border-zinc-800 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveChat(null)} className="p-2 hover:bg-zinc-900 rounded-xl transition-colors">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div>
              <h3 className="text-xl font-black text-purple-400 leading-none mb-1">{activeChat.data.title}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                {activeChat.type === 'professional' ? 'Verified Practitioner' : 'Active Community'}
              </p>
            </div>
          </div>
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 border border-purple-500/20">
             {activeChat.type === 'professional' ? '💬' : '🫂'}
          </div>
        </div>
        
        <div 
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto bg-black p-6 space-y-4"
        >
          {chatMessages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm shadow-sm ${m.role === 'user' ? 'bg-purple-600 text-purple-400 rounded-tr-none' : 'bg-zinc-900 text-slate-400 rounded-tl-none border border-zinc-800'}`}>
                {m.text}
                <div className={`text-[8px] mt-1 font-bold ${m.role === 'user' ? 'text-purple-400 text-right' : 'text-slate-500'}`}>
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-black p-6 rounded-b-[2.5rem] shadow-xl border-t border-zinc-800">
          <form onSubmit={handleSendMessage} className="flex gap-4">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-zinc-900 border-2 border-zinc-800 rounded-2xl px-5 py-3 outline-none focus:border-purple-500 text-purple-400 placeholder:text-slate-500"
            />
            <button 
              type="submit"
              className="bg-purple-600 text-purple-400 p-3 px-6 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-purple-950/40 active:scale-95 transition-transform"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 relative">
      {(consultingProf || selectedGroup) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-black w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden border border-zinc-800">
            {bookingSuccess ? (
              <div className="text-center space-y-4 py-10 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h3 className="text-2xl font-black text-purple-400">{selectedGroup ? 'Joined Group!' : 'Request Sent!'}</h3>
                <p className="text-slate-400">
                  {selectedGroup 
                    ? `You've been added to ${selectedGroup.title}. You can now start chatting.` 
                    : `The team will contact you shortly to confirm your priority session with ${consultingProf?.title}.`}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black text-purple-400">{selectedGroup ? 'Join Group' : 'Consult Practitioner'}</h3>
                    <p className="text-purple-400 font-bold text-sm">{selectedGroup ? selectedGroup.title : `Connect with ${consultingProf?.title}`}</p>
                  </div>
                  <button onClick={() => { setConsultingProf(null); setSelectedGroup(null); }} className="text-slate-500 hover:text-slate-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">Choose how you want to proceed. MindEase ensures complete privacy for all student interactions.</p>
                
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    onClick={() => startChat(selectedGroup ? 'group' : 'professional', (selectedGroup || consultingProf)!)}
                    className="bg-purple-500/10 text-purple-400 p-6 rounded-3xl border border-purple-500/20 flex flex-col items-center gap-3 hover:bg-purple-600 hover:text-purple-400 transition-all group"
                   >
                     <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
                     <span className="text-[10px] font-black uppercase tracking-widest">Instant Chat</span>
                   </button>
                   <button 
                    onClick={confirmBooking}
                    className="bg-purple-600 text-purple-400 p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-purple-700 transition-all group"
                   >
                     <span className="text-2xl group-hover:scale-110 transition-transform">📅</span>
                     <span className="text-[10px] font-black uppercase tracking-widest">Book Session</span>
                   </button>
                </div>

                {!selectedGroup && (
                  <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                    <p className="text-[10px] text-slate-500 font-bold leading-tight">Instant chat allows you to message directly. Booked sessions are 45-minute video/voice consultations.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-black rounded-[2.5rem] p-8 md:p-12 border border-purple-500/10 mb-12 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-4 relative">
          <h2 className="text-4xl font-black text-purple-400 tracking-tight text-center">Student Support Network</h2>
          <p className="text-slate-400 text-lg font-medium">Connect with verified professionals or join peer support groups.</p>
        </div>

        <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto mb-8">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e.g. 'Student counseling in Delhi'..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl pl-6 pr-32 py-5 focus:border-purple-500/50 focus:bg-zinc-900/80 outline-none transition-all text-slate-400 text-lg placeholder:text-slate-600 shadow-sm"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-3 top-3 bottom-3 bg-purple-600 text-purple-400 px-8 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-purple-700 transition-all disabled:opacity-50 shadow-lg shadow-purple-950/40"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => { setQuery(cat.name); handleSearch(); }}
              className={`bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all flex items-center gap-2 hover:bg-purple-500/10 hover:text-purple-400 shadow-sm`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {!results && (
        <div className="space-y-8 animate-in fade-in duration-700">
           <div className="flex flex-col md:flex-row items-center justify-between mb-8 px-4 gap-6">
              <h3 className="text-2xl font-black text-purple-400 flex items-center gap-3">
                <span className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/20">✨</span>
                Explore Options
              </h3>
              
              <div className="bg-black p-1.5 rounded-2xl flex border border-zinc-800">
                <button 
                  onClick={() => setActiveTab('counselors')}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'counselors' ? 'bg-purple-600 shadow-md text-purple-400' : 'text-slate-500 hover:text-slate-400'}`}
                >
                  Counselors
                </button>
                <button 
                  onClick={() => setActiveTab('specialists')}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'specialists' ? 'bg-purple-600 shadow-md text-purple-400' : 'text-slate-500 hover:text-slate-400'}`}
                >
                  Specialists
                </button>
                <button 
                  onClick={() => setActiveTab('groups')}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'groups' ? 'bg-purple-600 shadow-md text-purple-400' : 'text-slate-500 hover:text-slate-400'}`}
                >
                  Groups
                </button>
              </div>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeTab === 'groups' ? (
                <>
                  {joinedGroups.length > 0 && (
                    <div className="col-span-full space-y-4 mb-4">
                       <h4 className="text-[10px] font-black uppercase text-purple-400 tracking-[0.3em] px-4">My Communities</h4>
                       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {joinedGroups.map((group) => (
                            <div key={group.id} className="bg-black p-8 rounded-[2.5rem] shadow-xl border border-zinc-800 transition-all group flex flex-col justify-between text-purple-400 relative overflow-hidden">
                              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl"></div>
                              <div>
                                <div className="flex justify-between items-start mb-6">
                                  <div className="text-4xl bg-purple-500/10 w-16 h-16 rounded-2xl flex items-center justify-center border border-purple-500/20">
                                    {group.icon}
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest bg-purple-500 text-purple-950 px-3 py-1 rounded-full flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-purple-950 rounded-full animate-pulse"></span>
                                    Active Member
                                  </span>
                                </div>
                                <h4 className="text-xl font-bold mb-2">{group.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">{group.description}</p>
                                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 mb-6">
                                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-1">Upcoming Session</span>
                                  <span className="text-xs font-bold text-purple-400">{group.nextSession}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => startChat('group', group)}
                                  className="flex-1 bg-purple-600 text-purple-400 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-950/30"
                                >
                                  Enter Room
                                </button>
                                <button 
                                  onClick={(e) => handleLeaveGroup(group.id, e)}
                                  className="px-4 bg-zinc-800 hover:bg-purple-900 transition-all rounded-xl text-purple-400 group/leave border border-zinc-800"
                                  title="Leave Group"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                </button>
                              </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}
                  
                  {availableGroups.length > 0 && (
                    <div className="col-span-full space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] px-4">Discover More</h4>
                       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {availableGroups.map((group) => (
                            <div key={group.id} className="bg-black/50 p-8 rounded-[2.5rem] border border-zinc-800 shadow-sm hover:shadow-xl hover:border-purple-500/30 transition-all group flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start mb-6">
                                  <div className="text-4xl bg-zinc-800 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform border border-zinc-800">
                                    {group.icon}
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                                    {group.members} Members
                                  </span>
                                </div>
                                <h4 className="text-xl font-bold text-purple-400 mb-2">{group.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">{group.description}</p>
                                <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800 mb-6">
                                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-1">Next Session</span>
                                  <span className="text-xs font-bold text-purple-400">{group.nextSession}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => setSelectedGroup(group)}
                                className="w-full border-2 border-purple-600 text-purple-400 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-purple-400 transition-all active:scale-95"
                              >
                                Join Community
                              </button>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}
                </>
              ) : (
                (activeTab === 'counselors' ? featuredCounselors : featuredSpecialists).map((prof, idx) => (
                  <div key={idx} className="bg-black/50 p-8 rounded-[2.5rem] border border-zinc-800 shadow-sm hover:shadow-xl hover:border-purple-500/30 transition-all group relative flex flex-col justify-between">
                    <div>
                      <div className="absolute top-6 right-6">
                          <span className="bg-purple-500/10 text-purple-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-purple-500/20">
                            {prof.experience} Exp
                          </span>
                      </div>
                      <div className="w-14 h-14 bg-zinc-800 text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-purple-400 transition-all duration-500 border border-zinc-800">
                          {activeTab === 'counselors' ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                          ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          )}
                      </div>
                      <h4 className="text-xl font-bold text-purple-400 mb-1">{prof.title}</h4>
                      <p className="text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{prof.specialty}</p>
                      <p className="text-slate-500 text-xs mb-8">{prof.address}</p>
                    </div>
                    <div className="flex gap-3">
                        <a href={prof.uri} target="_blank" rel="noopener noreferrer" className="flex-1 bg-zinc-800 text-purple-400 text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md flex items-center justify-center border border-zinc-800">Map</a>
                        <button onClick={() => setConsultingProf(prof)} className="flex-1 border border-purple-600 text-purple-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-purple-400 transition-all flex items-center justify-center">Connect</button>
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>
      )}

      {results && (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="bg-purple-500/5 border border-purple-500/20 p-8 rounded-[2rem]">
            <h3 className="text-xl font-black text-purple-400 mb-3 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Search Results
            </h3>
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap text-sm">{results.text}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.places.map((place, idx) => (
              <div key={idx} className="bg-black p-6 rounded-[2rem] border border-zinc-800 shadow-sm hover:shadow-xl hover:border-purple-500/30 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center mb-4 border border-purple-500/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  </div>
                  <h4 className="text-xl font-bold text-purple-400 mb-2">{place.title}</h4>
                </div>
                <div className="mt-4 flex gap-2">
                  <a href={place.uri} target="_blank" rel="noopener noreferrer" className="flex-1 bg-zinc-800 text-purple-400 text-center py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center border border-zinc-800">Directions</a>
                  <button onClick={() => setConsultingProf(place)} className="flex-1 border border-zinc-800 text-slate-400 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center">Consult</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalCare;
