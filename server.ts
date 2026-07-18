import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const STORE_PATH = path.join(process.cwd(), 'db_store.json');

// Initialize Google Gen AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Seed Initial Database Data if not present
const SEED_DATA = {
  agents: [
    {
      id: 'agent-1',
      name: 'Taj Stay Assistant',
      type: 'Inbound',
      status: 'Live',
      useCase: 'Hotel Room Booking & Hospitality Queries',
      prompt: 'You are Maya, the elegant and polite AI receptionist for Taj Vivanta. Converse naturally in a warm, welcoming Hinglish tone (Hindi + English). Answer inquiries about rooms, check availability, offer the Premium Suite at ₹18,000 per night (including buffet breakfast), collect booking dates, guest count, and guests names. If booking is confirmed, politely let them know you are transferring to the reservation desk.',
      language: 'Hinglish (Hindi + English)',
      callsCount: 184,
      minutesCount: 320,
      successRate: 94,
      createdAt: '2026-07-01',
      llmProvider: 'Google Gemini',
      llmModel: 'gemini-3.5-flash',
      ttsProvider: 'Deepgram',
      ttsVoice: 'aura-asteria-en',
      sttProvider: 'Deepgram',
      nodes: [
        { id: 'node-start', type: 'start', title: 'Start Call', description: 'Call is connected', x: 100, y: 180, config: {} },
        { id: 'node-greet', type: 'greeting', title: 'Greeting', description: 'Polite brand intro', x: 280, y: 180, config: { text: 'Namaste! Welcome to Taj Vivanta. My name is Maya. How can I help you book your stay or assist you today?' } },
        { id: 'node-agent', type: 'agent', title: 'Booking Agent', description: 'Collects stay details', x: 480, y: 180, config: { systemPrompt: 'Collect Name, Check-in/out dates, and number of guests. Offer Premium Suite at ₹18,000/night. Keep answers short.', temperature: 0.4 } },
        { id: 'node-transfer', type: 'transfer', title: 'Transfer to Desk', description: 'If booking confirmed', x: 720, y: 100, config: { phoneNumber: '+91 98765 43210' } },
        { id: 'node-end', type: 'end', title: 'End Call', description: 'For general inquiries', x: 720, y: 260, config: { text: 'Thank you for calling Taj Vivanta. Have a lovely day!' } }
      ],
      edges: [
        { id: 'e1', from: 'node-start', to: 'node-greet' },
        { id: 'e2', from: 'node-greet', to: 'node-agent' },
        { id: 'e3', from: 'node-agent', to: 'node-transfer', label: 'Booking Confirmed' },
        { id: 'e4', from: 'node-agent', to: 'node-end', label: 'Inquiry Resolved' }
      ]
    },
    {
      id: 'agent-2',
      name: 'Arogya Dental Reception',
      type: 'Inbound',
      status: 'Live',
      useCase: 'Clinic Appointment Schedulers & Triage',
      prompt: 'You are Dr. Sharmas helpful AI clinic receptionist. Converse warmly and empathetically in natural Hindi or Hinglish. Ask about their dental issue (toothache, dental cleaning, RCT). Offer available slots for tomorrow at 11:00 AM or 4:00 PM. Confirm their full name and mobile number.',
      language: 'Hindi (हिंदी)',
      callsCount: 243,
      minutesCount: 480,
      successRate: 92,
      createdAt: '2026-06-15',
      llmProvider: 'Google Gemini',
      llmModel: 'gemini-3.5-flash',
      ttsProvider: 'ElevenLabs',
      ttsVoice: 'Rachel (Indian Accent)',
      sttProvider: 'Deepgram',
      nodes: [
        { id: 'node-start', type: 'start', title: 'Start Call', description: 'Incoming connection', x: 100, y: 180, config: {} },
        { id: 'node-greet', type: 'greeting', title: 'Greet & Triage', description: 'Clinic introduction', x: 280, y: 180, config: { text: 'Pranam! Arogya Dental Clinic mein aapka swagat hai. Main Dr. Sharma ki AI assistant Bol rahi hoon. Aaj aapko kis samasya ke liye appointment chahiye?' } },
        { id: 'node-agent', type: 'agent', title: 'Appointment Booking', description: 'Verify slot & name', x: 480, y: 180, config: { systemPrompt: 'Inquire about dental issue. Suggest 11 AM or 4 PM slots tomorrow. Get name. Speak in empathetic Hindi.', temperature: 0.3 } },
        { id: 'node-tool', type: 'tool', title: 'Book Slot', description: 'Trigger calendar sync API', x: 700, y: 180, config: { toolName: 'SyncToGoogleCalendar' } },
        { id: 'node-end', type: 'end', title: 'Thank & End', description: 'Appointment confirmed', x: 880, y: 180, config: { text: 'Dhanyawad! Dr. Sharma ke saath kal ka appointment book ho gaya hai. SMS ke zariye details bhej di gayi hain.' } }
      ],
      edges: [
        { id: 'e1', from: 'node-start', to: 'node-greet' },
        { id: 'e2', from: 'node-greet', to: 'node-agent' },
        { id: 'e3', from: 'node-agent', to: 'node-tool', label: 'Slot Selected' },
        { id: 'e4', from: 'node-tool', to: 'node-end' }
      ]
    },
    {
      id: 'agent-3',
      name: 'Apex IIT-JEE Follow-up',
      type: 'Outbound',
      status: 'Draft',
      useCase: 'Coaching Center Admission Qualification',
      prompt: 'You are Rohan from Apex IIT-JEE Academy. In an outbound call, congratulate the lead on their scholarship test download, ask if they plan to attempt JEE 2027, inquire about their target stream (Engineering/Architecture), and invite them for a free offline counseling session this Saturday at Janakpuri center.',
      language: 'English',
      callsCount: 15,
      minutesCount: 30,
      successRate: 80,
      createdAt: '2026-07-15',
      llmProvider: 'Google Gemini',
      llmModel: 'gemini-3.5-flash',
      ttsProvider: 'ElevenLabs',
      ttsVoice: 'Drew (Professional Indian Male)',
      sttProvider: 'OpenAI Whisper',
      nodes: [
        { id: 'node-start', type: 'start', title: 'Trigger Outbound', description: 'Lead uploaded to dialer', x: 100, y: 180, config: {} },
        { id: 'node-greet', type: 'greeting', title: 'Greeting & Congrats', description: 'State purpose clearly', x: 280, y: 180, config: { text: 'Hello! This is Rohan calling from Apex IIT-JEE Academy. Congratulations on downloading our JEE mock and scholarship papers! I wanted to check how your preparation is going?' } },
        { id: 'node-agent', type: 'agent', title: 'Counseling Pitch', description: 'Check target & slot', x: 480, y: 180, config: { systemPrompt: 'Check if they want online or offline batch. Invite them to Janakpuri center for a free physical counseling this Saturday.', temperature: 0.5 } },
        { id: 'node-end', type: 'end', type_tag: 'end', title: 'Confirm Session', description: 'Send center address', x: 700, y: 180, config: { text: 'Excellent! I have booked your counseling seat for this Saturday morning. I will WhatsApp you our office map and timing. Have a great day!' } }
      ],
      edges: [
        { id: 'e1', from: 'node-start', to: 'node-greet' },
        { id: 'e2', from: 'node-greet', to: 'node-agent' },
        { id: 'e3', from: 'node-agent', to: 'node-end', label: 'Session Booked' }
      ]
    }
  ],
  callLogs: [
    {
      id: 'log-1',
      timestamp: '2026-07-17 18:42:15',
      duration: '1m 24s',
      outcome: 'Completed',
      callerNumber: '+91 99321 00412',
      transcript: [
        { role: 'agent', text: 'Namaste! Welcome to Taj Vivanta. My name is Maya. How can I help you book your stay or assist you today?', time: '0:03' },
        { role: 'user', text: 'Hello, I want to book a room for tomorrow. 2 adults. For 2 nights.', time: '0:12' },
        { role: 'agent', text: 'Tomorrow, which is July 18th, for 2 nights? Absolutely! We have our Premium Suite available. It includes high-speed Wi-Fi and complimentary breakfast buffet. Would you like me to reserve it for you?', time: '0:29' },
        { role: 'user', text: 'What is the price for this room?', time: '0:35' },
        { role: 'agent', text: 'The price for our Premium Suite is ₹18,000 per night plus GST. Shall we proceed with booking this for you?', time: '0:45' },
        { role: 'user', text: 'Yes, that works. Please book it under the name Akash Gupta.', time: '0:53' },
        { role: 'agent', text: 'Wonderful, Akash Ji! I have blocked that slot. I am now transferring your call to our payment and booking confirmation desk to finalize your stays. Thank you for choosing Taj!', time: '1:10' }
      ]
    },
    {
      id: 'log-2',
      timestamp: '2026-07-17 17:15:30',
      duration: '2m 10s',
      outcome: 'Completed',
      callerNumber: '+91 98455 12041',
      transcript: [
        { role: 'agent', text: 'Pranam! Arogya Dental Clinic mein aapka swagat hai. Main Dr. Sharma ki AI assistant Bol rahi hoon. Aaj aapko kis samasya ke liye appointment chahiye?', time: '0:04' },
        { role: 'user', text: 'Ji mere daanth mein bohot tez dard ho raha hai do teen din se. Dr. Sharma kal free hain kya?', time: '0:14' },
        { role: 'agent', text: 'Aapke daanth mein dard hai, main samajh sakti hoon ye bohot kashtdayak hota hai. Dr. Sharma kal bilkul free hain. Kal subah 11 baje ya shaam ko 4 baje, kaunsa samay aapke liye sahi rahega?', time: '0:32' },
        { role: 'user', text: 'Shaam ko char baje ka time theek rahega. Mera naam Amit Verma hai.', time: '0:41' },
        { role: 'agent', text: 'Kal shaam 4 baje Amit Verma ji ke liye appointment block kar liya hai. Kya aapka contact number yahi hai jispar aap baat kar rahe hain?', time: '0:55' },
        { role: 'user', text: 'Haan ji, yahi number chalega.', time: '0:59' },
        { role: 'agent', text: 'Dhanyawad Amit ji! Kal shaam 4 baje Dr. Sharma ke saath aapka appointment confirm ho gaya hai. SMS ke zariye address aur appointment receipt bhej di gayi hai. Kal milte hain!', time: '1:18' }
      ]
    }
  ],
  invoices: [
    { id: 'INV-4029', date: 'July 1, 2026', amount: '₹14,999', status: 'Paid' },
    { id: 'INV-3914', date: 'June 1, 2026', amount: '₹12,450', status: 'Paid' },
    { id: 'INV-3801', date: 'May 1, 2026', amount: '₹8,320', status: 'Paid' }
  ],
  teamMembers: [
    { id: 'mem-1', name: 'Rajesh Malhotra', email: 'rajesh@malhotragroup.in', role: 'Owner' },
    { id: 'mem-2', name: 'Ananya Sen', email: 'ananya@malhotragroup.in', role: 'Admin' },
    { id: 'mem-3', name: 'Vikram Singh', email: 'vikram@malhotragroup.in', role: 'Agent Builder' }
  ],
};

