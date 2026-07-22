
import React, { useState, useRef } from 'react';
import { Camera, ShieldCheck, AlertTriangle, Search, Loader2, Sparkles, X, CheckCircle2, Info } from 'lucide-react';
import { scanFoodSafety } from '../geminiService';

const SafetyScanner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
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
      const safetyResult = await scanFoodSafety(base64);
      setResult(safetyResult);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
  };

  const getVerdictStyles = (verdict: string) => {
    switch (verdict?.toLowerCase()) {
      case 'safe':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'caution':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'unsafe':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-sand text-charcoal border-charcoal/5';
    }
  };

  return (
    <div className="bg-sand min-h-screen py-24 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-emerald-500/20">
            <ShieldCheck size={40} />
          </div>
          <h1 className="heading-serif text-6xl text-charcoal mb-6">Safety <span className="text-emerald-500 italic">Scanner.</span></h1>
          <p className="text-lg text-charcoal/40 font-medium max-w-xl mx-auto">
            Our Gemini AI vision system checks for signs of spoilage, mold, and discoloration to ensure quality redistribution.
          </p>
        </div>

        {!preview ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white border-2 border-dashed border-charcoal/10 rounded-[4rem] p-20 flex flex-col items-center justify-center hover:bg-emerald-50/30 hover:border-emerald-500/30 transition-all cursor-pointer shadow-2xl shadow-charcoal/5 min-h-[500px]"
          >
            <div className="w-24 h-24 bg-sand rounded-[2rem] flex items-center justify-center text-emerald-500 mb-8 shadow-sm">
              <Camera size={48} />
            </div>
            <h3 className="heading-serif text-3xl text-charcoal mb-4">Upload or Snap Food</h3>
            <p className="text-charcoal/40 text-sm font-bold uppercase tracking-widest">Verify before sharing</p>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-in slide-in-from-bottom-8 duration-700">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white group">
              <img src={preview} className="w-full aspect-square object-cover" />
              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
                  <div className="relative">
                    <Loader2 className="animate-spin text-emerald-500" size={80} />
                    <Sparkles className="absolute -top-2 -right-2 text-wheat animate-pulse" size={32} />
                  </div>
                  <p className="text-charcoal font-black text-xl mt-10 uppercase tracking-[0.4em]">Analyzing Quality...</p>
                </div>
              )}
              {!loading && (
                <button 
                  onClick={reset}
                  className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur rounded-full text-charcoal shadow-xl hover:text-red-500 transition-all"
                >
                  <X size={24} />
                </button>
              )}
            </div>

            {result && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className={`p-10 rounded-[3rem] border-2 shadow-xl ${getVerdictStyles(result.safetyVerdict)}`}>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Gemini Verdict</span>
                    {result.safetyVerdict === 'Safe' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                  </div>
                  <h2 className="heading-serif text-5xl mb-4">{result.safetyVerdict}</h2>
                  <div className="flex items-end gap-2 mb-8">
                    <span className="text-6xl font-black leading-none">{result.freshnessScore}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">/ 100 Freshness</span>
                  </div>
                  <p className="text-lg font-bold leading-relaxed">{result.recommendation}</p>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-charcoal/5 shadow-xl">
                  <h3 className="font-black uppercase tracking-widest text-xs text-charcoal/30 mb-8 flex items-center">
                    <Search size={16} className="mr-2" /> AI Observations
                  </h3>
                  <ul className="space-y-6">
                    {result.observations.map((obs: string, i: number) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-sand flex items-center justify-center flex-shrink-0 text-[10px] font-black">
                          {i + 1}
                        </div>
                        <p className="text-charcoal/70 font-medium text-sm leading-relaxed">{obs}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {result.safeToRedistribute && (
                  <div className="bg-emerald-500 text-white p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl shadow-emerald-500/20">
                    <div className="flex items-center gap-4">
                      <ShieldCheck size={32} />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified</p>
                        <p className="font-black">Safe to Redistribute</p>
                      </div>
                    </div>
                    <button className="bg-white text-emerald-500 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:shadow-lg transition-all">
                      Post Now
                    </button>
                  </div>
                )}
                
                <div className="bg-white/50 backdrop-blur p-8 rounded-[2.5rem] border border-charcoal/5">
                   <div className="flex items-center gap-3 text-charcoal/40 mb-4">
                     <Info size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest">AI Disclaimer</span>
                   </div>
                   <p className="text-[10px] font-bold text-charcoal/30 leading-relaxed italic">
                     Our AI scanner provides estimations based on visual patterns. Always follow local food safety regulations and use your best judgment. ZeroCrumbs is not liable for health risks.
                   </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyScanner;
