
import React from 'react';
import { FoodListing, FreshnessStatus, ListingStatus, UserRole, RecipientGroup } from '../types';
import { MapPin, CheckCircle2, Flame, Droplet, Zap, Users, Baby, Heart, PersonStanding, Calendar, Clock, Handshake } from 'lucide-react';

interface FoodCardProps {
  food: FoodListing;
  onViewDetails: (id: string) => void;
  userRole?: UserRole;
}

const FoodCard: React.FC<FoodCardProps> = ({ food, onViewDetails, userRole }) => {
  const getStatusStyles = (status: FreshnessStatus) => {
    switch (status) {
      case FreshnessStatus.URGENT:
        return 'bg-red-500 text-white border-red-600';
      case FreshnessStatus.USE_SOON:
        return 'bg-wheat text-charcoal border-wheat';
      default:
        return 'bg-emerald-600 text-white border-emerald-700';
    }
  };

  const getGroupIcon = (group: RecipientGroup) => {
    switch (group) {
      case RecipientGroup.CHILDREN: return <Baby size={12} />;
      case RecipientGroup.ELDERLY: return <Heart size={12} />;
      case RecipientGroup.PREGNANT_WOMEN: return <PersonStanding size={12} className="text-terracotta" />;
      default: return <Users size={12} />;
    }
  };

  const isClaimed = food.status === ListingStatus.CLAIMED;

  return (
    <div className={`bg-white rounded-[2.5rem] overflow-hidden border border-charcoal/5 hover:border-terracotta/20 hover:shadow-2xl transition-all group flex flex-col h-full ${isClaimed ? 'opacity-90' : ''}`}>
      <div className="relative h-60 w-full overflow-hidden">
        <img 
          src={food.imageUrl} 
          alt={food.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        
        {isClaimed ? (
          <div className="absolute inset-0 bg-emerald-600/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white px-6 py-2 rounded-full shadow-2xl flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-charcoal">Claimed & Reserved</span>
            </div>
          </div>
        ) : (
          <div className={`absolute top-5 left-5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg ${getStatusStyles(food.freshness)}`}>
            {food.freshness}
          </div>
        )}

        {/* Target Groups Overlay */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 pr-4">
          {food.targetGroups?.map(group => (
            <div key={group} className="bg-white/95 backdrop-blur shadow-sm px-3 py-1.5 rounded-full flex items-center gap-2 border border-charcoal/5">
              <span className="text-terracotta">{getGroupIcon(group)}</span>
              <span className="text-[9px] font-black uppercase tracking-tighter text-charcoal">{group}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
            <h3 className="text-2xl font-black text-charcoal leading-tight group-hover:text-terracotta transition-colors">
            {food.name}
            </h3>
            <span className="text-[9px] font-black text-charcoal/30 bg-charcoal/5 px-2.5 py-1.5 rounded uppercase ml-4 whitespace-nowrap">{food.category}</span>
        </div>

        <div className="flex items-center text-charcoal/40 text-[10px] font-black uppercase tracking-widest mb-4">
          <MapPin size={12} className="mr-2" />
          <span className="truncate">{food.location.address}</span>
        </div>

        {/* Servings Highlight */}
        <div className="mb-6 flex items-center gap-3 bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100">
          <Handshake size={16} className="text-emerald-600" />
          <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">
            Shared for {food.servings || 'multiple'} people
          </p>
        </div>

        {/* Nutritional grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-sand/30 p-4 rounded-3xl border border-charcoal/5 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-1.5 text-terracotta mb-1">
                    <Flame size={14} strokeWidth={3} />
                    <span className="text-sm font-black">{food.nutrition.calories}</span>
                </div>
                <p className="text-[8px] font-black uppercase text-charcoal/30 tracking-widest">Calories</p>
            </div>
            <div className="bg-sand/30 p-4 rounded-3xl border border-charcoal/5 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                    <Zap size={14} strokeWidth={3} />
                    <span className="text-sm font-black">{food.nutrition.carbs}g</span>
                </div>
                <p className="text-[8px] font-black uppercase text-charcoal/30 tracking-widest">Carbs</p>
            </div>
            <div className="bg-sand/30 p-4 rounded-3xl border border-charcoal/5 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-1.5 text-wheat mb-1">
                    <Droplet size={14} strokeWidth={3} />
                    <span className="text-sm font-black">{food.nutrition.fats}g</span>
                </div>
                <p className="text-[8px] font-black uppercase text-charcoal/30 tracking-widest">Fats</p>
            </div>
        </div>

        {/* Info Grid (3 columns for cleaner layout of dates) */}
        <div className="grid grid-cols-3 gap-2 mb-8">
            <div className="bg-charcoal text-white/90 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                <p className="text-[6px] font-black uppercase tracking-widest text-white/40 mb-1">Expires</p>
                <div className="flex items-center gap-1.5">
                    <Calendar size={10} className="text-terracotta" />
                    <p className="text-[9px] font-black">{new Date(food.expiryDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                </div>
            </div>
            <div className="bg-charcoal text-white/90 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                <p className="text-[6px] font-black uppercase tracking-widest text-white/40 mb-1">Prepared</p>
                <div className="flex items-center gap-1.5">
                    <Calendar size={10} className="text-wheat" />
                    <p className="text-[9px] font-black">{food.preparedDate ? new Date(food.preparedDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'N/A'}</p>
                </div>
            </div>
            <div className="bg-charcoal text-white/90 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                <p className="text-[6px] font-black uppercase tracking-widest text-white/40 mb-1">Prep Time</p>
                <div className="flex items-center gap-1.5">
                    <Clock size={10} className="text-emerald-400" />
                    <p className="text-[9px] font-black truncate max-w-full">{food.cookingTime || 'N/A'}</p>
                </div>
            </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-charcoal/5">
            <button 
                onClick={() => onViewDetails(food.id)}
                disabled={isClaimed}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-[0.98] ${
                  isClaimed
                    ? 'bg-charcoal/10 text-charcoal/30 cursor-not-allowed shadow-none' 
                    : 'bg-terracotta text-white hover:bg-terracotta/90 shadow-terracotta/10 shadow-lg'
                }`}
            >
                {isClaimed ? 'Awaiting Handover' : 'Claim Surplus'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
