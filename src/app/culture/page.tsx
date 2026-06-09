"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/store";
import { CULTURE_ITEMS, PILLARS_DATA } from "@/data/mockData";
import { ArrowRight, X } from "lucide-react";

// Image mapping for culture items
const CULTURE_IMAGES: Record<string, string> = {
  "Kandyan Dance": "/assets/places/kandiyan_dance.jpg",
  "The Art of Ceylon Tea": "/assets/places/ceylon_tea.jpg",
  "Rock Fortresses & Dagobas": "/assets/places/dagobas.webp",
  "Kandy Esala Perahera": "/assets/places/kandy_esala_perehera.webp",
  "Spice & Curry Traditions": "/assets/places/spice_and_curry.png",
  "Sacred Multi-Faith Coexistence": "/assets/places/sacred_multi_faith_coexistense.jpg",
  "Dumbara Mat Weaving": "/assets/places/dumbara_mat_waving.webp",
  "Ancient Maritime Culture": "/assets/places/ancient_maritime.png",
};

const DEFAULT_IMAGE = "/assets/places/culture.jpg";

function CultureContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePillar, setActivePillar] = useState<keyof typeof PILLARS_DATA | null>(null);

  useEffect(() => {
    const pillarParam = searchParams.get("pillar");
    if (pillarParam && pillarParam in PILLARS_DATA) {
      setActivePillar(pillarParam as keyof typeof PILLARS_DATA);
    }
  }, [searchParams]);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-24 font-sans">
      {/* Page Header */}
      <div className="mb-12">
        <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-3 block">
          {t("cult_eyebrow")}
        </span>
        <h1 className="font-serif text-[2rem] sm:text-[2.5rem] md:text-[3.2rem] leading-tight mb-4 text-textcolor">
          {t("cult_title")}
        </h1>
        <p className="text-muted text-[0.88rem] md:text-[0.95rem] max-w-2xl">
          {t("cult_sub")}
        </p>
      </div>

      {/* ── Down South Party Scene Section ── */}
      <div className="mb-20 md:mb-28">
        {/* Section Header */}
        <div className="mb-10 md:mb-14">
          <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-3 block">
            After Dark · Sri Lanka
          </span>
          <h2 className="font-serif text-2xl md:text-[2.6rem] leading-tight text-textcolor mb-4">
            The Down South Party Scene
          </h2>
          <p className="text-muted text-sm md:text-[0.95rem] max-w-2xl leading-relaxed">
            Sri Lanka&apos;s southern coastline has quietly become one of Asia&apos;s most electric nightlife destinations.
            From sunrise raves on Arugam Bay sand to rooftop progressive sessions above Galle Fort — this is the island after dark.
          </p>
        </div>

        {/* Hero Banner — Arugam Bay Rave */}
        <div className="relative w-full h-[340px] md:h-[480px] rounded-2xl overflow-hidden mb-6 border border-bordercolor shadow-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.10) 100%), url(/assets/places/arugam_bay_rave.png)`,
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
            <span className="inline-block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-accent bg-accent/10 border border-accent/25 px-3 py-1 rounded-full mb-3">
              🔥 Arugam Bay · Sunrise Rave
            </span>
            <h3 className="font-serif text-2xl md:text-4xl text-white mb-2">
              Where the Ocean Meets the Bass
            </h3>
            <p className="text-white/65 text-sm md:text-[0.9rem] max-w-xl leading-relaxed">
              Arugam Bay transforms every season into an open-air festival. International DJs, fire dancers, and surf culture collide under a sky full of stars on Sri Lanka&apos;s legendary east coast.
            </p>
          </div>
        </div>

        {/* 3-column Party Venues Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            {
              title: "Mirissa Beach Parties",
              tag: "🌊 South Coast",
              desc: "Beachfront bars that evolve into full dance floors after midnight. Liquid Space and Mirissa party culture draw international crowds from November to April.",
              img: "/assets/places/mirissa_beach_parties.png",
              vibe: "Beach · House · Reggae",
            },
            {
              title: "Unawatuna Rooftop Sessions",
              tag: "🏰 Galle District",
              desc: "Boutique rooftop venues overlooking the Indian Ocean. Progressive deep house sets, craft cocktails, and that unmistakable Galle golden hour glow.",
              img: "/assets/places/unawatuna_rooftop_sessions.png",
              vibe: "Rooftop · Progressive · Deep House",
            },
            {
              title: "Colombo Underground",
              tag: "🌆 City Raves",
              desc: "The capital's underground techno and progressive scene has exploded. Warehouse events, curated DJ nights, and a sophisticated local crowd who know their music.",
              img: "/assets/places/colombo_underground.png",
              vibe: "Techno · Warehouse · Electronic",
            },
          ].map((venue) => (
            <div
              key={venue.title}
              className="group relative h-[260px] rounded-xl overflow-hidden border border-bordercolor cursor-pointer hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 shadow-md"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.08) 100%), url(${venue.img})`,
                }}
              />
              <div className="absolute inset-0 p-5 flex flex-col justify-end z-10">
                <span className="text-[0.58rem] font-bold uppercase tracking-wider text-accent mb-1.5">
                  {venue.tag}
                </span>
                <h4 className="font-serif text-lg text-white mb-1.5">{venue.title}</h4>
                <p className="text-[0.72rem] text-white/60 leading-relaxed mb-3 line-clamp-3 group-hover:text-white/80 transition-colors">
                  {venue.desc}
                </p>
                <span className="text-[0.58rem] font-bold uppercase tracking-widest text-accent/70 border border-accent/20 px-2.5 py-1 rounded-full w-fit">
                  {venue.vibe}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Experience Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative h-[200px] rounded-xl overflow-hidden border border-bordercolor">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.55) 100%), url(/assets/places/full_moon_beach_raves.png)` }}
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-purple-400">
                Progressive &amp; Psy-Trance
              </span>
              <div>
                <h4 className="font-serif text-xl text-white mb-2">Full Moon Beach Raves</h4>
                <p className="text-[0.78rem] text-white/60 leading-relaxed">
                  Polhena, Tangalle and Rekawa beaches host full moon events drawing travelers and locals alike. Psy-trance, progressive, and ambient sounds carry across the water all night.
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-[200px] rounded-xl overflow-hidden border border-bordercolor">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.55) 100%), url(/assets/places/local_dj_scene.png)` }}
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-emerald-400">
                Local DJ Scene
              </span>
              <div>
                <h4 className="font-serif text-xl text-white mb-2">Sri Lanka&apos;s Homegrown Talent</h4>
                <p className="text-[0.78rem] text-white/60 leading-relaxed">
                  Artists like Imaad Majeed, Pasan Liyanage and collectives like Kolombia are pushing boundary-breaking electronic music that blends baila roots with modern production.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Eight Pillars Section */}
      <div className="mb-20 md:mb-24">
        <div className="mb-10">
          <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-2 block">
            {t("cult_pillar_eyebrow")}
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-textcolor mb-3">
            {t("cult_pillar_title")}
          </h2>
          <p className="text-muted text-xs md:text-sm max-w-2xl">
            {t("cult_pillar_desc")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {Object.entries(PILLARS_DATA).map(([key, data]) => {
            const IconComponent = data.icon;
            return (
              <div
                key={key}
                className="group relative h-[260px] sm:h-[320px] rounded-xl overflow-hidden border border-bordercolor bg-surface cursor-default hover:border-accent/50 hover:-translate-y-1 transition-all duration-300 shadow-md"
              >
                {/* Background photo — zooms on hover */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${data.bg})`,
                  }}
                />

                {/* Always-visible dark gradient + default content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 transition-opacity duration-300 group-hover:opacity-0" />
                <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end z-10 transition-opacity duration-300 group-hover:opacity-0">
                  <div className="w-9 h-9 rounded-lg bg-accentdim/20 border border-accent/30 text-accent flex items-center justify-center mb-3">
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-serif text-base sm:text-lg mb-1 text-white">{t(data.title.split(' & ')[0])}</h3>
                  <p className="text-[0.65rem] sm:text-[0.7rem] text-white/60 line-clamp-2">{t(data.tagline)}</p>
                </div>

                {/* Hover overlay — slides up from bottom with full details */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  {/* Frosted dark panel */}
                  <div className="absolute inset-0 bg-black/88 backdrop-blur-sm" />
                  <div className="relative p-4 sm:p-5 flex flex-col h-full justify-between">
                    {/* Header */}
                    <div className="flex items-start gap-2.5 pt-1">
                      <div className="w-8 h-8 shrink-0 rounded-lg bg-accent/20 border border-accent/40 text-accent flex items-center justify-center mt-0.5">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-serif text-sm sm:text-base text-white leading-tight">{t(data.title.split(' & ')[0])}</h3>
                        <p className="text-[0.6rem] text-accent font-semibold uppercase tracking-wider mt-0.5">{t(data.tagline)}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[0.68rem] sm:text-[0.72rem] text-white/70 leading-relaxed line-clamp-3">
                      {data.desc}
                    </p>

                    {/* Highlights */}
                    <ul className="space-y-1.5">
                      {data.highlights.slice(0, 3).map((hl, idx) => {
                        const title = hl.split(':')[0];
                        return (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[0.55rem] font-bold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-[0.65rem] text-white/75 leading-snug">{title}</span>
                          </li>
                        );
                      })}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={() => setActivePillar(key as keyof typeof PILLARS_DATA)}
                      className="w-full py-2 bg-accent hover:opacity-85 text-white text-[0.65rem] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-opacity"
                    >
                      {t("cult_view_interp")} <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Living Traditions Grid */}
      <div>
        <div className="mb-10">
          <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-2 block">
            {t("cult_living_eyebrow")}
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-textcolor mb-3">
            {t("cult_living_title")}
          </h2>
          <p className="text-muted text-xs md:text-sm max-w-2xl">
            {t("cult_living_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {CULTURE_ITEMS.map((c, i) => {
            const Icon = c.Icon;
            const imageSrc = CULTURE_IMAGES[c.title] || DEFAULT_IMAGE;
            return (
              <div
                key={i}
                className="group relative h-[280px] sm:h-[360px] rounded-2xl overflow-hidden border border-bordercolor bg-surface hover:border-accent/40 transition-all duration-300 shadow-sm"
              >
                {/* Photo background — dark gradient for text legibility always */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(9, 9, 11, 0.98) 0%, rgba(9, 9, 11, 0.55) 50%, rgba(9, 9, 11, 0.15) 100%), url(${imageSrc})`,
                  }}
                />

                {/* Icon top-right */}
                <div className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-surface/80 backdrop-blur-sm border border-bordercolor text-muted group-hover:text-accent group-hover:border-accent/40 flex items-center justify-center transition-all duration-300">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-end z-10 pointer-events-none">
                  <span className="text-[0.62rem] sm:text-[0.65rem] tracking-wider uppercase font-bold text-accent mb-2 block">
                    {t(c.tag)}
                  </span>
                  <h3 className="font-serif text-lg sm:text-2xl text-white mb-2 sm:mb-3">{t(c.title)}</h3>
                  <p className="text-[0.75rem] sm:text-[0.82rem] text-white/70 leading-relaxed max-w-lg transition-colors group-hover:text-white/90">
                    {t(c.desc)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pillar Slide Drawer */}
      <div
        className={`drawer-overlay ${activePillar ? "open" : ""}`}
        onClick={() => setActivePillar(null)}
      >
        <div className="drawer" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setActivePillar(null)}
            className="drawer-close-btn"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>

          {activePillar && (
            <div className="flex flex-col">
              {/* Banner image — always dark gradient over photo */}
              <div
                className="w-[calc(100%+2.5rem)] sm:w-[calc(100%+4rem)] -ml-5 sm:-ml-8 -mt-8 sm:-mt-12 h-[180px] sm:h-[220px] bg-cover bg-center mb-6 relative"
                style={{
                  backgroundImage: `linear-gradient(to top, var(--surface) 0%, rgba(9,9,11,0.25) 100%), url(${PILLARS_DATA[activePillar].bg})`,
                }}
              />

              <div className="mb-5">
                <span className="text-[0.65rem] tracking-[0.15em] uppercase text-accent font-bold mb-1 block">
                  {t("cult_drawer_eyebrow")}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl mb-1 text-textcolor">
                  {t(PILLARS_DATA[activePillar].title)}
                </h2>
                <p className="text-xs text-muted font-medium italic">{t(PILLARS_DATA[activePillar].tagline)}</p>
              </div>

              <div className="text-xs md:text-sm text-muted leading-relaxed space-y-4 mb-5">
                <p>{t(PILLARS_DATA[activePillar].desc)}</p>
              </div>

              <div className="bg-bg border border-bordercolor rounded-xl p-4 sm:p-5 mb-5">
                <h4 className="text-[0.7rem] sm:text-[0.72rem] tracking-[0.1em] uppercase font-bold text-textcolor mb-3">
                  {t("cult_drawer_highlights")}:
                </h4>
                <ul className="space-y-3">
                  {PILLARS_DATA[activePillar].highlights.map((hl, idx) => {
                    const [title, desc] = hl.split(': ');
                    return (
                      <li key={idx} className="text-xs text-muted leading-relaxed flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-accentdim/20 text-accent flex items-center justify-center text-[0.62rem] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <strong className="text-textcolor font-medium">{t(title)}</strong>: {t(desc)}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="bg-ambercolor/5 border border-ambercolor/10 rounded-xl p-4 sm:p-5 mb-6">
                <h4 className="text-[0.72rem] tracking-[0.15em] uppercase font-bold text-ambercolor mb-1.5">
                  {t("cult_drawer_tip")}:
                </h4>
                <p className="text-xs text-muted leading-relaxed">{t(PILLARS_DATA[activePillar].tip)}</p>
              </div>

              <button
                onClick={() => {
                  const pillarName = PILLARS_DATA[activePillar!].title;
                  setActivePillar(null);
                  router.push(`/planner?notes=${encodeURIComponent(`I want to plan a custom trip highlighting ${pillarName}.`)}`);
                }}
                className="w-full py-2.5 bg-accent hover:opacity-85 text-white text-xs font-medium uppercase tracking-wider rounded-lg text-center cursor-pointer"
              >
                {t("cult_plan_btn")} — {t(activePillar.toUpperCase())}
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
    <Suspense fallback={<div className="p-24 text-center text-muted"><div className="inline-block w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" /></div>}>
      <CultureContent />
    </Suspense>
  );
}
