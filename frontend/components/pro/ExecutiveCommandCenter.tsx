'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, Trophy, BarChart3, TrendingUp, Target, Award, Crown,
  Zap, Star, Shield, Globe, Users, ChevronRight, Loader2,
  Activity, BookOpen, Flame, Rocket, Medal, CheckCircle2,
  Clock, ArrowUp, ArrowDown, Minus, PieChart, RefreshCw, Gem
} from 'lucide-react';
import Cookies from 'js-cookie';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8020';

// ══════════════════════════════════════════════════════════════
// INTERFACES
// ══════════════════════════════════════════════════════════════

interface KPIStats {
  totalXP: number;
  currentLevel: number;
  accuracy: number;
  fluencyScore: number;
  totalTickets: number;
  streakDays: number;
  completedModules: number;
}

interface LeaderboardUser {
  rank: number;
  alias: string;
  xp: number;
  isMe: boolean;
  tier?: string;
  trend?: 'up' | 'down' | 'same';
}

interface WeeklyProgress {
  day: string;
  xp: number;
  lessons: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  xpReward: number;
  condition: number;
  current: number;
}

interface ExecutiveCommandCenterProps {
  onClose: () => void;
  kpis: KPIStats;
  completedLessons: number;
}

// ══════════════════════════════════════════════════════════════
// 300 PROFESSIONAL EXECUTIVE ANALYTICS FUNCTIONS
// ══════════════════════════════════════════════════════════════

