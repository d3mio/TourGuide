/**
 * compress_images.js
 *
 * Bulk converts all JPG/PNG images from the source Toursl folder into
 * optimized WebP files (75% quality, max 1400px wide).
 *
 * Run: node scripts/compress_images.js
 *
 * Output: ./optimized_media/
 *   ├── tourists/   (from Backs )
 *   ├── visited_places/ (from tours )
 *   └── videos/     (mp4 files — copied unchanged; video needs ffmpeg)
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// ── Config ──────────────────────────────────────────────────────
const SOURCE_BASE = "/Users/disasgamage/Documents/Toursl ";
const OUTPUT_BASE = path.join(__dirname, "..", "optimized_media");

const FOLDERS = [
  { src: "Backs ",      dest: "tourists",       type: "image" },
  { src: "tours ",      dest: "visited_places", type: "image" },
  { src: "Videos ",     dest: "videos",         type: "video" },
];

const IMAGE_EXTS  = /\.(jpg|jpeg|png|heic|heif|tiff|bmp)$/i;
const VIDEO_EXTS  = /\.(mp4|mov|avi|mkv)$/i;

const WEBP_QUALITY  = 75;   // 0-100. 75 = great quality, ~80% smaller
const MAX_WIDTH     = 1400; // pixels. Enough for fullscreen on retina

// ── Helpers ──────────────────────────────────────────────────────
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function formatBytes(bytes) {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// ── Main ──────────────────────────────────────────────────────────
async function run() {
  ensureDir(OUTPUT_BASE);

  let totalIn = 0, totalOut = 0, converted = 0, skipped = 0, errors = 0;

  for (const folder of FOLDERS) {
    const srcDir  = path.join(SOURCE_BASE, folder.src);
    const destDir = path.join(OUTPUT_BASE, folder.dest);
    ensureDir(destDir);

    if (!fs.existsSync(srcDir)) {
      console.warn(`⚠  Source folder not found: ${srcDir}`);
      continue;
    }

    const files = fs.readdirSync(srcDir);
    console.log(`\n📁  ${folder.src.trim()} → ${folder.dest}  (${files.length} files)`);

    for (const file of files) {
      const srcFile  = path.join(srcDir, file);
      const stat     = fs.statSync(srcFile);
      if (!stat.isFile()) continue;

      // ── Images: convert to WebP ──────────────────────────────
      if (IMAGE_EXTS.test(file)) {
        const baseName  = path.parse(file).name;
        const destFile  = path.join(destDir, `${baseName}.webp`);

        // Skip if already done
        if (fs.existsSync(destFile)) {
          console.log(`  ⏭  Skip (exists): ${file}`);
          skipped++;
          continue;
        }

        const sizeIn = stat.size;
        totalIn += sizeIn;

        try {
          await sharp(srcFile)
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality: WEBP_QUALITY, effort: 4 })
            .toFile(destFile);

          const sizeOut = fs.statSync(destFile).size;
          totalOut += sizeOut;
          const saving = ((1 - sizeOut / sizeIn) * 100).toFixed(0);
          console.log(`  ✅  ${file.padEnd(40)} ${formatBytes(sizeIn)} → ${formatBytes(sizeOut)}  (−${saving}%)`);
          converted++;
        } catch (err) {
          console.error(`  ❌  ${file}: ${err.message}`);
          errors++;
        }
      }

      // ── Videos: copy as-is (use ffmpeg separately for compression) ──
      else if (VIDEO_EXTS.test(file)) {
        const destFile = path.join(destDir, file);
        if (fs.existsSync(destFile)) {
          console.log(`  ⏭  Skip (exists): ${file}`);
          skipped++;
          continue;
        }
        fs.copyFileSync(srcFile, destFile);
        const sizeIn = stat.size;
        totalIn  += sizeIn;
        totalOut += sizeIn; // same size for now
        console.log(`  📹  Copied: ${file}  (${formatBytes(sizeIn)})`);
        converted++;
      }
    }
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Done!
   Converted : ${converted}
   Skipped   : ${skipped}
   Errors    : ${errors}
   Input     : ${formatBytes(totalIn)}
   Output    : ${formatBytes(totalOut)}
   Saved     : ${formatBytes(Math.max(0, totalIn - totalOut))}  (${totalIn > 0 ? ((1 - totalOut / totalIn) * 100).toFixed(1) : 0}%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Output folder: ${OUTPUT_BASE}
Next step: run  node scripts/upload_optimized.js
`);
}

run().catch(console.error);
