
import React, { useEffect, useState } from 'react';
import { IMPACT_MOCK } from '../constants';
import { FoodListing, ListingStatus } from '../types';
import { getSustainabilityFact } from '../geminiService';
import { 
  ArrowRight, UtensilsCrossed, Wind, Droplet, Users, 
  Clock, ShieldCheck, ChevronRight
} from 'lucide-react';
import FoodCard from '../components/FoodCard';

interface HomeProps {
  onNavigate: (path: string) => void;
  listings: FoodListing[];
}

const Home: React.FC<HomeProps> = ({ onNavigate, listings }) => {
  const [fact, setFact] = useState<string>('');
  const availableListings = listings.filter(l => l.status === ListingStatus.AVAILABLE);

  useEffect(() => {
    getSustainabilityFact().then(res => setFact(res || ''));
  }, []);

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section - Restored side-image layout */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-sand pt-16">
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
            <div className="w-full h-full bg-charcoal overflow-hidden rounded-bl-[20rem] relative">
                <img 
                    src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1200" 
                    className="w-full h-full object-cover opacity-50 mix-blend-overlay scale-110"
                    alt="Sustainable community meal"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent"></div>
            </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-0">
          <div className="lg:max-w-2xl">
            <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-terracotta/10 text-terracotta text-xs font-black uppercase tracking-widest mb-10 shadow-sm border border-terracotta/10">
                <span className="relative flex h-2 w-2 mr-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta"></span>
                </span>
                Happening Now: {availableListings.length} items available
            </div>
            <h1 className="heading-serif text-6xl lg:text-9xl text-charcoal leading-[0.95] mb-10">
              Turn <span className="text-terracotta">Surplus</span> into <span className="text-terracotta italic">Nourishment.</span>
            </h1>
            <p className="text-xl text-charcoal/60 mb-14 max-w-lg leading-relaxed font-medium">
              ZeroCrumbs connects verified donors with local NGOs to ensure perfectly good food finds a plate, not a bin. 
            </p>
            <div className="flex flex-col sm:flex-row gap-6 mb-20">
              <button 
                onClick={() => onNavigate('listings')}
                className="bg-terracotta text-white px-10 py-6 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-terracotta/90 hover:shadow-2xl hover:shadow-terracotta/30 transition-all flex items-center justify-center group"
              >
                Find Food Near Me <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('post')}
                className="bg-white text-charcoal border border-charcoal/10 px-10 py-6 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:border-terracotta hover:text-terracotta transition-all flex items-center justify-center shadow-sm"
              >
                Post Surplus
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Strip */}
      <section className="py-20 bg-charcoal text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <StatItem icon={<UtensilsCrossed />} value={IMPACT_MOCK.mealsSaved.toLocaleString()} label="Meals Shared" />
            <StatItem icon={<Wind />} value={IMPACT_MOCK.co2Reduced.toLocaleString()} label="CO2 Reduced (kg)" />
            <StatItem icon={<Droplet />} value={IMPACT_MOCK.waterSaved.toLocaleString()} label="Water Saved (L)" />
            <StatItem icon={<Users />} value={IMPACT_MOCK.peopleServed.toLocaleString()} label="People Served" />
          </div>
        </div>
      </section>

      {/* Live Preview Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <div>
                    <p className="text-terracotta font-black uppercase tracking-widest text-xs mb-4">Live Surplus</p>
                    <h2 className="heading-serif text-5xl lg:text-6xl text-charcoal mb-4">Available Within 5km</h2>
                    <p className="text-charcoal/40 max-w-xl font-medium">Snapshots of verified surplus food ready for immediate redistribution.</p>
                </div>
                <button onClick={() => onNavigate('listings')} className="group text-charcoal font-black uppercase tracking-widest text-xs flex items-center hover:text-terracotta transition-colors">
                    Explore All <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {availableListings.slice(0, 3).map(food => (
                    <FoodCard key={food.id} food={food} onViewDetails={() => onNavigate('listings')} />
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

const StatItem = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => (
    <div className="text-center group p-8 rounded-[3rem] border border-white/5 hover:bg-white/5 transition-all">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-terracotta/10 text-terracotta group-hover:rotate-12 transition-transform">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
      </div>
      <div className="text-4xl font-black text-white mb-2 tracking-tighter">{value}</div>
      <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{label}</div>
    </div>
);

export default Home;
