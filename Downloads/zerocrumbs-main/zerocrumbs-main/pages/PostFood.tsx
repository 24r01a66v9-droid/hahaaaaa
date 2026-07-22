
import React, { useState, useRef } from 'react';
import { Camera, Loader2, AlertCircle, Sparkles, CheckCircle2, Apple, Zap, Activity, Clock, Users, Handshake, Calendar } from 'lucide-react';
import { analyzeFoodImage } from '../geminiService';
import { FoodCategory, RecipientGroup } from '../types';

interface PostFoodProps {
  onPostSuccess: (foodName: string) => void;
}

const PostFood: React.FC<PostFoodProps> = ({ onPostSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = (reader.result as string);
      setPreview(base64Data);
      setLoading(true);
      
      const base64 = base64Data.split(',')[1];
      const result = await analyzeFoodImage(base64);
      setAnalyzedData(result);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foodName = (e.target as any).elements[0].value || (analyzedData?.name || "Surplus Item");
    onPostSuccess(foodName);
    setSuccess(true);
    setTimeout(() => {
        setSuccess(false);
        setAnalyzedData(null);
        setPreview(null);
    }, 6000);
  };

  if (success) {
      return (
          <div className="max-w-2xl mx-auto py-32 px-4 text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-500/10">
                  <CheckCircle2 size={48} className="text-emerald-600" />
              </div>
              <h2 className="heading-serif text-5xl mb-6 text-charcoal">Surplus Food Posted Successfully</h2>
              <p className="text-charcoal/50 text-xl font-medium mb-12">Your item is now visible to nearby NGOs / Food Banks. You’ll be notified once it’s claimed.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="bg-charcoal text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-charcoal/90 transition-all shadow-xl"
              >
                  Post Another Surplus
              </button>
          </div>
      )
  }

  return (
    <div className="max-w-6xl mx-auto py-20 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between mb-16">
        <div>
            <p className="text-terracotta font-black uppercase tracking-widest text-[10px] mb-2">Donor Dashboard</p>
            <h1 className="heading-serif text-5xl text-charcoal">Share your Surplus.</h1>
        </div>
        <div className="hidden md:flex items-center space-x-4 bg-white p-2 rounded-2xl border border-charcoal/5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-sand flex items-center justify-center text-terracotta"><Zap size={20}/></div>
            <div className="pr-4"><p className="text-[10px] font-black uppercase text-charcoal/30">AI Assisted</p><p className="text-xs font-bold text-charcoal">Fast Posting</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5 space-y-8">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative border-2 border-dashed border-charcoal/10 rounded-[3rem] p-4 flex flex-col items-center justify-center bg-white hover:bg-sand/50 hover:border-terracotta/30 transition-all cursor-pointer overflow-hidden min-h-[400px] shadow-xl shadow-charcoal/5"
          >
            {preview ? (
                <div className="relative w-full h-full min-h-[360px] rounded-[2.5rem] overflow-hidden">
                    <img src={preview} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="text-white" size={48} />
                    </div>
                </div>
            ) : (
                <div className="text-center p-12">
                    <div className="w-20 h-20 bg-sand rounded-[2rem] flex items-center justify-center shadow-sm mb-6 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                        <Camera className="text-terracotta" size={36} />
                    </div>
                    <p className="text-charcoal font-black text-xl mb-3">Snap & Auto-Fill</p>
                    <p className="text-charcoal/40 text-sm font-medium leading-relaxed">Gemini will automatically extract nutritional data and category from your photo.</p>
                </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
                <div className="relative">
                    <Loader2 className="animate-spin text-terracotta" size={64} />
                    <Sparkles className="absolute -top-2 -right-2 text-wheat animate-pulse" size={24} />
                </div>
                <p className="text-charcoal font-black text-lg mt-8 uppercase tracking-widest">AI Analysis...</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="bg-wheat/10 rounded-[2.5rem] p-8 border border-wheat/20 flex items-start space-x-6">
            <AlertCircle className="text-wheat mt-1 flex-shrink-0" size={24} />
            <div>
                <p className="text-charcoal font-black uppercase text-xs tracking-widest mb-2">Safety Pledge</p>
                <p className="text-charcoal/60 text-sm font-medium leading-relaxed italic">"I confirm this food is safe for consumption and handled correctly."</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-12 border border-charcoal/5 shadow-2xl shadow-charcoal/5 space-y-10">
                <div className="flex items-center space-x-3 text-terracotta mb-2">
                    <Sparkles size={18} />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Surplus Data Point</span>
                </div>

                <div className="space-y-8">
                    <div className="group">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-3 group-focus-within:text-terracotta transition-colors">Food Item Name</label>
                        <input 
                            type="text" 
                            defaultValue={analyzedData?.name || ''}
                            className="w-full bg-sand px-8 py-5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-terracotta/20 text-charcoal font-bold transition-all" 
                            placeholder="e.g., Seasonal Seafood Platter"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-3">Category</label>
                            <select 
                                className="w-full bg-sand px-8 py-5 rounded-2xl border-none outline-none text-charcoal font-bold appearance-none cursor-pointer"
                                value={analyzedData?.category || ''}
                            >
                                {Object.values(FoodCategory).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-3">Quantity (Total)</label>
                            <input 
                                type="text" 
                                defaultValue={analyzedData?.quantity || ''}
                                className="w-full bg-sand px-8 py-5 rounded-2xl border-none outline-none text-charcoal font-bold" 
                                placeholder="e.g., 5kg / 10 portions"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-3 flex items-center">
                            <Handshake size={12} className="mr-2" /> Shared for X People (Estimated Servings)
                        </label>
                        <input 
                            type="number" 
                            defaultValue={analyzedData?.servings || ''}
                            className="w-full bg-sand px-8 py-5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-terracotta/20 text-charcoal font-bold transition-all" 
                            placeholder="e.g., 56"
                            required
                        />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-3 flex items-center">
                        <Users size={12} className="mr-2" /> Suggested Recipient Groups (AI Matched)
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {Object.values(RecipientGroup).map(group => (
                          <label key={group} className={`flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all border ${analyzedData?.targetGroups?.includes(group) ? 'bg-terracotta text-white border-terracotta shadow-lg' : 'bg-sand text-charcoal/40 border-transparent hover:border-terracotta/30'}`}>
                             <input 
                              type="checkbox" 
                              className="hidden" 
                              defaultChecked={analyzedData?.targetGroups?.includes(group)}
                            />
                             {group}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Timeline Grid (4 elements for precision) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-3 flex items-center">
                                <Calendar size={12} className="mr-2 text-black font-black" />
                                Prepared Date
                                </label>
                                <input 
                                    type="date" 
                                    defaultValue={analyzedData?.preparedDate || ''}
                                    className="w-full bg-sand px-6 py-5 rounded-2xl border-none outline-none text-charcoal font-bold text-xs" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-3 flex items-center">
                                <Activity size={12} className="mr-2 text-black font-black" />
                                Expiry Date
                                </label>
                                <input type="date" className="w-full bg-sand px-6 py-5 rounded-2xl border-none outline-none text-charcoal font-bold text-xs" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-3 flex items-center">
                                <Clock size={12} className="mr-2 text-black font-black" />
                                Prepared Time
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full bg-sand px-6 py-5 rounded-2xl border-none outline-none text-charcoal font-bold text-xs" 
                                    placeholder="e.g., 30 mins"
                                    defaultValue={analyzedData?.cookingTime || ''}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-3 flex items-center">
                                <Clock size={12} className="mr-2 text-black font-black" />
                                Pickup Until
                                </label>
                                <input type="time" className="w-full bg-sand px-6 py-5 rounded-2xl border-none outline-none text-charcoal font-bold text-xs" required />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-charcoal rounded-[2rem] text-white">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Nutritional Profile (AI Estimate)</p>
                            <Activity size={16} className="text-terracotta" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <NutritionMetric label="Calories" value={analyzedData?.nutrition?.calories || '-'} unit="kcal" />
                            <NutritionMetric label="Protein" value={analyzedData?.nutrition?.protein || '-'} unit="g" />
                            <NutritionMetric label="Carbs" value={analyzedData?.nutrition?.carbs || '-'} unit="g" />
                            <NutritionMetric label="Fats" value={analyzedData?.nutrition?.fats || '-'} unit="g" />
                        </div>
                    </div>
                </div>

                <button className="w-full bg-terracotta text-white py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-2xl hover:shadow-terracotta/20 transition-all active:scale-[0.98]">
                    Broadcast to Local NGOs / Food Banks
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

const NutritionMetric = ({ label, value, unit }: { label: string, value: any, unit: string }) => (
    <div className="text-center md:text-left">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{label}</p>
        <div className="flex items-baseline justify-center md:justify-start">
            <span className="text-2xl font-black text-white">{value}</span>
            <span className="text-[10px] text-white/40 ml-1 font-bold">{unit}</span>
        </div>
    </div>
);

export default PostFood;
