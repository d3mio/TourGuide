"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation, useAppStore } from "@/store";
import { Menu, X, Sun, Moon } from "lucide-react";
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
    <nav className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between h-16 px-4 md:px-8 transition-all duration-300 ${scrolled ? "bg-bg/80 backdrop-blur-md border-b border-bordercolor" : "bg-transparent"}`}>
      {/* Logo */}
      <div className="md:mr-10 whitespace-nowrap flex items-center shrink-0">
        <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 group">

          <div className="flex flex-col leading-none">
            <span className="text-[0.52rem] tracking-[0.28em] uppercase text-muted font-bold transition-colors group-hover:text-accent">Experience</span>
            <span className="font-serif text-[1.08rem] font-bold tracking-wide text-textcolor mt-0.5">
              Ceylon Luxe <span className="text-emerald-500 font-light">Travels</span>
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
            return (
              <li key={link.href} className="relative z-10">
                <Link
                  href={link.href}
                  onMouseEnter={() => setHoveredPath(link.href)}
                  className={`relative z-20 flex items-center justify-center px-4 py-2 font-sans text-[0.85rem] font-medium transition-colors duration-300 whitespace-nowrap rounded-full ${
                    isActive ? "text-textcolor" : "text-muted hover:text-textcolor"
                  }`}
                >
                  {t(link.label)}
                </Link>
                
                {isHovered && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-textcolor/10 rounded-full -z-10"
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
          <button onClick={() => supabase.auth.signOut()} className="text-sm font-medium text-muted hover:text-textcolor transition-colors px-4 py-2 cursor-pointer">
            Signout
          </button>
        ) : (
          <Link href="/login" className="text-sm font-medium text-muted hover:text-textcolor transition-colors px-4 py-2">
            Login
          </Link>
        )}
        {/* Language Selector — pill buttons */}
        <div className="flex items-center gap-1 p-0.5">
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

          </div>
        </div>
      )}
    </nav>
  );
}
