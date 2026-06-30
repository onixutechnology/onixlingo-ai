const fs = require('fs');

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
    "Tech Disruption", "Fintech & Blockchain", "Biotech Innovations", 
    "Green Energy Transition", "Supply Chain Logistics", "Luxury Brand Management", 
    "Real Estate Development", "Venture Capital Pitching", "Cybersecurity Protocols", "Mastery Capstone: Building a Unicorn"
  ]
};

const uniqueTheories = [
    "Establishing authority immediately.", "Clarity and brevity are essential.", "Planning logistics avoids operational delays.", "Time management shows respect.", "Building rapport smoothly.",
    "Defining responsibilities clearly.", "Professional tone on calls.", "Direct but polite commands.", "Accountability without blame.", "Networking builds strategic alliances.",
    "Agendas keep discussions on track.", "Finding mutual benefit.", "Data drives executive decisions.", "De-escalating workplace tension.", "Constructive critiques improve output.",
    "Tracking milestones effectively.", "Summarizing complex information.", "Highlighting relevant achievements.", "Understanding consumer needs.", "Evaluating quarterly performance.",
    "Macroeconomic indicators matter.", "Swift action mitigates disaster.", "Precision in financial discourse.", "Due diligence is critical.", "Engaging large audiences.",
    "Reading between the lines.", "Binding agreements require exactness.", "Sustainability as a competitive advantage.", "Long-term vision execution.", "Presenting to the board confidently.",
    "Nuance separates leaders from managers.", "Influencing without authority.", "Adapting to international norms.", "Predicting market shifts.", "Levity builds trust when used right.",
    "Deflecting aggressive inquiries.", "Crafting messaging for principals.", "Tactful communication under pressure.", "Strategic pauses speak volumes.", "Navigating global stakes.",
    "Aligning teams with mission.", "Managing expectations of key players.", "Preparing for public markets.", "Ensuring compliance and ethics.", "Leading by example.",
    "Guiding teams through transitions.", "Communicating with shareholders.", "Identifying potential pitfalls.", "Preparing future leaders.", "Running an annual meeting.",
    "Adapting to rapid innovation.", "Understanding decentralized finance.", "Navigating medical breakthroughs.", "Pivoting to renewable energy.", "Optimizing global distribution.",
    "Maintaining premium brand value.", "Managing large-scale properties.", "Securing startup funding.", "Protecting digital assets.", "Scaling a business to a billion dollars."
];

const uniqueQuestions = [
    "What is the key to a professional intro?", "How should you start a formal email?", "Why is travel logistics important?", "What's the best way to schedule a meeting?", "How do you master small talk?",
    "How to describe a job role?", "What is phone etiquette?", "How to give instructions?", "How to apologize professionally?", "What is the goal of networking?",
    "Why are agendas crucial?", "What is negotiation?", "How to present data?", "How to resolve conflicts?", "What is feedback?",
    "What is project management?", "How to write a report?", "How to act in an interview?", "What is marketing?", "What is a quarterly review?",
    "What is market analysis?", "How to manage a crisis?", "Why learn financial terms?", "What is M&A?", "How to speak in public?",
    "What is nuanced negotiation?", "Why are contracts important?", "What is ESG?", "What is corporate strategy?", "What is a board presentation?",
    "What are idiomatic expressions?", "How to use persuasion?", "What is cultural intelligence?", "What is advanced economics?", "How to use humor?",
    "How to handle hostile Q&A?", "What is ghostwriting?", "What is diplomatic language?", "Why interpret silence?", "What is a global summit?",
    "What is organizational vision?", "Who are stakeholders?", "What is an IPO?", "What is corporate governance?", "What is leadership philosophy?",
    "What is change management?", "What is investor relations?", "What is risk assessment?", "What is succession planning?", "What is a shareholder meeting?",
    "What is tech disruption?", "What is fintech?", "What is biotech?", "What is green energy?", "What is supply chain?",
    "What is luxury management?", "What is real estate?", "What is venture capital?", "What is cybersecurity?", "What is a unicorn?"
];

let counter = 0;
let output = `// ARCHIVO: frontend/data/proLessons.ts

export const lessons: Record<string, any> = {};\n\n`;

for (const [level, titles] of Object.entries(CURRICULUM_TITLES)) {
    titles.forEach((title, i) => {
        const id = `pro-${level}-${i+1}`;
        const theory = uniqueTheories[counter] || "Mastering advanced communication strategies.";
        const question = uniqueQuestions[counter] || "What is the main objective of this topic?";
        const parts = title.split(" ").slice(0, 4);
        if (parts.length < 3) parts.push("strategy", "implementation");
        
        output += `lessons['${id}'] = {
  id: '${id}',
  title: '${title.replace(/'/g, "\\'")}',
  stages: [
    {
      id: 'stage-1',
      type: 'theory',
      title: 'Concept: ${title.replace(/'/g, "\\'")}',
      parts: [
        {
          visual: 'Welcome to the ${level.toUpperCase()} module: ${title.replace(/'/g, "\\'")}.\\n\\n${theory.replace(/'/g, "\\'")}\\n\\nIn this lesson, we focus on high-level vocabulary and scenarios relevant to this topic.',
          audio: 'Welcome to the lesson on ${title.replace(/'/g, "\\'")}. Let\\'s begin.'
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
          question: '${question.replace(/'/g, "\\'")}',
          options: [
            'To demonstrate strategic competence and clarity.',
            'To minimize operational risks and liabilities.',
            'To foster cross-functional collaboration.',
            'To optimize resource allocation.'
          ],
          correct_answer: 'To demonstrate strategic competence and clarity.',
          explanation: 'Clarity and competence are the pillars of executive communication.'
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
          question: 'Construct the professional statement:',
          parts: ${JSON.stringify(parts)},
          correct_order: ${JSON.stringify(parts)},
          explanation: 'Standard strategic phrasing.'
        }
      ]
    }
  ]
};\n\n`;
        counter++;
    });
}

fs.writeFileSync('c:/Users/jeico/onixlingo/language-ai-tutor/frontend/data/proLessons.ts', output);
console.log("proLessons.ts generated successfully with 60 unique lessons!");
