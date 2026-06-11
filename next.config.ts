import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking — disallow iframing this site
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Prevent MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Strict referrer policy — don't leak full URL in Referer header
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Disable unused browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // DNS prefetch control
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // Content-Security-Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + Google (for OAuth redirect)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
      // Styles: self + inline (needed for Tailwind/CSS-in-JS) + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images: self + Supabase storage + data URIs
      "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
      // Fonts: self + Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // API connections: self + Supabase + Google OAuth + translate API
      "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://accounts.google.com https://translation.googleapis.com",
      // Media (video/audio): Supabase storage only
      "media-src 'self' https://*.supabase.co https://*.supabase.in",
      // Frames: only Google OAuth
      "frame-src https://accounts.google.com",
      // Form submissions to self only
      "form-action 'self'",
      // Base URI to self only
      "base-uri 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      // Supabase Storage (for user avatars and any uploaded images)
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
      },
      // Google user avatars (from Google OAuth)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // GitHub avatars (if GitHub auth is added later)
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