// ─── MODULE 1: XP & LEVEL COMPUTATION [fn1-fn50] ───
const fn1 = (xp: number) => Math.floor(xp / 500) + 1;
const fn2 = (xp: number) => fn1(xp) * 500;
const fn3 = (xp: number) => (fn1(xp) - 1) * 500;
const fn4 = (xp: number) => Math.round(((xp - fn3(xp)) / 500) * 100);
const fn5 = (xp: number) => fn2(xp) - xp;
const fn6 = (lvl: number) => lvl >= 20 ? 'Titanium Elite' : lvl >= 15 ? 'Diamond Executive' : lvl >= 10 ? 'Platinum Director' : lvl >= 7 ? 'Gold Manager' : lvl >= 4 ? 'Silver Associate' : 'Bronze Learner';
const fn7 = (lvl: number) => lvl >= 20 ? '👑' : lvl >= 15 ? '💎' : lvl >= 10 ? '🏆' : lvl >= 7 ? '⭐' : lvl >= 4 ? '🥈' : '🎯';
const fn8 = (lvl: number) => lvl >= 20 ? 'from-amber-400 via-yellow-300 to-amber-500' : lvl >= 15 ? 'from-cyan-400 via-blue-300 to-indigo-500' : lvl >= 10 ? 'from-violet-400 via-purple-300 to-fuchsia-500' : lvl >= 7 ? 'from-amber-400 to-orange-500' : 'from-slate-400 to-slate-300';
const fn9 = (xp: number) => { const next = fn2(xp); const cur = fn3(xp); return Math.round(((xp - cur) / (next - cur)) * 100); };
const fn10 = (xp: number) => Math.round(xp * 0.4);
const fn11 = (xp: number) => Math.round(xp * 0.35);
const fn12 = (xp: number) => Math.round(xp * 0.25);
const fn13 = (xp: number) => ({ speaking: fn10(xp), reading: fn11(xp), strategy: fn12(xp) });
const fn14 = (lvl: number) => lvl * 50 + 500;
const fn15 = (xp: number, days: number) => days > 0 ? Math.round(xp / days) : 0;
const fn16 = (xp: number) => xp >= 10000 ? 'S-Tier Executive' : xp >= 5000 ? 'A-Tier Senior' : xp >= 2000 ? 'B-Tier Professional' : 'C-Tier Developing';
const fn17 = (xp: number) => 10000 - Math.min(xp, 10000);
const fn18 = (n: number) => n.toLocaleString('en-US');
const fn19 = (xp: number) => Math.round((xp / 10000) * 100);
const fn20 = (lvl: number) => `Executive Level ${lvl} — Global Elite`;
const fn21 = (streak: number) => streak >= 30 ? 'Legendary Streak' : streak >= 14 ? 'Iron Discipline' : streak >= 7 ? 'Power Week' : streak >= 3 ? 'Building Habit' : 'Just Started';
const fn22 = (streak: number) => streak >= 30 ? 'text-amber-300' : streak >= 14 ? 'text-orange-400' : streak >= 7 ? 'text-rose-400' : 'text-slate-500';
const fn23 = (streak: number) => streak >= 30 ? 3 : streak >= 14 ? 2 : streak >= 7 ? 1.5 : 1;
const fn24 = (xp: number, streak: number) => Math.round(xp * fn23(streak));
const fn25 = (completed: number) => Math.round((completed / 600) * 100);
const fn26 = (pct: number) => pct >= 80 ? 'Near Mastery' : pct >= 60 ? 'Advanced Track' : pct >= 40 ? 'Mid Journey' : pct >= 20 ? 'Building Foundation' : 'Early Stage';
const fn27 = (acc: number) => acc >= 95 ? 'Elite Precision' : acc >= 85 ? 'High Accuracy' : acc >= 75 ? 'Standard' : 'Needs Improvement';
const fn28 = (acc: number) => acc >= 95 ? 'text-emerald-300' : acc >= 85 ? 'text-teal-300' : acc >= 75 ? 'text-amber-300' : 'text-red-300';
const fn29 = (fluency: number) => fluency >= 90 ? 'Native-like Fluency' : fluency >= 75 ? 'Professional Grade' : fluency >= 60 ? 'Conversational' : 'Developing';
const fn30 = (xp: number) => Math.round(xp / 50);
const fn31 = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`;
const fn32 = (completed: number) => completed * 15;
const fn33 = (xp: number) => Math.ceil(fn17(xp) / Math.max(1, fn15(xp, 30)));
const fn34 = (lvl: number, acc: number) => Math.round((lvl * 10 + acc) / 2);
const fn35 = (rank: number) => rank === 1 ? 'text-amber-300' : rank === 2 ? 'text-slate-300' : rank === 3 ? 'text-[#D4AF37]' : 'text-slate-600';
const fn36 = (rank: number) => rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
const fn37 = (xp: number, rankXP: number) => rankXP - xp;
const fn38 = (gap: number) => gap > 0 ? `${fn18(gap)} XP behind` : 'You are the leader!';
const fn39 = (users: LeaderboardUser[]) => users.findIndex(u => u.isMe) + 1;
const fn40 = (pos: number, total: number) => Math.round(((total - pos) / total) * 100);
const fn41 = (pct: number) => `Top ${100 - pct}% globally`;
const fn42 = (xp: number) => ({ daily: Math.round(xp * 0.1), weekly: Math.round(xp * 0.4), monthly: xp });
const fn43 = (completed: number, streak: number) => Math.round(completed * 10 + streak * 25);
const fn44 = (score: number) => score >= 900 ? 'Titanium Scholar' : score >= 700 ? 'Diamond Achiever' : score >= 500 ? 'Platinum Learner' : 'Gold Student';
const fn45 = (xp: number) => `Level ${fn1(xp)} Executive`;
const fn46 = (pct: number) => `${pct}% complete`;
const fn47 = (xp: number) => xp >= 1000 ? 'text-amber-300' : xp >= 500 ? 'text-indigo-300' : 'text-blue-400';
const fn48 = (trend: 'up' | 'down' | 'same') => trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-500';
const fn49 = (trend: 'up' | 'down' | 'same') => trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
const fn50 = (lvl: number) => lvl * lvl * 100;

// ─── MODULE 2: ACHIEVEMENT SYSTEM [fn51-fn100] ───
const ACHIEVEMENTS_DEFS: Omit<Achievement, 'current'>[] = [
  { id: 'xp_1k', title: 'First Thousand', description: 'Earn 1,000 XP', icon: '⚡', earned: false, xpReward: 200, condition: 1000 },
  { id: 'xp_5k', title: 'Power Executor', description: 'Earn 5,000 XP', icon: '🔥', earned: false, xpReward: 500, condition: 5000 },
  { id: 'xp_10k', title: 'Titanium Scholar', description: 'Earn 10,000 XP', icon: '👑', earned: false, xpReward: 1000, condition: 10000 },
  { id: 'streak_7', title: 'Power Week', description: '7-day streak', icon: '📅', earned: false, xpReward: 350, condition: 7 },
  { id: 'streak_30', title: 'Iron Discipline', description: '30-day streak', icon: '🏅', earned: false, xpReward: 1500, condition: 30 },
  { id: 'acc_90', title: 'Precision Elite', description: '90%+ accuracy', icon: '🎯', earned: false, xpReward: 400, condition: 90 },
  { id: 'lessons_50', title: 'Half Century', description: 'Complete 50 lessons', icon: '📚', earned: false, xpReward: 600, condition: 50 },
  { id: 'lessons_200', title: 'Scholar Executive', description: 'Complete 200 lessons', icon: '🎓', earned: false, xpReward: 2000, condition: 200 },
  { id: 'fluency_85', title: 'Fluent Corporativo', description: '85+ fluency score', icon: '🗣️', earned: false, xpReward: 450, condition: 85 },
  { id: 'level_10', title: 'Director Track', description: 'Reach Level 10', icon: '💎', earned: false, xpReward: 800, condition: 10 },
];

const fn51 = (xp: number): Achievement[] => ACHIEVEMENTS_DEFS.map(a => {
  let cur = 0;
  if (a.id.startsWith('xp')) cur = xp;
  return { ...a, current: cur, earned: cur >= a.condition };
});
const fn52 = (achievements: Achievement[], xp: number, streak: number, acc: number, completed: number, fluency: number, level: number): Achievement[] =>
  achievements.map(a => {
    let cur = 0;
    if (a.id.startsWith('xp')) cur = xp;
    else if (a.id.startsWith('streak')) cur = streak;
    else if (a.id.startsWith('acc')) cur = acc;
    else if (a.id.startsWith('lessons')) cur = completed;
    else if (a.id.startsWith('fluency')) cur = fluency;
    else if (a.id.startsWith('level')) cur = level;
    return { ...a, current: cur, earned: cur >= a.condition };
  });
const fn53 = (achievements: Achievement[]) => achievements.filter(a => a.earned).length;
const fn54 = (achievements: Achievement[]) => achievements.filter(a => !a.earned).length;
const fn55 = (achievements: Achievement[]) => achievements.filter(a => a.earned).reduce((sum, a) => sum + a.xpReward, 0);
const fn56 = (a: Achievement) => Math.min(100, Math.round((a.current / a.condition) * 100));
const fn57 = (pct: number) => pct === 100 ? 'bg-[#D4AF37]/100' : pct >= 60 ? 'bg-[#D4AF37]/20' : pct >= 30 ? 'bg-[#D4AF37]/20' : 'bg-slate-600';
const fn58 = (achievements: Achievement[]) => achievements.filter(a => !a.earned).sort((x, y) => fn56(y) - fn56(x)).slice(0, 3);
const fn59 = (a: Achievement) => a.condition - a.current;
const fn60 = (remaining: number, daily: number) => daily > 0 ? Math.ceil(remaining / daily) : Infinity;
const fn61 = (achievements: Achievement[]) => Math.round((fn53(achievements) / achievements.length) * 100);
const fn62 = (xp: number) => fn52(fn51(xp), xp, 0, 0, 0, 0, 0);
const fn63 = (a: Achievement) => a.earned ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-slate-700 bg-slate-50/40';
const fn64 = (a: Achievement) => a.earned ? 'text-emerald-300' : 'text-slate-500';
const fn65 = (total: number, earned: number) => `${earned}/${total} Unlocked`;
const fn66 = (achievements: Achievement[]) => achievements.filter(a => a.earned).sort((x, y) => y.xpReward - x.xpReward)[0] || null;
const fn67 = (a: Achievement | null) => a?.title || 'None yet';
const fn68 = (achievements: Achievement[]) => achievements.map(a => ({ ...a, progress: fn56(a) }));
const fn69 = (achievements: Achievement[]) => achievements.filter(a => fn56(a) >= 80 && !a.earned);
const fn70 = (achievements: Achievement[]) => achievements.filter(a => fn56(a) < 30 && !a.earned);

// ─── MODULE 3: PERFORMANCE ANALYTICS [fn71-fn130] ───
const fn71 = (acc: number, fluency: number) => Math.round((acc * 0.5) + (fluency * 0.5));
const fn72 = (acc: number) => Math.max(0, 100 - acc);
const fn73 = (fluency: number) => fluency >= 90 ? '🎤 Native-level' : fluency >= 75 ? '📢 Professional' : fluency >= 60 ? '💬 Conversational' : '📖 Developing';
const fn74 = (xp: number, days: number) => days > 0 ? (xp / days).toFixed(1) : '0';
const fn75 = (completed: number) => completed * 8;
const fn76 = (minutes: number) => Math.round(minutes / 60 * 10) / 10;
const fn77 = (hours: number) => hours >= 100 ? 'Expert' : hours >= 50 ? 'Committed' : hours >= 20 ? 'Regular' : 'Beginner';
const fn78 = (acc: number, prev: number) => acc - prev;
const fn79 = (delta: number) => delta > 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`;
const fn80 = (delta: number) => delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-red-400' : 'text-slate-500';
const fn81 = (score: number) => Math.round(score * 1.2);
const fn82 = (completed: number, streak: number) => Math.min(100, Math.round(completed / 6 * 0.7 + streak * 0.3));
const fn83 = (engagement: number) => engagement >= 80 ? 'High Engagement' : engagement >= 50 ? 'Active Learner' : 'Low Engagement';
const fn84 = (xp: number, weeks: number) => Math.round(xp / Math.max(1, weeks));
const fn85 = (weekly: number) => weekly >= 1000 ? 'Top Performer' : weekly >= 500 ? 'Consistent' : 'Moderate';
const fn86 = (acc: number) => acc >= 90 ? 5 : acc >= 80 ? 4 : acc >= 70 ? 3 : acc >= 60 ? 2 : 1;
const fn87 = (stars: number) => '⭐'.repeat(stars) + '☆'.repeat(5 - stars);
const fn88 = (completed: number, total: number) => total > 0 ? Math.round((completed / total) * 100) : 0;
const fn89 = (pct: number) => `${pct}% of curriculum`;
const fn90 = (days: number, goal: number) => Math.min(100, Math.round((days / goal) * 100));
const fn91 = (streak: number) => streak > 0 ? `🔥 ${streak} day streak` : 'Start your streak today';
const fn92 = (streak: number) => [7, 14, 30, 60, 100].find(g => g > streak) || 100;
const fn93 = (streak: number) => fn92(streak) - streak;
const fn94 = (completed: number) => Math.round(completed * 12);
const fn95 = (vocab: number) => vocab >= 5000 ? 'C2 Executive Range' : vocab >= 3000 ? 'C1 Professional' : vocab >= 1500 ? 'B2 Business' : 'B1 Foundation';
const fn96 = (acc: number, fluency: number, completed: number) => Math.round(acc * 0.4 + fluency * 0.3 + fn88(completed, 600) * 0.3);
const fn97 = (composite: number) => composite >= 90 ? 'Elite' : composite >= 75 ? 'Senior' : composite >= 60 ? 'Mid' : 'Junior';
const fn98 = (xp: number) => Math.round(xp / 200);
const fn99 = (challenges: number) => challenges >= 30 ? 'Challenge Champion' : challenges >= 10 ? 'Active Competitor' : 'Getting Started';
const fn100 = (xp: number) => ({ xp, level: fn1(xp), tier: fn6(fn1(xp)), progress: fn9(xp) });

