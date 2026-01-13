export type ExerciseType = 'chat' | 'grammar' | 'listening' | 'toeic_mock' | 'lecture';

// 1. Estructura del Nodo (La lección individual)
export interface LessonNode {
  id: string; // DEBE COINCIDIR EXACTAMENTE con el nombre del archivo JSON en backend
  title: string;
  description: string;
  type: ExerciseType;
  
  // Gamification & UI
  locked: boolean;
  completed: boolean;
  stars: 0 | 1 | 2 | 3;
  position: 'left' | 'center' | 'right'; 
  
  // Prompt de Respaldo para la IA
  aiPrompt: string;
}

// 2. Estructura de la Sección (El Nivel)
export interface LevelSection {
  id: string;
  title: string;
  description: string;
  color: 'emerald' | 'blue' | 'orange' | 'purple'; 
  lessons: LessonNode[];
}

export const CURRICULUM: LevelSection[] = [
  // --- NIVEL A1: BEGINNER (Archivos: pro-a1-X.json) ---
  {
    id: 'A1',
    title: 'Nivel A1: Foundations',
    description: 'Fundamentos ejecutivos y supervivencia.',
    color: 'emerald',
    lessons: [
      { 
        id: 'a1-1', 
        title: 'The Networking Event', 
        description: 'Identity & To Be.',
        type: 'lecture', 
        locked: false, completed: false, stars: 0, position: 'center',
        aiPrompt: 'Roleplay: Networking event. User introduces themselves using To Be.'
      },
      { 
        id: 'a1-2', 
        title: 'Time Mastery', 
        description: 'Logistics & Schedules.',
        type: 'grammar', 
        locked: true, completed: false, stars: 0, position: 'left',
        aiPrompt: 'Practice telling time and scheduling meetings.'
      },
      { 
        id: 'a1-3', 
        title: 'Budget & Numbers', 
        description: 'Currency & Prices.',
        type: 'chat', 
        locked: true, completed: false, stars: 0, position: 'center',
        aiPrompt: 'Negotiation practice involving numbers and prices.'
      },
      { 
        id: 'a1-4', 
        title: 'Daily Routine', 
        description: 'Habits & Productivity.',
        type: 'chat', 
        locked: true, completed: false, stars: 0, position: 'right',
        aiPrompt: 'Discuss daily work routines using Present Simple.'
      },
      { 
        id: 'a1-5', 
        title: 'Office Navigation', 
        description: 'Locations & Directions.',
        type: 'grammar', 
        locked: true, completed: false, stars: 0, position: 'center',
        aiPrompt: 'Give and receive directions within an office building.'
      },
      { 
        id: 'a1-6', 
        title: 'The Business Lunch', 
        description: 'Hospitality & Ordering.',
        type: 'listening', 
        locked: true, completed: false, stars: 0, position: 'left',
        aiPrompt: 'Order a meal professionally with a client.'
      },
      { 
        id: 'a1-7', 
        title: 'Business Trip', 
        description: 'Travel Logistics.',
        type: 'chat', 
        locked: true, completed: false, stars: 0, position: 'center',
        aiPrompt: 'Check-in at an airport and handle travel scenarios.'
      }
    ]
  },

  // --- NIVEL A2: ELEMENTARY (Archivos: pro-a2-X.json) ---
  {
    id: 'A2',
    title: 'Nivel A2: Operations',
    description: 'Reportes pasados y planes futuros.',
    color: 'blue',
    lessons: [
      { 
        id: 'a2-1', // ID Corregido para coincidir con backend
        title: 'Project Update', 
        description: 'Past Simple Reporting.',
        type: 'chat', 
        locked: true, completed: false, stars: 0, position: 'center',
        aiPrompt: 'Report on what happened last week using Past Simple.'
      },
      { 
        id: 'a2-2', // ID Corregido
        title: 'Future Forecast', 
        description: 'Planning with Going To.',
        type: 'grammar', 
        locked: true, completed: false, stars: 0, position: 'right',
        aiPrompt: 'Discuss project plans for the next quarter.'
      },
      { 
        id: 'a2-3', // ID Corregido
        title: 'Tech Support', 
        description: 'Troubleshooting basics.',
        type: 'listening', 
        locked: true, completed: false, stars: 0, position: 'left',
        aiPrompt: 'Explain a technical problem simply.'
      },
      // --- NUEVAS LECCIONES A2 ---
      { 
        id: 'a2-4', 
        title: 'Client Call', 
        description: 'Phone Etiquette.',
        type: 'chat', 
        locked: true, completed: false, stars: 0, position: 'center',
        aiPrompt: 'Handle a phone call taking a message for a colleague.'
      },
      { 
        id: 'a2-5', 
        title: 'Office Safety', 
        description: 'Modals & Rules.',
        type: 'grammar', 
        locked: true, completed: false, stars: 0, position: 'right',
        aiPrompt: 'Explain safety rules using must, should, and have to.'
      },
      { 
        id: 'a2-6', 
        title: 'Inventory Check', 
        description: 'Countable vs Uncountable.',
        type: 'lecture', 
        locked: true, completed: false, stars: 0, position: 'center',
        aiPrompt: 'Discuss stock levels and office supplies.'
      },
      { 
        id: 'a2-7', 
        title: 'Scheduling Conflicts', 
        description: 'Present Continuous.',
        type: 'chat', 
        locked: true, completed: false, stars: 0, position: 'left',
        aiPrompt: 'Reschedule a meeting due to a conflict.'
      }
    ]
  },

  // --- NIVEL B1: INTERMEDIATE (Archivos: pro-b1-X.json) ---
  {
    id: 'B1',
    title: 'Nivel B1: Management',
    description: 'Negociación y comunicación formal.',
    color: 'orange',
    lessons: [
      { 
        id: 'b1-1', 
        title: 'The Elevator Pitch', 
        description: 'Professional Intros.',
        type: 'chat', 
        locked: true, completed: false, stars: 0, position: 'center',
        aiPrompt: 'Deliver a persuasive 30-second introduction.'
      },
      { 
        id: 'b1-2', 
        title: 'Crisis Management', 
        description: 'Formal Emailing.',
        type: 'grammar', 
        locked: true, completed: false, stars: 0, position: 'right',
        aiPrompt: 'Write a formal apology email to a client.'
      },
      // --- NUEVAS LECCIONES B1 ---
      { 
        id: 'b1-3', 
        title: 'Negotiation Tactics', 
        description: 'First Conditional.',
        type: 'chat', 
        locked: true, completed: false, stars: 0, position: 'left',
        aiPrompt: 'Negotiate a deal using if-clauses.'
      },
      { 
        id: 'b1-4', 
        title: 'Performance Review', 
        description: 'Giving Feedback.',
        type: 'listening', 
        locked: true, completed: false, stars: 0, position: 'center',
        aiPrompt: 'Give constructive feedback to an employee.'
      },
      { 
        id: 'b1-5', 
        title: 'Market Trends', 
        description: 'Comparatives & Data.',
        type: 'lecture', 
        locked: true, completed: false, stars: 0, position: 'right',
        aiPrompt: 'Describe charts and graphs comparing sales data.'
      },
      { 
        id: 'b1-6', 
        title: 'Leading a Meeting', 
        description: 'Phrasal Verbs.',
        type: 'chat', 
        locked: true, completed: false, stars: 0, position: 'center',
        aiPrompt: 'Chair a meeting and keep participants on track.'
      },
      { 
        id: 'b1-7', 
        title: 'Strategic Planning', 
        description: 'Future Perfect.',
        type: 'grammar', 
        locked: true, completed: false, stars: 0, position: 'left',
        aiPrompt: 'Discuss goals achieved by a certain date in the future.'
      }
    ]
  },

  // --- CERTIFICACIÓN: TOEIC (Archivos: toeic_X.json) ---
  {
    id: 'TOEIC',
    title: 'TOEIC® Mastery',
    description: 'Certificación Profesional.',
    color: 'purple',
    lessons: [
      { 
        id: 'toeic_listening', 
        title: 'Photo Description', 
        description: 'Part 1: Visual Analysis.',
        type: 'listening', 
        locked: true, completed: false, stars: 0, position: 'left',
        aiPrompt: 'Analyze business photographs strictly following TOEIC format.'
      },
      { 
        id: 'toeic_reading', 
        title: 'Incomplete Sentences', 
        description: 'Part 5: Grammar Precision.',
        type: 'grammar', 
        locked: true, completed: false, stars: 0, position: 'right',
        aiPrompt: 'Fill in the blanks with precise business grammar.'
      },
      { 
        id: 'toeic_speaking', 
        title: 'Express an Opinion', 
        description: 'Question 11: Logic.',
        type: 'chat', 
        locked: true, completed: false, stars: 0, position: 'center',
        aiPrompt: 'State an opinion and support it with reasons.'
      },
      { 
        id: 'toeic_writing', 
        title: 'Email Response', 
        description: 'Questions 6-7.',
        type: 'toeic_mock', 
        locked: true, completed: false, stars: 0, position: 'left',
        aiPrompt: 'Respond to a written request with specific requirements.'
      }
    ]
  }
];

// --- Helper para búsqueda rápida ---
export function getLessonById(id: string): LessonNode | undefined {
    for (const section of CURRICULUM) {
        const lesson = section.lessons.find(l => l.id === id);
        if (lesson) return lesson;
    }
    return undefined;
}