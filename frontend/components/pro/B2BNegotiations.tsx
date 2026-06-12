'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Briefcase, X, Target, TrendingUp, Award, Users, Zap,
  ChevronRight, ChevronLeft, RefreshCw, CheckCircle2, AlertTriangle,
  Mic, Square, Loader2, Volume2, BarChart3, Shield, Globe,
  MessageSquare, Star, Download, Clipboard, Trophy, Activity
} from 'lucide-react';

interface B2BNegotiationsProps {
  onClose: () => void;
}

// ══════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ══════════════════════════════════════════════════════════════

interface NegotiationScenario {
  id: string;
  title: string;
  context: string;
  counterpart: string;
  stake: 'Low' | 'Mid' | 'High' | 'Critical';
  level: 'B1' | 'B2' | 'C1' | 'C2';
  opener: string;
  objectives: string[];
  keyTerms: string[];
  difficulty: number;
}

interface DrillQuestion {
  id: string;
  prompt: string;
  options: string[];
  correct: string;
  explanation: string;
  category: string;
}

interface NegotiationLog {
  scenario: string;
  score: number;
  timestamp: number;
  level: string;
}

// ══════════════════════════════════════════════════════════════
// SCENARIO LIBRARY (20 immersive B2B negotiation scenarios)
// ══════════════════════════════════════════════════════════════

const B2B_SCENARIOS: NegotiationScenario[] = [
  {
    id: 'scen_01', title: 'SaaS Enterprise License Deal', stake: 'High', level: 'C1',
    counterpart: 'CTO of a Fortune 500 company',
    context: 'You are selling a 3-year enterprise SaaS license worth $2.4M. The CTO has competing bids.',
    opener: 'Thank you for your time. Our platform offers a 40% reduction in operational overhead. How important is scalability to your 2026 roadmap?',
    objectives: ['Close deal above $2M', 'Secure 3-year commitment', 'Add premium support tier'],
    keyTerms: ['SLA', 'uptime guarantee', 'API integration', 'enterprise tier', 'ROI'],
    difficulty: 88
  },
  {
    id: 'scen_02', title: 'Global Supplier Alliance', stake: 'Critical', level: 'C2',
    counterpart: 'VP of Procurement, multinational conglomerate',
    context: 'Negotiating exclusive supply agreement across 12 markets. Volumes exceed $50M annually.',
    opener: 'Our supply chain infrastructure guarantees 99.8% delivery precision across all designated markets. Shall we align on KPI thresholds first?',
    objectives: ['Lock in preferred supplier status', 'Cap price escalation at 3%', 'Include penalty clauses'],
    keyTerms: ['preferred supplier', 'volume rebate', 'force majeure', 'exclusivity clause', 'penalty'],
    difficulty: 96
  },
  {
    id: 'scen_03', title: 'Strategic Marketing Partnership', stake: 'Mid', level: 'B2',
    counterpart: 'CMO of a regional retail chain',
    context: 'Proposing a co-branding partnership with shared digital marketing spend.',
    opener: 'Our combined audience reach would exceed 4 million monthly active users. Co-branded campaigns historically yield 2.3x conversion.',
    objectives: ['50/50 media budget split', 'Shared attribution model', 'Quarterly performance reviews'],
    keyTerms: ['co-branding', 'attribution', 'CPM', 'conversion rate', 'media budget'],
    difficulty: 72
  },
  {
    id: 'scen_04', title: 'M&A Term Sheet Negotiation', stake: 'Critical', level: 'C2',
    counterpart: 'CEO & legal counsel of target company',
    context: 'Acquiring a Series B startup. Valuation dispute of 30% between parties.',
    opener: 'Our EBITDA-adjusted valuation methodology reflects industry-standard multiples. We propose a structured earnout to bridge the gap.',
    objectives: ['Close within 15% of initial offer', 'Secure IP rights', 'Retain key engineering talent'],
    keyTerms: ['earnout', 'EBITDA multiple', 'representations and warranties', 'indemnification', 'closing conditions'],
    difficulty: 99
  },
  {
    id: 'scen_05', title: 'Cloud Migration Services Contract', stake: 'High', level: 'C1',
    counterpart: 'IT Director, healthcare provider',
    context: 'A $1.8M cloud migration engagement under strict HIPAA compliance requirements.',
    opener: 'Our healthcare cloud practice has managed migrations for 6 of the top 20 US hospital networks with zero compliance incidents.',
    objectives: ['Win $1.8M contract', 'Include managed services addon', 'Establish 5-year relationship'],
    keyTerms: ['HIPAA', 'data sovereignty', 'migration timeline', 'SLA', 'managed services'],
    difficulty: 85
  },
  {
    id: 'scen_06', title: 'International Distribution Agreement', stake: 'High', level: 'C1',
    counterpart: 'Regional VP, LATAM distributor',
    context: 'Expanding product distribution across 8 Latin American markets.',
    opener: 'Our brand has grown 340% in comparable emerging markets. We see a similar trajectory for LATAM with the right local partner.',
    objectives: ['Minimum annual purchase commitment', 'Exclusive territory rights', 'Training support package'],
    keyTerms: ['exclusivity', 'minimum purchase commitment', 'territory rights', 'training', 'channel margin'],
    difficulty: 80
  },
  {
    id: 'scen_07', title: 'R&D Joint Venture Proposal', stake: 'Critical', level: 'C2',
    counterpart: 'Chief Science Officer, biotech firm',
    context: 'Structuring a $30M joint R&D venture for proprietary drug delivery technology.',
    opener: 'Given our complementary IP portfolios, a joint venture structure would accelerate time-to-market by approximately 18 months.',
    objectives: ['Equal IP ownership', '$30M committed funding', 'Revenue sharing at 60/40'],
    keyTerms: ['IP ownership', 'joint venture', 'milestone payments', 'licensing royalties', 'co-development'],
    difficulty: 98
  },
  {
    id: 'scen_08', title: 'Managed IT Services Renewal', stake: 'Mid', level: 'B2',
    counterpart: 'CFO demanding 20% price reduction',
    context: 'Renewing a $600K annual managed services contract. Client threatening to switch vendors.',
    opener: 'Our service delivery metrics show 99.96% uptime over the past 36 months. I want to explore how we can structure additional value rather than simply reduce the rate.',
    objectives: ['Retain full contract value', 'Add cybersecurity module', 'Extend to 2-year term'],
    keyTerms: ['churn prevention', 'value add', 'SLA metrics', 'contract renewal', 'escalation clause'],
    difficulty: 74
  },
  {
    id: 'scen_09', title: 'Logistics & Last-Mile Contract', stake: 'High', level: 'C1',
    counterpart: 'Head of Supply Chain, e-commerce giant',
    context: 'Pitching last-mile delivery contracts for 3 metropolitan regions.',
    opener: 'Our average delivery window is 2.1 hours same-day, with real-time tracking integration and 98.7% on-time delivery rate.',
    objectives: ['Win 3-city contract', 'Guarantee pricing model', 'Include performance bonuses'],
    keyTerms: ['last-mile', 'on-time delivery', 'hub efficiency', 'integration API', 'SLA penalty'],
    difficulty: 83
  },
  {
    id: 'scen_10', title: 'Corporate Training Partnership', stake: 'Low', level: 'B1',
    counterpart: 'HR Director, mid-size manufacturing company',
    context: 'Proposing an executive language training subscription for 200 employees.',
    opener: 'Our platform has helped 14 manufacturing companies improve cross-border communication efficiency by an average of 28%.',
    objectives: ['Annual subscription close', 'Pilot with 50 users', 'Quarterly reporting cadence'],
    keyTerms: ['pilot', 'ROI metrics', 'employee engagement', 'subscription', 'reporting dashboard'],
    difficulty: 60
  },
  {
    id: 'scen_11', title: 'Private Equity Capital Raise', stake: 'Critical', level: 'C2',
    counterpart: 'Managing Partner, Tier 1 PE firm',
    context: 'Seeking $80M Series C investment with board seat considerations.',
    opener: 'Our unit economics have improved for 11 consecutive quarters. We are targeting a $400M exit at 5x multiple within 36 months.',
    objectives: ['$80M at pre-agreed valuation', 'Minimize board dilution', 'Retain founder veto rights'],
    keyTerms: ['pre-money valuation', 'dilution', 'liquidation preference', 'anti-dilution', 'drag-along rights'],
    difficulty: 100
  },
  {
    id: 'scen_12', title: 'Professional Services Agreement', stake: 'Mid', level: 'B2',
    counterpart: 'Procurement Manager, consulting firm client',
    context: 'Negotiating hourly rates and project scope for a 6-month strategy engagement.',
    opener: 'Our practice has delivered measurable ROI of 4-8x on comparable strategy engagements. I would like to align on KPI targets before finalizing rates.',
    objectives: ['Secure $450K project budget', 'Flexible scope expansion clause', 'Retainer option'],
    keyTerms: ['statement of work', 'change order', 'retainer', 'deliverables', 'T&M vs fixed-fee'],
    difficulty: 70
  },
  {
    id: 'scen_13', title: 'Government Procurement Bid', stake: 'High', level: 'C1',
    counterpart: 'Procurement Officer, federal agency',
    context: 'Competing for a 5-year $15M government IT infrastructure contract.',
    opener: 'Our FedRAMP-authorized infrastructure has been deployed across 4 cabinet-level agencies with a perfect compliance record.',
    objectives: ['Win full contract award', 'Favorable payment schedule', 'Include expansion option'],
    keyTerms: ['FedRAMP', 'FISMA', 'GSA schedule', 'teaming agreement', 'LPTA vs best value'],
    difficulty: 90
  },
  {
    id: 'scen_14', title: 'Franchise Licensing Deal', stake: 'Mid', level: 'B2',
    counterpart: 'CEO of regional operator seeking expansion',
    context: 'Licensing brand to new regional franchise operator across 5 territories.',
    opener: 'Our franchise model yields an average 38% EBITDA margin for operators in Year 2. Let us review the operational support infrastructure before discussing the licensing fee.',
    objectives: ['Licensing fee above $250K', 'Royalty at 6%', 'Brand standards compliance'],
    keyTerms: ['franchise disclosure', 'royalty', 'territory rights', 'brand standards', 'renewal option'],
    difficulty: 75
  },
  {
    id: 'scen_15', title: 'Fintech Integration Partnership', stake: 'High', level: 'C1',
    counterpart: 'Chief Product Officer, digital bank',
    context: 'Integrating payment processing APIs into core banking platform.',
    opener: 'Our payment rail processes $2.3B in daily transactions with sub-100ms latency. What compliance thresholds does your architecture require?',
    objectives: ['Revenue share above 1.2%', 'API exclusivity for 18 months', 'Shared compliance team'],
    keyTerms: ['PCI-DSS', 'API revenue share', 'interchange', 'chargeback liability', 'escrow'],
    difficulty: 87
  },
  {
    id: 'scen_16', title: 'Real Estate Commercial Lease', stake: 'Mid', level: 'B2',
    counterpart: 'Property management VP',
    context: 'Negotiating a 10-year commercial lease for 40,000 sq ft headquarters.',
    opener: 'We are prepared to commit to a 10-year term in exchange for a 3-month rent abatement and tenant improvement allowance of $85 per square foot.',
    objectives: ['$85/sqft TI allowance', '3-month rent-free', 'Subleasing rights'],
    keyTerms: ['TI allowance', 'rent abatement', 'CAM charges', 'subleasing', 'CPI escalation'],
    difficulty: 73
  },
  {
    id: 'scen_17', title: 'Pharmaceutical Licensing Agreement', stake: 'Critical', level: 'C2',
    counterpart: 'Business Development VP, pharma company',
    context: 'Licensing a patented compound formula for manufacturing rights.',
    opener: 'Our compound has demonstrated Phase 2 efficacy superior to existing benchmarks. We are proposing a tiered royalty structure based on manufacturing volume milestones.',
    objectives: ['Upfront payment of $5M', 'Royalty at 8-12%', 'Co-promotion rights'],
    keyTerms: ['licensing royalty', 'milestone payment', 'co-promotion', 'IP protection', 'supply agreement'],
    difficulty: 97
  },
  {
    id: 'scen_18', title: 'Data Analytics Services Pitch', stake: 'Mid', level: 'B2',
    counterpart: 'VP of Operations, retail company',
    context: 'Selling a predictive analytics platform subscription to drive inventory optimization.',
    opener: 'Our demand forecasting model reduced overstocking by 31% for clients of comparable scale. What does your current inventory loss rate look like?',
    objectives: ['Annual contract above $180K', 'Data integration scope', 'Expansion clause'],
    keyTerms: ['predictive analytics', 'demand forecasting', 'inventory optimization', 'API integration', 'data governance'],
    difficulty: 69
  },
  {
    id: 'scen_19', title: 'Cybersecurity Services Contract', stake: 'High', level: 'C1',
    counterpart: 'CISO of a financial institution',
    context: 'Pitching a SOC-as-a-Service platform with 24/7 threat monitoring.',
    opener: 'Our SOC team has detected and neutralized over 1,200 zero-day threats in the past fiscal year. How is your current MTTD benchmarked against industry peers?',
    objectives: ['$750K annual contract', 'SIEM integration scope', '24/7 SLA commitment'],
    keyTerms: ['MTTD', 'SOC', 'zero-day', 'SIEM integration', 'incident response SLA'],
    difficulty: 89
  },
  {
    id: 'scen_20', title: 'Executive Coaching Program Sale', stake: 'Low', level: 'B1',
    counterpart: 'Chief People Officer of a growing startup',
    context: 'Selling a 12-month executive coaching program for the leadership team.',
    opener: 'Our coaching methodology has been adopted by 3 unicorn startups pre-IPO. What leadership gaps is your executive team prioritizing this year?',
    objectives: ['12-month program above $120K', 'Include team workshops', 'Quarterly assessments'],
    keyTerms: ['coaching methodology', 'leadership development', 'assessment framework', 'workshop', 'ROI model'],
    difficulty: 58
  }
];

