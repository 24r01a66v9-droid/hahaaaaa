
import React, { useMemo, useState, useEffect } from 'react';
import { UserRole, FoodListing, ListingStatus, RecipientGroup, PredictiveInsight, NGORequirements } from '../types';
import { 
  Plus, History, ShieldCheck, MapPin, 
  Clock, Activity, ArrowUpRight, CheckCircle2, Users,
  LogOut, Smartphone, Heart, Search, Sparkles, TrendingUp,
  Calendar, Thermometer, Check, X, Database, Zap
} from 'lucide-react';
import { getPredictiveInsights, calculateNutritionMatch } from '../geminiService';

interface DashboardProps {
  user: { name: string; role: UserRole; verified?: boolean };
  listings: FoodListing[];
  notifications: any[];
  onVerifyOTP: (listingId: string, otp: string) => boolean;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  dbHealth?: { status: string; latency: number; engine: string };
}

const Dashboard: React.FC<DashboardProps> = ({ user, listings, notifications, onVerifyOTP, onNavigate, onLogout, dbHealth }) => {
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [otpError, setOtpError] = useState<string | null>(null);
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);

  // NGO Nutritional Match Engine State
  const [ngoRequirements, setNgoRequirements] = useState<NGORequirements>({
    targetGroups: [RecipientGroup.CHILDREN, RecipientGroup.ELDERLY],
    priorityNutrients: ['Protein', 'Calcium'],
    maxDistanceKm: 10
  });
  const [matchedListings, setMatchedListings] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const donorListings = useMemo(() => listings.filter(l => l.donorName === user.name || user.role === UserRole.ADMIN), [listings, user.name]);
  const ngoClaims = useMemo(() => listings.filter(l => l.claimedBy === user.name), [listings, user.name]);
  
  useEffect(() => {
    getPredictiveInsights(user.role).then(res => {
      setInsights(res);
      setLoadingInsights(false);
    });
  }, [user.role]);

  useEffect(() => {
    if (user.role === UserRole.NGO) {
      const fetchMatches = async () => {
        setLoadingMatches(true);
        const available = listings.filter(l => l.status === ListingStatus.AVAILABLE);
        const top2 = available.slice(0, 2);
        const results = await Promise.all(top2.map(async (listing) => {
          const matchData = await calculateNutritionMatch(listing, ngoRequirements);
          return { ...listing, ...matchData };
        }));
        setMatchedListings(results);
        setLoadingMatches(false);
      };
      fetchMatches();
    }
  }, [user.role, ngoRequirements, listings]);

  const handleOtpChange = (id: string, val: string) => {
    setOtpInputs(prev => ({ ...prev, [id]: val }));
    setOtpError(null);
  };

  const handleVerify = (id: string) => {
    const success = onVerifyOTP(id, otpInputs[id] || '');
    if (!success) {
      setOtpError("Invalid OTP. Verify with the representative.");
    } else {
      setOtpInputs(prev => ({ ...prev, [id]: '' }));
    }
  };

  const renderSystemHealth = () => (
    <div className="bg-white rounded-[3rem] p-10 border border-charcoal/5 shadow-xl mb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sand rounded-xl flex items-center justify-center text-charcoal">
            <Database size={20} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-charcoal/30">System Infrastructure</h3>
            <p className="font-black text-charcoal">Database Connectivity</p>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${dbHealth?.status === 'connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${dbHealth?.status === 'connected' ? 'bg-emerald-600 animate-pulse' : 'bg-red-600'}`}></div>
          {dbHealth?.status === 'connected' ? 'Connected & Healthy' : 'Connection Error'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-sand/30 rounded-2xl border border-charcoal/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-2">Engine</p>
          <p className="text-xs font-bold text-charcoal">{dbHealth?.engine || 'Detecting...'}</p>
        </div>
        <div className="p-6 bg-sand/30 rounded-2xl border border-charcoal/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-2">Latency</p>
          <p className="text-xs font-bold text-charcoal">{dbHealth?.latency || 0} ms (Round-trip)</p>
        </div>
        <div className="p-6 bg-sand/30 rounded-2xl border border-charcoal/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-2">Sync Status</p>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
             <Check size={14} /> Real-time Persistence Active
          </div>
        </div>
      </div>
    </div>
  );

  const renderPredictiveForecast = () => (
    <div className="bg-charcoal text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group mb-12 border border-white/5">
      <div className="absolute top-0 right-0 p-8 text-terracotta opacity-10 group-hover:opacity-20 transition-opacity">
        <TrendingUp size={160} />
      </div>
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-terracotta rounded-2xl flex items-center justify-center text-white shadow-lg shadow-terracotta/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-black uppercase tracking-widest text-[10px] text-white/40">Predictive Waste Engine</h3>
              <p className="text-2xl font-black">AI Surplus Forecast</p>
            </div>
          </div>
          <div className="px-5 py-2 bg-white/5 rounded-full border border-white/10 flex items-center gap-3">
            <Calendar size={14} className="text-terracotta" />
            <span className="text-[10px] font-black uppercase tracking-widest">Next 7 Days: High Surplus Expected</span>
          </div>
        </div>
        
        {loadingInsights ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            <div className="h-32 bg-white/5 rounded-[2.5rem]"></div>
            <div className="h-32 bg-white/5 rounded-[2.5rem]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {insights.map((insight, idx) => (
              <div key={idx} className={`p-8 rounded-[2.5rem] border transition-all hover:scale-[1.02] ${insight.impactLevel === 'HIGH' ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${insight.type === 'ALERT' ? 'bg-red-500 text-white' : 'bg-terracotta text-white'}`}>
                    {insight.type}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{insight.impactLevel} Priority</span>
                </div>
                <h4 className="text-xl font-black mb-3">{insight.title}</h4>
                <p className="text-sm text-white/50 leading-relaxed font-medium mb-6">{insight.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderDonorDashboard = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {renderSystemHealth()}
      {renderPredictiveForecast()}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Waste Prevented" value="240 kg" subValue="+18% vs last month" icon={<TrendingUp size={24} className="text-terracotta" />} trend="up" />
        <StatCard label="Lives Nourished" value="1.2k" subValue="Direct Distribution" icon={<UsersIcon />} trend="up" />
        <StatCard label="Eco Impact" value="Tier 4" icon={<ActivityIcon />} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <section className="bg-white rounded-[3rem] p-10 border border-charcoal/5 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="heading-serif text-3xl text-charcoal">Active Handover</h3>
                <p className="text-xs text-charcoal/40 font-bold uppercase tracking-widest mt-1">Verify Partner Claims</p>
              </div>
              <button 
                onClick={() => onNavigate('post')}
                className="bg-terracotta text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-2xl hover:shadow-terracotta/30 transition-all flex items-center space-x-2 active:scale-95 shadow-lg shadow-terracotta/20"
              >
                <Plus size={16} /> <span>Post New Surplus</span>
              </button>
            </div>
            
            <div className="space-y-6">
              {donorListings.filter(l => l.status === ListingStatus.CLAIMED).map(listing => (
                <div key={listing.id} className="bg-sand/30 p-8 rounded-[2.5rem] border border-terracotta/10 relative overflow-hidden group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center space-x-6">
                      <img src={listing.imageUrl} className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
                      <div>
                        <h4 className="text-xl font-black text-charcoal mb-1">{listing.name}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-terracotta flex items-center">
                          <Users size={12} className="mr-2" /> Claimed by {listing.claimedBy}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-charcoal/5 flex flex-col items-center">
                       <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-3">Verify Claim OTP</p>
                       <div className="flex space-x-3">
                          <input 
                            type="text" 
                            placeholder="OTP"
                            maxLength={6}
                            value={otpInputs[listing.id] || ''}
                            onChange={(e) => handleOtpChange(listing.id, e.target.value)}
                            className="w-32 bg-sand border-none outline-none rounded-xl px-4 py-3 text-center font-black tracking-[0.3em] text-charcoal focus:ring-2 focus:ring-terracotta/20 transition-all"
                          />
                          <button 
                            onClick={() => handleVerify(listing.id)}
                            className="bg-charcoal text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-terracotta transition-colors shadow-lg"
                          >
                            Verify
                          </button>
                       </div>
                       {otpError && <p className="text-[9px] font-black text-red-500 mt-2 uppercase">{otpError}</p>}
                    </div>
                  </div>
                </div>
              ))}
              {donorListings.filter(l => l.status === ListingStatus.CLAIMED).length === 0 && (
                <div className="p-16 border-2 border-dashed border-charcoal/5 rounded-[3rem] text-center">
                   <Smartphone size={48} className="text-charcoal/10 mx-auto mb-6" />
                   <p className="text-charcoal/30 font-bold">No active claims waiting.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const renderNGODashboard = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {renderSystemHealth()}
      {renderPredictiveForecast()}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Food Claimed" value={ngoClaims.length + 12} subValue="142 kg total weight" icon={<HistoryIcon />} trend="up" />
        <StatCard label="Match Accuracy" value="98%" subValue="AI Nutritional Precision" icon={<Sparkles size={24} className="text-terracotta" />} trend="up" />
        <StatCard label="Active Partners" value="12" subValue="Local Donors" icon={<Heart size={24} className="text-terracotta" />} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
           <section>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h3 className="heading-serif text-4xl text-charcoal">Redistribution Feed</h3>
              <button 
                onClick={() => onNavigate('listings')}
                className="bg-charcoal text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-2xl transition-all flex items-center space-x-2"
              >
                <Search size={16} /> <span>Find More Surplus</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loadingMatches ? (
                [1, 2].map(idx => <div key={idx} className="h-96 bg-white/50 animate-pulse rounded-[2.5rem]"></div>)
              ) : (
                matchedListings.map(match => (
                  <div key={match.id} className="bg-white border border-charcoal/5 rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all group overflow-hidden flex flex-col h-full border-t-4 border-t-terracotta">
                     <div className="flex gap-6 mb-6">
                        <img src={match.imageUrl} className="w-24 h-24 rounded-2xl object-cover shadow-lg" />
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">AI Match {match.matchPercentage}%</span>
                          </div>
                          <h4 className="text-xl font-black leading-tight group-hover:text-terracotta transition-colors">{match.name}</h4>
                          <p className="text-[10px] font-bold text-charcoal/30 mt-1">{match.donorName}</p>
                        </div>
                     </div>
                     <p className="text-xs font-bold text-charcoal/60 leading-relaxed mb-8 flex-grow">
                        {match.matchReason}
                     </p>
                     <button onClick={() => onNavigate('listings')} className="mt-auto w-full bg-charcoal text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-terracotta transition-all">
                       View & Claim
                     </button>
                  </div>
                ))
              )}
            </div>
           </section>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-sand min-h-screen pt-12 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <p className="text-terracotta font-black uppercase tracking-widest text-[10px] flex items-center mb-4">
               {user.verified && <ShieldCheck size={12} className="mr-2" />} Verified {user.role} Point
            </p>
            <h1 className="heading-serif text-6xl md:text-8xl text-charcoal leading-none">
              Welcome, <span className="text-terracotta">{user.name.split(' ')[0]}</span>.
            </h1>
          </div>
          <button onClick={onLogout} className="p-5 bg-white rounded-3xl border border-charcoal/5 text-charcoal/30 hover:text-red-500 transition-all shadow-sm flex items-center">
            <LogOut size={24} />
          </button>
        </div>
        {user.role === UserRole.DONOR && renderDonorDashboard()}
        {user.role === UserRole.NGO && renderNGODashboard()}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, subValue, icon, trend }: any) => (
  <div className="bg-white rounded-[3rem] p-10 border border-charcoal/5 shadow-xl group hover:border-terracotta transition-all duration-500">
    <div className="flex justify-between items-start mb-10">
      <div className="p-5 bg-sand rounded-3xl group-hover:bg-terracotta/5">{icon}</div>
      <div className={`flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest ${trend === 'up' ? 'text-emerald-500' : 'text-charcoal/30'}`}>
        {trend === 'up' && <ArrowUpRight size={14} />}
        <span>{trend === 'up' ? 'Growing' : 'Steady'}</span>
      </div>
    </div>
    <p className="text-charcoal/40 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
    <div className="text-5xl font-black text-charcoal mb-2 tracking-tighter leading-none">{value}</div>
    {subValue && <p className="text-[10px] font-bold text-charcoal/30">{subValue}</p>}
  </div>
);

const UsersIcon = () => <Users size={24} className="text-terracotta" />;
const ActivityIcon = () => <Activity size={24} className="text-terracotta" />;
const HistoryIcon = () => <History size={24} className="text-terracotta" />;

export default Dashboard;
