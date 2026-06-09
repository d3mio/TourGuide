"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation, useAppStore } from "@/store";
import { PROVINCES } from "@/data/mockData";
import { Heart, MapPin, Compass, Star } from "lucide-react";

import { getOptimizedImage } from "@/utils/media";
import { getPlaceImage } from "@/data/images";
import Image from "next/image";

export default function Explore() {
  const { t } = useTranslation();
  const { wishlist, toggleWishlist } = useAppStore();
  const provinces = ["All", ...Object.keys(PROVINCES)];
  const [currentProvince, setCurrentProvince] = useState(provinces[0]);
  const [searchQuery, setSearchQuery] = useState("");

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
            const imageSrc = getPlaceImage(p.name);

            return (
              <div
                key={p.name}
                className="group bg-surface border border-bordercolor rounded-xl overflow-hidden hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 flex flex-col shadow-sm"
              >
                {/* Photo container */}
                <div className="h-[210px] relative overflow-hidden bg-bg">
                  <Image
                    src={imageSrc}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
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

    </section>
  );
}
