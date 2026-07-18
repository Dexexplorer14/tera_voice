/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Agent } from './types';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import CreateAgentFlow from './components/CreateAgentFlow';
import AgentDetailPage from './components/AgentDetailPage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<string>('landing');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Dynamic Refetcher
  const refetchAgents = async () => {
    try {
      const res = await fetch('/api/agents');
      if (res.ok) {
        const data = await res.json();
        setAgents(data);
      }
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    }
  };

  useEffect(() => {
    refetchAgents();
  }, []);

  // Whenever user logs in, ensure we pull freshest list
  useEffect(() => {
    if (isLoggedIn) {
      refetchAgents();
    }
  }, [isLoggedIn]);

  // Router dispatcher
  return (
    <div id="app-root" className="min-h-screen bg-[#0A0A0C] text-gray-100 overflow-x-hidden selection:bg-accent selection:text-zinc-950">
      {currentView === 'landing' && (
        <LandingPage 
          onNavigate={setCurrentView} 
          isLoggedIn={isLoggedIn}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentView('landing');
          }}
        />
      )}

      {currentView === 'auth' && (
        <AuthPage 
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setCurrentView('dashboard');
          }} 
          onNavigate={setCurrentView}
        />
      )}

      {currentView === 'dashboard' && isLoggedIn && (
        <Dashboard 
          agents={agents}
          onRefreshAgents={refetchAgents}
          onCreateAgentClick={() => setCurrentView('create-agent')}
          onSelectAgent={(agent) => {
            setSelectedAgent(agent);
            setCurrentView('agent-detail');
          }}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentView('landing');
          }}
        />
      )}

      {currentView === 'create-agent' && isLoggedIn && (
        <CreateAgentFlow 
          onCancel={() => setCurrentView('dashboard')}
          onSuccess={async (newAgentData) => {
            try {
              const res = await fetch('/api/agents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAgentData)
              });
              if (res.ok) {
                const createdAgent = await res.json();
                setAgents(prev => [createdAgent, ...prev]);
                setSelectedAgent(createdAgent);
                setCurrentView('agent-detail');
              }
            } catch (err) {
              console.error('Error creating voice agent:', err);
            }
          }}
        />
      )}

      {currentView === 'agent-detail' && isLoggedIn && selectedAgent && (
        <AgentDetailPage 
          agent={selectedAgent}
          onBack={() => {
            refetchAgents();
            setCurrentView('dashboard');
          }}
          onUpdateAgent={async (updatedAgent) => {
            try {
              const res = await fetch(`/api/agents/${updatedAgent.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedAgent)
              });
              if (res.ok) {
                const finalAgent = await res.json();
                setAgents(agents.map(a => a.id === finalAgent.id ? finalAgent : a));
                setSelectedAgent(finalAgent);
              }
            } catch (err) {
              console.error('Failed to update agent:', err);
            }
          }}
        />
      )}
    </div>
  );
}

