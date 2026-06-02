"use client";

import Link from "next/link";
import { useTranslation } from "@/store";

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="border-t border-bordercolor bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
          
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <div className="relative flex items-center justify-center">
                {/* Elegant SVG Logo for Serendib Tours */}
                <svg className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-transform duration-500 group-hover:rotate-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="42" stroke="url(#footerLogoGrad)" strokeWidth="3" strokeDasharray="6 3" className="opacity-60" />
                  <path d="M50 12 C62 30, 78 45, 50 82 C22 45, 38 30, 50 12 Z" fill="url(#footerLogoGrad)" className="opacity-90" />
                  <path d="M28 58 C42 53, 58 63, 72 58" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="footerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex flex-col leading-none text-left">
                <span className="text-[0.52rem] tracking-[0.28em] uppercase text-muted font-bold transition-colors group-hover:text-accent">Sri Lankan</span>
                <span className="font-serif text-[1.12rem] font-bold tracking-wide text-textcolor mt-0.5">
                  Serendib<span className="text-emerald-500 font-light">Tours</span>
                </span>
              </div>
            </Link>
            <p className="text-[0.85rem] text-muted leading-relaxed max-w-[320px]">
              {t("footer_desc")}
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-[0.75rem] tracking-[0.1em] uppercase text-textcolor font-medium mb-4">{t("footer_explore")}</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/explore" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">{t("nav_explore") || "Destinations"}</Link></li>
              <li><Link href="/planner" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">{t("nav_planner") || "Trip Planner"}</Link></li>
              <li><Link href="/culture" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">{t("nav_culture") || "Culture"}</Link></li>
              <li><Link href="/experiences" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">{t("nav_exp") || "Experiences"}</Link></li>
            </ul>
          </div>
          
          {/* Connect */}
          <div>
            <h4 className="text-[0.75rem] tracking-[0.1em] uppercase text-textcolor font-medium mb-4">{t("footer_connect")}</h4>
            <ul className="flex flex-col gap-2.5">
              <li><a href="#" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">Instagram</a></li>
              <li><a href="#" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">Twitter (X)</a></li>
              <li><a href="#" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">{t("footer_contact")}</a></li>
              <li><a href="#" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">{t("footer_privacy")}</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-12 pt-8 border-t border-bordercolor flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-[0.75rem] text-muted tracking-wide">
            &copy; {new Date().getFullYear()} Sri Lankan Serendib Tours. {t("footer_rights")}
          </p>
          <div className="flex gap-4">
            <span className="text-[0.75rem] text-muted tracking-wide">
              Developed by <a href="https://instagram.com/disas_10.20" target="_blank" rel="noopener noreferrer" className="text-textcolor font-medium hover:text-emerald-500 transition-colors">d3mio</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
