import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ItineraryConfirmation } from "@/components/emails/ItineraryConfirmation";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const adminEmail = process.env.ADMIN_EMAIL || "dineth.theekshana2002@gmail.com";

export async function POST(request: Request) {
  try {
    const { clientName, clientEmail, title, details } = await request.json();

    if (!clientEmail) {
      return NextResponse.json({ error: "Client email is required" }, { status: 400 });
    }

    if (!resend) {
      // Fallback for local development or if key is missing
      console.log("Simulated Booking Email:", { clientName, clientEmail, title, details });
      return NextResponse.json({ success: true, simulated: true });
    }

    // 1. Send confirmation to the client
    await resend.emails.send({
      from: "Ceylon Luxe Travels <bookings@ceylonluxetravels.com>",
      to: clientEmail,
      subject: `Booking Request Received: ${title}`,
      react: ItineraryConfirmation({ clientName, title, details }),
    });

    // 2. Send structured alert to the admin
    await resend.emails.send({
      from: "System <bookings@ceylonluxetravels.com>",
      to: adminEmail,
      subject: `NEW BOOKING REQUEST: ${title}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Name:</strong> ${clientName || "N/A"}</p>
        <p><strong>Email:</strong> ${clientEmail}</p>
        <p><strong>Package/Excursion:</strong> ${title}</p>
        <h3>Details</h3>
        <p>${details}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Booking API error:", error);
    return NextResponse.json({ error: error.message || "Failed to process booking" }, { status: 500 });
  }
}
