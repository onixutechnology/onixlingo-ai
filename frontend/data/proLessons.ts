// ARCHIVO: frontend/data/proLessons.ts

// --- 1. DEFINICIÓN DE TÍTULOS PARA EL MAPA DE RUTA ---
const CURRICULUM_TITLES = {
  b1: [
    "Professional Introductions", "Formal Emailing", "Business Travel Logistics", 
    "Scheduling Meetings", "Office Small Talk", "Describing Job Roles", 
    "Telephone Etiquette", "Giving Instructions", "Professional Apologies", "B1 Milestone: Networking Event"
  ],
  b2: [
    "Leading Effective Meetings", "Negotiation Fundamentals", "Data Presentation", 
    "Conflict Resolution", "Performance Feedback", "Project Management Terms", 
    "Writing Reports", "Job Interviews", "Marketing Basics", "B2 Milestone: Quarterly Review"
  ],
  c1: [
    "Global Market Analysis", "Crisis Management", "Financial Terminology", 
    "Mergers & Acquisitions", "Public Speaking", "Nuanced Negotiation", 
    "Legal Contracts", "ESG & Sustainability", "Corporate Strategy", "C1 Milestone: Board Presentation"
  ],
  c2: [
    "Idiomatic Business Expressions", "Subtlety & Persuasion", "Cultural Intelligence (CQ)", 
    "Advanced Economics", "Humor in Business", "Hostile Q&A Handling", 
    "Executive Ghostwriting", "Diplomatic Language", "Interpreting Silence", "C2 Milestone: Global Summit"
  ],
  exec: [ // Executive English
    "Organizational Vision", "Stakeholder Management", "IPO & Exit Strategies", 
    "Corporate Governance", "Leadership Philosophy", "Change Management", 
    "Investor Relations", "Risk Assessment", "Succession Planning", "Executive Milestone: Shareholder Meeting"
  ],
  mastery: [ // Mastery English
    "AI & Tech Disruption", "Fintech & Blockchain", "Biotech Innovations", 
    "Green Energy Transition", "Supply Chain Logistics", "Luxury Brand Management", 
    "Real Estate Development", "Venture Capital Pitching", "Cybersecurity Protocols", "Mastery Capstone: Building a Unicorn"
  ]
};

// --- 2. GENERADOR DE LECCIONES GENÉRICAS (Para rellenar huecos) ---
const generateLesson = (id: string, title: string, level: string) => ({
  id,
  title,
  stages: [
    {
      id: 'stage-1',
      type: 'theory',
      title: `Concept: ${title}`,
      parts: [
        {
          visual: `Welcome to the ${level.toUpperCase()} module: ${title}.\n\nIn this lesson, we focus on high-level vocabulary and scenarios relevant to this topic. As a ${level === 'exec' || level === 'mastery' ? 'Titanium Executive' : 'Professional'}, mastering this nuance is key to your career growth.`,
          audio: `Welcome to the lesson on ${title}. Let's begin.`
        }
      ]
    },
    {
      id: 'stage-2',
      type: 'quiz',
      title: 'Comprehension Check',
      questions: [
        {
          type: 'quiz_choice',
          question: `What is the primary focus of "${title}" in a professional context?`,
          options: [
            "To confuse the opponent.",
            "To demonstrate strategic competence and clarity.",
            "To speak as fast as possible.",
            "To use slang words."
          ],
          correct_answer: "To demonstrate strategic competence and clarity.",
          explanation: "Clarity and competence are the pillars of executive communication."
        }
      ]
    },
    {
        id: 'stage-3',
        type: 'gamified_quiz',
        title: 'Executive Drill',
        questions: [
          {
            type: 'order_sentence',
            question: "Construct the professional statement:",
            parts: ["We", "must", "align", "our", "strategy", "with", "global", "trends."],
            correct_order: ["We", "must", "align", "our", "strategy", "with", "global", "trends."],
            explanation: "Alignment with trends is standard strategic phrasing."
          }
        ]
      }
  ]
});

// --- 3. CONSTRUCCIÓN DE LA BASE DE DATOS (PRO_LESSONS) ---
const lessons: Record<string, any> = {};

// A. Generamos todas las lecciones automáticamente primero
CURRICULUM_TITLES.b1.forEach((t, i) => lessons[`pro-b1-${i+1}`] = generateLesson(`pro-b1-${i+1}`, t, 'b1'));
CURRICULUM_TITLES.b2.forEach((t, i) => lessons[`pro-b2-${i+1}`] = generateLesson(`pro-b2-${i+1}`, t, 'b2'));
CURRICULUM_TITLES.c1.forEach((t, i) => lessons[`pro-c1-${i+1}`] = generateLesson(`pro-c1-${i+1}`, t, 'c1'));
CURRICULUM_TITLES.c2.forEach((t, i) => lessons[`pro-c2-${i+1}`] = generateLesson(`pro-c2-${i+1}`, t, 'c2'));
CURRICULUM_TITLES.exec.forEach((t, i) => lessons[`pro-exec-${i+1}`] = generateLesson(`pro-exec-${i+1}`, t, 'exec'));
CURRICULUM_TITLES.mastery.forEach((t, i) => lessons[`pro-mastery-${i+1}`] = generateLesson(`pro-mastery-${i+1}`, t, 'mastery'));

// --- 4. CONTENIDO "PREMIUM" DETALLADO (Sobrescribimos las importantes) ---

