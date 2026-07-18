/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PhoneCall, 
  Languages, 
  Sliders, 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  MessageSquare, 
  Volume2,
  Play,
  TrendingUp,
  Award
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function LandingPage({ onNavigate, isLoggedIn, onLogout }: LandingPageProps) {
  const [activeDemoTab, setActiveDemoTab] = useState<'hotel' | 'clinic' | 'cafe'>('hotel');

  const demoTranscripts = {
    hotel: [
      { role: 'user', text: 'Hello, room booking karni thi kal ke liye.' },
      { role: 'agent', text: 'Namaste! Taj Vivanta me aapka swagat hai. Kal yaani July 18 ke liye humare paas Luxury double rooms available hain. Kya main aapka naam jaan sakti hoon?' },
      { role: 'user', text: 'Akash Gupta. Price kya hai?' },
      { role: 'agent', text: 'Gupta ji, Premium room ₹18,000 plus GST me hai, jisme free breakfast aur high speed Wi-Fi included hai. Kya main confirm kar doon?' }
    ],
    clinic: [
      { role: 'user', text: 'Dr. Sharma se appointment chahiye kal subah.' },
      { role: 'agent', text: 'Pranam! Kal Dr. Sharma ke paas subah 11 baje aur shaam 4 baje slots khali hain. Aapko kaunsa time sahi rahega?' },
      { role: 'user', text: '11 baje theek rahega. Root canal ke liye dikhana hai.' },
      { role: 'agent', text: 'Got it Verma ji! Kal subah 11 baje ka slot book kar diya hai. Aapko confirmation SMS bhej diya gaya hai.' }
    ],
    cafe: [
      { role: 'user', text: 'I want to pre-order 10 cutting chai and 5 bun maska.' },
      { role: 'agent', text: 'Hey there! Chai Tapri, Koramangala me swagat hai boss! Your order total is ₹650. It will be hot and ready in 10 mins. Sending you the UPI link on WhatsApp now!' }
    ]
  };

  return (
    <div id="landing-container" className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col selection:bg-accent selection:text-zinc-950">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0A0A0A]/80 border-b border-zinc-800/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center glow-accent">
              <PhoneCall className="h-5 w-5 text-black stroke-[2.5]" />
            </div>
            <span className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-1">
              Tera <span className="text-accent text-xs px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 font-sans font-medium">SaaS Pitch</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Product Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Interactive Demo</a>
            <a href="#pricing" className="hover:text-white transition-colors">Plans</a>
            <a href="#social-proof" className="hover:text-white transition-colors">Testimonials</a>
          </nav>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="px-5 py-2 rounded-full border border-zinc-700 hover:border-zinc-500 text-sm font-medium transition-all"
                >
                  Dashboard
                </button>
                <button 
                  onClick={onLogout}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onNavigate('auth')}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onNavigate('auth')}
                  className="px-5 py-2.5 rounded-full bg-accent text-zinc-950 font-semibold text-sm hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  Get Started <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative pt-20 pb-24 px-6 overflow-hidden">
          {/* Subtle grid pattern in background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.08),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-accent to-teal-400 opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-accent mb-8"
            >
              <Sparkles className="h-3.5 w-3.5" /> Automate Phone Support with 95% Cost Cut
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold font-display text-white tracking-tight leading-[1.1] mb-8"
            >
              AI voice agents that <span className="text-accent underline decoration-accent/30 decoration-wavy underline-offset-8">answer, book,</span> and follow up.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-400 font-normal leading-relaxed max-w-3xl mx-auto mb-10"
            >
              Indian customer behavior is spoken, not clicked. Tera deploys sub-second latency voice bots that talk in English, Hindi, Hinglish, and regional languages to capture every guest booking, patient slot, and lead follow-up.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <button 
                onClick={() => onNavigate('auth')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-accent text-zinc-950 font-bold text-base hover:bg-accent-hover transition-all shadow-xl shadow-accent/25 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3"
              >
                Start Free Trial <ArrowRight className="h-5 w-5 stroke-[2.5]" />
              </button>
              <a 
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
              >
                <Play className="h-4 w-4 fill-current text-accent" /> Watch AI Demo
              </a>
            </motion.div>

            {/* Micro Metrics Row */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-zinc-800/80 text-center"
            >
              <div>
                <div className="text-3xl font-bold text-white font-display">&lt; 800ms</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Average Latency</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white font-display">10,000+</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Daily Automated Calls</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white font-display">34%</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">More Bookings Recorded</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white font-display">₹5 / call</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Avg. Cost vs Human Team</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-24 px-6 bg-zinc-950/40 border-t border-b border-zinc-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Built specifically for Indian businesses
              </h2>
              <p className="text-zinc-400 text-base md:text-lg">
                Stop wasting money on missed calls, busy reception lines, and cold dialers. Defer support to Tera.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700 transition-all group hover:-translate-y-1">
                <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-display">Inbound Automation</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Automatically pick up calls 24/7. Handle table reservations, patient appointment booking, room stays, or general business FAQs.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700 transition-all group hover:-translate-y-1">
                <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-display">Smart Outbound Dialer</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Call cold or warm leads automatically. Qualify coaching academy enquiries, follow up on clinic cancellations, or gather café feedbacks instantly.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700 transition-all group hover:-translate-y-1">
                <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <Languages className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-display">Hindi, English & Hinglish</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Understand pure Hindi, English, Hinglish, and regional accents natively. Seamlessly switches languages when customers switch terms.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700 transition-all group hover:-translate-y-1">
                <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <Sliders className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-display">No-Code Workflows</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  A intuitive node-based graph builder. Define how calls progress, when to trigger webhook tools, or when to transfer to human employees.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo Player Section */}
        <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-accent font-semibold text-xs uppercase tracking-widest">Real-time Conversational Playback</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-6 leading-tight font-display">
                Listen to how Tera automates standard calls.
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed mb-8">
                Select an industry sector below to simulate a real conversation handled by our low-latency, hyper-natural AI voice agents.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setActiveDemoTab('hotel')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left border transition-all ${activeDemoTab === 'hotel' ? 'bg-zinc-900 border-accent text-white font-medium' : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                >
                  <span className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white">🏨</span>
                  <div>
                    <div className="font-semibold text-white">Vivanta Hotel Booking Assistant</div>
                    <div className="text-xs text-zinc-500">Inbound Hinglish • Room Booking</div>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveDemoTab('clinic')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left border transition-all ${activeDemoTab === 'clinic' ? 'bg-zinc-900 border-accent text-white font-medium' : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                >
                  <span className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white">🦷</span>
                  <div>
                    <div className="font-semibold text-white">Arogya Dental Receptionist</div>
                    <div className="text-xs text-zinc-500">Inbound Hindi • Appointment Slot Triage</div>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveDemoTab('cafe')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left border transition-all ${activeDemoTab === 'cafe' ? 'bg-zinc-900 border-accent text-white font-medium' : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                >
                  <span className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white">☕</span>
                  <div>
                    <div className="font-semibold text-white">Chai Tapri Café Order Bot</div>
                    <div className="text-xs text-zinc-500">Inbound Hinglish • WhatsApp UPI pre-payment</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Transcript Preview Card */}
            <div className="lg:col-span-7 bg-[#111115] border border-zinc-800 rounded-2xl p-6 md:p-8 relative">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] uppercase text-zinc-500 tracking-widest font-mono">Demo Live Node</span>
              </div>

              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-800">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Interactive Audio Waveform</h4>
                  <p className="text-xs text-zinc-500">Maya AI Agent • Voice Engine active</p>
                </div>
              </div>

              {/* Animated waveform placeholder */}
              <div className="h-14 flex items-center justify-center gap-1.5 mb-8 bg-zinc-950/60 rounded-xl px-4 border border-zinc-900">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((item) => (
                  <motion.div
                    key={item}
                    animate={{ height: [12, 36, 12] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: item * 0.05,
                      ease: 'easeInOut'
                    }}
                    className="w-1 bg-accent rounded-full opacity-85"
                  />
                ))}
              </div>

              {/* Conversation list */}
              <div className="space-y-4">
                {demoTranscripts[activeDemoTab].map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-zinc-500 mb-1 font-mono uppercase tracking-wider">
                      {msg.role === 'user' ? 'Customer' : 'Tera Agent'}
                    </span>
                    <div 
                      className={`p-3.5 rounded-2xl text-sm max-w-[85%] leading-relaxed ${msg.role === 'user' ? 'bg-zinc-800 text-zinc-100 rounded-tr-none' : 'bg-zinc-900 border border-accent/25 text-white rounded-tl-none glow-accent/5'}`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section id="social-proof" className="py-24 px-6 bg-zinc-950/60 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-accent text-xs font-semibold uppercase tracking-widest">Loved by Indian SMB Owners</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 font-display">Success Stories from India</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-[#121216] border border-zinc-800 rounded-2xl flex flex-col justify-between">
                <p className="text-zinc-300 italic leading-relaxed text-sm">
                  "As a premium clinic, we used to miss around 15 appointment calls daily when our receptionists were busy. With Tera, the AI assistant book appointments directly into Google Calendar in fluent Hindi. Zero missed leads, 100% professional."
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-accent font-display">
                    DS
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Dr. Satish Sharma</h4>
                    <p className="text-xs text-zinc-500">Director, Arogya Dental Gurgaon</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-[#121216] border border-zinc-800 rounded-2xl flex flex-col justify-between">
                <p className="text-zinc-300 italic leading-relaxed text-sm">
                  "Our admissions desk in Janakpuri gets inundated with course inquiries every evening. We set up an Outbound Campaign on Tera. The bot calls qualified student leads, answers pricing queries, and schedules center counseling sessions in Hinglish."
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-accent font-display">
                    RM
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Raj Malhotra</h4>
                    <p className="text-xs text-zinc-500">Founder, Apex JEE Academy Delhi</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-[#121216] border border-zinc-800 rounded-2xl flex flex-col justify-between">
                <p className="text-zinc-300 italic leading-relaxed text-sm">
                  "Weekends at Koramangala are pure chaos. Customers would call us endlessly for parking space or to pre-order Chai. The Tera cafe bot handles these calls flawlessly and pushes pre-orders to WhatsApp checkout instantly. Extremely slick!"
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-accent font-display">
                    AH
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Anirudh Hegde</h4>
                    <p className="text-xs text-zinc-500">Owner, Chai Tapri Bangalore</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 px-6 relative overflow-hidden text-center bg-gradient-to-b from-[#0A0A0A] to-zinc-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(20,184,166,0.1),transparent_60%)] pointer-events-none" />
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
              Give your business the power of an AI Front Desk.
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Sign up today and get ₹1000 in free calling credits. No credit card required. Experience sub-second voice automation in 3 minutes.
            </p>
            <button 
              onClick={() => onNavigate('auth')}
              className="px-8 py-4 rounded-full bg-accent text-zinc-950 font-bold text-lg hover:bg-accent-hover transition-all shadow-xl shadow-accent/25 hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
            >
              Configure Your First Agent <ArrowRight className="h-5 w-5 stroke-[2.5]" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 px-6 py-12 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
              <PhoneCall className="h-4 w-4 text-black stroke-[2.5]" />
            </div>
            <span className="text-lg font-bold font-display text-white">Tera</span>
            <span className="text-xs text-zinc-500">© 2026. All rights reserved.</span>
          </div>

          <div className="flex gap-6">
            <a href="#features" className="hover:text-white transition-colors">Product</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Privacy</a>
            <a href="#social-proof" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
