/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AgentNode {
  id: string;
  type: 'start' | 'greeting' | 'agent' | 'condition' | 'tool' | 'transfer' | 'end';
  title: string;
  description: string;
  x: number;
  y: number;
  config: {
    text?: string;
    systemPrompt?: string;
    temperature?: number;
    conditionText?: string;
    toolName?: string;
    phoneNumber?: string;
    [key: string]: any;
  };
}

export interface AgentEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export interface Agent {
  id: string;
  name: string;
  type: 'Inbound' | 'Outbound';
  status: 'Live' | 'Draft';
  useCase: string;
  prompt: string;
  language: string;
  callsCount: number;
  minutesCount: number;
  successRate: number;
  createdAt: string;
  llmProvider: string;
  llmModel: string;
  ttsProvider: string;
  ttsVoice: string;
  sttProvider: string;
  nodes: AgentNode[];
  edges: AgentEdge[];
}

export interface CallLog {
  id: string;
  timestamp: string;
  duration: string;
  outcome: 'Completed' | 'Transferred' | 'Failed';
  callerNumber: string;
  transcript: { role: 'user' | 'agent'; text: string; time: string }[];
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Agent Builder';
}
