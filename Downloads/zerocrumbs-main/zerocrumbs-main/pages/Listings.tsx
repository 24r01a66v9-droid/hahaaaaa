
import React, { useState, useMemo, useEffect } from 'react';
import { FoodListing, ListingStatus, UserRole, RecipientGroup } from '../types';
import FoodCard from '../components/FoodCard';
import { Search, Filter, Map, List as ListIcon, MapPin, ChevronDown, CheckCircle2, Users, Loader2, Navigation, ExternalLink, Sparkles, LocateFixed } from 'lucide-react';
import { searchNearbyFoodSupport } from '../geminiService';

interface ListingsProps {
  listings: FoodListing[];
  onClaim: (id: string) => void;
  userRole?: UserRole;
}

const Listings: React.FC<ListingsProps> = ({ listings, onClaim, userRole }) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [claimingId, setClaimingId] = useState<string | null>(null);
  
  // Map Grounding & Location State
  const [locationLoading, setLocationLoading] = useState(false);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [mapInsight, setMapInsight] = useState<string | null>(null);

  const categories = ['All', ...new Set(listings.map(l => l.category))];
  const groups = ['All', ...Object.values(RecipientGroup)];

  const filtered = useMemo(() => {
    return listings.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === 'All' || l.category === filterCategory;
      const matchesGroup = filterGroup === 'All' || l.targetGroups?.includes(filterGroup as RecipientGroup);
      return (l.status === ListingStatus.AVAILABLE) && matchesSearch && matchesCategory && matchesGroup;
    });
  }, [search, filterCategory, filterGroup, listings]);

  useEffect(() => {
    if (viewMode === 'map') {
      handleFetchNearby();
    }
  }, [viewMode]);

  const handleFetchNearby = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setUserCoords({ lat: latitude, lng: longitude });
      const res = await searchNearbyFoodSupport(latitude, longitude);
      if (res) {
        setNearbyPlaces(res.sources);
        setMapInsight(res.text);
      }
      setLocationLoading(false);
    }, (err) => {
      console.error(err);
      setLocationLoading(false);
    });
  };

  const handleClaimInitiate = (id: string) => {
    if (userRole !== UserRole.NGO) {
      alert("Only verified NGOs / Food Banks can claim surplus food.");
      return;
    }
    setClaimingId(id);
  };

  const confirmClaim = () => {
    if (claimingId) {
      onClaim(claimingId);
      setClaimingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-700">
      {/* Confirmation Modal */}
      {claimingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => setClaimingId(null)}></div>
          <div className="relative bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-terracotta/10 rounded-[2rem] flex items-center justify-center text-terracotta mb-8 mx-auto">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="heading-serif text-4xl text-center text-charcoal mb-4">Claim this Surplus?</h3>
            <p className="text-charcoal/50 text-center font-medium mb-10 leading-relaxed">
              By claiming this item, it will be locked exclusively for your NGO / Food Bank. You will receive a unique OTP to verify collection at the donor's location.
            </p>
            <div className="flex flex-col gap-4">
              <button onClick={confirmClaim} className="w-full bg-terracotta text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-terracotta/20 hover:bg-terracotta/90 transition-all">Confirm & Generate OTP</button>
              <button onClick={() => setClaimingId(null)} className="w-full text-charcoal/40 font-black uppercase tracking-widest text-xs">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
        <div>
          <p className="text-terracotta font-black uppercase tracking-widest text-[10px] mb-4">Live Discovery</p>
          <h1 className="heading-serif text-6xl text-charcoal">Redistribute Surplus.</h1>
          <p className="text-charcoal/40 text-lg font-medium max-w-lg mt-4">Connecting surplus with community kitchens and NGOs in real-time.</p>
        </div>

        <div className="flex items-center bg-white p-2 rounded-3xl shadow-xl shadow-charcoal/5 border border-charcoal/5">
            <button 
                onClick={() => setViewMode('grid')}
                className={`flex items-center px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-charcoal text-white shadow-lg shadow-charcoal/20' : 'text-charcoal/30 hover:text-charcoal'}`}
            >
                <ListIcon size={14} className="mr-2" /> Feed View
            </button>
            <button 
                onClick={() => setViewMode('map')}
                className={`flex items-center px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-charcoal text-white shadow-lg shadow-charcoal/20' : 'text-charcoal/30 hover:text-charcoal'}`}
            >
                <Map size={14} className="mr-2" /> Local Map
            </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border border-charcoal/5 shadow-2xl shadow-charcoal/5 mb-20">
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/20 group-focus-within:text-terracotta transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder="Search by food name, donor, or ingredients..." 
                    className="w-full pl-16 pr-6 py-5 rounded-2xl bg-sand border-none outline-none focus:ring-2 focus:ring-terracotta/10 text-charcoal font-bold transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            <div className="flex items-center space-x-4 lg:w-1/2">
                <div className="relative w-1/2">
                    <select 
                        className="w-full bg-sand px-8 py-5 rounded-2xl border-none outline-none text-charcoal font-black uppercase tracking-widest text-[9px] appearance-none cursor-pointer"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-charcoal/30 pointer-events-none" />
                </div>
                <div className="relative w-1/2">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/20 pointer-events-none">
                      <Users size={14} />
                    </div>
                    <select 
                        className="w-full bg-sand pl-14 pr-8 py-5 rounded-2xl border-none outline-none text-charcoal font-black uppercase tracking-widest text-[9px] appearance-none cursor-pointer"
                        value={filterGroup}
                        onChange={(e) => setFilterGroup(e.target.value)}
                    >
                        {groups.map(g => <option key={g} value={g}>{g === 'All' ? 'All Recipients' : g}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-charcoal/30 pointer-events-none" />
                </div>
            </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filtered.length > 0 ? (
            filtered.map(food => (
              <FoodCard key={food.id} food={food} onViewDetails={handleClaimInitiate} />
            ))
          ) : (
            <div className="col-span-full py-40 text-center">
              <div className="w-24 h-24 bg-sand rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Search size={40} className="text-charcoal/10" />
              </div>
              <h3 className="heading-serif text-3xl mb-4 text-charcoal">No Surplus Found.</h3>
              <p className="text-charcoal/40 font-medium max-w-md mx-auto">Try widening your search radius or changing the food filters.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <div className="h-[600px] w-full bg-sand rounded-[4rem] flex items-center justify-center border border-charcoal/5 shadow-inner relative overflow-hidden group">
                {/* Background Radar Effect */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-96 h-96 border border-terracotta/10 rounded-full animate-ping"></div>
                  <div className="absolute w-[600px] h-[600px] border border-terracotta/5 rounded-full animate-pulse"></div>
                </div>

                {/* USER LOCATION MARKER */}
                {userCoords && (
                   <div className="absolute z-50 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <div className="relative">
                         <div className="w-12 h-12 bg-wheat/20 rounded-full animate-ping absolute -inset-0"></div>
                         <div className="w-6 h-6 bg-wheat rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-charcoal">
                            <LocateFixed size={12} />
                         </div>
                         <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-charcoal text-white text-[8px] font-black px-2 py-1 rounded-full whitespace-nowrap shadow-xl">
                            YOU ARE HERE
                         </div>
                      </div>
                   </div>
                )}

                <div className="relative z-10 bg-white/95 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl max-w-xs text-center border border-white">
                    {locationLoading ? (
                      <div className="animate-in zoom-in duration-500">
                        <Loader2 size={48} className="text-terracotta mx-auto mb-6 animate-spin" />
                        <h3 className="heading-serif text-2xl text-charcoal mb-4">Centering...</h3>
                        <p className="text-charcoal/40 text-sm">Identifying your location among surplus zones.</p>
                      </div>
                    ) : (
                      <div className="animate-in zoom-in duration-500">
                        <Navigation size={48} className="text-terracotta mx-auto mb-6 animate-bounce" />
                        <h3 className="heading-serif text-2xl text-charcoal mb-4">Search Area Locked.</h3>
                        <p className="text-charcoal/40 text-sm mb-6 leading-relaxed">Map centered on your GPS. Verified hubs are grounded from Google Maps.</p>
                        <button onClick={handleFetchNearby} className="text-[10px] font-black uppercase tracking-widest text-terracotta hover:underline">Refresh Search</button>
                      </div>
                    )}
                </div>

                {/* Simulated Pins for internal listings */}
                {filtered.map((l, i) => (
                  <div 
                    key={l.id} 
                    className="absolute z-20 cursor-pointer group/pin"
                    style={{ 
                       top: `${30 + (i * 15) + (Math.sin(i) * 10)}%`, 
                       left: `${20 + (i * 20) + (Math.cos(i) * 10)}%` 
                    }}
                    onClick={() => handleClaimInitiate(l.id)}
                  >
                    <div className="bg-terracotta text-white p-2 rounded-full shadow-lg group-hover/pin:scale-125 transition-transform">
                      <MapPin size={20} fill="currentColor" />
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap bg-charcoal text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-xl">
                      {l.name}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-charcoal text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
               <Sparkles className="absolute top-4 right-4 text-terracotta opacity-20 group-hover:scale-125 transition-transform" size={40} />
               <h4 className="font-black uppercase tracking-widest text-[10px] text-white/40 mb-4">Grounded Locations</h4>
               <p className="text-sm font-medium leading-relaxed italic text-white/80">
                 {mapInsight || "Switching to map centers the view on your location and finds real-world food support hubs nearby."}
               </p>
            </div>

            <div className="bg-white rounded-[3rem] p-8 border border-charcoal/5 shadow-xl max-h-[350px] overflow-y-auto scrollbar-hide">
              <h4 className="font-black uppercase tracking-widest text-[10px] text-charcoal/30 mb-6">Nearby Bin Centers & Hubs</h4>
              <div className="space-y-4">
                {nearbyPlaces.map((place, idx) => (
                  <a 
                    key={idx}
                    href={place.maps?.uri || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-sand/30 rounded-2xl border border-transparent hover:border-terracotta/20 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-charcoal group-hover:text-terracotta transition-colors">{place.maps?.title || "Community Hub"}</span>
                      <ExternalLink size={12} className="text-charcoal/20 group-hover:text-terracotta" />
                    </div>
                    <p className="text-[10px] font-medium text-charcoal/40 truncate">Verified via Google Maps Grounding</p>
                  </a>
                ))}
                {nearbyPlaces.length === 0 && !locationLoading && (
                  <p className="text-[10px] font-black text-charcoal/20 text-center py-10 uppercase tracking-widest">No hubs loaded yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listings;
