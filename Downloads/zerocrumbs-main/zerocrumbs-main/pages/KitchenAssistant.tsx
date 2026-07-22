
import React, { useState } from 'react';
import { ChefHat, Search, Sparkles, Loader2, BookOpen, Clock, Lightbulb } from 'lucide-react';
import { getKitchenTips } from '../geminiService';

const KitchenAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    const result = await getKitchenTips(input);
    setTips(result);
    setLoading(false);
  };

  return (
    <div className="bg-sand min-h-screen py-24 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-terracotta rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-terracotta/20">
            <ChefHat size={40} />
          </div>
          <h1 className="heading-serif text-6xl text-charcoal mb-6">Kitchen <span className="text-terracotta italic">Assistant.</span></h1>
          <p className="text-lg text-charcoal/40 font-medium max-w-xl mx-auto">
            Got surplus ingredients? Let Gemini generate large-scale community recipes and preservation hacks.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-16">
          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl flex items-center border border-charcoal/5">
            <div className="flex-grow flex items-center pl-6">
              <Search className="text-charcoal/20 mr-4" size={24} />
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., 5kg stale sourdough, 10 crates of bruised apples..."
                className="w-full py-4 text-charcoal font-bold text-lg outline-none placeholder:text-charcoal/20"
              />
            </div>
            <button 
              disabled={loading}
              className="bg-terracotta text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-terracotta/90 transition-all shadow-xl shadow-terracotta/10 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              Ask Chef Gemini
            </button>
          </div>
        </form>

        {tips && (
          <div className="bg-white rounded-[4rem] p-12 lg:p-20 shadow-2xl border border-charcoal/5 animate-in slide-in-from-bottom-12 duration-700">
             <div className="flex items-center gap-4 mb-12">
               <div className="w-12 h-12 bg-sand rounded-2xl flex items-center justify-center text-terracotta">
                 <BookOpen size={24} />
               </div>
               <h2 className="heading-serif text-4xl text-charcoal">Rescued Culinary Tips</h2>
             </div>
             <div className="prose prose-lg prose-terracotta max-w-none text-charcoal/70 font-medium">
                {tips.split('\n').map((line, i) => (
                  <p key={i} className="mb-4 leading-relaxed">{line}</p>
                ))}
             </div>
             <div className="mt-16 pt-16 border-t border-charcoal/5 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-sand/30 p-8 rounded-3xl">
                  <div className="flex items-center text-terracotta mb-4">
                    <Clock size={20} className="mr-3" />
                    <span className="font-black uppercase tracking-widest text-xs">Storage Hack</span>
                  </div>
                  <p className="text-sm font-bold text-charcoal/60">Keep this surplus in air-tight containers with a slice of bread to maintain moisture if it's bakery goods.</p>
                </div>
                <div className="bg-sand/30 p-8 rounded-3xl">
                  <div className="flex items-center text-emerald-500 mb-4">
                    <Lightbulb size={20} className="mr-3" />
                    <span className="font-black uppercase tracking-widest text-xs">Nutrition Tip</span>
                  </div>
                  <p className="text-sm font-bold text-charcoal/60">Slow cooking this item will preserve the vitamin C levels which might degrade in high-heat frying.</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenAssistant;
