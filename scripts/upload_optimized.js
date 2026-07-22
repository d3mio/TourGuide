/**
 * upload_optimized.js
 *
 * Uploads the compressed WebP images from ./optimized_media/ to Supabase,
 * then updates the `media` table URLs to point to the new lightweight files.
 *
 * Run AFTER compress_images.js:
 *   node scripts/upload_optimized.js
 *
 * What it does:
 *  1. Reads each WebP from optimized_media/{tourists,visited_places,videos}/
 *  2. Uploads to Supabase bucket  tours_media/images/{category}/
 *  3. Inserts/updates rows in the `media` table with new public URLs
 *  4. Skips files already uploaded (checks by filename)
 */

const fs      = require("fs");
const path    = require("path");
const { execSync } = require("child_process");
const sharp   = require("sharp");
const { createClient } = require("@supabase/supabase-js");

// ── Load .env.local if not already in process.env ───────────────────────
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

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mfqdtxojgutnaciyiigf.supabase.co";
const SERVICE_ROLE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const BUCKET      = "tours_media";
const INPUT_BASE  = path.join(__dirname, "..", "optimized_media");

// Maps local folder name → Supabase storage path prefix & DB category
const FOLDER_MAP = {
  tourists:       { prefix: "images/tourists",       category: "tourists",       type: "image" },
  visited_places: { prefix: "images/visited_places", category: "visited_places", type: "image" },
  videos:         { prefix: "videos",                category: "videos",         type: "video" },
};

const IMAGE_EXTS = /\.(webp|jpg|jpeg|png)$/i;
const VIDEO_EXTS = /\.(mp4|mov)$/i;

function formatBytes(b) {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

async function uploadFile(localPath, storagePath, contentType) {
  const fileBuffer = fs.readFileSync(localPath);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true, // overwrite if exists
    });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

// Extract dimensions (width/height)
async function getDimensions(localPath, isVideo) {
  try {
    if (isVideo) {
      // Use macOS mdls to read video dimensions
      const out = execSync(`mdls -name kMDItemPixelWidth -name kMDItemPixelHeight "${localPath}"`, { encoding: 'utf-8' });
      const wMatch = out.match(/kMDItemPixelWidth\s*=\s*(\d+)/);
      const hMatch = out.match(/kMDItemPixelHeight\s*=\s*(\d+)/);
      if (wMatch && hMatch) return { width: parseInt(wMatch[1], 10), height: parseInt(hMatch[1], 10) };
    } else {
      const meta = await sharp(localPath).metadata();
      if (meta.width && meta.height) return { width: meta.width, height: meta.height };
    }
  } catch (err) {
    console.error(`Warning: could not read dimensions for ${localPath}: ${err.message}`);
  }
  return { width: null, height: null };
}

async function run() {
  let uploaded = 0, skipped = 0, errors = 0;

  // Fetch existing DB URLs to avoid duplicate inserts
  const { data: existing } = await supabase.from("media").select("url");
  const existingUrls = new Set((existing || []).map((r) => r.url));

  for (const [folderName, config] of Object.entries(FOLDER_MAP)) {
    const srcDir = path.join(INPUT_BASE, folderName);
    if (!fs.existsSync(srcDir)) {
      console.warn(`⚠  Folder not found, skipping: ${srcDir}`);
      continue;
    }

    const files = fs.readdirSync(srcDir).filter((f) =>
      IMAGE_EXTS.test(f) || VIDEO_EXTS.test(f)
    );

    console.log(`\n📁  ${folderName}  (${files.length} files)`);

    for (const file of files) {
      const localPath   = path.join(srcDir, file);
      const storagePath = `${config.prefix}/${Date.now()}_${file}`;
      const isVideo     = VIDEO_EXTS.test(file);
      const contentType = isVideo ? "video/mp4" : "image/webp";
      const size        = fs.statSync(localPath).size;

      try {
        const publicUrl = await uploadFile(localPath, storagePath, contentType);

        // Skip DB insert if URL already tracked
        if (existingUrls.has(publicUrl)) {
          console.log(`  ⏭  Already in DB: ${file}`);
          skipped++;
          continue;
        }

        // Get actual dimensions
        const { width, height } = await getDimensions(localPath, isVideo);

        // Insert into media table
        const { error: dbErr } = await supabase.from("media").insert({
          name:     path.parse(file).name,
          url:      publicUrl,
          type:     config.type,
          category: config.category,
          width:    width,
          height:   height,
        });

        if (dbErr) throw new Error(dbErr.message);

        console.log(`  ✅  ${file.padEnd(45)} ${formatBytes(size)} (${width}x${height})`);
        uploaded++;
      } catch (err) {
        console.error(`  ❌  ${file}: ${err.message}`);
        errors++;
      }
    }
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Upload complete!
   Uploaded  : ${uploaded}
   Skipped   : ${skipped}
   Errors    : ${errors}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

run().catch(console.error);
