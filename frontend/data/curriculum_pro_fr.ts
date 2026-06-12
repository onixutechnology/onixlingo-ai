import { Users, PieChart, Briefcase, Crown, Building, Globe } from 'lucide-react';

// ================================================================
// ONIXLINGO PRO EXECUTIVE CURRICULA - 30 NIVELES × 100 LECCIONES = 3,000 TOTAL
// ================================================================

const TITLES_B1_EN = [
  "Professional Introductions",
  "Formal Emailing",
  "Business Travel Logistics",
  "Scheduling Meetings",
  "Office Small Talk",
  "Describing Job Roles",
  "Telephone Etiquette",
  "Giving Instructions",
  "Professional Apologies",
  "B1 Milestone: Networking Event"
];

const TITLES_B2_EN = [
  "Leading Effective Meetings",
  "Negotiation Fundamentals",
  "Data Presentation",
  "Conflict Resolution",
  "Performance Feedback",
  "Project Management Terms",
  "Writing Reports",
  "Job Interviews",
  "Marketing Basics",
  "B2 Milestone: Quarterly Review"
];

const TITLES_C1_EN = [
  "Global Market Analysis",
  "Crisis Management",
  "Financial Terminology",
  "Mergers & Acquisitions",
  "Public Speaking",
  "Nuanced Negotiation",
  "Legal Contracts",
  "ESG & Sustainability",
  "Corporate Strategy",
  "C1 Milestone: Board Presentation"
];

const TITLES_C2_EN = [
  "Idiomatic Business Expressions",
  "Subtlety & Persuasion",
  "Cultural Intelligence (CQ)",
  "Advanced Economics",
  "Humor in Business",
  "Hostile Q&A Handling",
  "Executive Ghostwriting",
  "Diplomatic Language",
  "Interpreting Silence",
  "C2 Milestone: Global Summit"
];

const TITLES_EXEC_EN = [
  "Organizational Vision",
  "Stakeholder Management",
  "IPO & Exit Strategies",
  "Corporate Governance",
  "Leadership Philosophy",
  "Change Management",
  "Investor Relations",
  "Risk Assessment",
  "Succession Planning",
  "Executive Milestone: Shareholder Meeting"
];

const TITLES_MASTERY_EN = [
  "AI & Tech Disruption",
  "Fintech & Blockchain",
  "Biotech Innovations",
  "Green Energy Transition",
  "Supply Chain Logistics",
  "Luxury Brand Management",
  "Real Estate Development",
  "Venture Capital Pitching",
  "Cybersecurity Protocols",
  "Mastery Capstone: Building a Unicorn"
];

const TITLES_B1_FR = [
  "Introductions Professionnelles",
  "E-mails Formels",
  "Logistique de Voyage d'Affaires",
  "Planification de Réunions",
  "Conversations de Bureau",
  "Description de Postes",
  "Étiquette Téléphonique",
  "Instructions Professionnelles",
  "Excuses Professionnelles",
  "Événement de Réseautage"
];

const TITLES_B2_FR = [
  "Conduite de Réunions Efficaces",
  "Bases de la Négociation",
  "Présentation de Données",
  "Résolution de Conflits",
  "Évaluation des Performances",
  "Termes de Gestion de Projet",
  "Rédaction de Rapports",
  "Entretiens d'Embauche",
  "Bases du Marketing",
  "Revue Trimestrielle"
];

const TITLES_C1_FR = [
  "Analyse du Marché Global",
  "Gestion de Crise",
  "Terminologie Financière",
  "Fusions & Acquisitions",
  "Prise de Parole en Public",
  "Négociation Nuancée",
  "Contrats Juridiques",
  "RSE & Durabilité",
  "Stratégie d'Entreprise",
  "Présentation au Conseil"
];

const TITLES_C2_FR = [
  "Expressions d'Affaires Idiomatiques",
  "Subtilité & Persuasion",
  "Intelligence Culturelle (CQ)",
  "Économie Avancée",
  "Humour dans les Affaires",
  "Gestion des Questions Hostiles",
  "Rédaction pour Dirigeants",
  "Langage Diplomatique",
  "Interprétation du Silence",
  "Sommet Global"
];

const TITLES_EXEC_FR = [
  "Vision Organisationnelle",
  "Gestion des Parties Prenantes",
  "IPO & Stratégies de Sortie",
  "Gouvernance d'Entreprise",
  "Philosophie de Leadership",
  "Gestion du Changement",
  "Relations Investisseurs",
  "Évaluation des Risques",
  "Planification de Succession",
  "Réunion des Actionnaires"
];