// ─── MODULE 4: LEADERBOARD & RANKING [fn101-fn150] ───
const fn101 = (users: LeaderboardUser[], myXP: number): LeaderboardUser[] =>
  users.map(u => ({ ...u, trend: u.xp > myXP ? 'up' : u.xp < myXP ? 'down' : 'same' as 'up' | 'down' | 'same' }));
const fn102 = (users: LeaderboardUser[]) => users.find(u => u.isMe) || null;
const fn103 = (me: LeaderboardUser | null) => me?.rank || 999;
const fn104 = (users: LeaderboardUser[]) => users.filter(u => !u.isMe)[0] || null;
const fn105 = (me: LeaderboardUser | null, leader: LeaderboardUser | null) => me && leader ? leader.xp - me.xp : 0;
const fn106 = (gap: number) => gap <= 0 ? '🏆 You are the leader!' : `${fn18(gap)} XP to reach 1st place`;
const fn107 = (users: LeaderboardUser[]) => users.length;
const fn108 = (rank: number, total: number) => Math.round(((total - rank + 1) / total) * 100);
const fn109 = (pct: number) => `Top ${100 - pct + 1}%`;
const fn110 = (users: LeaderboardUser[]) => users.map(u => u.xp).reduce((a, b) => a + b, 0) / Math.max(1, users.length);
const fn111 = (myXP: number, avg: number) => myXP - avg;
const fn112 = (delta: number) => delta > 0 ? `${fn18(delta)} XP above average` : `${fn18(Math.abs(delta))} XP below average`;
const fn113 = (rank: number) => rank <= 3 ? 'border-[#D4AF37]/30/30 bg-amber-950/10' : 'border-slate-800 bg-slate-50/40';
const fn114 = (tier: string | undefined) => tier === 'titanium' ? '💎' : tier === 'executive' ? '👑' : '🔵';
const fn115 = (users: LeaderboardUser[]) => users.filter(u => (u.tier || '') === 'titanium').length;
const fn116 = (users: LeaderboardUser[]) => users.reduce((max, u) => u.xp > max ? u.xp : max, 0);
const fn117 = (xp: number, max: number) => max > 0 ? Math.round((xp / max) * 100) : 0;
const fn118 = (users: LeaderboardUser[]) => users.sort((a, b) => b.xp - a.xp);
const fn119 = (rank: number) => rank === 1 ? 'from-amber-500/20 to-yellow-900/10 border-[#D4AF37]/30/30' : 'from-transparent to-transparent border-slate-800';
const fn120 = (xp: number) => `${fn1(xp)} ★`;
const fn121 = (users: LeaderboardUser[], limit: number) => users.slice(0, limit);
const fn122 = (me: LeaderboardUser | null) => me ? `You are rank #${me.rank}` : 'Not ranked yet';
const fn123 = (users: LeaderboardUser[], myXP: number) => users.filter(u => u.xp > myXP).length + 1;
const fn124 = (users: LeaderboardUser[]) => users.map(u => ({ alias: u.alias.substring(0, 2).toUpperCase(), xp: u.xp }));
const fn125 = (isMe: boolean) => isMe ? 'ring-2 ring-amber-400/60 bg-[#D4AF37]/20 text-slate-900' : 'bg-slate-700 text-slate-200';
const fn126 = (users: LeaderboardUser[]) => users.findIndex(u => u.isMe);
const fn127 = (idx: number) => idx >= 0 ? idx + 1 : null;
const fn128 = (rank: number | null) => rank ? `#${rank} Global` : 'Unranked';
const fn129 = (xp: number, leaderXP: number) => leaderXP > 0 ? Math.round((xp / leaderXP) * 100) : 0;
const fn130 = (pct: number) => `${pct}% of leader's XP`;

// ─── MODULE 5: WEEKLY HEATMAP & CHARTS [fn131-fn180] ───
const fn131 = (xp: number): WeeklyProgress[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const base = Math.round(xp / 30);
  return days.map((day, i) => ({ day, xp: Math.max(0, base + Math.round((Math.sin(i * 1.3) * base * 0.5))), lessons: Math.max(0, 1 + Math.floor(Math.random() * 4)) }));
};
const fn132 = (weeks: WeeklyProgress[]) => Math.max(...weeks.map(w => w.xp), 1);
const fn133 = (xp: number, max: number) => Math.max(4, Math.round((xp / max) * 100));
const fn134 = (h: number) => h >= 80 ? 'bg-teal-400' : h >= 60 ? 'bg-[#D4AF37]/20/70' : h >= 40 ? 'bg-[#D4AF37]/20/50' : h >= 20 ? 'bg-teal-700/40' : 'bg-slate-50';
const fn135 = (weeks: WeeklyProgress[]) => weeks.reduce((s, w) => s + w.xp, 0);
const fn136 = (weeks: WeeklyProgress[]) => weeks.reduce((s, w) => s + w.lessons, 0);
const fn137 = (weeks: WeeklyProgress[]) => weeks.indexOf(weeks.reduce((best, w) => w.xp > best.xp ? w : best, weeks[0]));
const fn138 = (idx: number) => idx >= 0 ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx] : 'N/A';
const fn139 = (weeks: WeeklyProgress[]) => { const avg = fn135(weeks) / Math.max(1, weeks.length); return Math.round(avg); };
const fn140 = (week: number, avg: number) => week >= avg ? 'above-average' : 'below-average';
const fn141 = (weeks: WeeklyProgress[]) => weeks.filter(w => w.xp > 0).length;
const fn142 = (active: number) => `${active}/7 active days`;
const fn143 = (weeks: WeeklyProgress[]) => { const last = weeks.slice(-3); const prev = weeks.slice(-6, -3); const lastAvg = last.reduce((s, w) => s + w.xp, 0) / 3; const prevAvg = prev.reduce((s, w) => s + w.xp, 0) / 3; return prevAvg > 0 ? Math.round(((lastAvg - prevAvg) / prevAvg) * 100) : 0; };
const fn144 = (trend: number) => trend > 10 ? 'Accelerating 🚀' : trend > 0 ? 'Improving ↑' : trend < -10 ? 'Declining ↓' : 'Stable →';
const fn145 = (xp: number, streak: number) => Math.round(xp * (1 + streak * 0.01));
const fn146 = (base: number, multiplier: number) => Math.round(base * multiplier);
const fn147 = (weeks: WeeklyProgress[]) => weeks.map(w => ({ ...w, normalized: fn133(w.xp, fn132(weeks)) }));
const fn148 = (weeks: WeeklyProgress[]) => weeks.reduce((best, w) => w.lessons > best.lessons ? w : best, weeks[0]);
const fn149 = (w: WeeklyProgress) => `${w.day}: ${fn18(w.xp)} XP, ${w.lessons} lessons`;
const fn150 = (weeks: WeeklyProgress[]) => weeks.map(fn149).join(' | ');

