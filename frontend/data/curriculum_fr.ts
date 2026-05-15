import { LevelSection } from './curriculum';

export const CURRICULUM_FR: LevelSection[] = [
  {
    id: 'FR-A1',
    title: 'Niveau A1 : Survie en Entreprise',
    description: 'Bases indispensables pour naviguer dans un environnement francophone.',
    color: 'emerald',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `fr-a1-${i + 1}`,
      title: [
        'Premier Contact', 'L\'Espace de Travail', 'Chiffres et Budgets', 
        'Gestion du Temps', 'La Routine de Bureau', 'Le Déjeuner d\'Affaires', 
        'Appels de Base', 'Déplacements Urbains', 'Check-in Hôtel', 'Révision A1'
      ][i],
      description: [
        'Salutations et To Be.', 'Objets du bureau.', 'Prix et quantités.',
        'Heures et planning.', 'Habitudes quotidiennes.', 'Commander au resto.',
        'Prendre un message.', 'Itinéraires.', 'Logistique voyage.', 'Bilan du niveau.'
      ][i],
      type: 'lecture',
      locked: i === 0 ? false : true,
      completed: false,
      stars: 0,
      position: (['center', 'left', 'center', 'right'][i % 4] as any),
      aiPrompt: `Roleplay for A1 French: ${['Introduce yourself', 'Describe office items', 'Handle numbers'][i % 3]}`
    }))
  },
  {
    id: 'FR-A2',
    title: 'Niveau A2 : Opérations Quotidiennes',
    description: 'Communiquer sur les tâches et les projets en cours.',
    color: 'blue',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `fr-a2-${i + 1}`,
      title: `Opérations Pt. ${i + 1}`,
      description: 'Communication opérationnelle.',
      type: 'chat',
      locked: true,
      completed: false,
      stars: 0,
      position: (['center', 'left', 'center', 'right'][i % 4] as any),
      aiPrompt: 'Handle daily operations in French.'
    }))
  },
  {
    id: 'FR-B1',
    title: 'Niveau B1 : Management',
    description: 'Gérer des équipes et des négociations simples.',
    color: 'orange',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `fr-b1-${i + 1}`,
      title: `Management Pt. ${i + 1}`,
      description: 'Gestion intermédiaire.',
      type: 'grammar',
      locked: true,
      completed: false,
      stars: 0,
      position: (['center', 'left', 'center', 'right'][i % 4] as any),
      aiPrompt: 'Manage teams in French.'
    }))
  },
  {
    id: 'FR-B2',
    title: 'Niveau B2 : Expertise',
    description: 'Analyse complexe et leadership avancé.',
    color: 'purple',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `fr-b2-${i + 1}`,
      title: `Expertise Pt. ${i + 1}`,
      description: 'Niveau avancé.',
      type: 'listening',
      locked: true,
      completed: false,
      stars: 0,
      position: (['center', 'left', 'center', 'right'][i % 4] as any),
      aiPrompt: 'Expert level French.'
    }))
  },
  {
    id: 'FR-C1',
    title: 'Niveau C1 : Stratégie',
    description: 'Persuasion et diplomatie de haut niveau.',
    color: 'emerald',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `fr-c1-${i + 1}`,
      title: `Stratégie Pt. ${i + 1}`,
      description: 'Niveau autonome.',
      type: 'chat',
      locked: true,
      completed: false,
      stars: 0,
      position: (['center', 'left', 'center', 'right'][i % 4] as any),
      aiPrompt: 'Strategic French.'
    }))
  },
  {
    id: 'FR-C2',
    title: 'Niveau C2 : Maîtrise Totale',
    description: 'L\'excellence dans la langue française.',
    color: 'blue',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `fr-c2-${i + 1}`,
      title: `Maîtrise Pt. ${i + 1}`,
      description: 'Niveau expert absolu.',
      type: 'lecture',
      locked: true,
      completed: false,
      stars: 0,
      position: (['center', 'left', 'center', 'right'][i % 4] as any),
      aiPrompt: 'Master level French.'
    }))
  }
];
