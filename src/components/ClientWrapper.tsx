"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppStore, useTranslation } from "@/store";
import { supabase } from "@/lib/supabase";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const theme = useAppStore((state) => state.theme);
  const lang = useAppStore((state) => state.lang);
  const { t } = useTranslation();
  
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  // Sync Supabase Auth State
  useEffect(() => {
    const setUser = useAppStore.getState().setUser;
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Mark mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Smooth route page transitions
  useEffect(() => {
    if (!mounted) {
      setDisplayChildren(children);
      return;
    }

    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 280); // Premium slide & fade transition duration

    return () => clearTimeout(timer);
  }, [pathname, children, mounted]);

  // Smooth language change transitions (hides instant text replacements behind a cross-fade)
  useEffect(() => {
    if (!mounted) return;
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [lang, mounted]);

  // Apply theme to <html> data-theme attribute
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);

    // Update browser theme-color meta tag
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = theme === "dark" ? "#09090b" : "#f5f5f7";
  }, [theme, mounted]);

  // Apply lang, page title, and meta description for accessibility + SEO
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("lang", lang);
    document.title = t("meta_title");

    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = t("meta_description");
  }, [lang, mounted, t]);

  // Prevent showing wrong theme flash before mount
  if (!mounted) {
    return (
      <div style={{ visibility: "hidden", pointerEvents: "none" }}>
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-bg text-textcolor transition-colors duration-300">
      <Navbar />
      <main
        className={`flex-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          pathname !== '/' ? 'pt-16' : ''
        } ${
          isTransitioning
            ? "opacity-0 translate-y-3 filter blur-[5px]"
            : "opacity-100 translate-y-0 filter blur-0"
        }`}
      >
        {displayChildren}
      </main>
      <Footer />
    </div>
  );
}


