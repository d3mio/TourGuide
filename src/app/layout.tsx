import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "Ceylon Luxe Travels",
  description: "An uncharted editorial journey through heritage citadels, emerald highlands, and shores that redefine the horizon.",
  openGraph: {
    title: "Ceylon Luxe Travels",
    description: "An uncharted editorial journey through heritage citadels, emerald highlands, and shores that redefine the horizon.",
    url: "/",
    siteName: "Ceylon Luxe Travels",
    images: [
      {
        url: "/assets/serendibtours.png", // Assuming an existing image
        width: 1200,
        height: 630,
        alt: "Ceylon Luxe Travels Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ceylon Luxe Travels",
    description: "An uncharted editorial journey through heritage citadels, emerald highlands, and shores that redefine the horizon.",
    images: ["/assets/serendibtours.png"],
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body
        className={`${dmSans.variable} ${cormorant.variable} font-sans antialiased bg-bg text-textcolor`}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
