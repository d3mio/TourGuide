export const BUCKET_BASE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1`;

interface OptimizeImageOptions {
  width?: number;
  quality?: number;
  format?: 'webp' | 'png' | 'jpeg';
}

/**
 * Generates an optimized Supabase CDN image URL.
 * Falls back to raw public URL if optimization parameters are not supported (e.g., on free tier limits).
 */
export function getOptimizedImage(filePath: string, options: OptimizeImageOptions = {}) {
  const { width = 800, quality = 75, format = 'webp' } = options;
  
  // filePath should look like "provinces/sigiriya.jpg"
  const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  
  // Use the /render endpoint for dynamic on-the-fly compression
  return `${BUCKET_BASE_URL}/render/image/public/tour-media/${cleanPath}?width=${width}&quality=${quality}&format=${format}`;
}

/**
 * Returns raw public URL (best for large videos or non-translatable assets).
 */
export function getRawAsset(filePath: string) {
  const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  return `${BUCKET_BASE_URL}/object/public/tour-media/${cleanPath}`;
}
