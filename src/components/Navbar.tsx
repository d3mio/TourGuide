"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation, useAppStore } from "@/store";
import { Menu, X, Sun, Moon, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const { t, lang } = useTranslation();
  const { setLang, user } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "nav_home" },
    { href: "/explore", label: "nav_explore" },
    { href: "/planner", label: "nav_planner" },
    { href: "/culture", label: "nav_culture" },
    { href: "/experiences", label: "nav_exp" },
    { href: "/profile", label: "nav_profile" },
  ];

  const LANGUAGES = [
    { code: "en", name: "EN" },
    { code: "fr", name: "FR" },
    { code: "de", name: "DE" },
    { code: "it", name: "IT" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between h-16 px-4 md:px-8 transition-all duration-300 ${scrolled ? "bg-bg/80 backdrop-blur-md border-b border-bordercolor shadow-sm" : "!bg-transparent !border-transparent"}`}>
      {/* Logo */}
      <div className="md:mr-10 whitespace-nowrap flex items-center shrink-0">
        <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 group">

          {/* Logo Mark */}
          <div className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-colors ${pathname === '/' && !scrolled ? 'bg-white/20 backdrop-blur-sm' : 'bg-surface border border-bordercolor shadow-sm'}`}>
            <Compass className={`w-5 h-5 ${pathname === '/' && !scrolled ? 'text-white' : 'text-emerald-500'}`} strokeWidth={2} />
          </div>

          <div className="flex flex-col leading-none">
            <span className={`text-[0.52rem] tracking-[0.28em] uppercase font-bold transition-colors group-hover:text-accent ${pathname === '/' && !scrolled ? 'text-white/70' : 'text-muted'}`}>Experience</span>
            <span className={`font-serif text-[1.08rem] font-bold tracking-wide mt-0.5 ${pathname === '/' && !scrolled ? 'text-white' : 'text-textcolor'}`}>
              Ceylon Luxe <span className={pathname === '/' && !scrolled ? 'text-emerald-400 font-normal' : 'text-emerald-500 font-light'}>Travels</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex flex-1 justify-center absolute left-1/2 -translate-x-1/2">
        <ul 
          className="flex items-center gap-2 md:gap-6 list-none"
          onMouseLeave={() => setHoveredPath(null)}
        >
          {links.map((link) => {
            const isActive = pathname === link.href;
            const isHovered = hoveredPath === link.href;
            
            // Dynamic text colors based on background
            let linkColor = "text-muted hover:text-textcolor";
            if (pathname === '/' && !scrolled) {
              linkColor = isActive ? "text-white font-semibold" : "text-white/80 hover:text-white";
            } else if (isActive) {
              linkColor = "text-textcolor font-semibold";
            }

            return (
              <li key={link.href} className="relative z-10">
                <Link
                  href={link.href}
                  onMouseEnter={() => setHoveredPath(link.href)}
                  className={`relative z-20 flex items-center justify-center px-4 py-2 font-sans text-[0.85rem] transition-colors duration-300 whitespace-nowrap rounded-full ${linkColor}`}
                >
                  {t(link.label)}
                </Link>
                
                {isHovered && (
                  <motion.div
                    layoutId="nav-pill"
                    className={`absolute inset-0 rounded-full -z-10 ${pathname === '/' && !scrolled ? 'bg-white/10' : 'bg-textcolor/10'}`}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Desktop Controls */}
      <div className="hidden md:flex items-center gap-3 ml-auto shrink-0 z-10">
        {user ? (
          <button onClick={() => supabase.auth.signOut()} className={`text-sm font-medium transition-colors px-4 py-2 cursor-pointer ${pathname === '/' && !scrolled ? 'text-white/80 hover:text-white' : 'text-muted hover:text-textcolor'}`}>
            {t("auth_signout")}
          </button>
        ) : (
          <Link href="/login" className={`text-sm font-medium transition-colors px-4 py-2 ${pathname === '/' && !scrolled ? 'text-white/80 hover:text-white' : 'text-muted hover:text-textcolor'}`}>
            {t("auth_login")}
          </Link>
        )}
        {/* Language Selector — pill buttons */}
        <div className="flex items-center gap-1 p-0.5">
          {LANGUAGES.map((lng) => {
            const isSelected = lang === lng.code;
            let langColor = "text-muted hover:text-textcolor";
            if (isSelected) {
              langColor = "bg-accent text-white";
            } else if (pathname === '/' && !scrolled) {
              langColor = "text-white/80 hover:text-white";
            }
            
            return (
              <button
                key={lng.code}
                onClick={() => setLang(lng.code)}
                className={`px-2.5 py-1 rounded-full text-[0.65rem] font-bold tracking-wider transition-all cursor-pointer ${langColor}`}
              >
                {lng.name}
              </button>
            );
          })}
        </div>

      </div>

      {/* Mobile Controls */}
      <div className="md:hidden flex items-center gap-2 ml-auto shrink-0 z-10">
        {user ? (
          <button onClick={() => supabase.auth.signOut()} className={`text-[0.65rem] font-bold uppercase tracking-wider px-3 py-1.5 border rounded-full transition-colors ${pathname === '/' && !scrolled ? 'text-white border-white/30 hover:bg-white/10' : 'text-textcolor border-bordercolor hover:bg-surface/50'}`}>
            {t("auth_signout")}
          </button>
        ) : (
          <Link href="/login" className={`text-[0.65rem] font-bold uppercase tracking-wider px-3 py-1.5 border rounded-full transition-colors ${pathname === '/' && !scrolled ? 'text-white border-white/30 hover:bg-white/10' : 'text-textcolor border-bordercolor hover:bg-surface/50'}`}>
            {t("auth_login")}
          </Link>
        )}
        <button
          className={`p-1.5 rounded-md transition-colors ${pathname === '/' && !scrolled ? 'text-white hover:bg-white/10' : 'text-textcolor hover:bg-surface/50'}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed top-14 left-0 w-full h-[calc(100dvh-56px)] bg-bg/97 backdrop-blur-xl border-b border-bordercolor flex flex-col items-center justify-center gap-6 p-6 md:hidden z-40 overflow-y-auto"
          style={{ backgroundColor: "color-mix(in srgb, var(--bg) 97%, transparent)" }}
        >
          <ul className="flex flex-col items-center gap-5 w-full">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-lg font-medium tracking-widest uppercase transition-colors duration-200 ${
                      isActive ? "text-accent" : "text-muted hover:text-textcolor"
                    }`}
                  >
                    {t(link.label)}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Overlay Controls */}
          <div className="flex flex-col items-center gap-5 mt-6 pt-6 border-t border-bordercolor w-full">
            {/* Language buttons — larger on mobile */}
            <div className="flex gap-2">
              {LANGUAGES.map((lng) => (
                <button
                  key={lng.code}
                  onClick={() => { setLang(lng.code); setMobileOpen(false); }}
                  className={`px-4 py-2 rounded-full text-sm font-bold tracking-wider border transition-all cursor-pointer ${
                    lang === lng.code
                      ? "bg-accent text-white border-accent"
                      : "border-bordercolor text-muted hover:text-textcolor hover:border-accent/50"
                  }`}
                >
                  {lng.name}
                </button>
              ))}
            </div>
            {/* Login button on mobile */}
            <div className="w-full max-w-[200px]">
              {user ? (
                <button onClick={() => { setMobileOpen(false); supabase.auth.signOut(); }} className="w-full text-center py-2.5 bg-surface/50 hover:bg-surface border border-bordercolor rounded-xl font-medium tracking-wide transition-colors">
                  {t("auth_signout")}
                </button>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center py-2.5 bg-accent hover:opacity-85 text-white rounded-xl font-medium tracking-wide transition-colors">
                  {t("auth_login")}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
