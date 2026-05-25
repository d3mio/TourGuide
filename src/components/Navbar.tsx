"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation, useAppStore } from "@/store";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { t, lang } = useTranslation();
  const { setLang, toggleTheme, theme } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <nav className="sticky top-0 z-50 flex items-center justify-between h-14 px-4 md:px-8 bg-bg/80 backdrop-blur-md border-b border-bordercolor">
      {/* Logo */}
      <div className="md:mr-10 whitespace-nowrap flex items-center shrink-0">
        <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center">
            <svg
              className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-transform duration-500 group-hover:rotate-12"
              viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="42" stroke="url(#navLogoGrad)" strokeWidth="3" strokeDasharray="6 3" className="opacity-60" />
              <path d="M50 12 C62 30, 78 45, 50 82 C22 45, 38 30, 50 12 Z" fill="url(#navLogoGrad)" className="opacity-90" />
              <path d="M28 58 C42 53, 58 63, 72 58" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
              <defs>
                <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[0.52rem] tracking-[0.28em] uppercase text-muted font-bold transition-colors group-hover:text-accent">Sri Lankan</span>
            <span className="font-serif text-[1.08rem] font-bold tracking-wide text-textcolor mt-0.5">
              Serendib<span className="text-emerald-500 font-light">Tours</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex flex-1 gap-0 list-none overflow-x-auto hide-scrollbar">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center justify-center px-3 lg:px-4 h-14 font-sans text-[0.75rem] lg:text-[0.78rem] font-normal tracking-wide uppercase relative transition-colors duration-200 whitespace-nowrap ${
                  isActive ? "text-textcolor" : "text-muted hover:text-textcolor"
                }`}
              >
                {t(link.label)}
                <span
                  className={`absolute bottom-0 left-3 right-3 lg:left-4 lg:right-4 h-[1px] bg-accent transition-transform duration-250 ease-out origin-center ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Desktop Controls */}
      <div className="hidden md:flex items-center gap-2 ml-auto shrink-0">
        {/* Language Selector — pill buttons */}
        <div className="flex items-center gap-0.5 border border-bordercolor rounded-full p-0.5 bg-surface/50">
          {LANGUAGES.map((lng) => (
            <button
              key={lng.code}
              onClick={() => setLang(lng.code)}
              className={`px-2.5 py-1 rounded-full text-[0.65rem] font-bold tracking-wider transition-all cursor-pointer ${
                lang === lng.code
                  ? "bg-accent text-white"
                  : "text-muted hover:text-textcolor"
              }`}
            >
              {lng.name}
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="ml-1 w-8 h-8 flex items-center justify-center rounded-full border border-bordercolor text-muted hover:border-accent hover:text-accent transition-all bg-surface/50"
          aria-label="Toggle theme"
          title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}
        >
          {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-textcolor p-1.5 rounded-md hover:bg-surface/50 transition-colors ml-2"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

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

          {/* Mobile Controls */}
          <div className="flex flex-col items-center gap-5 mt-6 pt-6 border-t border-bordercolor w-full">
            {/* Language buttons — larger on mobile */}
            <div className="flex gap-2">
              {LANGUAGES.map((lng) => (
                <button
                  key={lng.code}
                  onClick={() => setLang(lng.code)}
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

            {/* Theme toggle */}
            <button
              onClick={() => { toggleTheme(); }}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-bordercolor text-textcolor bg-surface/50 text-sm font-semibold hover:border-accent transition-all"
            >
              {theme === "dark" ? (
                <><Sun className="w-4 h-4 text-amber-400" /> Light Mode</>
              ) : (
                <><Moon className="w-4 h-4 text-blue-400" /> Dark Mode</>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