const TITLES_MASTERY_FR = [
  "Disruption Tech & IA",
  "Fintech & Blockchain",
  "Innovations Biotech",
  "Transition Énergétique Verte",
  "Logistique de la Chaîne d'Approvisionnement",
  "Gestion des Marques de Luxe",
  "Développement Immobilier",
  "Pitch de Capital Risque",
  "Protocoles de Cybersécurité",
  "Création d'une Licorne"
];

const ICON_MAP: Record<string, any> = {
  Users,
  PieChart,
  Briefcase,
  Crown,
  Building,
  Globe
};

const TEMPLATE_KEYS = ['b1', 'b2', 'c1', 'c2', 'exec', 'mastery'];

const buildProLessons = (blockId: string, lang: 'en' | 'fr', templateIdx: number): any[] => {
  const templateKey = TEMPLATE_KEYS[templateIdx];
  const rawTitles = lang === 'en' 
    ? (templateKey === 'b1' ? TITLES_B1_EN 
       : templateKey === 'b2' ? TITLES_B2_EN 
       : templateKey === 'c1' ? TITLES_C1_EN 
       : templateKey === 'c2' ? TITLES_C2_EN 
       : templateKey === 'exec' ? TITLES_EXEC_EN 
       : TITLES_MASTERY_EN)
    : (templateKey === 'b1' ? TITLES_B1_FR 
       : templateKey === 'b2' ? TITLES_B2_FR 
       : templateKey === 'c1' ? TITLES_C1_FR 
       : templateKey === 'c2' ? TITLES_C2_FR 
       : templateKey === 'exec' ? TITLES_EXEC_FR 
       : TITLES_MASTERY_FR);

  const lessons = [];
  for (let idx = 0; idx < 100; idx++) {
    const num = idx + 1;
    const id = `pro-${blockId}-${num}`;
    let title = rawTitles[idx % rawTitles.length];
    
    // Customize lesson title for blocks 6-29 to make them fully themed and professional
    if (templateIdx >= 0) {
      // Clean generic placeholders
      if (title.includes("Topic") || title.includes("Sujet")) {
        const domainName = blockId.replace("exec-fr-", "").replace("exec-", "").toUpperCase();
        title = lang === 'en' ? `${domainName} Scenario ${num}` : `${domainName} Scénario ${num}`;
      } else if (idx >= 10) {
        // Append distinct parts so that none of the 100 lessons inside a block repeat the exact same title
        const partNum = Math.floor(idx / 10) + 1;
        title = lang === 'fr' ? `${title} (Partie ${partNum})` : `${title} (Pt. ${partNum})`;
      }
    }
    
    lessons.push({ id, title });
  }
  return lessons;
};

