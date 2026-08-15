import { motion } from "motion/react";
import { Calendar, LifeBuoy, Star, ImageIcon, LogIn, LogOut, User, Handshake, Briefcase, Users } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModals from "./AuthModals";

import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const navItems = [
    { name: "Events", icon: Calendar, path: "/past-events" },
    { name: "Founders & Team", icon: Users, path: "/founders-team" },
    { name: "Team Archive", icon: ImageIcon, path: "/gallery" },
    { name: "Sponsors", icon: Handshake, path: "/sponsors" },
    { name: "Careers", icon: Briefcase, path: "/careers" },
    { name: "Seek Help", icon: LifeBuoy, path: "/seek-help" },
    { name: "Reviews", icon: Star, path: "/reviews" },
  ].filter(item => item.name !== 'Seek Help' || user?.role === 'admin');

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[98%] max-w-6xl">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur-xl border border-stone-200 rounded-3xl px-8 py-4 flex items-center justify-between shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-maroon opacity-50 group-hover:opacity-100 transition-opacity" />
          
          <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity" aria-label="Home">
            <Logo className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="font-serif font-black tracking-[0.2em] text-xl hidden sm:block leading-none text-brand-maroon">Home</span>
            </div>
          </Link>
          
          <div className="flex items-center justify-center gap-4 md:gap-6 xl:gap-8 flex-1 ml-4 mr-4">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path}
                className={`transition-colors text-sm font-medium flex items-center gap-1.5 group ${
                  isActive(item.path)
                    ? "text-brand-maroon"
                    : "text-brand-maroon/80 hover:text-brand-maroon"
                }`}
              >
                <item.icon size={16} className="sm:hidden" />
                <span className="hidden sm:inline relative whitespace-nowrap">
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-maroon transition-all ${
                    isActive(item.path) ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                </span>
              </Link>
            ))}

            <div className="h-6 w-px bg-brand-maroon/10 hidden sm:block" />

            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-brand-maroon/60 text-sm font-medium">
                  <User size={16} className="text-brand-maroon" />
                  <div className="flex flex-col">
                    <span>{user.name.split(' ')[0]}</span>
                    {user.role === 'admin' && (
                      <span className="text-[7px] font-bold uppercase tracking-widest bg-brand-maroon text-white px-1.5 py-0.5 rounded-full leading-none mt-0.5">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => logout()}
                  className="text-brand-maroon/60 hover:text-brand-maroon transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleAuthClick('login')}
                  className="text-brand-maroon/60 hover:text-brand-maroon transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </button>
                <button 
                  onClick={() => handleAuthClick('register')}
                  className="bg-brand-maroon text-white px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-stone-900 transition-all hidden sm:block shadow-lg shadow-brand-maroon/20"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </nav>

      <AuthModals 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode} 
      />
    </>
  );
}