// 🟢 LECCIÓN B1-1: INTRODUCCIONES (Tu ejemplo original)
lessons['pro-b1-1'] = {
    id: 'pro-b1-1',
    title: 'Professional Introductions',
    stages: [
      {
        id: 'stage-1',
        type: 'theory',
        title: 'The Art of the Executive Intro',
        parts: [
          {
            visual: "In the Alta Dirección world, the first 7 seconds are crucial.\n\nUnlike casual introductions, an executive introduction must establish two things immediately:\n1. Competence (Who you are)\n2. Value (Why it matters)\n\nAvoid saying: 'Hi, I'm [Name].'\nInstead, use: 'Good morning. I'm [Name], leading the [Department] division.'",
            audio: "In the Alta Dirección world, the first 7 seconds are crucial..." 
          }
        ]
      },
      {
        id: 'stage-2',
        type: 'quiz',
        title: 'Identify the Power Move',
        questions: [
          {
            type: 'quiz_choice',
            question: "You are meeting the CEO of a potential partner firm. Which greeting conveys the most authority?",
            options: [
              "Hey there! I'm John from Marketing.",
              "Good afternoon. John Smith, Director of Strategic Partnerships. It's a pleasure.",
              "Hi, sorry to bother you, I'm just John.",
              "Nice to meet you, I work at Onix."
            ],
            correct_answer: "Good afternoon. John Smith, Director of Strategic Partnerships. It's a pleasure.",
            explanation: "Full name + Title + Formal greeting establishes equal footing immediately."
          }
        ]
      },
      {
        id: 'stage-3',
        type: 'gamified_quiz',
        title: 'Structure the Email',
        questions: [
          {
            type: 'order_sentence',
            question: "Order the sentence to form a polite yet assertive request:",
            parts: ["I", "would", "appreciate", "your", "feedback", "on", "the", "proposal", "by", "Friday."],
            correct_order: ["I", "would", "appreciate", "your", "feedback", "on", "the", "proposal", "by", "Friday."],
            explanation: "Using 'I would appreciate' is standard executive courtesy for setting deadlines."
          }
        ]
      }
    ]
};

// 🔵 LECCIÓN B2-1: LIDERAR REUNIONES
lessons['pro-b2-1'] = {
    id: 'pro-b2-1',
    title: 'Leading Effective Meetings',
    stages: [
        {
            id: 's1', type: 'theory', title: 'Setting the Agenda',
            parts: [{ visual: "A meeting without an agenda is a coffee break.\n\nTo lead effectively, use strong verbs:\n- 'We are here to DECIDE on...'\n- 'The goal is to ALIGN regarding...'\n\nStop saying: 'We are gonna talk about...'", audio: "Effective meetings start with clear intent." }]
        },
        {
            id: 's2', type: 'quiz', title: 'Controlling the Room',
            questions: [{
                type: 'quiz_choice',
                question: "Someone is interrupting repeatedly. How do you regain control professionally?",
                options: ["Shut up, please.", "Let's park that idea for now and get back to the agenda.", "You talk too much.", "I will ignore you."],
                correct_answer: "Let's park that idea for now and get back to the agenda.",
                explanation: "'Parking' an idea validates the person but keeps the meeting moving."
            }]
        }
    ]
};

// 🟣 LECCIÓN C1-1: ANÁLISIS DE MERCADO
lessons['pro-c1-1'] = {
    id: 'pro-c1-1',
    title: 'Global Market Analysis',
    stages: [
        {
            id: 's1', type: 'theory', title: 'Market Sentiment',
            parts: [{ visual: "When discussing markets, precision is key.\n\nBullish = Optimistic, Rising.\nBearish = Pessimistic, Falling.\nVolatile = Unpredictable changes.\n\nExample: 'Despite the bearish outlook in tech, our sector remains resilient.'", audio: "Market terminology defines your credibility." }]
        },
        {
            id: 's2', type: 'gamified_quiz', title: 'Financial Fluency',
            questions: [{
                type: 'fill_input',
                question: "Complete the phrase: The market is highly ______ (unstable/changing rapidly).",
                correct_answers: ["volatile", "unstable"],
                explanation: "Volatile is the precise financial term for rapid fluctuation."
            }]
        }
    ]
};

// 🟠 LECCIÓN EXECUTIVE-1: VISIÓN ORGANIZACIONAL
lessons['pro-exec-1'] = {
    id: 'pro-exec-1',
    title: 'Organizational Strategy & Vision',
    stages: [
        {
            id: 's1', type: 'theory', title: 'The 30,000 Foot View',
            parts: [{ visual: "As a Director, you don't discuss 'tasks'. You discuss 'Strategy' and 'Vision'.\n\n- Tasks: 'Fixing the server'.\n- Strategy: 'Enhancing our digital infrastructure resilience'.\n\nAlways link actions to the bottom line (Revenue/Profit).", audio: "Elevate your language to elevate your position." }]
        },
        {
            id: 's2', type: 'gamified_quiz', title: 'Strategic Alignment',
            questions: [{
                type: 'order_sentence',
                question: "State the company mission:",
                parts: ["Our", "mission", "is", "to", "disrupt", "the", "legacy", "banking", "system."],
                correct_order: ["Our", "mission", "is", "to", "disrupt", "the", "legacy", "banking", "system."],
                explanation: "Mission statements must be bold and clear."
            }]
        }
    ]
};

// --- 5. EXPORT FINAL ---
export const PRO_LESSONS = lessons;