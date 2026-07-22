
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Menu, X, Bell, LogOut, ChevronDown, LayoutDashboard, Clock, CheckCircle2, Heart, AlertCircle, ChefHat, MessageSquare, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  currentPath: string;
  user: { role: UserRole; name: string } | null;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  notifications: any[];
}

const Navbar: React.FC<NavbarProps> = ({ currentPath, user, onNavigate, onLogout, notifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navLinks = [
    { name: 'Home', path: 'home' },
    { name: 'Surplus Feed', path: 'listings' },
    { name: 'Reviews', path: 'reviews' },
    { name: 'Impact', path: 'impact' },
    { name: 'Safety Scan', path: 'safety' },
  ];

  if (user && user.role === UserRole.NGO) {
    navLinks.push({ name: 'Kitchen AI', path: 'kitchen' });
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'impact': return <Heart size={14} className="text-terracotta" />;
      case 'alert': return <AlertCircle size={14} className="text-red-500" />;
      default: return <Clock size={14} className="text-charcoal" />;
    }
  };

  return (
    <nav className="bg-sand/80 backdrop-blur-lg sticky top-0 z-50 border-b border-terracotta/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="bg-terracotta p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-terracotta/20">
              <Logo size={24} strokeColor="white" />
            </div>
            <span className="ml-3 text-2xl font-bold text-charcoal tracking-tight">ZeroCrumbs.</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => onNavigate(link.path)}
                className={`text-sm font-bold tracking-wide uppercase transition-all flex items-center gap-2 ${
                  currentPath === link.path ? 'text-terracotta' : 'text-charcoal/60 hover:text-terracotta'
                }`}
              >
                {link.path === 'kitchen' && <ChefHat size={14} />}
                {link.path === 'reviews' && <MessageSquare size={14} />}
                {link.path === 'safety' && <ShieldCheck size={14} />}
                {link.name}
              </button>
            ))}
            
            {user && (
              <div className="flex items-center space-x-6 ml-6 pl-6 border-l border-charcoal/10 relative">
                <div className="relative">
                  <button 
                    onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                    className={`p-2.5 rounded-full bg-white border border-charcoal/5 text-charcoal/40 hover:text-terracotta transition-all shadow-sm relative ${showNotifications ? 'text-terracotta border-terracotta/30' : ''}`}
                  >
                      <Bell size={20} />
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-terracotta rounded-full animate-pulse"></span>
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-charcoal/5 p-4 animate-in fade-in zoom-in duration-200">
                      <div className="px-4 py-2 border-b border-charcoal/5 mb-3 flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Notifications</span>
                         <span className="text-[10px] font-black uppercase text-terracotta">Real-time</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto space-y-2 scrollbar-hide">
                         {notifications.map((n) => (
                           <div key={n.id} className="p-4 rounded-2xl bg-sand/50 hover:bg-white border border-transparent hover:border-charcoal/5 transition-all">
                              <div className="flex items-start space-x-3">
                                <div className="mt-0.5">{getNotificationIcon(n.type)}</div>
                                <div>
                                  <p className="text-[11px] font-bold text-charcoal leading-tight">{n.text}</p>
                                  <p className="text-[9px] font-black uppercase text-charcoal/30 mt-1">{n.time}</p>
                                </div>
                              </div>
                           </div>
                         ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <div 
                    onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                    className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full border border-charcoal/5 shadow-sm cursor-pointer hover:border-terracotta transition-all"
                  >
                    <div className="bg-terracotta/10 p-1.5 rounded-full">
                      <LayoutDashboard size={16} className="text-terracotta" />
                    </div>
                    <span className="text-xs font-bold text-charcoal">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className={`text-charcoal/30 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </div>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl border border-charcoal/5 p-2 animate-in fade-in zoom-in duration-200">
                       <div className="px-6 py-4 border-b border-charcoal/5 mb-2 text-center">
                           <p className="text-[10px] font-black uppercase text-charcoal/30 mb-1">Account Role</p>
                           <p className="text-[11px] font-bold text-charcoal">{user.role === UserRole.NGO ? "NGO / Food Bank" : user.role}</p>
                       </div>
                       <button 
                        onClick={() => { onNavigate('dashboard'); setShowUserMenu(false); }}
                        className="w-full flex items-center px-6 py-4 text-xs font-black uppercase tracking-widest text-charcoal hover:bg-sand rounded-2xl transition-all"
                       >
                         <LayoutDashboard size={16} className="mr-3 text-terracotta" /> Dashboard
                       </button>
                       <div className="h-px bg-charcoal/5 my-2 mx-4"></div>
                       <button 
                        onClick={() => { onLogout(); setShowUserMenu(false); }}
                        className="w-full flex items-center px-6 py-4 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                       >
                         <LogOut size={16} className="mr-3" /> Logout
                       </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!user && (
              <button
                onClick={() => onNavigate('login')}
                className="bg-terracotta text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-terracotta/90 transition-all shadow-xl shadow-terracotta/20 active:scale-95"
              >
                Ecosystem Login
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-charcoal p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-sand border-b border-charcoal/10 py-6 px-4 space-y-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => { onNavigate(link.path); setIsOpen(false); }}
              className="block w-full text-left px-4 py-3 text-charcoal/70 font-bold uppercase tracking-widest hover:bg-white rounded-xl"
            >
              {link.name}
            </button>
          ))}
          {user ? (
            <button
              onClick={() => { onLogout(); setIsOpen(false); }}
              className="w-full mt-4 bg-charcoal text-white px-4 py-4 rounded-2xl font-bold flex items-center justify-center shadow-lg"
            >
              <LogOut size={18} className="mr-2" /> Logout
            </button>
          ) : (
             <button
                onClick={() => { onNavigate('login'); setIsOpen(false); }}
                className="w-full mt-4 bg-terracotta text-white px-4 py-4 rounded-2xl font-bold shadow-lg"
              >
                Get Started
              </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
