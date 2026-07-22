export const dynamic = "force-dynamic";

import { createClient } from "@supabase/supabase-js";
import ExperiencesClient from "./ExperiencesClient";

const FALLBACK_MEDIA = [
  { id: "f1", url: "/assets/places/Galle_Fort.webp", type: "image" as const, category: "visited_places", width: 2560, height: 1440 },
  { id: "f2", url: "/assets/places/Adams_Peak.webp", type: "image" as const, category: "tourists", width: 976, height: 651 },
  { id: "f3", url: "/assets/places/Sigiriya.jpg", type: "image" as const, category: "visited_places", width: 800, height: 520 },
  { id: "f4", url: "/assets/places/Ella.jpg", type: "image" as const, category: "tourists", width: 1528, height: 641 },
  { id: "f5", url: "/assets/places/ceylon_tea.jpg", type: "image" as const, category: "visited_places", width: 1920, height: 1280 },
  { id: "f6", url: "/assets/places/kandiyan_dance.jpg", type: "image" as const, category: "visited_places", width: 1920, height: 1280 },
  { id: "f7", url: "/assets/places/Anuradhapura.jpg", type: "image" as const, category: "visited_places", width: 1920, height: 1080 },
  { id: "f8", url: "/assets/places/Mirissa.jpg", type: "image" as const, category: "tourists", width: 1086, height: 724 },
  { id: "f9", url: "/assets/places/Nuwara_Eliya.jpg", type: "image" as const, category: "visited_places", width: 1920, height: 1080 },
  { id: "f10", url: "/assets/places/Arugam_Bay.jpg", type: "image" as const, category: "tourists", width: 800, height: 520 },
  { id: "f11", url: "/assets/places/Polonnaruwa.jpg", type: "image" as const, category: "visited_places", width: 1200, height: 700 },
  { id: "f12", url: "/assets/places/kandy.jpg", type: "image" as const, category: "visited_places", width: 1920, height: 1280 },
  { id: "f13", url: "/assets/places/Wilpattu.jpg", type: "image" as const, category: "visited_places", width: 669, height: 446 },
  { id: "f14", url: "/assets/places/Colombo.jpg", type: "image" as const, category: "tourists", width: 669, height: 446 },
  { id: "f15", url: "/assets/places/Trincomalee.jpg", type: "image" as const, category: "visited_places", width: 1600, height: 1320 },
  { id: "f16", url: "/assets/places/Bentota.jpg", type: "image" as const, category: "tourists", width: 600, height: 400 },
];

// Server-side data fetching — runs at request time, no client spinner
async function getMedia() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mfqdtxojgutnaciyiigf.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_rAo_T0NFN9ztkJL2n1TRrA_qRW8PDGy";

  try {
    // Disable Next.js Data Cache to ensure fresh database queries on every request
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }),
      },
    });

    const { data, error } = await supabase
      .from("media")
      .select("id, url, type, category, width, height")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn("Supabase returned empty media or error, using local fallback assets.", error);
      return FALLBACK_MEDIA;
    }

    const images = data.filter((i) => i.type === "image");
    const videos = data.filter((i) => i.type === "video");

    // Interleave: 2 images then 1 video
    const interleaved: typeof data = [];
    let vi = 0,
      ii = 0;
    while (ii < images.length || vi < videos.length) {
      for (let x = 0; x < 2 && ii < images.length; x++) interleaved.push(images[ii++]);
      if (vi < videos.length) interleaved.push(videos[vi++]);
    }

    return interleaved.map((item) => ({
      id: item.id,
      url: item.url,
      type: item.type as "image" | "video",
      category: item.category,
      width: item.width,
      height: item.height,
    }));
  } catch (err) {
    console.error("Failed to fetch media from Supabase:", err);
    return FALLBACK_MEDIA;
  }
}

export default async function ExperiencesPage() {
  const mediaItems = await getMedia();
  return <ExperiencesClient initialMedia={mediaItems} />;
}
