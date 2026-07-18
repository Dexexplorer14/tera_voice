/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PhoneCall, Mail, Lock, Sparkles, LogIn, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: () => void;
  onNavigate: (page: string) => void;
}

export default function AuthPage({ onLoginSuccess, onNavigate }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('demo@teravoice.in');
  const [password, setPassword] = useState('password123');
  const [orgName, setOrgName] = useState('Malhotra Group');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate beautiful loading state
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 1200);
  };

  return (
    <div id="auth-container" className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col lg:flex-row font-sans relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/4 -z-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Back button */}
      <button 
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium bg-zinc-900/60 border border-zinc-800/80 px-4 py-2 rounded-full backdrop-blur"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </button>

      {/* Left side: Hero pitch card (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-950 p-16 flex-col justify-between border-r border-zinc-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.05),transparent_40%)] pointer-events-none" />
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl overflow-hidden flex items-center justify-center glow-accent">
            <img src="/logo.png" alt="Tera Logo" className="h-full w-full object-cover" />
          </div>
          <span className="text-2xl font-bold font-display text-white tracking-tight">Tera</span>
        </div>

        {/* Dynamic testimonial / pitch block */}
        <div className="relative max-w-lg z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-accent font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5" /> High Fidelity Voice Agents
          </div>
          <h2 className="text-4xl font-extrabold font-display leading-[1.15] text-white mb-6">
            The sub-second response engine designed for Indian dialects.
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed mb-8">
            Deploy local-language receptionists, customer triage bots, and outbound dialers that seamlessly understand Hinglish accents and handle orders in under 3 minutes.
          </p>

          <div className="space-y-4 pt-4 border-t border-zinc-900">
            <div className="flex items-center gap-3">
              <span className="text-green-500 text-base">●</span>
              <span className="text-sm text-zinc-300 font-medium">95% reduction in support operations costs</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-500 text-base">●</span>
              <span className="text-sm text-zinc-300 font-medium">Zero customer queues or waiting lines</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-500 text-base">●</span>
              <span className="text-sm text-zinc-300 font-medium">Auto-trigger SMS, WhatsApp, and Stripe/GPay links</span>
            </div>
          </div>
        </div>

        {/* Small credit footer */}
        <div className="text-zinc-600 text-xs font-mono">
          SECURE SANDBOX ENVIRONMENT • 256-BIT ENCRYPTION
        </div>
      </div>

      {/* Right side: Interactive Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-md">
          {/* Logo for mobile view */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden justify-center">
            <div className="h-9 w-9 rounded-lg overflow-hidden flex items-center justify-center">
              <img src="/logo.png" alt="Tera Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-xl font-bold font-display text-white">Tera</span>
          </div>

          <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-8 shadow-2xl relative">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold font-display text-white mb-2">
                {isSignUp ? 'Create your business account' : 'Welcome back to Tera'}
              </h3>
              <p className="text-sm text-zinc-400">
                {isSignUp ? 'Set up an AI receptionist for your workspace' : 'Log in to manage your active voice agents'}
              </p>
            </div>

            {/* Google Authentication mock */}
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 px-4 rounded-full border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900 text-zinc-300 font-medium text-sm flex items-center justify-center gap-3 transition-all mb-6 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <div className="relative flex py-3 items-center mb-6">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink mx-4 text-zinc-500 text-xs uppercase font-mono tracking-wider">or email</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Business / Org Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">🏢</span>
                    <input 
                      type="text" 
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Malhotra Clinics" 
                      className="w-full bg-[#1A1A22] border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute inset-y-0 left-0 pl-3.5 h-full w-9 text-zinc-500" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourbusiness.com" 
                    className="w-full bg-[#1A1A22] border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
                  {!isSignUp && (
                    <a href="#" className="text-xs text-accent hover:underline">Forgot password?</a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute inset-y-0 left-0 pl-3.5 h-full w-9 text-zinc-500" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-[#1A1A22] border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-accent text-zinc-950 font-bold text-sm hover:bg-accent-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/15 hover:scale-[1.01] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'} <LogIn className="h-4 w-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-zinc-500">
                {isSignUp ? 'Already have an account? ' : "New to Tera? "}
              </span>
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-accent hover:underline font-semibold cursor-pointer"
              >
                {isSignUp ? 'Sign In' : 'Create an Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
