"use client";

import { useState, useEffect } from "react";
import { useTranslation, useAppStore } from "@/store";
import { Star, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { LayoutGrid, type Card } from "@/components/ui/layout-grid";

export default function Experiences() {
  const { t } = useTranslation();
  const reviews = useAppStore((state) => state.reviews);
  const addReview = useAppStore((state) => state.addReview);

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [selectedStars, setSelectedStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [showMsg, setShowMsg] = useState(false);
  const [mediaCards, setMediaCards] = useState<Card[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data, error } = await supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(24);

      if (error) {
        console.error("Supabase fetch error:", error);
      }

      if (data && !error) {
        console.log("Fetched media data:", data);
        const formattedCards: Card[] = data.map((item, index) => {
          const isWide = index % 3 === 0;
          return {
            id: item.id,
            thumbnail: item.url,
            type: item.type as "image" | "video",
            className: isWide ? "md:col-span-2 min-h-[300px]" : "col-span-1 min-h-[300px]",
            content: (
              <div>
                <p className="font-bold md:text-3xl text-xl text-white">
                  {item.category.replace('_', ' ').toUpperCase()}
                </p>
                <p className="font-normal text-sm my-2 max-w-lg text-neutral-200">
                  {item.type === 'video' ? 'A beautiful video captured during our tours.' : 'A beautiful moment captured from our recent tours.'}
                </p>
              </div>
            )
          };
        });
        setMediaCards(formattedCards);
      }
    };
    fetchMedia();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || !selectedStars) return;
    
    addReview({
      id: Date.now(),
      name: name.trim(),
      stars: selectedStars,
      text: text.trim(),
      date: new Date().toLocaleDateString(),
      tags: text.toLowerCase().split(/\s+/).filter(w => w.length > 4).slice(0, 4).map(w => w.replace(/[^a-z]/g, '')),
      isMine: true
    });

    setName("");
    setText("");
    setSelectedStars(0);
    setHoveredStars(0);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 3000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      {/* Page Header */}
      <div className="mb-12">
        <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-3 block">
          {t("exppage_eyebrow") || "Your Voice Matters"}
        </span>
        <h1 className="font-serif text-[2.5rem] md:text-[3.2rem] leading-tight mb-4 text-textcolor">
          {t("exppage_title") || "Share Your Experience"}
        </h1>
        <p className="text-muted text-[0.88rem] md:text-[0.95rem] max-w-2xl">
          {t("exppage_desc")}
        </p>
      </div>
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 md:gap-10 items-start">
        
        {/* Review Form */}
        <div className="bg-surface border border-bordercolor rounded-2xl p-6 relative lg:sticky lg:top-24 shadow-sm">
          <h3 className="font-serif text-lg text-textcolor mb-5 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-accent" /> {t("exppage_write_title")}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                {t("form_name") || "Your Name"}
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bg/50 border border-bordercolor text-textcolor text-xs px-4 py-3 rounded-lg outline-none focus:border-accent transition-colors placeholder:text-muted/50" 
                placeholder={t("form_name_placeholder")} 
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                {t("form_rating") || "Star Rating"}
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button 
                    type="button"
                    key={val}
                    onClick={() => setSelectedStars(val)}
                    onMouseEnter={() => setHoveredStars(val)}
                    onMouseLeave={() => setHoveredStars(0)}
                    className="p-1 cursor-pointer transition-transform duration-150 hover:scale-110"
                    aria-label={`Rate ${val} stars`}
                  >
                    <Star 
                      className={`w-6 h-6 leading-none transition-colors ${
                        val <= (hoveredStars || selectedStars) 
                          ? 'fill-amber-500 text-amber-500' 
                          : 'text-bordercolor'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                {t("form_exp") || "Your Experience"}
              </label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5} 
                className="w-full bg-bg/50 border border-bordercolor text-textcolor text-xs px-4 py-3 rounded-lg outline-none focus:border-accent transition-colors placeholder:text-muted/50 resize-y min-h-[100px]" 
                placeholder={t("form_exp_placeholder")}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full py-3 bg-accent hover:opacity-85 text-white font-medium uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-accent/20 cursor-pointer"
            >
              <span>{t("form_submit")}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {showMsg && (
            <div className="mt-4 p-3 rounded-lg bg-accentdim/15 border border-accent/25 text-xs text-accent flex items-center gap-2 animate-[fadeIn_0.2s_ease]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{t("form_thanks") || "Thank you! Your review has been added."}</span>
            </div>
          )}
        </div>

        {/* Feed Column */}
        <div className="space-y-6 overflow-hidden relative">
          <div className="text-[0.68rem] tracking-[0.15em] uppercase text-muted font-bold pb-2 border-b border-bordercolor">
            {t("feed_eyebrow") || "All Experiences"} ({reviews.length})
          </div>
          
          <div className="relative flex flex-col gap-4 pause-on-hover pt-4">
            {/* Left and Right fades for seamless look */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

            {/* Row 1: Marquee Left */}
            <div className="flex w-max animate-marquee-left" style={{ WebkitBackfaceVisibility: 'hidden' }}>
              {[...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews].map((r, i) => {
                const avatarLetter = r.name ? r.name.charAt(0).toUpperCase() : "T";
                return (
                  <div 
                    key={`r1-${r.id}-${i}`} 
                    className="w-[300px] md:w-[340px] shrink-0 p-5 rounded-xl bg-surface hover:bg-surface2 transition-colors border border-bordercolor flex flex-col justify-between gap-5 mr-4 shadow-xl"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-0.5 text-ambercolor">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star 
                              key={idx} 
                              className={`w-3.5 h-3.5 ${
                                idx < r.stars ? 'fill-ambercolor text-ambercolor' : 'text-bordercolor'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[0.65rem] text-muted/70 font-semibold uppercase tracking-wider">{r.date}</span>
                      </div>
                      <p className="text-sm text-textdim leading-relaxed font-medium">
                        "{r.text}"
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-bordercolor/30 flex items-center justify-center text-muted font-bold border border-bordercolor shadow-inner shrink-0">
                        {avatarLetter}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-textcolor">{r.name}</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {r.tags && r.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-[0.6rem] text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Row 2: Marquee Right */}
            <div className="flex w-max animate-marquee-right" style={{ WebkitBackfaceVisibility: 'hidden' }}>
              {[...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews].reverse().map((r, i) => {
                const avatarLetter = r.name ? r.name.charAt(0).toUpperCase() : "T";
                return (
                  <div 
                    key={`r2-${r.id}-${i}`} 
                    className="w-[300px] md:w-[340px] shrink-0 p-5 rounded-xl bg-surface hover:bg-surface2 transition-colors border border-bordercolor flex flex-col justify-between gap-5 mr-4 shadow-xl"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-0.5 text-ambercolor">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star 
                              key={idx} 
                              className={`w-3.5 h-3.5 ${
                                idx < r.stars ? 'fill-ambercolor text-ambercolor' : 'text-bordercolor'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[0.65rem] text-muted/70 font-semibold uppercase tracking-wider">{r.date}</span>
                      </div>
                      <p className="text-sm text-textdim leading-relaxed font-medium">
                        "{r.text}"
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-bordercolor/30 flex items-center justify-center text-muted font-bold border border-bordercolor shadow-inner shrink-0">
                        {avatarLetter}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-textcolor">{r.name}</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {r.tags && r.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-[0.6rem] text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Debug: {mediaCards.length} */}
      {mediaCards.length === 0 && (
        <div className="mt-10 text-center text-white">Loading gallery or no media found...</div>
      )}

      {/* Media Layout Grid */}
      {mediaCards.length > 0 && (
        <div className="mt-32 w-full flex flex-col h-[100vh] min-h-[800px]">
          <div className="mb-12 text-center">
            <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-3 block">
              Our Gallery
            </span>
            <h2 className="font-serif text-[2.5rem] md:text-[3.2rem] leading-tight mb-4 text-textcolor">
              Memories From Tours
            </h2>
            <p className="text-muted text-[0.88rem] md:text-[0.95rem] max-w-2xl mx-auto">
              Explore the beautiful moments and places our tourists have experienced.
            </p>
          </div>
          <div className="flex-1 w-full h-full pb-20">
             <LayoutGrid cards={mediaCards} />
          </div>
        </div>
      )}
    </section>
  );
}
