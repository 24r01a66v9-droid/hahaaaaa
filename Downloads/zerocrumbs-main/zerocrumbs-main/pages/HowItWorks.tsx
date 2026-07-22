
import React from 'react';
import { Camera, Bell, ShieldCheck, Heart, ArrowRight, Zap, Map, UtensilsCrossed } from 'lucide-react';

interface HowItWorksProps {
  onNavigate: (path: string) => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  return (
    <div className="bg-sand min-h-screen py-24 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-32">
          <p className="text-terracotta font-black uppercase tracking-[0.4em] text-[10px] mb-6">The ZeroCrumbs Lifecycle</p>
          <h1 className="heading-serif text-6xl md:text-8xl text-charcoal mb-10 leading-none">Abundance meets <br/><span className="italic text-terracotta">Need.</span></h1>
          <p className="text-xl text-charcoal/40 max-w-2xl mx-auto font-medium leading-relaxed">
            ZeroCrumbs transforms information into action. By connecting surplus data to verified logistics, we eliminate waste before it starts.
          </p>
        </div>

        {/* Step-by-Step for Donors */}
        <section className="mb-40">
           <div className="flex items-center space-x-4 mb-16">
              <div className="h-px bg-terracotta/20 flex-grow"></div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-terracotta">For Food Donors</h2>
              <div className="h-px bg-terracotta/20 flex-grow"></div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <Step 
                num="01" 
                icon={<Camera size={40} />} 
                title="Identify & Capture" 
                desc="When surplus occurs, simply snap a photo. Our AI identifies nutrition and allergen data instantly." 
              />
              <Step 
                num="02" 
                icon={<Zap size={40} />} 
                title="Broadcast Surplus" 
                desc="Select availability times. Your listing is instantly sent to NGOs within a 5km radius." 
              />
              <Step 
                num="03" 
                icon={<ShieldCheck size={40} />} 
                title="Trusted Handover" 
                desc="Coordinate a safe pickup with verified organizations. Receive an immediate impact report." 
              />
           </div>
        </section>

        {/* Step-by-Step for NGOs */}
        <section className="mb-40">
           <div className="flex items-center space-x-4 mb-16">
              <div className="h-px bg-charcoal/20 flex-grow"></div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-charcoal">For NGOs & Kitchens</h2>
              <div className="h-px bg-charcoal/20 flex-grow"></div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <Step 
                num="01" 
                icon={<Map size={40} />} 
                title="Discover Local" 
                desc="View your real-time surplus map. Filter by urgency, dietary needs, or quantity." 
                dark
              />
              <Step 
                num="02" 
                icon={<Bell size={40} />} 
                title="Claim Instantly" 
                desc="Claim items with a single tap. The donor is notified to prepare the handover." 
                dark
              />
              <Step 
                num="03" 
                icon={<UtensilsCrossed size={40} />} 
                title="Feed the Community" 
                desc="Turn surplus into nutritious meals. Your dashboard tracks the lives impacted." 
                dark
              />
           </div>
        </section>

        {/* Final CTA */}
        <div className="bg-charcoal rounded-[4rem] p-20 text-center relative overflow-hidden group">
            <Heart size={200} className="absolute -bottom-20 -right-20 text-white opacity-5 group-hover:scale-125 transition-transform duration-700" />
            <h3 className="heading-serif text-5xl text-white mb-8">Ready to make an impact?</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                  onClick={() => onNavigate('login')}
                  className="bg-terracotta text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:shadow-2xl transition-all"
                >
                    Join the Ecosystem
                </button>
                <button 
                  onClick={() => onNavigate('listings')}
                  className="text-white/40 hover:text-white font-black uppercase tracking-widest text-xs transition-colors flex items-center"
                >
                    Browse Active Listings <ArrowRight size={16} className="ml-3" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const Step = ({ num, icon, title, desc, dark }: any) => (
    <div className="group text-center">
        <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transition-all duration-500 shadow-xl group-hover:rotate-12 ${dark ? 'bg-charcoal text-white' : 'bg-white text-terracotta'}`}>
            <span className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black border-4 ${dark ? 'bg-white text-charcoal border-charcoal' : 'bg-charcoal text-white border-sand'}`}>{num}</span>
            {icon}
        </div>
        <h4 className="text-2xl font-black text-charcoal mb-4 uppercase tracking-tighter">{title}</h4>
        <p className="text-charcoal/40 font-medium leading-relaxed px-4">{desc}</p>
    </div>
);

export default HowItWorks;
