import { useState } from "react";
import { motion } from "motion/react";
import { Heart, ShieldCheck, Users, Star } from "lucide-react";

export default function MissionVision() {
  const [selectedValue, setSelectedValue] = useState("Compassion");
  const values = [
    { name: "Compassion", icon: Heart },
    { name: "Transparency", icon: Users },
    { name: "Accountability", icon: ShieldCheck },
    { name: "Dignity for All", icon: Users },
    { name: "Service Before Self", icon: Star },
  ];

  return (
    <section id="about" className="pt-2 pb-24 px-6 bg-brand-cream relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-brand-maroon rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-12 lg:p-16 rounded-[5rem] shadow-2xl border border-stone-100 relative grid md:grid-cols-1 gap-12"
          >
            <div>
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 bg-brand-maroon text-white rounded-3xl flex items-center justify-center shadow-xl shadow-brand-maroon/20">
                  <Heart size={36} />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif mb-2 tracking-tight italic text-brand-maroon">Our Vision & Mission</h2>
                </div>
              </div>
              <ul className="space-y-4 text-brand-maroon/80 text-base md:text-lg leading-relaxed max-w-4xl">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-maroon mt-2.5 shrink-0" />
                  <span className="whitespace-nowrap">To support children in orphanages and care for elderly in old-age homes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-maroon mt-2.5 shrink-0" />
                  <span className="whitespace-nowrap">To provide financial assistance for medical treatments and education.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-maroon mt-2.5 shrink-0" />
                  <span className="whitespace-nowrap">To inspire youth to participate in meaningful social service.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-maroon mt-2.5 shrink-0" />
                  <span className="whitespace-normal leading-relaxed">To build a society where no child is deprived of education, no elderly person feels neglected, and communities come together to uplift one another.</span>
                </li>
              </ul>
            </div>


          </motion.div>
        </div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <h3 className="text-[11px] uppercase tracking-[0.45em] text-brand-maroon font-bold mb-16 flex items-center gap-4 opacity-95">
              <div className="h-px w-8 bg-brand-maroon/80" />
              <span className="text-brand-maroon/90 tracking-[0.55em]">Our Core Values</span>
              <div className="h-px w-8 bg-brand-maroon/80" />
            </h3>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-8 pb-4 md:gap-12">
            {values.map((value, i) => {
              const isSelected = selectedValue === value.name;
              return (
                <motion.button
                  type="button"
                  key={value.name}
                  onClick={() => setSelectedValue(value.name)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                  className={`flex flex-col items-center gap-4 w-[170px] md:w-[200px] group p-6 rounded-[2rem] border transition-all duration-300 focus:outline-none ${
                    isSelected
                      ? "bg-brand-maroon/10 shadow-[0_24px_60px_-25px_rgba(128,0,0,0.45)] border-brand-maroon"
                      : "bg-white/95 shadow-[0_20px_60px_-30px_rgba(194,25,25,0.45)] border-brand-red/10"
                  }`}
                >
                  <div className={`w-16 h-16 rounded-[1.6rem] border flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? "border-brand-maroon bg-brand-maroon/15 text-brand-maroon"
                      : "border-brand-red/80 bg-brand-red/5 text-brand-red group-hover:text-brand-red/90 group-hover:border-brand-red"
                  }`}>
                    <value.icon size={28} />
                  </div>
                  <span className={`font-serif text-2xl md:text-3xl italic text-center transition-colors duration-300 ${
                    isSelected ? "text-brand-maroon" : "text-brand-maroon/90"
                  }`}>{value.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
