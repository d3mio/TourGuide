import { NextRequest, NextResponse } from "next/server";
import translate from "google-translate-api-x";

// Simple in-memory cache for translations to avoid redundant API calls
const translationCache = new Map<string, string>();

// ---------- Rate Limiter (in-memory, per IP) ----------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 20;     // max requests (generous for real usage)
const RATE_LIMIT_WINDOW = 60;  // per 60 seconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW * 1000 });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  // --- Rate limiting ---
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { translatedText: null, fallback: true, error: "Rate limit exceeded." },
      { status: 429 }
    );
  }

  try {
    const { text, to } = await request.json();

    if (!text || !to) {
      return NextResponse.json({ error: "Missing text or to parameter" }, { status: 400 });
    }

    // Enforce max text length to prevent quota abuse
    if (typeof text !== "string" || text.length > 2000) {
      return NextResponse.json(
        { translatedText: null, fallback: true, error: "Text too long for translation." },
        { status: 400 }
      );
    }

    // Validate target language code (basic sanity check)
    if (typeof to !== "string" || !/^[a-z]{2,5}$/.test(to)) {
      return NextResponse.json({ error: "Invalid language code" }, { status: 400 });
    }

    const cacheKey = `${to}:${text}`;
    if (translationCache.has(cacheKey)) {
      return NextResponse.json({ translatedText: translationCache.get(cacheKey) });
    }

    if (process.env.TRANSLATION_QUOTA_EXCEEDED === "true") {
      console.warn("Translation quota exceeded, falling back to english.");
      return NextResponse.json({ translatedText: text });
    }

    const res = await translate(text, { to });
    const translatedText = Array.isArray(res)
      ? res[0]?.text
      : (res as unknown as { text?: string }).text;

    if (translatedText) {
      translationCache.set(cacheKey, translatedText as string);
    }

    return NextResponse.json({ translatedText });
  } catch (error: unknown) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { translatedText: null, fallback: true, error: "Translation failed, falling back to original." },
      { status: 200 }
    );
  }
}
