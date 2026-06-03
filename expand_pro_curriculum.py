import json
import re
from pathlib import Path

# First let's extract the raw titles using the previous working logic
curriculum_path = Path("c:/Users/jeico/onixlingo/language-ai-tutor/frontend/data/curriculum_pro_fr.ts")
content = curriculum_path.read_text(encoding="utf-8")

def extract_titles(curriculum_str, start_marker, end_marker):
    block_match = re.search(r"id:\s*'" + start_marker + r"'.*?lessons:\s*\[(.*?)\]", curriculum_str, re.DOTALL)
    if not block_match:
        return []
    lessons_block = block_match.group(1)
    titles = re.findall(r"title:\s*['\"](.*?)['\"]", lessons_block)
    return titles

titles_en = {
    "b1": extract_titles(content, "exec-b1", "exec-b2"),
    "b2": extract_titles(content, "exec-b2", "exec-c1"),
    "c1": extract_titles(content, "exec-c1", "exec-c2"),
    "c2": extract_titles(content, "exec-c2", "exec-exec"),
    "exec": extract_titles(content, "exec-exec", "exec-mastery"),
    "mastery": extract_titles(content, "exec-mastery", "export const PRO_CURRICULUM_FR"),
}

content_fr = content[content.find("export const PRO_CURRICULUM_FR"):]
titles_fr = {
    "b1": extract_titles(content_fr, "exec-fr-b1", "exec-fr-b2"),
    "b2": extract_titles(content_fr, "exec-fr-b2", "exec-fr-c1"),
    "c1": extract_titles(content_fr, "exec-fr-c1", "exec-fr-c2"),
    "c2": extract_titles(content_fr, "exec-fr-c2", "exec-fr-exec"),
    "exec": extract_titles(content_fr, "exec-fr-exec", "exec-fr-mastery"),
    "mastery": extract_titles(content_fr, "exec-fr-mastery", "];"),
}

