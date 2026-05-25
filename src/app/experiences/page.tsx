"use client";

import { useState } from "react";
import { useTranslation, useAppStore } from "@/store";
import { Star, Send, CheckCircle2, MessageSquare } from "lucide-react";

export default function Experiences() {
  const { t } = useTranslation();
  const reviews = useAppStore((state) => state.reviews);
  const addReview = useAppStore((state) => state.addReview);

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [selectedStars, setSelectedStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [showMsg, setShowMsg] = useState(false);

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
        <div className="space-y-6">
          <div className="text-[0.68rem] tracking-[0.15em] uppercase text-muted font-bold pb-2 border-b border-bordercolor">
            {t("feed_eyebrow") || "All Experiences"} ({reviews.length})
          </div>
          
          <div className="space-y-4">
            {reviews.map((r) => {
              const avatarLetter = r.name ? r.name.charAt(0).toUpperCase() : "T";
              return (
                <div 
                  key={r.id} 
                  className="bg-surface border border-bordercolor rounded-2xl p-5 md:p-6 hover:border-accent/30 transition-colors shadow-sm flex flex-col sm:flex-row gap-4 items-start"
                >
                  {/* User circular badge avatar */}
                  <div className="w-10 h-10 rounded-full bg-accentdim/15 border border-accent/20 text-accent font-serif text-sm font-semibold flex items-center justify-center shrink-0">
                    {avatarLetter}
                  </div>
                  
                  {/* Review Info */}
                  <div className="flex-grow space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-semibold text-sm text-textcolor">{r.name}</h4>
                      <div className="flex gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star 
                            key={idx} 
                            className={`w-3.5 h-3.5 ${
                              idx < r.stars ? 'fill-amber-500 text-amber-500' : 'text-bordercolor'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-xs md:text-[0.82rem] text-muted leading-relaxed">
                      {r.text}
                    </p>

                    <div className="flex flex-wrap items-center justify-between pt-2 gap-4">
                      {/* Generative HashTags */}
                      <div className="flex flex-wrap gap-1.5">
                        {r.tags && r.tags.map((tag) => (
                          <span key={tag} className="text-[0.65rem] text-accent bg-accentdim/10 border border-accent/10 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-[0.65rem] text-muted/70 font-semibold uppercase tracking-wider">
                        {r.date}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
