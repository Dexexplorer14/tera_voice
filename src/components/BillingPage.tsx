/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  Check, 
  Zap, 
  Download, 
  FileText, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
}

interface BillingData {
  completedCalls: number;
  callLimit: number;
  minutesUsed: number;
  minutesLimit: number;
  invoices: Invoice[];
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'yearly' | 'monthly'>('yearly');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [billingInfo, setBillingInfo] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const res = await fetch('/api/billing');
        if (res.ok) {
          const data = await res.json();
          setBillingInfo(data);
        }
      } catch (err) {
        console.error('Failed to fetch billing details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBilling();
  }, []);

  const completedCalls = billingInfo?.completedCalls ?? 2420;
  const callLimit = billingInfo?.callLimit ?? 5000;
  const minutesUsed = billingInfo?.minutesUsed ?? 4810;
  const minutesLimit = billingInfo?.minutesLimit ?? 10000;
  const invoices = billingInfo?.invoices ?? [
    { id: 'INV-2026-004', date: 'Jul 1, 2026', amount: '₹1,79,988', status: 'Paid' },
    { id: 'INV-2025-003', date: 'Jul 1, 2025', amount: '₹1,79,988', status: 'Paid' },
    { id: 'INV-2024-002', date: 'Jul 1, 2024', amount: '₹1,79,988', status: 'Paid' }
  ];

  const callsPercentage = Math.min(100, Math.round((completedCalls / callLimit) * 100));
  const minutesPercentage = Math.min(100, Math.round((minutesUsed / minutesLimit) * 100));

  return (
    <div id="billing-container" className="space-y-8 font-sans text-gray-100 max-w-5xl mx-auto py-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-white">Billing & Usage</h1>
          <p className="text-sm text-zinc-400">Manage your subscription plans, monitor your monthly calling quota, and view invoice history.</p>
        </div>
        <button
          onClick={() => setShowUpgradeModal(true)}
          className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-zinc-950 font-bold text-sm rounded-full flex items-center gap-2 transition-all shadow-lg shadow-accent/15 self-start sm:self-center"
        >
          Upgrade Plan <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Usage Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Subscription Tier */}
        <div className="bg-[#121216] border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent font-mono">Current Tier</span>
            <h3 className="text-2xl font-bold font-display text-white mt-1.5 flex items-center gap-2">
              Growth Plan <span className="text-[10px] bg-accent/10 border border-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full font-sans">Active</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-2">Billed annually on July 1. Renews automatically.</p>
          </div>
          <div className="mt-8">
            <div className="text-3xl font-bold text-white font-display">₹14,999<span className="text-sm text-zinc-500 font-normal">/mo</span></div>
            <p className="text-[11px] text-zinc-500 mt-1">Saves 20% with annual subscription</p>
          </div>
        </div>

        {/* Card 2: Calls Made Slider */}
        <div className="bg-[#121216] border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 font-mono">Completed Calls</span>
              <span className="text-xs font-bold text-white font-mono">{completedCalls.toLocaleString()} / {callLimit.toLocaleString()}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-zinc-950 h-2.5 rounded-full mt-4 overflow-hidden border border-zinc-900">
              <div className="bg-accent h-full rounded-full" style={{ width: `${callsPercentage}%` }} />
            </div>
            <p className="text-xs text-zinc-500 mt-3">Monthly limit resets in 13 days.</p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-zinc-400 text-xs font-medium">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span>{callsPercentage}% quota consumed this month</span>
          </div>
        </div>

        {/* Card 3: Minute Consumption */}
        <div className="bg-[#121216] border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 font-mono">Call Minutes Used</span>
              <span className="text-xs font-bold text-white font-mono">{minutesUsed.toLocaleString()} / {minutesLimit.toLocaleString()}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-zinc-950 h-2.5 rounded-full mt-4 overflow-hidden border border-zinc-900">
              <div className="bg-accent h-full rounded-full" style={{ width: `${minutesPercentage}%` }} />
            </div>
            <p className="text-xs text-zinc-500 mt-3">Used across all deployed agents.</p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-zinc-400 text-xs font-medium">
            <Zap className="h-4 w-4 text-accent" />
            <span>Avg. call duration: ~2m 00s</span>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-[#121216] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold font-display text-white">Invoice History</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Download your official tax receipts and bills.</p>
          </div>
          <FileText className="h-5 w-5 text-zinc-600" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/40 text-[11px] font-semibold font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-900">
                <th className="p-4 pl-6">Invoice ID</th>
                <th className="p-4">Date Billed</th>
                <th className="p-4">Amount Charged</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4 pr-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-sm">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-zinc-900/20 transition-colors">
                  <td className="p-4 pl-6 font-mono text-zinc-400 text-xs font-semibold">{inv.id}</td>
                  <td className="p-4 text-zinc-300">{inv.date}</td>
                  <td className="p-4 text-white font-semibold">{inv.amount}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/15">
                      <Check className="h-3 w-3" /> {inv.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:text-accent-hover transition-colors font-mono uppercase tracking-wider cursor-pointer">
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optional Pricing Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-3xl w-full relative">
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white text-xs font-mono uppercase"
            >
              Close [Esc]
            </button>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold font-display text-white">Upgrade Your calling capabilities</h3>
              <p className="text-sm text-zinc-400 mt-1">Unlock massive calling limits, direct IVR integrations, and custom regional AI models.</p>

              {/* Yearly Selector */}
              <div className="inline-flex items-center gap-1.5 p-1 bg-zinc-950 rounded-full border border-zinc-800 mt-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('yearly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeTab === 'yearly' ? 'bg-accent text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'}`}
                >
                  Yearly (Saves 20%)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('monthly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeTab === 'monthly' ? 'bg-accent text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'}`}
                >
                  Monthly Standard
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Starter Plan */}
              <div className="border border-zinc-800 bg-zinc-900/30 p-6 rounded-xl flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-zinc-400 text-base">Growth Plan (Current)</h4>
                  <p className="text-xs text-zinc-500 mt-1">Perfect for growing Indian clinics or hotels.</p>
                  <div className="text-2xl font-bold text-white font-display mt-4">
                    {activeTab === 'yearly' ? '₹14,999' : '₹18,500'}
                    <span className="text-xs text-zinc-500 font-normal"> / mo</span>
                  </div>
                  <ul className="space-y-2 mt-6 text-xs text-zinc-300">
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent" /> 5,000 calling minutes / mo</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent" /> Hinglish & Hindi native accents</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent" /> 4 Active AI Agents</li>
                  </ul>
                </div>
                <button disabled className="w-full py-2.5 rounded-full border border-zinc-800 text-xs text-zinc-500 mt-8 font-semibold">
                  Current Active Plan
                </button>
              </div>

              {/* Premium Plan */}
              <div className="border border-accent bg-[#1E1E24]/30 p-6 rounded-xl flex flex-col justify-between relative glow-accent/10">
                <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-accent text-zinc-950 text-[9px] font-extrabold uppercase tracking-widest font-mono">Highly Recommended</span>
                <div>
                  <h4 className="font-bold text-white text-base flex items-center gap-2">
                    Professional Plan <Zap className="h-4 w-4 text-accent fill-current" />
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">For multi-chain coaching academies and hospitality hubs.</p>
                  <div className="text-2xl font-bold text-white font-display mt-4">
                    {activeTab === 'yearly' ? '₹39,999' : '₹48,000'}
                    <span className="text-xs text-zinc-500 font-normal"> / mo</span>
                  </div>
                  <ul className="space-y-2 mt-6 text-xs text-zinc-300">
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent" /> 15,000 calling minutes / mo</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent" /> All regional dialects (Tamil, Telugu, etc.)</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent" /> Unlimited AI Agents</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent" /> Custom LLM / API tool integration integrations</li>
                  </ul>
                </div>
                <button 
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full py-2.5 rounded-full bg-accent text-zinc-950 hover:bg-accent-hover text-xs font-bold mt-8 transition-all"
                >
                  Upgrade Instantly
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