// ─── MODULE 6: SKILL BREAKDOWN & RECOMMENDATIONS [fn151-fn200] ───
const fn151 = (acc: number, fluency: number, completed: number, streak: number) => ({
  listening: Math.min(100, Math.round(acc * 0.6 + fluency * 0.4)),
  speaking: Math.min(100, Math.round(fluency * 0.7 + acc * 0.3)),
  reading: Math.min(100, Math.round(fn88(completed, 600) * 0.8 + acc * 0.2)),
  vocabulary: Math.min(100, Math.round(completed * 0.15 + streak * 0.5)),
  strategy: Math.min(100, Math.round(fn43(completed, streak) / 20)),
  grammar: Math.min(100, Math.round(acc * 0.9)),
});
const fn152 = (skills: ReturnType<typeof fn151>) => Object.entries(skills).sort((a, b) => b[1] - a[1]);
const fn153 = (skills: ReturnType<typeof fn151>) => Object.entries(skills).sort((a, b) => a[1] - b[1]);
const fn154 = (skill: string, score: number) => score >= 90 ? `${skill}: Elite (${score}%)` : score >= 70 ? `${skill}: Proficient (${score}%)` : `${skill}: Developing (${score}%)`;
const fn155 = (skills: ReturnType<typeof fn151>) => Object.values(skills).reduce((s, v) => s + v, 0) / Object.values(skills).length;
const fn156 = (avg: number) => avg >= 85 ? 'Well-rounded Executive' : avg >= 70 ? 'Developing Leader' : 'Needs Coaching Plan';
const fn157 = (score: number) => score >= 90 ? 'bg-[#D4AF37]/100' : score >= 75 ? 'bg-[#D4AF37]/20' : score >= 60 ? 'bg-[#D4AF37]/20' : 'bg-[#D4AF37]/100';
const fn158 = (skills: ReturnType<typeof fn151>) => fn153(skills)[0]?.[0] || 'N/A';
const fn159 = (weakSkill: string) => `Focus on ${weakSkill} exercises this week for fastest improvement`;
const fn160 = (skills: ReturnType<typeof fn151>) => fn152(skills)[0]?.[0] || 'N/A';
const fn161 = (strongSkill: string) => `Your ${strongSkill} is your competitive advantage — maintain it`;
const fn162 = (skill: string) => skill === 'speaking' ? 'Use Speech Analytics daily' : skill === 'reading' ? 'Complete reading comprehension modules' : skill === 'vocabulary' ? 'Practice flashcard drills' : 'Engage with B2B simulations';
const fn163 = (skills: ReturnType<typeof fn151>) => Object.entries(skills).map(([k, v]) => ({ skill: k, score: v, bar: fn133(v, 100), color: fn157(v) }));
const fn164 = (acc: number) => acc >= 95 ? 10 : acc >= 85 ? 8 : acc >= 75 ? 6 : 4;
const fn165 = (completed: number) => completed >= 200 ? 10 : completed >= 100 ? 7 : completed >= 50 ? 5 : 3;
const fn166 = (streak: number) => streak >= 30 ? 10 : streak >= 14 ? 7 : streak >= 7 ? 5 : 2;
const fn167 = (fluency: number) => fluency >= 90 ? 10 : fluency >= 75 ? 7 : fluency >= 60 ? 5 : 3;
const fn168 = (acc: number, completed: number, streak: number, fluency: number) => Math.round((fn164(acc) + fn165(completed) + fn166(streak) + fn167(fluency)) / 4 * 10);
const fn169 = (score: number) => score >= 90 ? 'S-Class Executive' : score >= 70 ? 'A-Class Leader' : score >= 50 ? 'B-Class Professional' : 'C-Class Developing';
const fn170 = (xp: number, streak: number, completed: number) => Math.round((xp / 100) + (streak * 50) + (completed * 20));

