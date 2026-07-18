/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Agent, CallLog, Invoice, TeamMember } from './types';

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'Taj Stay Assistant',
    type: 'Inbound',
    status: 'Live',
    useCase: 'Hotel Room Booking & Hospitality Queries',
    prompt: 'You are the elegant AI receptionist for Taj Vivanta. Answer politely in Hinglish or English. Ask for their check-in date, check-out date, and number of guests. Provide room availability, describe premium amenities, and if they confirm, capture their name and transfer the call to the reservation desk.',
    language: 'Hinglish (Hindi + English)',
    callsCount: 184,
    minutesCount: 320,
    successRate: 94,
    createdAt: '2026-07-01',
    llmProvider: 'Google Gemini',
    llmModel: 'gemini-2.5-flash',
    ttsProvider: 'Deepgram',
    ttsVoice: 'aura-asteria-en',
    sttProvider: 'Deepgram',
    nodes: [
      {
        id: 'node-start',
        type: 'start',
        title: 'Start Call',
        description: 'Call is connected',
        x: 100,
        y: 180,
        config: {}
      },
      {
        id: 'node-greet',
        type: 'greeting',
        title: 'Greeting',
        description: 'Polite brand intro',
        x: 280,
        y: 180,
        config: { text: 'Namaste! Welcome to Taj Vivanta. My name is Maya. How can I help you book your stay or assist you today?' }
      },
      {
        id: 'node-agent',
        type: 'agent',
        title: 'Booking Agent',
        description: 'Collects stay details',
        x: 480,
        y: 180,
        config: {
          systemPrompt: 'Collect: 1. Name, 2. Check-in/out dates, 3. Number of guests. Be exceptionally polite and hospitable. Recommend the Premium Suite (₹18,000/night) which includes breakfast. Keep answers brief (under 2 sentences).',
          temperature: 0.4
        }
      },
      {
        id: 'node-transfer',
        type: 'transfer',
        title: 'Transfer to Desk',
        description: 'If booking confirmed',
        x: 720,
        y: 100,
        config: { phoneNumber: '+91 98765 43210' }
      },
      {
        id: 'node-end',
        type: 'end',
        title: 'End Call',
        description: 'For general inquiries',
        x: 720,
        y: 260,
        config: { text: 'Thank you for calling Taj Vivanta. Have a lovely day!' }
      }
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
    prompt: 'You are the helpful receptionist for Arogya Dental Clinic, Gurgaon. Answer in polite Hindi or English. Inquire about their dental concern (toothache, cleaning, root canal) and suggest available slots with Dr. Sharma. Confirm patient name and phone number.',
    language: 'Hindi (हिंदी)',
    callsCount: 243,
    minutesCount: 480,
    successRate: 92,
    createdAt: '2026-06-15',
    llmProvider: 'OpenAI',
    llmModel: 'gpt-4o-mini',
    ttsProvider: 'ElevenLabs',
    ttsVoice: 'Rachel (Indian Accent)',
    sttProvider: 'Deepgram',
    nodes: [
      {
        id: 'node-start',
        type: 'start',
        title: 'Start Call',
        description: 'Incoming connection',
        x: 100,
        y: 180,
        config: {}
      },
      {
        id: 'node-greet',
        type: 'greeting',
        title: 'Greet & Triage',
        description: 'Clinic introduction',
        x: 280,
        y: 180,
        config: { text: 'Pranam! Arogya Dental Clinic mein aapka swagat hai. Main Dr. Sharma ki AI assistant Bol rahi hoon. Aaj aapko kis samasya ke liye appointment chahiye?' }
      },
      {
        id: 'node-agent',
        type: 'agent',
        title: 'Appointment Booking',
        description: 'Verify slot & name',
        x: 480,
        y: 180,
        config: {
          systemPrompt: 'Ask for the dental issue. Suggest 11 AM or 4 PM slots for tomorrow. Get patient name. Speak in warm, empathetic Hindi.',
          temperature: 0.3
        }
      },
      {
        id: 'node-tool',
        type: 'tool',
        title: 'Book Slot',
        description: 'Trigger calendar sync API',
        x: 700,
        y: 180,
        config: { toolName: 'SyncToGoogleCalendar' }
      },
      {
        id: 'node-end',
        type: 'end',
        title: 'Thank & End',
        description: 'Appointment confirmed',
        x: 880,
        y: 180,
        config: { text: 'Dhanyawad! Dr. Sharma ke saath kal ka appointment book ho gaya hai. SMS ke zariye details bhej di gayi hain.' }
      }
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
    prompt: 'Outbound call to qualified leads who downloaded the JEE mock tests. Speak in English or Hinglish. Congratulate them, ask if they are planning to attempt JEE 2027, check their target stream (Engineering/Architecture), and invite them for a free career counselling session at our Janakpuri center.',
    language: 'English',
    callsCount: 0,
    minutesCount: 0,
    successRate: 0,
    createdAt: '2026-07-15',
    llmProvider: 'Google Gemini',
    llmModel: 'gemini-2.5-flash',
    ttsProvider: 'ElevenLabs',
    ttsVoice: 'Drew (Professional Indian Male)',
    sttProvider: 'OpenAI Whisper',
    nodes: [
      {
        id: 'node-start',
        type: 'start',
        title: 'Trigger Outbound',
        description: 'Lead uploaded to dialer',
        x: 100,
        y: 180,
        config: {}
      },
      {
        id: 'node-greet',
        type: 'greeting',
        title: 'Greeting & Congrats',
        description: 'State purpose clearly',
        x: 280,
        y: 180,
        config: { text: 'Hello! Am I speaking with Rahul? This is Rohan calling from Apex IIT-JEE Academy. Congratulations on your great score in our JEE scholarship test!' }
      },
      {
        id: 'node-agent',
        type: 'agent',
        title: 'Counseling Pitch',
        description: 'Check target & slot',
        x: 480,
        y: 180,
        config: {
          systemPrompt: 'Check if they want to join online or offline batch. Offer a free counseling session this Saturday. Secure commitment.',
          temperature: 0.5
        }
      },
      {
        id: 'node-end',
        type: 'end',
        title: 'Confirm Session',
        description: 'Send center address',
        x: 700,
        y: 180,
        config: { text: 'Excellent! I have booked your seat with Dr. Verma at 11 AM this Saturday. I will send you the location pin on WhatsApp. Goodbye!' }
      }
    ],
    edges: [
      { id: 'e1', from: 'node-start', to: 'node-greet' },
      { id: 'e2', from: 'node-greet', to: 'node-agent' },
      { id: 'e3', from: 'node-agent', to: 'node-end', label: 'Session Booked' }
    ]
  },
  {
    id: 'agent-4',
    name: 'Chai Tapri Cafe Bot',
    type: 'Inbound',
    status: 'Live',
    useCase: 'Cafe Order Taking & Pre-ordering',
    prompt: 'You are the smart ordering assistant for Chai Tapri Cafe, Koramangala. Help people pre-order Chai, Bun Maska, Samosas, and Maggi. Speak in a fun, friendly Hinglish manner. Inform them about current wait times and take their pre-payments on UPI.',
    language: 'Hinglish (Hindi + English)',
    callsCount: 89,
    minutesCount: 140,
    successRate: 88,
    createdAt: '2026-07-10',
    llmProvider: 'Groq',
    llmModel: 'llama-3.3-70b',
    ttsProvider: 'Deepgram',
    ttsVoice: 'aura-stella-en',
    sttProvider: 'Deepgram',
    nodes: [
      {
        id: 'node-start',
        type: 'start',
        title: 'Start Call',
        description: 'Customer calls cafe',
        x: 100,
        y: 180,
        config: {}
      },
      {
        id: 'node-greet',
        type: 'greeting',
        title: 'Tapri Greeting',
        description: 'Upbeat welcome',
        x: 280,
        y: 180,
        config: { text: 'Hey there! Chai Tapri, Koramangala mein swagat hai boss! I am your order buddy. Tea, Bun Maska, ya spicy Maggi - kya launch karu aapke liye?' }
      },
      {
        id: 'node-agent',
        type: 'agent',
        title: 'Menu Selector',
        description: 'Tally up order & add-ons',
        x: 480,
        y: 180,
        config: {
          systemPrompt: 'Confirm their tea preferences (Adrak, Elaichi, Masala) and sugar level. Upsell "Bun Maska" if they order only tea. Give them an order total.',
          temperature: 0.6
        }
      },
      {
        id: 'node-end',
        type: 'end',
        title: 'Finish & Prep',
        description: 'Send GPay request link',
        x: 700,
        y: 180,
        config: { text: 'Done deal! 1 Adrak Chai aur 1 Bun Maska ready rahega in 10 minutes. SMS par GPay link bhej diya hai. See you soon!' }
      }
    ],
    edges: [
      { id: 'e1', from: 'node-start', to: 'node-greet' },
      { id: 'e2', from: 'node-greet', to: 'node-agent' },
      { id: 'e3', from: 'node-agent', to: 'node-end', label: 'Order Tailed' }
    ]
  }
];

