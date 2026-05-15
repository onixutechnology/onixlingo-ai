import { Users, PieChart, Briefcase, Crown, Building, Globe } from 'lucide-react';

export const PRO_CURRICULUM_FR = [
  {
    id: 'exec-fr-b1',
    title: 'Fondations Exécutives (B1)',
    level: 'B1',
    color: 'slate',
    icon: Users,
    description: 'Bases de la communication d\'entreprise, étiquette et réseautage essentiel.',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `pro-b1-${i + 1}`, 
      title: i === 0 ? 'Introductions Professionnelles' : i === 1 ? 'Emails Formels' : i === 2 ? 'Voyages d\'Affaires' : i === 9 ? 'Révision B1' : `Communication Corporative Pt. ${i + 1}`, 
      desc: 'Compétences essentielles pour le quotidien corporatif.'
    }))
  },
  {
    id: 'exec-fr-b2',
    title: 'Gestion et Management (B2)',
    level: 'B2',
    color: 'blue',
    icon: PieChart,
    description: 'Gestion d\'équipe, leadership intermédiaire et résolution de conflits.',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `pro-b2-${i + 1}`, 
      title: i === 0 ? 'Réunions Efficaces' : i === 1 ? 'Bases de la Négociation' : i === 9 ? 'Révision B2' : `Gestion d'Équipe Pt. ${i + 1}`, 
      desc: 'Compétences pour le management intermédiaire.'
    }))
  },
  {
    id: 'exec-fr-c1',
    title: 'Stratégie Avancée (C1)',
    level: 'C1',
    color: 'indigo',
    icon: Briefcase,
    description: 'Négociations de haut niveau, persuasion et présentations aux investisseurs.',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `pro-c1-${i + 1}`, 
      title: i === 0 ? 'Pitch aux Investisseurs' : i === 1 ? 'Gestion de Crise' : i === 9 ? 'Révision C1' : `Stratégie Avancée Pt. ${i + 1}`, 
      desc: 'Maîtrise avancée du français des affaires.'
    }))
  },
  {
    id: 'exec-fr-c2',
    title: 'Présence Exécutive (C2)',
    level: 'C2',
    color: 'purple',
    icon: Crown,
    description: 'Maîtrise totale de la langue, diplomatie corporative et art oratoire.',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `pro-c2-${i + 1}`, 
      title: i === 0 ? 'Art Oratoire pour PDG' : i === 1 ? 'Phrasé Diplomatique' : i === 9 ? 'Révision C2' : `Éloquence Exécutive Pt. ${i + 1}`, 
      desc: 'Le plus haut niveau d\'éloquence.'
    }))
  },
  {
    id: 'exec-fr-exec',
    title: 'Dynamique du Conseil (Exec)',
    level: 'Exec',
    color: 'amber',
    icon: Building,
    description: 'Français spécialisé pour les conseils d\'administration, M&A et stratégie globale.',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `pro-exec-${i + 1}`, 
      title: i === 0 ? 'Vocabulaire M&A' : i === 1 ? 'Réunions du Conseil' : i === 9 ? 'Révision Exec' : `Tactiques du Conseil Pt. ${i + 1}`, 
      desc: 'Cas réels de la haute direction.'
    }))
  },
  {
    id: 'exec-fr-mastery',
    title: 'Leadership Global (Mastery)',
    level: 'Mastery',
    color: 'rose',
    icon: Globe,
    description: 'Le degré maximum. Communication interculturelle et expansion internationale.',
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `pro-mastery-${i + 1}`, 
      title: i === 0 ? 'Leadership Interculturel' : i === 1 ? 'Expansion Marché Global' : i === 9 ? 'Évaluation Finale' : `Business Global Pt. ${i + 1}`, 
      desc: 'Conquérir le marché international.'
    }))
  }
];
