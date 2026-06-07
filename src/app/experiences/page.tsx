export const dynamic = "force-dynamic";

import { createClient } from "@supabase/supabase-js";
import ExperiencesClient from "./ExperiencesClient";

// Server-side data fetching — runs at request time, no client spinner
async function getMedia() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase environment variables are missing. Returning empty media.");
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

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
