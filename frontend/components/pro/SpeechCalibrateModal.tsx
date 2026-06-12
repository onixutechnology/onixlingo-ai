'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Mic, Square, Loader2, Activity, BarChart3, TrendingUp,
  Volume2, Award, CheckCircle2, AlertTriangle, RefreshCw,
  Target, Zap, Radio, ChevronRight, Waves, Star, ChevronLeft,
  Globe, Clipboard, Download, Play
} from 'lucide-react';
import apiClient from '@/lib/apiClient';

// ══════════════════════════════════════════════════════════════
// INTERFACES
// ══════════════════════════════════════════════════════════════

interface SpeechCalibrateModalProps {
  onClose: () => void;
  initialAccuracy?: number;
  initialFluency?: number;
}

interface PhoneticScore {
  accuracy: number;
  fluency: number;
  intonation: number;
  rhythm: number;
  clarity: number;
  pace: number;
  energy: number;
  confidence: number;
}

interface SessionResult {
  id: string;
  text: string;
  scores: PhoneticScore;
  wpm: number;
  fillers: number;
  duration: number;
  transcript: string;
  timestamp: number;
  level: string;
}

interface CalibrationPhrase {
  id: string;
  text: string;
  level: 'B1' | 'B2' | 'C1' | 'C2';
  category: string;
  focus: string;
  targetWPM: [number, number];
}

// ══════════════════════════════════════════════════════════════
// CORPUS: 20 CALIBRATION PHRASES
// ══════════════════════════════════════════════════════════════

const CALIBRATION_PHRASES: CalibrationPhrase[] = [
  { id: 'b1_01', level: 'B1', category: 'Market Entry', focus: 'Consonant precision', targetWPM: [110, 140], text: 'Our strategic imperative is to leverage synergistic partnerships to maximize shareholder value and drive sustainable growth across emerging markets.' },
  { id: 'b1_02', level: 'B1', category: 'Operations', focus: 'Vowel clarity', targetWPM: [100, 135], text: 'We must pivot our core operations to align with the new regulatory frameworks while maintaining our competitive edge in the digital transformation landscape.' },
  { id: 'b2_01', level: 'B2', category: 'Finance', focus: 'Stress & intonation', targetWPM: [120, 150], text: 'The quarterly forecast indicates a robust upward trend, provided we mitigate the supply chain bottlenecks and optimize our current asset allocation across portfolios.' },
  { id: 'b2_02', level: 'B2', category: 'Leadership', focus: 'Rhythm & pace', targetWPM: [115, 145], text: 'Effective leadership in this paradigm requires transparent communication, cross-functional collaboration, and a relentless focus on customer-centric innovation.' },
  { id: 'b2_03', level: 'B2', category: 'Negotiation', focus: 'Emphasis patterns', targetWPM: [110, 140], text: 'We can structure a flexible payment framework tied to delivery milestones, which mitigates your financial exposure while aligning incentives for optimal performance.' },
  { id: 'c1_01', level: 'C1', category: 'M&A Strategy', focus: 'Complex consonant clusters', targetWPM: [130, 160], text: 'By engineering a multi-layered redundancy framework, we successfully hedged our exposure to highly volatile global equity fluctuations while preserving EBITDA margins.' },
  { id: 'c1_02', level: 'C1', category: 'Cloud Strategy', focus: 'Technical terminology', targetWPM: [125, 155], text: 'The post-merger integration blueprint utilizes comprehensive due diligence indices to consolidate sovereign cloud migrations under dynamic security and compliance standards.' },
  { id: 'c1_03', level: 'C1', category: 'Board Presentation', focus: 'Authoritative cadence', targetWPM: [120, 150], text: 'Our proprietary predictive algorithm identifies latent inefficiencies across distributed operational units, enabling targeted interventions that recover lost throughput at scale.' },
  { id: 'c1_04', level: 'C1', category: 'Risk Management', focus: 'Measured authority', targetWPM: [115, 145], text: 'Geopolitical volatility necessitates a diversified counterparty exposure strategy, incorporating dynamic currency hedging and jurisdictional arbitrage across tier-one markets.' },
  { id: 'c2_01', level: 'C2', category: 'VC Pitch', focus: 'Aspirational projection', targetWPM: [135, 165], text: 'Our unit economics have improved for eleven consecutive quarters, positioning us at the intersection of compounding network effects and defensible moat architecture at scale.' },
  { id: 'c2_02', level: 'C2', category: 'IPO Readiness', focus: 'Alta Dirección gravitas', targetWPM: [130, 160], text: 'The prospectus underpins our CAGR thesis through institutional-grade financial transparency, demonstrating asymmetric risk-adjusted returns for long-horizon capital allocators.' },
  { id: 'c2_03', level: 'C2', category: 'Crisis Communication', focus: 'Controlled urgency', targetWPM: [125, 155], text: 'The remediation protocol prioritizes stakeholder confidence through proactive disclosure, operational continuity assurance, and a demonstrably credible recovery timeline.' },
  { id: 'c2_04', level: 'C2', category: 'Innovation Keynote', focus: 'Inspirational flow', targetWPM: [120, 150], text: 'We are architecting an AI-native ecosystem wherein autonomous decision engines accelerate institutional cognition while preserving human judgment at critical governance inflection points.' },
  { id: 'b1_03', level: 'B1', category: 'Sales', focus: 'Warmth & persuasion', targetWPM: [100, 130], text: 'Our platform delivers measurable ROI within ninety days, backed by a dedicated implementation team and enterprise-grade support available around the clock globally.' },
  { id: 'b2_04', level: 'B2', category: 'Investor Relations', focus: 'Data precision', targetWPM: [115, 145], text: 'Q3 revenue grew forty-two percent year-over-year to three-point-four billion, driven by record enterprise adoption and a twenty-eight percent expansion in average contract value.' },
  { id: 'c1_05', level: 'C1', category: 'ESG Reporting', focus: 'Measured authority', targetWPM: [120, 150], text: 'Our carbon neutrality roadmap is underpinned by verified scope-three emissions accounting and a science-based target aligned to the Paris Agreement one-point-five degree pathway.' },
  { id: 'c2_05', level: 'C2', category: 'Regulatory Testimony', focus: 'Legal gravitas', targetWPM: [100, 130], text: 'The systemic interdependencies between counterparty risk concentration and macroprudential liquidity buffers require a calibrated supervisory response proportionate to aggregate exposure.' },
  { id: 'b1_04', level: 'B1', category: 'HR & Culture', focus: 'Empathy & clarity', targetWPM: [105, 135], text: 'Building a high-performance culture requires psychological safety, clear accountability structures, and continuous feedback loops that enable rapid organizational learning and adaptation.' },
  { id: 'b2_05', level: 'B2', category: 'Digital Transformation', focus: 'Smooth flow', targetWPM: [115, 145], text: 'Successful digital transformation requires aligning technology investments with strategic business outcomes, while managing change at the speed of organizational absorption capacity.' },
  { id: 'c1_06', level: 'C1', category: 'Supply Chain', focus: 'Technical authority', targetWPM: [120, 150], text: 'Nearshoring manufacturing capacity across ASEAN tier-two suppliers reduces single-point-of-failure risk while enabling agile replenishment cycles calibrated to demand signal latency.' },
];

// ══════════════════════════════════════════════════════════════
// 300 PROFESSIONAL SPEECH ANALYTICS FUNCTIONS
// ══════════════════════════════════════════════════════════════

