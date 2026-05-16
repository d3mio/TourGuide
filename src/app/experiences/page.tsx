"use client";

import { useState } from "react";
import { useTranslation, useAppStore } from "@/store";

export default function Experiences() {
  const { t } = useTranslation();
  const reviews = useAppStore((state) => state.reviews);
  const addReview = useAppStore((state) => state.addReview);

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [selectedStars, setSelectedStars] = useState(0);
  const [showMsg, setShowMsg] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !text.trim() || !selectedStars) return;
    
    addReview({
      id: Date.now(),
      name: name.trim(),
      stars: selectedStars,
      text: text.trim(),
      date: new Date().toLocaleDateString(),
      tags: text.toLowerCase().split(/\s+/).filter(w=>w.length>4).slice(0,5),
      isMine: true
    });

    setName("");
    setText("");
    setSelectedStars(0);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 3000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="text-[0.68rem] tracking-[0.15em] uppercase text-muted mb-3">{t("exppage_eyebrow")}</div>
      <h1 className="font-serif text-[2.2rem] md:text-[2.5rem] mb-6 md:mb-8">{t("exppage_title")}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 items-start">
        {/* Form */}
        <div className="bg-surface border border-bordercolor rounded-xl p-5 md:p-6 relative lg:sticky lg:top-20">
          <div className="mb-4">
            <label className="block text-[0.75rem] tracking-[0.06em] uppercase text-muted mb-1.5">{t("form_name")}</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface border border-bordercolor text-textcolor px-4 py-2.5 rounded-md text-[0.85rem] outline-none focus:border-accent transition-colors placeholder:text-muted/50" 
              placeholder="e.g. Sarah M." 
            />
          </div>
          <div className="mb-4">
            <label className="block text-[0.75rem] tracking-[0.06em] uppercase text-muted mb-1.5">{t("form_rating")}</label>
            <div className="flex gap-1.5 mb-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <span 
                  key={val}
                  onClick={() => setSelectedStars(val)}
                  className={`text-2xl cursor-pointer transition-colors leading-none ${val <= selectedStars ? 'text-ambercolor' : 'text-bordercolor'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-[0.75rem] tracking-[0.06em] uppercase text-muted mb-1.5">{t("form_exp")}</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5} 
              className="w-full bg-surface border border-bordercolor text-textcolor px-4 py-2.5 rounded-md text-[0.85rem] outline-none focus:border-accent transition-colors placeholder:text-muted/50 resize-y min-h-[100px]" 
              placeholder="Tell us about your journey…"
            ></textarea>
          </div>
          <button onClick={handleSubmit} className="w-full py-2.5 bg-accent text-white rounded-md text-[0.8rem] font-medium tracking-[0.06em] uppercase hover:opacity-85 transition-opacity">
            {t("form_submit")}
          </button>
          {showMsg && <div className="mt-3 text-[0.8rem] text-accent">{t("form_thanks")}</div>}
        </div>

        {/* Feed */}
        <div>
          <div className="text-[0.68rem] tracking-[0.15em] uppercase text-muted mb-4">{t("feed_eyebrow")}</div>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="bg-surface border border-bordercolor rounded-xl p-5 hover:border-accent transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-[0.9rem]">{r.name}</span>
                  <span className="text-ambercolor text-[0.8rem]">{"★".repeat(r.stars)}</span>
                </div>
                <div className="text-[0.83rem] text-muted leading-relaxed">{r.text}</div>
                <div className="text-[0.7rem] text-muted/70 mt-2">{r.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
