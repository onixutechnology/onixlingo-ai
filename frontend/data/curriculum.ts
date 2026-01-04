export type ExerciseType = 'chat' | 'grammar' | 'listening' | 'toeic_mock' | 'lecture';

// 1. Definimos la estructura del Nodo (La bolita en el mapa)
export interface LessonNode {
  id: string; // DEBE COINCIDIR con el nombre del archivo JSON en backend (ej: pro-a1-1)
  title: string;
  description: string;
  type: ExerciseType;
  
  // Propiedades Visuales (Gamification)
  locked: boolean;
  completed: boolean;
  stars: 0 | 1 | 2 | 3;
  position: 'left' | 'center' | 'right'; // Para el efecto zig-zag
  
  // LA MAGIA: El prompt que se enviará a Gemini (Fallback si no hay JSON)
  aiPrompt: string;
}

// 2. Definimos la Sección (El Mundo: A1, A2, etc.)
export interface LevelSection {
  id: string;
  title: string;
  description: string;
  color: string; // 'emerald', 'blue', 'orange', 'purple'
  lessons: LessonNode[];
}

export const CURRICULUM: LevelSection[] = [
  // --- MUNDO 1: NIVEL A1 (Principiante) ---
  {
    id: 'A1',
    title: 'Nivel A1: Beginner',
    description: 'Fundamentos, saludos y supervivencia.',
    color: 'emerald', // Verde Duolingo
    lessons: [
      { 
        id: 'pro-a1-1',  // ID SINCRONIZADO CON BACKEND
        title: 'Hello & To Be', 
        description: 'Preséntate y usa el verbo ser/estar.',
        type: 'lecture', 
        locked: false, 
        completed: false, 
        stars: 0, 
        position: 'center',
        aiPrompt: 'The user is a complete beginner (A1). Your goal is to teach the Verb "To Be" (am, is, are). Start by explaining it simply in Spanish, then ask the user to introduce themselves. Correct every mistake gently.'
      },
      { 
        id: 'pro-a1-2', // ID SINCRONIZADO CON BACKEND
        title: 'Time Mastery', 
        description: 'Pasado, Presente y Futuro.',
        type: 'grammar', 
        locked: true, 
        completed: false, 
        stars: 0, 
        position: 'left',
        aiPrompt: 'Teach numbers 1-20 and how to ask "How old are you?". Practice with the user by asking their age and the age of family members.'
      },
      { 
        id: 'pro-a1-3', // ID SINCRONIZADO CON BACKEND
        title: 'Daily Routine', 
        description: 'Present Simple para rutinas.',
        type: 'chat', 
        locked: true, 
        completed: false, 
        stars: 0, 
        position: 'center',
        aiPrompt: 'Teach the Present Simple tense for routines. Focus on the third person "s" (he runs, she eats). Ask the user what they do in the morning.'
      },
      { 
        id: 'pro-a1-4', // ID SINCRONIZADO CON BACKEND
        title: 'Food & Ordering', 
        description: 'Pide comida en un restaurante.',
        type: 'listening', 
        locked: true, 
        completed: false, 
        stars: 0, 
        position: 'right',
        aiPrompt: 'Roleplay: You are a waiter in a London cafe. The user is the customer. Guide them to order breakfast using "I would like" or "Can I have".'
      },
      { 
        id: 'a1-boss', 
        title: 'Checkpoint A1', 
        description: 'Demuestra que ya no eres novato.',
        type: 'toeic_mock', 
        locked: true, 
        completed: false, 
        stars: 0, 
        position: 'center',
        aiPrompt: 'Conduct a mini-test covering To Be, Numbers, and Routines. Ask 5 rapid-fire questions. If they fail 2, tell them to study more.'
      },
    ]
  },

  // --- MUNDO 2: NIVEL A2 (Elemental) ---
  {
    id: 'A2',
    title: 'Nivel A2: Elementary',
    description: 'Pasado simple, viajes y anécdotas.',
    color: 'blue',
    lessons: [
      { 
        id: 'a2-1', 
        title: 'Last Weekend', 
        description: 'Uso del Past Simple.',
        type: 'chat', 
        locked: true, 
        completed: false, 
        stars: 0, 
        position: 'center',
        aiPrompt: 'Focus on Past Simple (Regular and Irregular verbs). Ask the user what they did last weekend. Correct usage of "did" and "didn\'t".'
      },
      { 
        id: 'a2-2', 
        title: 'Travel Plans', 
        description: 'Future with Going To.',
        type: 'grammar', 
        locked: true, 
        completed: false, 
        stars: 0, 
        position: 'left',
        aiPrompt: 'Teach "Going to" for future plans. Ask the user where they are going to go on their next vacation.'
      },
    ]
  },

  // --- MUNDO 3: NIVEL B1 (Executive Foundation - PRO) ---
  {
    id: 'exec-b1', // ID COINCIDE CON DASHBOARD PRO
    title: 'Nivel B1: Intermediate',
    description: 'Opiniones complejas y trabajo.',
    color: 'orange',
    lessons: [
      { 
        id: 'pro-b1-1', // ID SINCRONIZADO CON BACKEND (Generado en fix_lesson.py)
        title: 'Professional Intro', 
        description: 'Networking de alto nivel.',
        type: 'chat', 
        locked: true, 
        completed: false, 
        stars: 0, 
        position: 'center',
        aiPrompt: 'Roleplay: You are a CEO. The user must introduce themselves professionally. Accept only "Good morning" or "How do you do".'
      },
      { 
        id: 'pro-b1-2', 
        title: 'Formal Emailing', 
        description: 'Redacción corporativa.',
        type: 'grammar', 
        locked: true, 
        completed: false, 
        stars: 0, 
        position: 'right',
        aiPrompt: 'Teach formal email structure: Subject line, Salutation (Dear Mr./Ms.), Body, and Sign-off (Sincerely).'
      }
    ]
  },

  // --- MUNDO FINAL: TOEIC PREP ---
  {
    id: 'TOEIC',
    title: 'TOEIC® Mastery',
    description: 'Certificación Profesional.',
    color: 'purple',
    lessons: [
      { 
        id: 'toeic-listening', 
        title: 'Photo Description', 
        description: 'Part 1 del examen.',
        type: 'listening', 
        locked: true, 
        completed: false, 
        stars: 0, 
        position: 'left',
        aiPrompt: 'TOEIC Part 1 Practice: Describe a complex scene (e.g., a busy office) and ask the user to choose the statement that best describes it.'
      },
      { 
        id: 'toeic-final', 
        title: 'FULL SIMULATION', 
        description: 'El Jefe Final (990 Puntos).',
        type: 'toeic_mock', 
        locked: true, 
        completed: false, 
        stars: 0, 
        position: 'center',
        aiPrompt: 'ACT AS A TOEIC EXAMINER. Do not teach. Do not explain. You will conduct a simulated test covering: 1. Listening (describe an image), 2. Speaking (express an opinion), 3. Reading/Grammar check. Evaluate strictly on a scale of 0-990.'
      }
    ]
  }
];

// --- Utility Helper ---
// Esto nos servirá para encontrar la lección rápido cuando hagamos click
export function getLessonById(id: string): LessonNode | undefined {
    for (const section of CURRICULUM) {
        const lesson = section.lessons.find(l => l.id === id);
        if (lesson) return lesson;
    }
    return undefined;
}