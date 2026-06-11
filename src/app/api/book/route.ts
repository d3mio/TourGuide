import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ItineraryConfirmation } from "@/components/emails/ItineraryConfirmation";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const adminEmail = process.env.ADMIN_EMAIL || "";

// ---------- Rate Limiter (in-memory, per IP) ----------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;      // max requests
const RATE_LIMIT_WINDOW = 60;  // per 60 seconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW * 1000 });
    return true; // allowed
  }

  if (entry.count >= RATE_LIMIT_MAX) return false; // blocked

  entry.count++;
  return true; // allowed
}

// ---------- HTML Entity Escaper (prevents XSS in email HTML body) ----------
function escapeHtml(str: unknown): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ---------- Email validator ----------
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export async function POST(request: NextRequest) {
  // --- Rate limiting ---
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment before trying again." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { clientName, clientEmail, title, details } = body;

    // --- Input validation ---
    if (!clientEmail || typeof clientEmail !== "string") {
      return NextResponse.json({ error: "Client email is required" }, { status: 400 });
    }
    if (!isValidEmail(clientEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (clientName && typeof clientName !== "string") {
      return NextResponse.json({ error: "Invalid client name" }, { status: 400 });
    }
    // Length caps to prevent payload abuse
    const MAX_LENGTHS: Record<string, number> = {
      clientName: 120,
      clientEmail: 254,
      title: 200,
      details: 5000,
    };
    for (const [field, max] of Object.entries(MAX_LENGTHS)) {
      const val = body[field];
      if (val && typeof val === "string" && val.length > max) {
        return NextResponse.json(
          { error: `Field '${field}' exceeds maximum allowed length` },
          { status: 400 }
        );
      }
    }

    if (!resend) {
      // Fallback for local development or if key is missing
      console.log("Simulated Booking Email:", { clientName, clientEmail, title, details });
      return NextResponse.json({ success: true, simulated: true });
    }

    // Sanitize all user inputs before embedding in HTML
    const safeClientName  = escapeHtml(clientName || "N/A");
    const safeClientEmail = escapeHtml(clientEmail);
    const safeTitle       = escapeHtml(title);
    const safeDetails     = escapeHtml(details).replace(/\n/g, "<br/>");

    // 1. Send confirmation to the client
    await resend.emails.send({
      from: "Ceylon Luxe Travels <bookings@ceylonluxetravels.com>",
      to: clientEmail,
      subject: `Booking Request Received: ${title}`,
      react: ItineraryConfirmation({ clientName, title, details }),
    });

    // 2. Send structured alert to the admin (using sanitized values in HTML)
    if (adminEmail) {
      await resend.emails.send({
        from: "System <bookings@ceylonluxetravels.com>",
        to: adminEmail,
        subject: `NEW BOOKING REQUEST: ${safeTitle}`,
        html: `
          <h2>New Booking Request</h2>
          <p><strong>Name:</strong> ${safeClientName}</p>
          <p><strong>Email:</strong> ${safeClientEmail}</p>
          <p><strong>Package/Excursion:</strong> ${safeTitle}</p>
          <h3>Details</h3>
          <p>${safeDetails}</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process booking";
    console.error("Booking API error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
