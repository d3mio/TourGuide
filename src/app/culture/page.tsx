"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/store";
import { CULTURE_ITEMS, PILLARS_DATA } from "@/data/mockData";
import { Landmark, Compass, ArrowRight, X } from "lucide-react";

// Image mapping for culture items
const CULTURE_IMAGES: Record<string, string> = {
  "Kandyan Dance": "https://images.unsplash.com/photo-1608958416719-74d32a9fe643?q=80&w=800&auto=format&fit=crop",
  "The Art of Ceylon Tea": "https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop",
  "Rock Fortresses & Dagobas": "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=800&auto=format&fit=crop",
  "Kandy Esala Perahera": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
  "Spice & Curry Traditions": "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop",
  "Sacred Multi-Faith Coexistence": "https://images.unsplash.com/photo-1563968743333-044cef800494?q=80&w=800&auto=format&fit=crop",
  "Dumbara Mat Weaving": "https://images.unsplash.com/photo-1531835551805-16d864c8d311?q=80&w=800&auto=format&fit=crop",
  "Ancient Maritime Culture": "https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=800&auto=format&fit=crop"
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=800&auto=format&fit=crop";

function CultureContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePillar, setActivePillar] = useState<keyof typeof PILLARS_DATA | null>(null);

  // Auto-open pillar details if requested via query parameter
  useEffect(() => {
    const pillarParam = searchParams.get("pillar");
    if (pillarParam && pillarParam in PILLARS_DATA) {
      setActivePillar(pillarParam as keyof typeof PILLARS_DATA);
    }
  }, [searchParams]);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 font-sans">
      {/* Section Header */}
      <div className="mb-12">
        <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-3 block">
          {t("cult_eyebrow") || "Heritage & Living Traditions"}
        </span>
        <h1 className="font-serif text-[2.5rem] md:text-[3.2rem] leading-tight mb-4 text-textcolor">
          {t("cult_title") || "Culture of Ceylon"}
        </h1>
        <p className="text-muted text-[0.88rem] md:text-[0.95rem] max-w-2xl">
          {t("cult_sub") || "An editorial journey through the arts, cuisine, architecture, and festivals that define the island's soul."}
        </p>
      </div>

      {/* The Eight Pillars Section */}
      <div className="mb-24">
        <div className="mb-10">
          <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-2 block">
            {t("pillars_eyebrow") || "Travel Themes"}
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-textcolor mb-3">
            {t("pillars_title") || "The Eight Pillars of Sri Lanka"}
          </h2>
          <p className="text-muted text-xs md:text-sm max-w-2xl">
            {t("pillars_desc") || "Our curated experiences are built upon eight rich thematic pillars. Click a pillar to open its cultural interpretation page and highlights."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Object.entries(PILLARS_DATA).map(([key, data]) => {
            const IconComponent = data.icon;
            return (
              <div 
                key={key}
                onClick={() => setActivePillar(key as keyof typeof PILLARS_DATA)}
                className="group relative h-[280px] rounded-xl overflow-hidden border border-bordercolor bg-surface cursor-pointer hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 shadow-md"
              >
                {/* Background image overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ 
                    backgroundImage: `linear-gradient(to top, rgba(9, 9, 11, 0.95) 0%, rgba(9, 9, 11, 0.4) 50%, rgba(9, 9, 11, 0.1) 100%), url(${data.bg})` 
                  }}
                />
                
                {/* Card Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  <div className="w-10 h-10 rounded-lg bg-accentdim/20 border border-accent/30 text-accent flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white group-hover:border-transparent transition-all duration-300">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg mb-1 text-textcolor">{data.title.split(' & ')[0]}</h3>
                  <p className="text-[0.7rem] text-muted mb-3">{data.tagline}</p>
                  
                  <span className="text-[0.7rem] font-bold text-accent flex items-center gap-1.5 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    View Interpretation <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of Culture Cards (Living Traditions) */}
      <div>
        <div className="mb-10">
          <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-2 block">
            Living Traditions
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-textcolor mb-3">
            Heritage & Arts
          </h2>
          <p className="text-muted text-xs md:text-sm max-w-2xl">
            Explore centuries-old art forms, culinary heritage, and unique local crafting techniques kept alive across generations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CULTURE_ITEMS.map((c, i) => {
            const Icon = c.Icon;
            const imageSrc = CULTURE_IMAGES[c.title] || DEFAULT_IMAGE;
            
            return (
              <div 
                key={i} 
                className="group relative h-[360px] rounded-2xl overflow-hidden border border-bordercolor bg-surface hover:border-accent/40 transition-all duration-300 shadow-sm"
              >
                {/* Photo background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ 
                    backgroundImage: `linear-gradient(to top, rgba(9, 9, 11, 0.98) 0%, rgba(9, 9, 11, 0.6) 50%, rgba(9, 9, 11, 0.2) 100%), url(${imageSrc})` 
                  }}
                />
 
                {/* Icon Overlay (top-right) */}
                <div className="absolute top-5 right-5 w-10 h-10 rounded-lg bg-surface/80 backdrop-blur-sm border border-bordercolor text-muted group-hover:text-accent group-hover:border-accent/40 flex items-center justify-center transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
 
                {/* Cover Card Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-10 pointer-events-none">
                  <span className="text-[0.65rem] tracking-wider uppercase font-bold text-accent mb-2 block">
                    {c.tag}
                  </span>
                  
                  <h3 className="font-serif text-xl md:text-2xl text-textcolor mb-3">
                    {c.title}
                  </h3>
                  
                  <p className="text-xs md:text-[0.82rem] text-muted leading-relaxed max-w-lg transition-colors group-hover:text-textcolor/90">
                    {c.desc}
                  </p>
                </div>
 
              </div>
            );
          })}
        </div>
      </div>
 
      {/* Slide Drawer for Travel Pillars (Overlay Panel) */}
      <div 
        className={`drawer-overlay ${activePillar ? 'open' : ''}`}
        onClick={() => setActivePillar(null)}
      >
        <div 
          className="drawer"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => setActivePillar(null)}
            className="drawer-close-btn"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
 
          {activePillar && (
            <div className="flex flex-col h-full">
              {/* Dynamic Banner */}
              <div 
                className="w-[calc(100%+4rem)] -ml-8 -mt-12 h-[220px] bg-cover bg-center mb-6 relative"
                style={{ 
                  backgroundImage: `linear-gradient(to top, var(--surface) 0%, rgba(9,9,11,0.3) 100%), url(${PILLARS_DATA[activePillar].bg})` 
                }}
              />
              
              <div className="mb-6">
                <span className="text-[0.65rem] tracking-[0.15em] uppercase text-accent font-bold mb-1 block">
                  Cultural Interpretation
                </span>
                <h2 className="font-serif text-3xl mb-1 text-textcolor">{PILLARS_DATA[activePillar].title}</h2>
                <p className="text-xs text-muted font-medium italic">{PILLARS_DATA[activePillar].tagline}</p>
              </div>
 
              <div className="text-xs md:text-sm text-muted leading-relaxed space-y-4 mb-6">
                <p>{PILLARS_DATA[activePillar].desc}</p>
              </div>
 
              <div className="bg-bg border border-bordercolor rounded-xl p-5 mb-6">
                <h4 className="text-[0.72rem] tracking-[0.1em] uppercase font-bold text-textcolor mb-3.5">Experience Highlights:</h4>
                <ul className="space-y-3">
                  {PILLARS_DATA[activePillar].highlights.map((hl, idx) => {
                    const [title, desc] = hl.split(': ');
                    return (
                      <li key={idx} className="text-xs text-muted leading-relaxed flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-accentdim/20 text-accent flex items-center justify-center text-[0.62rem] font-bold shrink-0 mt-0.5">{idx + 1}</span>
                        <div>
                          <strong className="text-textcolor font-medium">{title}</strong>: {desc}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
 
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-5 mb-8">
                <h4 className="text-[0.72rem] tracking-[0.15em] uppercase font-bold text-amber-500 mb-1.5">Traveler Tip:</h4>
                <p className="text-xs text-muted leading-relaxed">{PILLARS_DATA[activePillar].tip}</p>
              </div>
 
              <button 
                onClick={() => {
                  const pillarName = PILLARS_DATA[activePillar].title;
                  setActivePillar(null);
                  router.push(`/planner?notes=${encodeURIComponent(`I want to plan a custom trip highlighting ${pillarName}.`)}`);
                }}
                className="w-full mt-auto py-2.5 bg-accent hover:opacity-85 text-white text-xs font-medium uppercase tracking-wider rounded-lg text-center cursor-pointer"
              >
                Plan a {activePillar.toUpperCase()} Journey
              </button>
            </div>
          )}
        </div>
      </div>
 
    </section>
  );
}

export default function Culture() {
  return (
    <Suspense fallback={<div className="p-24 text-center text-muted">Loading Culture...</div>}>
      <CultureContent />
    </Suspense>
  );
}