function readDb() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to read database store:', err);
  }
  // Fallback to seeds and write them immediately
  writeDb(SEED_DATA);
  return SEED_DATA;
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database store:', err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API - Get all agents
  app.get('/api/agents', (req, res) => {
    const db = readDb();
    res.json(db.agents);
  });

  // API - Create fresh agent
  app.post('/api/agents', (req, res) => {
    const db = readDb();
    const newAgent = {
      id: `agent-${Date.now()}`,
      callsCount: 0,
      minutesCount: 0,
      successRate: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ...req.body,
    };
    db.agents.unshift(newAgent);
    writeDb(db);
    res.status(201).json(newAgent);
  });

  // API - Update agent
  app.put('/api/agents/:id', (req, res) => {
    const db = readDb();
    const idx = db.agents.findIndex((a: any) => a.id === req.params.id);
    if (idx !== -1) {
      db.agents[idx] = { ...db.agents[idx], ...req.body };
      writeDb(db);
      res.json(db.agents[idx]);
    } else {
      res.status(404).json({ error: 'Agent not found' });
    }
  });

  // API - Delete agent
  app.delete('/api/agents/:id', (req, res) => {
    const db = readDb();
    db.agents = db.agents.filter((a: any) => a.id !== req.params.id);
    writeDb(db);
    res.json({ success: true });
  });

  // API - Get call logs
  app.get('/api/call-logs', (req, res) => {
    const db = readDb();
    res.json(db.callLogs);
  });

  // API - Create new custom call log
  app.post('/api/call-logs', (req, res) => {
    const db = readDb();
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...req.body,
    };
    db.callLogs.unshift(newLog);

    // If agent ID is passed, increment callsCount and minutesCount
    if (req.body.agentId) {
      const agent = db.agents.find((a: any) => a.id === req.body.agentId);
      if (agent) {
        agent.callsCount = (agent.callsCount || 0) + 1;
        // Parse duration e.g. "1m 24s" -> 1.5 mins roughly or random
        const minStr = req.body.duration || '1m 0s';
        const match = minStr.match(/(\d+)m/);
        const mins = match ? parseInt(match[1]) : 1;
        agent.minutesCount = (agent.minutesCount || 0) + mins;
      }
    }

    writeDb(db);
    res.status(201).json(newLog);
  });

  // API - Get dynamic Billing data & invoices
  app.get('/api/billing', (req, res) => {
    const db = readDb();
    // Sum total minutes used dynamically from callLogs
    let totalMinutes = 0;
    db.callLogs.forEach((log: any) => {
      const match = log.duration.match(/(\d+)m/);
      if (match) {
        totalMinutes += parseInt(match[1]);
      } else {
        totalMinutes += 1;
      }
    });

    // Estimate costs: ₹5.5 per minute
    const currentCharge = totalMinutes * 5.5;

    res.json({
      totalMinutes,
      currentCharge: `₹${Math.round(currentCharge).toLocaleString('en-IN')}`,
      invoices: db.invoices,
    });
  });

  // API - Manage Team
  app.get('/api/team', (req, res) => {
    const db = readDb();
    res.json(db.teamMembers);
  });

  app.post('/api/team', (req, res) => {
    const db = readDb();
    const newMem = {
      id: `mem-${Date.now()}`,
      ...req.body,
    };
    db.teamMembers.push(newMem);
    writeDb(db);
    res.status(201).json(newMem);
  });

  app.delete('/api/team/:id', (req, res) => {
    const db = readDb();
    db.teamMembers = db.teamMembers.filter((m: any) => m.id !== req.params.id);
    writeDb(db);
    res.json({ success: true });
  });

  // API - Conversational Voice Chat / Text Preview with real Gemini Brain!
  app.post('/api/chat', async (req, res) => {
    const { agentId, messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const db = readDb();
    const agent = db.agents.find((a: any) => a.id === agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Voice Agent not found' });
    }

    try {
      const conversationHistory = messages.map((m: any) => {
        return `${m.role === 'user' ? 'User' : 'Agent'}: ${m.text}`;
      }).join('\n');

      const promptContext = `
You are simulating the dialogue engine for a sub-second low-latency AI voice agent built on our Indian telecom pipeline.
The agent details:
- Name: ${agent.name}
- System Instructions: ${agent.prompt}
- Language Preference: ${agent.language}

Here is the conversation so far:
${conversationHistory}

Generate ONLY the next single turn response for the 'Agent'.
Do not prefix your response with "Agent:" or "Maya:" or similar. Just output the actual words to speak.
Keep the response highly conversational, professional, concise (under 2 sentences), and tailored to the requested language preference and prompt rules.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptContext,
        config: {
          temperature: 0.5,
        },
      });

      const replyText = response.text || 'Understood. How else can I assist?';
      res.json({ text: replyText });
    } catch (err: any) {
      console.error('Gemini Chat error:', err);
      res.status(500).json({ error: err.message || 'Brain failed to generate reply' });
    }
  });

  // API - Trigger Dynamic campaign dialer simulations powered by Gemini!
  app.post('/api/dialer', async (req, res) => {
    const { agentId, leads } = req.body;
    if (!agentId || !leads || !Array.isArray(leads)) {
      return res.status(400).json({ error: 'agentId and leads list are required' });
    }

    const db = readDb();
    const agent = db.agents.find((a: any) => a.id === agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    try {
      const generatedLogs: any[] = [];

      // Run simulations in parallel (limit to first 4 leads for performance)
      const targetLeads = leads.slice(0, 4);

      for (const lead of targetLeads) {
        const leadName = lead.name;
        const leadPhone = lead.phone || '+91 99999 11111';

        const promptContext = `
You are a simulator generating realistic telephone conversation transcripts between an AI voice agent and an Indian customer.
Agent Name: ${agent.name}
Agent Role/Prompt: ${agent.prompt}
Customer Name: ${leadName}
Customer Phone Line: ${leadPhone}

Generate a complete, high-quality, professional telephone conversation transcript.
Structure the transcript as a JSON list of turns.
Each turn must be an object with:
- "role": "agent" or "user"
- "text": The spoken phrase (use concise, natural Indian conversational style/Hinglish where appropriate, e.g. using Namaste, Haan, Achha, ji, etc.)
- "time": A string indicating elapsed call time (e.g., "0:03", "0:15", "0:42")

Make the conversation 4 to 6 turns total, resolving with an appropriate outcome.
Return ONLY valid JSON. No markdown wrappers, no backticks, no comments.
Format:
[
  {"role": "agent", "text": "...", "time": "0:03"},
  {"role": "user", "text": "...", "time": "0:12"}
]
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: promptContext,
          config: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        });

        let transcriptList = [];
        try {
          const rawText = response.text || '[]';
          transcriptList = JSON.parse(rawText.trim());
        } catch (pe) {
          console.error('Failed to parse JSON for lead:', leadName, pe);
          // Fallback script if JSON parsing fails
          transcriptList = [
            { role: 'agent', text: `Hello ${leadName}, this is ${agent.name}. How are you?`, time: '0:03' },
            { role: 'user', text: 'Yes hello, I am doing fine. Tell me more.', time: '0:12' },
            { role: 'agent', text: `Sure! According to our database, you were interested in our ${agent.useCase} service. Should we set it up?`, time: '0:25' },
            { role: 'user', text: 'Yes, that sounds great. Please book it.', time: '0:38' },
            { role: 'agent', text: 'Perfect! I have logged your booking. Our executive will reach out soon. Have a wonderful day!', time: '0:50' },
          ];
        }

        // Randomly assign outcomes
        const outcomes: ('Completed' | 'Transferred' | 'Failed')[] = ['Completed', 'Transferred', 'Completed'];
        const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

        // Random duration e.g. "1m 15s"
        const durationSecs = Math.floor(Math.random() * 50) + 40; // 40-90 secs
        const duration = `${Math.floor(durationSecs / 60)}m ${durationSecs % 60}s`;

        const newLog = {
          id: `log-dialer-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          duration,
          outcome,
          callerNumber: leadPhone,
          transcript: transcriptList,
        };

        db.callLogs.unshift(newLog);
        generatedLogs.push(newLog);

        // Update agent statistics
        agent.callsCount = (agent.callsCount || 0) + 1;
        const mins = Math.ceil(durationSecs / 60);
        agent.minutesCount = (agent.minutesCount || 0) + mins;
      }

      writeDb(db);
      res.json({ success: true, logs: generatedLogs });
    } catch (err: any) {
      console.error('Dialer simulation error:', err);
      res.status(500).json({ error: err.message || 'Failed to simulate dialer campaign' });
    }
  });

  // Vite Integration in Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully started at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal dev server error:', err);
});