export const PRO_CURRICULUM = [
  {
    id: 'exec-b1',
    title: 'Executive Foundation',
    level: 'B1',
    icon: ICON_MAP['Users'],
    description: 'Fundamentos de comunicación corporativa, etiqueta y networking esencial.',
    lessons: buildProLessons('exec-b1', 'en', 0)
  },
  {
    id: 'exec-b2',
    title: 'Management Skills',
    level: 'B2',
    icon: ICON_MAP['PieChart'],
    description: 'Gestión de equipos, liderazgo intermedio y resolución de conflictos.',
    lessons: buildProLessons('exec-b2', 'en', 1)
  },
  {
    id: 'exec-c1',
    title: 'Advanced Corporate',
    level: 'C1',
    icon: ICON_MAP['Briefcase'],
    description: 'Negociaciones de alto nivel, persuasión y presentaciones a inversionistas.',
    lessons: buildProLessons('exec-c1', 'en', 2)
  },
  {
    id: 'exec-c2',
    title: 'Executive Presence',
    level: 'C2',
    icon: ICON_MAP['Crown'],
    description: 'Dominio total del idioma, diplomacia corporativa y oratoria ejecutiva.',
    lessons: buildProLessons('exec-c2', 'en', 3)
  },
  {
    id: 'exec-exec',
    title: 'Corporativo Dynamics',
    level: 'Exec',
    icon: ICON_MAP['Building'],
    description: 'Inglés especializado para juntas directivas, M&A y estrategia global.',
    lessons: buildProLessons('exec-exec', 'en', 4)
  },
  {
    id: 'exec-mastery',
    title: 'Global Leadership',
    level: 'Mastery',
    icon: ICON_MAP['Globe'],
    description: 'El grado máximo. Comunicación intercultural y expansión internacional.',
    lessons: buildProLessons('exec-mastery', 'en', 5)
  },
  {
    id: 'exec-crisis',
    title: 'Crisis Management & PR',
    level: 'B1',
    icon: ICON_MAP['Users'],
    description: 'Gestión de la reputación de marca, comunicados de prensa y relaciones con medios.',
    lessons: buildProLessons('exec-crisis', 'en', 0)
  },
  {
    id: 'exec-ma',
    title: 'Mergers & Acquisitions',
    level: 'B2',
    icon: ICON_MAP['PieChart'],
    description: 'Estrategia de fusiones y adquisiciones, due diligence e integración corporativa.',
    lessons: buildProLessons('exec-ma', 'en', 1)
  },
  {
    id: 'exec-vc',
    title: 'Venture Capital & Funding',
    level: 'C1',
    icon: ICON_MAP['Briefcase'],
    description: 'Rondas de inversión, pitch decks, valoración de startups y negociación de contratos.',
    lessons: buildProLessons('exec-vc', 'en', 2)
  },
  {
    id: 'exec-fintech',
    title: 'FinTech & Digital Banking',
    level: 'C2',
    icon: ICON_MAP['Crown'],
    description: 'Operaciones de banca digital, criptoactivos, regulación y pasarelas de pago.',
    lessons: buildProLessons('exec-fintech', 'en', 3)
  },
  {
    id: 'exec-pr',
    title: 'Public Relations & Branding',
    level: 'Exec',
    icon: ICON_MAP['Building'],
    description: 'Estrategias de posicionamiento de marca, campañas y relaciones públicas de nivel directivo.',
    lessons: buildProLessons('exec-pr', 'en', 4)
  },
  {
    id: 'exec-rhetoric',
    title: 'Advanced Rhetoric & Debates',
    level: 'Mastery',
    icon: ICON_MAP['Globe'],
    description: 'Oratoria persuasiva de alta dirección, manejo de debates y argumentación estratégica.',
    lessons: buildProLessons('exec-rhetoric', 'en', 5)
  },
  {
    id: 'exec-esg',
    title: 'ESG & Corporate Ethics',
    level: 'B1',
    icon: ICON_MAP['Users'],
    description: 'Gobernanza ambiental, social y ética corporativa en el ecosistema global.',
    lessons: buildProLessons('exec-esg', 'en', 0)
  },
  {
    id: 'exec-ai',
    title: 'AI Strategy & Tech Governance',
    level: 'B2',
    icon: ICON_MAP['PieChart'],
    description: 'Implementación de IA en el negocio, ética de datos y gobernanza tecnológica.',
    lessons: buildProLessons('exec-ai', 'en', 1)
  },
  {
    id: 'exec-logistics',
    title: 'Global Supply Chain',
    level: 'C1',
    icon: ICON_MAP['Briefcase'],
    description: 'Logística internacional, cadena de suministro, aduanas y contratos de distribución.',
    lessons: buildProLessons('exec-logistics', 'en', 2)
  },
  {
    id: 'exec-negotiation',
    title: 'Strategic Negotiations',
    level: 'C2',
    icon: ICON_MAP['Crown'],
    description: 'Tácticas de negociación avanzada, mediación y resolución de conflictos de interés.',
    lessons: buildProLessons('exec-negotiation', 'en', 3)
  },
  {
    id: 'exec-compliance',
    title: 'Corporate Compliance & Legal',
    level: 'Exec',
    icon: ICON_MAP['Building'],
    description: 'Cumplimiento normativo, auditorías éticas, prevención de lavado y marcos regulatorios.',
    lessons: buildProLessons('exec-compliance', 'en', 4)
  },
  {
    id: 'exec-media',
    title: 'Media Relations & Interviews',
    level: 'Mastery',
    icon: ICON_MAP['Globe'],
    description: 'Técnicas para entrevistas en televisión, conferencias de prensa y vocería de marca.',
    lessons: buildProLessons('exec-media', 'en', 5)
  },
  {
    id: 'exec-finance',
    title: 'Financial Advisory & Planning',
    level: 'B1',
    icon: ICON_MAP['Users'],
    description: 'Planificación financiera de nivel corporativo, presupuestos y reportes trimestrales.',
    lessons: buildProLessons('exec-finance', 'en', 0)
  },
  {
    id: 'exec-sourcing',
    title: 'Corporate Sourcing & Procurement',
    level: 'B2',
    icon: ICON_MAP['PieChart'],
    description: 'Abastecimiento estratégico, selección de proveedores globales y licitaciones.',
    lessons: buildProLessons('exec-sourcing', 'en', 1)
  },
  {
    id: 'exec-shareholders',
    title: 'Shareholder Governance',
    level: 'C1',
    icon: ICON_MAP['Briefcase'],
    description: 'Gobernanza de accionistas, asambleas generales y comités de compensación.',
    lessons: buildProLessons('exec-shareholders', 'en', 2)
  },
  {
    id: 'exec-launch',
    title: 'Product Launch & Marketing',
    level: 'C2',
    icon: ICON_MAP['Crown'],
    description: 'Estrategias Go-To-Market globales, campañas de lanzamiento y posicionamiento de producto.',
    lessons: buildProLessons('exec-launch', 'en', 3)
  },
  {
    id: 'exec-investors',
    title: 'Investor Relations',
    level: 'Exec',
    icon: ICON_MAP['Building'],
    description: 'Comunicación con accionistas, roadshows financieros y reportes de EBITDA.',
    lessons: buildProLessons('exec-investors', 'en', 4)
  },
  {
    id: 'exec-transformation',
    title: 'Digital Transformation',
    level: 'Mastery',
    icon: ICON_MAP['Globe'],
    description: 'Liderazgo de cambio tecnológico, modernización de sistemas y agilidad empresarial.',
    lessons: buildProLessons('exec-transformation', 'en', 5)
  },
  {
    id: 'exec-hr',
    title: 'Talent Sourcing & HR Strategy',
    level: 'B1',
    icon: ICON_MAP['Users'],
    description: 'Atracción de talento ejecutivo, cultura organizacional y compensaciones directivas.',
    lessons: buildProLessons('exec-hr', 'en', 0)
  },
  {
    id: 'exec-legal',
    title: 'Legal Strategy & Patents',
    level: 'B2',
    icon: ICON_MAP['PieChart'],
    description: 'Propiedad intelectual, patentes internacionales y litigio corporativo.',
    lessons: buildProLessons('exec-legal', 'en', 1)
  },
  {
    id: 'exec-risk',
    title: 'Executive Risk Management',
    level: 'C1',
    icon: ICON_MAP['Briefcase'],
    description: 'Evaluación y mitigación de riesgos de mercado, financieros y reputacionales.',
    lessons: buildProLessons('exec-risk', 'en', 2)
  },
  {
    id: 'exec-ipo',
    title: 'IPO & Listing Logistics',
    level: 'C2',
    icon: ICON_MAP['Crown'],
    description: 'Logística de cotización en bolsa, prospecto de colocación y roadshow de salida.',
    lessons: buildProLessons('exec-ipo', 'en', 3)
  },
  {
    id: 'exec-macro',
    title: 'Macroeconomic Strategy',
    level: 'Exec',
    icon: ICON_MAP['Building'],
    description: 'Análisis de mercados internacionales, geopolítica macroeconómica e impacto inflacionario.',
    lessons: buildProLessons('exec-macro', 'en', 4)
  },
  {
    id: 'exec-thesis',
    title: 'Alta Dirección Master Thesis',
    level: 'Mastery',
    icon: ICON_MAP['Globe'],
    description: 'Evaluación directiva final. Presentación de tesis ejecutiva ante consejo global.',
    lessons: buildProLessons('exec-thesis', 'en', 5)
  },
];