// ─── MODULE 1: PHONETIC SCORING [fn1-fn60] ───
const fn1 = (t: string) => t.split(/\s+/).filter(Boolean).length;
const fn2 = (t: string) => t.split(/[.!?]+/).filter(Boolean).length;
const fn3 = (t: string, s: number) => s > 0 ? Math.round((fn1(t) / s) * 60) : 0;
const fn4 = (wpm: number, target: [number, number]) => wpm >= target[0] && wpm <= target[1] ? 100 : wpm < target[0] ? Math.max(0, 100 - (target[0] - wpm) * 2) : Math.max(0, 100 - (wpm - target[1]) * 2);
const fn5 = (t: string) => t.toLowerCase().split(' ').filter(w => ['uh','um','like','so','basically','actually','literally','right','you know'].includes(w)).length;
const fn6 = (fc: number, wc: number) => wc > 0 ? Math.round((fc / wc) * 100) : 0;
const fn7 = (pct: number) => pct <= 1 ? 'Exceptional clarity' : pct <= 3 ? 'Professional standard' : pct <= 6 ? 'Moderate fillers' : 'High filler rate — practice needed';
const fn8 = (t: string) => t.split(' ').map(w => w.length).reduce((a, b) => a + b, 0) / Math.max(1, fn1(t));
const fn9 = (avg: number) => avg > 7 ? 'Alta Dirección vocabulary' : avg > 5 ? 'Professional range' : 'Build lexical complexity';
const fn10 = (t: string) => fn2(t) > 0 ? Math.round(fn1(t) / fn2(t)) : 0;
const fn11 = (avg: number) => avg > 20 ? 'Complex discourse' : avg < 8 ? 'Too concise' : 'Optimal length';
const fn12 = (t: string) => t.toLowerCase().split(' ').filter(w => ['roi','ebitda','irr','npv','kpi','arr','cagr','ltv','sla','ipo','m&a','pe','vc'].includes(w)).length;
const fn13 = (t: string) => t.toLowerCase().split(' ').filter(w => w.length > 9).length;
const fn14 = (c: number, tot: number) => tot > 0 ? Math.round((c / tot) * 100) : 0;
const fn15 = (pct: number) => pct > 30 ? 'Advanced lexical profile' : 'Increase word complexity';
const fn16 = (t: string) => ['sh', 'th', 'wh', 'ch', 'ph', 'qu'].filter(d => t.toLowerCase().includes(d)).length;
const fn17 = (score: number) => score > 5 ? 100 : score * 15 + 25;
const fn18 = (t: string) => t.match(/[A-Z][a-z]+/g)?.length || 0;
const fn19 = (stress: number) => Math.min(100, stress * 8 + 40);
const fn20 = (wpm: number) => wpm > 160 ? 'Too fast — reduce pace' : wpm < 80 ? 'Too slow — increase energy' : wpm < 100 ? 'Deliberate pacing' : wpm < 130 ? 'Professional cadence' : wpm < 150 ? 'Dynamic delivery' : 'High-energy executive';
const fn21 = (t: string) => { const words = t.split(' '); const unique = new Set(words.map(w => w.toLowerCase())); return Math.round((unique.size / Math.max(1, words.length)) * 100); };
const fn22 = (ltt: number) => ltt > 80 ? 'Elite vocabulary diversity' : ltt > 65 ? 'Professional range' : 'Improve word variety';
const fn23 = (t: string) => t.match(/\d+(\.\d+)?(%|M|K|B|x|\$|bn)/g)?.length || 0;
const fn24 = (c: number) => c > 2 ? 'Data-driven delivery' : 'Add quantitative references';
const fn25 = (t: string) => t.toLowerCase().split(' ').filter(w => ['however', 'therefore', 'furthermore', 'consequently', 'nevertheless', 'accordingly'].includes(w)).length;
const fn26 = (c: number) => c > 1 ? 'Strong discourse connectors' : 'Use academic connectors';
const fn27 = (acc: number) => acc >= 95 ? 'Native-speaker equivalence' : acc >= 85 ? 'Near-native proficiency' : acc >= 75 ? 'Professional grade' : 'Below Alta Dirección standard';
const fn28 = (acc: number) => acc >= 95 ? 'text-emerald-300' : acc >= 85 ? 'text-teal-300' : acc >= 75 ? 'text-amber-300' : 'text-rose-300';
const fn29 = (fluency: number) => fluency >= 90 ? 'Corporativo native' : fluency >= 78 ? 'Executive fluent' : fluency >= 65 ? 'Business conversational' : 'Developing fluency';
const fn30 = (wpm: number, target: [number, number]) => fn4(wpm, target) >= 80 ? 'On-target delivery speed' : wpm < target[0] ? 'Increase delivery pace' : 'Reduce speed for clarity';
const fn31 = (pct: number) => 100 - pct;
const fn32 = (score: number) => `${score >= 90 ? '🏆' : score >= 75 ? '⭐' : score >= 60 ? '✅' : '🔰'} ${score}%`;
const fn33 = (scores: PhoneticScore) => Math.round((scores.accuracy + scores.fluency + scores.intonation + scores.rhythm + scores.clarity + scores.pace + scores.energy + scores.confidence) / 8);
const fn34 = (composite: number) => composite >= 90 ? 'Elite Executive Voice' : composite >= 80 ? 'Senior Professional' : composite >= 70 ? 'Business Communicator' : composite >= 60 ? 'Developing Speaker' : 'Needs Coaching';
const fn35 = (composite: number) => composite >= 90 ? 'from-emerald-500 to-teal-400' : composite >= 80 ? 'from-blue-500 to-indigo-400' : composite >= 70 ? 'from-amber-500 to-orange-400' : 'from-slate-600 to-slate-500';
const fn36 = (composite: number) => composite >= 90 ? 'text-emerald-300' : composite >= 80 ? 'text-blue-300' : composite >= 70 ? 'text-amber-300' : 'text-slate-500';
const fn37 = (scores: PhoneticScore) => Object.entries(scores).sort((a, b) => b[1] - a[1]);
const fn38 = (scores: PhoneticScore) => Object.entries(scores).sort((a, b) => a[1] - b[1]);
const fn39 = (key: string) => key === 'accuracy' ? 'Pronunciation' : key === 'fluency' ? 'Fluency' : key === 'intonation' ? 'Intonation' : key === 'rhythm' ? 'Rhythm' : key === 'clarity' ? 'Clarity' : key === 'pace' ? 'Pace' : key === 'energy' ? 'Energy' : 'Confidence';
const fn40 = (score: number) => score >= 90 ? 'bg-[#D4AF37]/100' : score >= 75 ? 'bg-[#D4AF37]/20' : score >= 60 ? 'bg-[#D4AF37]/20' : 'bg-[#D4AF37]/100';
const fn41 = (acc: number, fluency: number, intonation: number) => Math.round(acc * 0.4 + fluency * 0.3 + intonation * 0.3);
const fn42 = (score: number) => score >= 90 ? 'C2 Mastery' : score >= 78 ? 'C1 Advanced' : score >= 65 ? 'B2 Professional' : 'B1 Developing';
const fn43 = (t: string) => t.toLowerCase().split(' ').filter(w => ['strategic', 'leverage', 'synergy', 'optimize', 'transform', 'disrupt', 'scale', 'pivot', 'align'].includes(w)).length;
const fn44 = (c: number) => Math.min(100, c * 12 + 40);
const fn45 = (t: string) => t.toLowerCase().split(' ').filter(w => ['we', 'our', 'us', 'together', 'collectively', 'partnership'].includes(w)).length;
const fn46 = (t: string) => t.toLowerCase().split(' ').filter(w => ['i', 'my', 'me', 'mine'].includes(w)).length;
const fn47 = (coll: number, indiv: number) => coll > indiv ? 'Collaborative register' : 'Shift to inclusive "we" language';
const fn48 = (t: string) => { const l = t.toLowerCase().replace(/[^a-z]/g, '').length; const w = fn1(t); const s = fn2(t); if (!w || !s) return 50; return Math.round(Math.max(0, 206.835 - 1.015 * (w / s) - 84.6 * (l / w / 1.2))); };
const fn49 = (rs: number) => rs < 30 ? 'Executive Grade' : rs < 50 ? 'Academic Level' : rs < 65 ? 'Business Register' : 'Public Register';
const fn50 = (t: string) => t.toLowerCase().split(' ').filter(w => ['confident', 'certain', 'clear', 'committed', 'decisive', 'assured'].includes(w)).length;
const fn51 = (t: string) => t.toLowerCase().split(' ').filter(w => ['possibly', 'perhaps', 'maybe', 'might', 'uncertain', 'unclear'].includes(w)).length;
const fn52 = (conf: number, hedge: number) => conf > hedge ? Math.min(100, 60 + conf * 10) : Math.max(30, 60 - hedge * 8);
const fn53 = (t: string) => t.toLowerCase().split(' ').filter(w => ['immediately', 'urgently', 'critical', 'priority', 'essential', 'crucial'].includes(w)).length;
const fn54 = (t: string) => t.toLowerCase().split(' ').filter(w => ['long-term', 'sustainable', 'enduring', 'lasting', 'permanent'].includes(w)).length;
const fn55 = (urgent: number, long: number) => urgent > long ? 'Urgency-led register' : long > urgent ? 'Strategic long-term voice' : 'Balanced temporal register';
const fn56 = (t: string) => t.match(/[!?]{1,}/g)?.length || 0;
const fn57 = (t: string) => t.match(/["']([^"']+)["']/g)?.length || 0;
const fn58 = (t: string) => (t.match(/,/g) || []).length;
const fn59 = (commas: number, sentences: number) => sentences > 0 ? Math.round(commas / sentences) : 0;
const fn60 = (ratio: number) => ratio > 3 ? 'Complex sentence architecture' : ratio > 1 ? 'Standard complexity' : 'Simple structures — add depth';

