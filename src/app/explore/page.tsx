"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation, useAppStore } from "@/store";
import { PROVINCES, EXCURSIONS } from "@/data/mockData";
import { Heart, MapPin, Compass, Star, Clock, ChevronDown, Mail, MessageCircle } from "lucide-react";

import { getOptimizedImage } from "@/utils/media";

// Image mapping for destinations mapping to Supabase Storage
const DEST_FILES: Record<string, string> = {
  "Sigiriya": "provinces/sigiriya.jpg",
  "Ella": "provinces/ella.jpg",
  "Mirissa": "provinces/mirissa.jpg",
  "Kandy": "provinces/kandy.jpg",
  "Galle Fort": "provinces/galle.jpg",
  "Yala National Park": "provinces/yala.jpg",
  "Nuwara Eliya": "provinces/nuwara_eliya.jpg",
  "Trincomalee": "provinces/trincomalee.jpg",
  "Anuradhapura": "provinces/anuradhapura.jpg",
  "Polonnaruwa": "provinces/polonnaruwa.jpg",
  "Dambulla": "provinces/dambulla.jpg",
  "Arugam Bay": "provinces/arugam_bay.jpg",
  "Horton Plains": "provinces/horton_plains.jpg",
  "Adams Peak": "provinces/adams_peak.jpg",
  "Bentota": "provinces/bentota.jpg",
  "Hikkaduwa": "provinces/hikkaduwa.jpg",
  "Pinnawala": "provinces/pinnawala.jpg",
  "Knuckles Range": "provinces/knuckles.jpg",
  "Jaffna": "provinces/jaffna.jpg",
  "Wilpattu": "provinces/wilpattu.jpg",
  "Kalpitiya": "provinces/kalpitiya.jpg"
};

const DEFAULT_FILE = "provinces/default.jpg";

