"use client";

import Link from "next/link";
import { useTranslation } from "@/store";

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="border-t border-bordercolor bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-[1.5rem] font-medium tracking-wide text-textcolor transition-colors inline-block mb-4">
              Visit<span className="text-emerald-500">Ceylon</span>
            </Link>
            <p className="text-[0.85rem] text-muted leading-relaxed max-w-[320px]">
              An uncharted editorial journey through heritage citadels, emerald highlands, and shores that redefine the horizon.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-[0.75rem] tracking-[0.1em] uppercase text-textcolor font-medium mb-4">Explore</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/explore" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">{t("nav_explore") || "Destinations"}</Link></li>
              <li><Link href="/planner" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">{t("nav_planner") || "Trip Planner"}</Link></li>
              <li><Link href="/culture" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">{t("nav_culture") || "Culture"}</Link></li>
              <li><Link href="/experiences" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">{t("nav_exp") || "Experiences"}</Link></li>
            </ul>
          </div>
          
          {/* Connect */}
          <div>
            <h4 className="text-[0.75rem] tracking-[0.1em] uppercase text-textcolor font-medium mb-4">Connect</h4>
            <ul className="flex flex-col gap-2.5">
              <li><a href="#" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">Instagram</a></li>
              <li><a href="#" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">Twitter (X)</a></li>
              <li><a href="#" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-12 pt-8 border-t border-bordercolor flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-[0.75rem] text-muted tracking-wide">
            &copy; {new Date().getFullYear()} VisitCeylon. All rights reserved.
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
