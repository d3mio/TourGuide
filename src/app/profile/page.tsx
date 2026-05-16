"use client";

import { useTranslation, useAppStore } from "@/store";

export default function Profile() {
  const { t } = useTranslation();
  const { drafts, wishlist, reviews } = useAppStore();

  const myReviews = reviews.filter((r) => r.isMine || r.name === 'Aanya Sharma' || reviews.indexOf(r) < 3);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="text-[0.68rem] tracking-[0.15em] uppercase text-muted mb-3">{t("prof_eyebrow")}</div>
      <h1 className="font-serif text-[2.2rem] md:text-[2.5rem] mb-6 md:mb-8">{t("prof_title")}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 md:gap-8 items-start">
        {/* Sidebar */}
        <div className="bg-surface border border-bordercolor rounded-xl p-6 text-center">
          <div className="w-[72px] h-[72px] rounded-full bg-accentdim border-[1.5px] border-accent flex items-center justify-center font-serif text-[1.6rem] text-accent mx-auto mb-4">A</div>
          <div className="text-[1.4rem] font-serif mb-1">Aanya Sharma</div>
          <div className="mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.7rem] tracking-[0.06em] font-medium border border-accent text-accent bg-accentdim uppercase">Explorer Elite</span>
          </div>
          <p className="text-[0.78rem] text-muted mb-4">Colombo, Sri Lanka</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {['🌿 Wildlife', '🏛️ Heritage', '📸 Photography', '🌊 Beaches'].map(tag => (
              <span key={tag} className="inline-flex px-3 py-1 rounded-full text-[0.72rem] border border-bordercolor text-muted">{tag}</span>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="space-y-4">
          {/* Itineraries */}
          <div className="bg-surface border border-bordercolor rounded-xl p-6">
            <div className="mb-6">
              <div className="text-[0.7rem] tracking-[0.1em] uppercase text-muted mb-3 border-b border-bordercolor pb-2">{t("prof_drafts")}</div>
              {drafts.length > 0 ? (
                <div className="space-y-1">
                  {drafts.map((d, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-bordercolor text-[0.82rem] last:border-0">
                      <span>{d.name}</span>
                      <span className="text-[0.72rem] text-muted">{d.date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[0.8rem] text-muted py-2">No saved drafts yet. Use the Planner to save journeys.</p>
              )}
            </div>
            <div>
              <div className="text-[0.7rem] tracking-[0.1em] uppercase text-muted mb-3 border-b border-bordercolor pb-2">{t("prof_completed")}</div>
              <div className="flex items-center justify-between py-2.5 border-b border-bordercolor text-[0.82rem] last:border-0">
                <span>Cultural Heritage Circuit</span>
                <span className="inline-flex px-2 py-0.5 rounded-full text-[0.65rem] tracking-[0.06em] uppercase border border-accent text-accent bg-accentdim">Done</span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-bordercolor text-[0.82rem] last:border-0">
                <span>Southern Coastal Retreat</span>
                <span className="inline-flex px-2 py-0.5 rounded-full text-[0.65rem] tracking-[0.06em] uppercase border border-accent text-accent bg-accentdim">Done</span>
              </div>
            </div>
          </div>

          {/* Wishlist */}
          <div className="bg-surface border border-bordercolor rounded-xl p-6">
            <div className="text-[0.7rem] tracking-[0.1em] uppercase text-muted mb-3 border-b border-bordercolor pb-2">{t("prof_wishlist")}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
              {wishlist.map(w => (
                <div key={w} className="bg-bg border border-bordercolor rounded-lg p-3 hover:border-accent transition-colors">
                  <div className="font-medium text-[0.85rem] mb-1">{w}</div>
                  <div className="inline-flex px-2.5 py-0.5 rounded-full text-[0.65rem] tracking-[0.06em] font-medium uppercase border border-ambercolor text-ambercolor bg-amberdim">Saved</div>
                </div>
              ))}
            </div>
          </div>

          {/* My Reviews */}
          <div className="bg-surface border border-bordercolor rounded-xl p-6">
            <div className="text-[0.7rem] tracking-[0.1em] uppercase text-muted mb-3 border-b border-bordercolor pb-2">{t("prof_reviews")}</div>
            <div className="mt-4">
              {myReviews.length > 0 ? (
                myReviews.slice(0, 3).map((r, i) => (
                  <div key={i} className="py-2.5 border-b border-bordercolor last:border-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-[0.82rem] font-medium">{r.name}</span>
                      <span className="text-ambercolor text-[0.75rem]">{"★".repeat(r.stars)}</span>
                    </div>
                    <div className="text-[0.79rem] text-muted">{r.text.slice(0,80)}…</div>
                  </div>
                ))
              ) : (
                <p className="text-[0.8rem] text-muted py-2">You haven't written any reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
