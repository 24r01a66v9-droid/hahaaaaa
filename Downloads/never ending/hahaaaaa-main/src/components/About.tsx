import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageIcon, Plus, X, Upload, Trash2, Camera, Star, Eye, EyeOff, Users, HandHeart, Sparkles, CalendarDays } from "lucide-react";
import { buildAuthRequestInit } from "../auth/fetchWithAuth";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AboutPhoto {
  id: string;
  url: string;
  caption: string;
  is_featured: boolean;
}

export default function About() {
  const { user } = useAuth();
  const normalizedRole = user?.role?.toLowerCase();
  const isAdmin = Boolean(
    normalizedRole === "admin" ||
    (user?.email && user.email === "24r01a66v9@cmrithyderabad.edu.in")
  );
  const [photos, setPhotos] = useState<AboutPhoto[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [featuredPhotoId, setFeaturedPhotoId] = useState<string | null>(null);
  const [showFeaturedImage, setShowFeaturedImage] = useState(true);
  const [bigPhoto, setBigPhoto] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ caption: "", category: "about", file: null as File | null });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/photos");
      if (response.ok) {
        const data = await response.json();
        // Keep the archive limited to 'about' photos
        const aboutPhotos = data
          .filter((p: any) => p.category === 'about')
          .map((p: any) => ({ ...p, caption: p.caption || p.title || "About Photo" }));
        setPhotos(aboutPhotos);

        // Only use `hero` images for the top featured banner. This prevents
        // about/team photos from showing above the mission/vision section.
        const hero = data.find((p: any) => p.category === 'hero');
        if (hero) {
          setFeaturedImage(hero.url);
          setFeaturedPhotoId(hero.id);
        } else {
          setFeaturedImage(null);
          setFeaturedPhotoId(null);
        }

        // big photo preference: hero > first about
        if (hero) setBigPhoto(hero.url);
        else if (aboutPhotos.length) setBigPhoto(aboutPhotos[0].url);
        else setBigPhoto(null);
      }
    } catch (e) {
      console.error("Failed to fetch about photos", e);
    }
  }; 

  // Load photos from API on mount
  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPhoto({ ...newPhoto, file: e.target.files[0] });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setNewPhoto({ ...newPhoto, file: e.dataTransfer.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.file) return;

    const formData = new FormData();
    formData.append("file", newPhoto.file);
    formData.append("title", newPhoto.caption || "About Moment");
    formData.append("category", newPhoto.category);
    formData.append("date", new Date().toLocaleDateString());
    // Only mark uploads as featured when the user explicitly chose the `hero` section
    formData.append("is_featured", newPhoto.category === "hero" ? "true" : "false");

    try {
      const response = await fetch("/api/photos", buildAuthRequestInit({
        method: "POST",
        body: formData,
      }));

      if (response.ok) {
        const result = await response.json();
        // If the upload was for the hero/main image, update the featured display.
        if (newPhoto.category === "hero") {
          setFeaturedImage(result.url);
          setFeaturedPhotoId(result.id);
          setShowFeaturedImage(true);
        }

        // Add to archive locally and then refresh from server. About-category uploads
        // will no longer override the featured image at the top of the page.
        setPhotos(prev => [{ id: result.id, url: result.url, caption: newPhoto.caption || "About Moment", is_featured: newPhoto.category === "hero" }, ...prev]);
        fetchPhotos();
        setIsAdding(false);
        setNewPhoto({ caption: "", category: "about", file: null });
      } else {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (e) {
      console.error("Failed to upload about photo", e);
      alert("An error occurred during upload. Please try again.");
    }
  };

  const featurePhoto = async (id: string) => {
    try {
      const response = await fetch(`/api/photos/${id}/feature`, buildAuthRequestInit({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "about" }),
      }));
      if (response.ok) {
        fetchPhotos();
      }
    } catch (e) {
      console.error("Failed to feature photo", e);
    }
  };

  const removePhoto = async (id: string) => {
    try {
      const response = await fetch(`/api/photos/${id}`, buildAuthRequestInit({ method: "DELETE" }));
      if (response.ok) {
        setPhotos(photos.filter(p => p.id !== id));
        if (photos.find(p => p.id === id)?.url === featuredImage) {
          setFeaturedImage(null);
        }
      }
    } catch (e) {
      console.error("Failed to delete about photo", e);
    }
  };

  return (
    <section id="about" className="py-32 px-6 bg-white overflow-hidden">
      {featuredImage && showFeaturedImage && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="relative -mx-6 mb-16 sm:-mx-8 lg:-mx-10"
        >
          <div className="relative h-[75vh] sm:h-[85vh] lg:h-[92vh] overflow-hidden rounded-b-[2.5rem] shadow-2xl">
            <div className="absolute right-4 top-4 z-10 flex gap-2 sm:right-6 sm:top-6">
              {isAdmin && featuredImage && (
                <button
                  onClick={() => setShowFeaturedImage(!showFeaturedImage)}
                  className="p-2 rounded-lg bg-white/90 text-brand-maroon shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
                  title={showFeaturedImage ? "Hide featured image" : "Show featured image"}
                >
                  {showFeaturedImage ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              )}
              {isAdmin && featuredImage && featuredPhotoId && (
                <button
                  onClick={() => removePhoto(featuredPhotoId)}
                  className="p-2 rounded-lg bg-red-600/90 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-red-600"
                  title="Remove featured image"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <img 
              src={featuredImage} 
              alt="About Featured" 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 mb-16 max-w-7xl mx-auto px-6"
      >
        <p className="max-w-3xl text-lg leading-relaxed text-brand-maroon/80 italic sm:text-xl">
          We work to support communities in need, raise awareness about important social causes, and inspire people to come together for a better tomorrow.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8" />
        <div className="space-y-16 mb-8 sm:mb-12">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-brand-maroon"></div>
            </div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              {isAdmin && (
                <button 
                  onClick={() => { setNewPhoto({ caption: "", category: "about", file: null }); setIsAdding(true); }}
                  className="flex items-center gap-3 bg-brand-maroon text-white px-8 py-5 rounded-full font-bold tracking-widest uppercase text-[10px] hover:bg-stone-900 transition-all shadow-xl shadow-brand-maroon/20 self-start"
                >
                  <Camera size={16} />
                  Add Team Photo
                </button>
              )}
            </div>

            <div className="space-y-8 text-brand-maroon/80 text-xl leading-relaxed">
              {/* Founded & Community Section */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-[2rem] border border-brand-maroon/10 bg-brand-maroon/5 p-5 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-maroon text-white">
                    <CalendarDays size={22} />
                  </div>
                  <span className="text-sm font-medium text-brand-maroon/80">Founded in 2021</span>
                </div>
                <div className="flex items-center gap-3 rounded-[2rem] border border-brand-maroon/10 bg-brand-maroon/5 p-5 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-maroon text-white">
                    <HandHeart size={22} />
                  </div>
                  <span className="text-sm font-medium text-brand-maroon/80">Community-led service</span>
                </div>
              </div>

              {/* Volunteers & Donation Drives Section */}
              <div className="grid gap-6 pt-4 sm:grid-cols-2">
                <div className="group rounded-[2rem] border border-brand-maroon/10 bg-brand-maroon/5 p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-brand-maroon text-white flex items-center justify-center mb-4">
                    <Users size={22} />
                  </div>
                  <h3 className="text-4xl font-serif text-brand-maroon mb-1">100+</h3>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-maroon/40">Volunteers</p>
                </div>
                <div className="group rounded-[2rem] border border-brand-maroon/10 bg-brand-maroon/5 p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-brand-maroon text-white flex items-center justify-center mb-4">
                    <HandHeart size={22} />
                  </div>
                  <h3 className="text-4xl font-serif text-brand-maroon mb-1">30+</h3>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-maroon/40">Donation Drives</p>
                </div>
              </div>

              {/* Awareness Section - Centered */}
              <div className="flex justify-center pt-0">
                <div className="group rounded-[2rem] border border-brand-maroon/10 bg-brand-maroon/5 p-6 shadow-sm w-full sm:w-1/2">
                  <div className="w-12 h-12 rounded-2xl bg-brand-maroon text-white flex items-center justify-center mb-4 mx-auto">
                    <Sparkles size={22} />
                  </div>
                  <h3 className="text-4xl font-serif text-brand-maroon mb-1 text-center">5+</h3>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-maroon/40 text-center">Awareness Programs</p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>

        {/* About Archive Section */}
        <div className="space-y-8">
          {photos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-stone-100 border border-stone-100"
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.caption}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                      <p className="text-white font-serif text-sm mb-4 leading-tight">{photo.caption}</p>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => featurePhoto(photo.id)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${photo.is_featured ? 'bg-brand-maroon text-white' : 'bg-white/20 backdrop-blur-md text-white hover:bg-brand-maroon'}`}
                            title="Set as Main Image"
                          >
                            <Star size={16} fill={photo.is_featured ? "currentColor" : "none"} />
                          </button>
                          <button 
                            onClick={() => removePhoto(photo.id)}
                            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-brand-maroon transition-colors"
                            title="Remove from archive"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-stone-900/90 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] p-12 shadow-2xl"
            >
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-8 right-8 text-stone-400 hover:text-stone-900 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-10">
                <span className="text-brand-red font-bold tracking-widest uppercase text-[10px] mb-2 block">Foundation Archive</span>
                <h3 className="text-4xl font-serif">Add Team Photo</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Section</label>
                  <div className="flex gap-3">
                    <div>
                      <span className="px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest bg-brand-maroon text-white shadow-lg shadow-brand-maroon/20">About Archive</span>
                      <p className="text-[10px] text-stone-400 mt-2">Team photos are always saved to the About archive and won't replace the page hero.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Caption</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Founding team meeting, 2021"
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-all font-serif"
                    value={newPhoto.caption}
                    onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                  />
                </div>

                <div 
                  className={`relative border-2 border-dashed rounded-[2.5rem] p-10 transition-all flex flex-col items-center justify-center text-center group ${
                    dragActive ? "border-brand-red bg-brand-red/5" : "border-stone-100 bg-stone-50 hover:bg-stone-100/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {newPhoto.file ? (
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden mb-6 shadow-xl border-4 border-white">
                        <img 
                          src={URL.createObjectURL(newPhoto.file)} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-stone-900 font-serif text-xs mb-2">{newPhoto.file.name}</p>
                      <button 
                        type="button"
                        onClick={() => setNewPhoto({ ...newPhoto, file: null })}
                        className="text-brand-red text-[10px] font-bold uppercase tracking-widest hover:underline"
                      >
                        Replace Image
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-stone-300 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                        <Upload size={20} />
                      </div>
                      <p className="text-stone-500 text-xs mb-2 font-serif">
                        Drop a team memory here
                      </p>
                      <p className="text-stone-400 text-[10px] uppercase tracking-widest">
                        or <span className="text-brand-red font-bold cursor-pointer">browse files</span>
                      </p>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                      />
                    </>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={!newPhoto.file}
                  className="w-full bg-stone-900 text-white py-6 rounded-2xl font-bold tracking-[0.2em] uppercase text-[10px] hover:bg-brand-red transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                >
                  {newPhoto.category === "hero" ? "Save as Hero" : "Save to Archive"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