export const MOCK_CALL_LOGS: CallLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-07-17 18:42:15',
    duration: '1m 24s',
    outcome: 'Completed',
    callerNumber: '+91 99*** *8421',
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
    callerNumber: '+91 91*** *4392',
    transcript: [
      { role: 'agent', text: 'Pranam! Arogya Dental Clinic mein aapka swagat hai. Main Dr. Sharma ki AI assistant Bol rahi hoon. Aaj aapko kis samasya ke liye appointment chahiye?', time: '0:04' },
      { role: 'user', text: 'Ji mere daanth mein bohot tez dard ho raha hai do teen din se. Dr. Sharma kal free hain kya?', time: '0:14' },
      { role: 'agent', text: 'Aapke daanth mein dard hai, main samajh sakti hoon ye bohot kashtdayak hota hai. Dr. Sharma kal bilkul free hain. Kal subah 11 baje ya shaam ko 4 baje, kaunsa samay aapke liye sahi rahega?', time: '0:32' },
      { role: 'user', text: 'Shaam ko char baje ka time theek rahega. Mera naam Amit Verma hai.', time: '0:41' },
      { role: 'agent', text: 'Kal shaam 4 baje Amit Verma ji ke liye appointment block kar liya hai. Kya aapka contact number yahi hai jispar aap baat kar rahe hain?', time: '0:55' },
      { role: 'user', text: 'Haan ji, yahi number chalega.', time: '0:59' },
      { role: 'agent', text: 'Dhanyawad Amit ji! Kal shaam 4 baje Dr. Sharma ke saath aapka appointment confirm ho gaya hai. SMS ke zariye address aur appointment receipt bhej di gayi hai. Kal milte hain!', time: '1:18' }
    ]
  },
  {
    id: 'log-3',
    timestamp: '2026-07-17 16:30:11',
    duration: '0m 45s',
    outcome: 'Failed',
    callerNumber: '+91 88*** *1290',
    transcript: [
      { role: 'agent', text: 'Namaste! Welcome to Taj Vivanta. My name is Maya. How can I help you book your stay today?', time: '0:03' },
      { role: 'user', text: 'Mujhe ek double room chahiye do ghante ke liye. Room rate kitna hoga?', time: '0:11' },
      { role: 'agent', text: 'I apologize, but we do not offer hourly reservations. Our minimum booking is for one full night. Would you like to proceed with a nightly stay?', time: '0:22' },
      { role: 'user', text: 'Nahi chahiye. Thank you.', time: '0:28' },
      { role: 'agent', text: 'Thank you for calling Taj Vivanta. Please let us know if you change your mind. Goodbye!', time: '0:38' }
    ]
  },
  {
    id: 'log-4',
    timestamp: '2026-07-17 15:02:44',
    duration: '1m 05s',
    outcome: 'Transferred',
    callerNumber: '+91 97*** *0024',
    transcript: [
      { role: 'agent', text: 'Hey there! Chai Tapri, Koramangala mein swagat hai boss! I am your order buddy. Tea, Bun Maska, ya spicy Maggi - kya launch karu aapke liye?', time: '0:05' },
      { role: 'user', text: 'Hello, can I place a bulk order of 15 cutting chai and 10 bun maska for our office?', time: '0:14' },
      { role: 'agent', text: 'Whoa, full office party! Absolutely, let me transfer you directly to our manager Sunil. He will offer you a corporate discount and arrange fast delivery. Just a moment, please...', time: '0:31' }
    ]
  }
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-4029', date: 'July 1, 2026', amount: '₹14,999', status: 'Paid' },
  { id: 'INV-3914', date: 'June 1, 2026', amount: '₹12,450', status: 'Paid' },
  { id: 'INV-3801', date: 'May 1, 2026', amount: '₹8,320', status: 'Paid' }
];

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  { id: 'mem-1', name: 'Rajesh Malhotra', email: 'rajesh@malhotragroup.in', role: 'Owner' },
  { id: 'mem-2', name: 'Ananya Sen', email: 'ananya@malhotragroup.in', role: 'Admin' },
  { id: 'mem-3', name: 'Vikram Singh', email: 'vikram@malhotragroup.in', role: 'Agent Builder' }
];
