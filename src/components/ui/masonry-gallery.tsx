"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronDown, Images } from "lucide-react";

/* ── Seek video to first frame so it never shows black ── */
function useVideoFirstFrame(ref: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const vid = ref.current;
    if (!vid) return;
    const onMeta = () => {
      // Seek to just past frame 0 to paint a visible first frame
      vid.currentTime = 0.001;
    };
    vid.addEventListener("loadedmetadata", onMeta);
    // If metadata already loaded
    if (vid.readyState >= 1) onMeta();
    return () => vid.removeEventListener("loadedmetadata", onMeta);
  }, [ref]);
}

export type MediaItem = {
  id: string;
  url: string;
  type: "image" | "video";
  category: string;
  width?: number | null;
  height?: number | null;
};

// ── Smart default aspect ratios by category ──────────────
// iPhone tourist photos = mostly portrait (3:4)
// Place/landscape photos = landscape (4:3)
// Videos = 16:9 wide
// No preloading needed — we assign instantly from category
const CATEGORY_ASPECT: Record<string, string> = {
  tourists:       "133.33%", // 3:4  portrait
  visited_places: "75%",     // 4:3  landscape
  videos:         "56.25%",  // 16:9 wide
};
const DEFAULT_ASPECT = "75%"; // 4:3 fallback

const PAGE_SIZE = 8;



/* ── Individual media card ─────────────────────────────── */
function MediaCard({
  item,
  onClick,
  index,
  priority,
}: {
  item: MediaItem;
  onClick: () => void;
  index: number;
  priority: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const isVideo  = item.type === "video";
  
  // Calculate exact aspect ratio if dimensions exist, otherwise fallback
  let pad = DEFAULT_ASPECT;
  if (item.width && item.height) {
    pad = `${(item.height / item.width) * 100}%`;
  } else if (CATEGORY_ASPECT[item.category]) {
    pad = CATEGORY_ASPECT[item.category];
  }

  // Seek video to first frame so it never shows as a black box
  useVideoFirstFrame(videoRef);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="relative w-full overflow-hidden rounded-xl cursor-pointer group shadow-md hover:shadow-2xl transition-shadow duration-300"
      style={{ paddingBottom: pad }}
    >
      {/* Shimmer shown while media is painting */}
      {!imgLoaded && !isVideo && (
        <div className="absolute inset-0 bg-surface animate-pulse rounded-xl" />
      )}

      <div className="absolute inset-0">
        {isVideo ? (
          <video
            ref={videoRef}
            src={item.url}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onMouseEnter={() => videoRef.current?.play()}
            onMouseLeave={() => {
              videoRef.current?.pause();
              if (videoRef.current) videoRef.current.currentTime = 0.001;
            }}
          />
        ) : (
          <img
            src={item.url}
            alt={item.category}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Video badge */}
        {isVideo && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-sm">
            <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
          </div>
        )}

        {/* Category label */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <span className="text-[0.58rem] font-bold uppercase tracking-widest text-white/80 bg-black/45 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
            {item.category.replace(/_/g, " ")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Lightbox ──────────────────────────────────────────── */
function Lightbox({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="lb-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-[500] bg-black/93 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center"
        >
          {item.type === "video" ? (
            <video
              src={item.url}
              autoPlay
              loop
              playsInline
              controls
              className="rounded-2xl shadow-2xl max-h-[85vh] w-full object-contain"
            />
          ) : (
            <img
              src={item.url}
              alt={item.category}
              loading="eager"
              className="rounded-2xl shadow-2xl max-h-[85vh] w-full object-contain"
            />
          )}

          <button
            onClick={onClose}
            className="absolute -top-5 -right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer backdrop-blur-sm hover:scale-110"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute -bottom-8 left-0 right-0 text-center">
            <span className="text-[0.65rem] text-white/40 uppercase tracking-widest">
              {item.category.replace(/_/g, " ")} · {item.type}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Main Gallery ──────────────────────────────────────── */
export default function MasonryGallery({ items }: { items: MediaItem[] }) {
  const [visible, setVisible]     = useState(PAGE_SIZE);
  const [btnLoading, setBtnLoading] = useState(false);
  const [lightbox, setLightbox]   = useState<MediaItem | null>(null);

  const handleLoadMore = useCallback(() => {
    setBtnLoading(true);
    // Small RAF delay so button state updates before paint
    requestAnimationFrame(() => {
      setTimeout(() => {
        setVisible((v) => Math.min(v + PAGE_SIZE, items.length));
        setBtnLoading(false);
      }, 200);
    });
  }, [items.length]);

  const visibleItems = items.slice(0, visible);
  const hasMore      = visible < items.length;

  // Skeleton grid shown while data is loading (server render provides data instantly, but keep as safety net)
  if (!items.length) {
    return (
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
        {[133, 75, 56, 133, 75, 133, 56, 75].map((pad, i) => (
          <div key={i} className="mb-3 break-inside-avoid">
            <div
              className="w-full rounded-xl bg-surface animate-pulse"
              style={{ paddingBottom: `${pad}%` }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* CSS columns masonry — instant render, images load as browser fetches */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
        {visibleItems.map((item, i) => (
          <div key={item.id} className="mb-3 break-inside-avoid">
            <MediaCard
              item={item}
              onClick={() => setLightbox(item)}
              index={i}
              priority={i < PAGE_SIZE} // first page gets eager loading
            />
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <p className="text-xs text-muted">
            Showing{" "}
            <span className="text-textcolor font-semibold">{visibleItems.length}</span>{" "}
            of{" "}
            <span className="text-textcolor font-semibold">{items.length}</span>{" "}
            moments
          </p>
          <button
            onClick={handleLoadMore}
            disabled={btnLoading}
            className="group inline-flex items-center gap-2.5 px-8 py-3 rounded-full border border-bordercolor bg-surface hover:border-accent hover:bg-accent/5 text-textcolor text-sm font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-accent/10 disabled:opacity-60"
          >
            {btnLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                Loading…
              </>
            ) : (
              <>
                <Images className="w-4 h-4 text-accent" />
                See More
                <ChevronDown className="w-4 h-4 text-muted group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* All done */}
      {!hasMore && items.length > PAGE_SIZE && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10 text-center"
        >
          <span className="text-xs text-muted/50 tracking-widest uppercase">
            All {items.length} moments loaded ✦
          </span>
        </motion.div>
      )}

      {/* Lightbox */}
      {lightbox && <Lightbox item={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}
