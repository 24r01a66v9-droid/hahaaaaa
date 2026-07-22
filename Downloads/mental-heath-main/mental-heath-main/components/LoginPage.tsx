
import React, { useState, useEffect } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

interface StoredUser {
  email: string;
  password: string;
  name: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error when switching modes
  useEffect(() => {
    setError(null);
  }, [mode]);

  const getUsers = (): StoredUser[] => {
    const users = localStorage.getItem('mindease_registered_users');
    return users ? JSON.parse(users) : [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    const users = getUsers();

    setTimeout(() => {
      if (mode === 'signup') {
        // Validation for Sign Up
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setIsLoading(false);
          return;
        }

        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
          setError("This email is already registered.");
          setIsLoading(false);
          return;
        }

        // Register User
        const newUser: StoredUser = { email, password, name };
        const updatedUsers = [...users, newUser];
        localStorage.setItem('mindease_registered_users', JSON.stringify(updatedUsers));

        // Create Profile
        const defaultProfile = {
          name: name || 'Student User',
          email: email,
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + Math.random(),
          bio: 'Starting my wellness journey.',
          joinedDate: new Date().toLocaleDateString(),
          goal: 'Stay Balanced'
        };
        localStorage.setItem('mindease_profile', JSON.stringify(defaultProfile));
        
        onLogin();
      } else {
        // Validation for Sign In
        const user = users.find(u => 
          u.email.toLowerCase() === email.toLowerCase() && 
          u.password === password
        );

        if (!user) {
          setError("Invalid email or password. Please try again.");
          setIsLoading(false);
          return;
        }

        // Set active profile based on found user
        const savedProfile = localStorage.getItem('mindease_profile');
        if (!savedProfile || JSON.parse(savedProfile).email !== user.email) {
          const defaultProfile = {
            name: user.name,
            email: user.email,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name,
            bio: 'Continuing my wellness journey.',
            joinedDate: new Date().toLocaleDateString(),
            goal: 'Maintain Balance'
          };
          localStorage.setItem('mindease_profile', JSON.stringify(defaultProfile));
        }

        onLogin();
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black/20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/5 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full bg-black/90 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-purple-500/10 space-y-8 animate-in fade-in zoom-in duration-500 relative">
        
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-black rounded-[2rem] flex items-center justify-center shadow-2xl shadow-purple-950/20 mx-auto mb-4 p-4 border border-purple-500/20 group hover:scale-105 transition-transform">
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
          <h2 className="text-3xl font-black text-purple-400 tracking-tight">
            {mode === 'signin' ? 'Welcome Back' : 'Join Healthy Mindset'}
          </h2>
          <p className="text-slate-500 font-medium text-sm">
            {mode === 'signin' 
              ? 'Login with your registered credentials.' 
              : 'Create your anonymous account to gain access.'}
          </p>
        </div>

        {mode === 'signin' && (
          <div className="bg-purple-500/5 border border-purple-500/10 p-4 rounded-2xl text-[10px] text-center text-purple-400 font-bold uppercase tracking-widest">
            Note: Please use your registered Gmail to sign in.
          </div>
        )}

        {error && (
          <div className="bg-purple-950/40 border border-purple-500/20 text-purple-400 p-4 rounded-2xl text-xs font-bold animate-in fade-in slide-in-from-top-2 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 px-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-black border-2 border-zinc-800 rounded-2xl px-5 py-3.5 focus:border-purple-500 focus:bg-zinc-950 transition-all outline-none text-purple-400 placeholder:text-slate-700 text-sm"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 px-1">Email Address</label>
            <input 
              type="email" 
              required
              className={`w-full bg-black border-2 rounded-2xl px-5 py-3.5 transition-all outline-none text-purple-400 placeholder:text-slate-700 text-sm ${error ? 'border-purple-500/50' : 'border-zinc-800 focus:border-purple-500 focus:bg-zinc-950'}`}
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 px-1">Password</label>
            <input 
              type="password" 
              required
              className={`w-full bg-black border-2 rounded-2xl px-5 py-3.5 transition-all outline-none text-purple-400 placeholder:text-slate-700 text-sm ${error ? 'border-purple-500/50' : 'border-zinc-800 focus:border-purple-500 focus:bg-zinc-950'}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {mode === 'signup' && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-400">
              <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 px-1">Confirm Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-black border-2 border-zinc-800 rounded-2xl px-5 py-3.5 focus:border-purple-500 focus:bg-zinc-950 transition-all outline-none text-purple-400 placeholder:text-slate-700 text-sm"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-purple-400 py-4.5 rounded-2xl font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-950/40 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50 mt-4 h-14"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></span>
            ) : (
              <>
                {mode === 'signin' ? 'Sign In' : 'Register & Access'}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
            <span>{mode === 'signin' ? "New here?" : "Already registered?"}</span>
            <button 
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-purple-400 hover:text-purple-500 transition-colors uppercase tracking-widest font-black"
            >
              {mode === 'signin' ? 'Create Account' : 'Sign In Now'}
            </button>
          </div>
          {mode === 'signin' && (
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-purple-400 transition-colors block mx-auto">
              Forgot password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