export default function Explore() {
  const { t } = useTranslation();
  const { wishlist, toggleWishlist } = useAppStore();
  const provinces = ["All", ...Object.keys(PROVINCES)];
  const [currentProvince, setCurrentProvince] = useState(provinces[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedExcursion, setExpandedExcursion] = useState<string | null>(null);

  const places = currentProvince === "All"
    ? Object.entries(PROVINCES).flatMap(([prov, list]) => list.map(p => ({ ...p, prov })))
    : (PROVINCES[currentProvince] || []).map(p => ({ ...p, prov: currentProvince }));

  const filteredPlaces = places.filter(p => {
    const name = t(p.name).toLowerCase();
    const desc = t(p.desc).toLowerCase();
    const prov = t(p.prov).toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || desc.includes(query) || prov.includes(query);
  });

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      {/* Page Header */}
      <div className="mb-12">
        <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-3 block">
          {t("exp_eyebrow") || "Discover The Island"}
        </span>
        <h1 className="font-serif text-[2.5rem] md:text-[3.2rem] leading-tight mb-4 text-textcolor">
          {t("exp_title") || "Explore by Province"}
        </h1>
        <p className="text-muted text-[0.88rem] md:text-[0.95rem] max-w-2xl">
          {t("exp_desc")}
        </p>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="flex flex-col md:flex-row gap-5 items-stretch md:items-center justify-between mb-10 pb-6 border-b border-bordercolor">
        {/* Province Chips */}
        <div className="flex gap-2 overflow-x-auto py-1 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {provinces.map((p) => (
            <button
              key={p}
              onClick={() => setCurrentProvince(p)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all cursor-pointer shrink-0 ${p === currentProvince
                ? "bg-accent text-white border-transparent shadow-sm shadow-accent/20"
                : "border-bordercolor text-muted hover:border-accent/40 hover:text-textcolor bg-surface/30"
                }`}
            >
              {p === "All" ? (t("All") || "All") : t(p)}
            </button>
          ))}
        </div>

        {/* Local Search input */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-bordercolor text-textcolor text-xs px-4 py-3 rounded-lg outline-none focus:border-accent transition-colors placeholder:text-muted/60"
            placeholder={t("exp_search_placeholder")}
          />
        </div>
      </div>

      {/* Grid of Destination Cards */}
      {filteredPlaces.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-bordercolor rounded-2xl bg-surface/20">
          <Compass className="w-12 h-12 text-muted/40 mx-auto mb-4 animate-spin-slow" />
          <h3 className="font-serif text-lg text-textcolor mb-1">{t("exp_no_dest")}</h3>
          <p className="text-xs text-muted">{t("exp_no_dest_sub")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((p) => {
            const isSaved = wishlist.includes(p.name);
            const fileKey = DEST_FILES[p.name] || DEFAULT_FILE;
            const imageSrc = getOptimizedImage(fileKey, { width: 600, quality: 80, format: 'webp' });

            return (
              <div
                key={p.name}
                className="group bg-surface border border-bordercolor rounded-xl overflow-hidden hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 flex flex-col shadow-sm"
              >
                {/* Photo container */}
                <div className="h-[210px] relative overflow-hidden bg-bg">
                  <img
                    src={imageSrc}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Category Pill */}
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface/90 backdrop-blur-sm text-[0.68rem] tracking-wider font-semibold text-accent uppercase border border-bordercolor">
                    <MapPin className="w-3 h-3" /> {t(p.prov)}
                  </span>

                  {/* Wishlist Toggle Heart Button */}
                  <button
                    onClick={() => toggleWishlist(p.name)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface/90 backdrop-blur-sm text-muted hover:text-rose-500 hover:scale-110 flex items-center justify-center border border-bordercolor transition-all duration-200 cursor-pointer"
                    aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                  >
                    <Heart
                      className={`w-4 h-4 transition-all duration-300 ${isSaved ? 'fill-rose-500 text-rose-500 scale-105' : 'text-muted'}`}
                    />
                  </button>
                </div>

                {/* Card Info Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3.5">
                    <h3 className="text-xl font-serif text-textcolor">{t(p.name)}</h3>
                    <span className="flex items-center gap-1 text-[0.8rem] font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {p.rating}
                    </span>
                  </div>

                  <p className="text-xs md:text-[0.82rem] text-muted leading-relaxed mb-6 flex-1">
                    {t(p.desc)}
                  </p>

                  <Link
                    href={`/planner?dest=${encodeURIComponent(p.name)}`}
                    className="w-full text-center px-4 py-2.5 rounded text-[0.7rem] font-bold uppercase tracking-wider border border-bordercolor text-textcolor hover:border-accent hover:text-accent bg-bg/20 hover:bg-accentdim/10 transition-all duration-200"
                  >
                    {t("exp_plan_btn")}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Colombo Day Excursions */}
      <div className="mt-24 pt-16 border-t border-bordercolor">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-3 block">
            {t("excursions_eyebrow")}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl mb-4">{t("excursions_title")}</h2>
          <p className="text-muted text-[0.88rem] md:text-[0.95rem]">
            {t("excursions_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXCURSIONS.map((ex) => {
            const isExpanded = expandedExcursion === ex.id;
            return (
              <div
                key={ex.id}
                className="bg-surface border border-bordercolor rounded-xl p-6 md:p-8 flex flex-col items-start relative overflow-hidden transition-all duration-300 hover:border-accent/30 hover:shadow-lg"
              >
                <div className="absolute top-0 right-0 bg-bordercolor/50 border-l border-b border-bordercolor text-[0.7rem] uppercase font-bold px-4 py-1.5 rounded-bl-lg text-muted">
                  {t(ex.badge)}
                </div>

                <div className="mb-4 pr-16">
                  <h3 className="font-serif text-xl md:text-2xl text-textcolor mb-1">{t(ex.title)}</h3>
                  <span className="inline-flex items-center gap-1 text-[0.72rem] text-accent font-semibold bg-accentdim/15 px-2 py-0.5 rounded">
                    <Clock className="w-3.5 h-3.5" /> {t(ex.duration)}
                  </span>
                </div>

                <p className="text-muted text-xs md:text-[0.82rem] leading-relaxed mb-6 flex-grow">
                  {t(ex.desc)}
                </p>

                <div className="w-full flex flex-wrap gap-4 border-t border-bordercolor pt-4 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span><strong>{t("stops")}:</strong> {ex.stops.split(', ').slice(0, 2).map(s => t(s)).join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Compass className="w-3.5 h-3.5 text-accent" />
                    <span><strong>{t("drive")}:</strong> {t(ex.travelInfo.split(' (')[0])}</span>
                  </div>
                </div>

                <div className="flex gap-4 w-full justify-between items-center mt-2">
                  <button
                    onClick={() => setExpandedExcursion(isExpanded ? null : ex.id)}
                    className="text-xs font-bold text-accent hover:text-textcolor transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-0 outline-none"
                  >
                    {isExpanded ? t("ex_hide_itinerary") : t("ex_view_itinerary")}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <a
                    href={`mailto:serandibtours@gmail.com?subject=${encodeURIComponent(`Excursion Booking: ${ex.title}`)}&body=${encodeURIComponent(`Hi, I am interested in booking the one-day excursion: ${ex.title}.`)}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-textcolor border border-bordercolor hover:border-accent hover:text-accent px-2.5 py-1.5 rounded transition-all duration-200"
                  >
                    <Mail className="w-3 h-3" /> {t("book_via_email")}
                  </a>
                  <a
                    href={`https://wa.me/94705836005?text=${encodeURIComponent(`Hi! I'm interested in the excursion: ${ex.title}`)}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-white bg-[#25D366] hover:opacity-85 px-2.5 py-1.5 rounded transition-all duration-200"
                  >
                    <MessageCircle className="w-3 h-3" /> {t("book_via_whatsapp")}
                  </a>
                </div>

                {/* Expanded Timeline details */}
                {isExpanded && (
                  <div className="w-full border-t border-dashed border-bordercolor mt-5 pt-5 animate-[fadeIn_0.3s_ease]">
                    <h5 className="text-[0.75rem] font-bold uppercase tracking-wider text-amber-500 mb-3.5">{t("ex_route_plan")}</h5>
                    <div className="relative pl-4 border-l border-bordercolor flex flex-col gap-4">
                      {ex.itinerary.map((item, idx) => (
                        <div key={idx} className="relative flex flex-col sm:flex-row gap-1 sm:gap-4 items-start text-[0.8rem]">
                          <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent border border-bg" />
                          <span className="font-bold text-accent bg-accentdim/10 px-1.5 py-0.5 rounded text-[0.7rem] shrink-0">{item.time}</span>
                          <span className="text-muted leading-relaxed">{t(item.event)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
