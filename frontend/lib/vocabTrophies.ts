export interface VocabTrophy {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
  icon: 'Award' | 'Flame' | 'Crown' | 'Sparkles';
}

export const getVocabularyTrophies = (
  activeLanguage: string,
  vocabProgress: any[],
  streak: number
): VocabTrophy[] => {
  const list: VocabTrophy[] = [];
  const lang = activeLanguage;
  const completedCount = vocabProgress.filter(p => p.status === 'completed').length;
  
  // English thematic names
  const enNames = [
    "Lexical Explorer", "Pioneer Speaker", "Oxford Aspirant", "Alta Dirección Communicator",
    "Wall Street Analyst", "Silicon Valley Innovator", "Cambridge Rhetorician",
    "Global Diplomat", "Vanguard Negotiator", "Corporativo Elite"
  ];
  
  // French thematic names
  const frNames = [
    "Explorateur Lexical", "Orateur Débutant", "Aspirant de la Sorbonne", "Communicateur Alta Dirección",
    "Analyste de la Bourse", "Innovateur Technologique", "Rhétoricien Classique",
    "Diplomate de Genève", "Négociateur d'Élite", "Cénacle Exécutif"
  ];
  
  // Chinese thematic names
  const zhNames = [
    "词汇探索者 (Lexical Explorer)", "初级演说家 (Pioneer Speaker)", "国子监门生 (Imperial Aspirant)",
    "董事会发言人 (Corporativo Speaker)", "陆家嘴分析师 (Financial Analyst)", "中关村创业者 (Tech Innovator)",
    "清华辩手 (Tsinghua Rhetorician)", "外事外交官 (Global Diplomat)", "顶级谈判专家 (Elite Negotiator)",
    "紫禁城领袖 (Forbidden Leader)"
  ];
  
  const names = lang === 'fr' ? frNames : lang === 'zh' ? zhNames : enNames;
  
  // 1. Progress based (50 trophies)
  for (let i = 1; i <= 50; i++) {
    const targetPairs = i * 5;
    const isUnlocked = (completedCount * 5) >= targetPairs;
    list.push({
      id: `trophy-pairs-${i}`,
      title: lang === 'fr' 
        ? `Maître du Vocabulaire Lvl ${i}` 
        : lang === 'zh' 
          ? `词汇大师 Lvl ${i}` 
          : `Vocabulary Master Lvl ${i}`,
      desc: lang === 'fr'
        ? `Asocia ${targetPairs} parejas de palabras`
        : lang === 'zh'
          ? `关联 ${targetPairs} 组单词`
          : `Associate ${targetPairs} word pairs`,
      unlocked: isUnlocked,
      icon: "Award"
    });
  }

  // 2. Streak based (20 trophies)
  for (let i = 1; i <= 20; i++) {
    const targetStreak = i;
    const isUnlocked = streak >= targetStreak;
    list.push({
      id: `trophy-streak-${i}`,
      title: lang === 'fr'
        ? `Racha Executive ${i} Jours`
        : lang === 'zh'
          ? `连续练习 ${i} 天`
          : `Executive Streak ${i} Days`,
      desc: lang === 'fr'
        ? `Mantén tu racha activa por ${targetStreak} días`
        : lang === 'zh'
          ? `保持连续练习 ${targetStreak} 天`
          : `Maintain your active streak for ${targetStreak} days`,
      unlocked: isUnlocked,
      icon: "Flame"
    });
  }

  // 3. Category master based (10 trophies)
  const categories = [
    { id: 'basics', label: 'Life Essentials' },
    { id: 'travel', label: 'Global Travel' },
    { id: 'business', label: 'Business & Career' },
    { id: 'marketing', label: 'Marketing & Growth' },
    { id: 'networking', label: 'Social & Networking' },
    { id: 'leadership', label: 'Executive Leadership' },
    { id: 'finance', label: 'Finance & Wealth' },
    { id: 'negotiation', label: 'Negotiation & Deals' },
    { id: 'lifestyle', label: 'Lifestyle & Wellness' },
    { id: 'innovation', label: 'Science & Tech' }
  ];

  categories.forEach((cat) => {
    const catLessons = vocabProgress.filter(p => p.lesson_id.startsWith(cat.id) && p.language === lang);
    const completedCat = catLessons.length > 0 && catLessons.every(p => p.status === 'completed');
    
    list.push({
      id: `trophy-cat-${cat.id}`,
      title: lang === 'fr'
        ? `Génie de ${cat.label}`
        : lang === 'zh'
          ? `${cat.label} 专家`
          : `${cat.label} Specialist`,
      desc: lang === 'fr'
        ? `Completa todo el contenido de la categoría ${cat.label}`
        : lang === 'zh'
          ? `完成 ${cat.label} 分类的所有内容`
          : `Complete all content in the ${cat.label} category`,
      unlocked: completedCat,
      icon: "Crown"
    });
  });

  // 4. Custom level-up challenges (20 trophies)
  for (let i = 1; i <= 20; i++) {
    const levelName = names[(i - 1) % names.length];
    const scoreThreshold = 70 + (i % 5) * 6; // scores between 76% and 100%
    const hasHighScores = vocabProgress.filter(p => p.score >= scoreThreshold && p.language === lang).length >= Math.ceil(i / 3);
    
    list.push({
      id: `trophy-expert-${i}`,
      title: `${levelName} Lvl ${i}`,
      desc: lang === 'fr'
        ? `Obtén ${scoreThreshold}% en al menos ${Math.ceil(i / 3)} lecciones`
        : lang === 'zh'
          ? `在至少 ${Math.ceil(i / 3)} 课中获得 ${scoreThreshold}% 的分数`
          : `Get ${scoreThreshold}% in at least ${Math.ceil(i / 3)} lessons`,
      unlocked: hasHighScores,
      icon: "Sparkles"
    });
  }

  return list.slice(0, 100);
};
