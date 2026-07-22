
import React, { useState } from 'react';
import { UserRole, Review } from '../types';
import { MessageSquare, Star, Quote, CheckCircle2, ShieldCheck, X, Send, User, ChevronDown } from 'lucide-react';

interface ReviewsProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
  user: { name: string; role: UserRole } | null;
}

const Reviews: React.FC<ReviewsProps> = ({ reviews, onAddReview, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState(user?.name || '');
  const [authorRole, setAuthorRole] = useState<UserRole>(user?.role || UserRole.DONOR);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !authorName.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newReview: Review = {
        id: `r${Date.now()}`,
        authorName,
        authorRole,
        targetId: 'Ecosystem',
        rating,
        content,
        date: 'Just now',
        isVerified: !!user
      };

      onAddReview(newReview);
      setIsSubmitting(false);
      setIsModalOpen(false);
      resetForm();
    }, 1200);
  };

  const resetForm = () => {
    setContent('');
    setRating(5);
    if (!user) {
        setAuthorName('');
        setAuthorRole(UserRole.DONOR);
    }
  };

  return (
    <div className="bg-sand min-h-screen py-24 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-24">
          <p className="text-terracotta font-black uppercase tracking-[0.4em] text-[10px] mb-6">Trust & Transparency</p>
          <h1 className="heading-serif text-6xl md:text-8xl text-charcoal leading-[0.9] mb-8">Voices of our <br/><span className="text-terracotta">Community.</span></h1>
          <p className="text-xl text-charcoal/40 font-medium leading-relaxed">
            Verified testimonials from donors and NGOs who are making zero-waste a reality, one plate at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-[3rem] p-10 border border-charcoal/5 shadow-xl hover:shadow-2xl transition-all group flex flex-col animate-in fade-in zoom-in duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="flex text-wheat">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-charcoal/10"} />
                  ))}
                </div>
                {review.isVerified && (
                  <div className="flex items-center text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck size={14} className="mr-1.5" /> Verified
                  </div>
                )}
              </div>
              
              <Quote size={40} className="text-terracotta/10 mb-6 group-hover:scale-110 transition-transform origin-left" />
              
              <p className="text-charcoal/70 font-medium italic mb-10 leading-relaxed text-lg">
                "{review.content}"
              </p>

              <div className="mt-auto pt-8 border-t border-charcoal/5 flex items-center space-x-4">
                <div className="w-12 h-12 bg-sand rounded-2xl flex items-center justify-center text-terracotta">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-black text-charcoal text-sm uppercase tracking-tight">{review.authorName}</p>
                  <p className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest">{review.authorRole} • {review.date}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-terracotta rounded-[3rem] p-10 flex flex-col items-center justify-center text-center text-white shadow-2xl shadow-terracotta/20 animate-in fade-in zoom-in duration-500 delay-150">
            <CheckCircle2 size={48} className="mb-8" />
            <h3 className="heading-serif text-3xl mb-4">Join the Trust Network.</h3>
            <p className="text-white/60 text-sm font-medium mb-10 leading-relaxed">Your feedback helps us maintain high safety standards and reliable redistribution.</p>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-terracotta px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all active:scale-95 shadow-lg shadow-black/5"
            >
              Write a Review
            </button>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-[3.5rem] w-full max-w-2xl shadow-2xl border border-charcoal/5 animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-10 sm:p-14">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="absolute top-10 right-10 p-4 bg-sand rounded-full text-charcoal/30 hover:text-terracotta transition-all disabled:opacity-30"
                >
                  <X size={20} />
                </button>

                <div className="mb-12">
                    <p className="text-terracotta font-black uppercase tracking-[0.3em] text-[10px] mb-4">Community Feedback</p>
                    <h2 className="heading-serif text-5xl text-charcoal">Share your <span className="italic">Voice.</span></h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-6">Experience Rating</p>
                        <div className="flex items-center space-x-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform active:scale-90 hover:scale-110"
                                >
                                    <Star 
                                        size={36} 
                                        strokeWidth={2}
                                        fill={(hoverRating || rating) >= star ? '#E3B23C' : 'none'}
                                        className={(hoverRating || rating) >= star ? 'text-wheat' : 'text-charcoal/10'}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-3">Your Name</label>
                            <input 
                                type="text"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                placeholder="e.g., Sarah Johnson"
                                className="w-full bg-sand px-8 py-5 rounded-2xl border-none outline-none font-bold text-charcoal focus:ring-2 focus:ring-terracotta/20 transition-all"
                                required
                                disabled={!!user}
                            />
                        </div>
                        <div className="relative">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-3">Ecosystem Role</label>
                            <select 
                                value={authorRole}
                                onChange={(e) => setAuthorRole(e.target.value as UserRole)}
                                className="w-full bg-sand px-8 py-5 rounded-2xl border-none outline-none font-bold text-charcoal appearance-none cursor-pointer focus:ring-2 focus:ring-terracotta/20 transition-all"
                                required
                                disabled={!!user}
                            >
                                <option value={UserRole.DONOR}>Food Donor</option>
                                <option value={UserRole.NGO}>NGO / Food Bank</option>
                                <option value={UserRole.VOLUNTEER}>Volunteer</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-[65%] -translate-y-1/2 text-charcoal/20 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-3">Your Testimonial</label>
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Tell the community how ZeroCrumbs has impacted your mission..."
                            className="w-full bg-sand px-8 py-6 rounded-3xl border-none outline-none font-bold text-charcoal min-h-[160px] resize-none focus:ring-2 focus:ring-terracotta/20 transition-all"
                            required
                        ></textarea>
                    </div>

                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-terracotta text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-terracotta/30 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <X className="animate-spin" size={16} />
                                <span>Publishing...</span>
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                <span>Broadcast Testimonial</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