export const PRO_CURRICULUM_FR = [
  {
    id: 'exec-fr-b1',
    title: 'Fondations Exécutives',
    level: 'B1',
    icon: ICON_MAP['Users'],
    description: 'Bases de la communication d\'entreprise, étiquette et réseautage essentiel.',
    lessons: buildProLessons('exec-b1', 'fr', 0)
  },
  {
    id: 'exec-fr-b2',
    title: 'Compétences de Gestion',
    level: 'B2',
    icon: ICON_MAP['PieChart'],
    description: 'Gestion d\'équipe, leadership intermédiaire et résolution de conflits.',
    lessons: buildProLessons('exec-b2', 'fr', 1)
  },
  {
    id: 'exec-fr-c1',
    title: 'Entreprise Avancée',
    level: 'C1',
    icon: ICON_MAP['Briefcase'],
    description: 'Négociations de haut niveau, persuasion et présentations aux investisseurs.',
    lessons: buildProLessons('exec-c1', 'fr', 2)
  },
  {
    id: 'exec-fr-c2',
    title: 'Présence Executive',
    level: 'C2',
    icon: ICON_MAP['Crown'],
    description: 'Maîtrise totale de la langue, diplomatie d\'entreprise et prise de parole.',
    lessons: buildProLessons('exec-c2', 'fr', 3)
  },
  {
    id: 'exec-fr-exec',
    title: 'Dynamique du Conseil',
    level: 'Exec',
    icon: ICON_MAP['Building'],
    description: 'Français spécialisé pour les conseils d\'administration, M&A et stratégie globale.',
    lessons: buildProLessons('exec-exec', 'fr', 4)
  },
  {
    id: 'exec-fr-mastery',
    title: 'Leadership Global',
    level: 'Mastery',
    icon: ICON_MAP['Globe'],
    description: 'Le grade ultime. Communication interculturelle et expansion internationale.',
    lessons: buildProLessons('exec-mastery', 'fr', 5)
  },
  {
    id: 'exec-fr-crisis',
    title: 'Gestion de Crise & RP',
    level: 'B1',
    icon: ICON_MAP['Users'],
    description: 'Gestion de la réputation de la marque, communiqués de presse et relations médias.',
    lessons: buildProLessons('exec-crisis', 'fr', 0)
  },
  {
    id: 'exec-fr-ma',
    title: 'Fusions & Acquisitions',
    level: 'B2',
    icon: ICON_MAP['PieChart'],
    description: 'Stratégie de fusions et acquisitions, due diligence et intégration d\'entreprise.',
    lessons: buildProLessons('exec-ma', 'fr', 1)
  },
  {
    id: 'exec-fr-vc',
    title: 'Capital Risque & Financement',
    level: 'C1',
    icon: ICON_MAP['Briefcase'],
    description: 'Levées de fonds, pitch decks, valorisation de startups et négociation de contrats.',
    lessons: buildProLessons('exec-vc', 'fr', 2)
  },
  {
    id: 'exec-fr-fintech',
    title: 'FinTech & Banque Digitale',
    level: 'C2',
    icon: ICON_MAP['Crown'],
    description: 'Opérations de banque numérique, crypto-actifs, régulation et passerelles de paiement.',
    lessons: buildProLessons('exec-fintech', 'fr', 3)
  },
  {
    id: 'exec-fr-pr',
    title: 'Relations Publiques & Branding',
    level: 'Exec',
    icon: ICON_MAP['Building'],
    description: 'Stratégies de positionnement de marque, campagnes et relations publiques de direction.',
    lessons: buildProLessons('exec-pr', 'fr', 4)
  },
  {
    id: 'exec-fr-rhetoric',
    title: 'Rhétorique Avancée & Débats',
    level: 'Mastery',
    icon: ICON_MAP['Globe'],
    description: 'Prise de parole persuasive, gestion des débats et argumentation stratégique.',
    lessons: buildProLessons('exec-rhetoric', 'fr', 5)
  },
  {
    id: 'exec-fr-esg',
    title: 'ESG & Éthique des Affaires',
    level: 'B1',
    icon: ICON_MAP['Users'],
    description: 'Gouvernance environnementale, sociale et éthique des affaires dans l\'écosystème global.',
    lessons: buildProLessons('exec-esg', 'fr', 0)
  },
  {
    id: 'exec-fr-ai',
    title: 'Stratégie IA & Gouvernance Tech',
    level: 'B2',
    icon: ICON_MAP['PieChart'],
    description: 'Intégration de l\'IA dans l\'entreprise, éthique des données et gouvernance technologique.',
    lessons: buildProLessons('exec-ai', 'fr', 1)
  },
  {
    id: 'exec-fr-logistics',
    title: 'Chaîne d\'Approvisionnement',
    level: 'C1',
    icon: ICON_MAP['Briefcase'],
    description: 'Logistique internationale, chaîne d\'approvisionnement, douanes et contrats de distribution.',
    lessons: buildProLessons('exec-logistics', 'fr', 2)
  },
  {
    id: 'exec-fr-negotiation',
    title: 'Négociations Stratégiques',
    level: 'C2',
    icon: ICON_MAP['Crown'],
    description: 'Tactiques de négociation avancée, médiation et résolution de conflits d\'intérêts.',
    lessons: buildProLessons('exec-negotiation', 'fr', 3)
  },
  {
    id: 'exec-fr-compliance',
    title: 'Conformité & Juridique',
    level: 'Exec',
    icon: ICON_MAP['Building'],
    description: 'Conformité réglementaire, audits éthiques, lutte contre le blanchiment et contrats.',
    lessons: buildProLessons('exec-compliance', 'fr', 4)
  },
  {
    id: 'exec-fr-media',
    title: 'Relations Médias & Entretiens',
    level: 'Mastery',
    icon: ICON_MAP['Globe'],
    description: 'Techniques d\'entretiens télévisés, conférences de presse et porte-parole de marque.',
    lessons: buildProLessons('exec-media', 'fr', 5)
  },
  {
    id: 'exec-fr-finance',
    title: 'Conseil Financier & Planification',
    level: 'B1',
    icon: ICON_MAP['Users'],
    description: 'Conseil financier d\'entreprise, budgets et rapports trimestriels.',
    lessons: buildProLessons('exec-finance', 'fr', 0)
  },
  {
    id: 'exec-fr-sourcing',
    title: 'Sourcing & Achats Corporatifs',
    level: 'B2',
    icon: ICON_MAP['PieChart'],
    description: 'Sourcing stratégique, sélection de fournisseurs mondiaux et appels d\'offres.',
    lessons: buildProLessons('exec-sourcing', 'fr', 1)
  },
  {
    id: 'exec-fr-shareholders',
    title: 'Gouvernance des Actionnaires',
    level: 'C1',
    icon: ICON_MAP['Briefcase'],
    description: 'Gouvernance des actionnaires, assemblées générales et comités de rémunération.',
    lessons: buildProLessons('exec-shareholders', 'fr', 2)
  },
  {
    id: 'exec-fr-launch',
    title: 'Lancement de Produit & Marketing',
    level: 'C2',
    icon: ICON_MAP['Crown'],
    description: 'Stratégies de lancement mondiales (Go-To-Market), campagnes et positionnement.',
    lessons: buildProLessons('exec-launch', 'fr', 3)
  },
  {
    id: 'exec-fr-investors',
    title: 'Relations Investisseurs',
    level: 'Exec',
    icon: ICON_MAP['Building'],
    description: 'Communication avec les actionnaires, roadshows financiers et rapports d\'EBITDA.',
    lessons: buildProLessons('exec-investors', 'fr', 4)
  },
  {
    id: 'exec-fr-transformation',
    title: 'Transformation Digitale',
    level: 'Mastery',
    icon: ICON_MAP['Globe'],
    description: 'Conduite du changement technologique, modernisation des systèmes et agilité.',
    lessons: buildProLessons('exec-transformation', 'fr', 5)
  },
  {
    id: 'exec-fr-hr',
    title: 'Sourcing de Talents & RH',
    level: 'B1',
    icon: ICON_MAP['Users'],
    description: 'Attraction des talents de direction, culture d\'entreprise et rémunérations.',
    lessons: buildProLessons('exec-hr', 'fr', 0)
  },
  {
    id: 'exec-fr-legal',
    title: 'Stratégie Juridique & Brevets',
    level: 'B2',
    icon: ICON_MAP['PieChart'],
    description: 'Propriété intellectuelle, brevets internationaux et contentieux d\'affaires.',
    lessons: buildProLessons('exec-legal', 'fr', 1)
  },
  {
    id: 'exec-fr-risk',
    title: 'Gestion des Risques Exécutifs',
    level: 'C1',
    icon: ICON_MAP['Briefcase'],
    description: 'Évaluation et atténuation des risques de marché, financiers et de réputation.',
    lessons: buildProLessons('exec-risk', 'fr', 2)
  },
  {
    id: 'exec-fr-ipo',
    title: 'IPO & Logistique d\'Introduction',
    level: 'C2',
    icon: ICON_MAP['Crown'],
    description: 'Introduction en bourse, prospectus de placement et roadshow de sortie.',
    lessons: buildProLessons('exec-ipo', 'fr', 3)
  },
  {
    id: 'exec-fr-macro',
    title: 'Stratégie Macroéconomique',
    level: 'Exec',
    icon: ICON_MAP['Building'],
    description: 'Analyse des marchés mondiaux, géopolitique macroéconomique et impact inflationniste.',
    lessons: buildProLessons('exec-macro', 'fr', 4)
  },
  {
    id: 'exec-fr-thesis',
    title: 'Thèse de Master Alta Dirección',
    level: 'Mastery',
    icon: ICON_MAP['Globe'],
    description: 'Évaluation exécutive finale. Présentation de la thèse devant un comité global.',
    lessons: buildProLessons('exec-thesis', 'fr', 5)
  },
];