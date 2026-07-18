/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Play, 
  Save, 
  Settings, 
  GitFork, 
  FileText, 
  Mic, 
  PhoneCall, 
  Sliders, 
  Check, 
  Database, 
  Sparkles, 
  HelpCircle,
  Clock,
  PhoneForwarded,
  X,
  Volume2,
  Trash2,
  Plus
} from 'lucide-react';
import { Agent, AgentNode, AgentEdge, CallLog } from '../types';

interface AgentDetailPageProps {
  agent: Agent;
  onBack: () => void;
  onUpdateAgent: (updatedAgent: Agent) => void;
}

export default function AgentDetailPage({ agent: initialAgent, onBack, onUpdateAgent }: AgentDetailPageProps) {
  const [agent, setAgent] = useState<Agent>(initialAgent);
  const [activeTab, setActiveTab] = useState<'workflow' | 'model' | 'test' | 'logs' | 'settings'>('workflow');
  
  // Workflow Builder states
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-greet');
  const [nodeConfigText, setNodeConfigText] = useState('');
  const [nodePromptText, setNodePromptText] = useState('');
  const [nodeTemp, setNodeTemp] = useState(0.4);
  const [nodePhone, setNodePhone] = useState('');
  const [nodeTool, setNodeTool] = useState('');

  // Call simulator states (Test Tab)
  const [isCalling, setIsCalling] = useState(false);
  const [callActiveTime, setCallActiveTime] = useState(0);
  const [simulatedTranscript, setSimulatedTranscript] = useState<{ role: 'user' | 'agent'; text: string; time: string }[]>([]);
  const [simulatedIndex, setSimulatedIndex] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Call Logs states
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [filterOutcome, setFilterOutcome] = useState<'All' | 'Completed' | 'Transferred' | 'Failed'>('All');
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);

  // Model Config States
  const [llmProvider, setLlmProvider] = useState(agent.llmProvider);
  const [llmModel, setLlmModel] = useState(agent.llmModel);
  const [ttsProvider, setTtsProvider] = useState(agent.ttsProvider);
  const [ttsVoice, setTtsVoice] = useState(agent.ttsVoice);
  const [sttProvider, setSttProvider] = useState(agent.sttProvider);
  const [apiKey, setApiKey] = useState('**********************');

  // Load call logs from server
  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/call-logs');
      if (res.ok) {
        const data = await res.json();
        setCallLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch call logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [agent.id]);

  // Sync state if initialAgent prop changes
  useEffect(() => {
    setAgent(initialAgent);
    setLlmProvider(initialAgent.llmProvider);
    setLlmModel(initialAgent.llmModel);
    setTtsProvider(initialAgent.ttsProvider);
    setTtsVoice(initialAgent.ttsVoice);
    setSttProvider(initialAgent.sttProvider);
  }, [initialAgent]);

  // Handle selected node loading into right-panel controls
  useEffect(() => {
    if (selectedNodeId) {
      const node = agent.nodes.find(n => n.id === selectedNodeId);
      if (node) {
        setNodeConfigText(node.config.text || '');
        setNodePromptText(node.config.systemPrompt || '');
        setNodeTemp(node.config.temperature !== undefined ? node.config.temperature : 0.4);
        setNodePhone(node.config.phoneNumber || '');
        setNodeTool(node.config.toolName || '');
      }
    }
  }, [selectedNodeId, agent.nodes]);

  // Save specific Node properties
  const handleSaveNodeProperties = () => {
    if (!selectedNodeId) return;
    
    const updatedNodes = agent.nodes.map(node => {
      if (node.id === selectedNodeId) {
        const updatedConfig = { ...node.config };
        if (node.type === 'greeting' || node.type === 'end') updatedConfig.text = nodeConfigText;
        if (node.type === 'agent') {
          updatedConfig.systemPrompt = nodePromptText;
          updatedConfig.temperature = nodeTemp;
        }
        if (node.type === 'transfer') updatedConfig.phoneNumber = nodePhone;
        if (node.type === 'tool') updatedConfig.toolName = nodeTool;

        return { ...node, config: updatedConfig };
      }
      return node;
    });

    const updatedAgent = { ...agent, nodes: updatedNodes };
    setAgent(updatedAgent);
    onUpdateAgent(updatedAgent);
    triggerAlert('Node configuration saved successfully.');
  };

  // Node adding
  const handleAddNode = (nodeType: AgentNode['type']) => {
    const newId = `node-${Date.now()}`;
    const titles = {
      greeting: 'Greeting Prompt',
      agent: 'Conversational LLM Node',
      condition: 'Branching Fork',
      tool: 'API Webhook Trigger',
      transfer: 'Call Forwarder',
      end: 'Terminate Connection',
      start: 'Trigger Source'
    };

    const newX = 400 + Math.random() * 50;
    const newY = 200 + Math.random() * 50;

    const newNode: AgentNode = {
      id: newId,
      type: nodeType,
      title: titles[nodeType],
      description: `Custom ${nodeType} action`,
      x: newX,
      y: newY,
      config: nodeType === 'agent' 
        ? { systemPrompt: 'Speak concisely...', temperature: 0.5 }
        : nodeType === 'greeting' || nodeType === 'end' 
          ? { text: 'Hello! How can I help?' } 
          : {}
    };

    const updatedAgent = { ...agent, nodes: [...agent.nodes, newNode] };
    setAgent(updatedAgent);
    onUpdateAgent(updatedAgent);
    setSelectedNodeId(newId);
    triggerAlert(`Created new ${nodeType} node.`);
  };

  const handleDeleteNode = (id: string) => {
    if (id === 'node-start' || id === 'node-greet') {
      triggerAlert('Cannot delete default starter nodes.');
      return;
    }
    const updatedNodes = agent.nodes.filter(n => n.id !== id);
    const updatedEdges = agent.edges.filter(e => e.from !== id && e.to !== id);
    const updatedAgent = { ...agent, nodes: updatedNodes, edges: updatedEdges };
    setAgent(updatedAgent);
    onUpdateAgent(updatedAgent);
    setSelectedNodeId(null);
    triggerAlert('Deleted node.');
  };

  // Status toggle (Draft/Live)
  const toggleAgentStatus = () => {
    const updated = { ...agent, status: agent.status === 'Live' ? 'Draft' : 'Live' as any };
    setAgent(updated);
    onUpdateAgent(updated);
  };

  // Inline name save
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...agent, name: e.target.value };
    setAgent(updated);
    onUpdateAgent(updated);
  };

  // Save General configs
  const handleSaveModelConfig = () => {
    const updated = {
      ...agent,
      llmProvider,
      llmModel,
      ttsProvider,
      ttsVoice,
      sttProvider
    };
    setAgent(updated);
    onUpdateAgent(updated);
    triggerAlert('Model provider parameters updated.');
  };

  // Conversation simulator script based on agent context
  const fullSimulationScripts = {
    'Taj Stay Assistant': [
      { role: 'agent', text: 'Namaste! Welcome to Taj Vivanta. My name is Maya. How can I help you book your stay today?', time: '0:03' },
      { role: 'user', text: 'Haan Maya, mujhe kal ke liye 1 room chahiye deluxe waala.', time: '0:12' },
      { role: 'agent', text: 'Aapka kal yaani July 18th ke liye ek Deluxe Room book karna hai. Haan ji, bilkul ho jayega. Room rate hai ₹12,000 per night plus GST. Kya main aapke naam par block kar doon?', time: '0:31' },
      { role: 'user', text: 'Haan book kar dijiye. Name is Akash Gupta.', time: '0:42' },
      { role: 'agent', text: 'Dhanyawad Akash Gupta ji! Maine deluxe room block kar diya hai. Ab main call transfer kar rahi hoon hamare payment desk par, taaki booking confirm ho sake. Have a great stay!', time: '1:02' }
    ],
    'Arogya Dental Reception': [
      { role: 'agent', text: 'Pranam! Arogya Dental Clinic mein aapka swagat hai. Main Dr. Sharma ki AI assistant Bol rahi hoon. Aaj aapko kis samasya ke liye appointment chahiye?', time: '0:04' },
      { role: 'user', text: 'Mera danta bohot dukh raha hai. Dr. Sharma kal mil sakte hain kya?', time: '0:15' },
      { role: 'agent', text: 'Daant me dard hai? Main samajh sakti hoon ye bohot uncomfortable hota hai. Dr. Sharma kal bilkul free hain. Kal subah 11 baje ya shaam 4 baje, kaunsa time convenient rahega?', time: '0:32' },
      { role: 'user', text: 'Kal shaam ko 4 baje theek rahega. Name Amit Verma.', time: '0:43' },
      { role: 'agent', text: 'Great, Amit Verma ji! Maine kal shaam 4 baje Dr. Sharma ke saath aapka slot confirm kar diya hai. SMS par prescription aur timing receipt bhej di gayi hai. Dhanyawad!', time: '1:01' }
    ],
    'default': [
      { role: 'agent', text: 'Hello! I am your custom voice agent. How can I assist your business today?', time: '0:03' },
      { role: 'user', text: 'I want to see if your low latency call handles speech recognition well.', time: '0:11' },
      { role: 'agent', text: 'Absolutely! Our server-side voice stream guarantees response times under 800 milliseconds, custom fitted for any Hinglish regional accent.', time: '0:22' },
      { role: 'user', text: 'That sounds amazing and very fast.', time: '0:28' },
      { role: 'agent', text: 'Thank you! Let me know if you would like to deploy this agent on an active Indian virtual line now.', time: '0:38' }
    ]
  };

  // Web Call simulator trigger
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCalling) {
      timer = setInterval(() => {
        setCallActiveTime(prev => prev + 1);
      }, 1000);
    } else {
      setCallActiveTime(0);
    }
    return () => clearInterval(timer);
  }, [isCalling]);

  // Audio simulation typist (used only as background feedback if preferred, or disabled in favor of real interactive chat)
  useEffect(() => {
    if (isCalling && simulatedTranscript.length === 1 && simulatedIndex === 0) {
      // We start with greeting, then let user interact
    }
  }, [isCalling]);

  const handleStartWebCall = () => {
    setIsCalling(true);
    setSimulatedIndex(0);
    const greetingNode = agent.nodes.find(n => n.type === 'greeting');
    const greetingText = greetingNode?.config?.text || 'Hello! Welcome. How can I assist you today?';
    setSimulatedTranscript([{ role: 'agent', text: greetingText, time: '0:03' }]);
  };

  const handleEndWebCall = async () => {
    setIsCalling(false);
    if (simulatedTranscript.length > 1) {
      try {
        await fetch('/api/call-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentId: agent.id,
            duration: `${Math.floor(callActiveTime / 60)}m ${callActiveTime % 60}s`,
            outcome: 'Completed',
            callerNumber: '+91 Web Playground',
            transcript: simulatedTranscript
          })
        });
        fetchLogs();
        triggerAlert('Call session successfully stored in logs.');
      } catch (err) {
        console.error('Failed to save log:', err);
      }
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isTyping) return;
    const userText = chatInput.trim();
    const formattedTime = `${Math.floor(callActiveTime / 60)}:${(callActiveTime % 60).toString().padStart(2, '0')}`;
    const userMsg = { role: 'user' as const, text: userText, time: formattedTime };
    const updated = [...simulatedTranscript, userMsg];
    setSimulatedTranscript(updated);
    setChatInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          messages: updated
        })
      });
      if (res.ok) {
        const data = await res.json();
        const responseTime = `${Math.floor((callActiveTime + 1) / 60)}:${((callActiveTime + 1) % 60).toString().padStart(2, '0')}`;
        setSimulatedTranscript(prev => [...prev, {
          role: 'agent' as const,
          text: data.text,
          time: responseTime
        }]);
      }
    } catch (err) {
      console.error('Error during chatbot simulation:', err);
    } finally {
      setIsTyping(false);
    }
  };

  // Toast notifications helper
  const [toastAlert, setToastAlert] = useState('');
  const triggerAlert = (msg: string) => {
    setToastAlert(msg);
    setTimeout(() => setToastAlert(''), 3000);
  };

  return (
    <div id="agent-detail-container" className="space-y-8 font-sans text-gray-100 relative">
      {/* Toast */}
      {toastAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1E24] border border-accent/20 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium">
          <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
          <span>{toastAlert}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="h-10 w-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                value={agent.name}
                onChange={handleNameChange}
                className="text-2xl md:text-3xl font-extrabold font-display text-white bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-accent focus:outline-none transition-all py-0.5 max-w-sm"
              />
              <span className={`text-[10px] uppercase font-mono tracking-wider font-semibold px-2.5 py-0.5 rounded-full border ${
                agent.type === 'Inbound' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
              }`}>
                {agent.type}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">{agent.useCase} • Primary: <span className="font-mono text-zinc-300">{agent.language}</span></p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-4">
          {/* Status Live Toggle */}
          <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-full border border-zinc-800">
            <button
              onClick={toggleAgentStatus}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${agent.status === 'Draft' ? 'bg-zinc-800 text-zinc-400 font-bold' : 'text-zinc-600'}`}
            >
              Draft
            </button>
            <button
              onClick={toggleAgentStatus}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${agent.status === 'Live' ? 'bg-accent text-zinc-950 font-extrabold shadow-md shadow-accent/20' : 'text-zinc-600'}`}
            >
              Live
            </button>
          </div>

          <button
            onClick={() => {
              setActiveTab('test');
              handleStartWebCall();
            }}
            className="px-5 py-2.5 bg-accent/15 border border-accent/30 hover:bg-accent hover:text-zinc-950 text-accent font-bold text-sm rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-accent/5"
          >
            <Play className="h-4 w-4 fill-current text-current" /> Test Agent
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-zinc-900 gap-1 overflow-x-auto">
        {[
          { id: 'workflow', label: 'Workflow Builder', icon: GitFork },
          { id: 'model', label: 'Model Configuration', icon: Sliders },
          { id: 'test', label: 'Test Agent Tool', icon: Mic },
          { id: 'logs', label: 'Call History Logs', icon: FileText },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id 
                  ? 'border-accent text-accent font-bold bg-accent/5' 
                  : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[450px]">
        
        {/* WORKFLOW BUILDER TAB */}
        {activeTab === 'workflow' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Node Drawer Panel */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-[#121216] border border-zinc-800 rounded-xl p-5">
                <h3 className="font-bold text-white text-sm font-display mb-1">Canvas Nodes</h3>
                <p className="text-xs text-zinc-500 mb-4">Click to spawn modular connected nodes onto the workflow graph.</p>

                <div className="space-y-2.5">
                  {[
                    { type: 'greeting', title: 'Greeting', desc: 'Starting welcome message', icon: PhoneCall },
                    { type: 'agent', title: 'Conversational Node', desc: 'AI agent instruction core', icon: Sparkles },
                    { type: 'tool', title: 'Webhook API', desc: 'Trigger calendar or SQL', icon: Database },
                    { type: 'transfer', title: 'Transfer Call', desc: 'Forward to human team', icon: PhoneForwarded },
                    { type: 'end', title: 'End Connection', desc: 'Terminate ongoing call', icon: X }
                  ].map((btn) => {
                    const Icon = btn.icon;
                    return (
                      <button
                        key={btn.type}
                        onClick={() => handleAddNode(btn.type as any)}
                        className="w-full p-3 rounded-xl bg-zinc-950/50 border border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/40 text-left transition-all flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-accent group-hover:border-accent flex items-center justify-center transition-colors">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-accent transition-colors">{btn.title}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">{btn.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Middle Workflow SVG Grid Canvas */}
            <div className="lg:col-span-6 bg-[#0E0E12] border border-zinc-800/80 rounded-xl relative overflow-hidden h-[500px] flex flex-col justify-between">
              
              {/* Grid Background Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181F_1px,transparent_1px),linear-gradient(to_bottom,#18181F_1px,transparent_1px)] bg-[size:24px_24px] opacity-60 pointer-events-none" />
              
              <div className="absolute top-3 left-3 bg-zinc-950/90 border border-zinc-900 px-3 py-1 rounded-full text-[10px] font-mono text-zinc-400 flex items-center gap-2 z-10">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                Interactive Visual Tree Canvas • Click Nodes to edit
              </div>

              {/* Connected Canvas container */}
              <div className="relative flex-grow overflow-auto p-6 flex items-center justify-center">
                
                {/* SVG Connecting lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 2 L 8 5 L 0 8 z" fill="#3F3F46" />
                    </marker>
                    <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 2 L 8 5 L 0 8 z" fill="#14B8A6" />
                    </marker>
                  </defs>

                  {agent.edges.map((edge) => {
                    const fromNode = agent.nodes.find(n => n.id === edge.from);
                    const toNode = agent.nodes.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;

                    // Approximate center points for neat connectors
                    const x1 = fromNode.x + 150;
                    const y1 = fromNode.y + 35;
                    const x2 = toNode.x;
                    const y2 = toNode.y + 35;

                    // Curved Bezier line path
                    const dx = Math.abs(x2 - x1) * 0.4;
                    const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                    const isEdgeActive = selectedNodeId === edge.from || selectedNodeId === edge.to;

                    return (
                      <g key={edge.id}>
                        <path 
                          d={pathD} 
                          fill="none" 
                          stroke={isEdgeActive ? "#14B8A6" : "#27272A"} 
                          strokeWidth={isEdgeActive ? 2 : 1.5} 
                          markerEnd={`url(#${isEdgeActive ? 'arrow-active' : 'arrow'})`}
                          className="transition-all"
                        />
                        {edge.label && (
                          <foreignObject 
                            x={(x1 + x2) / 2 - 45} 
                            y={(y1 + y2) / 2 - 11} 
                            width="90" 
                            height="22"
                          >
                            <div className="bg-zinc-950 border border-zinc-900 text-[8px] font-mono font-bold text-zinc-400 text-center py-0.5 rounded-full shadow-lg truncate px-1">
                              {edge.label}
                            </div>
                          </foreignObject>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Nodes rendering layer */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {agent.nodes.map((node) => {
                    const isSelected = selectedNodeId === node.id;
                    return (
                      <div
                        key={node.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNodeId(node.id);
                        }}
                        style={{ left: node.x, top: node.y }}
                        className={`absolute w-44 p-3 rounded-xl border bg-[#111115] hover:bg-[#15151D] text-left cursor-pointer pointer-events-auto transition-all ${
                          isSelected 
                            ? 'border-accent ring-1 ring-accent shadow-lg shadow-accent/5 scale-102 z-20' 
                            : 'border-zinc-800'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[8px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                            node.type === 'start' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            node.type === 'greeting' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            node.type === 'agent' ? 'bg-accent/10 text-accent border border-accent/20' :
                            node.type === 'transfer' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                            'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}>
                            {node.type}
                          </span>
                          
                          {node.id !== 'node-start' && node.id !== 'node-greet' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNode(node.id);
                              }}
                              className="text-zinc-600 hover:text-red-400 p-0.5 transition-colors"
                              title="Delete node"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">{node.title}</h4>
                        <p className="text-[10px] text-zinc-500 truncate mt-0.5">{node.description}</p>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Status footer inside canvas */}
              <div className="bg-zinc-950 p-3.5 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-500 z-10">
                <span>Active Edges: {agent.edges.length}</span>
                <span>Active Nodes: {agent.nodes.length}</span>
              </div>
            </div>

            {/* Right Node Configuration Side Panel */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {selectedNodeId ? (
                  <motion.div
                    key={selectedNodeId}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="bg-[#121216] border border-zinc-800 rounded-xl p-5 space-y-5"
                  >
                    {(() => {
                      const selectedNode = agent.nodes.find(n => n.id === selectedNodeId);
                      if (!selectedNode) return <p className="text-xs text-zinc-500">No node found.</p>;
                      
                      return (
                        <>
                          <div className="border-b border-zinc-900 pb-3">
                            <span className="text-[9px] font-mono text-accent uppercase tracking-widest font-semibold">Node properties</span>
                            <h3 className="font-bold text-white text-base font-display mt-0.5">{selectedNode.title}</h3>
                          </div>

                          {/* Greeting Node & End Node Config */}
                          {(selectedNode.type === 'greeting' || selectedNode.type === 'end') && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Vocal Text Output</label>
                                <textarea
                                  rows={4}
                                  value={nodeConfigText}
                                  onChange={(e) => setNodeConfigText(e.target.value)}
                                  className="w-full bg-[#1A1A22] border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-accent font-sans"
                                  placeholder="Type words spoken by your agent..."
                                />
                                <span className="text-[9px] text-zinc-500 mt-1 block">This exact string will be Synthesized in the configured voice.</span>
                              </div>
                            </div>
                          )}

                          {/* Agent LLM Node Config */}
                          {selectedNode.type === 'agent' && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Neural System Prompt</label>
                                <textarea
                                  rows={5}
                                  value={nodePromptText}
                                  onChange={(e) => setNodePromptText(e.target.value)}
                                  className="w-full bg-[#1A1A22] border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-accent font-mono text-[10px]"
                                  placeholder="System rules for this branch..."
                                />
                                <span className="text-[9px] text-zinc-500 mt-1 block">Contextual boundaries for the generative LLM execution.</span>
                              </div>

                              <div>
                                <div className="flex justify-between items-center mb-1.5">
                                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Temperature</label>
                                  <span className="text-xs font-mono font-bold text-accent">{nodeTemp}</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.1"
                                  value={nodeTemp}
                                  onChange={(e) => setNodeTemp(parseFloat(e.target.value))}
                                  className="w-full accent-accent bg-zinc-900"
                                />
                                <div className="flex justify-between text-[8px] text-zinc-500 font-mono mt-1">
                                  <span>DETERMINISTIC</span>
                                  <span>CREATIVE</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Transfer Call Node Config */}
                          {selectedNode.type === 'transfer' && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Forward Telephone Number</label>
                                <input
                                  type="text"
                                  value={nodePhone}
                                  onChange={(e) => setNodePhone(e.target.value)}
                                  placeholder="+91 99999 99999"
                                  className="w-full bg-[#1A1A22] border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-accent font-mono"
                                />
                                <span className="text-[9px] text-zinc-500 mt-1 block">Standard Indian ISD formats supported.</span>
                              </div>
                            </div>
                          )}

                          {/* Tool API Node Config */}
                          {selectedNode.type === 'tool' && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Sync Webhook integration</label>
                                <select
                                  value={nodeTool}
                                  onChange={(e) => setNodeTool(e.target.value)}
                                  className="w-full bg-[#1A1A22] border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 focus:outline-none focus:border-accent"
                                >
                                  <option value="">Select calendar/API action</option>
                                  <option value="SyncToGoogleCalendar">SyncToGoogleCalendar</option>
                                  <option value="PostgreSQLDbLogger">PostgreSQLDbLogger</option>
                                  <option value="RazorpayPaymentLink">RazorpayPaymentLink</option>
                                </select>
                                <span className="text-[9px] text-zinc-500 mt-1 block">Executed asynchronously in real-time.</span>
                              </div>
                            </div>
                          )}

                          {/* Default Start Node config */}
                          {selectedNode.type === 'start' && (
                            <div className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-xl text-center">
                              <PhoneCall className="h-6 w-6 text-green-500 mx-auto mb-2" />
                              <p className="text-xs text-zinc-400">This node initiates when the incoming call establishes. No parameters needed.</p>
                            </div>
                          )}

                          {selectedNode.type !== 'start' && (
                            <button
                              onClick={handleSaveNodeProperties}
                              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Save className="h-3.5 w-3.5 text-accent" /> Save Node Properties
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </motion.div>
                ) : (
                  <div className="bg-[#121216]/50 border border-dashed border-zinc-800 rounded-xl p-6 text-center text-zinc-500">
                    <Sliders className="h-6 w-6 mx-auto mb-2 text-zinc-600" />
                    <p className="text-xs">Click any node on the graph canvas to configure its AI properties.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        )}

        {/* MODEL CONFIGURATION TAB */}
        {activeTab === 'model' && (
          <div className="bg-[#121216] border border-zinc-800 rounded-xl p-6 md:p-8 max-w-4xl mx-auto space-y-8">
            <div className="pb-4 border-b border-zinc-900">
              <h3 className="text-lg font-bold text-white font-display">Model & Neural Providers</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Configure LLM providers, Speech-to-Text transcription models, and vocal synthetics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* LLM Column */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block">1. LLM Brain Provider</span>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase">Provider</label>
                  <select 
                    value={llmProvider}
                    onChange={(e) => setLlmProvider(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 focus:outline-none focus:border-accent"
                  >
                    <option value="Google Gemini">Google Gemini</option>
                    <option value="OpenAI">OpenAI</option>
                    <option value="Groq">Groq</option>
                    <option value="Azure">Microsoft Azure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase">Intelligence Model</label>
                  <select 
                    value={llmModel}
                    onChange={(e) => setLlmModel(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 focus:outline-none focus:border-accent font-mono"
                  >
                    {llmProvider === 'Google Gemini' && (
                      <>
                        <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                        <option value="gemini-2.5-pro">gemini-2.5-pro</option>
                      </>
                    )}
                    {llmProvider === 'OpenAI' && (
                      <>
                        <option value="gpt-4o-mini">gpt-4o-mini</option>
                        <option value="gpt-4o">gpt-4o</option>
                      </>
                    )}
                    {llmProvider === 'Groq' && (
                      <>
                        <option value="llama-3.3-70b">llama-3.3-70b</option>
                        <option value="mixtral-8x7b">mixtral-8x7b</option>
                      </>
                    )}
                    {llmProvider !== 'Google Gemini' && llmProvider !== 'OpenAI' && llmProvider !== 'Groq' && (
                      <option value="custom-model">custom-deployment-v1</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase">Workspace Token</label>
                  <input 
                    type="password" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-zinc-800 rounded-lg p-3 text-xs text-zinc-500 focus:outline-none focus:border-accent font-mono"
                  />
                </div>
              </div>

              {/* TTS Column */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block">2. Text-To-Speech Synthesizer</span>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase">Synthesis Provider</label>
                  <select 
                    value={ttsProvider}
                    onChange={(e) => setTtsProvider(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 focus:outline-none focus:border-accent"
                  >
                    <option value="Deepgram">Deepgram Aura</option>
                    <option value="ElevenLabs">ElevenLabs (High Fidelity)</option>
                    <option value="OpenAI">OpenAI TTS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase">Vocal Voice Preset</label>
                  <select 
                    value={ttsVoice}
                    onChange={(e) => setTtsVoice(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 focus:outline-none focus:border-accent"
                  >
                    {ttsProvider === 'Deepgram' ? (
                      <>
                        <option value="aura-asteria-en">Aura Asteria (Indian Accent Female)</option>
                        <option value="aura-stella-en">Aura Stella (Warm Hinglish Female)</option>
                        <option value="aura-orion-en">Aura Orion (Professional Indian Male)</option>
                      </>
                    ) : (
                      <>
                        <option value="Rachel (Indian Accent)">Rachel (Empathetic Female)</option>
                        <option value="Drew (Professional Indian Male)">Drew (Executive Male)</option>
                        <option value="Aditi (Pure Hindi)">Aditi (Clear Hindi Female)</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-accent" />
                    <span className="text-xs text-zinc-300 font-medium">Test {ttsVoice.split(' ')[0]}</span>
                  </div>
                  <button 
                    onClick={() => triggerAlert(`Auditory vocal playback simulated.`)}
                    className="text-[10px] font-mono uppercase tracking-widest font-bold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded text-white cursor-pointer"
                  >
                    Listen Preview
                  </button>
                </div>
              </div>

              {/* STT Column */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block">3. Speech-To-Text Transcriber</span>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase">Transcription Provider</label>
                  <select 
                    value={sttProvider}
                    onChange={(e) => setSttProvider(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 focus:outline-none focus:border-accent"
                  >
                    <option value="Deepgram">Deepgram Nova-2 (Recommended)</option>
                    <option value="OpenAI Whisper">OpenAI Whisper (Large-v3)</option>
                    <option value="Google">Google Cloud Speech-to-Text</option>
                  </select>
                </div>

                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-900 space-y-2">
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Hinglish Accented Phonemes</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    Transcription handles phonetics like "karna", "chalega", "appointment", and clinic terms with 98.4% contextual score.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveModelConfig}
              className="px-6 py-3 rounded-full bg-accent text-zinc-950 font-bold text-sm hover:bg-accent-hover transition-all flex items-center gap-2 shadow-lg shadow-accent/15 cursor-pointer ml-auto"
            >
              <Check className="h-4 w-4 stroke-[2.5]" /> Update Provider Config
            </button>
          </div>
        )}

        {/* TEST AGENT TAB */}
        {activeTab === 'test' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            {/* Call Actions Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#121216] border border-zinc-800 rounded-xl p-6 text-center space-y-6">
                <div>
                  <span className="text-accent text-[10px] uppercase tracking-widest font-mono font-semibold block">Browser Simulator</span>
                  <h3 className="font-bold text-white text-lg font-display mt-1">Simulate Real Web Call</h3>
                  <p className="text-xs text-zinc-500 mt-1">Make a mock telephone test directly in your browser. Audio streams over WebSockets.</p>
                </div>

                {isCalling ? (
                  <div className="space-y-6">
                    {/* Animated Ripple Wave */}
                    <div className="flex items-center justify-center h-28 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="h-14 w-14 rounded-full bg-accent/20 border border-accent/30 animate-ping absolute" />
                        <span className="h-20 w-20 rounded-full bg-accent/10 border border-accent/20 animate-pulse absolute" />
                      </div>
                      <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center glow-accent-strong relative z-10">
                        <Mic className="h-6 w-6 text-zinc-950 stroke-[2.5]" />
                      </div>
                    </div>

                    <div className="text-center font-mono space-y-1">
                      <div className="text-xs text-green-400 font-semibold tracking-widest">CALL ACTIVE</div>
                      <div className="text-2xl font-bold text-white">
                        {Math.floor(callActiveTime / 60)}:{(callActiveTime % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="text-[9px] text-zinc-500">Latency: ~340ms • TTS: {agent.ttsVoice.split(' ')[0]}</div>
                    </div>

                    <button
                      onClick={handleEndWebCall}
                      className="w-full py-3 bg-red-500 text-white font-bold text-sm rounded-full hover:bg-red-600 transition-all cursor-pointer shadow-lg shadow-red-500/15"
                    >
                      End Connection
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="h-28 bg-zinc-950/40 rounded-xl border border-zinc-900 flex items-center justify-center">
                      <PhoneCall className="h-10 w-10 text-zinc-700" />
                    </div>

                    <button
                      onClick={handleStartWebCall}
                      className="w-full py-3.5 bg-accent text-zinc-950 font-extrabold text-sm rounded-full hover:bg-accent-hover transition-all cursor-pointer shadow-lg shadow-accent/15"
                    >
                      Start Web Call
                    </button>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-[#121216]/50 border border-zinc-800 rounded-xl p-5 text-xs text-zinc-400 space-y-2">
                <h4 className="font-bold text-zinc-300 font-display">Testing Advice</h4>
                <p className="leading-relaxed">
                  During an active browser test, simulated Hinglish dialogues are typed in real-time. Use these sessions to verify that your neural system prompt maps branches (greeting vs booking vs transfer) correctly.
                </p>
              </div>
            </div>

            {/* Live Transcript Log Panel */}
            <div className="lg:col-span-8 bg-[#111115] border border-zinc-800 rounded-xl p-6 flex flex-col justify-between h-[450px]">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                <div>
                  <h3 className="font-bold text-white text-sm font-display">Live Transcript</h3>
                  <p className="text-[10px] text-zinc-500">Dialogue script updates in real-time below.</p>
                </div>
                <span className="text-[9px] font-mono bg-zinc-950 border border-zinc-900 px-3 py-1 rounded text-zinc-500">
                  WebSocket Channel: Open
                </span>
              </div>

              {/* Message scroll container */}
              <div className="flex-grow overflow-y-auto py-4 space-y-4 px-2">
                {simulatedTranscript.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-2">
                    <Mic className="h-8 w-8 text-zinc-700 animate-pulse" />
                    <p className="text-xs">Click "Start Web Call" on the left to initiate mock transcription stream.</p>
                  </div>
                ) : (
                  simulatedTranscript.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">
                          {msg.role === 'user' ? 'Caller' : 'AI Agent'}
                        </span>
                        <span className="text-[8px] font-mono text-zinc-600">{msg.time}s</span>
                      </div>
                      <div className={`p-3.5 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-zinc-800 text-zinc-100 rounded-tr-none' 
                          : 'bg-zinc-900 border border-accent/20 text-white rounded-tl-none glow-accent/5'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Status Indicator */}
              {isCalling && isTyping && (
                <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-2.5 text-center text-[10px] text-accent font-mono flex items-center justify-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                  Agent is formulating response...
                </div>
              )}

              {/* Chat Input Field when call is active */}
              {isCalling && (
                <div className="mt-2 pt-3 border-t border-zinc-900 flex gap-2">
                  <input
                    type="text"
                    placeholder="Speak / type to the agent (e.g. 'Hello Maya, I want to book a suite tomorrow')..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendChatMessage();
                      }
                    }}
                    disabled={isTyping}
                    className="flex-grow bg-[#1A1A22] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-accent disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendChatMessage}
                    disabled={isTyping || !chatInput.trim()}
                    className="px-5 py-2.5 bg-accent hover:bg-accent-hover disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Send Message
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CALL LOGS HISTORY TAB */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            
            {/* Filtering Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#121216] border border-zinc-800 p-4 rounded-xl">
              <div>
                <h3 className="font-bold text-white text-sm font-display">Call History Feed</h3>
                <p className="text-xs text-zinc-500">Review recent transactions and caller transcriptions.</p>
              </div>

              <div className="flex gap-2">
                {['All', 'Completed', 'Transferred', 'Failed'].map((outcome) => (
                  <button
                    key={outcome}
                    onClick={() => setFilterOutcome(outcome as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      filterOutcome === outcome 
                        ? 'bg-accent border-accent text-zinc-950 font-bold' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {outcome}
                  </button>
                ))}
              </div>
            </div>

            {/* Logs Table */}
            <div className="bg-[#121216] border border-zinc-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-950/40 text-[10px] font-semibold font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-900">
                      <th className="p-4 pl-6">Timestamp</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Caller Number</th>
                      <th className="p-4">Call Outcome</th>
                      <th className="p-4 pr-6 text-right font-sans">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-sm">
                    {callLogs
                      .filter(log => !log.agentId || log.agentId === agent.id)
                      .filter(log => filterOutcome === 'All' || log.outcome === filterOutcome)
                      .map((log) => (
                        <tr key={log.id} className="hover:bg-zinc-900/10 transition-colors">
                          <td className="p-4 pl-6 font-mono text-zinc-400 text-xs flex items-center gap-2 mt-1">
                            <Clock className="h-3.5 w-3.5 text-zinc-600" /> {log.timestamp}
                          </td>
                          <td className="p-4 text-zinc-300 font-mono text-xs">{log.duration}</td>
                          <td className="p-4 text-zinc-300 font-mono text-xs">{log.callerNumber}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              log.outcome === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                              log.outcome === 'Transferred' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                              ● {log.outcome}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <button
                              onClick={() => setSelectedLog(log)}
                              className="text-xs font-bold text-accent hover:text-accent-hover transition-colors font-mono uppercase tracking-wider cursor-pointer"
                            >
                              View Transcript
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transcript Modal overlay */}
            <AnimatePresence>
              {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 max-w-xl w-full flex flex-col justify-between max-h-[550px]"
                  >
                    <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                      <div>
                        <h4 className="font-bold text-white text-base font-display">Call Transcript</h4>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">{selectedLog.callerNumber} • {selectedLog.duration}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedLog(null)}
                        className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Dialogue log list */}
                    <div className="flex-grow overflow-y-auto py-4 space-y-4 my-2">
                      {selectedLog.transcript.map((msg, index) => (
                        <div 
                          key={index}
                          className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                          <span className="text-[9px] font-mono text-zinc-500 mb-0.5 uppercase">
                            {msg.role === 'user' ? 'Customer' : 'AI Agent'} • {msg.time}
                          </span>
                          <div className={`p-3 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                            msg.role === 'user' 
                              ? 'bg-zinc-800 text-zinc-100' 
                              : 'bg-zinc-900 border border-zinc-800 text-white'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setSelectedLog(null)}
                      className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold text-white cursor-pointer"
                    >
                      Close Transcript
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-[#121216] border border-zinc-800 rounded-xl p-6 max-w-3xl mx-auto space-y-6">
            <div className="pb-4 border-b border-zinc-900">
              <h3 className="text-lg font-bold text-white font-display">Agent Configurations</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Edit operational phone numbers and system variables for {agent.name}.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Dedicated Virtual Phone Line</label>
                <input 
                  type="text" 
                  value="+91 80 4721 4099" 
                  disabled
                  className="w-full bg-[#16161C] border border-zinc-900 text-zinc-500 rounded-xl py-3 px-4 text-xs font-mono cursor-not-allowed"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">Your dedicated incoming phone line hosted in our Bangalore telecom server pool.</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Max Call Duration</label>
                  <select className="w-full bg-[#1A1A22] border border-zinc-800 rounded-xl py-3 px-4 text-xs text-zinc-300 focus:outline-none focus:border-accent">
                    <option>5 Minutes (Standard)</option>
                    <option>10 Minutes</option>
                    <option>15 Minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Recording Output</label>
                  <select className="w-full bg-[#1A1A22] border border-zinc-800 rounded-xl py-3 px-4 text-xs text-zinc-300 focus:outline-none focus:border-accent">
                    <option>Record audio & transcript (Dual-channel)</option>
                    <option>Transcript only</option>
                    <option>No recordings (GDPR/Compliance)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900">
                <button
                  onClick={() => triggerAlert('Agent Settings updated successfully.')}
                  className="px-5 py-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  Save Configurations
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
