"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/store";
import { PILLARS_DATA } from "@/data/mockData";
import { ArrowRight, Landmark, Leaf, Waves, Coffee, Camera } from "lucide-react";
import Text3DFlip from "@/components/ui/text-3d-flip";
import HeroFluid from "@/components/ui/hero-fluid";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col -mt-16">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-[100svh] flex items-center pt-[5rem] pb-12 md:pt-[6rem] md:pb-16 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/srilanka.jpg')" }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-0" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full items-center relative z-10 flex justify-center text-center">

          {/* Text Content */}
          <div className="flex flex-col items-center max-w-3xl">

            <Text3DFlip
              as="h1"
              className="font-serif text-[clamp(2.4rem,7vw,5.5rem)] leading-[1.05] font-light tracking-tight mb-5"
              textClassName="text-white drop-shadow-md"
              flipTextClassName="text-accent"
              rotateDirection="top"
            >
              {t("hero_title")}
            </Text3DFlip>
            <p className="text-white/90 drop-shadow text-[0.92rem] md:text-[1.05rem] leading-relaxed max-w-[520px] mb-8">
              {t("hero_sub")}
            </p>
            {/* CTA Pill */}
            <div className="flex items-center justify-center rounded-full w-fit max-w-full bg-transparent border border-transparent p-0 xs:bg-black/40 xs:border-white/20 xs:p-1 xs:pl-4 xs:pr-1 xs:shadow-2xl xs:backdrop-blur-md">
              <span className="text-[0.65rem] tracking-[0.12em] font-semibold text-white/90 uppercase mr-3 sm:mr-6 hidden xs:inline-block">
                {t("hero_cta_label")}
              </span>
              <Link
                href="/planner"
                className="px-5 sm:px-6 py-2.5 bg-accent hover:opacity-85 text-white font-medium uppercase tracking-[0.06em] text-[0.7rem] rounded-full transition-all duration-200 shadow-md shadow-accent/20 cursor-pointer whitespace-nowrap"
              >
                {t("hero_cta_btn")}
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Categories / Travel Themes Section */}
      <section className="bg-bg border-t border-bordercolor py-14 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 filter blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="mb-10 md:mb-12 text-center max-w-2xl mx-auto">
            <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-3 block">
              {t("pillars_eyebrow")}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-textcolor mb-4">
              {t("pillars_title")}
            </h2>
            <p className="text-muted text-xs md:text-sm px-2">
              {t("pillars_desc")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {Object.entries(PILLARS_DATA).map(([key, data]) => {
              const Icon = data.icon;
              return (
                <Link
                  key={key}
                  href={`/culture?pillar=${key}`}
                  className="group bg-surface/30 hover:bg-surface/50 border border-bordercolor hover:border-accent/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5 flex flex-col justify-between min-h-[160px] sm:h-[220px]"
                >
                  <div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accentdim/25 border border-accent/20 text-accent flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:border-transparent">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="font-serif text-base sm:text-lg text-textcolor mb-1 sm:mb-1.5 group-hover:text-accent transition-colors">
                      {t(data.title.split(' & ')[0])}
                    </h3>
                    <p className="text-[0.68rem] sm:text-[0.72rem] text-muted leading-relaxed line-clamp-2 sm:line-clamp-3">
                      {t(data.tagline)}
                    </p>
                  </div>
                  <span className="text-[0.65rem] sm:text-[0.7rem] font-bold text-accent flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity mt-3 sm:mt-4 uppercase tracking-wider">
                    {t("nav_explore")} <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Sri Lanka Bento Grid Section */}
      <section className="border-t border-bordercolor bg-surface/10 py-14 md:py-20 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 filter blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="mb-10 md:mb-12 text-center max-w-2xl mx-auto">
            <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-3 block">
              {t("why_eyebrow")}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-textcolor">
              {t("why_title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {/* Heritage — spans 2 cols on md */}
            <div className="sm:col-span-2 md:col-span-2 bg-surface/30 border border-bordercolor rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-all duration-300 flex flex-col justify-between min-h-[180px] md:min-h-[220px]">
              <div className="w-10 h-10 rounded-xl bg-accentdim/20 border border-accent/20 text-accent flex items-center justify-center mb-4">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-textcolor mb-2">{t("bento_heritage_title")}</h3>
                <p className="text-xs md:text-sm text-muted leading-relaxed max-w-xl">{t("bento_heritage_desc")}</p>
              </div>
            </div>

            {/* Biodiversity */}
            <div className="bg-surface/30 border border-bordercolor rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-all duration-300 flex flex-col justify-between min-h-[180px] md:min-h-[220px]">
              <div className="w-10 h-10 rounded-xl bg-accentdim/20 border border-accent/20 text-accent flex items-center justify-center mb-4">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-textcolor mb-2">{t("bento_bio_title")}</h3>
                <p className="text-xs md:text-sm text-muted leading-relaxed">{t("bento_bio_desc")}</p>
              </div>
            </div>

            {/* Pristine Coasts */}
            <div className="bg-surface/30 border border-bordercolor rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-all duration-300 flex flex-col justify-between min-h-[180px] md:min-h-[220px]">
              <div className="w-10 h-10 rounded-xl bg-accentdim/20 border border-accent/20 text-accent flex items-center justify-center mb-4">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-textcolor mb-2">{t("bento_coast_title")}</h3>
                <p className="text-xs md:text-sm text-muted leading-relaxed">{t("bento_coast_desc")}</p>
              </div>
            </div>

            {/* Hospitality */}
            <div className="bg-surface/30 border border-bordercolor rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-all duration-300 flex flex-col justify-between min-h-[180px] md:min-h-[220px]">
              <div className="w-10 h-10 rounded-xl bg-accentdim/20 border border-accent/20 text-accent flex items-center justify-center mb-4">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-textcolor mb-2">{t("bento_hosp_title")}</h3>
                <p className="text-xs md:text-sm text-muted leading-relaxed">{t("bento_hosp_desc")}</p>
              </div>
            </div>

            {/* Photographer's Dream — spans 2 on md */}
            <div className="sm:col-span-2 md:col-span-2 bg-surface/30 border border-bordercolor rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-all duration-300 flex flex-col justify-between min-h-[180px] md:min-h-[220px]">
              <div className="w-10 h-10 rounded-xl bg-accentdim/20 border border-accent/20 text-accent flex items-center justify-center mb-4">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-textcolor mb-2">{t("bento_photo_title")}</h3>
                <p className="text-xs md:text-sm text-muted leading-relaxed max-w-xl">{t("bento_photo_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customize Your Tour Call to Action */}
      <section className="border-t border-bordercolor bg-bg py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-[#0e1626]/20 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <div className="bg-surface border border-bordercolor rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-accent/10 filter blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-accent/10 filter blur-[80px] rounded-full pointer-events-none" />

            <span className="text-[0.68rem] tracking-[0.2em] uppercase text-accent font-bold mb-4 block">
              {t("home_cta_eyebrow")}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-textcolor mb-5 md:mb-6 leading-tight">
              {t("customizer_title")}
            </h2>
            <p className="text-muted text-xs md:text-sm leading-relaxed max-w-xl mx-auto mb-7 md:mb-8 px-2">
              {t("home_cta_desc")}
            </p>
            <Link
              href="/planner"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-accent hover:opacity-85 text-white font-medium uppercase tracking-wider text-[0.72rem] sm:text-xs rounded-xl shadow-lg shadow-accent/25 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              {t("home_cta_btn_customize")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