# The 30 blocks metadata for English
blocks_en = [
  {"id": 'exec-b1', "title": 'Executive Foundation', "level": 'B1', "icon": 'Users', "description": 'Fundamentos de comunicación corporativa, etiqueta y networking esencial.'},
  {"id": 'exec-b2', "title": 'Management Skills', "level": 'B2', "icon": 'PieChart', "description": 'Gestión de equipos, liderazgo intermedio y resolución de conflictos.'},
  {"id": 'exec-c1', "title": 'Advanced Corporate', "level": 'C1', "icon": 'Briefcase', "description": 'Negociaciones de alto nivel, persuasión y presentaciones a inversionistas.'},
  {"id": 'exec-c2', "title": 'Executive Presence', "level": 'C2', "icon": 'Crown', "description": 'Dominio total del idioma, diplomacia corporativa y oratoria ejecutiva.'},
  {"id": 'exec-exec', "title": 'Boardroom Dynamics', "level": 'Exec', "icon": 'Building', "description": 'Inglés especializado para juntas directivas, M&A y estrategia global.'},
  {"id": 'exec-mastery', "title": 'Global Leadership', "level": 'Mastery', "icon": 'Globe', "description": 'El grado máximo. Comunicación intercultural y expansión internacional.'},
  
  {"id": 'exec-crisis', "title": 'Crisis Management & PR', "level": 'B1', "icon": 'Users', "description": 'Gestión de la reputación de marca, comunicados de prensa y relaciones con medios.'},
  {"id": 'exec-ma', "title": 'Mergers & Acquisitions', "level": 'B2', "icon": 'PieChart', "description": 'Estrategia de fusiones y adquisiciones, due diligence e integración corporativa.'},
  {"id": 'exec-vc', "title": 'Venture Capital & Funding', "level": 'C1', "icon": 'Briefcase', "description": 'Rondas de inversión, pitch decks, valoración de startups y negociación de contratos.'},
  {"id": 'exec-fintech', "title": 'FinTech & Digital Banking', "level": 'C2', "icon": 'Crown', "description": 'Operaciones de banca digital, criptoactivos, regulación y pasarelas de pago.'},
  {"id": 'exec-pr', "title": 'Public Relations & Branding', "level": 'Exec', "icon": 'Building', "description": 'Estrategias de posicionamiento de marca, campañas y relaciones públicas de nivel directivo.'},
  {"id": 'exec-rhetoric', "title": 'Advanced Rhetoric & Debates', "level": 'Mastery', "icon": 'Globe', "description": 'Oratoria persuasiva de alta dirección, manejo de debates y argumentación estratégica.'},
  {"id": 'exec-esg', "title": 'ESG & Corporate Ethics', "level": 'B1', "icon": 'Users', "description": 'Gobernanza ambiental, social y ética corporativa en el ecosistema global.'},
  {"id": 'exec-ai', "title": 'AI Strategy & Tech Governance', "level": 'B2', "icon": 'PieChart', "description": 'Implementación de IA en el negocio, ética de datos y gobernanza tecnológica.'},
  {"id": 'exec-logistics', "title": 'Global Supply Chain', "level": 'C1', "icon": 'Briefcase', "description": 'Logística internacional, cadena de suministro, aduanas y contratos de distribución.'},
  {"id": 'exec-negotiation', "title": 'Strategic Negotiations', "level": 'C2', "icon": 'Crown', "description": 'Tácticas de negociación avanzada, mediación y resolución de conflictos de interés.'},
  {"id": 'exec-compliance', "title": 'Corporate Compliance & Legal', "level": 'Exec', "icon": 'Building', "description": 'Cumplimiento normativo, auditorías éticas, prevención de lavado y marcos regulatorios.'},
  {"id": 'exec-media', "title": 'Media Relations & Interviews', "level": 'Mastery', "icon": 'Globe', "description": 'Técnicas para entrevistas en televisión, conferencias de prensa y vocería de marca.'},
  {"id": 'exec-finance', "title": 'Financial Advisory & Planning', "level": 'B1', "icon": 'Users', "description": 'Planificación financiera de nivel corporativo, presupuestos y reportes trimestrales.'},
  {"id": 'exec-sourcing', "title": 'Corporate Sourcing & Procurement', "level": 'B2', "icon": 'PieChart', "description": 'Abastecimiento estratégico, selección de proveedores globales y licitaciones.'},
  {"id": 'exec-shareholders', "title": 'Shareholder Governance', "level": 'C1', "icon": 'Briefcase', "description": 'Gobernanza de accionistas, asambleas generales y comités de compensación.'},
  {"id": 'exec-launch', "title": 'Product Launch & Marketing', "level": 'C2', "icon": 'Crown', "description": 'Estrategias Go-To-Market globales, campañas de lanzamiento y posicionamiento de producto.'},
  {"id": 'exec-investors', "title": 'Investor Relations', "level": 'Exec', "icon": 'Building', "description": 'Comunicación con accionistas, roadshows financieros y reportes de EBITDA.'},
  {"id": 'exec-transformation', "title": 'Digital Transformation', "level": 'Mastery', "icon": 'Globe', "description": 'Liderazgo de cambio tecnológico, modernización de sistemas y agilidad empresarial.'},
  {"id": 'exec-hr', "title": 'Talent Sourcing & HR Strategy', "level": 'B1', "icon": 'Users', "description": 'Atracción de talento ejecutivo, cultura organizacional y compensaciones directivas.'},
  {"id": 'exec-legal', "title": 'Legal Strategy & Patents', "level": 'B2', "icon": 'PieChart', "description": 'Propiedad intelectual, patentes internacionales y litigio corporativo.'},
  {"id": 'exec-risk', "title": 'Executive Risk Management', "level": 'C1', "icon": 'Briefcase', "description": 'Evaluación y mitigación de riesgos de mercado, financieros y reputacionales.'},
  {"id": 'exec-ipo', "title": 'IPO & Listing Logistics', "level": 'C2', "icon": 'Crown', "description": 'Logística de cotización en bolsa, prospecto de colocación y roadshow de salida.'},
  {"id": 'exec-macro', "title": 'Macroeconomic Strategy', "level": 'Exec', "icon": 'Building', "description": 'Análisis de mercados internacionales, geopolítica macroeconómica e impacto inflacionario.'},
  {"id": 'exec-thesis', "title": 'C-Suite Master Thesis', "level": 'Mastery', "icon": 'Globe', "description": 'Evaluación directiva final. Presentación de tesis ejecutiva ante consejo global.'}
]

