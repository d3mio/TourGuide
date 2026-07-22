/**
 * seed_media_from_local.js
 * Reads local images from public/assets/places and public/places,
 * uploads them to the new Supabase tours_media bucket,
 * and populates the `media` table.
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { createClient } = require("@supabase/supabase-js");

// Load .env.local
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    const envPath = path.join(__dirname, "..", ".env.local");
    if (fs.existsSync(envPath)) {
      const envLines = fs.readFileSync(envPath, "utf-8").split("\n");
      for (const line of envLines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx > 0) {
            const k = trimmed.substring(0, eqIdx).trim();
            const v = trimmed.substring(eqIdx + 1).trim();
            process.env[k] = v;
          }
        }
      }
    }
  } catch (e) {
    console.error("Failed reading .env.local", e.message);
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mfqdtxojgutnaciyiigf.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const BUCKET = "tours_media";

const LOCAL_FOLDERS = [
  {
    dir: path.join(__dirname, "..", "public", "assets", "places"),
    prefix: "images/visited_places",
    category: "visited_places",
  },
  {
    dir: path.join(__dirname, "..", "public", "places"),
    prefix: "images/tourists",
    category: "tourists",
  },
];

const IMAGE_EXTS = /\.(webp|jpg|jpeg|png)$/i;

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".webp") return "image/webp";
  if (ext === ".png") return "image/png";
  return "image/jpeg";
}

async function run() {
  console.log("🚀 Starting media upload and database seeding...");

  // Ensure storage bucket exists
  await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => {});

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  // Fetch existing URLs to prevent duplicate entries
  const { data: existing } = await supabase.from("media").select("url");
  const existingUrls = new Set((existing || []).map((r) => r.url));

  for (const folderConfig of LOCAL_FOLDERS) {
    if (!fs.existsSync(folderConfig.dir)) {
      console.warn(`Folder not found, skipping: ${folderConfig.dir}`);
      continue;
    }

    const files = fs.readdirSync(folderConfig.dir).filter((f) => IMAGE_EXTS.test(f));
    console.log(`\n📁 Processing ${files.length} images from ${folderConfig.category}...`);

    for (const file of files) {
      const localPath = path.join(folderConfig.dir, file);
      const cleanFileName = file.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${folderConfig.prefix}/${cleanFileName}`;
      const contentType = getContentType(file);

      try {
        const fileBuffer = fs.readFileSync(localPath);

        // 1. Upload to Supabase Storage
        const { error: uploadErr } = await supabase.storage
          .from(BUCKET)
          .upload(storagePath, fileBuffer, {
            contentType,
            upsert: true,
          });

        if (uploadErr) {
          throw new Error(`Storage upload error: ${uploadErr.message}`);
        }

        // 2. Get Public URL
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
        const publicUrl = urlData.publicUrl;

        if (existingUrls.has(publicUrl)) {
          console.log(`  ⏭  Already in DB: ${file}`);
          skippedCount++;
          continue;
        }

        // 3. Extract metadata with sharp
        const meta = await sharp(localPath).metadata().catch(() => ({ width: 1200, height: 800 }));

        // 4. Insert row into `media` table
        const { error: dbErr } = await supabase.from("media").insert({
          name: path.parse(file).name,
          url: publicUrl,
          type: "image",
          category: folderConfig.category,
          width: meta.width || 1200,
          height: meta.height || 800,
        });

        if (dbErr) {
          throw new Error(`DB insert error: ${dbErr.message}`);
        }

        existingUrls.add(publicUrl);
        console.log(`  ✅ Uploaded & Inserted: ${file} (${meta.width}x${meta.height})`);
        uploadedCount++;
      } catch (err) {
        console.error(`  ❌ Error processing ${file}: ${err.message}`);
        errorCount++;
      }
    }
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Media Seeding Complete!
   Uploaded & Inserted : ${uploadedCount}
   Skipped (Duplicates): ${skippedCount}
   Errors              : ${errorCount}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

run().catch(console.error);