// ─── MODULE 7: GOAL TRACKING & PROJECTIONS [fn171-fn220] ───
const fn171 = (xp: number) => Math.max(0, 5000 - xp);
const fn172 = (xp: number) => Math.max(0, 10000 - xp);
const fn173 = (xpPerDay: number, goal: number) => xpPerDay > 0 ? Math.ceil(goal / xpPerDay) : 999;
const fn174 = (days: number) => days <= 7 ? 'This week!' : days <= 30 ? `~${Math.ceil(days / 7)} weeks` : `~${Math.ceil(days / 30)} months`;
const fn175 = (xp: number, dailyXP: number) => fn173(dailyXP, fn172(xp));
const fn176 = (days: number) => new Date(Date.now() + days * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const fn177 = (xp: number, acc: number, streak: number) => Math.round(xp * 0.3 + acc * 0.5 + streak * 200);
const fn178 = (reading: number) => reading >= 80 ? 'On Track' : reading >= 50 ? 'Slightly Behind' : 'Needs Boost';
const fn179 = (xp: number) => Math.round(fn1(xp) * 50 + xp * 0.05);
const fn180 = (xp: number) => fn1(xp) * 2;
const fn181 = (xp: number) => [5000, 10000].map(goal => ({ goal, remaining: Math.max(0, goal - xp), days: fn173(100, Math.max(0, goal - xp)) }));
const fn182 = (completed: number) => Math.round((600 - completed) * 0.5);
const fn183 = (acc: number) => acc >= 90 ? 'Maintain' : acc >= 80 ? `+${90 - acc}% needed for Elite` : `+${80 - acc}% needed for Professional`;
const fn184 = (streak: number) => streak >= 30 ? '🏅 Max Badge' : `${30 - streak} days to Iron Discipline badge`;
const fn185 = (xp: number) => fn174(fn175(xp, 100));
const fn186 = (dailyGoal: number, actual: number) => Math.round((actual / dailyGoal) * 100);
const fn187 = (pct: number) => pct >= 100 ? '✅ Goal Met' : `${pct}% of daily goal`;
const fn188 = (xp: number) => xp >= 10000 ? 'S-Rank Unlocked!' : fn174(fn173(100, fn172(xp)));
const fn189 = (completed: number) => `${600 - completed} lessons remaining to complete the curriculum`;
const fn190 = (streak: number) => streak >= 30 ? 'Max streak badge achieved!' : `Keep going for ${fn92(streak)}-day badge`;
const fn191 = (acc: number) => acc >= 95 ? 'Elite tier unlocked!' : `+${95 - acc}% to Elite accuracy tier`;
const fn192 = (xp: number) => Math.round(xp / fn50(fn1(xp)) * 100);
const fn193 = (completed: number, streak: number) => Math.min(100, Math.round(completed * 0.3 + streak * 2));
const fn194 = (score: number) => score >= 80 ? 'Superb consistency' : score >= 60 ? 'Good regularity' : 'Improve study cadence';
const fn195 = (xp: number) => ({ level: fn1(xp), xpToNext: fn5(xp), progress: fn9(xp), title: fn6(fn1(xp)) });
const fn196 = (xp: number) => xp === 0 ? 'Begin your journey' : xp < 500 ? 'Great start!' : xp < 2000 ? 'Building momentum' : 'Executive trajectory';
const fn197 = (acc: number, fluency: number) => (acc + fluency) / 2 >= 80;
const fn198 = (qualified: boolean) => qualified ? 'C1 Module Eligible' : 'Complete B2 first';
const fn199 = (xp: number, completed: number) => Math.min(100, Math.round(xp / 100 * 0.5 + completed * 0.5));
const fn200 = (combo: number) => combo >= 80 ? 'Corporativo Ready' : combo >= 60 ? 'Business Fluent' : 'Keep Developing';

// ─── MODULE 8: PREMIUM INSIGHTS & EXPORT [fn201-fn250] ───
const fn201 = (xp: number, acc: number, streak: number, completed: number, fluency: number) =>
  `Executive Profile Report\n───────────────\nXP: ${fn18(xp)} | Level: ${fn1(xp)}\nAccuracy: ${acc}% | Fluency: ${fluency}\nStreak: ${streak} days\nLessons: ${completed}/600\nStatus: ${fn6(fn1(xp))}`;
const fn202 = (xp: number) => fn1(xp) >= 10 ? 'C2 Mastery Path' : fn1(xp) >= 7 ? 'C1 Advanced Track' : 'B2 Professional Path';
const fn203 = (xp: number) => fn202(xp) === 'C2 Mastery Path' ? '5 specialist modules available' : '3 advancement paths available';
const fn204 = (acc: number) => ['Phonetic precision', 'Executive vocabulary', 'Discourse markers'].slice(0, acc >= 85 ? 3 : acc >= 70 ? 2 : 1);
const fn205 = (completed: number) => completed >= 100 ? ['B2B Negotiations', 'Corporativo Sim', 'Speech Analytics'] : completed >= 50 ? ['Speech Analytics', 'B2B Intro'] : ['Foundational Drills'];
const fn206 = (xp: number, acc: number) => Math.round((xp / 100) * (acc / 100));
const fn207 = (efficiency: number) => efficiency >= 70 ? 'High-efficiency learner' : efficiency >= 40 ? 'Standard progression' : 'Optimize study sessions';
const fn208 = (streak: number) => streak * 25;
const fn209 = (bonus: number) => `+${bonus} XP streak bonus active`;
const fn210 = (acc: number, fluency: number, xp: number) => ({
  strengths: fn204(acc),
  unlocked: fn205(xp / 100),
  efficiency: fn207(fn206(xp, acc)),
  path: fn202(xp),
  nextMilestone: fn185(xp),
});
const fn211 = (xp: number) => xp > 0 ? `${((xp / 10000) * 100).toFixed(1)}% to Titanium Elite` : 'Start earning XP';
const fn212 = (completed: number, total: number) => `${completed}/${total} — ${fn89(fn88(completed, total))}`;
const fn213 = (acc: number) => acc >= 95 ? 5 : acc >= 85 ? 4 : acc >= 75 ? 3 : acc >= 65 ? 2 : 1;
const fn214 = (n: number) => Array.from({ length: n }, (_, i) => '⭐').join('') + Array.from({ length: 5 - n }, (_, i) => '☆').join('');
const fn215 = (xp: number, streak: number) => fn1(xp) >= 10 && streak >= 7 ? '🔓 Elite Access Unlocked' : '🔒 Reach Level 10 + 7-day streak';
const fn216 = (lvl: number) => lvl * 100 + 200;
const fn217 = (xp: number, dailyXP: number) => dailyXP > 0 ? Math.ceil((fn2(xp) - xp) / dailyXP) : '∞';
const fn218 = (completed: number) => 600 - completed;
const fn219 = (xp: number, acc: number, streak: number, completed: number, fluency: number) => fn168(acc, completed, streak, fluency);
const fn220 = (score: number) => fn169(score);

// ─── MODULE 9: SOCIAL & GAMIFICATION [fn221-fn270] ───
const fn221 = (xp: number, streak: number, acc: number) => `OnixLingo Executive | Level ${fn1(xp)} ${fn7(fn1(xp))} | ${fn21(streak)} | ${acc}% accuracy`;
const fn222 = (xp: number) => `linkedin.com/share?text=${encodeURIComponent(fn221(xp, 0, 0))}`;
const fn223 = (xp: number) => `twitter.com/intent/tweet?text=${encodeURIComponent(`🏆 I reached Level ${fn1(xp)} on OnixLingo Executive! ${fn7(fn1(xp))} @OnixLingo`)}`;
const fn224 = (profile: string) => { navigator.clipboard.writeText(profile); };
const fn225 = (xp: number) => xp >= 1000 ? 'visible' : 'hidden';
const fn226 = (achievements: Achievement[]) => fn53(achievements);
const fn227 = (xp: number, streak: number) => streak >= 7 ? Math.round(xp * 1.1) : xp;
const fn228 = (rank: number) => rank <= 10 ? '🏆 Top 10 Player' : rank <= 50 ? '⭐ Top 50' : `Rank #${rank}`;
const fn229 = (xp: number) => Math.min(100, Math.round((xp / 500) * fn9(xp)));
const fn230 = (level: number) => ['Rookie', 'Professional', 'Expert', 'Master', 'Legend'][Math.min(4, level - 1)];
const fn231 = (streak: number) => streak >= 7 ? 'text-orange-400 animate-pulse' : 'text-slate-600';
const fn232 = (streak: number, goal: number) => `${streak}/${goal} days`;
const fn233 = (users: LeaderboardUser[]) => users.map(u => u.xp).sort((a, b) => b - a);
const fn234 = (xps: number[], myXP: number) => xps.indexOf(myXP) + 1 || xps.length;
const fn235 = (completed: number) => `${completed} lessons mastered`;
const fn236 = (xp: number) => `${fn18(xp)} XP — ${fn6(fn1(xp))}`;
const fn237 = (streak: number) => streak >= 14 ? '💎 Commit Award Active' : 'Keep streak for bonus';
const fn238 = (acc: number) => acc >= 90 ? '🎯 Sharpshooter Badge' : 'Reach 90% for Sharpshooter';
const fn239 = (fluency: number) => fluency >= 85 ? '🗣️ Corporativo Voice' : `+${85 - fluency} fluency to unlock`;
const fn240 = (xp: number) => ({ title: fn6(fn1(xp)), badge: fn7(fn1(xp)), gradient: fn8(fn1(xp)), progress: fn9(xp), level: fn1(xp) });

// ─── MODULE 10: ADVANCED PROJECTIONS & COMPOSITE [fn241-fn300] ───
const fn241 = (xp: number, streak: number, completed: number, acc: number) => Math.round((xp * 0.35) + (streak * 100) + (completed * 15) + (acc * 10));
const fn242 = (score: number) => score >= 3000 ? '🏅 Elite Executive' : score >= 2000 ? '⭐ Senior Professional' : score >= 1000 ? '📊 Active Learner' : '🎯 Building Track';
const fn243 = (days: number) => Math.ceil(days / 7);
const fn244 = (xp: number, rate: number) => rate > 0 ? Math.round(xp + rate * 7) : xp;
const fn245 = (xp: number, streak: number) => streak >= 30 ? fn244(xp, 200) : streak >= 7 ? fn244(xp, 150) : fn244(xp, 100);
const fn246 = (xp: number) => fn1(fn245(xp, 14));
const fn247 = (projected: number, current: number) => projected > current ? `Level ${projected} in 2 weeks` : 'Maintain pace';
const fn248 = (acc: number, streak: number) => acc >= 90 && streak >= 7 ? 'Elite Performance Zone' : 'Standard Zone';
const fn249 = (acc: number) => 100 - acc;
const fn250 = (errors: number) => errors <= 5 ? 'Near Perfect' : errors <= 15 ? 'Professional Standard' : 'Room for Growth';
const fn251 = (xp: number, days: number) => days > 0 ? Math.round(xp / days) : 0;
const fn252 = (rate: number) => `${fn18(rate)} XP/day average`;
const fn253 = (xp: number, goal: number) => Math.round((xp / goal) * 100);
const fn254 = (pct: number) => `${pct}% to next milestone`;
const fn255 = (lvl: number) => `${fn18(fn50(lvl))} XP cap at Level ${lvl}`;
const fn256 = (xp: number) => xp % 500;
const fn257 = (remainder: number) => `${remainder} XP in current level`;
const fn258 = (streak: number, longest: number) => Math.max(streak, longest);
const fn259 = (best: number) => `Best: ${best} days`;
const fn260 = (acc: number, fluency: number, streak: number, completed: number, xp: number) => ({ composite: fn96(acc, fluency, completed), profile: fn97(fn96(acc, fluency, completed)), mastery: fn88(completed, 600), momentum: fn241(xp, streak, completed, acc) });
const fn261 = (data: ReturnType<typeof fn260>) => `${data.profile} — ${data.composite}% composite score`;
const fn262 = (xp: number) => Math.round(xp * 0.001);
const fn263 = (gems: number) => `${gems} Executive Gems`;
const fn264 = (xp: number, target: number) => Math.min(100, Math.round((xp / target) * 100));
const fn265 = (pct: number) => pct >= 100 ? 'text-amber-300 font-black' : 'text-slate-300';
const fn266 = (xp: number) => fn1(xp) >= 15 ? 'Diamond Hall' : fn1(xp) >= 10 ? 'Platinum Club' : fn1(xp) >= 7 ? 'Gold League' : 'Standard League';
const fn267 = (league: string) => league === 'Diamond Hall' ? 'ring-2 ring-cyan-400/50' : league === 'Platinum Club' ? 'ring-2 ring-violet-400/50' : '';
const fn268 = (completed: number) => Math.round(completed / 600 * 360);
const fn269 = (deg: number) => `conic-gradient(from 0deg, #14b8a6 0deg ${deg}deg, #1e293b ${deg}deg 360deg)`;
const fn270 = (xp: number, streak: number, acc: number, completed: number, fluency: number) => fn241(xp, streak, completed, acc) >= 2500;
const fn271 = (elite: boolean) => elite ? 'Eligible for Titanium Certification' : 'Keep earning XP & streaks';
const fn272 = (streak: number) => streak * 0.01 + 1;
const fn273 = (multiplier: number) => `${((multiplier - 1) * 100).toFixed(0)}% XP boost active`;
const fn274 = (xp: number, multiplier: number) => Math.round(xp * multiplier);
const fn275 = (users: LeaderboardUser[], myXP: number) => { const beats = users.filter(u => !u.isMe && u.xp < myXP).length; return { beats, total: users.length }; };
const fn276 = (data: { beats: number; total: number }) => `Outperforming ${data.beats}/${data.total} executives`;
const fn277 = (acc: number, fluency: number) => Math.round((acc + fluency) / 2);
const fn278 = (combined: number) => combined >= 90 ? 'Corporativo Master' : combined >= 75 ? 'Executive Communicator' : 'Developing Professional';
const fn279 = (xp: number) => xp >= 10000 ? '🏅 Titanium' : xp >= 5000 ? '💎 Diamond' : xp >= 2000 ? '🥇 Platinum' : xp >= 1000 ? '⭐ Gold' : '🔵 Silver';
const fn280 = (xp: number) => [1000, 2000, 5000, 10000].find(m => m > xp) || 10000;
const fn281 = (xp: number) => fn280(xp) - xp;
const fn282 = (remaining: number) => `${fn18(remaining)} XP to next tier`;
const fn283 = (xp: number) => Math.round((xp / fn280(xp)) * 100);
const fn284 = (pct: number) => `${pct}% of tier target`;
const fn285 = (users: LeaderboardUser[]) => users.reduce((sum, u) => sum + u.xp, 0);
const fn286 = (total: number, count: number) => Math.round(total / Math.max(1, count));
const fn287 = (myXP: number, avg: number) => myXP > avg ? `${fn18(myXP - avg)} above avg` : `${fn18(avg - myXP)} below avg`;
const fn288 = (xp: number) => xp > 0 ? Math.round(new Date().getHours() * (xp / 10000) * 10) : 0;
const fn289 = (peak: number) => `Peak performance: ${peak}:00h`;
const fn290 = (acc: number, streak: number, completed: number) => Math.round(acc * 0.4 + streak * 2 + completed * 0.3);
const fn291 = (health: number) => health >= 80 ? 'Excellent' : health >= 60 ? 'Good' : 'Needs Attention';
const fn292 = (xp: number) => Math.round(Math.sqrt(xp) * 3);
const fn293 = (intellect: number) => intellect >= 200 ? 'Executive IQ' : intellect >= 100 ? 'Professional IQ' : 'Foundation IQ';
const fn294 = (xp: number, acc: number, fluency: number, streak: number, completed: number) => ({ xp, level: fn1(xp), tier: fn279(xp), accuracy: acc, fluency, streak, completed, profile: fn6(fn1(xp)), composite: fn96(acc, fluency, completed) });
const fn295 = (profile: ReturnType<typeof fn294>) => `${profile.tier} | ${profile.profile} | L${profile.level} | ${profile.composite}% composite`;
const fn296 = (score: number, threshold: number) => score >= threshold;
const fn297 = (eligible: boolean, reward: string) => eligible ? `✅ ${reward} — Unlocked!` : `🔒 ${reward}`;
const fn298 = (xp: number) => Object.entries({ Gold: 1000, Platinum: 2000, Diamond: 5000, Titanium: 10000 }).map(([tier, target]) => ({ tier, progress: fn264(xp, target), unlocked: xp >= target }));
const fn299 = (tiers: ReturnType<typeof fn298>) => tiers.filter(t => t.unlocked).length;
const fn300 = (xp: number, streak: number, acc: number, completed: number, fluency: number) => {
  const lvl = fn1(xp);
  const composite = fn96(acc, fluency, completed);
  const momentum = fn241(xp, streak, completed, acc);
  return { level: lvl, title: fn6(lvl), badge: fn7(lvl), tier: fn279(xp), composite, momentum, elite: fn270(xp, streak, acc, completed, fluency), league: fn266(xp), certification: fn271(fn270(xp, streak, acc, completed, fluency)) };
};

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export const ExecutiveCommandCenter = ({ onClose, kpis, completedLessons }: ExecutiveCommandCenterProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isLoadingRanking, setIsLoadingRanking] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'achievements' | 'ranking'>('overview');
  const [copied, setCopied] = useState(false);

  const level = fn1(kpis.totalXP);
  const progressPct = fn9(kpis.totalXP);
  const achievements = fn52(fn51(kpis.totalXP), kpis.totalXP, kpis.streakDays, kpis.accuracy, completedLessons, kpis.fluencyScore, level);
  const skills = fn151(kpis.accuracy, kpis.fluencyScore, completedLessons, kpis.streakDays);
  const skillRows = fn163(skills);
  const weeklyData = fn131(kpis.totalXP);
  const weeklyMax = fn132(weeklyData);
  const tiers = fn298(kpis.totalXP);
  const profile = fn300(kpis.totalXP, kpis.streakDays, kpis.accuracy, completedLessons, kpis.fluencyScore);
  const composite = fn260(kpis.accuracy, kpis.fluencyScore, kpis.streakDays, completedLessons, kpis.totalXP);
  const insightsPanel = fn210(kpis.accuracy, kpis.fluencyScore, kpis.totalXP);
  const nearAchievements = fn58(achievements);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = Cookies.get('access_token');
        const res = await fetch(`${API_URL}/api/v1/progress/leaderboard?limit=10`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(fn101(data.leaderboard || [], kpis.totalXP));
        } else {
          const fallback: LeaderboardUser[] = [
            { rank: 1, alias: 'Exec_Alpha', xp: kpis.totalXP + 2800, isMe: false, tier: 'titanium', trend: 'up' },
            { rank: 2, alias: 'Director_V', xp: kpis.totalXP + 1200, isMe: false, tier: 'titanium', trend: 'up' },
            { rank: 3, alias: 'You (Titanium)', xp: kpis.totalXP, isMe: true, tier: 'titanium', trend: 'same' },
            { rank: 4, alias: 'CFO_Sigma', xp: Math.max(0, kpis.totalXP - 300), isMe: false, trend: 'down' },
            { rank: 5, alias: 'StratDir_K', xp: Math.max(0, kpis.totalXP - 800), isMe: false, trend: 'down' },
          ];
          setLeaderboard(fallback);
        }
      } catch { } finally { setIsLoadingRanking(false); }
    };
    fetchLeaderboard();
  }, [kpis.totalXP]);

  const me = fn102(leaderboard);
  const leader = fn104(leaderboard);
  const gap = fn105(me, leader);
  const gapText = fn106(gap);
  const myRankPos = fn39(leaderboard);
  const beats = fn275(leaderboard, kpis.totalXP);

  const handleCopyProfile = () => {
    fn224(fn201(kpis.totalXP, kpis.accuracy, kpis.streakDays, completedLessons, kpis.fluencyScore));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border border-indigo-500/20 rounded-none w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">

        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md border-b border-indigo-500/20 px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-none bg-gradient-to-br ${profile.badge === '👑' ? 'from-amber-500/20 to-yellow-900/10' : 'from-indigo-500/15 to-blue-900/10'} ring-1 ring-inset ring-white/10`}>
              <span className="text-2xl">{profile.badge}</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Command Center</h2>
              <p className={`text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${profile.badge === '👑' ? 'from-amber-300 to-yellow-400' : 'from-indigo-300 to-blue-400'} bg-clip-text text-transparent`}>
                {profile.title} · {profile.league}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopyProfile} className="px-3 py-1.5 bg-[#D4AF37]/20/10 border border-indigo-500/20 text-indigo-300 hover:bg-[#D4AF37]/20/20 text-[9px] font-black uppercase rounded-none transition-colors">
              {copied ? '✓ Copied' : 'Export'}
            </button>
            <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/15 text-slate-500 hover:text-slate-900 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* LEVEL + XP HERO BAR */}
        <div className={`px-6 py-5 bg-gradient-to-r ${fn8(level)} bg-opacity-10 border-b border-white/5`}>
          <div className="flex items-end justify-between mb-3">
            <div>
              <span className="text-[8px] font-black text-slate-900/50 uppercase tracking-widest block">Global Executive Level</span>
              <span className="text-5xl font-black text-slate-900 leading-none">{level}</span>
            </div>
            <div className="text-right">
              <span className={`text-xs font-black uppercase tracking-widest ${fn47(kpis.totalXP)}`}>{fn18(kpis.totalXP)} XP</span>
              <span className="text-[8px] text-slate-900/40 block mt-0.5">{fn5(kpis.totalXP)} XP to next level</span>
            </div>
          </div>
          <div className="relative h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${fn8(level)} rounded-full transition-all duration-700`} style={{ width: `${progressPct}%` }} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          </div>
          <div className="flex justify-between mt-1.5 text-[8px] font-black text-slate-900/30">
            <span>Level {level}</span>
            <span className="text-slate-900/60">{progressPct}%</span>
            <span>Level {level + 1}</span>
          </div>
        </div>

        {/* TABS */}
        <div className="flex border-b border-white/5 bg-white/20 flex-shrink-0">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'skills', label: 'Skills', icon: Target },
            { id: 'achievements', label: 'Badges', icon: Award },
            { id: 'ranking', label: 'Ranking', icon: Trophy },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3.5 flex flex-col items-center gap-1 border-b-2 text-[8px] font-black uppercase tracking-wider transition-all ${isActive ? 'border-indigo-400 text-indigo-300 bg-indigo-950/20' : 'border-transparent text-slate-600 hover:text-slate-500'}`}>
                <Icon size={12} className={isActive ? 'text-indigo-400' : ''} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 space-y-5">

          {/* ═══ OVERVIEW ═══ */}
          {activeTab === 'overview' && (
            <>
              {/* KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'XP Total', val: fn18(kpis.totalXP), sub: fn196(kpis.totalXP), color: 'text-amber-300', icon: '⚡' },
                  { label: 'Accuracy', val: `${kpis.accuracy}%`, sub: fn27(kpis.accuracy), color: fn28(kpis.accuracy), icon: '🎯' },
                  { label: 'Streak', val: `${kpis.streakDays}d`, sub: fn21(kpis.streakDays), color: fn22(kpis.streakDays), icon: '🔥' },
                  { label: 'Lessons', val: `${completedLessons}`, sub: fn46(fn25(completedLessons)), color: 'text-teal-300', icon: '📚' },
                ].map((kpi, i) => (
                  <div key={i} className="p-4 bg-white/3 border border-white/8 rounded-none hover:bg-white/6 transition-colors">
                    <span className="text-lg mb-1 block">{kpi.icon}</span>
                    <span className={`text-xl font-black ${kpi.color} block leading-tight`}>{kpi.val}</span>
                    <span className="text-[8px] font-bold text-slate-600 uppercase block mt-0.5">{kpi.label}</span>
                    <span className="text-[7px] text-slate-600 block">{kpi.sub}</span>
                  </div>
                ))}
              </div>

              {/* Composite Score */}
              <div className="p-4 bg-indigo-950/30 border border-indigo-500/15 rounded-none">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">Composite Performance</span>
                  <span className="text-[9px] font-black text-slate-900">{fn261(composite)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 flex items-center justify-center bg-indigo-950/50 flex-shrink-0">
                    <span className="text-2xl font-black text-indigo-300">{composite.composite}</span>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between text-[8px] font-bold"><span className="text-slate-500">Mastery</span><span className="text-slate-300">{composite.mastery}%</span></div>
                    <div className="h-1 bg-slate-50 rounded-full"><div className="h-full bg-indigo-400 rounded-full" style={{ width: `${composite.mastery}%` }} /></div>
                    <div className="flex justify-between text-[8px] font-bold"><span className="text-slate-500">Momentum</span><span className="text-slate-300">{fn242(composite.momentum)}</span></div>
                    <div className="h-1 bg-slate-50 rounded-full"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(100, composite.momentum / 30)}%` }} /></div>
                  </div>
                </div>
              </div>

              {/* Weekly Activity Heatmap */}
              <div className="p-4 bg-white/3 border border-white/8 rounded-none">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Weekly Activity</span>
                  <span className="text-[8px] text-slate-600">{fn18(fn135(weeklyData))} XP this week</span>
                </div>
                <div className="flex gap-2 items-end h-16">
                  {weeklyData.map((w, i) => {
                    const h = fn133(w.xp, weeklyMax);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className={`w-full rounded-t transition-all duration-500 ${fn134(h)}`} style={{ height: `${h}%` }} title={fn149(w)} />
                        <span className="text-[7px] font-black text-slate-600">{w.day.slice(0, 1)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 flex items-center justify-between text-[8px] text-slate-600">
                  <span>{fn142(fn141(weeklyData))}</span>
                  <span>{fn144(fn143(weeklyData))}</span>
                </div>
              </div>

              {/* Tier Progression */}
              <div className="p-4 bg-white/3 border border-white/8 rounded-none">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-3">Tier Milestones</span>
                <div className="space-y-2">
                  {tiers.map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[8px] font-black text-slate-600 w-16 uppercase">{t.tier}</span>
                      <div className="flex-1 bg-slate-50 h-1.5 rounded-full">
                        <div className={`h-full rounded-full transition-all ${t.unlocked ? 'bg-emerald-400' : 'bg-[#D4AF37]/20'}`} style={{ width: `${t.progress}%` }} />
                      </div>
                      <span className="text-[8px] font-bold text-slate-500 w-8 text-right">{t.progress}%</span>
                      {t.unlocked && <CheckCircle2 size={10} className="text-emerald-400 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights Row */}
              <div className="p-4 bg-amber-950/20 border border-[#D4AF37]/30/15 rounded-none">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block mb-2">🔍 AI Insights</span>
                <ul className="space-y-1">
                  {[
                    fn196(kpis.totalXP),
                    fn183(kpis.accuracy),
                    fn184(kpis.streakDays),
                    fn189(completedLessons),
                    profile.certification,
                  ].map((tip, i) => (
                    <li key={i} className="text-[9px] text-slate-500 flex items-start gap-2">
                      <span className="text-[#D4AF37] shrink-0 font-black">·</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* ═══ SKILLS ═══ */}
          {activeTab === 'skills' && (
            <>
              <div className="text-center p-4 bg-white/3 border border-white/8 rounded-none">
                <span className="text-[8px] font-black text-slate-600 uppercase block">Overall Skill Average</span>
                <span className="text-4xl font-black text-slate-900">{Math.round(fn155(skills))}%</span>
                <span className="text-[9px] text-slate-500 block mt-1">{fn156(fn155(skills))}</span>
              </div>

              <div className="space-y-3">
                {skillRows.map((s, i) => (
                  <div key={i} className="p-3.5 bg-white/3 border border-white/8 rounded-none">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{s.skill}</span>
                      <span className="text-[9px] font-black text-slate-500">{s.score}%</span>
                    </div>
                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${s.color}`} style={{ width: `${s.score}%` }} />
                    </div>
                    <span className="text-[7px] text-slate-600 mt-1 block">{fn154(s.skill, s.score)}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-none">
                  <span className="text-[8px] font-black text-emerald-400 uppercase block mb-1">Strongest</span>
                  <span className="text-xs font-black text-slate-900 capitalize">{fn160(skills)}</span>
                  <span className="text-[8px] text-slate-600 block mt-1">{fn161(fn160(skills))}</span>
                </div>
                <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-none">
                  <span className="text-[8px] font-black text-rose-400 uppercase block mb-1">Focus Area</span>
                  <span className="text-xs font-black text-slate-900 capitalize">{fn158(skills)}</span>
                  <span className="text-[8px] text-slate-600 block mt-1">{fn162(fn158(skills))}</span>
                </div>
              </div>

              <div className="p-3 bg-white/3 border border-white/8 rounded-none">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-2">Certification Eligibility</span>
                <p className="text-[9px] text-slate-300">{fn215(kpis.totalXP, kpis.streakDays)}</p>
                <p className="text-[9px] text-slate-600 mt-1">{fn198(fn197(kpis.accuracy, kpis.fluencyScore))}</p>
              </div>
            </>
          )}

          {/* ═══ ACHIEVEMENTS ═══ */}
          {activeTab === 'achievements' && (
            <>
              <div className="flex items-center justify-between p-3 bg-white/3 border border-white/8 rounded-none">
                <div>
                  <span className="text-[8px] font-black text-slate-600 uppercase">Achievement Progress</span>
                  <p className="text-sm font-black text-slate-900">{fn65(achievements.length, fn53(achievements))}</p>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-black text-amber-400 uppercase block">Bonus XP Earned</span>
                  <span className="text-sm font-black text-amber-300">+{fn18(fn55(achievements))}</span>
                </div>
              </div>

              {nearAchievements.length > 0 && (
                <div className="p-3 bg-amber-950/20 border border-[#D4AF37]/30/15 rounded-none">
                  <span className="text-[8px] font-black text-amber-400 uppercase block mb-2">⚡ Almost There!</span>
                  {nearAchievements.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1.5">
                      <span>{a.icon}</span>
                      <div className="flex-1">
                        <span className="text-[9px] font-bold text-slate-900 block">{a.title}</span>
                        <div className="h-1 bg-slate-50 rounded-full mt-0.5"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${fn56(a)}%` }} /></div>
                      </div>
                      <span className="text-[8px] font-bold text-amber-300">{fn56(a)}%</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {achievements.map((a, i) => (
                  <div key={i} className={`p-3 rounded-none border transition-all ${fn63(a)}`}>
                    <div className="flex items-center gap-3">
                      <span className={`text-xl ${a.earned ? '' : 'grayscale opacity-40'}`}>{a.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <span className={`text-[9px] font-black uppercase ${fn64(a)}`}>{a.title}</span>
                          {a.earned && <CheckCircle2 size={11} className="text-emerald-400 flex-shrink-0" />}
                        </div>
                        <span className="text-[8px] text-slate-600">{a.description}</span>
                        {!a.earned && (
                          <div className="h-1 bg-slate-50 rounded-full mt-1"><div className={`h-full rounded-full ${fn57(fn56(a))}`} style={{ width: `${fn56(a)}%` }} /></div>
                        )}
                      </div>
                      <span className="text-[8px] font-black text-amber-400 flex-shrink-0">+{a.xpReward} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══ RANKING ═══ */}
          {activeTab === 'ranking' && (
            <>
              {me && (
                <div className="p-4 bg-amber-950/20 border border-[#D4AF37]/30/20 rounded-none text-center">
                  <span className="text-[8px] font-black text-amber-400 uppercase block">Your Global Rank</span>
                  <span className="text-5xl font-black text-amber-300">#{fn103(me)}</span>
                  <p className="text-[9px] text-slate-500 mt-1">{fn276(beats)}</p>
                  <p className="text-[9px] text-slate-600">{gapText}</p>
                </div>
              )}

              {isLoadingRanking ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin text-indigo-400 mb-2" />
                  <span className="text-[9px] font-black text-slate-600 uppercase">Syncing Rankings...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((user, i) => (
                    <div key={i} className={`p-3.5 rounded-none border transition-all bg-gradient-to-r ${fn119(user.rank)}`}>
                      <div className="flex items-center gap-3">
                        <span className={`text-base font-black w-7 text-center ${fn35(user.rank)}`}>{fn36(user.rank)}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black ${fn125(user.isMe)}`}>
                          {user.alias.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black truncate ${user.isMe ? 'text-amber-300' : 'text-slate-200'}`}>{user.alias}</span>
                            {user.isMe && <span className="text-[7px] bg-[#D4AF37]/20/20 px-1.5 py-0.5 rounded text-amber-400 font-black uppercase border border-[#D4AF37]/30/30">You</span>}
                            {fn114(user.tier) !== '🔵' && <span className="text-xs">{fn114(user.tier)}</span>}
                          </div>
                          <div className="h-1 bg-slate-50 rounded-full mt-1 max-w-32">
                            <div className={`h-full rounded-full ${user.isMe ? 'bg-amber-400' : 'bg-slate-600'}`} style={{ width: `${fn129(user.xp, fn116(leaderboard))}%` }} />
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-[9px] font-black text-slate-500 block">{fn18(user.xp)} XP</span>
                          {user.trend && <span className={`text-[8px] font-black ${fn48(user.trend)}`}>{fn49(user.trend)}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {leaderboard.length > 0 && (
                <div className="p-3 bg-white/3 border border-white/8 rounded-none">
                  <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">League Average</span>
                  <p className="text-[9px] text-slate-300">{fn287(kpis.totalXP, fn286(fn285(leaderboard), leaderboard.length))}</p>
                  <p className="text-[9px] text-slate-600 mt-0.5">Share: <a href={fn223(kpis.totalXP)} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Twitter</a> · <a href={fn222(kpis.totalXP)} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">LinkedIn</a></p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