# The 30 blocks metadata for French
blocks_fr = [
  {"id": 'exec-fr-b1', "title": 'Fondations Exécutives', "level": 'B1', "icon": 'Users', "description": "Bases de la communication d'entreprise, étiquette et réseautage essentiel."},
  {"id": 'exec-fr-b2', "title": 'Compétences de Gestion', "level": 'B2', "icon": 'PieChart', "description": "Gestion d'équipe, leadership intermédiaire et résolution de conflits."},
  {"id": 'exec-fr-c1', "title": 'Entreprise Avancée', "level": 'C1', "icon": 'Briefcase', "description": "Négociations de haut niveau, persuasion et présentations aux investisseurs."},
  {"id": 'exec-fr-c2', "title": 'Présence Executive', "level": 'C2', "icon": 'Crown', "description": "Maîtrise totale de la langue, diplomatie d'entreprise et prise de parole."},
  {"id": 'exec-fr-exec', "title": 'Dynamique du Conseil', "level": 'Exec', "icon": 'Building', "description": "Français spécialisé pour les conseils d'administration, M&A et stratégie globale."},
  {"id": 'exec-fr-mastery', "title": 'Leadership Global', "level": 'Mastery', "icon": 'Globe', "description": "Le grade ultime. Communication interculturelle et expansion internationale."},
  
  {"id": 'exec-fr-crisis', "title": 'Gestion de Crise & RP', "level": 'B1', "icon": 'Users', "description": "Gestion de la réputation de la marque, communiqués de presse et relations médias."},
  {"id": 'exec-fr-ma', "title": 'Fusions & Acquisitions', "level": 'B2', "icon": 'PieChart', "description": "Stratégie de fusions et acquisitions, due diligence et intégration d'entreprise."},
  {"id": 'exec-fr-vc', "title": 'Capital Risque & Financement', "level": 'C1', "icon": 'Briefcase', "description": "Levées de fonds, pitch decks, valorisation de startups et négociation de contrats."},
  {"id": 'exec-fr-fintech', "title": 'FinTech & Banque Digitale', "level": 'C2', "icon": 'Crown', "description": "Opérations de banque numérique, crypto-actifs, régulation et passerelles de paiement."},
  {"id": 'exec-fr-pr', "title": 'Relations Publiques & Branding', "level": 'Exec', "icon": 'Building', "description": "Stratégies de positionnement de marque, campagnes et relations publiques de direction."},
  {"id": 'exec-fr-rhetoric', "title": 'Rhétorique Avancée & Débats', "level": 'Mastery', "icon": 'Globe', "description": "Prise de parole persuasive, gestion des débats et argumentation stratégique."},
  {"id": 'exec-fr-esg', "title": 'ESG & Éthique des Affaires', "level": 'B1', "icon": 'Users', "description": "Gouvernance environnementale, sociale et éthique des affaires dans l'écosystème global."},
  {"id": 'exec-fr-ai', "title": 'Stratégie IA & Gouvernance Tech', "level": 'B2', "icon": 'PieChart', "description": "Intégration de l'IA dans l'entreprise, éthique des données et gouvernance technologique."},
  {"id": 'exec-fr-logistics', "title": 'Chaîne d\'Approvisionnement', "level": 'C1', "icon": 'Briefcase', "description": "Logistique internationale, chaîne d'approvisionnement, douanes et contrats de distribution."},
  {"id": 'exec-fr-negotiation', "title": 'Négociations Stratégiques', "level": 'C2', "icon": 'Crown', "description": "Tactiques de négociation avancée, médiation et résolution de conflits d'intérêts."},
  {"id": 'exec-fr-compliance', "title": 'Conformité & Juridique', "level": 'Exec', "icon": 'Building', "description": "Conformité réglementaire, audits éthiques, lutte contre le blanchiment et contrats."},
  {"id": 'exec-fr-media', "title": 'Relations Médias & Entretiens', "level": 'Mastery', "icon": 'Globe', "description": "Techniques d'entretiens télévisés, conférences de presse et porte-parole de marque."},
  {"id": 'exec-fr-finance', "title": 'Conseil Financier & Planification', "level": 'B1', "icon": 'Users', "description": "Conseil financier d'entreprise, budgets et rapports trimestriels."},
  {"id": 'exec-fr-sourcing', "title": 'Sourcing & Achats Corporatifs', "level": 'B2', "icon": 'PieChart', "description": "Sourcing stratégique, sélection de fournisseurs mondiaux et appels d'offres."},
  {"id": 'exec-fr-shareholders', "title": 'Gouvernance des Actionnaires', "level": 'C1', "icon": 'Briefcase', "description": "Gouvernance des actionnaires, assemblées générales et comités de rémunération."},
  {"id": 'exec-fr-launch', "title": 'Lancement de Produit & Marketing', "level": 'C2', "icon": 'Crown', "description": "Stratégies de lancement mondiales (Go-To-Market), campagnes et positionnement."},
  {"id": 'exec-fr-investors', "title": 'Relations Investisseurs', "level": 'Exec', "icon": 'Building', "description": "Communication avec les actionnaires, roadshows financiers et rapports d'EBITDA."},
  {"id": 'exec-fr-transformation', "title": 'Transformation Digitale', "level": 'Mastery', "icon": 'Globe', "description": "Conduite du changement technologique, modernisation des systèmes et agilité."},
  {"id": 'exec-fr-hr', "title": 'Sourcing de Talents & RH', "level": 'B1', "icon": 'Users', "description": "Attraction des talents de direction, culture d'entreprise et rémunérations."},
  {"id": 'exec-fr-legal', "title": 'Stratégie Juridique & Brevets', "level": 'B2', "icon": 'PieChart', "description": "Propriété intellectuelle, brevets internationaux et contentieux d'affaires."},
  {"id": 'exec-fr-risk', "title": 'Gestion des Risques Exécutifs', "level": 'C1', "icon": 'Briefcase', "description": "Évaluation et atténuation des risques de marché, financiers et de réputation."},
  {"id": 'exec-fr-ipo', "title": 'IPO & Logistique d\'Introduction', "level": 'C2', "icon": 'Crown', "description": "Introduction en bourse, prospectus de placement et roadshow de sortie."},
  {"id": 'exec-fr-macro', "title": 'Stratégie Macroéconomique', "level": 'Exec', "icon": 'Building', "description": "Analyse des marchés mondiaux, géopolitique macroéconomique et impact inflationniste."},
  {"id": 'exec-fr-thesis', "title": 'Thèse de Master C-Suite', "level": 'Mastery', "icon": 'Globe', "description": "Évaluation exécutive finale. Présentation de la thèse devant un comité global."}
]

