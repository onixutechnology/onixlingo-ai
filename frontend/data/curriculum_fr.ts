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
        'L\'Alphabet et les Sons', 'Les Salutations Simples', 'Les Premiers Nombres', 
        'Les Couleurs de Base', 'Les Jours et le Temps', 'Les Pronoms et Être', 
        'L\'Espace de Travail', 'Chiffres et Budgets', 'La Routine de Bureau', 'Révision Générale A1'
      ][i],
      description: [
        'L\'alphabet et l\'épellation de base.', 'Dire bonjour et se présenter.', 'Compter de 1 à 10 au bureau.',
        'Décrire les objets de travail.', 'Les jours de la semaine.', 'Le verbe Être et les personnes.',
        'Vocabulaire basique du bureau.', 'Nombres 10-20 et prix simples.', 'Actions quotidiennes simples.', 'Bilan et examen final du niveau A1.'
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
      title: [
        'Se Présenter Pro', 'Décrire ses Tâches', 'Fixer un RDV', 
        'Demander des Infos', 'Parler du Passé', 'Déplacements Pro', 
        'Répondre au Tél', 'Problèmes de Bureau', 'Donner des Directives', 'Révision Générale A2'
      ][i],
      description: [
        'Parler de son poste et responsabilités.', 'Décrire la routine et tâches quotidiennes.', 'Organiser des réunions et rendez-vous.',
        'Poser des questions et demander de l\'aide.', 'Rapporter des projets déjà terminés.', 'Transports et voyages d\'affaires.',
        'Expressions clés pour appels professionnels.', 'Gérer les pannes et retards simples.', 'Donner des instructions et déléguer.', 'Bilan et examen final du niveau A2.'
      ][i],
      type: 'lecture',
      locked: true,
      completed: false,
      stars: 0,
      position: (['center', 'left', 'center', 'right'][i % 4] as any),
      aiPrompt: `Roleplay for A2 French: ${['Introduce yourself professionally', 'Describe your daily tasks', 'Book a meeting'][i % 3]}`
    }))
  },
  {
    id: 'FR-B1',
    title: 'Niveau B1 : Management',
    description: 'Gérer des équipes et des négociations simples.',
    color: 'orange',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `fr-b1-${i + 1}`,
      title: [
        'Plan de Projet', 'Déléguer des Tâches', 'Animer une Réunion', 
        'Négocier un Budget', 'Gérer un Conflit', 'Évaluation de Perf', 
        'Présenter Résultats', 'Décider en Équipe', 'Objectifs Trimestriels', 'Bilan Management B1'
      ][i],
      description: [
        'Planification de projet et délais futurs.', 'Assignation de responsabilités au sein de l\'équipe.', 'Conduire et modérer une réunion d\'équipe.',
        'Défense et négociation de budget commercial.', 'Médiation et résolution de tensions internes.', 'Feedback constructif et évaluations annuelles.',
        'Exposition de rapports et résultats de ventes.', 'Prise de décision stratégique collective.', 'Définir les KPIs clés du trimestre.', 'Examen et bilan final du niveau B1.'
      ][i],
      type: 'lecture',
      locked: true,
      completed: false,
      stars: 0,
      position: (['center', 'left', 'center', 'right'][i % 4] as any),
      aiPrompt: `Roleplay for B1 French: ${['Negotiate a budget', 'Handle a team conflict', 'Present financial results'][i % 3]}`
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
