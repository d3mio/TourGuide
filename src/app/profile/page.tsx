"use client";

import Link from "next/link";
import { useTranslation, useAppStore } from "@/store";
import { Leaf, Landmark, Camera, Waves, Star, Calendar, Trash2, Heart } from "lucide-react";

// Image mapping for destinations in Sri Lanka to match Explore page
const DEST_IMAGES: Record<string, string> = {
  "Sigiriya": "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=800&auto=format&fit=crop",
  "Ella": "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=800&auto=format&fit=crop",
  "Mirissa": "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=800&auto=format&fit=crop",
  "Kandy": "https://images.unsplash.com/photo-1620619730591-e4064506c9a2?q=80&w=800&auto=format&fit=crop",
  "Galle Fort": "https://images.unsplash.com/photo-1588598126852-d7b4d994141d?q=80&w=800&auto=format&fit=crop",
  "Yala National Park": "https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=800&auto=format&fit=crop",
  "Nuwara Eliya": "https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop",
  "Trincomalee": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
  "Anuradhapura": "https://images.unsplash.com/photo-1565463690623-e18e390cbf37?q=80&w=800&auto=format&fit=crop",
  "Polonnaruwa": "https://images.unsplash.com/photo-1578593139888-39622e207264?q=80&w=800&auto=format&fit=crop",
  "Dambulla": "https://images.unsplash.com/photo-1627589704256-df3029f6de34?q=80&w=800&auto=format&fit=crop",
  "Arugam Bay": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=800&auto=format&fit=crop",
  "Horton Plains": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800&auto=format&fit=crop",
  "Adams Peak": "https://images.unsplash.com/photo-1563968743333-044cef800494?q=80&w=800&auto=format&fit=crop",
  "Bentota": "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=800&auto=format&fit=crop",
  "Hikkaduwa": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
  "Pinnawala": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=800&auto=format&fit=crop",
  "Knuckles Range": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
  "Jaffna": "https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=800&auto=format&fit=crop",
  "Wilpattu": "https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=800&auto=format&fit=crop",
  "Kalpitiya": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop";

export default function Profile() {
  const { t } = useTranslation();
  const { drafts, wishlist, reviews, toggleWishlist } = useAppStore();

  // Filter reviews written by the client
  const myReviews = reviews.filter((r) => r.isMine || r.name === 'Aanya Sharma');

  const PROFILE_TAGS = [
    { icon: Leaf, label: 'Wildlife' },
    { icon: Landmark, label: 'Heritage' },
    { icon: Camera, label: 'Photography' },
    { icon: Waves, label: 'Beaches' }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      {/* Page Header */}
      <div className="mb-12">
        <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-3 block">
          {t("prof_eyebrow") || "Traveller Dashboard"}
        </span>
        <h1 className="font-serif text-[2.5rem] md:text-[3.2rem] leading-tight mb-4 text-textcolor">
          {t("prof_title") || "My Profile"}
        </h1>
        <p className="text-muted text-[0.88rem] md:text-[0.95rem]">
          {t("prof_desc")}
        </p>
      </div>
      
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 md:gap-8 items-start">
        
        {/* Profile Sidebar */}
        <div className="bg-surface border border-bordercolor rounded-2xl p-5 sm:p-6 shadow-sm">
          {/* Avatar + name row (horizontal on mobile) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start lg:flex-col lg:items-center gap-4 mb-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accentdim/20 border-2 border-accent flex items-center justify-center font-serif text-[1.6rem] sm:text-[2rem] text-accent shrink-0 shadow-md shadow-accent/10">
              A
            </div>
            <div className="text-center sm:text-left lg:text-center">
              <h2 className="text-xl font-serif text-textcolor mb-1">Aanya Sharma</h2>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[0.65rem] tracking-wider font-bold border border-accent/20 text-accent bg-accentdim/15 uppercase">
                {t("Explorer Elite")}
              </span>
              <p className="text-xs text-muted mt-2">{t("Colombo, Sri Lanka")}</p>
            </div>
          </div>

          {/* Stats Box */}
          <div className="grid grid-cols-3 gap-2 py-4 mb-5 border-y border-bordercolor text-center">
            <div>
              <span className="block text-lg font-bold text-textcolor">{drafts.length}</span>
              <span className="text-[0.62rem] text-muted uppercase">{t("Drafts")}</span>
            </div>
            <div>
              <span className="block text-lg font-bold text-textcolor">{wishlist.length}</span>
              <span className="text-[0.62rem] text-muted uppercase">{t("Saved")}</span>
            </div>
            <div>
              <span className="block text-lg font-bold text-textcolor">{myReviews.length}</span>
              <span className="text-[0.62rem] text-muted uppercase">{t("Reviews")}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {PROFILE_TAGS.map((tag) => {
              const Icon = tag.icon;
              return (
                <span key={tag.label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.72rem] border border-bordercolor text-muted">
                  <Icon className="w-3.5 h-3.5 text-accent" />
                  {t(tag.label)}
                </span>
              );
            })}
          </div>
        </div>

        {/* Profile Content Column */}
        <div className="space-y-6">
          
          {/* Section 1: Saved Drafts & Completed */}
          <div className="bg-surface border border-bordercolor rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
            {/* Saved Drafts */}
            <div>
              <div className="text-[0.68rem] tracking-[0.1em] uppercase text-textcolor font-bold mb-4 pb-2 border-b border-bordercolor flex items-center justify-between">
                <span>{t("prof_drafts") || "Saved Trip Drafts"}</span>
                <span className="text-[0.62rem] bg-accentdim/20 text-accent px-2 py-0.5 rounded font-bold uppercase">{drafts.length} {t("Drafts")}</span>
              </div>
              
              {drafts.length > 0 ? (
                <div className="divide-y divide-bordercolor">
                  {drafts.map((d, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 text-xs text-textcolor first:pt-0 last:pb-0 gap-1">
                      <span className="font-medium">{d.name}</span>
                      <span className="text-muted flex items-center gap-1.5 text-[0.68rem]">
                        <Calendar className="w-3.5 h-3.5 text-accent" /> {d.date}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-bordercolor rounded-xl bg-bg/20 text-xs text-muted">
                  {t("prof_no_drafts_1")}<Link href="/planner" className="text-accent underline font-semibold">{t("prof_no_drafts_link")}</Link>{t("prof_no_drafts_2")}
                </div>
              )}
            </div>

            {/* Completed Tours */}
            <div>
              <div className="text-[0.68rem] tracking-[0.1em] uppercase text-textcolor font-bold mb-4 pb-2 border-b border-bordercolor">
                {t("prof_completed") || "Completed Tours"}
              </div>
              <div className="divide-y divide-bordercolor">
                <div className="flex items-center justify-between py-3 text-xs md:text-sm first:pt-0">
                  <span className="font-medium text-textcolor">{t("Cultural Heritage Circuit (10 Days)")}</span>
                  <span className="inline-flex px-2.5 py-0.5 rounded text-[0.62rem] tracking-wider font-bold border border-accent/20 text-accent bg-accentdim/15 uppercase">{t("Done")}</span>
                </div>
                <div className="flex items-center justify-between py-3 text-xs md:text-sm last:pb-0">
                  <span className="font-medium text-textcolor">{t("Southern Coastal Retreat (7 Days)")}</span>
                  <span className="inline-flex px-2.5 py-0.5 rounded text-[0.62rem] tracking-wider font-bold border border-accent/20 text-accent bg-accentdim/15 uppercase">{t("Done")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Destination Wishlist */}
          <div className="bg-surface border border-bordercolor rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="text-[0.68rem] tracking-[0.1em] uppercase text-textcolor font-bold mb-5 pb-2 border-b border-bordercolor">
              {t("prof_wishlist") || "Destination Wishlist"}
            </div>
            
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlist.map(w => {
                  const imageSrc = DEST_IMAGES[w] || DEFAULT_IMAGE;
                  return (
                    <div 
                      key={w} 
                      className="group bg-bg border border-bordercolor rounded-xl overflow-hidden p-3.5 flex gap-4 items-center justify-between hover:border-accent/40 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Little square thumbnail image */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface">
                          <img src={imageSrc} alt={w} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-xs text-textcolor truncate">{t(w)}</h4>
                          <span className="text-[0.62rem] uppercase font-bold text-accent bg-accentdim/10 px-2 py-0.5 rounded">{t("Saved")}</span>
                        </div>
                      </div>
                      
                      {/* Heart/Trash Toggle Button */}
                      <button 
                        onClick={() => toggleWishlist(w)}
                        className="w-8 h-8 rounded-full bg-surface hover:bg-rose-500/10 text-muted hover:text-rose-500 flex items-center justify-center border border-bordercolor transition-colors cursor-pointer shrink-0"
                        title="Remove from wishlist"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-bordercolor rounded-xl bg-bg/20 text-xs text-muted">
                {t("prof_wishlist_empty_1")}<Link href="/explore" className="text-accent underline font-semibold">{t("prof_wishlist_empty_link")}</Link>!
              </div>
            )}
          </div>

          {/* Section 3: Traveler Reviews */}
          <div className="bg-surface border border-bordercolor rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="text-[0.68rem] tracking-[0.1em] uppercase text-textcolor font-bold mb-4 pb-2 border-b border-bordercolor">
              {t("prof_reviews") || "My Reviews"}
            </div>
            
            {myReviews.length > 0 ? (
              <div className="space-y-4">
                {myReviews.map((r, i) => (
                  <div key={i} className="py-4 border-b border-bordercolor last:border-0 last:pb-0 first:pt-0">
                    <div className="flex justify-between items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-textcolor">{r.date}</span>
                      <span className="flex gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star 
                            key={idx} 
                            className={`w-3.5 h-3.5 ${
                              idx < r.stars ? 'fill-amber-500 text-amber-500' : 'text-bordercolor'
                            }`}
                          />
                        ))}
                      </span>
                    </div>
                    <p className="text-[0.82rem] text-muted leading-relaxed">
                      "{r.text}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-bordercolor rounded-xl bg-bg/20 text-xs text-muted">
                {t("prof_no_reviews_1")}<Link href="/experiences" className="text-accent underline font-semibold">{t("prof_no_reviews_link")}</Link>!
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
