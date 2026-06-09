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
  title: "Ceylon Luxe Travels",
  description:
    "An uncharted editorial journey through heritage citadels, emerald highlands, and shores that redefine the horizon.",
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
        <link rel="icon" href="/assets/compass-logo.svg?v=4" type="image/svg+xml" />
        <link rel="shortcut icon" href="/assets/compass-logo.svg?v=4" />
        <link rel="apple-touch-icon" href="/assets/compass-logo.svg?v=4" />
      </head>
      <body
        className={`${dmSans.variable} ${cormorant.variable} font-sans antialiased bg-bg text-textcolor`}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
