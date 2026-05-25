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
  title: "Sri Lankan Serendib Tours",
  description: "An uncharted editorial journey through heritage citadels, emerald highlands, and shores that redefine the horizon.",
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${dmSans.variable} ${cormorant.variable} font-sans antialiased bg-bg text-textcolor transition-colors duration-400`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
