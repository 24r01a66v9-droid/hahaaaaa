import { Instagram, Linkedin } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer id="contact" className="bg-brand-maroon text-white py-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-6 mb-10">
              <div className="p-3 bg-white rounded-2xl shadow-2xl">
                <Logo className="w-12 h-12" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black tracking-[0.3em] text-4xl leading-none">IKSHANA</span>
                <span className="text-[10px] uppercase tracking-[0.5em] text-white/60 font-bold mt-1">Foundation</span>
              </div>
            </div>
            <p className="text-white/70 max-w-md mb-12 leading-relaxed text-xl italic font-serif">
              Fostering a community of compassionate leaders, creators, and change-makers dedicated to supporting those in need, spreading awareness, and creating a better tomorrow.
            </p>
            {/* Social icons */}
          </div>

          <div>
            <h4 className="font-serif text-lg sm:text-xl mb-4 italic text-white underline underline-offset-4 decoration-white/20">Quick Links</h4>
            <div className="flex flex-wrap gap-4">
              <a href="/past-events" className="flex flex-col items-center gap-2 transition-transform hover:scale-105">
                <span className="flex h-16 min-w-[5.5rem] px-3 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 text-center leading-tight">Events</span>
                <div className="h-px w-10 bg-white/20" />
              </a>
              <a href="/gallery" className="flex flex-col items-center gap-2 transition-transform hover:scale-105">
                <span className="flex h-16 min-w-[5.5rem] px-3 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 text-center leading-tight">Team Archive</span>
                <div className="h-px w-10 bg-white/20" />
              </a>
              <a href="/reviews" className="flex flex-col items-center gap-2 transition-transform hover:scale-105">
                <span className="flex h-16 min-w-[5.5rem] px-3 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 text-center leading-tight">Reviews</span>
                <div className="h-px w-10 bg-white/20" />
              </a>
              <a href="/sponsors" className="flex flex-col items-center gap-2 transition-transform hover:scale-105">
                <span className="flex h-16 min-w-[5.5rem] px-3 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 text-center leading-tight">Sponsors</span>
                <div className="h-px w-10 bg-white/20" />
              </a>
              <a href="/careers" className="flex flex-col items-center gap-2 transition-transform hover:scale-105">
                <span className="flex h-16 min-w-[5.5rem] px-3 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 text-center leading-tight">Careers</span>
                <div className="h-px w-10 bg-white/20" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg sm:text-xl mb-6 italic text-white underline underline-offset-4 decoration-white/20">Contact</h4>
            <ul className="space-y-6">
              <li className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Location</span>
                <span className="text-xl font-serif italic">Hyderabad, Telangana</span>
              </li>
              <li className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Email</span>
                <a href="mailto:ikshana.4foundation@gmail.com" className="text-xl font-serif italic hover:text-white transition-colors">ikshana.4foundation@gmail.com</a>
              </li>
              <li className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Social</span>
                <div className="flex gap-6 mt-2">
                  <a href="https://www.instagram.com/ikshana_official/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors opacity-80">
                    <Instagram size={24} />
                  </a>
                  <a href="https://www.linkedin.com/company/ikshana-foundation/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors opacity-80">
                    <Linkedin size={24} />
                  </a>
                  <a href="https://www.youtube.com/@IKSHANAFOUNDATION" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M23.498 6.186a2.963 2.963 0 0 0-2.087-2.096C19.675 3.5 12 3.5 12 3.5s-7.675 0-9.411.59A2.963 2.963 0 0 0 .502 6.186 31.66 31.66 0 0 0 0 12a31.66 31.66 0 0 0 .502 5.814 2.963 2.963 0 0 0 2.087 2.096C4.325 20.5 12 20.5 12 20.5s7.675 0 9.411-.59a2.963 2.963 0 0 0 2.087-2.096A31.66 31.66 0 0 0 24 12a31.66 31.66 0 0 0-.502-5.814z" fill="currentColor"/>
                      <path d="M9.75 15.02V8.98L15.5 12l-5.75 3.02z" fill="#fff"/>
                    </svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-16 border-t border-white/10" />
      </div>
    </footer>
  );
}
