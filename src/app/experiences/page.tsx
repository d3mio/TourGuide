"use server";

import { createClient } from "@supabase/supabase-js";
import ExperiencesClient from "./ExperiencesClient";

// Server-side data fetching — runs at request time, no client spinner
async function getMedia() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("media")
    .select("id, url, type, category, width, height")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

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
}

export default async function ExperiencesPage() {
  const mediaItems = await getMedia();
  return <ExperiencesClient initialMedia={mediaItems} />;
}
