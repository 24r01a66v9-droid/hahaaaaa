import { motion } from "motion/react";
import { Heart, ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const STORAGE_KEY = "ikshana-leadership-members";
const LEADERSHIP_RESET_KEY = "ikshana-leadership-reset-complete";

export default function Hero() {
  const { user } = useAuth();
  const normalizedRole = user?.role?.toLowerCase();
  const isAdmin = Boolean(
    normalizedRole === "admin" ||
    (user?.email && user.email === "24r01a66v9@cmrithyderabad.edu.in")
  );
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch("/api/photos?category=hero");
        if (response.ok) {
          const data = await response.json();
          const featured = data.find((p: any) => p.is_featured);
          if (featured) setHeroImage(featured.url);
        }
      } catch (e) {
        console.error("Failed to fetch hero image", e);
      }
    };

    if (!window.localStorage.getItem(LEADERSHIP_RESET_KEY)) {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.setItem(LEADERSHIP_RESET_KEY, "true");
    }

    fetchHeroImage();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-stretch overflow-hidden bg-[#fffcfc]">
      {/* Content Side */}
      <div className="flex-1 flex flex-col justify-center px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-20 sm:py-24 lg:py-28 relative z-10 bg-[#fffcfc]">
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-maroon" />
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex items-center gap-4"
        >
          <Logo className="w-20 h-20" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-[0.15em] text-brand-maroon leading-none">IKSHANA</h1>
            <p className="text-[10px] uppercase tracking-[0.45em] text-brand-maroon/45 font-bold mt-1">Foundation</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-full"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand-maroon text-white rounded-full text-[10px] font-bold tracking-[0.3em] uppercase mb-10 shadow-xl shadow-brand-maroon/20">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Student Led Organization
          </div>
          <h2 className="text-7xl md:text-9xl font-serif font-light leading-[0.85] mb-10 tracking-tighter text-brand-maroon">
            Supporting <br />
            <span className="italic font-medium text-brand-maroon underline underline-offset-8 decoration-brand-maroon/20">Lives,</span> <br />
            Spreading Hope.
          </h2>
          <p className="text-brand-maroon font-serif italic text-3xl mb-12 opacity-90 border-l-8 border-brand-maroon pl-8 leading-tight">
            "your little help + our passion to help = someone's hope"
          </p>
          <p className="text-brand-maroon/70 text-xl mb-14 leading-relaxed font-serif italic">
            Ikshana is a community-driven social service initiative dedicated to supporting those who need it most through compassion and responsibility.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <a href="/about" className="w-full sm:w-auto px-12 py-6 border-2 border-brand-maroon/20 text-brand-maroon rounded-2xl font-bold tracking-widest uppercase text-[10px] hover:bg-brand-maroon hover:border-brand-maroon hover:text-white active:bg-brand-maroon active:text-white transition-all flex items-center justify-center">
              About
            </a>
            <a href="/careers" className="w-full sm:w-auto px-12 py-6 bg-brand-maroon text-white rounded-2xl font-bold tracking-widest uppercase text-[10px] hover:bg-stone-900 hover:scale-105 active:bg-brand-maroon transition-all flex items-center justify-center shadow-2xl shadow-brand-maroon/30">
              Join Our Community
            </a>
            <a href="/sponsors" className="w-full sm:w-auto px-12 py-6 border-2 border-brand-maroon/20 text-brand-maroon rounded-2xl font-bold tracking-widest uppercase text-[10px] hover:bg-brand-maroon hover:border-brand-maroon hover:text-white active:bg-brand-maroon active:text-white transition-all flex items-center justify-center">
              Support Our Cause
            </a>
          </div>
        </motion.div>
      </div>

      {/* Image Side */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex-1 hidden lg:block overflow-hidden"
      />

      {/* Removed vertical 'Scroll' label on left side as requested */}
    </section>
  );
}
