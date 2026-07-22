
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

const AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
];

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Student Name',
    email: 'student@university.edu',
    avatar: AVATARS[0],
    bio: 'Determined to achieve my dreams while staying mentally healthy.',
    joinedDate: new Date().toLocaleDateString(),
    goal: 'Crush Exams 2024'
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mindease_profile');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    localStorage.setItem('mindease_profile', JSON.stringify(profile));
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-800">
        <div className="h-48 bg-gradient-to-r from-purple-600 to-fuchsia-600 relative">
          <div className="absolute -bottom-12 left-12 w-32 h-32 rounded-3xl border-8 border-slate-900 overflow-hidden bg-slate-800 shadow-xl">
            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
        
        <div className="pt-20 px-12 pb-12 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-black text-purple-400">{profile.name}</h2>
              <p className="text-slate-500 font-medium">{profile.email}</p>
            </div>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="bg-purple-600 text-purple-400 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-purple-700 transition-all shadow-lg shadow-purple-950/40"
            >
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 text-purple-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Goal</label>
                  <input 
                    type="text" 
                    value={profile.goal}
                    onChange={(e) => setProfile({...profile, goal: e.target.value})}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 text-purple-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Bio</label>
                <textarea 
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 h-32 resize-none text-purple-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Choose Avatar</label>
                <div className="flex flex-wrap gap-4">
                  {AVATARS.map(url => (
                    <button 
                      key={url}
                      onClick={() => setProfile({...profile, avatar: url})}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-4 transition-all ${profile.avatar === url ? 'border-purple-500' : 'border-transparent'}`}
                    >
                      <img src={url} alt="Option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Bio</h4>
                  <p className="text-slate-400 leading-relaxed italic">"{profile.bio}"</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Member Since</h4>
                  <p className="text-slate-400 font-bold">{profile.joinedDate}</p>
                </div>
              </div>
              <div className="bg-purple-500/5 p-8 rounded-[2rem] border border-purple-500/10 flex flex-col justify-center text-center">
                 <h4 className="text-[10px] font-black uppercase text-purple-400/60 tracking-widest mb-2">Current Mission</h4>
                 <p className="text-2xl font-black text-purple-400">{profile.goal}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
