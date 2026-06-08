"use client";

import { useEffect, useState, useCallback } from "react";
import { SkipForward } from "lucide-react";
import { useTranslation, hasPendingTranslations } from "@/store";

interface SplashIntroProps {
  onComplete: () => void;
}

export default function SplashIntro({ onComplete }: SplashIntroProps) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "exit">("loading");
  const [showContent, setShowContent] = useState(false);

  const handleExit = useCallback(() => {
    if (phase === "exit") return;
    setPhase("exit");
    setTimeout(() => onComplete(), 900);
  }, [phase, onComplete]);

  // Loading progress
  useEffect(() => {
    let loaded = false;
    let fallbackTimer: NodeJS.Timeout;

    const markLoaded = () => { loaded = true; };

    if (typeof window !== "undefined") {
      if (document.readyState === "complete") {
        loaded = true;
      } else {
        window.addEventListener("load", markLoaded);
        fallbackTimer = setTimeout(markLoaded, 6000);
      }
    } else {
      loaded = true;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (loaded) {
          if (hasPendingTranslations() && prev >= 95) return 95;
          if (prev >= 100) {
            clearInterval(timer);
            setPhase("reveal");
            setTimeout(() => handleExit(), 1200);
            return 100;
          }
          return prev + 4;
        } else {
          if (prev >= 90) return 90;
          return prev + 2;
        }
      });
    }, 40);

    // Stagger content entrance
    setTimeout(() => setShowContent(true), 150);

    return () => {
      clearInterval(timer);
      if (typeof window !== "undefined") window.removeEventListener("load", markLoaded);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [handleExit]);

  // Derive visual states
  const isRevealed = phase === "reveal" || phase === "exit";
  const isExiting = phase === "exit";

  return (
    <div
      className={`splash-root ${isExiting ? "splash-exit" : ""}`}
      style={{ "--progress": `${progress}%` } as React.CSSProperties}
    >
      {/* Ambient background effects */}
      <div className="splash-ambient">
        <div className="splash-orb splash-orb-1" />
        <div className="splash-orb splash-orb-2" />
        <div className="splash-orb splash-orb-3" />
      </div>

      {/* Grain texture overlay */}
      <div className="splash-grain" />

      {/* Horizontal scan line */}
      <div className="splash-scanline" />

      {/* Skip button */}
      <button onClick={handleExit} className="splash-skip" aria-label="Skip intro">
        <span>{t("skip_intro") || "Skip"}</span>
        <SkipForward className="w-3 h-3" />
      </button>

      {/* Center content */}
      <div className={`splash-center ${showContent ? "splash-visible" : ""}`}>
        
        {/* Geometric emblem */}
        <div className="splash-emblem">
          <svg viewBox="0 0 120 120" fill="none" className="splash-emblem-svg">
            {/* Outer rotating ring */}
            <circle
              cx="60" cy="60" r="55"
              stroke="url(#emblemGrad)"
              strokeWidth="0.5"
              strokeDasharray="4 8"
              className="splash-ring-outer"
              opacity="0.3"
            />
            {/* Middle progress ring */}
            <circle
              cx="60" cy="60" r="46"
              stroke="url(#emblemGrad)"
              strokeWidth="1.5"
              strokeDasharray="289"
              strokeDashoffset={289 - (289 * progress) / 100}
              strokeLinecap="round"
              className="splash-ring-progress"
            />
            {/* Inner accent ring */}
            <circle
              cx="60" cy="60" r="37"
              stroke="var(--accent)"
              strokeWidth="0.3"
              opacity="0.15"
            />
            {/* Ceylon teardrop — the heart of the emblem */}
            <path
              d="M60 28 C68 40, 78 50, 60 74 C42 50, 52 40, 60 28 Z"
              fill="url(#emblemGrad)"
              className={`splash-teardrop ${progress > 25 ? "splash-teardrop-visible" : ""}`}
            />
            {/* Horizontal accent line */}
            <line
              x1="42" y1="58" x2="78" y2="58"
              stroke="var(--amber)"
              strokeWidth="1.5"
              strokeLinecap="round"
              className={`splash-accent-line ${progress > 55 ? "splash-accent-visible" : ""}`}
            />
            <defs>
              <linearGradient id="emblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>

          {/* Glow behind emblem */}
          <div className="splash-emblem-glow" />
        </div>

        {/* Brand text */}
        <div className="splash-brand">
          <div className="splash-brand-line splash-stagger-1">
            <span className="splash-eyebrow">{t("welcome_to_sl") || "Welcome to Sri Lanka"}</span>
          </div>
          <div className="splash-brand-line splash-stagger-2">
            <h1 className="splash-title">
              Ceylon<span className="splash-title-bold"> Luxe</span>
            </h1>
          </div>
        </div>

        {/* Minimal progress indicator */}
        <div className="splash-progress-wrap splash-stagger-3">
          <div className="splash-progress-track">
            <div className="splash-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="splash-progress-meta">
            <span className="splash-progress-label">
              {isRevealed ? "✦" : t("splash_loading") || "Loading"}
            </span>
            <span className={`splash-progress-pct ${isRevealed ? "splash-pct-done" : ""}`}>
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Corner coordinates — editorial detail */}
      <div className="splash-coord splash-coord-bl">
        <span>6.9271° N</span>
        <span>79.8612° E</span>
      </div>

      <div className="splash-coord splash-coord-br">
        <span>Ceylon</span>
      </div>
    </div>
  );
}
