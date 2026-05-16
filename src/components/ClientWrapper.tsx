"use client";

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import Navbar from './Navbar';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, mounted]);

  if (!mounted) {
    return <div className="invisible">{children}</div>; // Prevent hydration flash
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-56px)]">{children}</main>
    </>
  );
}
