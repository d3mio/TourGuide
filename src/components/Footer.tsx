"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { useTranslation } from "@/store";

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="border-t border-bordercolor bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
          
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 group mb-4">
              
              <div className="flex flex-col leading-none text-left">
                <span className="text-[0.52rem] tracking-[0.28em] uppercase text-muted font-bold transition-colors group-hover:text-accent">{t("brand_prefix") || "Sri Lankan"}</span>
                <span className="font-serif text-[1.12rem] font-bold tracking-wide text-textcolor mt-0.5">
                  {t("brand_name_part1")} <span className="text-emerald-500 font-light">{t("brand_name_part2")}</span>
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
              <li><a href="https://www.facebook.com/share/18cREe5iHa/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">Facebook</a></li>
              <li><a href="https://www.tiktok.com/@shaggy_tattoosandtours" target="_blank" rel="noopener noreferrer" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">TikTok</a></li>
              <li><a href="https://www.instagram.com/dineth.tks?igsh=MWQ5NjEzbWprMDM0YQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">Instagram</a></li>
              <li><a href="#" className="text-[0.85rem] text-muted hover:text-emerald-500 transition-colors">{t("footer_contact")}</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-12 pt-8 border-t border-bordercolor flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-[0.75rem] text-muted tracking-wide">
            &copy; {new Date().getFullYear()} Ceylon Luxe Travels. {t("footer_rights")}
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