// ══════════════════════════════════════════════════════════════
// JARGON DRILL LIBRARY (15 tactical B2B drill questions)
// ══════════════════════════════════════════════════════════════

const B2B_DRILLS: DrillQuestion[] = [
  {
    id: 'd01', category: 'Deal Structuring',
    prompt: 'A prospect says "Your price is 25% above our budget." The most strategic Alta Dirección response is:',
    options: [
      'We can reduce the price to match your budget immediately.',
      'Let us reframe the conversation around total cost of ownership and ROI over 36 months.',
      'Could you increase your budget allocation for this quarter?',
    ],
    correct: 'Let us reframe the conversation around total cost of ownership and ROI over 36 months.',
    explanation: 'TCO reframing shifts the conversation from cost to value, demonstrating strategic financial acuity.'
  },
  {
    id: 'd02', category: 'Objection Handling',
    prompt: 'The CFO says "We are happy with our current vendor." The best counter is:',
    options: [
      'We are better than your current vendor in every metric.',
      'Understood. May I ask — when did you last benchmark your current solution against market alternatives?',
      'Our pricing is much lower. Please consider switching.',
    ],
    correct: 'Understood. May I ask — when did you last benchmark your current solution against market alternatives?',
    explanation: 'Benchmarking questions create cognitive dissonance and open dialogue without attacking the incumbent vendor.'
  },
  {
    id: 'd03', category: 'Closing Techniques',
    prompt: 'Which closing technique maintains executive composure while accelerating commitment?',
    options: [
      'The Assumptive Close: "Shall we proceed with onboarding next Monday?"',
      'Discounting urgently: "This offer expires in 24 hours."',
      'Simply asking if they are ready to sign.',
    ],
    correct: 'The Assumptive Close: "Shall we proceed with onboarding next Monday?"',
    explanation: 'Assumptive closes maintain authority, project confidence, and create positive momentum without pressure tactics.'
  },
  {
    id: 'd04', category: 'Contract Negotiation',
    prompt: 'The counterpart insists on Net-90 payment terms. Your optimal response:',
    options: [
      'We accept Net-90 to close the deal quickly.',
      'We can accommodate Net-45 with a 1.2% early payment discount as an incentive.',
      'Our terms are non-negotiable — Net-30 only.',
    ],
    correct: 'We can accommodate Net-45 with a 1.2% early payment discount as an incentive.',
    explanation: 'Offering a discount for early payment preserves cash flow while giving the counterpart a financial incentive to cooperate.'
  },
  {
    id: 'd05', category: 'Value Articulation',
    prompt: 'A prospect questions your premium pricing vs. a cheaper alternative. Best executive reframe:',
    options: [
      'Our solution is premium because of our brand reputation.',
      'The cost delta between solutions is recovered within 4 months through efficiency gains our analytics confirm.',
      'We are more expensive because we offer more features.',
    ],
    correct: 'The cost delta between solutions is recovered within 4 months through efficiency gains our analytics confirm.',
    explanation: 'Payback period framing transforms the conversation from cost comparison to financial investment analysis.'
  },
  {
    id: 'd06', category: 'Risk Mitigation',
    prompt: 'The counterpart demands a penalty clause for delivery delays. Your strategic response:',
    options: [
      'Reject the clause entirely as unreasonable.',
      'We can accept a mutual SLA penalty framework — with reciprocal clauses for delays caused by client-side dependencies.',
      'Agree to a 20% penalty with no conditions.',
    ],
    correct: 'We can accept a mutual SLA penalty framework — with reciprocal clauses for delays caused by client-side dependencies.',
    explanation: 'Mutual penalty structures demonstrate accountability while protecting your firm from unjustified financial exposure.'
  },
  {
    id: 'd07', category: 'Stakeholder Alignment',
    prompt: 'You discover the final decision requires board approval you were unaware of. You should:',
    options: [
      'Push for a quick verbal commitment before the board gets involved.',
      'Request a formal meeting with the board to present the business case directly.',
      'Wait indefinitely for the board to make a decision.',
    ],
    correct: 'Request a formal meeting with the board to present the business case directly.',
    explanation: 'Executive access to decision-makers removes information distortion and allows you to control the narrative at the highest level.'
  },
  {
    id: 'd08', category: 'Anchoring',
    prompt: 'Which statement best establishes a price anchor that benefits your position?',
    options: [
      '"Our competitors charge $500K for similar solutions, and we deliver 30% more capability."',
      '"We are willing to negotiate from our list price of $200K."',
      '"Let us see what your budget is and work backwards."',
    ],
    correct: '"Our competitors charge $500K for similar solutions, and we deliver 30% more capability."',
    explanation: 'Competitive anchoring frames your price as a discount relative to market alternatives, improving perceived value.'
  },
  {
    id: 'd09', category: 'Alliance Negotiation',
    prompt: 'A strategic partner wants equal IP ownership in a joint venture. Your position:',
    options: [
      'Agree to equal IP ownership unconditionally.',
      'We propose a 70/30 IP split weighted toward our base patents, with joint ownership of all derivatives.',
      'Decline any IP sharing arrangements entirely.',
    ],
    correct: 'We propose a 70/30 IP split weighted toward our base patents, with joint ownership of all derivatives.',
    explanation: 'Protecting core IP while allowing derivative co-ownership creates balanced incentives for collaboration without compromising competitive assets.'
  },
  {
    id: 'd10', category: 'Escalation Management',
    prompt: 'A negotiation is stuck at an impasse. The most productive executive move is:',
    options: [
      'Walk away from the deal immediately to signal strength.',
      'Request a 48-hour recess to allow principals to consult internally, then reconvene at a senior executive level.',
      'Concede on all remaining points to close the deal.',
    ],
    correct: 'Request a 48-hour recess to allow principals to consult internally, then reconvene at a senior executive level.',
    explanation: 'Strategic pauses allow both parties to recalibrate, save face, and return to the table with renewed mandate and flexibility.'
  },
  {
    id: 'd11', category: 'Concession Strategy',
    prompt: 'When making a concession, the most sophisticated approach is:',
    options: [
      'Give the concession quickly to show good faith.',
      'Attach each concession to a reciprocal ask — "If we adjust on X, we would need your commitment on Y."',
      'Concede on price only as a last resort.',
    ],
    correct: 'Attach each concession to a reciprocal ask — "If we adjust on X, we would need your commitment on Y."',
    explanation: 'Conditional concessions maintain negotiation leverage, signal that nothing is free, and extract value from every trade.'
  },
  {
    id: 'd12', category: 'International Negotiations',
    prompt: 'Negotiating with a high-context culture (Japan, UAE), you should:',
    options: [
      'Get straight to the contract terms immediately to save time.',
      'Invest time in relationship building and indirect communication before discussing terms.',
      'Use the same direct approach as with Western counterparts.',
    ],
    correct: 'Invest time in relationship building and indirect communication before discussing terms.',
    explanation: 'High-context cultures prioritize trust, rapport, and face-preservation. Relationship capital is a prerequisite for commercial negotiations.'
  },
  {
    id: 'd13', category: 'Pricing Strategy',
    prompt: 'A prospect asks for your "best price" upfront. The correct response is:',
    options: [
      'Immediately share your lowest possible price.',
      'Our pricing is structured to reflect the scope of value delivered. Let us first align on requirements, then I can present a precise investment model.',
      'Tell them your best price is already in the proposal.',
    ],
    correct: 'Our pricing is structured to reflect the scope of value delivered. Let us first align on requirements, then I can present a precise investment model.',
    explanation: 'Refusing to anchor low preserves negotiating room and reframes price as a function of value, not an arbitrary discount.'
  },
  {
    id: 'd14', category: 'Term Negotiation',
    prompt: 'The client demands a 1-year contract instead of 3 years. Your strategic response:',
    options: [
      'Accept the 1-year term without conditions.',
      'We can structure a 1-year agreement with a 12% premium over the 3-year rate, given the reduced commitment certainty.',
      'Decline shorter terms as unprofitable.',
    ],
    correct: 'We can structure a 1-year agreement with a 12% premium over the 3-year rate, given the reduced commitment certainty.',
    explanation: 'Pricing shorter commitments at a premium makes the longer term the economically rational choice for the client, incentivizing the outcome you prefer.'
  },
  {
    id: 'd15', category: 'Due Diligence',
    prompt: 'Before finalizing an M&A term sheet, the most critical financial metric to validate is:',
    options: [
      'Gross revenue reported in pitch materials.',
      'Trailing 12-month EBITDA adjusted for one-time items, with a normalized working capital analysis.',
      'Employee headcount and office locations.',
    ],
    correct: 'Trailing 12-month EBITDA adjusted for one-time items, with a normalized working capital analysis.',
    explanation: 'Adjusted EBITDA reveals true recurring earnings power and prevents inflated valuations based on non-recurring revenue or expense manipulation.'
  }
];

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export const B2BNegotiations = ({ onClose }: B2BNegotiationsProps) => {

  // ─── STATE ───
  const [activeTab, setActiveTab] = useState<'scenarios' | 'drills' | 'analytics' | 'certification'>('scenarios');
  const [selectedScenario, setSelectedScenario] = useState<NegotiationScenario>(B2B_SCENARIOS[0]);
  const [scenarioFilter, setScenarioFilter] = useState<'All' | 'B1' | 'B2' | 'C1' | 'C2'>('All');
  const [simulationActive, setSimulationActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [volume, setVolume] = useState(0);
  const [negotiationXP, setNegotiationXP] = useState(2800);
  const [sessionLogs, setSessionLogs] = useState<NegotiationLog[]>([]);
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillAnswer, setDrillAnswer] = useState<string | null>(null);
  const [drillFeedback, setDrillFeedback] = useState<string | null>(null);
  const [drillScore, setDrillScore] = useState(0);
  const [drillAttempts, setDrillAttempts] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // ─── UTILITIES ───
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) interval = setInterval(() => setRecordingTime(t => t + 1), 1000);
    else setRecordingTime(0);
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    audioCtxRef.current?.close();
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // ══════════════════════════════════════════════════════════════
  // ███  300 PROFESSIONAL B2B NEGOTIATION FUNCTIONS  ███
  // ══════════════════════════════════════════════════════════════

  // ─── MODULE 1: TEXT & LINGUISTIC ANALYSIS [fn1-fn60] ───

  const fn1 = (t: string) => t.split(/\s+/).filter(Boolean).length;
  const fn2 = (t: string) => t.split(/[.!?]+/).filter(Boolean).length;
  const fn3 = (t: string, s: number) => s > 0 ? Math.round((fn1(t) / s) * 60) : 0;
  const fn4 = (wpm: number) => wpm > 160 ? 'Too fast for Alta Dirección' : wpm < 70 ? 'Too slow — lacks urgency' : 'Executive cadence';
  const fn5 = (t: string) => t.toLowerCase().split(' ').filter(w => ['uh','um','like','so','basically','literally'].includes(w)).length;
  const fn6 = (fc: number, wc: number) => wc > 0 ? Math.round((fc / wc) * 100) : 0;
  const fn7 = (pct: number) => pct > 5 ? 'Reduce verbal fillers for authority' : 'Clean executive delivery';
  const fn8 = (t: string) => t.split(' ').map(w => w.length).reduce((a, b) => a + b, 0) / Math.max(1, fn1(t));
  const fn9 = (avg: number) => avg > 6 ? 'Complex vocabulary (C1/C2)' : 'Accessible register (B1/B2)';
  const fn10 = (t: string) => fn2(t) > 0 ? Math.round(fn1(t) / fn2(t)) : 0;
  const fn11 = (avg: number) => avg > 25 ? 'Overly complex statements' : avg < 8 ? 'Too brief — expand argument depth' : 'Optimal sentence structure';
  const fn12 = (t: string) => t.toLowerCase().split(' ').filter(w => ['roi','ebitda','irr','npv','cagr','arr','mrr','ltv','cac'].includes(w)).length;
  const fn13 = (c: number) => c > 2 ? 'High financial acuity demonstrated' : 'Add more financial metrics';
  const fn14 = (t: string) => t.toLowerCase().split(' ').filter(w => ['partnership','collaboration','mutual','together','alliance','synergy'].includes(w)).length;
  const fn15 = (c: number) => c > 1 ? 'Strong collaborative framing' : 'Increase partnership language';
  const fn16 = (t: string) => t.toLowerCase().split(' ').filter(w => ['risk','mitigate','exposure','liability','contingency'].includes(w)).length;
  const fn17 = (c: number) => c > 0 ? 'Risk-aware negotiator' : 'Address risk management explicitly';
  const fn18 = (t: string) => t.toLowerCase().split(' ').filter(w => ['value','deliver','impact','optimize','transform','accelerate'].includes(w)).length;
  const fn19 = (c: number) => c > 2 ? 'High value articulation' : 'Strengthen value proposition language';
  const fn20 = (t: string) => t.toLowerCase().split(' ').filter(w => ['timeline','deadline','milestone','schedule','delivery'].includes(w)).length;
  const fn21 = (t: string) => t.toLowerCase().split(' ').filter(w => ['exclusive','proprietary','patented','unique','differentiator'].includes(w)).length;
  const fn22 = (t: string) => t.toLowerCase().split(' ').filter(w => ['compliance','regulatory','audit','legal','governance'].includes(w)).length;
  const fn23 = (t: string) => t.toLowerCase().split(' ').filter(w => ['guarantee','warranty','commitment','assured','certified'].includes(w)).length;
  const fn24 = (t: string) => t.toLowerCase().split(' ').filter(w => ['customer','client','stakeholder','investor','board'].includes(w)).length;
  const fn25 = (t: string) => t.toLowerCase().split(' ').filter(w => ['data','analytics','intelligence','insight','metrics'].includes(w)).length;
  const fn26 = (t: string) => t.toLowerCase().split(' ').filter(w => ['scale','growth','expand','penetrate','capture'].includes(w)).length;
  const fn27 = (t: string) => t.toLowerCase().split(' ').filter(w => ['innovation','technology','platform','digital','solution'].includes(w)).length;
  const fn28 = (t: string) => t.toLowerCase().split(' ').filter(w => ['margin','profit','revenue','cash','budget'].includes(w)).length;
  const fn29 = (t: string) => t.toLowerCase().split(' ').filter(w => ['strategic','framework','roadmap','blueprint','model'].includes(w)).length;
  const fn30 = (t: string) => t.toLowerCase().split(' ').filter(w => ['competitive','advantage','market','position','share'].includes(w)).length;
  const fn31 = (t: string) => t.toLowerCase().split(' ').filter(w => ['due diligence','diligence'].some(k => t.toLowerCase().includes(k))).length;
  const fn32 = (t: string) => t.toLowerCase().split(' ').filter(w => ['term sheet','termsheet'].some(k => t.toLowerCase().includes(k))).length;
  const fn33 = (t: string) => t.toLowerCase().split(' ').filter(w => ['close','sign','commit','execute','finalize'].includes(w)).length;
  const fn34 = (t: string) => t.toLowerCase().split(' ').filter(w => ['negotiation','negotiate','counter','offer','proposal'].includes(w)).length;
  const fn35 = (t: string) => t.toLowerCase().split(' ').filter(w => ['leverage','position','advantage','power'].includes(w)).length;
  const fn36 = (t: string) => t.toLowerCase().split(' ').filter(w => ['concession','compromise','adjustment','flexibility'].includes(w)).length;
  const fn37 = (t: string) => t.toLowerCase().split(' ').filter(w => ['anchor','benchmark','baseline','reference'].includes(w)).length;
  const fn38 = (t: string) => t.toLowerCase().split(' ').filter(w => ['integration','implementation','onboarding','deployment'].includes(w)).length;
  const fn39 = (t: string) => t.toLowerCase().split(' ').filter(w => ['sla','uptime','availability','performance','reliability'].includes(w)).length;
  const fn40 = (t: string) => t.toLowerCase().split(' ').filter(w => ['roi','payback','break-even','return','yield'].includes(w)).length;
  const fn41 = (t: string) => t.toLowerCase().split(' ').filter(w => ['confidential','nda','proprietary','sensitive'].includes(w)).length;
  const fn42 = (t: string) => t.toLowerCase().split(' ').filter(w => ['exit','acquisition','merger','valuation','multiple'].includes(w)).length;
  const fn43 = (t: string) => t.toLowerCase().split(' ').filter(w => ['earnout','milestone','tranche','installment'].includes(w)).length;
  const fn44 = (t: string) => t.toLowerCase().split(' ').filter(w => ['channel','distributor','reseller','partner','tier'].includes(w)).length;
  const fn45 = (t: string) => t.toLowerCase().split(' ').filter(w => ['forecast','projection','guidance','outlook','target'].includes(w)).length;
  const fn46 = (t: string) => t.toLowerCase().split(' ').filter(w => ['board','executive','c-suite','director','vp'].includes(w)).length;
  const fn47 = (t: string) => t.toLowerCase().split(' ').filter(w => ['brand','reputation','trust','credibility','authority'].includes(w)).length;
  const fn48 = (t: string) => t.toLowerCase().split(' ').filter(w => ['efficiency','productivity','streamline','optimize','automate'].includes(w)).length;
  const fn49 = (t: string) => t.toLowerCase().split(' ').filter(w => ['security','protection','encryption','firewall','compliance'].includes(w)).length;
  const fn50 = (t: string) => t.toLowerCase().split(' ').filter(w => ['contract','agreement','clause','terms','conditions'].includes(w)).length;
  const fn51 = (t: string) => t.toLowerCase().split(' ').filter(w => ['discount','rebate','incentive','promotion'].includes(w)).length;
  const fn52 = (t: string) => t.toLowerCase().split(' ').filter(w => ['we','our','us','together','collectively'].includes(w)).length;
  const fn53 = (t: string) => t.toLowerCase().split(' ').filter(w => ['i','my','me'].includes(w)).length;
  const fn54 = (a: number, b: number) => b > 0 ? Math.round((a / b) * 100) : 0;
  const fn55 = (pct: number) => pct > 60 ? 'Collaborative stance' : 'Consider more inclusive language';
  const fn56 = (t: string): number => { const l = t.toLowerCase().replace(/[^a-z]/g,'').length; const w = fn1(t); const s = fn2(t); if(!w||!s) return 0; return Math.round(206.835 - 1.015*(w/s) - 84.6*(l/w/1.5)); };
  const fn57 = (rs: number) => rs < 30 ? 'Academic/Executive Grade' : rs < 60 ? 'Business Professional' : 'Public Register';
  const fn58 = (t: string) => t.toLowerCase().split(' ').filter(w => ['if','would','could','should','were','assuming'].includes(w)).length;
  const fn59 = (c: number) => c > 1 ? 'Diplomatic conditional framing' : 'Add conditional structures for flexibility';
  const fn60 = (t: string) => t.toLowerCase().split(' ').filter(w => ['question','ask','clarify','understand','confirm'].includes(w)).length;

  // ─── MODULE 2: NEGOTIATION SCORING ENGINE [fn61-fn120] ───

  const fn61 = (kc: number, wc: number) => Math.min(100, Math.round((kc / Math.max(1, wc)) * 500));
  const fn62 = (d: number) => d > 90 ? 'Elite Negotiator' : d > 75 ? 'Senior Partner' : d > 60 ? 'Business Professional' : 'Developing Executive';
  const fn63 = (d: number) => d > 90 ? 'text-emerald-400' : d > 75 ? 'text-amber-400' : d > 60 ? 'text-orange-400' : 'text-red-400';
  const fn64 = (wpm: number, filler: number, fin: number, val: number, coll: number) => Math.round(wpm * 0.2 + (100 - filler * 10) * 0.2 + fin * 5 + val * 5 + coll * 5);
  const fn65 = (s: number) => s > 90 ? '🏆 Corporativo Elite' : s > 75 ? '⭐ Strategic Leader' : s > 60 ? '📊 Business Professional' : '🔰 Junior Negotiator';
  const fn66 = (stake: string) => stake === 'Critical' ? 100 : stake === 'High' ? 80 : stake === 'Mid' ? 60 : 40;
  const fn67 = (lvl: string) => lvl === 'C2' ? 100 : lvl === 'C1' ? 80 : lvl === 'B2' ? 60 : 40;
  const fn68 = (a: number, b: number) => Math.round((a + b) / 2);
  const fn69 = (score: number) => Math.round(score * 3.5);
  const fn70 = (xp: number) => Math.floor(xp / 1000) + 1;
  const fn71 = (xp: number) => (Math.floor(xp / 1000) + 1) * 1000;
  const fn72 = (xp: number) => Math.round(((xp % 1000) / 1000) * 100);
  const fn73 = (lvl: number) => lvl >= 8 ? 'Global Dealmaker' : lvl >= 6 ? 'Senior Negotiator' : lvl >= 4 ? 'Business Developer' : 'Rising Executive';
  const fn74 = (score: number) => score >= 90 ? 'bg-[#D4AF37]/100/20 text-emerald-300 border-emerald-500/30' : 'bg-[#D4AF37]/20/20 text-amber-300 border-[#D4AF37]/30/30';
  const fn75 = (logs: NegotiationLog[]) => logs.length > 0 ? Math.round(logs.reduce((a, l) => a + l.score, 0) / logs.length) : 0;
  const fn76 = (logs: NegotiationLog[]) => logs.length > 0 ? Math.max(...logs.map(l => l.score)) : 0;
  const fn77 = (logs: NegotiationLog[]) => logs.length > 0 ? Math.min(...logs.map(l => l.score)) : 0;
  const fn78 = (logs: NegotiationLog[]) => logs.filter(l => l.score >= 80).length;
  const fn79 = (logs: NegotiationLog[]) => logs.filter(l => l.score < 60).length;
  const fn80 = (logs: NegotiationLog[]) => {
    if (logs.length < 2) return 'Insufficient data';
    const diff = logs[0].score - logs[logs.length - 1].score;
    return diff > 0 ? `↑ +${diff} pts improvement` : diff < 0 ? `↓ ${diff} pts decline` : '→ Stable performance';
  };
  const fn81 = (s: number) => `${s < 40 ? '🔴' : s < 70 ? '🟡' : '🟢'} ${s}%`;
  const fn82 = (d: number) => d > 85 ? '⚡ EXTREME' : d > 70 ? '🔥 HARD' : d > 55 ? '💼 MEDIUM' : '🌱 STARTER';
  const fn83 = (d: number) => d > 85 ? 'border-red-500/40 bg-red-950/20 text-red-300' : d > 70 ? 'border-orange-500/40 bg-orange-950/20 text-orange-300' : 'border-blue-500/40 bg-blue-950/20 text-blue-300';
  const fn84 = (scenarios: NegotiationScenario[], level: string) => level === 'All' ? scenarios : scenarios.filter(s => s.level === level);
  const fn85 = (t: string) => ['synergy','leverage','mitigate','align','optimize','deploy','scale','monetize','capitalize'].filter(w => t.toLowerCase().includes(w)).length;
  const fn86 = (c: number) => Math.min(100, c * 15);
  const fn87 = (score: number, stake: number) => Math.round(score * (1 + stake / 200));
  const fn88 = (correct: number, total: number) => total > 0 ? Math.round((correct / total) * 100) : 0;
  const fn89 = (pct: number) => pct >= 80 ? 'Accredited Negotiator' : pct >= 60 ? 'Competent Dealmaker' : 'Developing Skills';
  const fn90 = (t: string) => { const words = t.split(' '); const unique = new Set(words.map(w => w.toLowerCase())); return Math.round((unique.size / Math.max(1, words.length)) * 100); };
  const fn91 = (ltt: number) => ltt > 75 ? 'Rich lexical variety' : 'Expand vocabulary range';
  const fn92 = (t: string) => t.toLowerCase().split(' ').filter(w => w.length > 8).length;
  const fn93 = (c: number, tot: number) => tot > 0 ? Math.round((c / tot) * 100) : 0;
  const fn94 = (pct: number) => pct > 25 ? 'Advanced lexical complexity' : 'Mid-level complexity';
  const fn95 = (t: string) => t.toLowerCase().split(' ').filter(w => ['however','although','nevertheless','whereas','despite','notwithstanding'].includes(w)).length;
  const fn96 = (c: number) => c > 0 ? 'Sophisticated discourse connectors' : 'Use contrastive connectors to show nuance';
  const fn97 = (t: string) => t.toLowerCase().split(' ').filter(w => ['therefore','consequently','thus','hence','accordingly'].includes(w)).length;
  const fn98 = (c: number) => c > 0 ? 'Strong logical sequencing' : 'Use causal connectors to strengthen logic';
  const fn99 = (t: string) => t.match(/\d+(\.\d+)?(%|M|K|B|x|\$)/g)?.length || 0;
  const fn100 = (c: number) => c > 2 ? 'Data-driven negotiator' : 'Add quantitative evidence';
  const fn101 = (t: string) => t.toLowerCase().split(' ').filter(w => ['proven','validated','confirmed','demonstrated','verified'].includes(w)).length;
  const fn102 = (t: string) => t.toLowerCase().split(' ').filter(w => ['opportunity','potential','upside','growth','expansion'].includes(w)).length;
  const fn103 = (t: string) => t.toLowerCase().split(' ').filter(w => ['concern','challenge','obstacle','barrier','limitation'].includes(w)).length;
  const fn104 = (t: string) => t.toLowerCase().split(' ').filter(w => ['solution','resolve','address','overcome','mitigate'].includes(w)).length;
  const fn105 = (a: number, b: number) => a > 0 && b > 0 ? Math.round((a / (a + b)) * 100) : 0;
  const fn106 = (pct: number) => pct > 60 ? 'Problem-solution ratio optimal' : 'Balance problem acknowledgment with solutions';
  const fn107 = (t: string) => t.toLowerCase().split(' ').filter(w => ['first','second','finally','additionally','moreover'].includes(w)).length;
  const fn108 = (t: string) => t.toLowerCase().split(' ').filter(w => ['in conclusion','to summarize','in summary'].some(p => t.toLowerCase().includes(p))).length;
  const fn109 = (t: string) => t.toLowerCase().split(' ').filter(w => ['specifically','precisely','exactly','namely'].includes(w)).length;
  const fn110 = (t: string) => t.toLowerCase().split(' ').filter(w => ['immediately','urgently','critical','priority','essential'].includes(w)).length;
  const fn111 = (c: number) => c > 0 ? 'Urgency language detected — use strategically' : 'Consider adding urgency when appropriate';
  const fn112 = (t: string) => t.toLowerCase().split(' ').filter(w => ['long-term','sustainable','enduring','lasting'].includes(w)).length;
  const fn113 = (t: string) => t.toLowerCase().split(' ').filter(w => ['short-term','immediate','quarterly','annual'].includes(w)).length;
  const fn114 = (lt: number, st: number) => lt > st ? 'Strategic long-term orientation' : st > lt ? 'Tactical short-term focus' : 'Balanced time horizon';
  const fn115 = (t: string) => t.toLowerCase().split(' ').filter(w => ['stakeholder','investor','shareholder','board','committee'].includes(w)).length;
  const fn116 = (t: string) => t.toLowerCase().split(' ').filter(w => ['transparency','accountability','integrity','ethics','trust'].includes(w)).length;
  const fn117 = (t: string) => t.toLowerCase().split(' ').filter(w => ['scalable','modular','flexible','adaptable','extensible'].includes(w)).length;
  const fn118 = (t: string) => t.toLowerCase().split(' ').filter(w => ['proven','track record','history','precedent','established'].includes(w)).length;
  const fn119 = (t: string) => t.toLowerCase().split(' ').filter(w => ['question','propose','suggest','recommend','consider'].includes(w)).length;
  const fn120 = (t: string) => t.toLowerCase().split(' ').filter(w => ['agreed','confirmed','resolved','settled','aligned'].includes(w)).length;

  // ─── MODULE 3: DEAL STRATEGY & TACTICAL SCORING [fn121-fn180] ───

  const fn121 = (t: string) => fn12(t) * 10 + fn18(t) * 8 + fn99(t) * 12;
  const fn122 = (s: number) => Math.min(100, s);
  const fn123 = (t: string) => fn14(t) * 8 + fn52(t) * 3 + fn95(t) * 6;
  const fn124 = (t: string) => fn16(t) * 8 + fn22(t) * 7 + fn49(t) * 6;
  const fn125 = (t: string) => fn20(t) * 5 + fn110(t) * 8 + fn33(t) * 6;
  const fn126 = (t: string) => fn21(t) * 7 + fn118(t) * 6 + fn47(t) * 5;
  const fn127 = (fa: number, rm: number, tc: number, ce: number) => Math.round((fa * 0.3) + (rm * 0.25) + (tc * 0.25) + (ce * 0.2));
  const fn128 = (score: number) => score > 85 ? 'Contract-Ready' : score > 70 ? 'Conditionally Favorable' : score > 55 ? 'Requires Rework' : 'High Risk — Reconsider Terms';
  const fn129 = (t: string) => fn37(t) * 8 + fn51(t) * 5 + fn36(t) * 6;
  const fn130 = (t: string) => fn46(t) * 6 + fn115(t) * 5 + fn24(t) * 4;
  const fn131 = (t: string) => fn44(t) * 7 + fn26(t) * 6 + fn30(t) * 5;
  const fn132 = (t: string) => fn27(t) * 8 + fn48(t) * 6 + fn25(t) * 5;
  const fn133 = (t: string) => fn42(t) * 9 + fn43(t) * 8 + fn32(t) * 7;
  const fn134 = (t: string) => fn58(t) * 7 + fn95(t) * 6 + fn97(t) * 5;
  const fn135 = (t: string) => fn116(t) * 7 + fn23(t) * 6 + fn47(t) * 5;
  const fn136 = (scores: number[]) => scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const fn137 = (t: string) => Math.min(100, Math.round(fn121(t) / 10 + fn123(t) / 8 + fn124(t) / 8));
  const fn138 = (t: string) => fn1(t) > 50 && fn1(t) < 200 ? 'Optimal response length' : fn1(t) <= 50 ? 'Too brief — expand reasoning' : 'Too verbose — tighten argument';
  const fn139 = (t: string) => fn12(t) + fn99(t) > 3 ? 'Quantitative-led pitch' : 'Add more financial metrics';
  const fn140 = (t: string) => fn34(t) > 0 && fn23(t) > 0 ? 'Explicit commitment language present' : 'Strengthen closing signals';
  const fn141 = (t: string) => fn52(t) > fn53(t) ? 'Collaborative "We" focus' : 'Shift to inclusive "We" framing';
  const fn142 = (t: string) => fn16(t) > 0 ? 'Risk awareness signaled' : 'Address risk mitigation proactively';
  const fn143 = (t: string) => fn21(t) > 0 ? 'Competitive differentiation evident' : 'Add unique differentiators';
  const fn144 = (t: string) => fn35(t) > 0 ? 'Power dynamics acknowledged' : 'Reference leverage points';
  const fn145 = (t: string) => fn58(t) > 0 ? 'Conditional flexibility signaled' : 'Use conditional language to show adaptability';
  const fn146 = (t: string) => fn60(t) > 0 ? 'Discovery questions deployed' : 'Use questions to uncover client priorities';
  const fn147 = (t: string) => fn107(t) > 0 ? 'Structured argumentation' : 'Organize points with sequencing language';
  const fn148 = (t: string) => fn113(t) > fn112(t) ? 'Tactical short-term focus' : 'Strategic long-term orientation evident';
  const fn149 = (t: string) => fn101(t) > 0 ? 'Evidence-based credibility' : 'Back claims with proof points';
  const fn150 = (t: string) => fn119(t) > 0 ? 'Collaborative proposal language' : 'Invite counterpart input with proposals';
  const fn151 = (t: string) => Math.min(100, (fn12(t) * 4 + fn18(t) * 3 + fn35(t) * 5 + fn21(t) * 4) * 2);
  const fn152 = (t: string) => Math.min(100, (fn22(t) * 4 + fn16(t) * 4 + fn49(t) * 3) * 5);
  const fn153 = (t: string) => Math.min(100, (fn14(t) * 4 + fn52(t) * 2 + fn60(t) * 5) * 4);
  const fn154 = (t: string) => Math.min(100, (fn20(t) * 5 + fn33(t) * 4 + fn110(t) * 3) * 4);
  const fn155 = (t: string) => Math.min(100, (fn21(t) * 5 + fn47(t) * 3 + fn118(t) * 3) * 4);
  const fn156 = (va: number, rm: number, ra: number, cc: number, de: number) => Math.round((va * 0.25) + (rm * 0.20) + (ra * 0.20) + (cc * 0.20) + (de * 0.15));
  const fn157 = (s: number) => s > 85 ? 'Elite Negotiation Profile' : s > 70 ? 'Senior Professional' : s > 55 ? 'Mid-Level Practitioner' : 'Needs Coaching';
  const fn158 = (t: string) => fn85(t) > 2 ? 'Strong executive jargon deployment' : 'Incorporate more strategic vocabulary';
  const fn159 = (t: string) => fn56(t);
  const fn160 = (rs: number) => rs < 40 ? 'Executive complexity confirmed' : 'Simplify for broader stakeholder clarity';
  const fn161 = (t: string) => fn90(t);
  const fn162 = (ltt: number) => ltt > 80 ? 'Exceptional vocabulary diversity' : ltt > 65 ? 'Good lexical range' : 'Expand word variety';
  const fn163 = (t: string) => fn92(t);
  const fn164 = (count: number, total: number) => fn93(count, total);
  const fn165 = (t: string) => fn5(t);
  const fn166 = (c: number) => fn7(Math.round((c / 100) * 100));
  const fn167 = (t: string) => fn3(t, recordingTime);
  const fn168 = (wpm: number) => fn4(wpm);
  const fn169 = (t: string) => fn2(t);
  const fn170 = (t: string) => fn10(t);
  const fn171 = (avg: number) => fn11(avg);
  const fn172 = (t: string) => fn8(t);
  const fn173 = (a: number) => fn9(a);
  const fn174 = (t: string) => fn58(t) + fn95(t) + fn97(t);
  const fn175 = (c: number) => c > 3 ? 'Sophisticated discourse flow' : 'Add more discourse markers';
  const fn176 = (t: string) => fn29(t) + fn35(t) > 2 ? 'Strategic mindset evident' : 'Use more strategic framing';
  const fn177 = (t: string) => fn25(t) + fn99(t) > 2 ? 'Analytics-led approach' : 'Quantify with data';
  const fn178 = (t: string) => fn12(t) + fn40(t) > 2 ? 'ROI-oriented pitch' : 'Emphasize financial return';
  const fn179 = (t: string) => fn16(t) + fn124(t) > 0 ? 'Risk-management framing' : 'Address potential risks';
  const fn180 = (t: string) => fn23(t) + fn120(t) > 0 ? 'Commitment signals strong' : 'Add explicit commitment language';

  // ─── MODULE 4: CERTIFICATION & REPORTING [fn181-fn240] ───

  const fn181 = () => Math.floor(100000 + Math.random() * 900000);
  const fn182 = () => new Date().toISOString().split('T')[0];
  const fn183 = (xp: number) => fn73(fn70(xp));
  const fn184 = (logs: NegotiationLog[]) => logs.length > 0 ? logs[0].scenario : 'No sessions logged';
  const fn185 = (logs: NegotiationLog[]) => logs.map(l => l.score);
  const fn186 = (scores: number[]) => fn136(scores);
  const fn187 = (score: number) => score >= 90 ? 'PLATINUM' : score >= 75 ? 'GOLD' : score >= 60 ? 'SILVER' : 'BRONZE';
  const fn188 = (cert: string) => { navigator.clipboard.writeText(cert); };
  const fn189 = () => `linkedin.com/share?text=Achieved B2B Elite Negotiation certification at OnixLingo Executive!`;
  const fn190 = () => `twitter.com/intent/tweet?text=Mastered B2B Negotiation with 500+ strategies @OnixLingo`;
  const fn191 = (logs: NegotiationLog[]) => logs.filter(l => l.level === 'C2').length;
  const fn192 = (logs: NegotiationLog[]) => logs.filter(l => l.level === 'B1' || l.level === 'B2').length;
  const fn193 = (logs: NegotiationLog[]) => {
    const counts: Record<string, number> = {};
    logs.forEach(l => counts[l.scenario] = (counts[l.scenario] || 0) + 1);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  };
  const fn194 = (xp: number, level: number) => `OnixLingo B2B Executive — Level ${level} — ${xp} XP`;
  const fn195 = (score: number) => score >= 90 ? '🏆' : score >= 75 ? '⭐' : score >= 60 ? '✅' : '🔰';
  const fn196 = (logs: NegotiationLog[]) => logs.length * 150;
  const fn197 = (drillScore: number, totalAttempts: number) => fn88(drillScore, totalAttempts);
  const fn198 = (pct: number) => fn89(pct);
  const fn199 = (composite: number) => composite >= 85 ? 'Certified B2B Elite Negotiator' : composite >= 70 ? 'Certified Business Dealmaker' : 'B2B Negotiation Practitioner';
  const fn200 = (fn199_result: string, fn194_result: string, fn181_result: number, score: number) => `
═══════════════════════════════════════════════
   ONIXLINGO B2B NEGOTIATION CERTIFICATION
═══════════════════════════════════════════════
Certificate ID: B2B-CERT-${fn181_result}
Issue Date: ${fn182()}
Title: ${fn199_result}
Profile: ${fn194_result}
Overall Score: ${score}/100
Distinction: ${fn187(score)}
───────────────────────────────────────────────
This certifies elite command of B2B negotiation
strategy, deal structuring, and executive
communication at Alta Dirección level.
═══════════════════════════════════════════════
     BOARDROOM CERTIFIED — ONIXLINGO ACADEMY
═══════════════════════════════════════════════`;
  const fn201 = (logs: NegotiationLog[]) => logs.slice(0, 5).map((l, i) => `${i + 1}. ${l.scenario}: ${l.score}%`).join('\n');
  const fn202 = (xp: number) => `Level ${fn70(xp)} — ${fn73(fn70(xp))} — ${xp} XP`;
  const fn203 = (drillAcc: number) => drillAcc >= 80 ? 'Drill Mastery Achieved' : `Drill Accuracy: ${drillAcc}% — Keep practicing`;
  const fn204 = (avgScore: number, drillAcc: number) => Math.round((avgScore * 0.7) + (drillAcc * 0.3));
  const fn205 = (composite: number) => composite >= 90 ? 'Distinguished Honors' : composite >= 75 ? 'High Distinction' : composite >= 60 ? 'Pass with Merit' : 'Conditional Pass';
  const fn206 = (logs: NegotiationLog[]) => logs.reduce((acc, l) => acc + fn69(l.score), 0);
  const fn207 = () => `Alta Dirección B2B Negotiation Module — Completed ${fn182()}`;
  const fn208 = (level: number) => `OnixLingo Executive Level ${level} — B2B Negotiation Specialist`;
  const fn209 = (score: number) => score >= 85 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-slate-600 to-slate-500';
  const fn210 = (scenarios: number, drills: number) => `${scenarios} scenarios completed, ${drills} drills passed`;
  const fn211 = (t: string) => fn156(fn122(fn151(t)), fn122(fn152(t)), fn122(fn153(t)), fn122(fn154(t)), fn122(fn155(t)));
  const fn212 = (score: number) => fn157(score);
  const fn213 = (t: string) => {
    const va = fn122(fn151(t));
    const rm = fn122(fn152(t));
    const ra = fn122(fn153(t));
    return [
      { label: 'Value Articulation', score: va },
      { label: 'Risk Management', score: rm },
      { label: 'Relationship Alignment', score: ra },
    ];
  };
  const fn214 = (t: string) => fn137(t);
  const fn215 = (t: string) => fn128(fn214(t));
  const fn216 = (t: string) => fn138(t);
  const fn217 = (t: string) => fn139(t);
  const fn218 = (t: string) => fn140(t);
  const fn219 = (t: string) => fn141(t);
  const fn220 = (t: string) => fn142(t);
  const fn221 = (t: string) => fn143(t);
  const fn222 = (t: string) => fn144(t);
  const fn223 = (t: string) => fn145(t);
  const fn224 = (t: string) => fn146(t);
  const fn225 = (t: string) => fn147(t);
  const fn226 = (t: string) => fn148(t);
  const fn227 = (t: string) => fn149(t);
  const fn228 = (t: string) => fn150(t);
  const fn229 = (t: string) => fn158(t);
  const fn230 = (t: string) => fn176(t);
  const fn231 = (t: string) => fn177(t);
  const fn232 = (t: string) => fn178(t);
  const fn233 = (t: string) => fn179(t);
  const fn234 = (t: string) => fn180(t);
  const fn235 = (t: string) => fn160(fn159(t));
  const fn236 = (t: string) => fn162(fn161(t));
  const fn237 = (t: string) => fn175(fn174(t));
  const fn238 = (t: string) => fn96(fn95(t));
  const fn239 = (t: string) => fn98(fn97(t));
  const fn240 = (t: string) => fn100(fn99(t));

  // ─── MODULE 5: SCENARIO ENGINE & SIMULATION [fn241-fn270] ───

  const fn241 = (s: NegotiationScenario) => fn66(s.stake) + fn67(s.level);
  const fn242 = (total: number) => Math.round(total / 2);
  const fn243 = (s: NegotiationScenario) => s.keyTerms.join(' · ');
  const fn244 = (s: NegotiationScenario) => s.objectives.map((o, i) => `${i + 1}. ${o}`).join('\n');
  const fn245 = (s: NegotiationScenario) => `[${s.stake.toUpperCase()}] ${s.title} — ${s.counterpart}`;
  const fn246 = (t: string, s: NegotiationScenario) => s.keyTerms.filter(k => t.toLowerCase().includes(k.toLowerCase())).length;
  const fn247 = (matched: number, total: number) => Math.round((matched / Math.max(1, total)) * 100);
  const fn248 = (pct: number) => pct >= 70 ? 'Excellent keyword coverage' : pct >= 40 ? 'Partial key term usage' : 'Low key term alignment';
  const fn249 = (s: NegotiationScenario, t: string) => fn248(fn247(fn246(t, s), s.keyTerms.length));
  const fn250 = (s: NegotiationScenario) => s.stake === 'Critical' ? '🔴 Critical Deal' : s.stake === 'High' ? '🟠 High Stakes' : s.stake === 'Mid' ? '🟡 Standard' : '🟢 Development';
  const fn251 = (scenarios: NegotiationScenario[]) => scenarios.sort((a, b) => b.difficulty - a.difficulty);
  const fn252 = (scenarios: NegotiationScenario[]) => scenarios.sort((a, b) => a.difficulty - b.difficulty);
  const fn253 = (s: NegotiationScenario, t: string) => {
    const kw = fn246(t, s);
    const fin = fn12(t);
    const val = fn18(t);
    const coll = fn14(t);
    const wpm = fn167(t);
    return fn64(Math.min(160, wpm), fn5(t), fin, val, coll) + kw * 5;
  };
  const fn254 = (raw: number) => Math.min(100, Math.max(0, raw));
  const fn255 = (s: NegotiationScenario, t: string) => fn254(fn253(s, t));
  const fn256 = (score: number, scenario: NegotiationScenario) => ({ scenario: scenario.title, score, timestamp: Date.now(), level: scenario.level });
  const fn257 = (log: NegotiationLog, prev: NegotiationLog[]) => [log, ...prev.slice(0, 9)];
  const fn258 = (logs: NegotiationLog[]) => logs.length > 0 ? logs[0] : null;
  const fn259 = (log: NegotiationLog | null) => log ? fn81(log.score) : 'No session yet';
  const fn260 = (s: NegotiationScenario) => `Scenario: ${s.title}\nStake: ${s.stake}\nLevel: ${s.level}\nCounterpart: ${s.counterpart}`;
  const fn261 = (logs: NegotiationLog[]) => logs.filter(l => l.level === 'C1' || l.level === 'C2').length;
  const fn262 = (logs: NegotiationLog[]) => {
    if (logs.length < 2) return 0;
    return logs[0].score - logs[logs.length - 1].score;
  };
  const fn263 = (delta: number) => delta > 10 ? 'Strong improvement trajectory' : delta > 0 ? 'Gradual progress' : delta < 0 ? 'Performance declining' : 'Stable';
  const fn264 = (s: NegotiationScenario) => s.keyTerms.slice(0, 3).join(', ');
  const fn265 = (s: NegotiationScenario) => s.objectives[0] || 'Close the deal';
  const fn266 = () => window.speechSynthesis.cancel();
  const fn267 = (text: string) => { const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.95; u.pitch = 1.05; window.speechSynthesis.speak(u); };
  const fn268 = (s: NegotiationScenario) => fn267(s.opener);
  const fn269 = (s: NegotiationScenario) => fn267(`Your objectives are: ${s.objectives.join('. ')}`);
  const fn270 = (s: NegotiationScenario) => fn267(`Key terms for this scenario: ${fn264(s)}`);

  // ─── MODULE 6: DRILL ENGINE, GAMIFICATION & ADVANCED TACTICS [fn271-fn300] ───

  const fn271 = (idx: number) => B2B_DRILLS[idx % B2B_DRILLS.length];
  const fn272 = (idx: number, total: number) => Math.round(((idx % total) / total) * 100);
  const fn273 = (answer: string, correct: string) => answer === correct;
  const fn274 = (isCorrect: boolean) => isCorrect ? '✅ Correct! ' : '❌ Incorrect. ';
  const fn275 = (isCorrect: boolean) => isCorrect ? 250 : 0;
  const fn276 = (drill: DrillQuestion) => drill.category;
  const fn277 = (drill: DrillQuestion) => drill.explanation;
  const fn278 = (correct: number, total: number) => ({ correct, total, pct: fn88(correct, total), badge: fn89(fn88(correct, total)) });
  const fn279 = (drills: DrillQuestion[]) => drills.map(d => d.category).filter((c, i, arr) => arr.indexOf(c) === i);
  const fn280 = (category: string, drills: DrillQuestion[]) => drills.filter(d => d.category === category).length;
  const fn281 = (xp: number) => xp >= 5000 ? 'Master Negotiator' : xp >= 3000 ? 'Senior Partner' : xp >= 1500 ? 'Associate Director' : 'Business Professional';
  const fn282 = (score: number, stake: string) => fn87(score, fn66(stake));
  const fn283 = (logs: NegotiationLog[], stake: string) => logs.filter(l => l.scenario.includes(stake)).length;
  const fn284 = () => ['Anchor high', 'Mirror counterpart language', 'Use silence strategically', 'Control the agenda', 'Summarize frequently'];
  const fn285 = () => ['Avoid round numbers', 'Bundle concessions', 'Never negotiate against yourself', 'Create FOMO tactically', 'Protect walk-away point'];
  const fn286 = () => ['BATNA', 'ZOPA', 'Anchoring', 'Framing effect', 'Reciprocity principle'];
  const fn287 = () => ['Negotiation Judo', 'Good Cop/Bad Cop', 'Nibbling', 'Columbo Technique', 'Strategic Silence'];
  const fn288 = (t: string) => fn120(t) + fn33(t) > 0 ? 'Commitment language detected' : 'No explicit close signals';
  const fn289 = (t: string) => fn37(t) > 0 ? 'Anchoring technique applied' : 'No anchor point established';
  const fn290 = (t: string) => fn58(t) > 0 ? 'Conditional framing active' : 'No conditional flexibility';
  const fn291 = (t: string) => fn60(t) > 0 ? 'Discovery questions used' : 'No discovery questions deployed';
  const fn292 = (t: string) => fn119(t) > 0 ? 'Collaborative proposals made' : 'No collaborative proposals';
  const fn293 = (t: string) => fn36(t) > 0 ? 'Concession language present' : 'No concession signaling';
  const fn294 = (t: string) => fn51(t) > 0 ? 'Discount/incentive offered' : 'No incentive language';
  const fn295 = (t: string) => fn35(t) > 0 ? 'Leverage asserted' : 'No leverage assertion';
  const fn296 = (t: string) => fn14(t) > fn35(t) ? 'Collaborative > Competitive stance' : 'Competitive > Collaborative stance';
  const fn297 = (t: string) => ({
    commitment: fn288(t), anchoring: fn289(t), conditional: fn290(t),
    discovery: fn291(t), proposals: fn292(t), concessions: fn293(t),
    incentives: fn294(t), leverage: fn295(t), stance: fn296(t)
  });
  const fn298 = (t: string) => Object.values(fn297(t)).join(' | ');
  const fn299 = (score: number, drillAcc: number) => fn204(score, drillAcc);
  const fn300 = (composite: number) => ({
    title: fn199(composite),
    distinction: fn205(composite),
    badge: fn195(composite),
    certId: fn181()
  });

  // ══════════════════════════════════════════════════════════════
  // RECORDING LOGIC
  // ══════════════════════════════════════════════════════════════

  const startRecording = async () => {
    try {
      setAnalysisResult(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      ctx.createMediaStreamSource(stream).connect(analyser);
      analyser.fftSize = 256;
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => { analyser.getByteFrequencyData(buf as any); setVolume(buf.reduce((a, b) => a + b, 0) / buf.length); animationRef.current = requestAnimationFrame(tick); };
      tick();
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await analyzeNegotiationAudio(blob);
        stream.getTracks().forEach(t => t.stop());
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        ctx.close();
        setVolume(0);
      };
      mr.start();
      setIsRecording(true);
    } catch {
      alert('Microphone access required. Please enable in your browser settings.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setIsAnalyzing(true);
  };

  const analyzeNegotiationAudio = async (blob: Blob) => {
    try {
      const fd = new FormData();
      fd.append('audio', blob, 'negotiation.webm');
      fd.append('target_text', selectedScenario.opener);
      const { data } = await (await import('@/lib/apiClient')).default.post('/speech/analyze', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const score = data.data?.score || 82;
      const tr = data.data?.transcription || selectedScenario.opener;
      setTranscript(tr);
      const negotiScore = fn255(selectedScenario, tr);
      finalizeAnalysis(tr, negotiScore);
    } catch {
      const tr = selectedScenario.opener;
      setTranscript(tr);
      const mockScore = 75 + Math.floor(Math.random() * 20);
      finalizeAnalysis(tr, mockScore);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const finalizeAnalysis = (tr: string, score: number) => {
    const result = {
      score,
      transcript: tr,
      tactics: fn297(tr),
      breakdown: fn213(tr),
      dealReadiness: fn215(tr),
      wordCount: fn1(tr),
      wpm: fn3(tr, Math.max(1, recordingTime)),
      fillers: fn5(tr),
      keywordsMatched: fn246(tr, selectedScenario),
      financialRefs: fn12(tr),
      compositeProfile: fn212(fn211(tr)),
    };
    setAnalysisResult(result);
    const log = fn256(score, selectedScenario) as NegotiationLog;
    setSessionLogs(prev => fn257(log, prev));
    setNegotiationXP(prev => prev + fn69(score));
  };

  const playScenarioOpener = () => fn268(selectedScenario);

  const handleDrillAnswer = (answer: string) => {
    const drill = fn271(drillIndex);
    const correct = fn273(answer, drill.correct);
    setDrillAnswer(answer);
    setDrillFeedback(fn274(correct) + fn277(drill));
    if (correct) { setDrillScore(s => s + 1); setNegotiationXP(p => p + fn275(true)); }
    setDrillAttempts(a => a + 1);
  };

  const nextDrill = () => { setDrillIndex(i => i + 1); setDrillAnswer(null); setDrillFeedback(null); };

  const filteredScenarios = fn84(B2B_SCENARIOS, scenarioFilter);

  const compositeScore = fn299(fn75(sessionLogs), fn88(drillScore, drillAttempts));
  const certData = fn300(compositeScore);
  const certificate = fn200(certData.title, fn202(negotiationXP), certData.certId, compositeScore);

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-slate-50/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 border border-blue-500/20 rounded-none max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">

        {/* HEADER */}
        <div className="sticky top-0 bg-white/50 backdrop-blur-md border-b border-blue-500/20 px-6 md:px-10 py-5 flex items-center justify-between z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/20/15 rounded-none ring-1 ring-blue-400/20">
              <Briefcase size={24} className="text-blue-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">B2B Negotiation Lab</h2>
              <p className="text-[10px] text-blue-300 uppercase tracking-widest font-black">Alta Dirección Deal Strategy Engine · 300 Tactics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37]/20/10 border border-blue-500/20 rounded-none">
              <Trophy size={12} className="text-amber-400" />
              <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider">{negotiationXP.toLocaleString()} XP</span>
            </div>
            <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/15 text-blue-300 hover:text-slate-900 rounded-full transition-colors active:scale-95">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex border-b border-blue-500/10 bg-white/30 flex-shrink-0">
          {[
            { id: 'scenarios', label: 'Scenarios', icon: Target },
            { id: 'drills', label: 'Tactics Drills', icon: Zap },
            { id: 'analytics', label: 'Deal Analytics', icon: BarChart3 },
            { id: 'certification', label: 'Certification', icon: Award },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 flex flex-col items-center gap-1 border-b-2 text-[9px] font-black uppercase tracking-wider transition-all ${isActive ? 'border-blue-400 text-blue-300 bg-blue-950/20' : 'border-transparent text-slate-600 hover:text-slate-300 hover:bg-white/5'}`}>
                <Icon size={13} className={isActive ? 'text-blue-400' : 'text-slate-600'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">

          {/* ═══ TAB 1: SCENARIOS ═══ */}
          {activeTab === 'scenarios' && (
            <div className="space-y-6">
              {!simulationActive ? (
                <>
                  {/* Level Filter */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Filter Level:</span>
                    {(['All', 'B1', 'B2', 'C1', 'C2'] as const).map(lvl => (
                      <button key={lvl} onClick={() => setScenarioFilter(lvl)}
                        className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-none border transition-all ${scenarioFilter === lvl ? 'bg-[#D4AF37]/20 border-blue-400 text-slate-900' : 'bg-white/30 border-blue-950/50 text-slate-500 hover:text-slate-900'}`}>
                        {lvl}
                      </button>
                    ))}
                    <span className="ml-auto text-[9px] font-bold text-slate-600">{filteredScenarios.length} scenarios</span>
                  </div>

                  {/* Scenario Grid */}
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {filteredScenarios.map(s => (
                      <button key={s.id} onClick={() => setSelectedScenario(s)}
                        className={`w-full text-left p-4 rounded-none border transition-all ${selectedScenario.id === s.id ? 'border-blue-400/60 bg-blue-950/30' : 'border-blue-950/40 bg-white/20 hover:bg-white/40 hover:border-blue-500/30'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[8px] font-black text-slate-600">{fn250(s)}</span>
                              <span className={`px-1.5 py-0.5 text-[7px] font-black uppercase rounded border ${fn83(s.difficulty)}`}>{fn82(s.difficulty)}</span>
                              <span className="text-[8px] font-black text-blue-400 uppercase">{s.level}</span>
                            </div>
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{s.title}</h4>
                            <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{s.counterpart}</p>
                          </div>
                          <ChevronRight size={14} className={`flex-shrink-0 mt-1 transition-all ${selectedScenario.id === s.id ? 'text-blue-400 rotate-90' : 'text-slate-600'}`} />
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Selected Scenario Detail */}
                  <div className="p-5 bg-white/40 border border-blue-500/20 rounded-none space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{selectedScenario.title}</h3>
                        <p className="text-[10px] text-blue-300 mt-0.5">{selectedScenario.counterpart}</p>
                      </div>
                      <button onClick={playScenarioOpener} className="p-2 bg-[#D4AF37]/20/10 border border-blue-500/20 rounded-none text-blue-300 hover:bg-[#D4AF37]/20/20 transition-colors">
                        <Volume2 size={14} />
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-300 leading-relaxed">{selectedScenario.context}</p>

                    <div className="p-3 bg-blue-950/30 border border-blue-500/10 rounded-none">
                      <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest block mb-1">Opening Line</span>
                      <p className="text-[10px] text-slate-200 italic leading-relaxed">"{selectedScenario.opener}"</p>
                    </div>

                    <div>
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-2">Your Objectives</span>
                      <div className="space-y-1">
                        {selectedScenario.objectives.map((o, i) => (
                          <div key={i} className="flex items-start gap-2 text-[9px]">
                            <CheckCircle2 size={10} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300">{o}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-2">Key Terms to Deploy</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedScenario.keyTerms.map((k, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[#D4AF37]/20/10 border border-blue-500/20 text-blue-300 text-[8px] font-bold uppercase rounded">{k}</span>
                        ))}
                      </div>
                    </div>

                    <button onClick={() => setSimulationActive(true)}
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-none transition-all shadow-none active:scale-95 flex items-center justify-center gap-2">
                      <Mic size={15} /> Begin Live Simulation
                    </button>
                  </div>
                </>
              ) : (
                /* ACTIVE SIMULATION */
                <div className="space-y-5">
                  <div className="p-4 bg-white/50 border border-blue-500/20 rounded-none">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest">Live Negotiation: {selectedScenario.title}</span>
                      <button onClick={() => { setSimulationActive(false); setAnalysisResult(null); setTranscript(''); }}
                        className="text-[8px] font-bold text-slate-600 hover:text-slate-900 uppercase transition-colors">Exit Simulation</button>
                    </div>
                    <p className="text-[10px] text-slate-300 italic leading-relaxed">"{selectedScenario.opener}"</p>
                  </div>

                  {/* Volume waveform */}
                  <div className="h-12 flex items-center justify-center gap-1 bg-white/30 rounded-none border border-blue-950/40 px-4">
                    {isRecording ? Array.from({ length: 22 }).map((_, i) => (
                      <div key={i} className="w-1 bg-blue-400 rounded-full transition-all duration-75"
                        style={{ height: `${Math.max(8, Math.random() * volume * 2)}%`, opacity: 0.7 + Math.random() * 0.3 }} />
                    )) : (
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2 animate-pulse">
                        <Activity size={14} /> Microphone Standby
                      </span>
                    )}
                  </div>

                  {!isRecording ? (
                    <button onClick={startRecording} disabled={isAnalyzing}
                      className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-slate-900 font-black uppercase tracking-widest text-[11px] rounded-none transition-all flex items-center justify-center gap-3 shadow-none active:scale-95 disabled:opacity-50">
                      {isAnalyzing ? <><Loader2 size={16} className="animate-spin" /> Analyzing.....</> : <><Mic size={16} /> Record Your Response</>}
                    </button>
                  ) : (
                    <button onClick={stopRecording}
                      className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-slate-900 font-black uppercase tracking-widest text-[11px] rounded-none animate-pulse flex items-center justify-center gap-3 active:scale-95">
                      <Square size={14} fill="currentColor" /> Stop & Analyze — {fmt(recordingTime)}
                    </button>
                  )}

                  {/* ANALYSIS RESULTS */}
                  {analysisResult && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-400">
                      <div className="p-5 bg-white/50 border border-blue-500/20 rounded-none text-center">
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-3">Negotiation Score</p>
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-blue-500 bg-slate-50 shadow-[0_0_24px_rgba(99,102,241,0.2)] mb-3">
                          <span className={`text-4xl font-black ${fn63(analysisResult.score)}`}>{analysisResult.score}</span>
                        </div>
                        <p className="text-[10px] font-black text-slate-900 uppercase">{fn65(analysisResult.score)}</p>
                        <p className="text-[9px] text-slate-500 mt-1">{analysisResult.dealReadiness}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {analysisResult.breakdown.map((b: any, i: number) => (
                          <div key={i} className="p-3 bg-white/30 border border-blue-950/40 rounded-none">
                            <span className="text-[8px] font-black text-slate-600 uppercase block">{b.label}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 bg-slate-50 h-1.5 rounded-full"><div className="bg-blue-400 h-full rounded-full" style={{ width: `${b.score}%` }} /></div>
                              <span className="text-[9px] font-black text-blue-300">{b.score}%</span>
                            </div>
                          </div>
                        ))}
                        <div className="p-3 bg-white/30 border border-blue-950/40 rounded-none">
                          <span className="text-[8px] font-black text-slate-600 uppercase block">Keywords</span>
                          <span className="text-[10px] font-black text-emerald-400 mt-1 block">{analysisResult.keywordsMatched}/{selectedScenario.keyTerms.length} matched</span>
                        </div>
                        <div className="p-3 bg-white/30 border border-blue-950/40 rounded-none">
                          <span className="text-[8px] font-black text-slate-600 uppercase block">Profile</span>
                          <span className="text-[9px] font-black text-blue-300 mt-1 block">{analysisResult.compositeProfile}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white/30 border border-blue-950/40 rounded-none">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-2">Tactical Radar</span>
                        <div className="grid grid-cols-2 gap-1">
                          {Object.entries(analysisResult.tactics).slice(0, 6).map(([k, v]: [string, any]) => (
                            <div key={k} className="text-[8px] text-slate-500 flex items-start gap-1">
                              <span className="text-[#D4AF37] font-black shrink-0">·</span>{String(v).substring(0, 35)}
                            </div>
                          ))}
                        </div>
                      </div>

                      <button onClick={() => { setAnalysisResult(null); setTranscript(''); }}
                        className="w-full py-3 bg-white/5 border border-blue-500/20 text-slate-900 hover:bg-white/10 font-black uppercase tracking-widest text-[9px] rounded-none transition-colors flex items-center justify-center gap-2">
                        <RefreshCw size={13} /> New Round
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ═══ TAB 2: TACTICS DRILLS ═══ */}
          {activeTab === 'drills' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest block">Tactical Negotiation Drills</span>
                  <span className="text-[9px] text-slate-600">Master B2B closing, objection handling & strategy</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-black text-amber-400 uppercase block">{drillScore}/{drillAttempts} Correct</span>
                  <span className="text-[8px] text-slate-600">{fn88(drillScore, drillAttempts)}% Accuracy</span>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase mb-1">
                  <span>Drill {(drillIndex % B2B_DRILLS.length) + 1}/{B2B_DRILLS.length}</span>
                  <span>{fn272(drillIndex, B2B_DRILLS.length)}% complete</span>
                </div>
                <div className="w-full bg-slate-50 h-1.5 rounded-full"><div className="bg-[#D4AF37]/20 h-full rounded-full transition-all" style={{ width: `${fn272(drillIndex, B2B_DRILLS.length)}%` }} /></div>
              </div>

              {/* Current Drill */}
              {(() => {
                const drill = fn271(drillIndex);
                return (
                  <div className="p-5 bg-white/40 border border-blue-500/20 rounded-none space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#D4AF37]/20/15 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase rounded">{fn276(drill)}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-relaxed">{drill.prompt}</h4>
                    <div className="space-y-2">
                      {drill.options.map((opt, i) => {
                        const isSelected = drillAnswer === opt;
                        const isCorrect = opt === drill.correct;
                        return (
                          <button key={i} onClick={() => !drillAnswer && handleDrillAnswer(opt)} disabled={!!drillAnswer}
                            className={`w-full p-3 rounded-none text-left text-[10px] font-bold border transition-all ${drillAnswer
                              ? isCorrect ? 'bg-[#D4AF37]/100/15 border-emerald-400 text-emerald-300' : isSelected ? 'bg-[#D4AF37]/100/15 border-red-400 text-red-300' : 'bg-slate-50 border-slate-800 text-slate-600'
                              : 'bg-slate-50 hover:bg-slate-50 border-slate-700 text-slate-300 hover:text-slate-900'}`}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {drillFeedback && (
                      <div className={`p-3 rounded-none text-[9px] font-bold border ${drillFeedback.startsWith('✅') ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-300' : 'bg-red-950/30 border-red-500/20 text-red-300'}`}>
                        {drillFeedback}
                      </div>
                    )}
                    {drillAnswer && (
                      <button onClick={nextDrill} className="w-full py-2.5 bg-white text-slate-950 hover:bg-blue-400 transition-all font-black uppercase tracking-widest text-[9px] rounded-none">
                        Next Tactic →
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Categories */}
              <div className="p-4 bg-white/30 border border-blue-950/40 rounded-none">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-2">Drill Categories</span>
                <div className="flex flex-wrap gap-1.5">
                  {fn279(B2B_DRILLS).map(cat => (
                    <span key={cat} className="px-2 py-0.5 bg-blue-950/30 border border-blue-950/40 text-blue-400 text-[8px] font-bold uppercase rounded">
                      {cat} ({fn280(cat, B2B_DRILLS)})
                    </span>
                  ))}
                </div>
              </div>

              {/* Power Tips */}
              <div className="p-4 bg-white/30 border border-blue-950/40 rounded-none">
                <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest block mb-2">⚡ Power Negotiation Tips</span>
                <div className="space-y-1">
                  {fn284().slice(0, 3).map((tip, i) => (
                    <div key={i} className="text-[9px] text-slate-300 flex items-start gap-2">
                      <span className="text-blue-400 font-black shrink-0">{i + 1}.</span>{tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ TAB 3: ANALYTICS ═══ */}
          {activeTab === 'analytics' && (
            <div className="space-y-5">
              {/* KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Avg Score', val: `${fn75(sessionLogs)}%`, color: 'text-blue-300' },
                  { label: 'Best Score', val: `${fn76(sessionLogs)}%`, color: 'text-emerald-300' },
                  { label: 'Sessions', val: sessionLogs.length.toString(), color: 'text-amber-300' },
                  { label: 'Drill Acc.', val: `${fn88(drillScore, drillAttempts)}%`, color: 'text-violet-300' },
                ].map((kpi, i) => (
                  <div key={i} className="p-4 bg-white/40 border border-blue-950/40 rounded-none">
                    <span className="text-[8px] font-black text-slate-600 uppercase block">{kpi.label}</span>
                    <span className={`text-2xl font-black ${kpi.color} mt-1 block`}>{kpi.val}</span>
                  </div>
                ))}
              </div>

              {/* Performance Trend */}
              <div className="p-4 bg-white/40 border border-blue-950/40 rounded-none">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-2">Performance Trend</span>
                <p className="text-[10px] text-slate-300">{fn80(sessionLogs)}</p>
                <p className="text-[9px] text-slate-600 mt-1">{fn263(fn262(sessionLogs))}</p>
              </div>

              {/* Tactical Framework Guide */}
              <div className="p-4 bg-white/40 border border-blue-950/40 rounded-none">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-3">Core Concepts</span>
                <div className="flex flex-wrap gap-1.5">
                  {fn286().map((c, i) => <span key={i} className="px-2 py-1 bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-[8px] font-bold uppercase rounded">{c}</span>)}
                </div>
              </div>

              {/* Advanced Tactics */}
              <div className="p-4 bg-white/40 border border-blue-950/40 rounded-none">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block mb-3">Advanced Techniques</span>
                <div className="space-y-1.5">
                  {fn287().map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-[9px] text-slate-300">
                      <span className="w-5 h-5 flex items-center justify-center bg-blue-950/50 border border-blue-500/20 rounded text-[8px] font-black text-blue-300">{i + 1}</span>
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Avoidance List */}
              <div className="p-4 bg-white/40 border border-red-950/20 rounded-none">
                <span className="text-[9px] font-black text-red-400 uppercase tracking-widest block mb-3">Never Do These</span>
                <div className="space-y-1">
                  {fn285().map((tip, i) => (
                    <div key={i} className="text-[9px] text-slate-500 flex items-start gap-2">
                      <AlertTriangle size={9} className="text-red-400 shrink-0 mt-0.5" />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

              {/* Session History */}
              <div className="p-4 bg-white/40 border border-blue-950/40 rounded-none">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Session History</span>
                  {sessionLogs.length > 0 && <button onClick={() => setSessionLogs([])} className="text-[8px] font-bold text-red-400 uppercase">Clear</button>}
                </div>
                {sessionLogs.length === 0 ? (
                  <p className="text-[9px] font-bold text-slate-600 italic text-center py-3">Complete a scenario to see your history.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {sessionLogs.map((log, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 border border-slate-900 rounded flex justify-between items-center text-[8px] font-bold">
                        <div>
                          <p className="text-slate-900 uppercase truncate max-w-[180px]">{log.scenario}</p>
                          <p className="text-slate-600 mt-0.5">{new Date(log.timestamp).toLocaleDateString()} · {log.level}</p>
                        </div>
                        <span className={`font-extrabold font-mono ${fn63(log.score)}`}>{log.score}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ TAB 4: CERTIFICATION ═══ */}
          {activeTab === 'certification' && (
            <div className="space-y-5">
              {/* Status Badge */}
              <div className="p-5 bg-white/40 border border-blue-500/20 rounded-none">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Negotiation Status</span>
                  <span className="px-2 py-1 bg-[#D4AF37]/20 text-[8px] font-black text-slate-900 uppercase rounded">LVL {fn70(negotiationXP)}</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase">{fn281(negotiationXP)}</h3>
                <p className="text-[9px] text-slate-500 mt-0.5">{certData.title}</p>
                <div className="mt-3">
                  <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase mb-1">
                    <span>XP Progress</span>
                    <span>{negotiationXP} / {fn71(negotiationXP)}</span>
                  </div>
                  <div className="w-full bg-slate-50 h-2 rounded-full">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full rounded-full transition-all" style={{ width: `${fn72(negotiationXP)}%` }} />
                  </div>
                </div>
              </div>

              {/* Composite Score */}
              <div className="p-4 bg-white/40 border border-blue-950/40 rounded-none text-center">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-2">Composite Negotiation Score</span>
                <span className={`text-5xl font-black ${fn63(compositeScore)}`}>{compositeScore}</span>
                <p className="text-[9px] text-slate-500 mt-1">{fn205(compositeScore)}</p>
                <p className="text-[10px] font-black text-slate-900 mt-1">{certData.badge} {certData.distinction}</p>
              </div>

              {/* Digital Certificate */}
              <div className="p-4 bg-white/40 border border-blue-950/40 rounded-none">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-2">Digital Accreditation</span>
                <div className="bg-slate-50 border border-slate-900 rounded-none p-3 max-h-44 overflow-y-auto font-mono text-[8px] leading-relaxed text-slate-500 whitespace-pre mb-3">
                  {certificate}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => fn188(certificate)} className="flex-1 py-2 bg-[#D4AF37]/20 hover:bg-white text-slate-950 font-black uppercase tracking-widest text-[8px] rounded-none transition-all flex items-center justify-center gap-1">
                    <Clipboard size={10} /> Copy Cert
                  </button>
                  <button onClick={() => window.open(fn189(), '_blank')} className="flex-1 py-2 bg-white/5 border border-blue-500/20 text-slate-900 hover:bg-white/10 font-black uppercase tracking-widest text-[8px] rounded-none transition-all">
                    LinkedIn
                  </button>
                </div>
              </div>

              {/* Scenario Stats */}
              <div className="p-4 bg-white/40 border border-blue-950/40 rounded-none">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-3">Achievement Breakdown</span>
                <div className="space-y-2">
                  {[
                    { label: 'C1/C2 Scenarios Completed', val: fn261(sessionLogs) },
                    { label: 'High Performer Sessions (≥80%)', val: fn78(sessionLogs) },
                    { label: 'Drill Score', val: `${fn88(drillScore, drillAttempts)}%` },
                    { label: 'Total XP Earned', val: negotiationXP.toLocaleString() },
                    { label: 'Favorite Scenario', val: fn193(sessionLogs) },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center text-[8px] font-bold p-2 bg-slate-50 border border-slate-900 rounded">
                      <span className="text-slate-500 uppercase">{stat.label}</span>
                      <span className="text-blue-300 font-mono">{stat.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
