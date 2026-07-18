/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  PhoneCall, 
  Plus, 
  HelpCircle, 
  Languages, 
  Globe, 
  MessageSquare,
  Sparkles,
  Zap,
  Check
} from 'lucide-react';
import { Agent } from '../types';

interface CreateAgentFlowProps {
  onCancel: () => void;
  onSuccess: (newAgentData: Partial<Agent>) => void;
}

export default function CreateAgentFlow({ onCancel, onSuccess }: CreateAgentFlowProps) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<'Inbound' | 'Outbound'>('Inbound');
  const [name, setName] = useState('');
  const [useCase, setUseCase] = useState('');
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('Hinglish (Hindi + English)');
  const [loading, setLoading] = useState(false);

  // Suggested quick prompts for Indian businesses
  const promptTemplates = {
    Inbound: [
      {
        title: 'Hotel Front Desk',
        useCase: 'Book room stays & answer pricing',
        prompt: 'You are the receptionist for Malhotra Luxury Stays. Collect guests names, check-in and check-out dates, and guest count. Quote them ₹12,000 for standard deluxe or ₹18,000 for executive suite. Confirm and transfer call to desk.',
      },
      {
        title: 'Clinic Schedulers',
        useCase: 'Doctor appointment reservation & symptoms triage',
        prompt: 'You are the virtual receptionist for Dental Care Gurgaon. Address patients politely in Hindi or English. Confirm their dental issue. Offer 10 AM or 3 PM tomorrow. Take their name, confirm details, and push to calendar.',
      },
      {
        title: 'Cafe Reservation',
        useCase: 'Take table pre-orders & direct UPI link',
        prompt: 'You are the AI Order buddy for Koramangala Cafe. Greet enthusiastically in Hinglish. Assist in ordering ginger tea and samosas. Calculate order price, ask for their UPI confirmation, and let them know pickup is in 10 mins.',
      }
    ],
    Outbound: [
      {
        title: 'Coaching Center Qualified Leads',
        useCase: 'Follow up on admission scholarship download',
        prompt: 'You are an academic counsellor at Apex Academy. Dial downloaded student leads, congratulate them, ask what stream they target (IIT-JEE or NEET) for 2027, and invite them for a free offline counseling session this Saturday.',
      },
      {
        title: 'Hotel Feedback',
        useCase: 'Collect post-stay hospitality rating',
        prompt: 'You are the feedback collector for Taj Vivanta. Dial guests who checked out yesterday. Ask them to rate their stay from 1 to 5, write down any staff feedback, and send a WhatsApp thank-you coupon for their next visit.',
      }
    ]
  };

  const handleApplyTemplate = (tpl: typeof promptTemplates['Inbound'][0]) => {
    setName(tpl.title);
    setUseCase(tpl.useCase);
    setPrompt(tpl.prompt);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Create agent!
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onSuccess({
          name: name || 'Unnamed AI Agent',
          type,
          useCase: useCase || 'General Inbound Support',
          prompt: prompt || 'You are a helpful AI assistant.',
          language,
          status: 'Draft',
          callsCount: 0,
          minutesCount: 0,
          successRate: 0,
          createdAt: new Date().toISOString().split('T')[0],
          llmProvider: 'Google Gemini',
          llmModel: 'gemini-2.5-flash',
          ttsProvider: 'Deepgram',
          ttsVoice: 'aura-asteria-en',
          sttProvider: 'Deepgram'
        });
      }, 1500);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  return (
    <div id="create-agent-container" className="max-w-4xl mx-auto py-8 px-4 font-sans text-gray-100">
      {/* Header and Step Indicators */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <button 
            onClick={onCancel}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-mono uppercase tracking-wider mb-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Cancel Creation
          </button>
          <h2 className="text-3xl font-bold font-display text-white">Create Your AI Voice Agent</h2>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div 
                className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm border transition-all ${
                  step === num 
                    ? 'bg-accent border-accent text-zinc-950 shadow-md shadow-accent/20' 
                    : step > num 
                      ? 'bg-zinc-800 border-zinc-700 text-accent' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
              >
                {step > num ? <Check className="h-4 w-4 stroke-[2.5]" /> : num}
              </div>
              {num < 3 && (
                <div className={`w-8 h-[2px] ml-3 ${step > num ? 'bg-accent' : 'bg-zinc-800'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Areas based on Steps */}
      <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-6 md:p-8 min-h-[400px] flex flex-col justify-between">
        
        {/* Step 1: Call Direction Selector */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Step 1: Choose Call Type</h3>
              <p className="text-sm text-zinc-400">Determine whether your AI Agent will handle incoming support queries or call lead numbers automatically.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Inbound */}
              <button
                type="button"
                onClick={() => setType('Inbound')}
                className={`p-6 rounded-xl border text-left transition-all relative ${
                  type === 'Inbound' 
                    ? 'bg-zinc-900 border-accent text-white' 
                    : 'bg-transparent border-zinc-800 hover:border-zinc-700 text-zinc-400'
                }`}
              >
                <div className={`h-11 w-11 rounded-lg flex items-center justify-center mb-4 ${type === 'Inbound' ? 'bg-accent/10 text-accent' : 'bg-zinc-800 text-zinc-500'}`}>
                  <PhoneCall className="h-5 w-5" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2 font-display">Inbound Calls</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Customers call your dedicated Tera virtual phone number. The AI answers immediately, handles inquiries, takes bookings, or routes to desk.
                </p>
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-accent mt-4 block">Recommended for: Hotels, Clinics, Cafes</span>
                {type === 'Inbound' && (
                  <div className="absolute top-4 right-4 h-5 w-5 rounded-full bg-accent flex items-center justify-center text-zinc-950 font-bold text-xs">✓</div>
                )}
              </button>

              {/* Card Outbound */}
              <button
                type="button"
                onClick={() => setType('Outbound')}
                className={`p-6 rounded-xl border text-left transition-all relative ${
                  type === 'Outbound' 
                    ? 'bg-zinc-900 border-accent text-white' 
                    : 'bg-transparent border-zinc-800 hover:border-zinc-700 text-zinc-400'
                }`}
              >
                <div className={`h-11 w-11 rounded-lg flex items-center justify-center mb-4 ${type === 'Outbound' ? 'bg-accent/10 text-accent' : 'bg-zinc-800 text-zinc-500'}`}>
                  <Globe className="h-5 w-5" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2 font-display">Outbound Campaigns</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The AI initiates calls to your uploaded CSV contact list. Used to qualify leads, gather feedback, send voice announcements, or follow up.
                </p>
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-accent mt-4 block">Recommended for: Coaching Institutes, Follow-ups</span>
                {type === 'Outbound' && (
                  <div className="absolute top-4 right-4 h-5 w-5 rounded-full bg-accent flex items-center justify-center text-zinc-950 font-bold text-xs">✓</div>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Details & Prompt Config */}
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Step 2: Define Agent Identity</h3>
              <p className="text-sm text-zinc-400">Give your agent a name and prompt instructions on how they should interact with Indian callers.</p>
            </div>

            {/* Quick-start templates container */}
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-4">
              <span className="text-[10px] uppercase font-mono tracking-wider text-accent font-semibold block mb-3 flex items-center gap-1.5">
                <Zap className="h-3 w-3" /> Quick-Start Templates for {type}
              </span>
              <div className="flex flex-wrap gap-3">
                {promptTemplates[type].map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="text-xs bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white px-3.5 py-2 rounded-lg font-medium transition-all cursor-pointer"
                  >
                    + {tpl.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Agent Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Receptionist" 
                  className="w-full bg-[#1A1A22] border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Primary Use Case</label>
                <input 
                  type="text" 
                  required
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  placeholder="e.g. Booking hotel rooms & breakfast add-ons" 
                  className="w-full bg-[#1A1A22] border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">AI Activity Instructions (System Prompt)</label>
              <textarea 
                rows={4}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Identify yourself politely. Ask guests for their checkout date, and details. Book standard rooms..." 
                className="w-full bg-[#1A1A22] border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-all font-mono text-xs"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block leading-relaxed">
                Helper instructions: Be specific. List exact rules (e.g. "Do not offer discounts", "Quote standard room prices", "Ask for name & phone number").
              </span>
            </div>
          </motion.div>
        )}

        {/* Step 3: Dialect & Language settings */}
        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Step 3: Language & Accent</h3>
              <p className="text-sm text-zinc-400">Specify the primary customer dialect. Tera is highly trained to capture mixed Indian terms (Hinglish).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Hinglish (Hindi + English)', flag: '🇮🇳', desc: 'Ideal for metropolitan cafes, colleges, & hotels' },
                { name: 'Hindi (हिंदी)', flag: '🇮🇳', desc: 'Best for local clinics, family hotels, and tier-2 markets' },
                { name: 'English (Indian Accent)', flag: '🌐', desc: 'Ideal for premium resorts and corporate clients' },
                { name: 'Tamil (தமிழ்) • Regional Beta', flag: '🇮🇳', desc: 'Highly optimized regional phonemes' },
                { name: 'Telugu (తెలుగు) • Regional Beta', flag: '🇮🇳', desc: 'Highly optimized regional phonemes' },
                { name: 'Kannada (ಕನ್ನಡ) • Regional Beta', flag: '🇮🇳', desc: 'Highly optimized regional phonemes' }
              ].map((lang) => (
                <button
                  key={lang.name}
                  type="button"
                  onClick={() => setLanguage(lang.name)}
                  className={`p-4 rounded-xl border text-left transition-all flex gap-3 ${
                    language === lang.name 
                      ? 'bg-zinc-900 border-accent text-white' 
                      : 'bg-transparent border-zinc-800 hover:border-zinc-700 text-zinc-400'
                  }`}
                >
                  <span className="text-2xl mt-1">{lang.flag}</span>
                  <div>
                    <h5 className="font-bold text-white text-sm">{lang.name}</h5>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{lang.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer controls */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-zinc-900">
          <button
            type="button"
            onClick={handlePrev}
            className="px-6 py-3 rounded-full border border-zinc-800 hover:border-zinc-600 text-sm font-semibold hover:bg-zinc-900 text-zinc-300 transition-all cursor-pointer"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={loading || (step === 2 && !name)}
            className="px-7 py-3 rounded-full bg-accent text-zinc-950 font-bold text-sm hover:bg-accent-hover transition-all flex items-center gap-2 shadow-lg shadow-accent/15 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                Generating AI Graph... <div className="h-4 w-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              </>
            ) : (
              <>
                {step === 3 ? 'Deploy Agent' : 'Next Step'} <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
