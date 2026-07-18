/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  PhoneCall, 
  Sparkles, 
  FileText, 
  Settings, 
  Sliders, 
  Mic, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Zap, 
  UploadCloud, 
  ChevronDown, 
  LogOut, 
  BarChart2, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Agent } from '../types';
import BillingPage from './BillingPage';
import SettingsPage from './SettingsPage';

// Import Recharts
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface DashboardProps {
  agents: Agent[];
  onRefreshAgents: () => void;
  onCreateAgentClick: () => void;
  onSelectAgent: (agent: Agent) => void;
  onLogout: () => void;
}

export default function Dashboard({ agents, onRefreshAgents, onCreateAgentClick, onSelectAgent, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'agents' | 'campaigns' | 'analytics' | 'billing' | 'settings'>('agents');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Inbound' | 'Outbound'>('All');
  
  // Organization Switcher states
  const [activeOrg, setActiveOrg] = useState('Malhotra Group Enterprises');
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);

  // Campaign Upload Simulator states
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [parsedLeadsCount, setParsedLeadsCount] = useState(0);
  const [isDialing, setIsDialing] = useState(false);
  const [dialProgress, setDialProgress] = useState(0);
  const [selectedDialerAgentId, setSelectedDialerAgentId] = useState(agents[0]?.id || '');

  // Keep chosen dialer agent synchronized if agents load later
  React.useEffect(() => {
    if (!selectedDialerAgentId && agents.length > 0) {
      setSelectedDialerAgentId(agents[0].id);
    }
  }, [agents, selectedDialerAgentId]);

  // Mock parsed CSV list
  const mockLeads = [
    { name: 'Rahul Yadav', phone: '+91 99321 00412', city: 'Delhi', status: 'Pending' },
    { name: 'Priyanka Sen', phone: '+91 98455 12041', city: 'Bangalore', status: 'Pending' },
    { name: 'Aditya Deshmukh', phone: '+91 91122 84902', city: 'Mumbai', status: 'Pending' },
    { name: 'Kavita Iyer', phone: '+91 88764 90212', city: 'Chennai', status: 'Pending' }
  ];

  // Campaign dialer simulation
  const handleTriggerDialer = async () => {
    setIsDialing(true);
    setDialProgress(0);
    
    // Simulate dialing visually
    const interval = setInterval(() => {
      setDialProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 300);

    try {
      const activeAgentId = selectedDialerAgentId || (agents[0] ? agents[0].id : '');
      const res = await fetch('/api/dialer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: activeAgentId,
          leads: mockLeads
        })
      });
      
      // Stop interval and complete progress
      clearInterval(interval);
      setDialProgress(100);
      
      if (res.ok) {
        setTimeout(() => {
          setIsDialing(false);
          setUploadedFileName('');
          setParsedLeadsCount(0);
          onRefreshAgents();
          alert('Automated campaign dialing complete! Gemini has successfully generated dynamic call log conversations for all lead contacts. View them in the Call History or Live Analytics feed.');
        }, 1000);
      } else {
        alert('Dialer server returned an error. Please try again.');
        setIsDialing(false);
      }
    } catch (err) {
      console.error('Failed to trigger dialer campaign:', err);
      clearInterval(interval);
      setIsDialing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFileName(e.dataTransfer.files[0].name);
      setParsedLeadsCount(4);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
      setParsedLeadsCount(4);
    }
  };

  // Filtered agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          agent.useCase.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || agent.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Dynamic calculations for real-time analytics
  const totalCalls = agents.reduce((sum, a) => sum + (a.callsCount || 0), 0);
  const totalMinutes = agents.reduce((sum, a) => sum + (a.minutesCount || 0), 0);
  const avgSuccessRate = agents.length > 0 ? Math.round(agents.reduce((sum, a) => sum + (a.successRate || 0), 0) / agents.length * 10) / 10 : 0;
  const estSavings = totalCalls * 5;

  // Recharts mock analytics data
  const weeklyTrendData = [
    { day: 'Mon', calls: Math.max(20, Math.round(totalCalls * 0.12)), minutes: Math.max(40, Math.round(totalMinutes * 0.12)) },
    { day: 'Tue', calls: Math.max(30, Math.round(totalCalls * 0.15)), minutes: Math.max(60, Math.round(totalMinutes * 0.15)) },
    { day: 'Wed', calls: Math.max(25, Math.round(totalCalls * 0.13)), minutes: Math.max(50, Math.round(totalMinutes * 0.13)) },
    { day: 'Thu', calls: Math.max(45, Math.round(totalCalls * 0.18)), minutes: Math.max(90, Math.round(totalMinutes * 0.18)) },
    { day: 'Fri', calls: Math.max(50, Math.round(totalCalls * 0.20)), minutes: Math.max(100, Math.round(totalMinutes * 0.20)) },
    { day: 'Sat', calls: Math.max(65, Math.round(totalCalls * 0.25)), minutes: Math.max(130, Math.round(totalMinutes * 0.25)) },
    { day: 'Sun', calls: Math.max(35, Math.round(totalCalls * 0.17)), minutes: Math.max(70, Math.round(totalMinutes * 0.17)) }
  ];

  const successRateData = agents.length > 0 
    ? agents.map(agent => ({ name: agent.name, rate: agent.successRate || 0 }))
    : [
        { name: 'Taj Stay', rate: 94 },
        { name: 'Arogya Clinic', rate: 92 },
        { name: 'Chai Tapri', rate: 88 }
      ];

  return (
    <div id="dashboard-wrapper" className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col md:flex-row font-sans">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-zinc-950 border-r border-zinc-900/80 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3 py-1">
            <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center glow-accent">
              <PhoneCall className="h-4.5 w-4.5 text-black stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold font-display text-white tracking-tight flex items-center gap-1">
              Tera <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-500 font-sans px-2 py-0.5 rounded-full font-medium">Console</span>
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 gap-2 md:gap-0">
            {[
              { id: 'agents', label: 'AI Voice Agents', icon: Mic },
              { id: 'campaigns', label: 'Outbound Dialer', icon: PhoneCall },
              { id: 'analytics', label: 'Live Analytics', icon: BarChart2 },
              { id: 'billing', label: 'Billing & Quotas', icon: FileText },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === item.id 
                      ? 'bg-accent text-zinc-950 font-bold shadow-md shadow-accent/10' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 stroke-[2]" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User block */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col gap-4 mt-6 md:mt-0">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-[#1A1A22] border border-zinc-800 flex items-center justify-center text-sm font-bold text-accent font-display">
              RM
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Raj Malhotra</h4>
              <p className="text-[10px] text-zinc-500 font-mono">Owner Account</p>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full py-2.5 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN MAIN AREA */}
      <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-7xl">
        
        {/* TOP BAR / CONTROL HEADERS */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-zinc-900">
          
          {/* Org Selector Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="flex items-center gap-2.5 bg-zinc-950 border border-zinc-800/80 px-4 py-2.5 rounded-xl hover:border-zinc-700 hover:bg-zinc-900/40 transition-all text-sm font-semibold text-white cursor-pointer"
            >
              🏢 {activeOrg} <ChevronDown className="h-4 w-4 text-zinc-500" />
            </button>

            {showOrgDropdown && (
              <div className="absolute top-12 left-0 w-64 bg-[#121216] border border-zinc-800 rounded-xl shadow-2xl p-2 z-50 divide-y divide-zinc-900">
                {[
                  'Malhotra Group Enterprises',
                  'Taj Resorts Gurgaon Branch',
                  'Chai Tapri Bangalore Hub'
                ].map((org) => (
                  <button
                    key={org}
                    onClick={() => {
                      setActiveOrg(org);
                      setShowOrgDropdown(false);
                    }}
                    className="w-full text-left p-2.5 text-xs rounded-lg hover:bg-zinc-900/80 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {org}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick status display */}
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" /> Deployed Nodes: Live
            </span>
            <span>API Server: OK</span>
          </div>
        </div>

        {/* TAB 1: ACTIVE AGENTS LIST */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            
            {/* Searching Filters Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#121216] border border-zinc-800 p-4 rounded-xl">
              <div className="relative flex-grow max-w-md w-full">
                <Search className="absolute inset-y-0 left-0 pl-3.5 h-full w-9 text-zinc-500" />
                <input 
                  type="text"
                  placeholder="Search active agents or instructions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1A1A22] border border-zinc-800 rounded-xl py-2 pl-11 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-900">
                  {['All', 'Inbound', 'Outbound'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTypeFilter(filter as any)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        typeFilter === filter 
                          ? 'bg-accent text-zinc-950' 
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <button
                  onClick={onCreateAgentClick}
                  className="px-4 py-2.5 bg-accent hover:bg-accent-hover text-zinc-950 font-bold text-xs rounded-full flex items-center gap-1.5 transition-all shadow-md shadow-accent/15 cursor-pointer md:ml-auto"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[3]" /> Create Agent
                </button>
              </div>
            </div>

            {/* Grid of Agent Cards */}
            {filteredAgents.length === 0 ? (
              <div className="bg-[#121216]/40 border border-dashed border-zinc-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 mt-8">
                <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600 flex items-center justify-center mx-auto">
                  <Mic className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base font-display">No Voice Agents Found</h4>
                  <p className="text-zinc-500 text-xs mt-1">We couldn't find any neural agents matching your criteria. Spawn a fresh receptionist now.</p>
                </div>
                <button
                  onClick={onCreateAgentClick}
                  className="px-5 py-2.5 bg-accent text-zinc-950 font-bold text-xs rounded-full hover:bg-accent-hover transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[3]" /> Spawn First Agent
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredAgents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => onSelectAgent(agent)}
                    className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all cursor-pointer flex flex-col justify-between group relative hover:-translate-y-0.5"
                  >
                    <div>
                      {/* Badge Row */}
                      <div className="flex justify-between items-center mb-4">
                        <span className={`text-[9px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full border ${
                          agent.type === 'Inbound' 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}>
                          {agent.type}
                        </span>

                        <span className={`h-2.5 w-2.5 rounded-full ${agent.status === 'Live' ? 'bg-green-500' : 'bg-yellow-500'}`} title={`Agent status is ${agent.status}`} />
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors font-display">{agent.name}</h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{agent.useCase}</p>
                    </div>

                    {/* Stats metrics block */}
                    <div className="mt-8 pt-4 border-t border-zinc-900/80 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-sm font-bold text-white font-mono">{agent.callsCount}</div>
                        <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold mt-0.5">Calls</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white font-mono">{agent.minutesCount}m</div>
                        <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold mt-0.5">Duration</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-green-400 font-mono">{agent.successRate}%</div>
                        <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold mt-0.5">Success</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: OUTBOUND CAMPAIGNS & DIALER */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Campaign Dialer zone */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#121216] border border-zinc-800 rounded-2xl p-6 md:p-8">
                
                <div className="md:col-span-5 space-y-4">
                  <span className="text-accent text-[10px] uppercase font-mono font-semibold tracking-widest block">Mass Outbound Campaigns</span>
                  <h2 className="text-2xl font-bold font-display text-white">Dial Lead Contacts Automatically</h2>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Trigger bulk calling jobs for pre-admission qualifications or follow-up ratings. Upload your customer roster in standard CSV format, map variables, and launch.
                  </p>
                </div>

                {/* Interactive CSV drag zone */}
                <div className="md:col-span-7">
                  {uploadedFileName ? (
                    <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-6 text-center space-y-4">
                      <div className="flex items-center justify-center h-12 w-12 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full mx-auto">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-white text-xs font-bold font-mono">{uploadedFileName}</h4>
                        <p className="text-[10px] text-zinc-500 mt-1">Successfully parsed {parsedLeadsCount} prospective contacts.</p>
                      </div>

                      {isDialing ? (
                        <div className="space-y-2 max-w-xs mx-auto">
                          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                            <span>Dialing Progress</span>
                            <span>{dialProgress}%</span>
                          </div>
                          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                            <div className="bg-accent h-full rounded-full transition-all" style={{ width: `${dialProgress}%` }} />
                          </div>
                          <span className="text-[9px] text-zinc-500 block animate-pulse">Establishing sub-second WebSocket streams...</span>
                        </div>
                      ) : (
                        <div className="space-y-4 max-w-xs mx-auto">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-mono text-zinc-500 mb-1.5 font-semibold text-left">Select AI Agent to Dial</label>
                            <select
                              value={selectedDialerAgentId}
                              onChange={(e) => setSelectedDialerAgentId(e.target.value)}
                              className="w-full bg-[#1A1A22] border border-zinc-800 text-zinc-300 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-accent"
                            >
                              {agents.map(a => (
                                <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={handleTriggerDialer}
                            className="w-full justify-center py-2.5 bg-accent text-zinc-950 font-bold text-xs rounded-full hover:bg-accent-hover transition-all cursor-pointer inline-flex items-center gap-1.5"
                          >
                            Trigger Automated Dialer Job
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border border-dashed rounded-xl p-8 text-center space-y-4 transition-all relative ${
                        dragActive ? 'border-accent bg-accent/5' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/40'
                      }`}
                    >
                      <input 
                        type="file" 
                        accept=".csv"
                        onChange={handleFileInput}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <UploadCloud className="h-8 w-8 text-zinc-500 mx-auto" />
                      <div>
                        <p className="text-xs text-white font-bold">Drag and drop customer CSV list</p>
                        <p className="text-[10px] text-zinc-500 mt-1">Maximum size 10MB • Or click to choose file</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Parsed customer lead display */}
              {uploadedFileName && (
                <div className="bg-[#121216] border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-zinc-900 text-xs font-mono font-bold text-zinc-400">
                    Contacts Loaded to Dialer Buffer
                  </div>
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-zinc-950/50 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest border-b border-zinc-900">
                        <th className="p-3 pl-5">Lead Name</th>
                        <th className="p-3">Phone Line</th>
                        <th className="p-3">Region</th>
                        <th className="p-3 text-right pr-5">Job State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-zinc-300">
                      {mockLeads.map((lead, i) => (
                        <tr key={i}>
                          <td className="p-3 pl-5 font-bold text-white">{lead.name}</td>
                          <td className="p-3 font-mono">{lead.phone}</td>
                          <td className="p-3">{lead.city}</td>
                          <td className="p-3 text-right pr-5 text-accent font-semibold">
                            {isDialing && dialProgress < ((i + 1) * 25) ? (
                              <span className="text-yellow-500 font-mono animate-pulse">Calling...</span>
                            ) : isDialing ? (
                              <span className="text-green-400 font-mono flex items-center gap-1 justify-end">✓ Sent</span>
                            ) : (
                              <span className="text-zinc-500 font-mono">Queued</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: LIVE ANALYTICS (Recharts) */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            
            {/* Top Cards row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#121216] border border-zinc-800 rounded-xl p-5">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">Total Calls</span>
                <div className="text-2xl font-bold text-white mt-1.5 font-display">{totalCalls}</div>
                <div className="text-[10px] text-green-400 flex items-center gap-1 mt-1">
                  <span>+18%</span> vs past week
                </div>
              </div>

              <div className="bg-[#121216] border border-zinc-800 rounded-xl p-5">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">Minutes Consumed</span>
                <div className="text-2xl font-bold text-white mt-1.5 font-display">{totalMinutes}m</div>
                <div className="text-[10px] text-green-400 flex items-center gap-1 mt-1">
                  <span>+12%</span> vs past week
                </div>
              </div>

              <div className="bg-[#121216] border border-zinc-800 rounded-xl p-5">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">Avg Success Rate</span>
                <div className="text-2xl font-bold text-green-400 mt-1.5 font-display">{avgSuccessRate}%</div>
                <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-1">
                  98% Hinglish transcription score
                </div>
              </div>

              <div className="bg-[#121216] border border-zinc-800 rounded-xl p-5">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">Est Cost Saved</span>
                <div className="text-2xl font-bold text-white mt-1.5 font-display">₹{estSavings.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-accent flex items-center gap-1 mt-1">
                  Based on ₹5/call average
                </div>
              </div>
            </div>

            {/* Recharts Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Daily Call Volume LineChart */}
              <div className="lg:col-span-7 bg-[#121216] border border-zinc-800 p-6 rounded-xl space-y-4">
                <div>
                  <h4 className="font-bold text-white text-sm font-display">Daily Automated Call Traffic</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Track inbound and outbound volumes.</p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F1F27" />
                      <XAxis dataKey="day" stroke="#71717A" fontSize={11} tickLine={false} />
                      <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#121216', borderColor: '#27272A', color: '#F3F4F6' }} />
                      <Line type="monotone" dataKey="calls" stroke="#14B8A6" strokeWidth={2.5} activeDot={{ r: 6 }} name="Completed Calls" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Agent Success Rate BarChart */}
              <div className="lg:col-span-5 bg-[#121216] border border-zinc-800 p-6 rounded-xl space-y-4">
                <div>
                  <h4 className="font-bold text-white text-sm font-display">Success Index by AI Agent</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Booking and scheduling resolution percentages.</p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={successRateData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F1F27" />
                      <XAxis dataKey="name" stroke="#71717A" fontSize={10} tickLine={false} />
                      <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#121216', borderColor: '#27272A', color: '#F3F4F6' }} />
                      <Bar dataKey="rate" fill="#14B8A6" radius={[4, 4, 0, 0]} name="Success %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: BILLING & LIMITS */}
        {activeTab === 'billing' && <BillingPage />}

        {/* TAB 5: WORKSPACE SETTINGS */}
        {activeTab === 'settings' && <SettingsPage />}

      </main>
    </div>
  );
}
