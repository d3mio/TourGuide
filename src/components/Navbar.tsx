"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation, useAppStore } from "@/store";
import { Menu, X } from "lucide-react";

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

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between h-14 px-4 md:px-8 bg-bg/80 backdrop-blur-md border-b border-bordercolor transition-colors duration-400">
      <div className="md:mr-12 whitespace-nowrap">
        <Link href="/" onClick={() => setMobileOpen(false)} className="font-serif text-[1.35rem] font-medium tracking-wide text-textcolor transition-colors">
          Visit<span className="text-emerald-500">Ceylon</span>
        </Link>
      </div>
      
      {/* Desktop Links */}
      <ul className="hidden md:flex flex-1 gap-0 list-none">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center justify-center px-4 h-14 font-sans text-[0.78rem] font-normal tracking-wide uppercase relative transition-colors duration-200 ${
                  isActive 
                    ? "text-textcolor" 
                    : "text-muted hover:text-textcolor"
                }`}
              >
                {t(link.label)}
                <span 
                  className={`absolute bottom-0 left-4 right-4 h-[1px] bg-emerald-500 transition-transform duration-250 ease-out origin-center ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`} 
                />
              </Link>
            </li>
          );
        })}
      </ul>
      
      {/* Desktop Controls */}
      <div className="hidden md:flex items-center gap-4 ml-auto">
        <select 
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="bg-transparent border border-bordercolor text-muted text-xs px-2 py-1 rounded cursor-pointer hover:border-emerald-500 hover:text-textcolor transition-all tracking-wider outline-none"
        >
          <option value="en" className="bg-surface text-textcolor">EN</option>
          <option value="fr" className="bg-surface text-textcolor">FR</option>
          <option value="de" className="bg-surface text-textcolor">DE</option>
          <option value="it" className="bg-surface text-textcolor">IT</option>
        </select>
        
        <button 
          onClick={toggleTheme}
          className="bg-transparent border border-bordercolor text-muted text-xs px-3 py-1 rounded hover:border-emerald-500 hover:text-emerald-500 transition-all tracking-wider"
        >
          {theme === "dark" ? "☀ Light" : "☾ Dark"}
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-textcolor p-1"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="absolute top-14 left-0 w-full h-[calc(100vh-56px)] bg-bg/95 backdrop-blur-xl border-b border-bordercolor flex flex-col items-center justify-center gap-6 p-6 md:hidden animate-[fadeIn_0.2s_ease-out]">
          <ul className="flex flex-col items-center gap-6 w-full">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-lg font-medium tracking-widest uppercase transition-colors duration-200 ${
                      isActive ? "text-emerald-500" : "text-muted hover:text-textcolor"
                    }`}
                  >
                    {t(link.label)}
                  </Link>
                </li>
              );
            })}
          </ul>
          
          <div className="flex gap-4 mt-8 pt-8 border-t border-bordercolor w-full justify-center">
            <select 
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-surface border border-bordercolor text-textcolor text-sm px-3 py-2 rounded outline-none"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
              <option value="it">IT</option>
            </select>
            
            <button 
              onClick={toggleTheme}
              className="bg-surface border border-bordercolor text-textcolor text-sm px-4 py-2 rounded"
            >
              {theme === "dark" ? "☀ Light" : "☾ Dark"} Mode
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
