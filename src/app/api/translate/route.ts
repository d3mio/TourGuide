import { NextResponse } from "next/server";
import translate from "google-translate-api-x";

export async function POST(request: Request) {
  try {
    const { text, to } = await request.json();
    if (!text || !to) {
      return NextResponse.json({ error: "Missing text or to parameter" }, { status: 400 });
    }

    const res = await translate(text, { to });
    const translatedText = Array.isArray(res) 
      ? res[0]?.text 
      : (res as any).text;

    return NextResponse.json({ translatedText });
  } catch (error: any) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: error.message || "Translation failed" }, { status: 500 });
  }
}
