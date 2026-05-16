"use client";

import { useTranslation } from "@/store";
import { CULTURE_ITEMS } from "@/data/mockData";

export default function Culture() {
  const { t } = useTranslation();

  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <div className="text-[0.68rem] tracking-[0.15em] uppercase text-muted mb-3">{t("cult_eyebrow")}</div>
      <h1 className="font-serif text-[2.8rem] mb-2">{t("cult_title")}</h1>
      <p className="text-[0.9rem] text-muted mb-10 max-w-[560px]">{t("cult_sub")}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CULTURE_ITEMS.map((c, i) => (
          <div key={i} className="bg-surface border border-bordercolor rounded-xl overflow-hidden hover:border-accent hover:-translate-y-[2px] transition-all">
            <div className="h-40 flex items-center justify-center text-5xl bg-bordercolor/50">
              {c.emoji}
            </div>
            <div className="p-5">
              <div className="text-[0.68rem] tracking-[0.1em] uppercase text-accent mb-1.5">{c.tag}</div>
              <h3 className="text-[1.25rem] font-serif mb-2">{c.title}</h3>
              <p className="text-[0.81rem] text-muted leading-relaxed">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
