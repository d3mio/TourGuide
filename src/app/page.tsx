"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/store";
import { PILLARS_DATA } from "@/data/mockData";
import { ArrowRight, Landmark, Leaf, Waves, Coffee, Camera } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();

  // States for split slider
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      handleSliderMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      if (e.touches.length > 0) {
        handleSliderMove(e.touches[0].clientX);
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div className="relative flex flex-col">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-[100svh] flex items-center pt-16 pb-12 md:pt-20 md:pb-16 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-bg to-bg pointer-events-none z-0" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-12 items-center relative z-10">

          {/* Text Content */}
          <div className="flex flex-col items-start text-left">
            <span className="font-sans text-[0.68rem] tracking-[0.2em] uppercase font-bold text-accent px-3 py-1 rounded-full border border-accent/25 bg-accentdim/15 mb-5 pulse-glow">
              {t("hero_badge")}
            </span>
            <h1 className="font-serif text-[clamp(2.4rem,7vw,5.5rem)] leading-[1.05] font-light tracking-tight mb-5 text-textcolor">
              {t("hero_title")}
            </h1>
            <p className="text-muted text-[0.92rem] md:text-[1.05rem] leading-relaxed max-w-[520px] mb-8">
              {t("hero_sub")}
            </p>
            {/* CTA Pill */}
            <div className="flex items-center rounded-full w-fit max-w-full bg-transparent border border-transparent p-0 xs:bg-surface/85 xs:border-bordercolor xs:p-1 xs:pl-4 xs:pr-1 xs:shadow-lg xs:backdrop-blur-md">
              <span className="text-[0.65rem] tracking-[0.12em] font-semibold text-muted uppercase mr-3 sm:mr-6 hidden xs:inline-block">
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


          {/* Interactive Split-Screen Image Slider */}
          <div className="w-full mt-4 lg:mt-0">
            <div className="split-slider-wrapper">
              <div
                ref={sliderRef}
                className="split-slider"
                onMouseMove={(e) => !isDragging.current && handleSliderMove(e.clientX)}
                onTouchMove={(e) => {
                  if (!isDragging.current && e.touches.length > 0) {
                    handleSliderMove(e.touches[0].clientX);
                  }
                }}
              >
                {/* Right Panel (Nature & Adventure) */}
                <div className="slider-panel panel-right">
                  <img src="/assets/adventure.png" alt="Adventure Sri Lanka" className="slider-image" />
                  <div className="panel-overlay-content text-right">
                    <h3 className="font-serif text-[1.1rem] sm:text-[1.4rem] font-light text-textcolor mb-1">{t("slider_right_title")}</h3>
                    <p className="text-[0.7rem] sm:text-xs text-muted hidden sm:block">{t("slider_right_desc")}</p>
                  </div>
                </div>

                {/* Left Panel (Culture & Heritage) */}
                <div
                  className="slider-panel panel-left"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img src="/assets/heritage.png" alt="Culture Sri Lanka" className="slider-image" />
                  <div className="panel-overlay-content text-left whitespace-nowrap">
                    <h3 className="font-serif text-[1.1rem] sm:text-[1.4rem] font-light text-textcolor mb-1">{t("slider_left_title")}</h3>
                    <p className="text-[0.7rem] sm:text-xs text-muted hidden sm:block">{t("slider_left_desc")}</p>
                  </div>
                </div>

                {/* Drag Handle */}
                <div
                  className="slider-handle"
                  style={{ left: `${sliderPos}%` }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleMouseDown}
                >
                  <div className="w-[1px] h-full bg-accent/40 flex-grow" />
                  <div className="handle-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                  </div>
                  <div className="w-[1px] h-full bg-accent/40 flex-grow" />
                </div>
              </div>
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
                      {data.title.split(' & ')[0]}
                    </h3>
                    <p className="text-[0.68rem] sm:text-[0.72rem] text-muted leading-relaxed line-clamp-2 sm:line-clamp-3">
                      {data.tagline}
                    </p>
                  </div>
                  <span className="text-[0.65rem] sm:text-[0.7rem] font-bold text-accent flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity mt-3 sm:mt-4 uppercase tracking-wider">
                    Explore <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
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
              Bespoke Planner
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-textcolor mb-5 md:mb-6 leading-tight">
              {t("customizer_title")}
            </h2>
            <p className="text-muted text-xs md:text-sm leading-relaxed max-w-xl mx-auto mb-7 md:mb-8 px-2">
              Every traveler&apos;s pace is different. Tailor this travel plan directly by adjusting the duration, picking pillars that appeal to your interests, setting your budget, and letting our island experts craft your personal dream itinerary.
            </p>
            <Link
              href="/planner"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-accent hover:opacity-85 text-white font-medium uppercase tracking-wider text-[0.72rem] sm:text-xs rounded-xl shadow-lg shadow-accent/25 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              Customize Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
