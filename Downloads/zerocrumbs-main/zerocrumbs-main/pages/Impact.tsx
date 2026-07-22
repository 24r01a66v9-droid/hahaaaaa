
import React from 'react';
import { Wind, Droplet, Users, UtensilsCrossed, ArrowUpRight, Award, Trophy, Star } from 'lucide-react';
import { MOCK_LEADERBOARD } from '../constants';
import { UserRole } from '../types';

interface ImpactPageProps {
  onNavigate: (path: string) => void;
  impact: {
    mealsSaved: number;
    co2Reduced: number;
    waterSaved: number;
    peopleServed: number;
  };
}

const ImpactPage: React.FC<ImpactPageProps> = ({ onNavigate, impact }) => {
  return (
    <div className="bg-sand min-h-screen py-24 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-10">
          <div className="max-w-2xl">
            <p className="text-terracotta font-black uppercase tracking-[0.4em] text-[10px] mb-6">Quantified Change</p>
            <h1 className="heading-serif text-6xl md:text-8xl text-charcoal leading-none">Evidence of <br/><span className="text-terracotta">Impact.</span></h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
           <ImpactStatCard icon={<UtensilsCrossed />} value={impact.mealsSaved.toLocaleString()} label="Meals Shared" detail="+14% this month" />
           <ImpactStatCard icon={<Wind />} value={impact.co2Reduced.toLocaleString()} label="CO2 Prevented (kg)" detail="Equivalent to 420 trees" />
           <ImpactStatCard icon={<Droplet />} value={impact.waterSaved.toLocaleString()} label="Water Conserved (L)" detail="14 olympic pools" />
           <ImpactStatCard icon={<Users />} value={impact.peopleServed.toLocaleString()} label="Community Support" detail="Across 12 municipalities" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          {/* Top Donors */}
          <div className="bg-white rounded-[4rem] p-12 shadow-2xl border border-charcoal/5">
             <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-terracotta/10 rounded-2xl flex items-center justify-center text-terracotta">
                    <Trophy size={24} />
                  </div>
                  <h3 className="heading-serif text-4xl text-charcoal">Top Donors</h3>
                </div>
                <Award className="text-wheat" size={32} />
             </div>
             <div className="space-y-6">
               {MOCK_LEADERBOARD.filter(e => e.type === UserRole.DONOR).map((entry, i) => (
                 <LeaderboardItem key={entry.name} entry={entry} rank={i + 1} />
               ))}
             </div>
          </div>

          {/* Top NGOs */}
          <div className="bg-charcoal rounded-[4rem] p-12 shadow-2xl text-white">
             <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-terracotta">
                    <Star size={24} fill="currentColor" />
                  </div>
                  <h3 className="heading-serif text-4xl">Eco-Engineers</h3>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Top NGOs</div>
             </div>
             <div className="space-y-6">
               {MOCK_LEADERBOARD.filter(e => e.type === UserRole.NGO).map((entry, i) => (
                 <LeaderboardItem key={entry.name} entry={entry} rank={i + 1} dark />
               ))}
             </div>
          </div>
        </div>

        <section className="mb-32">
            <div className="bg-white rounded-[4rem] p-12 lg:p-20 shadow-2xl shadow-charcoal/5 border border-charcoal/5 relative overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    <div className="lg:w-1/2">
                        <h3 className="heading-serif text-5xl text-charcoal mb-8">Surplus <br/>Heatmaps.</h3>
                        <p className="text-lg text-charcoal/50 leading-relaxed font-medium mb-12">
                            We visualize surplus zones to help NGOs optimize their routes. High-intensity areas signify immediate needs for rapid redistribution.
                        </p>
                        <button 
                          onClick={() => onNavigate('listings')}
                          className="bg-charcoal text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center group"
                        >
                            Open Live Map <ArrowUpRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

const LeaderboardItem = ({ entry, rank, dark }: any) => (
  <div className={`flex items-center justify-between p-6 rounded-3xl border transition-all hover:scale-[1.02] ${dark ? 'bg-white/5 border-white/5 hover:border-white/20' : 'bg-sand/30 border-charcoal/5 hover:border-terracotta/20'}`}>
    <div className="flex items-center gap-6">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${rank === 1 ? 'bg-wheat text-charcoal shadow-lg shadow-wheat/20' : 'bg-charcoal/10 text-charcoal/40'}`}>
        #{rank}
      </div>
      <img src={entry.avatar} className="w-12 h-12 rounded-2xl border-2 border-white/10" alt="" />
      <div>
        <p className={`font-black uppercase tracking-tight text-sm ${dark ? 'text-white' : 'text-charcoal'}`}>{entry.name}</p>
        <p className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-white/30' : 'text-charcoal/30'}`}>{entry.type === UserRole.DONOR ? 'Impact Contributor' : 'Redistribution Partner'}</p>
      </div>
    </div>
    <div className="text-right">
      <p className={`text-2xl font-black ${dark ? 'text-white' : 'text-charcoal'}`}>{entry.score.toLocaleString()}</p>
      <p className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-white/20' : 'text-charcoal/20'}`}>Points</p>
    </div>
  </div>
);

const ImpactStatCard = ({ icon, value, label, detail }: any) => (
    <div className="bg-white rounded-[3rem] p-10 border border-charcoal/5 shadow-xl shadow-charcoal/5 transition-all hover:scale-105 group">
        <div className="w-16 h-16 bg-sand rounded-2xl flex items-center justify-center text-terracotta mb-8 group-hover:rotate-12 transition-transform">
            {React.cloneElement(icon, { size: 28 })}
        </div>
        <p className="text-charcoal font-black text-4xl mb-2 tracking-tighter leading-none">{value}</p>
        <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-4">{label}</p>
        <div className="pt-4 border-t border-charcoal/5 flex items-center text-[10px] font-bold text-terracotta">
            <ArrowUpRight size={12} className="mr-1" /> {detail}
        </div>
    </div>
);

export default ImpactPage;
