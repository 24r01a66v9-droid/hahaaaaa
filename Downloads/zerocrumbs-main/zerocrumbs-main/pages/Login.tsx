
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Hotel, Users, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';

interface LoginProps {
  onLogin: (user: { name: string; role: UserRole }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role) {
      onLogin({ 
        name: role === UserRole.DONOR ? 'Grand Plaza Bistro' : 'City Harvest NGO', 
        role 
      });
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center p-6 bg-sand">
      <div className="max-w-5xl w-full bg-white rounded-[4rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-charcoal/5 animate-in slide-in-from-bottom-12 duration-700">
        <div className="md:w-1/2 bg-charcoal p-20 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-terracotta/20 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="flex items-center mb-12 group cursor-pointer">
                    <div className="bg-terracotta p-3 rounded-2xl group-hover:rotate-12 transition-transform">
                        <Logo size={32} strokeColor="white" />
                    </div>
                    <span className="ml-4 text-3xl font-black tracking-tight">ZeroCrumbs.</span>
                </div>
                <h2 className="heading-serif text-6xl leading-[1] mb-10">Define your <br/><span className="text-terracotta">Impact.</span></h2>
                <p className="text-white/40 text-lg font-medium leading-relaxed max-w-sm">
                    Join the digital infrastructure for surplus food redistribution. Secure, transparent, and direct.
                </p>
            </div>

            <div className="relative z-10 mt-20 grid grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-3xl border border-white/10 group hover:border-terracotta transition-colors">
                    <p className="text-4xl font-black mb-2 leading-none">2.4k</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">Verified Donors</p>
                </div>
                <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-3xl border border-white/10 group hover:border-terracotta transition-colors">
                    <p className="text-4xl font-black mb-2 leading-none">800+</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">Partner NGOs</p>
                </div>
            </div>
        </div>

        <div className="md:w-1/2 p-20 flex flex-col justify-center">
          {!role ? (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h3 className="heading-serif text-4xl text-charcoal mb-4">Welcome back.</h3>
              <p className="text-charcoal/40 font-medium mb-12">Select your ecosystem role to access your dashboard.</p>
              
              <div className="space-y-6">
                <RoleOption 
                    icon={<Hotel />} 
                    title="Food Donor" 
                    desc="Hotels, Restaurants, & Events" 
                    onClick={() => setRole(UserRole.DONOR)}
                    color="terracotta"
                />
                <RoleOption 
                    icon={<Users />} 
                    title="NGO / Food Bank" 
                    desc="Verified Food Banks & Shelters" 
                    onClick={() => setRole(UserRole.NGO)}
                    color="blue"
                />
                <RoleOption 
                    icon={<ShieldCheck />} 
                    title="Administrator" 
                    desc="Moderation & Quality Control" 
                    onClick={() => setRole(UserRole.ADMIN)}
                    color="charcoal"
                />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <button 
                onClick={() => setRole(null)}
                className="text-charcoal/30 hover:text-terracotta text-[10px] font-black uppercase tracking-[0.3em] mb-12 flex items-center transition-colors"
              >
                <ArrowRight className="rotate-180 mr-3" size={14} /> Back to roles
              </button>
              
              <h3 className="heading-serif text-5xl text-charcoal mb-4 lowercase">
                Login as <span className="text-terracotta capitalize">{role === UserRole.NGO ? "NGO / Food Bank" : role.toLowerCase()}</span>
              </h3>
              <p className="text-charcoal/40 font-medium mb-12">Access your impact metrics and active listings.</p>

              <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-6">
                    <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/20 group-focus-within:text-terracotta transition-colors" size={18} />
                        <input 
                            type="email" 
                            placeholder="Authorized Email Address" 
                            className="w-full pl-16 pr-8 py-5 rounded-2xl bg-sand border-none outline-none focus:ring-2 focus:ring-terracotta/20 font-bold transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/20 group-focus-within:text-terracotta transition-colors" size={18} />
                        <input 
                            type="password" 
                            placeholder="Secure Password" 
                            className="w-full pl-16 pr-8 py-5 rounded-2xl bg-sand border-none outline-none focus:ring-2 focus:ring-terracotta/20 font-bold transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-charcoal/30">
                    <label className="flex items-center cursor-pointer hover:text-charcoal transition-colors">
                        <input type="checkbox" className="mr-3 rounded-md border-charcoal/10 text-terracotta focus:ring-terracotta" />
                        Remember session
                    </label>
                    <a href="#" className="text-terracotta hover:underline decoration-2">Request Reset</a>
                </div>

                <button className="w-full bg-terracotta text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-terracotta/30 transition-all active:scale-[0.98]">
                  Open Dashboard
                </button>

                <p className="text-center text-charcoal/40 text-[10px] font-black uppercase tracking-[0.2em]">
                    New to ZeroCrumbs? <a href="#" className="text-terracotta hover:underline ml-2">Register Ecosystem</a>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RoleOption = ({ icon, title, desc, onClick, color }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void, color: string }) => {
  const colorMap: any = {
    terracotta: 'text-terracotta bg-terracotta/5 group-hover:bg-terracotta group-hover:text-white shadow-terracotta/20',
    blue: 'text-blue-500 bg-blue-500/5 group-hover:bg-blue-500 group-hover:text-white shadow-blue-500/20',
    charcoal: 'text-charcoal bg-charcoal/5 group-hover:bg-charcoal group-hover:text-white shadow-charcoal/20'
  };

  return (
    <button 
      onClick={onClick}
      className="w-full group text-left p-6 border border-charcoal/5 rounded-3xl flex items-center hover:border-terracotta hover:shadow-2xl hover:shadow-charcoal/5 transition-all duration-500 active:scale-[0.98] bg-sand/20"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-6 transition-all duration-500 shadow-lg ${colorMap[color]}`}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
      </div>
      <div>
        <p className="font-black text-charcoal text-lg uppercase tracking-tight leading-none mb-1.5">{title}</p>
        <p className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest leading-none">{desc}</p>
      </div>
      <ArrowRight className="ml-auto text-charcoal/10 group-hover:text-terracotta group-hover:translate-x-2 transition-all" size={20} />
    </button>
  );
};

export default Login;