# Generate the complete curriculum_pro_fr.ts content
out = []
out.append("import { Users, PieChart, Briefcase, Crown, Building, Globe } from 'lucide-react';")
out.append("\n// ================================================================")
out.append("// ONIXLINGO PRO EXECUTIVE CURRICULA - 30 NIVELES × 100 LECCIONES = 3,000 TOTAL")
out.append("// ================================================================\n")

# Write out the extracted title lists
for k, v in titles_en.items():
    out.append(f"const TITLES_{k.upper()}_EN = {json.dumps(v, ensure_ascii=False)};")
for k, v in titles_fr.items():
    out.append(f"const TITLES_{k.upper()}_FR = {json.dumps(v, ensure_ascii=False)};")

out.append("""
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
      }
    }
    
    lessons.push({ id, title });
  }
  return lessons;
};
""")

# Build English array
out.append("export const PRO_CURRICULUM = [")
for idx, b in enumerate(blocks_en):
    escaped_title = b['title'].replace("'", "\\'")
    escaped_desc = b['description'].replace("'", "\\'")
    out.append("  {")
    out.append(f"    id: '{b['id']}',")
    out.append(f"    title: '{escaped_title}',")
    out.append(f"    level: '{b['level']}',")
    out.append(f"    icon: ICON_MAP['{b['icon']}'],")
    out.append(f"    description: '{escaped_desc}',")
    out.append(f"    lessons: buildProLessons('{b['id']}', 'en', {idx % 6})")
    out.append("  },")
out.append("];\n")

# Build French array
out.append("export const PRO_CURRICULUM_FR = [")
for idx, b in enumerate(blocks_fr):
    escaped_title = b['title'].replace("'", "\\'")
    escaped_desc = b['description'].replace("'", "\\'")
    out.append("  {")
    out.append(f"    id: '{b['id']}',")
    out.append(f"    title: '{escaped_title}',")
    out.append(f"    level: '{b['level']}',")
    out.append(f"    icon: ICON_MAP['{b['icon']}'],")
    out.append(f"    description: '{escaped_desc}',")
    out.append(f"    lessons: buildProLessons('{b['id'].replace('exec-fr-', 'exec-')}', 'fr', {idx % 6})")
    out.append("  },")
out.append("];")

curriculum_path.write_text("\n".join(out), encoding="utf-8")
print("Successfully generated curriculum_pro_fr.ts with 30 blocks!")
