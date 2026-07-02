export interface Trophy {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
  icon: 'Award' | 'Flame' | 'Crown' | 'Sparkles';
}

export const generateGeneralTrophies = (xp: number, streak: number, completedLessons: number): Trophy[] => {
  const list: Trophy[] = [];

  // 1. XP Milestones (80 trophies)
  for (let i = 1; i <= 80; i++) {
    const targetXP = i * 200; // up to 16,000 XP
    const isUnlocked = xp >= targetXP;
    list.push({
      id: `general-xp-${i}`,
      title: `Maestría en XP Lvl ${i}`,
      desc: `Alcanza un total de ${targetXP.toLocaleString()} XP`,
      unlocked: isUnlocked,
      icon: 'Award'
    });
  }

  // 2. Streak Milestones (60 trophies)
  for (let i = 1; i <= 60; i++) {
    const targetStreak = i; // up to 60 days
    const isUnlocked = streak >= targetStreak;
    list.push({
      id: `general-streak-${i}`,
      title: `Constancia de Acero Lvl ${i}`,
      desc: `Mantén una racha de ${targetStreak} días activos`,
      unlocked: isUnlocked,
      icon: 'Flame'
    });
  }

  // 3. Lesson Completeness Milestones (60 trophies)
  for (let i = 1; i <= 60; i++) {
    const targetLessons = i; // up to 60 lessons
    const isUnlocked = completedLessons >= targetLessons;
    list.push({
      id: `general-lessons-${i}`,
      title: `Erudito Académico Lvl ${i}`,
      desc: `Completa un total de ${targetLessons} lecciones`,
      unlocked: isUnlocked,
      icon: 'Crown'
    });
  }

  return list.slice(0, 200);
};
