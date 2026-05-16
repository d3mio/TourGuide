"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "@/store";
import { PROVINCES, BG_COLORS } from "@/data/mockData";

export default function Explore() {
  const { t } = useTranslation();
  const provinces = ["All", ...Object.keys(PROVINCES)];
  const [currentProvince, setCurrentProvince] = useState(provinces[0]);

  const places = currentProvince === "All"
    ? Object.entries(PROVINCES).flatMap(([prov, places]) => places.map(p => ({ ...p, prov })))
    : (PROVINCES[currentProvince] || []).map(p => ({ ...p, prov: currentProvince }));

  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <div className="text-[0.68rem] tracking-[0.15em] uppercase text-muted mb-3">{t("exp_eyebrow")}</div>
      <h1 className="font-serif text-[2.8rem] mb-8">{t("exp_title")}</h1>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {provinces.map((p) => (
          <button
            key={p}
            onClick={() => setCurrentProvince(p)}
            className={`px-4 py-[0.45rem] rounded-full text-[0.75rem] tracking-[0.05em] font-medium border transition-all ${
              p === currentProvince
                ? "border-accent text-accent bg-accentdim"
                : "border-bordercolor text-muted hover:border-textcolor hover:text-textcolor"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {places.map((p, i) => (
          <div key={p.name} className="bg-surface border border-bordercolor rounded-xl overflow-hidden hover:border-accent hover:-translate-y-[2px] transition-all group flex flex-col">
            <div className="h-[200px] relative overflow-hidden bg-bordercolor">
              <div 
                className="w-full h-full flex items-center justify-center font-serif text-[1.1rem] italic text-white/30 transition-transform duration-500 group-hover:scale-105"
                style={{ background: BG_COLORS[i % BG_COLORS.length] }}
              >
                {p.name}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-[1.25rem] font-serif mb-1">{p.name}</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[0.8rem] text-ambercolor">★ {p.rating}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.7rem] tracking-[0.06em] font-medium border border-bordercolor text-muted uppercase">
                  {p.prov}
                </span>
              </div>
              <p className="text-[0.79rem] text-muted leading-relaxed mb-4 flex-1">{p.desc}</p>
              <Link 
                href={`/planner?dest=${encodeURIComponent(p.name)}`}
                className="inline-flex justify-center items-center gap-1 px-4 py-2 rounded-md text-[0.72rem] font-medium tracking-[0.06em] uppercase border border-bordercolor text-textcolor hover:border-accent hover:text-accent transition-colors"
              >
                Plan This Journey
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
