/**
 * update_video_dimensions.js
 *
 * Reads exact dimensions of videos from local filesystem using mdls
 * and updates their existing rows in the Supabase 'media' table.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://dtfichbgbgyferqumunj.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZmljaGJnYmd5ZmVycXVtdW5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY1NTU4OSwiZXhwIjoyMDk2MjMxNTg5fQ.lE0A6cnRjyckiXNvPXKlY5HC1zyaB5gczeH7onwm0Vg";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const VIDEOS_DIR = "/Users/disasgamage/Documents/Toursl /Videos ";

async function run() {
  const { data: videos } = await supabase.from("media").select("id, url").eq("type", "video");
  if (!videos) return console.log("No videos found in DB.");

  let updated = 0;
  for (const video of videos) {
    // Extract filename from the URL, e.g. "1780650993952_2025_12_31_13_21_IMG_1956.mp4"
    const filenameMatch = video.url.match(/_([^/]+\.mp4)$/i);
    if (!filenameMatch) continue;
    
    const originalFilename = filenameMatch[1]; // e.g. "2025_12_31_13_21_IMG_1956.mp4"
    const localPath = path.join(VIDEOS_DIR, originalFilename);

    if (!fs.existsSync(localPath)) {
      console.log(`Skipping (not local): ${originalFilename}`);
      continue;
    }

    try {
      const out = execSync(`mdls -name kMDItemPixelWidth -name kMDItemPixelHeight "${localPath}"`, { encoding: 'utf-8' });
      const wMatch = out.match(/kMDItemPixelWidth\s*=\s*(\d+)/);
      const hMatch = out.match(/kMDItemPixelHeight\s*=\s*(\d+)/);
      
      if (wMatch && hMatch) {
        const width = parseInt(wMatch[1], 10);
        const height = parseInt(hMatch[1], 10);

        await supabase.from("media").update({ width, height }).eq("id", video.id);
        console.log(`✅ Updated ${originalFilename} → ${width}x${height}`);
        updated++;
      }
    } catch (e) {
      console.error(`❌ Failed ${originalFilename}: ${e.message}`);
    }
  }
  console.log(`\n🎉 Done! Updated dimensions for ${updated} videos.`);
}

run();