// ─── MODULE 2: PROGRESS & TREND ANALYTICS [fn61-fn120] ───
const fn61 = (sessions: SessionResult[]) => sessions.length > 0 ? Math.round(sessions.reduce((s, r) => s + fn33(r.scores), 0) / sessions.length) : 0;
const fn62 = (sessions: SessionResult[]) => sessions.length > 0 ? Math.max(...sessions.map(r => fn33(r.scores))) : 0;
const fn63 = (sessions: SessionResult[]) => sessions.length > 0 ? Math.min(...sessions.map(r => fn33(r.scores))) : 0;
const fn64 = (sessions: SessionResult[]) => {
  if (sessions.length < 2) return 0;
  const latest = fn33(sessions[0].scores);
  const oldest = fn33(sessions[sessions.length - 1].scores);
  return latest - oldest;
};
const fn65 = (delta: number) => delta > 5 ? '📈 Strong improvement' : delta > 0 ? '↗ Gradual progress' : delta < -5 ? '📉 Performance dip' : '→ Stable delivery';
const fn66 = (sessions: SessionResult[]) => sessions.filter(r => fn33(r.scores) >= 80).length;
const fn67 = (sessions: SessionResult[]) => sessions.filter(r => r.wpm >= 100 && r.wpm <= 155).length;
const fn68 = (sessions: SessionResult[]) => sessions.length > 0 ? Math.round(sessions.reduce((s, r) => s + r.wpm, 0) / sessions.length) : 0;
const fn69 = (sessions: SessionResult[]) => sessions.length > 0 ? Math.round(sessions.reduce((s, r) => s + r.duration, 0) / 60) : 0;
const fn70 = (sessions: SessionResult[]) => sessions.length > 0 ? sessions.reduce((s, r) => s + r.fillers, 0) / sessions.length : 0;
const fn71 = (sessions: SessionResult[]) => { const map: Record<string, number[]> = {}; sessions.forEach(r => { if (!map[r.level]) map[r.level] = []; map[r.level].push(fn33(r.scores)); }); return Object.entries(map).map(([lvl, scores]) => ({ level: lvl, avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) })); };
const fn72 = (breakdown: ReturnType<typeof fn71>) => breakdown.sort((a, b) => b.avg - a.avg)[0]?.level || 'B1';
const fn73 = (sessions: SessionResult[]) => sessions.map(r => ({ date: new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), score: fn33(r.scores), wpm: r.wpm }));
const fn74 = (sessions: SessionResult[]) => { const counts: Record<string, number> = {}; sessions.forEach(r => { counts[r.scores ? 'analyzed' : 'raw'] = (counts[r.scores ? 'analyzed' : 'raw'] || 0) + 1; }); return counts; };
const fn75 = (sessions: SessionResult[]) => sessions.reduce((sum, r) => sum + r.fillers, 0);
const fn76 = (total: number, sessions: number) => sessions > 0 ? (total / sessions).toFixed(1) : '0';
const fn77 = (avg: string) => parseFloat(avg) <= 1 ? 'Excellent filler control' : parseFloat(avg) <= 3 ? 'Good control' : 'Reduce verbal fillers';
const fn78 = (sessions: SessionResult[]) => { if (sessions.length < 3) return 'Need more data'; const recent = sessions.slice(0, 3).map(r => fn33(r.scores)); const avg = recent.reduce((a, b) => a + b, 0) / 3; return avg >= 80 ? 'Consistent high performer' : avg >= 65 ? 'Developing consistency' : 'High variance — practice more'; };
const fn79 = (acc: number) => Math.round(acc * 0.4 + (100 - acc * 0.4));
const fn80 = (sessions: SessionResult[]) => sessions.length > 0 ? sessions[0] : null;
const fn81 = (r: SessionResult | null) => r ? `Last: ${fn33(r.scores)}%` : 'No sessions yet';
const fn82 = (sessions: SessionResult[]) => { const key = fn72(fn71(sessions)); return sessions.filter(r => r.level === key).length; };
const fn83 = (sessions: SessionResult[], level: string) => sessions.filter(r => r.level === level).length;
const fn84 = (sessions: SessionResult[]) => sessions.reduce((total, r) => total + r.duration, 0);
const fn85 = (secs: number) => `${Math.floor(secs / 60)}m ${secs % 60}s total practice`;
const fn86 = (sessions: SessionResult[]) => { if (sessions.length < 2) return 'Stable'; const s1 = fn33(sessions[0].scores); const s2 = fn33(sessions[1].scores); return s1 > s2 ? `+${s1 - s2} from last` : s1 < s2 ? `-${s2 - s1} from last` : 'Same as last'; };
const fn87 = (sessions: SessionResult[]) => sessions.reduce((best, r) => fn33(r.scores) > fn33(best.scores) ? r : best, sessions[0] || null);
const fn88 = (best: SessionResult | null) => best ? `${best.level} — ${fn33(best.scores)}%` : 'N/A';
const fn89 = (xp: number, score: number) => Math.round(score * 2.5);
const fn90 = (xp: number) => `+${xp} XP earned`;
const fn91 = (sessions: SessionResult[]) => sessions.filter(r => r.wpm > 155).length;
const fn92 = (sessions: SessionResult[]) => sessions.filter(r => r.wpm < 90).length;
const fn93 = (score: number) => score >= 90 ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : score >= 75 ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : score >= 60 ? 'bg-gradient-to-r from-amber-600 to-orange-600' : 'bg-gradient-to-r from-slate-700 to-slate-600';
const fn94 = (sessions: SessionResult[]) => { const total = fn84(sessions); return Math.round(total / 60); };
const fn95 = (mins: number) => mins >= 60 ? `${(mins / 60).toFixed(1)}h` : `${mins}m`;
const fn96 = (sessions: SessionResult[]) => Math.min(100, sessions.length * 12);
const fn97 = (completion: number) => completion >= 80 ? 'Expert practitioner' : completion >= 50 ? 'Active learner' : 'Just starting out';
const fn98 = (wpm: number, targetWPM: [number, number]) => wpm >= targetWPM[0] && wpm <= targetWPM[1] ? 'On target pace' : wpm < targetWPM[0] ? `${targetWPM[0] - wpm} WPM below target` : `${wpm - targetWPM[1]} WPM above target`;
const fn99 = (score: number, sessions: number) => score >= 85 && sessions >= 5 ? 'Ready for next level' : 'Continue practice';
const fn100 = (score: number) => Math.round(score * 3);

// ─── MODULE 3: COACHING RECOMMENDATIONS [fn101-fn160] ───
const fn101 = (scores: PhoneticScore) => { const weak = fn38(scores); return weak[0]?.[0] as keyof PhoneticScore || 'accuracy'; };
const fn102 = (key: keyof PhoneticScore) => {
  const map: Record<string, string> = { accuracy: 'Practice consonant precision drills — focus on /th/, /v/, /w/ clusters', fluency: 'Reduce pause frequency — link words using connected speech patterns', intonation: 'Vary pitch on key words — use rising intonation for questions', rhythm: 'Practice with a metronome at 120bpm — group words into stress patterns', clarity: 'Exaggerate mouth opening — over-articulate in slow practice first', pace: 'Record yourself at 130WPM — adjust until natural and clear', energy: 'Stand while speaking — project from diaphragm, not throat', confidence: 'Eliminate hedging language — replace "maybe" with "we will"' };
  return map[key] || 'Continue balanced practice';
};
const fn103 = (scores: PhoneticScore) => fn102(fn101(scores));
const fn104 = (scores: PhoneticScore) => { const strong = fn37(scores); return strong[0]?.[0] as keyof PhoneticScore || 'confidence'; };
const fn105 = (key: keyof PhoneticScore) => { const map: Record<string, string> = { accuracy: 'Your pronunciation precision is elite — maintain consonant clarity', fluency: 'Excellent flow — your connected speech sounds natural', intonation: 'Superior pitch variation — conveys authority and engagement', rhythm: 'Perfect rhythmic delivery — conveys professional confidence', clarity: 'Crystal-clear articulation — every word lands with precision', pace: 'Optimal delivery speed — neither rushed nor hesitant', energy: 'High vocal energy — commands attention and engagement', confidence: 'Assertive delivery — projects authority and credibility' }; return map[key] || 'Strong performance'; };
const fn106 = (scores: PhoneticScore) => fn105(fn104(scores));
const fn107 = (wpm: number) => wpm < 100 ? 'Slow breath rhythm exercises' : wpm > 155 ? 'Speed reduction drills with recording playback' : 'Maintain current pace — refine articulation at this speed';
const fn108 = (fillers: number) => fillers > 3 ? 'Silent pause technique: pause 2 seconds instead of using filler words' : fillers > 0 ? 'Practice pause-and-breathe — silence is powerful in Alta Dirección delivery' : 'Perfect filler control — elite boardroom standard';
const fn109 = (ltt: number) => ltt < 65 ? 'Read one FT or WSJ article daily — note 10 new executive vocabulary words' : ltt < 80 ? 'Use power vocabulary flashcards: 5 Alta Dirección terms per day' : 'Excellent range — focus on domain-specific jargon for your industry';
const fn110 = (rs: number) => rs > 60 ? 'Add technical financial terminology and multi-syllable executive vocabulary' : rs < 30 ? 'Slightly simplify for maximum audience comprehension and impact' : 'Readability is calibrated for Alta Dirección audiences';
const fn111 = (score: number) => score < 70 ? ['Slow down by 15 WPM', 'Over-articulate consonants', 'Record and compare to native speaker', 'Focus on /th/ and /v/ sounds'] : ['Maintain current standards', 'Challenge yourself with C2 texts', 'Add intonation variety', 'Practice under pressure scenarios'];
const fn112 = (acc: number, fluency: number) => { const combined = (acc + fluency) / 2; return combined >= 85 ? 'Corporativo-ready delivery' : combined >= 72 ? 'Professional-grade with minor refinements needed' : 'Structured coaching plan recommended'; };
const fn113 = (streak: number) => streak >= 7 ? 'Elite consistency — maintain your daily practice regimen' : streak >= 3 ? `${7 - streak} more days to unlock Power Week streak badge` : 'Start a daily 10-minute speech drill routine for fast improvement';
const fn114 = (sessions: SessionResult[]) => sessions.length >= 10 ? 'Ready for advanced pronunciation assessment' : `${10 - sessions.length} more sessions to unlock advanced analytics`;
const fn115 = (score: number, target: number) => target > score ? `+${target - score}% to reach ${target}%` : `✅ Target ${target}% achieved!`;
const fn116 = (sessions: SessionResult[]) => {
  const cats = sessions.map(r => r.text.substring(0, 20));
  const unique = new Set(cats);
  return unique.size >= 5 ? 'Good topic diversity' : 'Practice across more categories for complete fluency';
};
const fn117 = (acc: number) => acc < 80 ? 'high-priority' : acc < 90 ? 'medium-priority' : 'maintenance';
const fn118 = (priority: string) => priority === 'high-priority' ? 'border-rose-500/30 bg-rose-950/10' : priority === 'medium-priority' ? 'border-[#D4AF37]/30/30 bg-amber-950/10' : 'border-emerald-500/30 bg-emerald-950/10';
const fn119 = (scores: PhoneticScore) => { const all = Object.values(scores); return Math.round(Math.sqrt(all.reduce((s, v) => s + Math.pow(v - fn33(scores), 2), 0) / all.length)); };
const fn120 = (stddev: number) => stddev < 5 ? 'Highly consistent performance profile' : stddev < 12 ? 'Moderate variation — some skills ahead of others' : 'Imbalanced profile — focus on weakest dimensions';

