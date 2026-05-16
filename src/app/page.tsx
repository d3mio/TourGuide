"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useTranslation, useAppStore } from "@/store";

export default function Home() {
  const { t } = useTranslation();
  const reviews = useAppStore((state) => state.reviews);
  const [search, setSearch] = useState("");

  const filteredReviews = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return reviews.slice(0, 6);
    return reviews.filter(
      (r) =>
        r.tags.some((t) => t.includes(q)) ||
        r.text.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [search, reviews]);

  const marqueeItems = [
    { name: "Sigiriya", r: "5.0" }, { name: "Ella", r: "4.9" }, { name: "Mirissa", r: "4.8" },
    { name: "Galle Fort", r: "4.9" }, { name: "Yala Safari", r: "4.8" }, { name: "Kandy", r: "4.9" },
    { name: "Nuwara Eliya", r: "4.7" }, { name: "Trincomalee", r: "4.7" }, { name: "Arugam Bay", r: "4.8" },
    { name: "Anuradhapura", r: "4.8" }, { name: "Adams Peak", r: "4.8" }, { name: "Dambulla", r: "4.6" }
  ];
  const doubledMarquee = [...marqueeItems, ...marqueeItems];

  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8">
        <div className="py-24 md:py-32 grid grid-cols-1 md:grid-cols-[1fr_420px] gap-16 items-center border-b border-bordercolor">
          <div>
            <div className="text-[0.68rem] tracking-[0.15em] uppercase text-muted mb-3">{t("home_eyebrow")}</div>
            <h1 className="font-serif text-[clamp(3rem,6vw,5.5rem)] leading-[1.05] font-light tracking-tight mb-6">
              Sri Lanka:<br /><em className="text-accent not-italic">Ancient</em> Wonders,<br />Living Magic.
            </h1>
            <p className="text-muted text-base leading-relaxed max-w-[480px] mb-10">
              {t("home_sub")}
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-md text-[0.8rem] font-medium tracking-[0.06em] uppercase hover:opacity-85 hover:-translate-y-[1px] transition-all"
            >
              {t("home_cta")}
            </Link>
          </div>
          <div className="hidden md:block relative h-[380px] rounded-2xl overflow-hidden border border-bordercolor bg-gradient-to-br from-accentdim via-[#1e3a2f] to-[#0a2420] data-[theme=light]:from-[#d1fae5] data-[theme=light]:via-[#a7f3d0] data-[theme=light]:to-[#6ee7b7]">
            <div className="absolute inset-0 opacity-20" style={{ background: "repeating-linear-gradient(45deg, transparent, transparent 30px, #10b981 30px, #10b981 31px)" }}></div>
            <div className="absolute bottom-6 left-6 font-serif text-3xl text-textcolor/20 italic">Serendipity</div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-b border-bordercolor py-4">
        <div className="flex gap-12 animate-[marquee_28s_linear_infinite] whitespace-nowrap" style={{ width: "fit-content" }}>
          {doubledMarquee.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-[0.8rem] text-muted">
              <span className="text-textcolor font-medium">{item.name}</span>
              <span className="text-ambercolor">★</span>
              <span>{item.r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why Sri Lanka */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-[0.68rem] tracking-[0.15em] uppercase text-muted mb-3">{t("why_eyebrow")}</div>
        <h2 className="font-serif text-4xl mb-8">{t("why_title")}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] auto-rows-auto gap-[1px] bg-bordercolor border border-bordercolor rounded-2xl overflow-hidden">
          <div className="bg-surface hover:bg-bg transition-colors p-10 md:row-span-2">
            <div className="text-3xl mb-4">🏛️</div>
            <h3 className="font-serif text-2xl mb-2">{t("bento_heritage_title")}</h3>
            <p className="text-[0.82rem] text-muted leading-relaxed mb-6">{t("bento_heritage_desc")}</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[0.7rem] tracking-[0.06em] font-medium uppercase border border-accent text-accent bg-accentdim">UNESCO × 8</span>
          </div>
          <div className="bg-surface hover:bg-bg transition-colors p-8">
            <div className="text-3xl mb-4">🌿</div>
            <h3 className="font-serif text-[1.35rem] mb-2">{t("bento_bio_title")}</h3>
            <p className="text-[0.82rem] text-muted leading-relaxed">{t("bento_bio_desc")}</p>
          </div>
          <div className="bg-surface hover:bg-bg transition-colors p-8">
            <div className="text-3xl mb-4">🌊</div>
            <h3 className="font-serif text-[1.35rem] mb-2">{t("bento_coast_title")}</h3>
            <p className="text-[0.82rem] text-muted leading-relaxed">{t("bento_coast_desc")}</p>
          </div>
          <div className="bg-surface hover:bg-bg transition-colors p-8">
            <div className="text-3xl mb-4">🫖</div>
            <h3 className="font-serif text-[1.35rem] mb-2">{t("bento_hosp_title")}</h3>
            <p className="text-[0.82rem] text-muted leading-relaxed">{t("bento_hosp_desc")}</p>
          </div>
          <div className="bg-surface hover:bg-bg transition-colors p-8">
            <div className="text-3xl mb-4">📸</div>
            <h3 className="font-serif text-[1.35rem] mb-2">{t("bento_photo_title")}</h3>
            <p className="text-[0.82rem] text-muted leading-relaxed">{t("bento_photo_desc")}</p>
          </div>
        </div>
      </section>

      {/* Review Terminal */}
      <section className="max-w-7xl mx-auto px-8 py-16 border-t border-bordercolor">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <div className="text-[0.68rem] tracking-[0.15em] uppercase text-muted mb-3">{t("reviews_eyebrow")}</div>
            <h2 className="font-serif text-3xl">{t("reviews_title")}</h2>
          </div>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:max-w-[260px] bg-surface border border-bordercolor text-textcolor px-4 py-2.5 rounded-md text-[0.85rem] outline-none focus:border-accent transition-colors placeholder:text-muted" 
            placeholder={t("reviews_search")} 
          />
        </div>
        
        {filteredReviews.length === 0 ? (
          <p className="text-muted text-[0.85rem]">No matching reviews.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((r) => (
              <div key={r.id} className="bg-surface border border-bordercolor rounded-xl p-5 hover:border-accent transition-colors">
                <div className="font-medium text-[0.85rem]">{r.name}</div>
                <div className="text-ambercolor text-[0.8rem] my-1">
                  {"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}
                </div>
                <div className="text-[0.82rem] text-muted leading-relaxed">{r.text}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <style jsx global>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
