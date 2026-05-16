"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation, useAppStore } from "@/store";

export default function Navbar() {
  const pathname = usePathname();
  const { t, lang } = useTranslation();
  const { setLang, toggleTheme, theme } = useAppStore();

  const links = [
    { href: "/", label: "nav_home" },
    { href: "/explore", label: "nav_explore" },
    { href: "/planner", label: "nav_planner" },
    { href: "/culture", label: "nav_culture" },
    { href: "/experiences", label: "nav_exp" },
    { href: "/profile", label: "nav_profile" },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center h-14 px-8 bg-bg/80 backdrop-blur-md border-b border-bordercolor transition-colors duration-400">
      <div className="mr-12 whitespace-nowrap">
        <Link href="/" className="font-serif text-[1.35rem] font-medium tracking-wide text-textcolor transition-colors">
          Ceylon <span className="text-emerald-500">&amp;</span> Co.
        </Link>
      </div>
      
      <ul className="flex flex-1 gap-0 list-none">
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
      
      <div className="flex items-center gap-4 ml-auto">
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
    </nav>
  );
}