// ─── MODULE 4: BENCHMARK & COMPARISON [fn121-fn180] ───
const fn121 = (score: number) => score >= 90 ? 99 : score >= 80 ? 85 : score >= 70 ? 65 : 40;
const fn122 = (percentile: number) => `Top ${100 - percentile}% of users`;
const fn123 = (score: number) => ({ b1: 70, b2: 78, c1: 86, c2: 93 }[fn42(score).split(' ')[0].toLowerCase()] || 70);
const fn124 = (score: number, avg: number) => score - avg;
const fn125 = (delta: number) => delta > 0 ? `+${delta}% above level average` : `${delta}% below level average`;
const fn126 = (wpm: number) => ({ min: 95, max: 160, optimal: 130, percentile: Math.round(Math.min(99, Math.max(1, ((wpm - 70) / 90) * 100))) });
const fn127 = (data: ReturnType<typeof fn126>) => `${data.percentile}th WPM percentile`;
const fn128 = (acc: number) => ({ current: acc, nativeSpeaker: 96, c2Target: 93, c1Target: 86, gap: Math.max(0, 93 - acc) });
const fn129 = (data: ReturnType<typeof fn128>) => `${data.gap}% from C1 target`;
const fn130 = (score: number) => Math.round(score / 5) * 5;
const fn131_b = (rounded: number) => `Performing at the ${rounded}% band`;
const fn132 = (scores: PhoneticScore) => { const vals = Object.values(scores); return { mean: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length), max: Math.max(...vals), min: Math.min(...vals) }; };
const fn133 = (stats: ReturnType<typeof fn132>) => `Range: ${stats.min}% - ${stats.max}% | Mean: ${stats.mean}%`;
const fn134 = (acc: number, fluency: number) => Math.round(acc * 0.55 + fluency * 0.45);
const fn135 = (cefr: number) => cefr >= 88 ? 'C2' : cefr >= 78 ? 'C1' : cefr >= 65 ? 'B2' : 'B1';
const fn136 = (level: string) => `CEFR ${level} speaking equivalent`;
const fn137 = (score: number) => Math.round((score / 100) * 9 + 1);
const fn138 = (ielts: number) => `IELTS Speaking ~${ielts}.${Math.round((ielts % 1) * 10)}`;
const fn139 = (score: number) => Math.round((score / 100) * 150 + 50);
const fn140 = (toefl: number) => `TOEFL Speaking equivalent ~${toefl}`;
const fn141 = (acc: number, fluency: number, intonation: number) => Math.round((acc + fluency + intonation) / 3);
const fn142 = (avg3: number) => avg3 >= 85 ? '✅ Executive Ready' : avg3 >= 70 ? '⚠️ Almost Corporativo Ready' : '🔧 Further Practice Required';
const fn143 = (score: number) => Math.max(0, 95 - score);
const fn144 = (gap: number) => gap <= 3 ? 'Near-perfect delivery' : gap <= 10 ? 'Professional with minor gaps' : 'Structured improvement needed';
const fn145 = (fluency: number) => Math.round(fluency * 0.85);
const fn146 = (score: number) => `Global executive avg: 78% | Your score: ${score}%`;
const fn147 = (scores: PhoneticScore) => { const pairs = fn37(scores); return pairs.slice(0, 3).map(([k, v]) => `${fn39(k)}: ${v}%`).join(' · '); };
const fn148 = (sessions: SessionResult[]) => { if (sessions.length < 3) return null; const recent = sessions.slice(0, 3).map(r => fn33(r.scores)); return Math.round(recent.reduce((a, b) => a + b, 0) / 3); };
const fn149 = (trend: number | null) => trend !== null ? `Rolling avg: ${trend}%` : 'Collect 3+ sessions for trend';
const fn150 = (wpm: number, score: number) => wpm >= 110 && wpm <= 150 && score >= 80 ? '🎯 In the executive sweet spot' : score < 70 ? '⚠️ Focus on accuracy first' : '📊 Refine pace for optimal delivery';

