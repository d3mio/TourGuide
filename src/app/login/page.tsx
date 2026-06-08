"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    try {
      // Initialize Supabase client inside the handler so it doesn't break Vercel static builds
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Supabase credentials are not set!");
        return;
      }
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      if (error) {
        console.error("Error logging in with Google:", error.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-ambercolor/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Back to home */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-muted hover:text-textcolor transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[1000px] bg-surface border border-bordercolor rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-2xl z-10"
      >
        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-textcolor mb-2">Welcome back!</h2>
            <p className="text-sm text-muted leading-relaxed">
              Log in to your account to manage your trips, access your wishlists, and explore customized Sri Lankan experiences.
            </p>
          </div>

          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-textdim">Email</label>
              <input 
                type="email" 
                placeholder="youremail@yourdomain.com"
                className="w-full bg-surface2 border border-bordercolor rounded-lg px-4 py-3 text-sm text-textcolor placeholder:text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-textdim">Password</label>
              <input 
                type="password" 
                placeholder="Enter your password"
                className="w-full bg-surface2 border border-bordercolor rounded-lg px-4 py-3 text-sm text-textcolor placeholder:text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
              />
            </div>

            <button 
              type="button"
              className="w-full bg-accent hover:bg-accent/80 text-white font-medium rounded-lg px-4 py-3 mt-2 transition-colors text-sm"
            >
              Sign in
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-[1px] bg-bordercolor"></div>
            <span className="text-xs text-muted">or</span>
            <div className="flex-1 h-[1px] bg-bordercolor"></div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-surface2 hover:bg-bordercolor border border-bordercolor rounded-lg py-3 transition-colors text-sm font-medium text-textdim hover:text-textcolor"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account? <Link href="/login" className="text-ambercolor hover:opacity-80 font-medium transition-colors">Sign up</Link>
          </p>
        </div>

        {/* Right Side: Gradient Feature Card */}
        <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col justify-end">
          <div className="w-full h-full min-h-[400px] rounded-xl relative overflow-hidden flex flex-col justify-end p-8 bg-surface2">
            
            {/* Soft glowing orb in the card */}
            <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-ambercolor/20 blur-[80px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
            
            <div className="relative z-10">
              <div className="flex gap-2 mb-4">
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-textcolor/10 rounded-md text-textcolor/80 border border-bordercolor backdrop-blur-md">
                  Premium Quality
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-textcolor/10 rounded-md text-textcolor/80 border border-bordercolor backdrop-blur-md">
                  Sri Lanka Travel
                </span>
              </div>
              
              <div className="bg-bg/40 backdrop-blur-xl border border-bordercolor rounded-xl p-6 shadow-2xl">
                <p className="text-sm text-textdim leading-relaxed mb-4">
                  "This platform has completely transformed how we plan our trips. What used to take hours of research is now fully automated and customized."
                </p>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-textcolor">Elena Rodriguez</span>
                  <span className="text-xs text-muted">Travel Blogger, <span className="text-textcolor font-medium">Wanderlust Inc.</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
