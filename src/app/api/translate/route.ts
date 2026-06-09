import { NextResponse } from "next/server";
import translate from "google-translate-api-x";

// Simple in-memory cache for translations to avoid redundant API calls
const translationCache = new Map<string, string>();

export async function POST(request: Request) {
  try {
    const { text, to } = await request.json();
    
    if (!text || !to) {
      return NextResponse.json({ error: "Missing text or to parameter" }, { status: 400 });
    }

    const cacheKey = `${to}:${text}`;
    if (translationCache.has(cacheKey)) {
      return NextResponse.json({ translatedText: translationCache.get(cacheKey) });
    }

    // Try to use API key if provided, else fallback to scraping (google-translate-api-x default behavior)
    // Note: If you want to strictly use an official key, you can integrate @google-cloud/translate here.
    // google-translate-api-x is resilient and works without keys but might hit quotas.
    
    // Simulating quota check/error handling
    if (process.env.TRANSLATION_QUOTA_EXCEEDED === "true") {
       console.warn("Translation quota exceeded, falling back to english.");
       return NextResponse.json({ translatedText: text }); // Fallback to original
    }

    const res = await translate(text, { to });
    const translatedText = Array.isArray(res) 
      ? res[0]?.text 
      : (res as any).text;

    // Cache successful translation
    if (translatedText) {
      translationCache.set(cacheKey, translatedText);
    }

    return NextResponse.json({ translatedText });
  } catch (error: any) {
    console.error("Translation API error:", error);
    // Graceful fallback to the original string instead of breaking the app
    // Extracting the text from the request is a bit tricky if the body stream is consumed, 
    // but the client handles fallback internally as well. Let's return a specific status to indicate fallback.
    return NextResponse.json(
      { translatedText: null, fallback: true, error: "Translation failed, falling back to original." }, 
      { status: 200 } // Send 200 so the client doesn't throw, but handles the empty translatedText
    );
  }
}