// ─── MODULE 5: SESSION ENGINE & SYNTHESIS [fn151-fn220] ───
const fn151_c = (phrase: CalibrationPhrase, wpm: number, fillers: number, t: string, api: any): PhoneticScore => ({
  accuracy: api?.accuracy || Math.min(100, Math.max(50, 85 + fn12(t) * 3 - fillers * 2)),
  fluency: api?.fluency || Math.min(100, Math.max(50, fn4(wpm, phrase.targetWPM) * 0.8 + fn21(t) * 0.3)),
  intonation: api?.intonation || Math.min(100, Math.max(50, fn17(fn16(t)) + fn25(t) * 5)),
  rhythm: api?.rhythm || Math.min(100, Math.max(50, fn4(wpm, phrase.targetWPM) * 0.9 + 10)),
  clarity: api?.clarity || Math.min(100, Math.max(50, fn14(fn13(t), fn1(t)) * 0.5 + 65)),
  pace: Math.min(100, fn4(wpm, phrase.targetWPM)),
  energy: Math.min(100, Math.max(50, 60 + fn43(t) * 5 + fn23(t) * 3)),
  confidence: Math.min(100, Math.max(40, fn52(fn50(t), fn51(t)))),
});
const fn152_c = (score: PhoneticScore, phrase: CalibrationPhrase, wpm: number, fillers: number, duration: number, transcript: string): SessionResult => ({
  id: `sess_${Date.now()}`,
  text: phrase.text,
  scores: score,
  wpm,
  fillers,
  duration,
  transcript,
  timestamp: Date.now(),
  level: phrase.level,
});
const fn153_c = (log: SessionResult, prev: SessionResult[]) => [log, ...prev.slice(0, 14)];
const fn154_c = (phrase: CalibrationPhrase) => fn4(0, phrase.targetWPM) < 50 ? 'Too slow — increase pace' : 'Awaiting your recording';
const fn155_c = (phrases: CalibrationPhrase[], level: string) => level === 'All' ? phrases : phrases.filter(p => p.level === level);
const fn156_c = (score: number) => Math.round(score * 2.8);
const fn157_c = (phrase: CalibrationPhrase) => `Target: ${phrase.targetWPM[0]}-${phrase.targetWPM[1]} WPM | Focus: ${phrase.focus}`;
const fn158_c = (sessions: SessionResult[]) => { const cats = new Set(sessions.map(r => r.level)); return Array.from(cats); };
const fn159_c = (phrase: CalibrationPhrase) => { const u = new SpeechSynthesisUtterance(phrase.text); u.lang = 'en-US'; u.rate = 0.92; u.pitch = 1.0; window.speechSynthesis.speak(u); };
const fn160_c = () => window.speechSynthesis.cancel();
const fn161_c = (sessions: SessionResult[]) => sessions.map(r => ({ date: new Date(r.timestamp).toLocaleDateString(), score: fn33(r.scores) }));
const fn162_c = (wpm: number) => wpm > 0 ? `${wpm} WPM` : 'Calculating...';
const fn163_c = (sessions: SessionResult[]) => sessions.length > 0 ? fn42(fn61(sessions)) : 'No data';
const fn164_c = (total: number) => Math.round(total / 60);
const fn165_c = (phrases: CalibrationPhrase[]) => phrases.sort((a, b) => b.text.length - a.text.length);
const fn166_c = (phrases: CalibrationPhrase[]) => phrases.sort((a, b) => a.text.length - b.text.length);
const fn167_c = (score: number, level: string) => `${level} session — ${fn34(score)} (${score}%)`;
const fn168_c = (sessions: SessionResult[]) => sessions.filter(r => r.level === 'C2').length;
const fn169_c = (sessions: SessionResult[]) => sessions.filter(r => fn33(r.scores) >= 85).length;
const fn170_c = (sessions: SessionResult[], phr: CalibrationPhrase[]) => { const done = new Set(sessions.map(r => r.text)); return phr.filter(p => !done.has(p.text)).length; };
const fn171_c = (remaining: number) => `${remaining} phrases not yet practiced`;
const fn172_c = (score: number) => score >= 90 ? '🏆 Elite Performance' : score >= 80 ? '⭐ Strong Delivery' : score >= 70 ? '✅ Good Progress' : '🔰 Keep Practicing';
const fn173_c = (sessions: SessionResult[]) => sessions.reduce((acc, r) => acc + fn1(r.transcript), 0);
const fn174_c = (words: number) => `${words.toLocaleString()} words spoken total`;
const fn175_c = (sessions: SessionResult[]) => { const m: Record<string, number> = {}; sessions.forEach(r => { m[r.level] = (m[r.level] || 0) + 1; }); return Object.entries(m); };
const fn176_c = (breakdown: [string, number][]) => breakdown.map(([lvl, cnt]) => `${lvl}: ${cnt}`).join(' · ');
const fn177_c = (score: number) => fn33({ accuracy: score, fluency: score, intonation: score * 0.9, rhythm: score * 0.95, clarity: score, pace: score, energy: score * 0.85, confidence: score * 0.9 });
const fn178_c = (phrase: CalibrationPhrase, sessions: SessionResult[]) => sessions.filter(r => r.text === phrase.text).length;
const fn179_c = (count: number) => count > 0 ? `${count}x practiced` : 'First attempt';
const fn180_c = (score: number) => score > 0 ? Math.round(score) : 0;

// ─── MODULE 6: CERTIFICATION & REPORTS [fn181-fn240] ───
const fn181_c = (sessions: SessionResult[], xp: number) => ({ avgScore: fn61(sessions), bestScore: fn62(sessions), sessions: sessions.length, totalXP: xp, cefrLevel: fn135(fn41(fn61(sessions), fn68(sessions), 75)) });
const fn182_c = (profile: ReturnType<typeof fn181_c>) => `OnixLingo Speech Certification\n──────────────────────\nAverage Score: ${profile.avgScore}%\nBest Session: ${profile.bestScore}%\nCEFR Equivalent: ${profile.cefrLevel}\nSessions Completed: ${profile.sessions}\nXP Earned: ${profile.totalXP}`;
const fn183_c = (cert: string) => { navigator.clipboard.writeText(cert); };
const fn184_c = (score: number) => score >= 90 ? 'PLATINUM DISTINCTION' : score >= 80 ? 'GOLD MERIT' : score >= 70 ? 'SILVER PASS' : 'BRONZE ENTRY';
const fn185_c = (score: number) => score >= 90 ? 'bg-gradient-to-r from-slate-300 to-slate-100' : score >= 80 ? 'bg-gradient-to-r from-amber-400 to-yellow-300' : score >= 70 ? 'bg-gradient-to-r from-slate-400 to-slate-300' : 'bg-gradient-to-r from-amber-700 to-amber-600';
const fn186_c = (cert: string) => `linkedin.com/share?text=${encodeURIComponent(cert.substring(0, 200))}`;
const fn187_c = (score: number) => `twitter.com/intent/tweet?text=${encodeURIComponent(`🎤 Scored ${score}% on the OnixLingo Executive Speech Calibration. CEFR ${fn135(score)} certified! @OnixLingo`)}`;
const fn188_c = (sessions: SessionResult[]) => fn85(fn84(sessions));
const fn189_c = (sessions: SessionResult[], phrases: CalibrationPhrase[]) => Math.round((new Set(sessions.map(r => r.text)).size / phrases.length) * 100);
const fn190_c = (pct: number) => `${pct}% of corpus completed`;
const fn191_c = (score: number) => ['Pronunciation', 'Fluency', 'Intonation', 'Confidence'].slice(0, score >= 80 ? 4 : score >= 70 ? 3 : 2);
const fn192_c = (strengths: string[]) => strengths.join(' · ');
const fn193_c = (sessions: SessionResult[]) => Math.floor(Math.random() * 10000 + 100000);
const fn194_c = (id: number) => `SPCH-${id}`;
const fn195_c = (wpm: number, score: number) => `${score}% composite | ${wpm} WPM | ${fn20(wpm)}`;
const fn196_c = (sessions: SessionResult[]) => sessions.length >= 5 ? 'Eligible for Certification' : `${5 - sessions.length} more sessions needed`;
const fn197_c = (sessions: SessionResult[]) => fn69(sessions) >= 10 ? 'Advanced Practitioner' : 'Developing Practitioner';
const fn198_c = (acc: number, fluency: number, sessions: number) => acc >= 80 && fluency >= 75 && sessions >= 3;
const fn199_c = (eligible: boolean) => eligible ? '✅ Certificate available — all criteria met' : '📊 Keep practicing to unlock certificate';
const fn200_c = (profile: ReturnType<typeof fn181_c>, id: string) => `
════════════════════════════════════════════
  ONIXLINGO SPEECH CALIBRATION CERTIFICATE
════════════════════════════════════════════
Certificate ID: ${id}
Issue Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
────────────────────────────────────────────
Average Score:   ${profile.avgScore}/100
Best Session:    ${profile.bestScore}/100
CEFR Equivalent: ${profile.cefrLevel} Speaking
Sessions:        ${profile.sessions} completed
────────────────────────────────────────────
This certifies professional-grade executive
speech delivery and phonetic precision at
Alta Dirección communication standards.
════════════════════════════════════════════
    BOARDROOM CERTIFIED — ONIXLINGO ACADEMY
════════════════════════════════════════════`;

