"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslation } from "@/store";
import { Volume2, VolumeX, SkipForward } from "lucide-react";

interface SplashIntroProps {
  onComplete: () => void;
}

export default function SplashIntro({ onComplete }: SplashIntroProps) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle enter action
  const handleEnter = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 850); // Match CSS fade animation duration
  };

  // Animate loading progress
  useEffect(() => {
    const duration = 2800; // 2.8 seconds
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(100, Math.floor((currentStep / steps) * 100));
      setProgress(nextProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setLoadingComplete(true);
        // Automatically reveal site 500ms after reaching 100%
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 850);
        }, 500);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#09090b] transition-all duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isFadingOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Cinematic Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onCanPlayThrough={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? "opacity-35 scale-100" : "opacity-0 scale-105"
          }`}
          src="https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4"
        />
        {/* Dark, premium vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-[#09090b]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#09090b_85%)]" />
      </div>

      {/* Top Bar Controls */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
        {/* Branding Indicator */}
        <div className="flex items-center gap-2 opacity-50">
          <span className="text-[0.6rem] tracking-[0.3em] uppercase text-emerald-400 font-bold">EST. 2026</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {videoLoaded && (
            <button
              onClick={toggleMute}
              className="p-2 rounded-full border border-white/10 hover:border-emerald-500/50 bg-black/40 hover:bg-black/60 text-white/70 hover:text-emerald-400 transition-all cursor-pointer backdrop-blur-md"
              title={isMuted ? "Unmute Ambient Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            onClick={handleEnter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-emerald-500/50 bg-black/40 hover:bg-black/60 text-white/70 hover:text-emerald-400 text-[0.65rem] tracking-wider uppercase font-bold transition-all cursor-pointer backdrop-blur-md"
          >
            <span>{t("skip_intro") || "Skip"}</span>
            <SkipForward className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Center Cinematic Content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl px-6 text-center">
        {/* Animated Brand Emblem */}
        <div className="mb-8 relative flex items-center justify-center">
          {/* Pulsing Backing Glow */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 filter blur-xl scale-125 animate-pulse" />
          
          <svg
            className="w-20 h-20 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dashed outer circular track */}
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="url(#splashLogoGrad)"
              strokeWidth="2.5"
              strokeDasharray="6 3"
              className="origin-center animate-[spin_40s_linear_infinite]"
              style={{ opacity: 0.3 }}
            />
            {/* Solid animated circle tracing */}
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="url(#splashLogoGrad)"
              strokeWidth="2.5"
              strokeDasharray="264"
              strokeDashoffset={264 - (264 * progress) / 100}
              className="origin-center -rotate-90 transition-all duration-300 ease-out"
              style={{ opacity: 0.8 }}
            />
            {/* The Ceylon teardrop emblem */}
            <path
              d="M50 15 C60 31, 74 44, 50 78 C26 44, 40 31, 50 15 Z"
              fill="url(#splashLogoGrad)"
              className={`transition-all duration-1000 ease-out ${
                progress > 30 ? "opacity-95 scale-100" : "opacity-0 scale-75"
              } origin-center`}
            />
            {/* Wave overlay */}
            <path
              d="M32 56 C43 52, 57 60, 68 56"
              stroke="#f59e0b"
              strokeWidth="3.5"
              strokeLinecap="round"
              className={`transition-all duration-1000 delay-300 ease-out ${
                progress > 60 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            />
            <defs>
              <linearGradient id="splashLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Staggered text fade in */}
        <div className="flex flex-col items-center">
          <span className="text-[0.62rem] tracking-[0.4em] uppercase font-bold text-emerald-400 mb-3 animate-[fadeIn_1s_ease-out_both] delay-200">
            {t("welcome_to_sl") || "Welcome to Sri Lanka"}
          </span>
          
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mb-4 leading-tight animate-[fadeIn_1.2s_ease-out_both] delay-500">
            Sri Lankan <span className="font-bold">Serendib Tours</span>
          </h1>

          <p className="text-zinc-400 font-serif italic text-sm md:text-base leading-relaxed max-w-[480px] mb-12 opacity-80 animate-[fadeIn_1.4s_ease-out_both] delay-700">
            {t("hero_sub") || "An uncharted editorial journey through heritage citadels, emerald highlands, and shores that redefine the horizon."}
          </p>
        </div>

        {/* Loading Counter */}
        <div className="w-[200px] flex flex-col items-center gap-3">
          {/* Progress Track */}
          <div className="w-full h-[1px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Loading percentage / Ready state */}
          <span className="text-[0.65rem] tracking-[0.2em] font-mono text-zinc-500">
            {progress === 100 ? "READY" : `${progress}%`}
          </span>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="absolute bottom-6 z-10 flex flex-col items-center gap-1 opacity-45 text-[0.58rem] tracking-[0.15em] uppercase text-zinc-500">
        <span>Ceylon Travel Naturalists</span>
      </div>
    </div>
  );
}
