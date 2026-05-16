"use client";

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import Navbar from './Navbar';

import Footer from './Footer';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      
      // Update theme-color meta tag dynamically
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', theme === 'dark' ? '#09090b' : '#fafafa');
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'theme-color';
        newMeta.content = theme === 'dark' ? '#09090b' : '#fafafa';
        document.head.appendChild(newMeta);
      }
    }
  }, [theme, mounted]);

  if (!mounted) {
    return <div className="invisible">{children}</div>; // Prevent hydration flash
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-bg">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
