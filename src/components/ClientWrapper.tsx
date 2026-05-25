"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SplashIntro from "./SplashIntro";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const theme = useAppStore((state) => state.theme);
  const lang = useAppStore((state) => state.lang);
  
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  // Mark mounted and check splash screen
  useEffect(() => {
    setMounted(true);
    setShowSplash(true);
  }, []);

  // Listen for replay requests
  useEffect(() => {
    const handleReplay = () => {
      setShowSplash(true);
    };
    window.addEventListener("replay-splash", handleReplay);
    return () => {
      window.removeEventListener("replay-splash", handleReplay);
    };
  }, []);

  // Lock scroll when splash is active
  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSplash]);

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

  // Apply lang to <html lang=""> attribute for accessibility + SEO
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("lang", lang);
  }, [lang, mounted]);

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
      {showSplash && (
        <SplashIntro
          onComplete={() => {
            setShowSplash(false);
          }}
        />
      )}
      <Navbar />
      <main
        className={`flex-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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