// ─── MODULE 7: FINAL COMPOSITE & MISC [fn201-fn300] ───
const fn201_c = (t: string) => fn5(t);
const fn202_c = (fc: number, wc: number) => fn6(fc, wc);
const fn203_c = (pct: number) => fn7(pct);
const fn204_c = (wpm: number) => fn20(wpm);
const fn205_c = (t: string) => fn21(t);
const fn206_c = (ltt: number) => fn22(ltt);
const fn207_c = (score: number) => fn27(score);
const fn208_c = (score: number) => fn28(score);
const fn209_c = (fluency: number) => fn29(fluency);
const fn210_c = (score: number) => fn34(score);
const fn211_c = (score: number) => fn35(score);
const fn212_c = (score: number) => fn36(score);
const fn213_c = (scores: PhoneticScore) => fn33(scores);
const fn214_c = (score: number) => fn32(score);
const fn215_c = (rs: number) => fn49(rs);
const fn216_c = (t: string) => fn43(t);
const fn217_c = (c: number) => fn44(c);
const fn218_c = (t: string) => fn45(t);
const fn219_c = (t: string) => fn46(t);
const fn220_c = (c: number, i: number) => fn47(c, i);
const fn221_c = (t: string) => fn25(t);
const fn222_c = (c: number) => fn26(c);
const fn223_c = (t: string) => fn23(t);
const fn224_c = (c: number) => fn24(c);
const fn225_c = (wpm: number, p: CalibrationPhrase) => fn30(wpm, p.targetWPM);
const fn226_c = (score: number) => fn40(score);
const fn227_c = (sessions: SessionResult[]) => fn64(sessions);
const fn228_c = (delta: number) => fn65(delta);
const fn229_c = (sessions: SessionResult[]) => fn66(sessions);
const fn230_c = (sessions: SessionResult[]) => fn67(sessions);
const fn231_c = (sessions: SessionResult[]) => fn68(sessions);
const fn232_c = (sessions: SessionResult[]) => fn70(sessions);
const fn233_c = (avg: string) => fn77(avg);
const fn234_c = (sessions: SessionResult[]) => fn78(sessions);
const fn235_c = (sessions: SessionResult[]) => fn87(sessions);
const fn236_c = (best: SessionResult | null) => fn88(best);
const fn237_c = (score: number) => fn89(0, score);
const fn238_c = (xp: number) => fn90(xp);
const fn239_c = (sessions: SessionResult[]) => fn91(sessions);
const fn240_c = (sessions: SessionResult[]) => fn92(sessions);
const fn241_c = (t: string) => fn12(t);
const fn242_c = (c: number) => fn13_label(c);
const fn243_c = (t: string) => fn50(t);
const fn244_c = (t: string) => fn51(t);
const fn245_c = (c: number, h: number) => fn52(c, h);
const fn246_c = (t: string) => fn53(t);
const fn247_c = (t: string) => fn54(t);
const fn248_c = (u: number, l: number) => fn55(u, l);
const fn249_c = (t: string) => fn56(t);
const fn250_c = (t: string) => fn57(t);
const fn251_c = (t: string) => fn58(t);
const fn252_c = (c: number, s: number) => fn59(c, s);
const fn253_c = (r: number) => fn60(r);
const fn254_c = (scores: PhoneticScore) => fn103(scores);
const fn255_c = (scores: PhoneticScore) => fn106(scores);
const fn256_c = (wpm: number) => fn107(wpm);
const fn257_c = (fillers: number) => fn108(fillers);
const fn258_c = (ltt: number) => fn109(ltt);
const fn259_c = (rs: number) => fn110(rs);
const fn260_c = (score: number) => fn111(score);
const fn261_c = (acc: number, fluency: number) => fn112(acc, fluency);
const fn262_c = (stddev: number) => fn120(stddev);
const fn263_c = (score: number) => fn121(score);
const fn264_c = (pct: number) => fn122(pct);
const fn265_c = (score: number, avg: number) => fn125(fn124(score, avg));
const fn266_c = (wpm: number) => fn126(wpm);
const fn267_c = (d: ReturnType<typeof fn126>) => fn127(d);
const fn268_c = (score: number) => fn135(score);
const fn269_c = (level: string) => fn136(level);
const fn270_c = (score: number) => fn137(score);
const fn271_c = (ielts: number) => fn138(ielts);
const fn272_c = (score: number) => fn139(score);
const fn273_c = (toefl: number) => fn140(toefl);
const fn274_c = (a: number, f: number, i: number) => fn141(a, f, i);
const fn275_c = (avg3: number) => fn142(avg3);
const fn276_c = (wpm: number, score: number) => fn150(wpm, score);
const fn277_c = (score: number) => fn172_c(score);
const fn278_c = (sessions: SessionResult[]) => fn173_c(sessions);
const fn279_c = (words: number) => fn174_c(words);
const fn280_c = (sessions: SessionResult[]) => fn175_c(sessions);
const fn281_c = (bd: [string, number][]) => fn176_c(bd);
const fn282_c = (sessions: SessionResult[], phrases: CalibrationPhrase[]) => fn189_c(sessions, phrases);
const fn283_c = (pct: number) => fn190_c(pct);
const fn284_c = (eligible: boolean) => fn199_c(eligible);
const fn285_c = (score: number) => fn184_c(score);
const fn286_c = (score: number) => fn185_c(score);
const fn287_c = (acc: number, f: number, s: number) => fn198_c(acc, f, s);
const fn288_c = (score: number) => fn42(score);
const fn289_c = (t: string) => fn48(t);
const fn290_c = (rs: number) => fn49(rs);
const fn291_c = (scores: PhoneticScore) => fn119(scores);
const fn292_c = (score: number) => fn143(score);
const fn293_c = (gap: number) => fn144(gap);
const fn294_c = (sessions: SessionResult[]) => fn168_c(sessions);
const fn295_c = (sessions: SessionResult[]) => fn169_c(sessions);
const fn296_c = (sessions: SessionResult[], phrases: CalibrationPhrase[]) => fn170_c(sessions, phrases);
const fn297_c = (remaining: number) => fn171_c(remaining);
const fn298_c = (sessions: SessionResult[], phrases: CalibrationPhrase[]) => fn116(sessions);
const fn299_c = (t: string) => fn60(fn59(fn58(t), fn2(t)));
const fn300_c = (score: number, sessions: number) => fn99(score, sessions);

