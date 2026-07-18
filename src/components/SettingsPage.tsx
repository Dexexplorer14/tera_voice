/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Users, 
  Key, 
  Trash2, 
  Check, 
  Copy, 
  Plus, 
  ShieldAlert, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { TeamMember } from '../types';

export default function SettingsPage() {
  const [orgName, setOrgName] = useState('Malhotra Hospitality & Clinics');
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'Admin' | 'Agent Builder'>('Agent Builder');
  const [apiKey, setApiKey] = useState('tera_live_8f0e2714c62d08a0d917f938d2');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/team');
      if (res.ok) {
        const data = await res.json();
        setTeam(data);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  React.useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;

    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMemberName,
          email: newMemberEmail,
          role: newMemberRole
        })
      });

      if (res.ok) {
        const added = await res.json();
        setTeam([...team, added]);
        setNewMemberName('');
        setNewMemberEmail('');
        triggerToast(`Added ${newMemberName} to team roster.`);
      }
    } catch (err) {
      console.error('Failed to add team member:', err);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/team/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setTeam(team.filter(m => m.id !== id));
        triggerToast(`Removed ${name} from team.`);
      }
    } catch (err) {
      console.error('Failed to delete team member:', err);
    }
  };

  const handleCopyKey = () => {
    setCopied(true);
    triggerToast('Copied API Key to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    const newKey = `tera_live_${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 12)}`;
    setApiKey(newKey);
    triggerToast('Successfully regenerated developer API key.');
  };

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div id="settings-container" className="space-y-8 font-sans text-gray-100 max-w-5xl mx-auto py-2 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1E24] border border-accent/20 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium">
          <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold font-display text-white">Workspace Settings</h1>
        <p className="text-sm text-zinc-400">Configure team access privileges, manage your developer credentials, and update organization records.</p>
      </div>

      {/* Grid of config components */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Org Details & Developer Keys */}
        <div className="lg:col-span-7 space-y-8">
          {/* General Org Details */}
          <div className="bg-[#121216] border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-900">
              <Settings className="h-5 w-5 text-accent" />
              <div>
                <h3 className="font-bold text-white text-base font-display">Organization Profile</h3>
                <p className="text-xs text-zinc-500">Edit your public business moniker and billing name.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Business Name</label>
                <input 
                  type="text" 
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full bg-[#1A1A22] border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-accent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Primary Sector</label>
                  <select className="w-full bg-[#1A1A22] border border-zinc-800 rounded-xl py-3 px-4 text-sm text-zinc-300 focus:outline-none focus:border-accent transition-all">
                    <option>Hospitality (Hotels / Resorts)</option>
                    <option>Healthcare (Clinics / Dental)</option>
                    <option>Education (Coaching Academies)</option>
                    <option>F&B (Cafes / Bakeries)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Currency Base</label>
                  <input 
                    type="text" 
                    disabled
                    value="INR (₹) - Indian Rupee" 
                    className="w-full bg-[#16161C] border border-zinc-900 rounded-xl py-3 px-4 text-sm text-zinc-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <button 
                onClick={() => triggerToast('Organization details updated.')}
                className="px-5 py-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 text-xs font-bold text-white transition-all cursor-pointer"
              >
                Save Details
              </button>
            </div>
          </div>

          {/* Developer API Keys */}
          <div className="bg-[#121216] border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-900">
              <Key className="h-5 w-5 text-accent" />
              <div>
                <h3 className="font-bold text-white text-base font-display">Developer API Keys</h3>
                <p className="text-xs text-zinc-500">Authenticate call detail integrations and webhook requests.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-950/60 rounded-xl p-4 border border-zinc-900">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Live Server Token</span>
                  <span className="text-xs text-green-400 font-medium">● ACTIVE</span>
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type={showKey ? "text" : "password"} 
                    readOnly
                    value={apiKey} 
                    className="flex-grow bg-transparent font-mono text-xs text-zinc-300 border-none outline-none focus:ring-0"
                  />
                  
                  <button 
                    onClick={() => setShowKey(!showKey)}
                    className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title={showKey ? "Hide key" : "Show key"}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>

                  <button 
                    onClick={handleCopyKey}
                    className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleRegenerateKey}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 rounded-full text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  Regenerate Token
                </button>
                <span className="text-[10px] text-zinc-500 max-w-xs leading-tight self-center">
                  Warning: Regenerating will invalidate any active external API sync endpoints.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Team Roster & Danger Zone */}
        <div className="lg:col-span-5 space-y-8">
          {/* Team Members */}
          <div className="bg-[#121216] border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-900">
              <Users className="h-5 w-5 text-accent" />
              <div>
                <h3 className="font-bold text-white text-base font-display">Team Access</h3>
                <p className="text-xs text-zinc-500">Manage members authorized to build AI agents.</p>
              </div>
            </div>

            {/* Current team roster list */}
            <div className="space-y-3 mb-6">
              {team.map((m) => (
                <div key={m.id} className="flex justify-between items-center bg-zinc-950/20 p-3 rounded-lg border border-zinc-900/60">
                  <div>
                    <h4 className="text-xs font-bold text-white">{m.name}</h4>
                    <p className="text-[10px] text-zinc-500">{m.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono uppercase font-semibold">
                      {m.role}
                    </span>
                    {m.role !== 'Owner' && (
                      <button 
                        onClick={() => handleDeleteMember(m.id, m.name)}
                        className="text-zinc-600 hover:text-red-400 transition-colors p-1 cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick add form */}
            <form onSubmit={handleAddMember} className="space-y-3 pt-4 border-t border-zinc-900/60">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Invite Member</span>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  required
                  placeholder="Full Name" 
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="bg-[#1A1A22] border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-accent transition-all"
                />
                <input 
                  type="email" 
                  required
                  placeholder="Email" 
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="bg-[#1A1A22] border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-accent transition-all"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as any)}
                  className="flex-grow bg-[#1A1A22] border border-zinc-800 rounded-lg py-2 px-3 text-xs text-zinc-300 focus:outline-none focus:border-accent"
                >
                  <option value="Admin">Admin (Access billing)</option>
                  <option value="Agent Builder">Agent Builder (No billing access)</option>
                </select>
                <button 
                  type="submit"
                  className="bg-accent hover:bg-accent-hover text-zinc-950 font-bold px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/5 border border-red-900/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4 text-red-400">
              <ShieldAlert className="h-5 w-5" />
              <h3 className="font-bold text-base font-display">Danger Zone</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Permanently delete this organization, disable all active virtual phone lines, and erase agent neural model configurations. This action cannot be undone.
            </p>
            <button 
              onClick={() => triggerToast('Deletion blocked in interactive demo mode.')}
              className="w-full py-2.5 rounded-lg border border-red-900/40 hover:bg-red-500/10 text-xs font-bold text-red-400 transition-all cursor-pointer"
            >
              Delete Organization
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
