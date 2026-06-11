"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      if (error) {
        console.error("Error logging in with Google:", error.message);
        setError(error.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In forgot password mode, we only need the email
    if (isForgotPassword && !email) {
      setError("Please enter your email address.");
      return;
    }
    
    // In sign up/in mode, we need both
    if (!isForgotPassword && (!email || !password)) {
      setError("Please fill in both email and password.");
      return;
    }
    
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isForgotPassword) {
        // Forgot Password Flow
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        });

        if (resetError) throw resetError;

        setSuccessMsg("Password reset link sent! Please check your email inbox (and spam folder) for the link.");
      } else if (isSignUp) {
        // Sign Up Flow
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (data.session === null) {
          // Supabase requires email confirmation by default
          setSuccessMsg("Account created successfully! Please check your email for a confirmation link to activate your account.");
          setPassword("");
        } else {
          router.push("/explore");
        }
      } else {
        // Sign In Flow
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        
        router.push("/explore");
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setIsForgotPassword(false);
    setError(null);
    setSuccessMsg(null);
  };

  const toggleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsForgotPassword(!isForgotPassword);
    setIsSignUp(false);
    setError(null);
    setSuccessMsg(null);
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
            <h2 className="text-2xl md:text-3xl font-semibold text-textcolor mb-2">
              {isForgotPassword ? "Reset your password" : (isSignUp ? "Create an account" : "Welcome back!")}
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              {isForgotPassword 
                ? "Enter your email address and we'll send you a link to reset your password."
                : (isSignUp 
                    ? "Sign up to start planning your perfect Sri Lankan getaway."
                    : "Sign in to your account to manage your trips, access your wishlists, and explore customized Sri Lankan experiences.")}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-lg flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-textdim">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@domain.com"
                required
                className="w-full bg-surface2 border border-bordercolor rounded-lg px-4 py-3 text-sm text-textcolor placeholder:text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
              />
            </div>

            {!isForgotPassword && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-textdim">Password</label>
                  {!isSignUp && (
                    <button 
                      type="button"
                      onClick={toggleForgotPassword}
                      className="text-xs text-ambercolor hover:opacity-80 transition-opacity bg-transparent border-none p-0 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignUp ? "Create a secure password" : "Enter your password"}
                  required
                  minLength={6}
                  className="w-full bg-surface2 border border-bordercolor rounded-lg px-4 py-3 text-sm text-textcolor placeholder:text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
                />
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/80 text-white font-medium rounded-lg px-4 py-3 mt-2 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isForgotPassword ? "Send Reset Link" : (isSignUp ? "Create Account" : "Sign in")}
            </button>
            
            {isForgotPassword && (
              <button
                type="button"
                onClick={toggleForgotPassword}
                className="mt-2 text-sm text-muted hover:text-textcolor transition-colors bg-transparent border-none p-0 cursor-pointer"
              >
                Back to Sign in
              </button>
            )}
          </form>

          {!isForgotPassword && (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-[1px] bg-bordercolor"></div>
                <span className="text-xs text-muted">or</span>
                <div className="flex-1 h-[1px] bg-bordercolor"></div>
              </div>

              {/* Sign in with Google */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  id="google-login-btn"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-surface2 hover:bg-bordercolor border border-bordercolor rounded-lg py-3.5 transition-colors text-sm font-medium text-textdim hover:text-textcolor"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>

              <p className="text-center text-sm text-muted mt-6">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button 
                  onClick={toggleMode} 
                  className="text-ambercolor hover:opacity-80 font-medium transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
            </  >
          )}
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
                  &ldquo;This platform has completely transformed how we plan our trips. What used to take hours of research is now fully automated and customized.&rdquo;
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