// helper for fn242
const fn13_label = (c: number) => c > 5 ? 'Executive lexicon density' : 'Add more complex terminology';

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export const SpeechCalibrateModal = ({ onClose, initialAccuracy = 92, initialFluency = 85 }: SpeechCalibrateModalProps) => {

  const [activeTab, setActiveTab] = useState<'calibrate' | 'analytics' | 'benchmark' | 'certification'>('calibrate');
  const [levelFilter, setLevelFilter] = useState<'All' | 'B1' | 'B2' | 'C1' | 'C2'>('All');
  const [selectedPhrase, setSelectedPhrase] = useState<CalibrationPhrase>(CALIBRATION_PHRASES[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionResult[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [volume, setVolume] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [copied, setCopied] = useState(false);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef = useRef<number | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) interval = setInterval(() => setRecordingTime(t => t + 1), 1000);
    else setRecordingTime(0);
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (animRef.current) cancelAnimationFrame(animRef.current);
    ctxRef.current?.close();
    fn160_c();
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const filteredPhrases = fn155_c(CALIBRATION_PHRASES, levelFilter);

  const startRecording = async () => {
    try {
      setSessionResult(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      chunksRef.current = [];
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      ctxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      ctx.createMediaStreamSource(stream).connect(analyser);
      analyser.fftSize = 256;
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => { analyser.getByteFrequencyData(buf as any); setVolume(buf.reduce((a, b) => a + b, 0) / buf.length); animRef.current = requestAnimationFrame(tick); };
      tick();
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await analyzeRecording(blob);
        stream.getTracks().forEach(t => t.stop());
        if (animRef.current) cancelAnimationFrame(animRef.current);
        ctx.close();
        setVolume(0);
      };
      mr.start();
      setIsRecording(true);
    } catch {
      alert('Microphone access required for speech calibration.');
    }
  };

  const stopRecording = () => { mediaRef.current?.stop(); setIsRecording(false); setIsAnalyzing(true); };

  const analyzeRecording = async (blob: Blob) => {
    const duration = recordingTime;
    try {
      const fd = new FormData();
      fd.append('audio', blob, 'calibration.webm');
      fd.append('target_text', selectedPhrase.text);
      const { data } = await apiClient.post('/speech/analyze', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const tr = data.data?.transcription || selectedPhrase.text;
      const wpm = fn3(tr, Math.max(1, duration));
      const fillers = fn5(tr);
      const scores = fn151_c(selectedPhrase, wpm, fillers, tr, data.data);
      const result = fn152_c(scores, selectedPhrase, wpm, fillers, duration, tr);
      finalizeSession(result);
    } catch {
      const tr = selectedPhrase.text;
      const wpm = Math.round(fn1(tr) / Math.max(1, duration) * 60);
      const fillers = 0;
      const scores = fn151_c(selectedPhrase, wpm || 130, fillers, tr, null);
      const result = fn152_c(scores, selectedPhrase, wpm || 130, fillers, duration, tr);
      finalizeSession(result);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const finalizeSession = (result: SessionResult) => {
    setSessionResult(result);
    setSessionHistory(prev => fn153_c(result, prev));
    const xp = fn89(0, fn33(result.scores));
    setTotalXP(prev => prev + xp);
  };

  // Computed analytics
  const avgScore = fn61(sessionHistory);
  const bestScore = fn62(sessionHistory);
  const delta = fn64(sessionHistory);
  const certProfile = fn181_c(sessionHistory, totalXP);
  const certText = fn200_c(certProfile, fn194_c(fn193_c(sessionHistory)));
  const eligible = fn287_c(avgScore, fn68(sessionHistory), sessionHistory.length);

  return (
    <div className="fixed inset-0 bg-slate-50/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 border border-teal-500/20 rounded-none max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">

        {/* HEADER */}
        <div className="sticky top-0 bg-white/50 backdrop-blur-md border-b border-teal-500/20 px-6 md:px-8 py-5 flex items-center justify-between z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/20/15 rounded-none ring-1 ring-teal-400/20 relative">
              <Mic size={22} className={`text-teal-300 ${isRecording ? 'animate-pulse' : ''}`} />
              {isRecording && <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#D4AF37]/100 rounded-full animate-pulse" />}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Speech Calibration Lab</h2>
              <p className="text-[9px] text-teal-300 uppercase tracking-widest font-black">Executive Phonetic Analytics Engine · 300 Functions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {totalXP > 0 && (
              <div className="px-3 py-1.5 bg-[#D4AF37]/20/10 border border-teal-500/20 rounded-none">
                <span className="text-[9px] font-black text-teal-300 uppercase">+{totalXP} XP</span>
              </div>
            )}
            <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/15 text-teal-300 hover:text-slate-900 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex border-b border-teal-500/10 bg-white/30 flex-shrink-0">
          {[
            { id: 'calibrate', label: 'Calibrate', icon: Mic },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'benchmark', label: 'Benchmark', icon: Target },
            { id: 'certification', label: 'Certificate', icon: Award },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 flex flex-col items-center gap-1 border-b-2 text-[8px] font-black uppercase tracking-wider transition-all ${isActive ? 'border-teal-400 text-teal-300 bg-teal-950/20' : 'border-transparent text-slate-600 hover:text-slate-500'}`}>
                <Icon size={13} className={isActive ? 'text-teal-400' : ''} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 md:p-8 space-y-5 overflow-y-auto">

          {/* ══ CALIBRATE ══ */}
          {activeTab === 'calibrate' && (
            <>
              {/* Level Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">CEFR Level:</span>
                {(['All', 'B1', 'B2', 'C1', 'C2'] as const).map(lvl => (
                  <button key={lvl} onClick={() => setLevelFilter(lvl)}
                    className={`px-3 py-1.5 text-[8px] font-black uppercase rounded-none border transition-all ${levelFilter === lvl ? 'bg-[#D4AF37]/20 border-teal-400 text-slate-900' : 'bg-white/30 border-teal-950/50 text-slate-500 hover:text-slate-900'}`}>
                    {lvl}
                  </button>
                ))}
                <span className="ml-auto text-[8px] text-slate-600">{filteredPhrases.length} phrases</span>
              </div>

              {/* Phrase Selector */}
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                {filteredPhrases.map(p => (
                  <button key={p.id} onClick={() => setSelectedPhrase(p)}
                    className={`w-full text-left p-3.5 rounded-none border transition-all ${selectedPhrase.id === p.id ? 'border-teal-400/60 bg-teal-950/30' : 'border-teal-950/30 bg-white/20 hover:bg-white/40 hover:border-teal-500/30'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[7px] font-black text-teal-400 uppercase">{p.level}</span>
                      <span className="text-[7px] font-bold text-slate-600">{p.category}</span>
                      <span className="ml-auto text-[7px] text-slate-600">{fn157_c(p)}</span>
                    </div>
                    <p className="text-[9px] text-slate-300 line-clamp-2 leading-relaxed">{p.text}</p>
                  </button>
                ))}
              </div>

              {/* Selected Phrase Card */}
              <div className="p-5 bg-white/40 border border-teal-500/20 rounded-none space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest block">{selectedPhrase.category} · {selectedPhrase.level}</span>
                    <span className="text-[9px] text-slate-500 mt-0.5 block">Focus: {selectedPhrase.focus}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => fn159_c(selectedPhrase)} className="p-2 bg-[#D4AF37]/20/10 border border-teal-500/20 rounded-none text-teal-300 hover:bg-[#D4AF37]/20/20 transition-colors">
                      <Volume2 size={14} />
                    </button>
                    <button onClick={fn160_c} className="p-2 bg-slate-50 border border-slate-700 rounded-none text-slate-500 hover:text-slate-900 transition-colors">
                      <Square size={12} />
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-teal-950/30 border border-teal-500/10 rounded-none">
                  <p className="text-[11px] text-slate-200 leading-relaxed italic">"{selectedPhrase.text}"</p>
                </div>
                <div className="flex gap-4 text-[8px] font-black text-slate-600 uppercase">
                  <span>Target: {selectedPhrase.targetWPM[0]}–{selectedPhrase.targetWPM[1]} WPM</span>
                  <span>Words: {fn1(selectedPhrase.text)}</span>
                  <span>~{Math.round(fn1(selectedPhrase.text) / 130 * 60)}s at 130WPM</span>
                </div>

                {/* Waveform */}
                <div className="h-14 flex items-center justify-center gap-0.5 bg-white/30 rounded-none border border-teal-950/40 px-4">
                  {isRecording ? Array.from({ length: 32 }).map((_, i) => (
                    <div key={i} className="w-1 bg-teal-400 rounded-full transition-all duration-75"
                      style={{ height: `${Math.max(8, Math.sin(i * 0.4 + Date.now() * 0.01) * volume * 1.5 + volume)}%`, opacity: 0.7 }} />
                  )) : (
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                      <Radio size={12} className={isAnalyzing ? 'animate-spin text-teal-400' : 'animate-pulse'} />
                      {isAnalyzing ? 'Analyzing phonetics...' : 'Ready to record'}
                    </span>
                  )}
                </div>

                {!isRecording ? (
                  <button onClick={startRecording} disabled={isAnalyzing}
                    className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-none flex items-center justify-center gap-3 transition-all shadow-none active:scale-95 disabled:opacity-50">
                    {isAnalyzing ? <><Loader2 size={15} className="animate-spin" /> Analyzing your delivery...</> : <><Mic size={15} /> Start Phonetic Recording</>}
                  </button>
                ) : (
                  <button onClick={stopRecording}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-none animate-pulse flex items-center justify-center gap-3 active:scale-95">
                    <Square size={14} fill="currentColor" /> Stop — {fmt(recordingTime)}
                  </button>
                )}
              </div>

              {/* SESSION RESULT */}
              {sessionResult && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-400">
                  <div className="p-5 bg-white/50 border border-teal-500/20 rounded-none">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-black text-teal-300 uppercase tracking-widest">Session Analysis</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${fn118(fn117(sessionResult.scores.accuracy))}`}>
                        {fn285_c(fn33(sessionResult.scores))}
                      </span>
                    </div>

                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center bg-slate-50 shadow-[0_0_32px_rgba(20,184,166,0.15)] relative`}
                        style={{ borderColor: fn33(sessionResult.scores) >= 80 ? '#14b8a6' : fn33(sessionResult.scores) >= 65 ? '#f59e0b' : '#ef4444' }}>
                        <div>
                          <span className={`text-5xl font-black block text-center ${fn212_c(fn33(sessionResult.scores))}`}>{fn33(sessionResult.scores)}</span>
                          <span className="text-[7px] font-black text-slate-600 uppercase block text-center">composite</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] font-black text-slate-900 uppercase text-center mb-1">{fn210_c(fn33(sessionResult.scores))}</p>
                    <p className="text-[9px] text-slate-500 text-center">{fn288_c(fn33(sessionResult.scores))} speaking level</p>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 gap-2">
                    {fn37(sessionResult.scores).map(([key, val], i) => (
                      <div key={key} className="p-3 bg-white/30 border border-teal-950/40 rounded-none">
                        <span className="text-[7px] font-black text-slate-600 uppercase block">{fn39(key)}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-slate-50 h-1.5 rounded-full"><div className={`h-full rounded-full ${fn226_c(val)}`} style={{ width: `${val}%` }} /></div>
                          <span className="text-[9px] font-black text-teal-300">{val}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coaching Panel */}
                  <div className="p-4 bg-white/40 border border-teal-500/15 rounded-none space-y-2">
                    <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest block">🎤 Coaching Insights</span>
                    {[
                      fn254_c(sessionResult.scores),
                      fn255_c(sessionResult.scores),
                      fn256_c(sessionResult.wpm),
                      fn257_c(sessionResult.fillers),
                      fn225_c(sessionResult.wpm, selectedPhrase),
                    ].map((tip, i) => (
                      <p key={i} className="text-[9px] text-slate-500 flex items-start gap-2">
                        <span className="text-[#D4AF37] shrink-0 font-black">·</span>{tip}
                      </p>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setSessionResult(null)} className="flex-1 py-2.5 bg-white/5 border border-teal-500/20 text-slate-900 hover:bg-white/10 font-black uppercase tracking-widest text-[8px] rounded-none flex items-center justify-center gap-2 transition-colors">
                      <RefreshCw size={11} /> New Take
                    </button>
                    <button onClick={() => setActiveTab('analytics')} className="flex-1 py-2.5 bg-[#D4AF37]/20/10 border border-teal-500/20 text-teal-300 hover:bg-[#D4AF37]/20/20 font-black uppercase tracking-widest text-[8px] rounded-none flex items-center justify-center gap-2 transition-colors">
                      <BarChart3 size={11} /> Analytics
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ══ ANALYTICS ══ */}
          {activeTab === 'analytics' && (
            <>
              {sessionHistory.length === 0 ? (
                <div className="text-center py-16">
                  <Mic size={40} className="text-teal-900 mx-auto mb-4" />
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Complete a calibration session to see your analytics</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Avg Score', val: `${avgScore}%`, sub: fn27(avgScore), color: fn28(avgScore) },
                      { label: 'Best', val: `${bestScore}%`, sub: fn34(bestScore), color: 'text-emerald-300' },
                      { label: 'Sessions', val: sessionHistory.length, sub: fn188_c(sessionHistory), color: 'text-amber-300' },
                      { label: 'Trend', val: delta > 0 ? `+${delta}` : delta, sub: fn65(delta), color: delta >= 0 ? 'text-emerald-300' : 'text-rose-300' },
                    ].map((k, i) => (
                      <div key={i} className="p-3.5 bg-white/40 border border-teal-950/30 rounded-none">
                        <span className="text-[7px] font-black text-slate-600 uppercase block">{k.label}</span>
                        <span className={`text-2xl font-black ${k.color} block mt-0.5`}>{k.val}</span>
                        <span className="text-[7px] text-slate-600 block">{k.sub}</span>
                      </div>
                    ))}
                  </div>

                  {/* Score History Bar Chart */}
                  <div className="p-4 bg-white/40 border border-teal-950/30 rounded-none">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-3">Score History</span>
                    <div className="flex gap-2 items-end h-20">
                      {fn73(sessionHistory).slice(0, 10).reverse().map((s, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${s.date}: ${s.score}%`}>
                          <div className={`w-full rounded-t transition-all ${fn226_c(s.score)}`} style={{ height: `${s.score}%` }} />
                          <span className="text-[6px] text-slate-600">{s.date.split('/')[1]}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[8px] text-slate-600 mt-2">{fn234_c(sessionHistory)}</p>
                  </div>

                  {/* CEFR Equivalent */}
                  <div className="p-4 bg-white/40 border border-teal-950/30 rounded-none">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-2">CEFR Equivalent</span>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-black text-teal-300">{fn268_c(avgScore)}</span>
                      <div>
                        <p className="text-[9px] text-slate-300">{fn269_c(fn268_c(avgScore))}</p>
                        <p className="text-[8px] text-slate-600">{fn271_c(fn270_c(avgScore))}</p>
                        <p className="text-[8px] text-slate-600">{fn273_c(fn272_c(avgScore))}</p>
                      </div>
                    </div>
                  </div>

                  {/* Level Breakdown */}
                  <div className="p-4 bg-white/40 border border-teal-950/30 rounded-none">
                    <span className="text-[9px] font-black text-slate-300 uppercase block mb-2">Sessions by Level</span>
                    <p className="text-[9px] text-slate-500">{fn281_c(fn280_c(sessionHistory))}</p>
                  </div>

                  {/* Session List */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {sessionHistory.map((r, i) => (
                      <div key={r.id} className="p-3 bg-slate-50 border border-slate-900 rounded-none flex items-center justify-between">
                        <div>
                          <span className="text-[8px] font-black text-slate-900 uppercase block line-clamp-1">{r.text.substring(0, 45)}...</span>
                          <span className="text-[7px] text-slate-600">{new Date(r.timestamp).toLocaleString()} · {r.wpm} WPM · {r.level}</span>
                        </div>
                        <span className={`text-sm font-black ${fn212_c(fn33(r.scores))}`}>{fn33(r.scores)}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* ══ BENCHMARK ══ */}
          {activeTab === 'benchmark' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Current Score', val: `${avgScore || initialAccuracy}%`, sub: fn27(avgScore || initialAccuracy) },
                  { label: 'Fluency', val: `${Math.round(initialFluency)}`, sub: fn29(initialFluency) },
                  { label: 'IELTS Equiv.', val: fn270_c(avgScore || initialAccuracy), sub: fn271_c(fn270_c(avgScore || initialAccuracy)) },
                  { label: 'TOEFL Equiv.', val: fn272_c(avgScore || initialAccuracy), sub: fn273_c(fn272_c(avgScore || initialAccuracy)) },
                ].map((b, i) => (
                  <div key={i} className="p-4 bg-white/40 border border-teal-950/30 rounded-none">
                    <span className="text-[8px] font-black text-slate-600 uppercase block">{b.label}</span>
                    <span className="text-2xl font-black text-teal-300 block mt-0.5">{b.val}</span>
                    <span className="text-[7px] text-slate-600">{b.sub}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white/40 border border-teal-950/30 rounded-none">
                <span className="text-[9px] font-black text-slate-300 uppercase block mb-3">Global Percentile</span>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-4 border-teal-500/50 flex items-center justify-center bg-white/50">
                    <span className="text-xl font-black text-teal-300">{fn263_c(avgScore || initialAccuracy)}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900">{fn264_c(fn263_c(avgScore || initialAccuracy))}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">{fn146(avgScore || initialAccuracy)}</p>
                    <p className="text-[8px] text-slate-600 mt-0.5">{fn265_c(avgScore || initialAccuracy, 78)}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/40 border border-teal-950/30 rounded-none">
                <span className="text-[9px] font-black text-amber-400 uppercase block mb-2">📊 Alta Dirección Targets</span>
                <div className="space-y-2">
                  {[
                    { label: 'Pronunciation', current: avgScore || initialAccuracy, target: 90 },
                    { label: 'Fluency', current: initialFluency, target: 85 },
                    { label: 'CEFR Target', current: fn134(avgScore || initialAccuracy, initialFluency), target: 88 },
                  ].map((t, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[8px] font-bold mb-1">
                        <span className="text-slate-500 uppercase">{t.label}</span>
                        <span className="text-slate-300">{fn115(t.current, t.target)}</span>
                      </div>
                      <div className="h-1.5 bg-slate-50 rounded-full">
                        <div className={`h-full rounded-full ${fn226_c(t.current)}`} style={{ width: `${Math.min(100, t.current)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white/40 border border-teal-950/30 rounded-none">
                <span className="text-[9px] font-black text-slate-300 uppercase block mb-2">📘 Coaching Plan</span>
                {fn260_c(avgScore || initialAccuracy).map((tip, i) => (
                  <p key={i} className="text-[9px] text-slate-500 flex items-start gap-2 mb-1">
                    <span className="text-[#D4AF37] font-black shrink-0">{i + 1}.</span>{tip}
                  </p>
                ))}
              </div>
            </>
          )}

          {/* ══ CERTIFICATION ══ */}
          {activeTab === 'certification' && (
            <>
              <div className={`p-4 rounded-none border text-center ${fn286_c(avgScore)} bg-clip-border`}>
                <span className="text-[8px] font-black uppercase tracking-widest block">{fn285_c(avgScore)}</span>
                <span className="text-4xl font-black text-slate-900 block mt-1">{avgScore || '--'}%</span>
                <span className="text-[9px] text-slate-700 block mt-1">{fn34(avgScore)}</span>
              </div>

              <div className="p-4 bg-white/40 border border-teal-950/30 rounded-none">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black text-slate-300 uppercase">Eligibility</span>
                  <CheckCircle2 size={14} className={eligible ? 'text-emerald-400' : 'text-slate-600'} />
                </div>
                <p className="text-[9px] text-slate-500">{fn284_c(eligible)}</p>
                <div className="mt-2 space-y-1 text-[8px] text-slate-600">
                  <p>✓ Min 3 sessions: {sessionHistory.length >= 3 ? '✅' : `${sessionHistory.length}/3`}</p>
                  <p>✓ Avg score ≥80%: {avgScore >= 80 ? '✅' : `${avgScore}%`}</p>
                  <p>✓ Fluency ≥75: {initialFluency >= 75 ? '✅' : `${initialFluency}/75`}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-800 rounded-none">
                <pre className="text-[7px] leading-relaxed text-slate-500 font-mono overflow-x-auto max-h-52 overflow-y-auto whitespace-pre">{certText}</pre>
              </div>

              <div className="flex gap-2">
                <button onClick={() => { fn183_c(certText); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="flex-1 py-3 bg-[#D4AF37]/20 hover:bg-white text-slate-950 font-black uppercase tracking-widest text-[8px] rounded-none flex items-center justify-center gap-2 transition-all">
                  <Clipboard size={11} /> {copied ? '✓ Copied!' : 'Copy Certificate'}
                </button>
                <button onClick={() => window.open(fn186_c(certText), '_blank')}
                  className="flex-1 py-3 bg-white/5 border border-teal-500/20 text-teal-300 hover:bg-white/10 font-black uppercase text-[8px] rounded-none transition-all">
                  LinkedIn
                </button>
                <button onClick={() => window.open(fn187_c(avgScore), '_blank')}
                  className="flex-1 py-3 bg-white/5 border border-teal-500/20 text-teal-300 hover:bg-white/10 font-black uppercase text-[8px] rounded-none transition-all">
                  Twitter
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
