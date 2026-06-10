"use client";

import { useTranslation, useAppStore } from "@/store";
import { Star, Send, CheckCircle2, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import MasonryGallery, { type MediaItem } from "@/components/ui/masonry-gallery";
import ProfileCard from "@/components/ui/ProfileCard";

export default function ExperiencesClient({
  initialMedia,
}: {
  initialMedia: MediaItem[];
}) {
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
      id: crypto.randomUUID(),
      name: name.trim(),
      stars: selectedStars,
      text: text.trim(),
      date: new Date().toLocaleDateString(),
      tags: text.toLowerCase().split(/\s+/).filter((w) => w.length > 4).slice(0, 4).map((w) => w.replace(/[^a-z]/g, "")),
      isMine: true,
    });
    setName(""); setText(""); setSelectedStars(0); setHoveredStars(0);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 3000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">

      {/* ── Hero: Profile Card + Bio ── */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 md:gap-16 mb-24">
        {/* ProfileCard */}
        <div className="shrink-0 flex justify-center w-full lg:w-auto">
          <ProfileCard
            name="Dineth Theekshana"
            title="Licensed Tour Guide · Sri Lanka"
            handle="dinethtours"
            status="Available for Tours"
            contactText="WhatsApp"
            avatarUrl="/assets/serendibtours.png"
            showUserInfo={false}
            enableTilt={false}
            enableMobileTilt={false}
            behindGlowEnabled={true}
            behindGlowColor="rgba(0, 180, 120, 0.55)"
            innerGradient="linear-gradient(145deg, #0a1f1499 0%, #00b47833 60%, #1a4a2e55 100%)"
            onContactClick={() => window.open("https://wa.me/94705836005", "_blank")}
          />
        </div>

        {/* Bio & Stats */}
        <div className="flex-1 flex flex-col justify-center pt-4">
          <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-3 block">
            Licensed Tour Guide · Sri Lanka
          </span>
          <h1 className="font-serif text-[2.2rem] md:text-[3rem] leading-tight mb-5 text-textcolor">
            Dineth Theekshana
          </h1>
          <p className="text-muted text-[0.9rem] md:text-[1rem] max-w-xl leading-relaxed mb-8">
            A passionate and licensed tour guide dedicated to crafting unforgettable journeys across Sri Lanka. From the misty highlands of Ella to the golden shores of Mirissa, every trip is a story waiting to be told.
          </p>



          {/* Quick Badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["🏖️ Beach Tours", "🐘 Wildlife Safaris", "🏛️ Cultural Heritage", "🌿 Eco Tourism", "🎉 Down South Parties", "🚂 Scenic Train Rides"].map((b) => (
              <span key={b} className="text-[0.7rem] font-medium text-textcolor bg-surface border border-bordercolor px-3 py-1.5 rounded-full">
                {b}
              </span>
            ))}
          </div>

          {/* Contact Button */}
          <button
            onClick={() => window.open("https://wa.me/94705836005", "_blank")}
            className="flex items-center gap-2.5 px-6 py-3 bg-accent hover:opacity-85 text-white font-semibold text-sm rounded-xl shadow-lg shadow-accent/20 cursor-pointer transition-opacity w-fit"
          >
            <Phone className="w-4 h-4" />
            WhatsApp · +94 70 583 6005
          </button>
        </div>
      </div>

      {/* ── Gallery Section ── */}
      <div className="mb-24">
        <div className="mb-10 text-center">
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
        <MasonryGallery items={initialMedia} />
      </div>

      {/* ── Reviews Section ── */}
      <div>
        <div className="mb-10">
          <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-3 block">
            {t("feed_eyebrow") || "All Experiences"}
          </span>
          <h2 className="font-serif text-[2rem] md:text-[2.5rem] leading-tight mb-4 text-textcolor">
            What Travelers Say
          </h2>
        </div>

        {/* Two Column Layout: Form + Marquee */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 md:gap-10 items-start">
          {/* Review Form */}
          <div className="bg-surface border border-bordercolor rounded-2xl p-6 relative lg:sticky lg:top-24 shadow-sm">
            <h3 className="font-serif text-lg text-textcolor mb-5 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              {t("exppage_write_title") || "Leave a Review"}
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
                  placeholder={t("form_name_placeholder") || "Your name"}
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
                        className={`w-6 h-6 leading-none transition-colors ${val <= (hoveredStars || selectedStars)
                            ? "fill-amber-500 text-amber-500"
                            : "text-bordercolor"
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
                  placeholder={t("form_exp_placeholder") || "Share your experience..."}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-accent hover:opacity-85 text-white font-medium uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-accent/20 cursor-pointer"
              >
                <span>{t("form_submit") || "Submit Review"}</span>
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

          {/* Marquee Feed */}
          <div className="space-y-6 overflow-hidden relative">
            <div className="text-[0.68rem] tracking-[0.15em] uppercase text-muted font-bold pb-2 border-b border-bordercolor">
              {t("feed_eyebrow") || "All Experiences"} ({reviews.length})
            </div>
            <div className="relative flex flex-col gap-4 pt-4">
              <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

              {/* Row 1: Marquee Left */}
              <div className="flex w-max animate-marquee-left" style={{ WebkitBackfaceVisibility: "hidden" }}>
                {[...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews].map((r, i) => {
                  const avatarLetter = r.name ? r.name.charAt(0).toUpperCase() : "T";
                  const blockIndex = Math.floor(i / reviews.length);
                  return (
                    <div key={`r1-${r.id}-${blockIndex}`} className="w-[300px] md:w-[340px] shrink-0 p-5 rounded-xl bg-surface hover:bg-surface2 transition-colors border border-bordercolor flex flex-col justify-between gap-5 mr-4 shadow-xl">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star key={idx} className={`w-3.5 h-3.5 ${idx < r.stars ? "fill-amber-500 text-amber-500" : "text-bordercolor"}`} />
                            ))}
                          </div>
                          <span className="text-[0.65rem] text-muted/70 font-semibold uppercase tracking-wider">{r.date}</span>
                        </div>
                        <p className="text-sm text-textdim leading-relaxed font-medium">&ldquo;{r.text}&rdquo;</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-bordercolor/30 flex items-center justify-center text-muted font-bold border border-bordercolor shadow-inner shrink-0">{avatarLetter}</div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-textcolor">{r.name}</span>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {r.tags && r.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="text-[0.6rem] text-accent bg-accent/10 px-1.5 py-0.5 rounded">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Row 2: Marquee Right */}
              <div className="flex w-max animate-marquee-right" style={{ WebkitBackfaceVisibility: "hidden" }}>
                {[...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews].reverse().map((r, i) => {
                  const avatarLetter = r.name ? r.name.charAt(0).toUpperCase() : "T";
                  const blockIndex = Math.floor(i / reviews.length);
                  return (
                    <div key={`r2-${r.id}-${blockIndex}`} className="w-[300px] md:w-[340px] shrink-0 p-5 rounded-xl bg-surface hover:bg-surface2 transition-colors border border-bordercolor flex flex-col justify-between gap-5 mr-4 shadow-xl">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star key={idx} className={`w-3.5 h-3.5 ${idx < r.stars ? "fill-amber-500 text-amber-500" : "text-bordercolor"}`} />
                            ))}
                          </div>
                          <span className="text-[0.65rem] text-muted/70 font-semibold uppercase tracking-wider">{r.date}</span>
                        </div>
                        <p className="text-sm text-textdim leading-relaxed font-medium">&ldquo;{r.text}&rdquo;</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-bordercolor/30 flex items-center justify-center text-muted font-bold border border-bordercolor shadow-inner shrink-0">{avatarLetter}</div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-textcolor">{r.name}</span>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {r.tags && r.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="text-[0.6rem] text-accent bg-accent/10 px-1.5 py-0.5 rounded">#{tag}</span>
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
      </div>

    </section>
  );
}
