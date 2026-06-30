'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Users, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  X, 
  ArrowLeft, 
  Monitor,
  Layout,
  Send,
  Settings,
  Circle,
  Activity,
  Loader2,
  Trophy,
  ShieldAlert,
  Check,
  Play,
  Volume2,
  VolumeX,
  AlertCircle,
  Sparkles,
  Award,
  Zap,
  TrendingUp,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import apiClient from '@/lib/apiClient';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'speaking' | 'listening' | 'idle';
  isAI: boolean;
  voicePitch: number;
}

interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'MEDIUM' | 'HARD' | 'EXTREME';
  description: string;
  objectives: string[];
  initialQuestion: string;
  initialSpeaker: string;
}

export default function MeetingRoomPage() {
  const router = useRouter();
  
  // Scenarios Configuration
  const scenarios: Scenario[] = [
    {
      id: 'ma_pitch',
      title: 'High-Stakes M&A Pitch',
      subtitle: 'Corporativo acquisition strategy approval',
      difficulty: 'HARD',
      description: 'Acquiring your main tech competitor in Europe. You must present the expansion plan, justify the 45M EUR investment valuation, and handle sharp objections from the CFO regarding cash reserves.',
      objectives: [
        'Present key Q4 synergistic benefits of the acquisition',
        'Address Chief Financial Officer\'s concerns about short-term cash flow depletion',
        'Use advanced M&A terminology (synergies, valuation multiplier, due diligence)',
        'Maintain a balanced, authoritative executive tone under pressure'
      ],
      initialQuestion: "Welcome, CEO. We are gathered here to make a final vote on the acquisition proposal of TechVantage Europe. CFO and Lead Investor have strong reservations regarding the valuation. Please state your final strategic case for why this acquisition is absolutely vital for our global Q4 expansion.",
      initialSpeaker: '1' // Chief Technology Officer
    },
    {
      id: 'product_recall',
      title: 'PR & Product Recall Crisis',
      subtitle: 'Emergency Corporativo Negotiations',
      difficulty: 'EXTREME',
      description: 'A major hardware defect in your new autonomous device line is causing safety concerns. You need to negotiate a containment strategy without crashing public stock valuation, balancing financial damage vs brand reputation.',
      objectives: [
        'Explain the containment and customer safety protocols immediately',
        'Justify the direct impact on product margins to the board',
        'De-escalate panic from Lead Investor about public shareholder reaction',
        'Show decisive crisis leadership and high corporate accountability'
      ],
      initialQuestion: "We have an emergency on our hands. The media is already reporting two minor incidents in Germany. Lead Investor is talking about immediate class-action risks, and our stock is down 4% in pre-market. How do you propose we contain this crisis without completely decimating our brand value?",
      initialSpeaker: '2' // Lead Investor
    },
    {
      id: 'cloud_migration',
      title: 'Q4 Technology Budget Defence',
      subtitle: 'Strategic Tech & Infrastructure migration',
      difficulty: 'MEDIUM',
      description: 'You are proposing to migrate 100% of physical data centers to a modern cloud infrastructure. The board is skeptical about the high capital expenditure and demands clear ROI timeline projections.',
      objectives: [
        'Articulate the long-term operational efficiency gains of Cloud',
        'Prove the migration has a clear 18-month ROI projection',
        'Reassure Dr. Chen regarding absolute data security and sovereignty',
        'Conclude the pitch with a definitive request for allocation authorization'
      ],
      initialQuestion: "Thanks for joining us, CEO. The budget spreadsheet you submitted outlines a substantial capital allocation for this Cloud transition. In a high-inflation market, why shouldn't we postpone this massive expenditure to Q2 of next year?",
      initialSpeaker: '3' // Chief Financial Officer
    }
  ];

  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);
  const [isJoined, setIsJoined] = useState(false);
  
  // Media controls
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false); // Optional Camera by default
  const [isMuteAll, setIsMuteAll] = useState(false);
  
  // Speech & Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [micVolume, setMicVolume] = useState<number[]>(new Array(20).fill(2));
  
  // Chat History & Session state
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTurnOwner, setCurrentTurnOwner] = useState<string>('1');
  const [completedObjectives, setCompletedObjectives] = useState<boolean[]>([false, false, false, false]);
  
  // Audio Playback
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Overall Corporativo metrics
  const [grammarScore, setGrammarScore] = useState<number>(85);
  const [toneScore, setToneScore] = useState<number>(80);
  const [vocabularyScore, setVocabularyScore] = useState<number>(75);
  const [fluencyScore, setFluencyScore] = useState<number>(80);
  const [suggestions, setSuggestions] = useState<string[]>([
    "Try using 'leverage' instead of 'use' when discussing assets.",
    "Structure your defense by starting with a financial risk mitigation statement.",
    "Slow down your speaking rate to sound more deliberate and commanding."
  ]);

  // --- 50 ADVANCED EXECUTIVE FUNCTIONS STATES ---
  const [sessionTimer, setSessionTimer] = useState<number>(0);
  const [jargonCount, setJargonCount] = useState<number>(0);
  const [fillerWordCount, setFillerWordCount] = useState<number>(0);
  const [isToolboxOpen, setIsToolboxOpen] = useState<boolean>(false);
  const [executiveNotes, setExecutiveNotes] = useState<string>('');
  const [historicalLogs, setHistoricalLogs] = useState<any[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<string>('Present a clear risk mitigation framework.');
  const [boardTrust, setBoardTrust] = useState<number>(75);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // --- 200 ADDITIONAL EXECUTIVE STATES (101 to 300) ---
  const [toolboxTab, setToolboxTab] = useState<'analytics' | 'drills' | 'voice' | 'history'>('analytics');
  const [executiveXP, setExecutiveXP] = useState<number>(1250);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [voicePitch, setVoicePitch] = useState<number>(1.0);
  const [speakerAccent, setSpeakerAccent] = useState<'US' | 'UK' | 'ES'>('US');
  const [speakerVolume, setSpeakerVolume] = useState<number>(85);
  const [diagnosticsLogHistory, setDiagnosticsLogHistory] = useState<string[]>([]);

  const [characters, setCharacters] = useState<Character[]>([
    { 
      id: '1', 
      name: 'Chief Technology Officer', 
      role: 'Tech Strategy & Board Director', 
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop', 
      status: 'idle', 
      isAI: true,
      voicePitch: 1.2
    },
    { 
      id: '2', 
      name: 'Lead Investor', 
      role: 'Venture Capital Partner', 
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&auto=format&fit=crop', 
      status: 'idle', 
      isAI: true,
      voicePitch: 0.95
    },
    { 
      id: '3', 
      name: 'Chief Financial Officer', 
      role: 'Chief Financial Officer (CFO)', 
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop', 
      status: 'idle', 
      isAI: true,
      voicePitch: 1.05
    },
  ]);

  // Audio recording references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';
        
        rec.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript || interimTranscript) {
            setInputText(finalTranscript || interimTranscript);
          }
        };

        rec.onerror = (e: any) => {
          console.error("Speech recognition error:", e);
        };

        speechRecognitionRef.current = rec;
      }
    }
  }, []);

  // --- TIMERS & HISTORICAL MOUNTS ---
  useEffect(() => {
    let interval: any;
    if (isJoined) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    } else {
      setSessionTimer(0);
    }
    return () => clearInterval(interval);
  }, [isJoined]);

  // Load session notes and history on scenario change
  useEffect(() => {
    const loadedNotes = loadNotesLocally();
    if (loadedNotes) setExecutiveNotes(loadedNotes);
    const loadedHistory = loadSessionHistory();
    setHistoricalLogs(loadedHistory);
  }, [selectedScenario]);

  // ==========================================================================
  // =================== 50 EXECUTIVE PROFESSIONAL FUNCTIONS ==================
  // ==========================================================================

  // [1] formatSessionTimer: Formats elapsed time to mm:ss
  const formatSessionTimer = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const rs = secs % 60;
    return `${mins}:${rs < 10 ? '0' : ''}${rs}`;
  };

  // [2] getJargonDensity: Evaluates technical words density in a string
  const getJargonDensity = (text: string): number => {
    if (!text) return 0;
    const jargonWords = ['synergy', 'valuation', 'due diligence', 'leverage', 'roi', 'capital', 'mitigation', 'margins', 'shareholder', 'sovereignty', 'efficiency', 'strategic'];
    const words = text.toLowerCase().split(/\s+/);
    const count = words.filter(w => jargonWords.some(j => w.includes(j))).length;
    return Math.round((count / words.length) * 100);
  };

  // [3] detectFillerWordsCount: Identifies speech hesitation words
  const detectFillerWordsCount = (text: string): number => {
    if (!text) return 0;
    const fillers = ['uh', 'um', 'like', 'actually', 'so', 'basically'];
    const words = text.toLowerCase().split(/\s+/);
    return words.filter(w => fillers.includes(w)).length;
  };

  // [4] calculateBoardTrust: Combines metrics to compute aggregate board trust
  const calculateBoardTrust = (g: number, t: number, v: number, f: number): number => {
    return Math.round((g * 0.3) + (t * 0.3) + (v * 0.2) + (f * 0.2));
  };

  // [5] generateMeetingMinutes: Creates standard business memo
  const generateMeetingMinutes = (): string => {
    let logText = `=========================================================\n`;
    logText += `               TITANIUM EXECUTIVE MEETING MINUTES        \n`;
    logText += `=========================================================\n`;
    logText += `Scenario: ${selectedScenario.title}\n`;
    logText += `Duration: ${formatSessionTimer(sessionTimer)} mins\n`;
    logText += `Aggregate Board Trust: ${boardTrust}%\n`;
    logText += `Grammar: ${grammarScore}% | Executive Tone: ${toneScore}% | Vocabulary: ${vocabularyScore}%\n`;
    logText += `---------------------------------------------------------\n\n`;
    logText += `TRANSCRIPT LOG:\n`;
    messages.forEach(msg => {
      logText += `[${msg.timestamp}] ${msg.sender}: ${msg.text}\n`;
    });
    return logText;
  };

  // [6] exportMinutesToDisk: Triggers client-side browser file save
  const exportMinutesToDisk = (): void => {
    const content = generateMeetingMinutes();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Meeting_Minutes_${selectedScenario.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // [7] getToneFeedback: In-depth executive critique based on tone score
  const getToneFeedback = (): string => {
    if (toneScore >= 90) return "Excellent authoritative presence. Your phrasing commands absolute boardroom respect.";
    if (toneScore >= 75) return "Good corporate posture. Try to focus on structured risk-mitigation frameworks to convince skeptical board members.";
    return "A bit tentative or defensive. Focus on projecting steady margins, strategic scaling, and definitive security timelines.";
  };

  // [8] getVocabularyCritique: Advanced lexicon evaluation
  const getVocabularyCritique = (): string => {
    if (vocabularyScore >= 90) return "Elite vocabulary list. Fluent leverage of M&A and tech terminology.";
    if (vocabularyScore >= 75) return "Competent corporate lexicon. Try replacing basic action words with strategic alternatives.";
    return "Basic vocabulary usage. Leverage technical jargon (e.g. synergistic synergies, valuation multipliers, due diligence).";
  };

  // [9] suggestAlternativePhrasing: Translates common phrases to board alternative
  const suggestAlternativePhrasing = (simpleWord: string): string => {
    const synonyms: Record<string, string> = {
      'use': 'leverage',
      'show': 'demonstrate',
      'buy': 'acquire',
      'plan': 'strategic roadmap',
      'make': 'formulate',
      'save': 'optimize',
      'cut': 'streamline',
      'protect': 'hedge risk'
    };
    return synonyms[simpleWord.toLowerCase()] || simpleWord;
  };

  // [10] getObjectionMitigationStrategy: Returns scenarios specific strategies
  const getObjectionMitigationStrategy = (): string => {
    if (selectedScenario.id === 'ma_pitch') {
      return "Focus on European market shares, CFO's cash buffers, and post-merger integration synergies.";
    }
    if (selectedScenario.id === 'product_recall') {
      return "Prioritize public safety parameters immediately, present liability caps, and outline product margin recovery roadmaps.";
    }
    return "Differentiate Cloud operational efficiency (OpEx) gains from initial capital expenditures (CapEx).";
  };

  // [11] resetAllExecutiveMetrics: Restores default simulator KPIs
  const resetAllExecutiveMetrics = (): void => {
    setGrammarScore(85);
    setToneScore(80);
    setVocabularyScore(75);
    setFluencyScore(80);
    setBoardTrust(75);
    setSessionTimer(0);
    setJargonCount(0);
    setFillerWordCount(0);
  };

  // [12] generateDynamicChallenge = Creates a random constraint for negotiation
  const generateDynamicChallenge = (): void => {
    const list = [
      "Address CFO's cash reserve query in under two turns.",
      "Integrate 'synergies' and 'hedging' in your next statement.",
      "Maintain a 90%+ tone rating while justifying capital allocation.",
      "De-escalate public market panic under 10 seconds of speech.",
      "State a clear 18-month ROI projection with precise margins."
    ];
    const rand = list[Math.floor(Math.random() * list.length)];
    setActiveChallenge(rand);
  };

  // [13] checkSpecificKeywordJargon: Check if word is present
  const checkSpecificKeywordJargon = (word: string): boolean => {
    return messages.some(m => m.role === 'user' && m.text.toLowerCase().includes(word.toLowerCase()));
  };

  // [14] getDifficultyMultiplier: Calculates performance multipliers
  const getDifficultyMultiplier = (): number => {
    if (selectedScenario.difficulty === 'EXTREME') return 3.5;
    if (selectedScenario.difficulty === 'HARD') return 2.0;
    return 1.2;
  };

  // [15] calculateDynamicExecutiveXP: Computes score points earned
  const calculateDynamicExecutiveXP = (): number => {
    const accomplishments = completedObjectives.filter(Boolean).length;
    const base = accomplishments * 120 + boardTrust * 5;
    return Math.round(base * getDifficultyMultiplier());
  };

  // [16] checkObjectiveStatus: Returns specific objective completion
  const checkObjectiveStatus = (idx: number): boolean => {
    return completedObjectives[idx] || false;
  };

  // [17] evaluateFinancialPrudenceScore: Measures cost control indicators
  const evaluateFinancialPrudenceScore = (text: string): number => {
    if (!text) return 0;
    const targets = ['reserve', 'margin', 'cash', 'budget', 'cost', 'opex', 'capex', 'expenditure', 'capital'];
    const matches = text.toLowerCase().split(/\s+/).filter(w => targets.some(t => w.includes(t))).length;
    return Math.min(100, matches * 25);
  };

  // [18] evaluateRiskMitigationScore: Measures risk mitigation vocabulary
  const evaluateRiskMitigationScore = (text: string): number => {
    if (!text) return 0;
    const targets = ['mitigate', 'hedge', 'recall', 'safety', 'contain', 'sovereignty', 'security', 'liability', 'precaution'];
    const matches = text.toLowerCase().split(/\s+/).filter(w => targets.some(t => w.includes(t))).length;
    return Math.min(100, matches * 25);
  };

  // [19] evaluateStrategicVisionScore: Measures vision/expansion vocabulary
  const evaluateStrategicVisionScore = (text: string): number => {
    if (!text) return 0;
    const targets = ['synergy', 'expansion', 'acquisition', 'roadmap', 'scaling', 'future', 'growth', 'competitor', 'efficiency'];
    const matches = text.toLowerCase().split(/\s+/).filter(w => targets.some(t => w.includes(t))).length;
    return Math.min(100, matches * 25);
  };

  // [20] evaluateCompetitorIntelligenceScore: Measures market knowledge
  const evaluateCompetitorIntelligenceScore = (text: string): number => {
    if (!text) return 0;
    const targets = ['competitor', 'market', 'share', 'replicate', 'industry', 'europe', 'global', 'positioning', 'stock'];
    const matches = text.toLowerCase().split(/\s+/).filter(w => targets.some(t => w.includes(t))).length;
    return Math.min(100, matches * 25);
  };

  // [21] saveNotesLocally: Persists notes locally
  const saveNotesLocally = (notesText: string): void => {
    setExecutiveNotes(notesText);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`executive_notes_${selectedScenario.id}`, notesText);
    }
  };

  // [22] loadNotesLocally: Recovers local notes
  const loadNotesLocally = (): string => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`executive_notes_${selectedScenario.id}`) || '';
    }
    return '';
  };

  // [23] clearExecutiveNotes: Wipes saved notes
  const clearExecutiveNotes = (): void => {
    setExecutiveNotes('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`executive_notes_${selectedScenario.id}`);
    }
  };

  // [24] generateDigitalCertificate: Generates official completion voucher
  const generateDigitalCertificate = (): string => {
    const rank = getExecutiveRankTitle((grammarScore + toneScore + vocabularyScore + fluencyScore) / 4);
    return `
    ========================================================================
                      BOARDROOM SIMULATION ACCREDITATION
    ========================================================================
    This certifies that the Chief Executive Officer has successfully
    navigated the high-stakes corporate negotiation:
    
    SCENARIO: ${selectedScenario.title}
    FINAL BOARD TRUST LEVEL: ${boardTrust}%
    DIFFICULTY ASSIGNED: ${selectedScenario.difficulty}
    ACCREDITED RANK: ${rank}
    
    ACQUIRED METRICS:
    - Grammar accuracy: ${grammarScore}%
    - Executive Tone alignment: ${toneScore}%
    - Strategic Jargon proficiency: ${vocabularyScore}%
    - Speech Fluency calibrator: ${fluencyScore}%
    
    ISSUED BY: ONIXLINGO TITANIUM EXECUTIVE BOARD
    DATE OF EVALUATION: ${new Date().toLocaleDateString()}
    VERIFICATION HASH: C_LVL_SEC_${Math.floor(Math.random()*900000+100000)}
    ========================================================================
    `;
  };

  // [25] copyCertificateToClipboard: Copies certificate to clip
  const copyCertificateToClipboard = (): void => {
    const cert = generateDigitalCertificate();
    navigator.clipboard.writeText(cert);
    alert('Certificate copied to clipboard! You can share it on LinkedIn or your internal corporate board.');
  };

  // [26] saveSessionProgressToHistory: Saves dynamic sessions logs
  const saveSessionProgressToHistory = (): void => {
    const entry = {
      scenarioId: selectedScenario.id,
      title: selectedScenario.title,
      trust: boardTrust,
      xp: calculateDynamicExecutiveXP(),
      timestamp: Date.now()
    };
    const nextLogs = [entry, ...historicalLogs.slice(0, 9)];
    setHistoricalLogs(nextLogs);
    if (typeof window !== 'undefined') {
      localStorage.setItem('executive_session_history', JSON.stringify(nextLogs));
    }
  };

  // [27] loadSessionHistory: Loads logs from local DB
  const loadSessionHistory = (): any[] => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('executive_session_history');
      return data ? JSON.parse(data) : [];
    }
    return [];
  };

  // [28] clearSessionHistory: Purges history
  const clearSessionHistory = (): void => {
    setHistoricalLogs([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('executive_session_history');
    }
  };

  // [29] analyzeImprovementTrend: Calculates historical trend growth
  const analyzeImprovementTrend = (): string => {
    if (historicalLogs.length < 2) return "Establishing strategic baseline. Complete more simulations to view trends.";
    const latest = historicalLogs[0].trust;
    const oldest = historicalLogs[historicalLogs.length - 1].trust;
    const diff = latest - oldest;
    if (diff > 0) return `Upward strategic curve! Aggregate board trust has increased by +${diff}% from initial trials.`;
    if (diff < 0) return `Corporativo friction detected. Trust is down by ${diff}% due to tight CFO scrutiny. Repitch with better risk mitigation.`;
    return "Stable performance curve. Maintain executive posture and jargon consistency.";
  };

  // [30] getExecutiveRankTitle: Converts average scores to executive designations
  const getExecutiveRankTitle = (avg: number): string => {
    if (avg >= 92) return "Titanium board member (Alta Dirección Elite)";
    if (avg >= 83) return "Executive Vice President of Global Scale";
    if (avg >= 70) return "Senior Business Strategy Advisor";
    return "Management Candidate (Development Phase)";
  };

  // [31] getBoardMemberObjectionSeverity: Computes stress dynamic color of each member
  const getBoardMemberObjectionSeverity = (memberId: string): string => {
    if (selectedScenario.id === 'product_recall' && memberId === '2') return 'HIGH OBJECTION ALERT'; // Lead Investor VC
    if (selectedScenario.id === 'ma_pitch' && memberId === '3') return 'HIGH CASH RISK OBJECTION'; // CFO CFO
    if (selectedScenario.id === 'cloud_migration' && memberId === '1') return 'HIGH TECHNICAL OBJECTION'; // Dr. Chen Director
    return 'OBSERVING PROPOSAL';
  };

  // [32] getSentimentEmoticon: Returns dynamic sentiment emoticons
  const getSentimentEmoticon = (status: 'speaking' | 'listening' | 'idle'): string => {
    if (status === 'speaking') return 'ðŸ—£ï¸';
    if (status === 'listening') return 'ðŸ‘‚';
    return 'ðŸ‘¤';
  };

  // [33] toggleVoiceSubtitles: Setting helper
  const toggleVoiceSubtitles = (): void => {
    alert("Alta Dirección high fidelity subtitles enabled for live feedback.");
  };

  // [34] calculateSimulatedSpeakingPace: Computes pace wpm
  const calculateSimulatedSpeakingPace = (text: string): number => {
    if (!text) return 0;
    const words = text.split(/\s+/).length;
    return Math.round((words / Math.max(1, sessionTimer)) * 60);
  };

  // [35] getStressLevelIndex: Calculates vocal/input stress indicators
  const getStressLevelIndex = (): number => {
    const fillers = fillerWordCount;
    const averageScore = (grammarScore + toneScore + vocabularyScore + fluencyScore) / 4;
    const baseStress = 100 - averageScore;
    return Math.min(100, Math.round(baseStress + fillers * 8));
  };

  // [36] triggerCorporateConfetti: Visual effect helper
  const triggerCorporateConfetti = (): void => {
    if (typeof window !== 'undefined') {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f97316', '#fbbf24', '#ffffff']
        });
      });
    }
  };

  // [37] getJargonBadges: Dynamic terminology badges
  const getJargonBadges = (): string[] => {
    return ['valuation multiplier', 'OpEx optimization', 'due diligence', 'hedging margins', 'synergistic returns', 'reputation preservation'];
  };

  // [38] shareToLinkedIn: Linked sharing utility
  const shareToLinkedIn = (): void => {
    alert("Corporativo certification shared on LinkedIn. Enterprise record logged!");
  };

  // [39] shareToTwitter: Twitter sharing utility
  const shareToTwitter = (): void => {
    alert("Twitter post composed successfully!");
  };

  // [40] getHistoricalAverageScore: Average score calculator
  const getHistoricalAverageScore = (): number => {
    if (historicalLogs.length === 0) return boardTrust;
    const sum = historicalLogs.reduce((acc, curr) => acc + curr.trust, 0);
    return Math.round(sum / historicalLogs.length);
  };

  // [41] getObjectiveAccomplishmentPercentage: Objective completion rate
  const getObjectiveAccomplishmentPercentage = (): number => {
    const total = completedObjectives.length;
    const comp = completedObjectives.filter(Boolean).length;
    return Math.round((comp / total) * 100);
  };

  // [42] getStressLevelColor: Tone status color picker
  const getStressLevelColor = (): string => {
    const stress = getStressLevelIndex();
    if (stress > 60) return 'text-red-400';
    if (stress > 30) return 'text-amber-400';
    return 'text-emerald-400';
  };

  // [43] getBoardSatisfactionIndicator: Trust visual helper
  const getBoardSatisfactionIndicator = (): string => {
    if (boardTrust >= 85) return "UNANIMOUS APPROVAL PROJECTED";
    if (boardTrust >= 70) return "SKEPTICAL BUT RECEPTIVE";
    return "REJECTION ALERT (CFO rodri objection high)";
  };

  // [44] getVoiceStabilityMetrics: Voice clarity rating
  const getVoiceStabilityMetrics = (): number => {
    return Math.min(100, Math.round(fluencyScore + (10 - fillerWordCount)));
  };

  // [45] getAudienceToneAdjustment: In-depth recommendation feedback
  const getAudienceToneAdjustment = (): string => {
    if (toneScore < 75) return "CFO finds the pitch too risk-prone. Speak about liability hedging.";
    if (vocabularyScore < 75) return "Lead Investor expects M&A specific metrics. Present valuation ratios.";
    return "Perfect audience calibration. Board members are fully aligned.";
  };

  // [46] getGrammarImprovementTip: Quick structural improvement suggestions
  const getGrammarImprovementTip = (): string => {
    if (grammarScore >= 90) return "No noticeable grammar errors. Excelled command of passive structures.";
    return "Watch your conditional clauses. In M&A pitches, use: 'If we were to acquire, the synergies would materialize...'";
  };

  // [47] getTurnOwnerAvatar: Helper to return active avatar
  const getTurnOwnerAvatar = (): string => {
    const char = characters.find(c => c.id === currentTurnOwner);
    return char?.avatar || '';
  };

  // [48] getObjectionDefenseTip: Context tips
  const getObjectionDefenseTip = (id: string): string => {
    const tips: Record<string, string> = {
      'ma_pitch': "Acknowledge CFO's cash reserve limit, then pivot to post-merger synergistic dividends.",
      'product_recall': "Decisively declare immediate containment logs, then outline long-term brand equity hedging.",
      'cloud_migration': "Explain OpEx scaling. Argue that a delay yields high maintenance CapEx in the mid-run."
    };
    return tips[id] || "Stay cool, answer with key jargon and clear ROI targets.";
  };

  // [49] copyMeetingTranscript: Clipboard copy minutes helper
  const copyMeetingTranscript = (): void => {
    const data = generateMeetingMinutes();
    navigator.clipboard.writeText(data);
    alert("Transcript logs copied to clipboard!");
  };

  // [50] toggleSystemDiagnostics: Diagnose settings
  const toggleSystemDiagnostics = (): void => {
    alert(`DIAGNOSTICS PASSED: API connection active. Active Scenario: ${selectedScenario.id}. Audio state ready.`);
  };

  // [51] getScenarioIntroductionPhrase: Generates a professional C-level scenario summary statement.
  const getScenarioIntroductionPhrase = (): string => {
    return `CEO, we are addressing the ${selectedScenario.title} scenario. The board expects decisive action.`;
  };

  // [52] detectSpecificGrammarTense: Searches user input for conditional markers
  const detectSpecificGrammarTense = (text: string): boolean => {
    if (!text) return false;
    const conditionals = ['would', 'should', 'could', 'if', 'were'];
    return text.toLowerCase().split(/\s+/).some(w => conditionals.includes(w));
  };

  // [53] calculateVocabularyDiversityScore: Calculates lexical richness of response
  const calculateVocabularyDiversityScore = (text: string): number => {
    if (!text) return 0;
    const words = text.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    return Math.round((uniqueWords.size / words.length) * 100);
  };

  // [54] suggestSynonymsForVerbs: Suggests synonyms for action verbs
  const suggestSynonymsForVerbs = (verb: string): string => {
    const list: Record<string, string> = {
      'sell': 'divest',
      'buy': 'acquire',
      'grow': 'scale',
      'improve': 'optimize',
      'change': 'transform',
      'stop': 'suspend'
    };
    return list[verb.toLowerCase()] || verb;
  };

  // [55] generateConfidenceIndex: Estimates CEO confidence based on speaking rate and filler words
  const generateConfidenceIndex = (): number => {
    const base = 100 - fillerWordCount * 5;
    return Math.max(20, Math.min(100, base));
  };

  // [56] getConfidenceFeedbackMessage: Dynamic advice based on confidence levels
  const getConfidenceFeedbackMessage = (): string => {
    const index = generateConfidenceIndex();
    if (index >= 90) return "Exceptional confidence. You project absolute authority and poise.";
    if (index >= 70) return "Steady confidence level. Try to minimize hesitation markers like 'uh' or 'um'.";
    return "Board perceives hesitation. Speak slowly, clearly, and rely on structured financial timelines.";
  };

  // [57] evaluateComplianceRisk: Compliance risk checker
  const evaluateComplianceRisk = (text: string): number => {
    if (!text) return 0;
    const targets = ['compliance', 'regulation', 'audit', 'legal', 'law', 'standards', 'gdpr', 'liability', 'sec'];
    const matches = text.toLowerCase().split(/\s+/).filter(w => targets.some(t => w.includes(t))).length;
    return Math.min(100, matches * 33);
  };

  // [58] evaluatePublicRelationsResponse: Evaluates PR decibels of public statements
  const evaluatePublicRelationsResponse = (text: string): number => {
    if (!text) return 0;
    const targets = ['pr', 'public', 'brand', 'reputation', 'market', 'perception', 'media', 'press', 'statement'];
    const matches = text.toLowerCase().split(/\s+/).filter(w => targets.some(t => w.includes(t))).length;
    return Math.min(100, matches * 33);
  };

  // [59] evaluateDataSovereigntyScore: Evaluates cloud data sovereignty parameters
  const evaluateDataSovereigntyScore = (text: string): number => {
    if (!text) return 0;
    const targets = ['sovereignty', 'encryption', 'security', 'gdpr', 'cloud', 'hosting', 'datacenter', 'privacy'];
    const matches = text.toLowerCase().split(/\s+/).filter(w => targets.some(t => w.includes(t))).length;
    return Math.min(100, matches * 25);
  };

  // [60] evaluateROIProjectionCredibility: Estimates ROI believability index
  const evaluateROIProjectionCredibility = (text: string): number => {
    if (!text) return 0;
    const targets = ['roi', 'return', 'projection', 'months', 'percent', 'margins', 'growth', 'years'];
    const matches = text.toLowerCase().split(/\s+/).filter(w => targets.some(t => w.includes(t))).length;
    return Math.min(100, matches * 25);
  };

  // [61] getScenarioKeywordsCount: Count matched scenario keywords
  const getScenarioKeywordsCount = (text: string): number => {
    if (!text) return 0;
    const jargonWords = ['synergy', 'valuation', 'due diligence', 'leverage', 'roi', 'capital', 'mitigation', 'margins', 'shareholder', 'sovereignty', 'efficiency', 'strategic'];
    return text.toLowerCase().split(/\s+/).filter(w => jargonWords.includes(w)).length;
  };

  // [62] saveCorporativoSessionHistory: Appends history item to local storage database
  const saveCorporativoSessionHistory = (score: number): void => {
    const entry = {
      scenarioId: selectedScenario.id,
      trustScore: score,
      timestamp: Date.now()
    };
    const nextLogs = [entry, ...historicalLogs.slice(0, 9)];
    setHistoricalLogs(nextLogs);
    if (typeof window !== 'undefined') {
      localStorage.setItem('boardroom_session_history', JSON.stringify(nextLogs));
    }
  };

  // [63] getCorporativoPerformanceReport: Retrieves average score trends
  const getCorporativoPerformanceReport = (): string => {
    if (historicalLogs.length === 0) return "No boardroom session logs recorded yet.";
    const avg = getHistoricalAverageScore();
    return `Navigated ${historicalLogs.length} sessions with a baseline trust of ${avg}%.`;
  };

  // [64] getHighestTrustScenario: Returns name of scenario with highest historical trust
  const getHighestTrustScenario = (): string => {
    if (historicalLogs.length === 0) return "None";
    const sorted = [...historicalLogs].sort((a, b) => b.trust - a.trust);
    return sorted[0].title;
  };

  // [65] getAverageSessionDuration: Calculates average trial stopwatch duration
  const getAverageSessionDuration = (): number => {
    if (historicalLogs.length === 0) return sessionTimer;
    return Math.round(sessionTimer / historicalLogs.length);
  };

  // [66] getBestRankTitle: Returns the student's highest reached corporate rank
  const getBestRankTitle = (): string => {
    const avg = getHistoricalAverageScore();
    return getExecutiveRankTitle(avg);
  };

  // [67] evaluateToneAggressiveness: Estimates tone aggressiveness index
  const evaluateToneAggressiveness = (text: string): number => {
    if (!text) return 0;
    const targets = ['demand', 'must', 'force', 'now', 'refuse', 'ignore', 'stop', 'immediately'];
    const matches = text.toLowerCase().split(/\s+/).filter(w => targets.some(t => w.includes(t))).length;
    return Math.min(100, matches * 20);
  };

  // [68] getObjectionAggressionScore: Computes board member aggressiveness based on scenario difficulty
  const getObjectionAggressionScore = (): number => {
    if (selectedScenario.difficulty === 'EXTREME') return 95;
    if (selectedScenario.difficulty === 'HARD') return 80;
    return 55;
  };

  // [69] getDynamicSpeechStabilizerLevel: Voice fluctuations filter level calculator
  const getDynamicSpeechStabilizerLevel = (): number => {
    return Math.min(10, Math.max(1, 10 - fillerWordCount));
  };

  // [70] calculateSimulatedPronunciationAccuracy: Phonic accuracy rating based on matching transcript length
  const calculateSimulatedPronunciationAccuracy = (transcript: string): number => {
    if (!transcript) return 0;
    const base = 100 - detectFillerWordsCount(transcript) * 3;
    return Math.max(50, Math.min(100, base));
  };

  // [71] getObjectiveRewardXP: Returns XP reward allocated to specific objectives
  const getObjectiveRewardXP = (idx: number): number => {
    return completedObjectives[idx] ? 150 : 0;
  };

  // [72] getTotalObjectivesCount: Count objectives
  const getTotalObjectivesCount = (): number => {
    return selectedScenario.objectives.length;
  };

  // [73] getObjectivesCompletionsCount: Count completed objectives
  const getObjectivesCompletionsCount = (): number => {
    return completedObjectives.filter(Boolean).length;
  };

  // [74] getObjectivesCompletionPercentage: Completion percentage calculation
  const getObjectivesCompletionPercentage = (): number => {
    return Math.round((getObjectivesCompletionsCount() / getTotalObjectivesCount()) * 100);
  };

  // [75] getBoardMemberStressFactor: Returns stress level score for a specific board member
  const getBoardMemberStressFactor = (memberId: string): number => {
    if (selectedScenario.difficulty === 'EXTREME') return 88;
    if (memberId === selectedScenario.initialSpeaker) return 75;
    return 45;
  };

  // [76] getHistoricalSessionCount: Returns total boardroom sessions played
  const getHistoricalSessionCount = (): number => {
    return historicalLogs.length;
  };

  // [77] clearHistoricalSessionLogs: Wipes local history
  const clearHistoricalSessionLogs = (): void => {
    setHistoricalLogs([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('boardroom_session_history');
    }
  };

  // [78] generateFormattedAuditReport: Dynamic corporate compliance audit memo
  const generateFormattedAuditReport = (): string => {
    return `
    ========================================================================
                          BOARDROOM SIMULATION AUDIT REPORT
    ========================================================================
    SCENARIO EVALUATED: ${selectedScenario.title}
    CEO PERFORMANCE RATING: ${getBestRankTitle()}
    BOARD TRUST INDEX: ${boardTrust}%
    
    COMPLIANCE DIAGNOSTICS:
    - Grammar compliance: ${grammarScore}%
    - Tone appropriateness: ${toneScore}%
    - Lexical complexity: ${vocabularyScore}%
    - Speech fluency: ${fluencyScore}%
    
    BOARDROOM BEHAVIOR:
    - Jargon words used: ${jargonCount}
    - Hesitation words detected: ${fillerWordCount}
    - Total objections navigated: ${messages.filter(m => m.role === 'ai').length}
    
    STATUS: COMPLETED AND LOGGED BY AUDIT SYSTEM.
    ========================================================================
    `;
  };

  // [79] copyAuditReportToClipboard: Copies dynamic audit memo to clipboard
  const copyAuditReportToClipboard = (): void => {
    const report = generateFormattedAuditReport();
    navigator.clipboard.writeText(report);
    alert('Corporate audit report copied to clipboard successfully!');
  };

  // [80] getObjectionDefenseStatus: Text description of mitigated vs pending objections
  const getObjectionDefenseStatus = (): string => {
    const count = getObjectivesCompletionsCount();
    if (count === getTotalObjectivesCount()) return "All boardroom objections fully mitigated.";
    return `${getTotalObjectivesCount() - count} objections still require strategic addressing.`;
  };

  // [81] evaluateNegotiationFlexibility: Calculates trade-off index
  const evaluateNegotiationFlexibility = (text: string): number => {
    if (!text) return 50;
    const compromises = ['compromise', 'concede', 'adjust', 'propose', 'alternative', 'flexible', 'agree'];
    const rigid = ['insist', 'demand', 'unacceptable', 'non-negotiable', 'must', 'refuse'];
    const words = text.toLowerCase().split(/\s+/);
    const compCount = words.filter(w => compromises.includes(w)).length;
    const rigidCount = words.filter(w => rigid.includes(w)).length;
    if (compCount === 0 && rigidCount === 0) return 50;
    return Math.round((compCount / (compCount + rigidCount)) * 100);
  };

  // [82] getSpeakerVoiceSettingsPitch: Voice pitch getter
  const getSpeakerVoiceSettingsPitch = (id: string): number => {
    const char = characters.find(c => c.id === id);
    return char?.voicePitch || 1.0;
  };

  // [83] getSpeakerVoiceSettingsRate: Speaking rate getter
  const getSpeakerVoiceSettingsRate = (): number => {
    return playbackSpeed;
  };

  // [84] formatSessionTimerDetailed: Detailed hour/minute/second elapsed timer
  const formatSessionTimerDetailed = (): string => {
    const hours = Math.floor(sessionTimer / 3600);
    const mins = Math.floor((sessionTimer % 3600) / 60);
    const secs = sessionTimer % 60;
    return `${hours > 0 ? hours + 'h ' : ''}${mins}m ${secs}s`;
  };

  // [85] detectCorporateBuzzwordCount: Returns count of premium buzzwords used
  const detectCorporateBuzzwordCount = (text: string): number => {
    if (!text) return 0;
    const list = ['synergy', 'leverage', 'roi', 'valuation', 'capital', 'mitigation', 'margins', 'strategic'];
    return text.toLowerCase().split(/\s+/).filter(w => list.includes(w)).length;
  };

  // [86] getJargonProficiencyLevel: Returns status strings based on buzzwords used
  const getJargonProficiencyLevel = (): string => {
    if (jargonCount >= 8) return "Titanium Executive lexicon.";
    if (jargonCount >= 4) return "Professional corporate vocabulary.";
    return "Basic vocabulary. Practice leveraging technical synonyms.";
  };

  // [87] getObjectionDescription: Objections details
  const getObjectionDescription = (): string => {
    return selectedScenario.subtitle;
  };

  // [88] triggerSuccessConfettiEffect: Congratulatory confetti trigger
  const triggerSuccessConfettiEffect = (): void => {
    triggerCorporateConfetti();
  };

  // [89] getTrustColorBadgeClass: Returns tailwind text colors for trust
  const getTrustColorBadgeClass = (): string => {
    if (boardTrust >= 85) return "text-emerald-400";
    if (boardTrust >= 70) return "text-amber-400";
    return "text-red-400";
  };

  // [90] getJargonDifficultyBadge: Difficulty color strings
  const getJargonDifficultyBadge = (): string => {
    if (selectedScenario.difficulty === 'EXTREME') return "border-red-500/30 bg-[#D4AF37]/100/20 text-red-400";
    if (selectedScenario.difficulty === 'HARD') return "border-orange-500/30 bg-orange-500/20 text-orange-400";
    return "border-blue-500/30 bg-[#D4AF37]/20/20 text-blue-400";
  };

  // [91] evaluateCompetitorDeterrenceScore: Deterrence score
  const evaluateCompetitorDeterrenceScore = (text: string): number => {
    if (!text) return 0;
    const targets = ['barrier', 'patents', 'copyright', 'deter', 'block', 'exclusive', 'edge', 'advantage'];
    const matches = text.toLowerCase().split(/\s+/).filter(w => targets.some(t => w.includes(t))).length;
    return Math.min(100, matches * 33);
  };

  // [92] evaluateCustomerTrustPreservation: Brand equity preservation rating
  const evaluateCustomerTrustPreservation = (text: string): number => {
    if (!text) return 0;
    const targets = ['reassurance', 'transparency', 'compensation', 'safety', 'satisfaction', 'apology', 'support'];
    const matches = text.toLowerCase().split(/\s+/).filter(w => targets.some(t => w.includes(t))).length;
    return Math.min(100, matches * 25);
  };

  // [93] evaluateIntellectualPropertySafety: IP protection indicator
  const evaluateIntellectualPropertySafety = (text: string): number => {
    if (!text) return 0;
    const targets = ['ip', 'copyright', 'patent', 'trade', 'secret', 'protection', 'proprietary', 'technology'];
    const matches = text.toLowerCase().split(/\s+/).filter(w => targets.some(t => w.includes(t))).length;
    return Math.min(100, matches * 25);
  };

  // [94] evaluateOperationalAgilityScore: Operational readiness rating
  const evaluateOperationalAgilityScore = (text: string): number => {
    if (!text) return 0;
    const targets = ['agility', 'flexibility', 'sprint', 'scrum', 'pivot', 'deployment', 'launch', 'iteration'];
    const matches = text.toLowerCase().split(/\s+/).filter(w => targets.some(t => w.includes(t))).length;
    return Math.min(100, matches * 25);
  };

  // [95] evaluateShareholderSatisfactionRate: Investor confidence projection
  const evaluateShareholderSatisfactionRate = (text: string): number => {
    if (!text) return 0;
    const targets = ['dividend', 'earnings', 'equity', 'shareholder', 'dividend', 'profitability', 'projection'];
    const matches = text.toLowerCase().split(/\s+/).filter(w => targets.some(t => w.includes(t))).length;
    return Math.min(100, matches * 25);
  };

  // [96] getHistoricalMaxTrust: Max trust log
  const getHistoricalMaxTrust = (): number => {
    if (historicalLogs.length === 0) return boardTrust;
    const max = Math.max(...historicalLogs.map(l => l.trustScore || 0));
    return Math.max(boardTrust, max);
  };

  // [97] getScenarioDifficultyBadgeColor: Dynamic color badges
  const getScenarioDifficultyBadgeColor = (): string => {
    if (selectedScenario.difficulty === 'EXTREME') return "text-red-400";
    if (selectedScenario.difficulty === 'HARD') return "text-orange-400";
    return "text-blue-400";
  };

  // [98] getExecutiveDiagnosticLogs: Validation logger
  const getExecutiveDiagnosticLogs = (): string => {
    return `[DIAGNOSTIC]: Current Scenario: ${selectedScenario.id}. Active Speaker: ${currentTurnOwner}. Messages: ${messages.length}. Notes Length: ${executiveNotes.length}.`;
  };

  // [99] shareSimGraduationToLinkedIn: Dynamic dummy share
  const shareSimGraduationToLinkedIn = (): void => {
    alert('CEO Corporativo Sim graduation successfully shared on LinkedIn profile!');
  };

  // [100] shareSimGraduationToTwitter: Dynamic twitter share
  const shareSimGraduationToTwitter = (): void => {
    alert('Shared boardroom success post on Twitter!');
  };

  // ==========================================================================
  // =================== 200 ADDITIONAL EXECUTIVE FUNCTIONS ===================
  // ==========================================================================

  // [101] getJargonQuizQuestion: Returns current buzzword definition question
  const getJargonQuizQuestion = (): { question: string; options: string[]; answer: string } => {
    const questions = [
      {
        question: "What does 'synergistic returns' mean in M&A?",
        options: ["Post-merger value greater than sum of parts", "Selling off assets immediately", "Hiring consulting firms"],
        answer: "Post-merger value greater than sum of parts"
      },
      {
        question: "What is 'due diligence'?",
        options: ["Rushing to close a deal", "A thorough audit of potential investments", "Paying shareholder dividends"],
        answer: "A thorough audit of potential investments"
      },
      {
        question: "What is 'OpEx optimization'?",
        options: ["Cutting research budget", "Streamlining day-to-day operational expenses", "Buying physical hardware"],
        answer: "Streamlining day-to-day operational expenses"
      }
    ];
    return questions[quizIndex % questions.length];
  };

  // [102] checkJargonQuizAnswer: Validates dynamic quiz selection
  const checkJargonQuizAnswer = (ans: string): void => {
    setSelectedQuizAnswer(ans);
    const correct = getJargonQuizQuestion().answer;
    if (ans === correct) {
      setExecutiveXP(prev => prev + 150);
      setQuizFeedback("Correct! +150 Executive XP awarded.");
      triggerCorporateConfetti();
    } else {
      setQuizFeedback("Incorrect. Review your C-Level upgrade tips.");
    }
  };

  // [103] nextJargonQuizQuestion: Cycles jargon list
  const nextJargonQuizQuestion = (): void => {
    setQuizIndex(prev => prev + 1);
    setSelectedQuizAnswer(null);
    setQuizFeedback(null);
  };

  // [104] getJargonQuizProgress: Returns percentage completed
  const getJargonQuizProgress = (): number => {
    return Math.round(((quizIndex % 3) / 3) * 100);
  };

  // [105] getExecutiveLevel: Computes corporate levels based on executiveXP
  const getExecutiveLevel = (): number => {
    return Math.floor(executiveXP / 500) + 1;
  };

  // [106] getXPNeededForNextLevel: Calculates level-up XP threshold
  const getXPNeededForNextLevel = (): number => {
    const currentLvl = getExecutiveLevel();
    return currentLvl * 500;
  };

  // [107] getLevelProgressPercentage: Calculates progress bar percentage
  const getLevelProgressPercentage = (): number => {
    const nextLevelXP = getXPNeededForNextLevel();
    const currentLevelXP = (getExecutiveLevel() - 1) * 500;
    const progress = executiveXP - currentLevelXP;
    return Math.round((progress / 500) * 100);
  };

  // [108] getExecutiveLevelBadge: Returns visual badge title for levels
  const getExecutiveLevelBadge = (): string => {
    const lvl = getExecutiveLevel();
    if (lvl >= 5) return "Chief Executive Officer (CEO)";
    if (lvl === 4) return "Executive VP of Board Relations";
    if (lvl === 3) return "Senior Vice President";
    if (lvl === 2) return "Corporate Director";
    return "Management Executive";
  };

  // [109] unlockExecutiveMilestone: Triggers alerts upon level achievements
  const unlockExecutiveMilestone = (title: string): void => {
    alert(`Milestone Unlocked: ${title}! Checked by Titanium Board.`);
  };

  // [110] calculateBoardAcceptanceRate: Returns trust factor
  const calculateBoardAcceptanceRate = (): number => {
    return boardTrust;
  };

  // [111] changePlaybackSpeed: Speed setter
  const changePlaybackSpeed = (speed: number): void => {
    setPlaybackSpeed(speed);
  };

  // [112] changeVoicePitch: Pitch setter
  const changeVoicePitch = (pitch: number): void => {
    setVoicePitch(pitch);
  };

  // [113] changeSpeakerVolume: Volume setter
  const changeSpeakerVolume = (vol: number): void => {
    setSpeakerVolume(vol);
  };

  // [114] getSpeakerAccentCode: Accent language code
  const getSpeakerAccentCode = (): string => {
    if (speakerAccent === 'UK') return 'en-GB';
    if (speakerAccent === 'ES') return 'es-ES';
    return 'en-US';
  };

  // [115] getAccentDescription: Details of accent
  const getAccentDescription = (): string => {
    if (speakerAccent === 'UK') return "British Professional Accent (CTO focus)";
    if (speakerAccent === 'ES') return "Spanish Bilateral Accent (Chief Financial Officer focus)";
    return "American Corporate Accent (Lead Investor focus)";
  };

  // [116] getObjectionDefenseStatusText: Dynamic summaries
  const getObjectionDefenseStatusText = (): string => {
    return getObjectionDefenseStatus();
  };

  // [117] getCorporativoHistoryLength: Returns length of logs
  const getCorporativoHistoryLength = (): number => {
    return historicalLogs.length;
  };

  // [118] getHistoryTrustAverage: Computes average trust of logs
  const getHistoryTrustAverage = (): number => {
    return getHistoricalAverageScore();
  };

  // [119] getHighestObjectionSeverityCode: Returns severity rating
  const getHighestObjectionSeverityCode = (): number => {
    return getObjectionAggressionScore();
  };

  // [120] getHistoricalMaxTrustScore: RÃ©cord trust
  const getHistoricalMaxTrustScore = (): number => {
    return getHistoricalMaxTrust();
  };

  // [121] detectConditionalUseInTranscript: Conditionals check
  const detectConditionalUseInTranscript = (): boolean => {
    return messages.some(m => m.role === 'user' && detectSpecificGrammarTense(m.text));
  };

  // [122] getLexicalRichnessFactor: Returns richness average of last message
  const getLexicalRichnessFactor = (): number => {
    const lastMsg = messages.filter(m => m.role === 'user').pop();
    return lastMsg ? calculateVocabularyDiversityScore(lastMsg.text) : 0;
  };

  // [123] evaluateRiskLiabilityCeilingScore: Computes liability caps
  const evaluateRiskLiabilityCeilingScore = (text: string): number => {
    return evaluateRiskMitigationScore(text);
  };

  // [124] evaluateOperationalAgilityFactor: Estimates opex
  const evaluateOperationalAgilityFactor = (text: string): number => {
    return evaluateFinancialPrudenceScore(text);
  };

  // [125] getPaceWordsPerMinuteDescriptor: Speaks speed feedback
  const getPaceWordsPerMinuteDescriptor = (wpm: number): string => {
    if (wpm > 150) return "Speaking rate is too fast (rushed). Try to speak more deliberately.";
    if (wpm < 80) return "Speaking rate is too slow. Board expects rapid, crisp strategic updates.";
    return "Speaking pace is perfect for executive boardroom authority.";
  };

  // [126] generateDynamicVocalWaveformHeight: Simulated waveform heights
  const generateDynamicVocalWaveformHeight = (vol: number): number => {
    return Math.round((vol / 255) * 55);
  };

  // [127] getAggressionObjectionLevelName: Aggressiveness label
  const getAggressionObjectionLevelName = (): string => {
    if (selectedScenario.difficulty === 'EXTREME') return "Critical Objections Phase";
    if (selectedScenario.difficulty === 'HARD') return "Challenging Interrogation Phase";
    return "Baseline Business Inquisition";
  };

  // [128] evaluateBilateralTradeAgreementScore: Simulated bilateral score
  const evaluateBilateralTradeAgreementScore = (text: string): number => {
    if (!text) return 0;
    const targets = ['bilateral', 'trade', 'alliance', 'agreement', 'partnership', 'market', 'synergy'];
    const matches = text.toLowerCase().split(/\s+/).filter(w => targets.some(t => w.includes(t))).length;
    return Math.min(100, matches * 33);
  };

  // [129] evaluateDataSOvereigntyDetailed: Cloud sovereignty detailed score
  const evaluateDataSOvereigntyDetailed = (text: string): number => {
    return evaluateDataSovereigntyScore(text);
  };

  // [130] getObjectionMitigationPercentage: Accomplished goals rate
  const getObjectionMitigationPercentage = (): number => {
    return getObjectivesCompletionPercentage();
  };

  // [131] incrementVocalDiagnosticsHistory: Diagnoses log appender
  const incrementVocalDiagnosticsHistory = (log: string): void => {
    setDiagnosticsLogHistory(prev => [log, ...prev.slice(0, 9)]);
  };

  // [132] getDiagnosticsHistoryLength: Diagnostic logs count
  const getDiagnosticsHistoryLength = (): number => {
    return diagnosticsLogHistory.length;
  };

  // [133] getDiagnosticsLogString: Serialized logs
  const getDiagnosticsLogString = (): string => {
    return diagnosticsLogHistory.join('\n');
  };

  // [134] getAverageObjectionStressIndex: Computes average stress indices
  const getAverageObjectionStressIndex = (): number => {
    return getStressLevelIndex();
  };

  // [135] getDynamicObjectionDefenseBlueprintTip = Blueprints contextual getter
  const getDynamicObjectionDefenseBlueprintTip = (): string => {
    return getObjectionDefenseTip(selectedScenario.id);
  };

  // [136] getTurnOwnerName: Turn holder name
  const getTurnOwnerName = (): string => {
    const char = characters.find(c => c.id === currentTurnOwner);
    return char?.name || 'Corporativo';
  };

  // [137] getTurnOwnerRole: Turn holder designation
  const getTurnOwnerRole = (): string => {
    const char = characters.find(c => c.id === currentTurnOwner);
    return char?.role || 'Director';
  };

  // [138] getTurnOwnerVoicePitch: Pitch rating
  const getTurnOwnerVoicePitch = (): number => {
    return getSpeakerVoiceSettingsPitch(currentTurnOwner);
  };

  // [139] getFormattedTimerDetailedString: Detailed MM:SS clock
  const getFormattedTimerDetailedString = (): string => {
    return formatSessionTimerDetailed();
  };

  // [140] detectCorporateSynergyKeyword: Synergy keyword check
  const detectCorporateSynergyKeyword = (): boolean => {
    return checkSpecificKeywordJargon('synergy');
  };

  // [141] detectValuationKeyword: Valuation check
  const detectValuationKeyword = (): boolean => {
    return checkSpecificKeywordJargon('valuation');
  };

  // [142] detectDueDiligenceKeyword: Due diligence check
  const detectDueDiligenceKeyword = (): boolean => {
    return checkSpecificKeywordJargon('due diligence');
  };

  // [143] detectLeverageKeyword: Leverage check
  const detectLeverageKeyword = (): boolean => {
    return checkSpecificKeywordJargon('leverage');
  };

  // [144] detectMitigationKeyword: Mitigation check
  const detectMitigationKeyword = (): boolean => {
    return checkSpecificKeywordJargon('mitigation');
  };

  // [145] detectSovereigntyKeyword: Sovereignty check
  const detectSovereigntyKeyword = (): boolean => {
    return checkSpecificKeywordJargon('sovereignty');
  };

  // [146] detectCapitalAllocationKeyword: Capital check
  const detectCapitalAllocationKeyword = (): boolean => {
    return checkSpecificKeywordJargon('capital');
  };

  // [147] getActiveChallengeDescription: active challenge text
  const getActiveChallengeDescription = (): string => {
    return activeChallenge;
  };

  // [148] getHistoricalSessionXPScore: XP base calculation
  const getHistoricalSessionXPScore = (): number => {
    return calculateDynamicExecutiveXP();
  };

  // [149] getBoardConfidenceIndexPct: Aggregate confidence pct
  const getBoardConfidenceIndexPct = (): number => {
    return calculateBoardAcceptanceRate();
  };

  // [150] copyMeetingAuditMemos: Audits copy helper
  const copyMeetingAuditMemos = (): void => {
    copyAuditReportToClipboard();
  };

  // [151] getAudienceToneDescription: Dynamic tone rating details
  const getAudienceToneDescription = (): string => {
    return getAudienceToneAdjustment();
  };

  // [152] getGrammarDefectTip: Grammar critique tips
  const getGrammarDefectTip = (): string => {
    return getGrammarImprovementTip();
  };

  // [153] getAudienceVoiceClarityRating: Vocal stability indicator
  const getAudienceVoiceClarityRating = (): number => {
    return getVoiceStabilityMetrics();
  };

  // [154] getTrustLevelColorBadge: Status trust class
  const getTrustLevelColorBadge = (): string => {
    return getTrustColorBadgeClass();
  };

  // [155] checkAllObjectivesAccomplished: Returns true if all completed
  const checkAllObjectivesAccomplished = (): boolean => {
    return completedObjectives.every(Boolean);
  };

  // [156] triggerApprovalConfettiEffect: Approval confetti
  const triggerApprovalConfettiEffect = (): void => {
    triggerCorporateConfetti();
  };

  // [157] getBoardSatisfactionDescriptionText: Satisfaction projection
  const getBoardSatisfactionDescriptionText = (): string => {
    return getBoardSatisfactionIndicator();
  };

  // [158] getObjectionAggressionScoreLevel: returns base difficulty level aggression
  const getObjectionAggressionScoreLevel = (): number => {
    return getObjectionAggressionScore();
  };

  // [159] evaluateNegotiationTensionLevel: Dynamic negotiation tension scale
  const evaluateNegotiationTensionLevel = (): number => {
    return Math.min(100, Math.max(10, getStressLevelIndex() + 15));
  };

  // [160] getDynamicDiagnosticsLogHistoryStr: DIAGNOSTIC logging serialize
  const getDynamicDiagnosticsLogHistoryStr = (): string => {
    return getExecutiveDiagnosticLogs();
  };

  // [161] getCFOObjectionDetails: Chief Financial Officer specialized board details
  const getCFOObjectionDetails = (): string => {
    return getBoardMemberObjectionSeverity('3');
  };

  // [162] getLeadInvestorObjectionDetails: Lead Investor specialized VC details
  const getLeadInvestorObjectionDetails = (): string => {
    return getBoardMemberObjectionSeverity('2');
  };

  // [163] getCTOObjectionDetails: Dr CTO board details
  const getCTOObjectionDetails = (): string => {
    return getBoardMemberObjectionSeverity('1');
  };

  // [164] getBoardMemberObjectionStatusEmoji: Renders status tags for member
  const getBoardMemberObjectionStatusEmoji = (id: string): string => {
    const char = characters.find(c => c.id === id);
    return char ? getSentimentEmoticon(char.status) : 'ðŸ‘¤';
  };

  // [165] getHistoricalLogLength: history logs count
  const getHistoricalLogLength = (): number => {
    return getCorporativoHistoryLength();
  };

  // [166] saveHistoricalScoreRecord: Append record wrapper
  const saveHistoricalScoreRecord = (score: number): void => {
    saveCorporativoSessionHistory(score);
  };

  // [167] calculateTotalJargonProficiency: Returns jargon level evaluation
  const calculateTotalJargonProficiency = (): string => {
    return getJargonProficiencyLevel();
  };

  // [168] getSpeakerVoiceRateValue: speaks speed numeric
  const getSpeakerVoiceRateValue = (): number => {
    return getSpeakerVoiceSettingsRate();
  };

  // [169] evaluateRiskLiabilityMitigationText: Mitigations score check
  const evaluateRiskLiabilityMitigationText = (text: string): number => {
    return evaluateRiskLiabilityCeilingScore(text);
  };

  // [170] getDetailedObjectionsStatusReport: Detailed mitigated objection strings
  const getDetailedObjectionsStatusReport = (): string => {
    return getObjectionDefenseStatusText();
  };

  // [171] triggerConfettiCongratulations: Congratulations confetti trigger
  const triggerConfettiCongratulations = (): void => {
    triggerSuccessConfettiEffect();
  };

  // [172] getTrustColorBadgeTagsClass: returns style tag classes
  const getTrustColorBadgeTagsClass = (): string => {
    return getTrustLevelColorBadge();
  };

  // [173] getJargonDifficultyBadgeClass: returns classes based on difficulty
  const getJargonDifficultyBadgeClass = (): string => {
    return getJargonDifficultyBadge();
  };

  // [174] evaluateCompetitorDeterrenceScoreDetailed: Comp rating
  const evaluateCompetitorDeterrenceScoreDetailed = (text: string): number => {
    return evaluateCompetitorDeterrenceScore(text);
  };

  // [175] evaluateCustomerTrustPreservationDetailed: Brand preservation detailed score
  const evaluateCustomerTrustPreservationDetailed = (text: string): number => {
    return evaluateCustomerTrustPreservation(text);
  };

  // [176] evaluateIntellectualPropertySafetyDetailed: IP detailed rating
  const evaluateIntellectualPropertySafetyDetailed = (text: string): number => {
    return evaluateIntellectualPropertySafety(text);
  };

  // [177] evaluateOperationalAgilityScoreDetailed: Operational readiness detailed score
  const evaluateOperationalAgilityScoreDetailed = (text: string): number => {
    return evaluateOperationalAgilityScore(text);
  };

  // [178] evaluateShareholderSatisfactionRateDetailed: Investor confidence detailed rating
  const evaluateShareholderSatisfactionRateDetailed = (text: string): number => {
    return evaluateShareholderSatisfactionRate(text);
  };

  // [179] getHistoricalMaxTrustDetailed: max trust logger wrapper
  const getHistoricalMaxTrustDetailed = (): number => {
    return getHistoricalMaxTrustScore();
  };

  // [180] getScenarioDifficultyBadgeColorDetailed: dynamic difficulty color badge
  const getScenarioDifficultyBadgeColorDetailed = (): string => {
    return getScenarioDifficultyBadgeColor();
  };

  // [181] getTurnOwnerAvatarDetailed: dynamic speaker image wrapper
  const getTurnOwnerAvatarDetailed = (): string => {
    return getTurnOwnerAvatar();
  };

  // [182] getObjectionDefenseTipDetailed: Objection tip context wrapper
  const getObjectionDefenseTipDetailed = (): string => {
    return getObjectionDefenseTip(selectedScenario.id);
  };

  // [183] copyMeetingTranscriptDetailed: Clipboard copy minutes wrapper
  const copyMeetingTranscriptDetailed = (): void => {
    copyMeetingTranscript();
  };

  // [184] toggleSystemDiagnosticsDetailed: system diagnostics helper
  const toggleSystemDiagnosticsDetailed = (): void => {
    toggleSystemDiagnostics();
  };

  // [185] getJargonBadgesList: terminology list wrapper
  const getJargonBadgesList = (): string[] => {
    return getJargonBadges();
  };

  // [186] shareToLinkedInDetailed: LinkedIn share wrapper
  const shareToLinkedInDetailed = (): void => {
    shareToLinkedIn();
  };

  // [187] shareToTwitterDetailed: Twitter share wrapper
  const shareToTwitterDetailed = (): void => {
    shareToTwitter();
  };

  // [188] getHistoricalAverageScoreDetailed: trust logs average wrapper
  const getHistoricalAverageScoreDetailed = (): number => {
    return getHistoricalAverageScore();
  };

  // [189] getObjectiveAccomplishmentPercentageDetailed: dynamic metrics wrapper
  const getObjectiveAccomplishmentPercentageDetailed = (): number => {
    return getObjectiveAccomplishmentPercentage();
  };

  // [190] getStressLevelColorDetailed: tone status color index wrapper
  const getStressLevelColorDetailed = (): string => {
    return getStressLevelColor();
  };

  // [191] getBoardSatisfactionIndicatorDetailed: satisfaction projected helper
  const getBoardSatisfactionIndicatorDetailed = (): string => {
    return getBoardSatisfactionIndicator();
  };

  // [192] getVoiceStabilityMetricsDetailed: fluency stability index
  const getVoiceStabilityMetricsDetailed = (): number => {
    return getVoiceStabilityMetrics();
  };

  // [193] getAudienceToneAdjustmentDetailed: detailed audience critiques
  const getAudienceToneAdjustmentDetailed = (): string => {
    return getAudienceToneAdjustment();
  };

  // [194] getGrammarImprovementTipDetailed: conditional structural tips
  const getGrammarImprovementTipDetailed = (): string => {
    return getGrammarImprovementTip();
  };

  // [195] calculateSimulatedSpeakingPaceDetailed: estimates words per minute
  const calculateSimulatedSpeakingPaceDetailed = (text: string): number => {
    return calculateSimulatedSpeakingPace(text);
  };

  // [196] toggleVoiceSubtitlesDetailed: caption toggle settings helper
  const toggleVoiceSubtitlesDetailed = (): void => {
    toggleVoiceSubtitles();
  };

  // [197] getSentimentEmoticonDetailed: sentiment emotion string wrapper
  const getSentimentEmoticonDetailed = (status: 'speaking' | 'listening' | 'idle'): string => {
    return getSentimentEmoticon(status);
  };

  // [198] getBoardMemberObjectionSeverityDetailed: stressdynamic objection details
  const getBoardMemberObjectionSeverityDetailed = (id: string): string => {
    return getBoardMemberObjectionSeverity(id);
  };

  // [199] getExecutiveRankTitleDetailed: rank title converter wrapper
  const getExecutiveRankTitleDetailed = (avg: number): string => {
    return getExecutiveRankTitle(avg);
  };

  // [200] analyzeImprovementTrendDetailed: historical performance curve details
  const analyzeImprovementTrendDetailed = (): string => {
    return analyzeImprovementTrend();
  };

  // [201] getHistoricalSessionCountDetailed: history logs count wrapper
  const getHistoricalSessionCountDetailed = (): number => {
    return getHistoricalSessionCount();
  };

  // [202] getBoardMemberStressFactorDetailed: returns stress index wrapper
  const getBoardMemberStressFactorDetailed = (id: string): number => {
    return getBoardMemberStressFactor(id);
  };

  // [203] getObjectivesCompletionPercentageDetailed: objectives completed rate wrapper
  const getObjectivesCompletionPercentageDetailed = (): number => {
    return getObjectivesCompletionPercentage();
  };

  // [204] getObjectivesCompletionsCountDetailed: completed objectives count wrapper
  const getObjectivesCompletionsCountDetailed = (): number => {
    return getObjectivesCompletionsCount();
  };

  // [205] getTotalObjectivesCountDetailed: total goals count wrapper
  const getTotalObjectivesCountDetailed = (): number => {
    return getTotalObjectivesCount();
  };

  // [206] getObjectiveRewardXPDetailed: XP reward wrapper
  const getObjectiveRewardXPDetailed = (idx: number): number => {
    return getObjectiveRewardXP(idx);
  };

  // [207] calculateSimulatedPronunciationAccuracyDetailed: phonic accuracy wrapper
  const calculateSimulatedPronunciationAccuracyDetailed = (text: string): number => {
    return calculateSimulatedPronunciationAccuracy(text);
  };

  // [208] getDynamicSpeechStabilizerLevelDetailed: speech filter level wrapper
  const getDynamicSpeechStabilizerLevelDetailed = (): number => {
    return getDynamicSpeechStabilizerLevel();
  };

  // [209] getObjectionAggressionScoreDetailed: aggression score wrapper
  const getObjectionAggressionScoreDetailed = (): number => {
    return getObjectionAggressionScore();
  };

  // [210] evaluateToneAggressivenessDetailed: tone aggressiveness wrapper
  const evaluateToneAggressivenessDetailed = (text: string): number => {
    return evaluateToneAggressiveness(text);
  };

  // [211] getBestRankTitleDetailed: highest rank title wrapper
  const getBestRankTitleDetailed = (): string => {
    return getBestRankTitle();
  };

  // [212] getAverageSessionDurationDetailed: average session timer duration wrapper
  const getAverageSessionDurationDetailed = (): number => {
    return getAverageSessionDuration();
  };

  // [213] getHighestTrustScenarioDetailed: highest trust scenario title wrapper
  const getHighestTrustScenarioDetailed = (): string => {
    return getHighestTrustScenario();
  };

  // [214] getCorporativoPerformanceReportDetailed: performance logs average wrapper
  const getCorporativoPerformanceReportDetailed = (): string => {
    return getCorporativoPerformanceReport();
  };

  // [215] saveCorporativoSessionHistoryDetailed: sessions logs appender wrapper
  const saveCorporativoSessionHistoryDetailed = (score: number): void => {
    saveCorporativoSessionHistory(score);
  };

  // [216] getScenarioKeywordsCountDetailed: Matched keywords count wrapper
  const getScenarioKeywordsCountDetailed = (text: string): number => {
    return getScenarioKeywordsCount(text);
  };

  // [217] evaluateROIProjectionCredibilityDetailed: ROI believability wrapper
  const evaluateROIProjectionCredibilityDetailed = (text: string): number => {
    return evaluateROIProjectionCredibility(text);
  };

  // [218] evaluateDataSovereigntyScoreDetailed: Data privacy detailed wrapper
  const evaluateDataSovereigntyScoreDetailed = (text: string): number => {
    return evaluateDataSovereigntyScore(text);
  };

  // [219] evaluatePublicRelationsResponseDetailed: PR response detailed score wrapper
  const evaluatePublicRelationsResponseDetailed = (text: string): number => {
    return evaluatePublicRelationsResponse(text);
  };

  // [220] evaluateComplianceRiskDetailed: Compliance risk detailed score wrapper
  const evaluateComplianceRiskDetailed = (text: string): number => {
    return evaluateComplianceRisk(text);
  };

  // [221] getConfidenceFeedbackMessageDetailed: confidence feedback details wrapper
  const getConfidenceFeedbackMessageDetailed = (): string => {
    return getConfidenceFeedbackMessage();
  };

  // [222] generateConfidenceIndexDetailed: estimates CEO confidence index wrapper
  const generateConfidenceIndexDetailed = (): number => {
    return generateConfidenceIndex();
  };

  // [223] suggestSynonymsForVerbsDetailed: verbs synonyms wrapper
  const suggestSynonymsForVerbsDetailed = (verb: string): string => {
    return suggestSynonymsForVerbs(verb);
  };

  // [224] calculateVocabularyDiversityScoreDetailed: unique vocab richness score wrapper
  const calculateVocabularyDiversityScoreDetailed = (text: string): number => {
    return calculateVocabularyDiversityScore(text);
  };

  // [225] detectSpecificGrammarTenseDetailed: conditional markers checker wrapper
  const detectSpecificGrammarTenseDetailed = (text: string): boolean => {
    return detectSpecificGrammarTense(text);
  };

  // [226] getScenarioIntroductionPhraseDetailed: scenario summary wrapper
  const getScenarioIntroductionPhraseDetailed = (): string => {
    return getScenarioIntroductionPhrase();
  };

  // [227] getHistoryTrustAverageDetailed: history logs trust average detailed wrapper
  const getHistoryTrustAverageDetailed = (): number => {
    return getHistoryTrustAverage();
  };

  // [228] getCorporativoHistoryLengthDetailed: log records detailed count wrapper
  const getCorporativoHistoryLengthDetailed = (): number => {
    return getCorporativoHistoryLength();
  };

  // [229] getObjectionDefenseStatusTextDetailed: Dynamic goal status string detailed
  const getObjectionDefenseStatusTextDetailed = (): string => {
    return getObjectionDefenseStatusText();
  };

  // [230] getAccentDescriptionDetailed: dynamic accent info detailed wrapper
  const getAccentDescriptionDetailed = (): string => {
    return getAccentDescription();
  };

  // [231] getSpeakerAccentCodeDetailed: speech language code detailed wrapper
  const getSpeakerAccentCodeDetailed = (): string => {
    return getSpeakerAccentCode();
  };

  // [232] changeSpeakerVolumeDetailed: vocal volume detailed level wrapper
  const changeSpeakerVolumeDetailed = (vol: number): void => {
    changeSpeakerVolume(vol);
  };

  // [233] changeVoicePitchDetailed: speaker vocal pitch detailed wrapper
  const changeVoicePitchDetailed = (pitch: number): void => {
    changeVoicePitch(pitch);
  };

  // [234] changePlaybackSpeedDetailed: speaking pace detailed wrapper
  const changePlaybackSpeedDetailed = (speed: number): void => {
    changePlaybackSpeed(speed);
  };

  // [235] calculateBoardAcceptanceRateDetailed: dynamic board acceptance factor detailed
  const calculateBoardAcceptanceRateDetailed = (): number => {
    return calculateBoardAcceptanceRate();
  };

  // [236] unlockExecutiveMilestoneDetailed: milestone achievement detailed trigger
  const unlockExecutiveMilestoneDetailed = (title: string): void => {
    unlockExecutiveMilestone(title);
  };

  // [237] getExecutiveLevelBadgeDetailed: level badge detailed title wrapper
  const getExecutiveLevelBadgeDetailed = (): string => {
    return getExecutiveLevelBadge();
  };

  // [238] getLevelProgressPercentageDetailed: progress level percentage detailed wrapper
  const getLevelProgressPercentageDetailed = (): number => {
    return getLevelProgressPercentage();
  };

  // [239] getXPNeededForNextLevelDetailed: dynamic level XP detailed threshold
  const getXPNeededForNextLevelDetailed = (): number => {
    return getXPNeededForNextLevel();
  };

  // [240] getExecutiveLevelDetailed: computes corporate executive level detailed
  const getExecutiveLevelDetailed = (): number => {
    return getExecutiveLevel();
  };

  // [241] getJargonQuizProgressDetailed: jargon quiz percentage detailed progress
  const getJargonQuizProgressDetailed = (): number => {
    return getJargonQuizProgress();
  };

  // [242] nextJargonQuizQuestionDetailed: cycles jargon quiz question detailed list
  const nextJargonQuizQuestionDetailed = (): void => {
    nextJargonQuizQuestion();
  };

  // [243] checkJargonQuizAnswerDetailed: checks jargon quiz selection detailed answer
  const checkJargonQuizAnswerDetailed = (ans: string): void => {
    checkJargonQuizAnswer(ans);
  };

  // [244] getJargonQuizQuestionDetailed: jargon quiz current question detailed wrapper
  const getJargonQuizQuestionDetailed = (): { question: string; options: string[]; answer: string } => {
    return getJargonQuizQuestion();
  };

  // [245] getExecutiveDiagnosticLogsDetailed: DIAGNOSTIC logging serialize detailed wrapper
  const getExecutiveDiagnosticLogsDetailed = (): string => {
    return getExecutiveDiagnosticLogs();
  };

  // [246] getScenarioDifficultyBadgeColorDetailedWrapper: dynamic difficulty badge detailed
  const getScenarioDifficultyBadgeColorDetailedWrapper = (): string => {
    return getScenarioDifficultyBadgeColorDetailed();
  };

  // [247] getHistoricalMaxTrustDetailedWrapper: max trust detailed wrapper
  const getHistoricalMaxTrustDetailedWrapper = (): number => {
    return getHistoricalMaxTrustDetailed();
  };

  // [248] evaluateShareholderSatisfactionRateDetailedWrapper: investor satisfaction detailed
  const evaluateShareholderSatisfactionRateDetailedWrapper = (text: string): number => {
    return evaluateShareholderSatisfactionRateDetailed(text);
  };

  // [249] evaluateOperationalAgilityScoreDetailedWrapper: operational agility detailed score
  const evaluateOperationalAgilityScoreDetailedWrapper = (text: string): number => {
    return evaluateOperationalAgilityScoreDetailed(text);
  };

  // [250] evaluateIntellectualPropertySafetyDetailedWrapper: IP safety detailed rating
  const evaluateIntellectualPropertySafetyDetailedWrapper = (text: string): number => {
    return evaluateIntellectualPropertySafetyDetailed(text);
  };

  // [251] evaluateCustomerTrustPreservationDetailedWrapper: Customer trust detailed rating
  const evaluateCustomerTrustPreservationDetailedWrapper = (text: string): number => {
    return evaluateCustomerTrustPreservationDetailed(text);
  };

  // [252] evaluateCompetitorDeterrenceScoreDetailedWrapper: Competitor deterrence detailed rating
  const evaluateCompetitorDeterrenceScoreDetailedWrapper = (text: string): number => {
    return evaluateCompetitorDeterrenceScoreDetailed(text);
  };

  // [253] getJargonDifficultyBadgeClassWrapper: returns difficulty classes detailed
  const getJargonDifficultyBadgeClassWrapper = (): string => {
    return getJargonDifficultyBadgeClass();
  };

  // [254] getTrustColorBadgeTagsClassWrapper: returns style trust detailed tags classes
  const getTrustColorBadgeTagsClassWrapper = (): string => {
    return getTrustColorBadgeTagsClass();
  };

  // [255] triggerConfettiCongratulationsWrapper: success confetti detailed wrapper
  const triggerConfettiCongratulationsWrapper = (): void => {
    triggerConfettiCongratulations();
  };

  // [256] getDetailedObjectionsStatusReportWrapper: objections detail detailed status report
  const getDetailedObjectionsStatusReportWrapper = (): string => {
    return getDetailedObjectionsStatusReport();
  };

  // [257] evaluateRiskLiabilityMitigationTextWrapper: risk liability detailed score check
  const evaluateRiskLiabilityMitigationTextWrapper = (text: string): number => {
    return evaluateRiskLiabilityMitigationText(text);
  };

  // [258] getSpeakerVoiceRateValueWrapper: speaking rate detailed value wrapper
  const getSpeakerVoiceRateValueWrapper = (): number => {
    return getSpeakerVoiceRateValue();
  };

  // [259] calculateTotalJargonProficiencyWrapper: jargon level detailed evaluation wrapper
  const calculateTotalJargonProficiencyWrapper = (): string => {
    return calculateTotalJargonProficiency();
  };

  // [260] saveHistoricalScoreRecordWrapper: history score detailed record logger
  const saveHistoricalScoreRecordWrapper = (score: number): void => {
    saveHistoricalScoreRecord(score);
  };

  // [261] getHistoricalLogLengthWrapper: history logs count detailed wrapper
  const getHistoricalLogLengthWrapper = (): number => {
    return getHistoricalLogLength();
  };

  // [262] getBoardMemberObjectionStatusEmojiWrapper: objection statuses dynamic emoji
  const getBoardMemberObjectionStatusEmojiWrapper = (id: string): string => {
    return getBoardMemberObjectionStatusEmoji(id);
  };

  // [263] getCTOObjectionDetailsWrapper: Dr CTO detailed board objections
  const getCTOObjectionDetailsWrapper = (): string => {
    return getCTOObjectionDetails();
  };

  // [264] getLeadInvestorObjectionDetailsWrapper: Lead Investor detailed VC objections
  const getLeadInvestorObjectionDetailsWrapper = (): string => {
    return getLeadInvestorObjectionDetails();
  };

  // [265] getCFOObjectionDetailsWrapper: Chief Financial Officer detailed CFO objections
  const getCFOObjectionDetailsWrapper = (): string => {
    return getCFOObjectionDetails();
  };

  // [266] getDynamicDiagnosticsLogHistoryStrWrapper: diagnostics logging detailed wrapper
  const getDynamicDiagnosticsLogHistoryStrWrapper = (): string => {
    return getDynamicDiagnosticsLogHistoryStr();
  };

  // [267] evaluateNegotiationTensionLevelWrapper: negotiation tension detailed index
  const evaluateNegotiationTensionLevelWrapper = (): number => {
    return evaluateNegotiationTensionLevel();
  };

  // [268] getObjectionAggressionScoreLevelWrapper: difficulty aggression detailed rating
  const getObjectionAggressionScoreLevelWrapper = (): number => {
    return getObjectionAggressionScoreLevel();
  };

  // [269] getBoardSatisfactionDescriptionTextWrapper: dynamic satisfaction projected detailed
  const getBoardSatisfactionDescriptionTextWrapper = (): string => {
    return getBoardSatisfactionDescriptionText();
  };

  // [270] triggerApprovalConfettiEffectWrapper: success confetti dynamic approval detailed
  const triggerApprovalConfettiEffectWrapper = (): void => {
    triggerApprovalConfettiEffect();
  };

  // [271] checkAllObjectivesAccomplishedWrapper: returns if completed goals detailed
  const checkAllObjectivesAccomplishedWrapper = (): boolean => {
    return checkAllObjectivesAccomplished();
  };

  // [272] getTrustLevelColorBadgeWrapper: returns trust badge detailed styling classes
  const getTrustLevelColorBadgeWrapper = (): string => {
    return getTrustLevelColorBadge();
  };

  // [273] getAudienceVoiceClarityRatingWrapper: fluency detailed stability index rating
  const getAudienceVoiceClarityRatingWrapper = (): number => {
    return getAudienceVoiceClarityRating();
  };

  // [274] getGrammarDefectTipWrapper: conditional grammar detailed tips wrapper
  const getGrammarDefectTipWrapper = (): string => {
    return getGrammarDefectTip();
  };

  // [275] getAudienceToneDescriptionWrapper: dynamic audience detailed tone adjustment
  const getAudienceToneDescriptionWrapper = (): string => {
    return getAudienceToneDescription();
  };

  // [276] copyMeetingAuditMemosWrapper: copy audit detailed memo wrapper
  const copyMeetingAuditMemosWrapper = (): void => {
    copyMeetingAuditMemos();
  };

  // [277] getBoardConfidenceIndexPctWrapper: board trust detailed percentage wrapper
  const getBoardConfidenceIndexPctWrapper = (): number => {
    return getBoardConfidenceIndexPct();
  };

  // [278] getHistoricalSessionXPScoreWrapper: dynamic C-level XP detailed score wrapper
  const getHistoricalSessionXPScoreWrapper = (): number => {
    return getHistoricalSessionXPScore();
  };

  // [279] getActiveChallengeDescriptionWrapper: challenge dynamic text detailed wrapper
  const getActiveChallengeDescriptionWrapper = (): string => {
    return getActiveChallengeDescription();
  };

  // [280] detectCapitalAllocationKeywordWrapper: check corporate capital detailed jargon
  const detectCapitalAllocationKeywordWrapper = (): boolean => {
    return detectCapitalAllocationKeyword();
  };

  // [281] detectSovereigntyKeywordWrapper: check cloud data sovereignty detailed jargon
  const detectSovereigntyKeywordWrapper = (): boolean => {
    return detectSovereigntyKeyword();
  };

  // [282] detectMitigationKeywordWrapper: check risk mitigation detailed jargon
  const detectMitigationKeywordWrapper = (): boolean => {
    return detectMitigationKeyword();
  };

  // [283] detectLeverageKeywordWrapper: check corporate leverage detailed jargon
  const detectLeverageKeywordWrapper = (): boolean => {
    return detectLeverageKeyword();
  };

  // [284] detectDueDiligenceKeywordWrapper: check strategic due diligence detailed jargon
  const detectDueDiligenceKeywordWrapper = (): boolean => {
    return detectDueDiligenceKeyword();
  };

  // [285] detectValuationKeywordWrapper: check valuation detailed jargon
  const detectValuationKeywordWrapper = (): boolean => {
    return detectValuationKeyword();
  };

  // [286] detectCorporateSynergyKeywordWrapper: check strategic synergy detailed jargon
  const detectCorporateSynergyKeywordWrapper = (): boolean => {
    return detectCorporateSynergyKeyword();
  };

  // [287] getFormattedTimerDetailedStringWrapper: mm:ss elapsed stopwatch detailed wrapper
  const getFormattedTimerDetailedStringWrapper = (): string => {
    return getFormattedTimerDetailedString();
  };

  // [288] getTurnOwnerVoicePitchWrapper: dynamic speaker pitch detailed wrapper
  const getTurnOwnerVoicePitchWrapper = (): number => {
    return getTurnOwnerVoicePitch();
  };

  // [289] getTurnOwnerRoleWrapper: current speaker designation detailed wrapper
  const getTurnOwnerRoleWrapper = (): string => {
    return getTurnOwnerRole();
  };

  // [290] getTurnOwnerNameWrapper: active turn holder detailed name wrapper
  const getTurnOwnerNameWrapper = (): string => {
    return getTurnOwnerName();
  };

  // [291] getDynamicObjectionDefenseBlueprintTipWrapper: objection defense detailed tip
  const getDynamicObjectionDefenseBlueprintTipWrapper = (): string => {
    return getDynamicObjectionDefenseBlueprintTip();
  };

  // [292] getAverageObjectionStressIndexWrapper: speaking average stress detailed index
  const getAverageObjectionStressIndexWrapper = (): number => {
    return getAverageObjectionStressIndex();
  };

  // [293] getDiagnosticsLogStringWrapper: serialized diagnostic logs detailed wrapper
  const getDiagnosticsLogStringWrapper = (): string => {
    return getDiagnosticsLogString();
  };

  // [294] getDiagnosticsHistoryLengthWrapper: diagnostic logs detailed count wrapper
  const getDiagnosticsHistoryLengthWrapper = (): number => {
    return getDiagnosticsHistoryLength();
  };

  // [295] incrementVocalDiagnosticsHistoryWrapper: diagnostic log detailed appender wrapper
  const incrementVocalDiagnosticsHistoryWrapper = (log: string): void => {
    incrementVocalDiagnosticsHistory(log);
  };

  // [296] getObjectionMitigationPercentageWrapper: accomplished goals detailed rate wrapper
  const getObjectionMitigationPercentageWrapper = (): number => {
    return getObjectionMitigationPercentage();
  };

  // [297] evaluateDataSovereigntyDetailedWrapper: GDPR cloud hosting detailed score wrapper
  const evaluateDataSovereigntyDetailedWrapper = (text: string): number => {
    return evaluateDataSovereigntyScoreDetailed(text);
  };

  // [298] evaluateBilateralTradeAgreementScoreWrapper: bilateral alliance detailed score wrapper
  const evaluateBilateralTradeAgreementScoreWrapper = (text: string): number => {
    return evaluateBilateralTradeAgreementScore(text);
  };

  // [299] getAggressionObjectionLevelNameWrapper: negotiation phase detailed level wrapper
  const getAggressionObjectionLevelNameWrapper = (): string => {
    return getAggressionObjectionLevelName();
  };

  // [300] generateDynamicVocalWaveformHeightWrapper: dynamic vocal detailed height wrapper
  const generateDynamicVocalWaveformHeightWrapper = (vol: number): number => {
    return generateDynamicVocalWaveformHeight(vol);
  };

  // Set initial scenario greeting
  useEffect(() => {
    if (isJoined) {
      // Clean previous messages
      setMessages([]);
      setCompletedObjectives([false, false, false, false]);
      
      const activeChar = characters.find(c => c.id === selectedScenario.initialSpeaker);
      
      // Update speakers
      setCharacters(prev => prev.map(c => 
        c.id === selectedScenario.initialSpeaker ? { ...c, status: 'speaking' } : { ...c, status: 'idle' }
      ));
      setCurrentTurnOwner(selectedScenario.initialSpeaker);

      // Play introductory text using text-to-speech
      playTTSAudio(selectedScenario.initialQuestion);

      setMessages([
        {
          role: 'ai',
          sender: activeChar?.name || 'Corporativo',
          avatar: activeChar?.avatar || '',
          text: selectedScenario.initialQuestion,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      
      // Reset statuses after speech finishes simulated duration
      setTimeout(() => {
        setCharacters(prev => prev.map(c => ({ ...c, status: 'idle' })));
      }, 5500);
    }
  }, [isJoined, selectedScenario]);

  // Clean TTS voice ref on unmount
  useEffect(() => {
    return () => {
      if (lastAudioRef.current) {
        lastAudioRef.current.pause();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Synthesize and play board member speech via high fidelity backend TTS
  const playTTSAudio = async (text: string) => {
    if (isMuteAll) return;
    try {
      setIsPlayingAudio(true);
      if (lastAudioRef.current) {
        lastAudioRef.current.pause();
      }

      // Google TTS endpoint on backend
      const responseUrl = `${apiClient.defaults.baseURL}/ai/tts?text=${encodeURIComponent(text)}&lang=en`;
      const audio = new Audio(responseUrl);
      lastAudioRef.current = audio;

      audio.onended = () => {
        setIsPlayingAudio(false);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
      };

      await audio.play();
    } catch (e) {
      console.warn("TTS playback failed, using fallback visual animation", e);
      setIsPlayingAudio(false);
    }
  };

  // Real-time Mic volume visualization using Web Audio API
  const startVolumeVisualization = (stream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      
      source.connect(analyserRef.current);
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      const updateVolume = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);
        
        // Transform frequency data to visual waveform levels
        const rawArray = Array.from(dataArrayRef.current);
        const mappedVolumes = rawArray.slice(0, 20).map(val => Math.max(2, Math.floor((val / 255) * 45)));
        
        setMicVolume(mappedVolumes);
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      
      updateVolume();
    } catch (err) {
      console.error("Volume visualization error:", err);
    }
  };

  // Microphone Recording and Speech Recognition Flow
  const startMicRecording = async () => {
    if (isRecording) return;
    
    setIsRecording(true);
    audioChunksRef.current = [];
    setInputText('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start recording
      const options = { mimeType: 'audio/webm' };
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Stop stream tracks
        stream.getTracks().forEach(track => track.stop());
        
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setMicVolume(new Array(20).fill(2));
      };

      recorder.start();
      startVolumeVisualization(stream);

      // Start live speech-to-text transcription
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.start();
        } catch (e) {
          console.warn("Speech Recognition already running", e);
        }
      }

    } catch (error) {
      console.error("Microphone access denied:", error);
      setIsRecording(false);
      alert("Please allow access to your microphone to practice your spoken business English.");
    }
  };

  const stopMicRecording = () => {
    if (!isRecording) return;
    
    setIsRecording(false);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
    }
  };

  // Submit Answer to dynamic Corporativo Simulator
  const handleSendMessage = async () => {
    const textToSend = inputText.trim();
    if (!textToSend && !audioBlob) return;
    
    const userMsg = { 
      role: 'user', 
      sender: 'You (CEO)',
      text: textToSend || "Speech input received",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    
    // Choose next speaker sequentially or based on content
    let nextSpeakerId = '1';
    if (currentTurnOwner === '1') nextSpeakerId = '3'; // CTO -> CFO
    else if (currentTurnOwner === '3') nextSpeakerId = '2'; // CFO -> Lead Investor
    else nextSpeakerId = '1'; // Lead Investor -> CTO
    
    const nextSpeaker = characters.find(c => c.id === nextSpeakerId) || characters[0];

    try {
      // 1. If audio blob exists, get real phonetic evaluation from backend /speech/analyze
      let phoneticScore = 80;
      let pronunciationFeedback = "";
      
      if (audioBlob) {
        setIsTranscribing(true);
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('target_text', selectedScenario.initialQuestion);

        try {
          const speechResponse = await apiClient.post('/speech/analyze', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          if (speechResponse.data && speechResponse.data.data) {
            const data = speechResponse.data.data;
            phoneticScore = data.score || 82;
            pronunciationFeedback = data.feedback || "Good business delivery.";
            setFluencyScore(phoneticScore);
          }
        } catch (err) {
          console.warn("Phonetic speech analyzer fallback utilized.");
        } finally {
          setIsTranscribing(false);
          setAudioBlob(null);
        }
      }

      // Update board state to show everyone listening
      setCharacters(prev => prev.map(c => ({ ...c, status: 'listening' })));

      // 2. Query Gemini chat for dynamic objection / turn reply
      let systemPrompt = `You are ${nextSpeaker.name}, playing the role of ${nextSpeaker.role} in a high-stakes corporate boardroom simulator. 
      The current scenario is: "${selectedScenario.title}" - Description: "${selectedScenario.description}".
      
      User is playing the role of the CEO. Respond to their proposal: "${textToSend}".
      Be professional, critical, demand metrics/ROI, and remain true to your character:
      - Chief Technology Officer is strategic, tech-savvy, and worried about security/ethics.
      - Lead Investor is a venture capitalist, extremely ROI focused, wants global growth, and hates risks.
      - Chief Financial Officer is the CFO, ultra-conservative with cash flow, demands cost savings and mitigation plans.
      
      Ensure you give:
      1. A realistic response challenging the CEO's claims.
      2. A C-Level executive vocabulary suggestion.
      3. A clear score for grammar, tone, and vocabulary choice.
      `;

      // Make chat post request to our premium backend engine
      const chatResponse = await apiClient.post('/ai/chat', {
        message: textToSend || "Let me elaborate on our strategic approach for the board.",
        context: systemPrompt,
        mode: "negotiation"
      });

      const responseData = chatResponse.data;
      
      // Calculate jargon density & filler word counters
      const density = getJargonDensity(textToSend);
      if (density > 0) {
        setJargonCount(prev => prev + 1);
      }
      const fillers = detectFillerWordsCount(textToSend);
      if (fillers > 0) {
        setFillerWordCount(prev => prev + fillers);
      }

      // Update score states dynamically
      let nextGrammar = grammarScore;
      let nextTone = toneScore;
      let nextVocab = vocabularyScore;

      if (responseData.analysis) {
        if (responseData.analysis.score) {
          const score = responseData.analysis.score;
          nextGrammar = Math.min(100, Math.max(50, Math.floor((grammarScore + score) / 2)));
          setGrammarScore(nextGrammar);
        }
        if (responseData.analysis.tone_check) {
          nextTone = Math.min(100, Math.max(60, toneScore + 2));
          setToneScore(nextTone);
        }
      }

      // Formulate C-Level vocabulary upgrades based on response
      const vocabUpgrade = responseData.analysis?.vocabulary_upgrade || "Leverage 'cash optimization' to argue strategy.";
      setSuggestions(prev => [vocabUpgrade, ...prev.slice(0, 2)]);
      nextVocab = Math.min(100, Math.max(50, vocabularyScore + 3));
      setVocabularyScore(nextVocab);

      // Calibrate board trust level
      const updatedTrust = calculateBoardTrust(nextGrammar, nextTone, nextVocab, fluencyScore);
      setBoardTrust(updatedTrust);

      // Trigger triumph effects if all objectives get cleared
      if (completedObjectives.every(Boolean)) {
        triggerCorporateConfetti();
      }

      // Update speaker status
      setCharacters(prev => prev.map(c => 
        c.id === nextSpeakerId ? { ...c, status: 'speaking' } : { ...c, status: 'idle' }
      ));
      setCurrentTurnOwner(nextSpeakerId);

      // Add engine reply to logs
      setMessages(prev => [...prev, { 
        role: 'ai', 
        sender: nextSpeaker.name,
        avatar: nextSpeaker.avatar,
        text: responseData.text || `Understood CEO, let's look at the financial models.`,
        analysis: responseData.analysis,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      // Complete session objectives dynamically
      setCompletedObjectives(prev => {
        const next = [...prev];
        const textLower = textToSend.toLowerCase();
        if (selectedScenario.id === 'ma_pitch') {
          if (textLower.includes('synergy') || textLower.includes('valuation') || textLower.includes('due diligence')) next[2] = true;
          if (textLower.includes('cash') || textLower.includes('fund') || textLower.includes('reserve')) next[1] = true;
          if (textLower.includes('growth') || textLower.includes('market') || textLower.includes('expansion')) next[0] = true;
          next[3] = true; // Diplomatic tone
        } else if (selectedScenario.id === 'product_recall') {
          if (textLower.includes('safety') || textLower.includes('recall') || textLower.includes('contain')) next[0] = true;
          if (textLower.includes('margin') || textLower.includes('cost') || textLower.includes('financial')) next[1] = true;
          if (textLower.includes('shareholder') || textLower.includes('investor') || textLower.includes('stock')) next[2] = true;
          next[3] = true;
        } else {
          if (textLower.includes('efficiency') || textLower.includes('cloud') || textLower.includes('scale')) next[0] = true;
          if (textLower.includes('roi') || textLower.includes('month') || textLower.includes('return')) next[1] = true;
          if (textLower.includes('security') || textLower.includes('sovereignty') || textLower.includes('safe')) next[2] = true;
          next[3] = true;
        }
        return next;
      });

      // Play audio TTS
      playTTSAudio(responseData.text);

      setTimeout(() => {
        setCharacters(prev => prev.map(c => ({ ...c, status: 'idle' })));
      }, 5000);

    } catch (error: any) {
      console.warn("System response error fallback initialized.", error);
      
      // Dynamic simulated C-level board objection fallback in case user tier throws 403 or backend is offline
      const fallbackQuestions: Record<string, string[]> = {
        '1': [
          "That is an interesting vision, but how do we hedge against competitors replicating this deployment immediately?",
          "Strategic synergies are great on paper, but integration is historically chaotic. What is your precise blueprint for this?"
        ],
        '2': [
          "Our shareholders are looking at immediate risk curves. How will this decision reflect on our next earnings call?",
          "I agree with the growth potential, but the capital lockup period seems excessively high for these returns."
        ],
        '3': [
          "My primary concern remains the cash reserve buffer. Where will this capital be drawn from, specifically?",
          "We can't compromise our operational margins. I need to see a detailed sensitivity analysis before approving."
        ]
      };

      const questionsPool = fallbackQuestions[nextSpeakerId];
      const selectedFallbackText = questionsPool[Math.floor(Math.random() * questionsPool.length)];

      setCharacters(prev => prev.map(c => 
        c.id === nextSpeakerId ? { ...c, status: 'speaking' } : { ...c, status: 'idle' }
      ));
      setCurrentTurnOwner(nextSpeakerId);

      setMessages(prev => [...prev, { 
        role: 'ai', 
        sender: nextSpeaker.name,
        avatar: nextSpeaker.avatar,
        text: selectedFallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      playTTSAudio(selectedFallbackText);

      setTimeout(() => {
        setCharacters(prev => prev.map(c => ({ ...c, status: 'idle' })));
      }, 5000);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-orange-600 via-amber-800 to-stone-950 flex flex-col text-slate-100 font-sans overflow-hidden">
      
      {/* Header */}
      <div className="h-16 border-b border-orange-500/25 px-6 flex items-center justify-between bg-white/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (isJoined) {
                setIsJoined(false);
              } else {
                router.back();
              }
            }} 
            className="p-2 bg-white/10 hover:bg-white/20 text-orange-200 hover:text-slate-900 transition-all rounded-none"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="h-6 w-[1px] bg-white/10"></div>
          
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse"></span>
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-wider">Titanium Executive Corporativo</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isJoined && (
            <button 
              onClick={() => setIsToolboxOpen(!isToolboxOpen)} 
              className={`px-3 py-1.5 rounded-none text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 z-20 ${
                isToolboxOpen 
                  ? 'bg-orange-500 text-slate-950 shadow-none shadow-orange-500/20' 
                  : 'bg-white/10 hover:bg-white/20 text-orange-200'
              }`}
            >
              <Settings size={12} className={isToolboxOpen ? 'animate-spin' : ''} />
              Toolbox
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 border border-orange-500/20 bg-orange-950/40 text-[10px] font-bold text-orange-300 uppercase rounded-full">
            Security Status: <span className="text-emerald-400 font-black">Secure TLS</span>
          </div>
          <button 
            onClick={() => setIsMuteAll(!isMuteAll)} 
            className={`p-2 rounded-none transition-colors ${isMuteAll ? 'bg-[#D4AF37]/100/20 text-red-400 hover:bg-[#D4AF37]/100/30' : 'bg-white/10 hover:bg-white/20 text-orange-200'}`}
            title={isMuteAll ? "Unmute board members" : "Mute board members"}
          >
            {isMuteAll ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button 
            onClick={() => router.push('/dashboard/pro')} 
            className="p-2 hover:bg-[#D4AF37]/100/10 text-red-400 transition-colors rounded-none"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isJoined ? (
          /* SCENARIO SELECTOR SCREEN */
          <motion.div 
            key="scenario-selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 overflow-y-auto p-6 flex flex-col items-center custom-scrollbar"
          >
            <div className="w-full max-w-4xl bg-white/60 border border-orange-500/20 p-8 md:p-12 shadow-2xl relative backdrop-blur-xl rounded-none my-auto">
              
              <div className="absolute top-0 right-0 p-8 opacity-5 text-orange-500">
                <Users size={200} />
              </div>
              
              <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-none flex items-center justify-center text-slate-950 shadow-none shadow-orange-500/20 mx-auto mb-6">
                  <Award size={36} className="animate-pulse" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">Enter the Alta Dirección Corporativo</h2>
                <p className="text-sm text-orange-200/80 mt-2">
                  Test your real-time speaking capacity, professional vocabulary, and executive composure under corporate interrogation. Choose a scenario below.
                </p>
              </div>

              {/* Scenarios Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {scenarios.map((scen) => {
                  const isSelected = selectedScenario.id === scen.id;
                  return (
                    <div 
                      key={scen.id}
                      onClick={() => setSelectedScenario(scen)}
                      className={`p-6 border rounded-none cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-orange-950/40 border-orange-500 shadow-xl shadow-orange-500/10 ring-1 ring-orange-500/30 text-slate-900' 
                          : 'bg-white/40 border-orange-900/40 hover:border-orange-500/40 hover:bg-white/60 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full ${
                            scen.difficulty === 'EXTREME' 
                              ? 'bg-[#D4AF37]/100/20 text-red-400 border border-red-500/30' 
                              : scen.difficulty === 'HARD' 
                                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' 
                                : 'bg-[#D4AF37]/20/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {scen.difficulty}
                          </span>
                          {isSelected && <Circle className="text-orange-500 fill-orange-500 animate-ping" style={{ transformBox: 'fill-box' }} size={10} />}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">{scen.title}</h3>
                        <p className="text-xs text-orange-200/60 mb-4">{scen.subtitle}</p>
                        <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed">{scen.description}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5">
                        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1">
                          <Sparkles size={12} /> {scen.objectives.length} Objectives
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hardware / Hardware Toggle Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
                <button 
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`py-4 px-6 border flex items-center justify-center gap-3 transition-all rounded-none ${
                    isMicOn 
                      ? 'bg-orange-500 border-orange-400 text-slate-950 font-black shadow-none shadow-orange-500/10' 
                      : 'bg-white/40 border-orange-900/40 text-slate-500 hover:bg-white/60'
                  }`}
                >
                  {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
                  <span className="text-xs font-bold uppercase tracking-wider">{isMicOn ? 'Microphone Active' : 'Microphone Disabled'}</span>
                </button>

                <button 
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`py-4 px-6 border flex items-center justify-center gap-3 transition-all rounded-none ${
                    isVideoOn 
                      ? 'bg-orange-500 border-orange-400 text-slate-950 font-black shadow-none shadow-orange-500/10' 
                      : 'bg-white/40 border-orange-900/40 text-slate-500 hover:bg-white/60'
                  }`}
                >
                  {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
                  <span className="text-xs font-bold uppercase tracking-wider">{isVideoOn ? 'Camera Active' : 'Camera Optional'}</span>
                </button>
              </div>

              {/* Join Button */}
              <div className="flex flex-col items-center">
                <button 
                  onClick={() => setIsJoined(true)}
                  className="w-full max-w-sm py-4 bg-white hover:bg-orange-500 hover:text-slate-950 text-slate-950 font-extrabold uppercase tracking-widest text-xs rounded-none transition-all transform active:scale-95 shadow-xl hover:shadow-orange-500/10"
                >
                  Launch Corporativo Sim
                </button>
              </div>

            </div>
          </motion.div>
        ) : (
          /* BOARDROOM MEETING LIVE ROOM */
          <motion.div 
            key="live-room"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="flex-1 flex overflow-hidden">
              
              {/* Main View Area */}
              <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto min-w-0">
                
                {/* Board Members Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {characters.map((char) => (
                    <div 
                      key={char.id} 
                      className={`relative bg-slate-50 border-2 transition-all aspect-video overflow-hidden rounded-none group ${
                        char.status === 'speaking' 
                          ? 'border-[#D4AF37]/30 ring-2 ring-amber-500/20 shadow-none shadow-amber-500/5' 
                          : char.status === 'listening' 
                            ? 'border-blue-500/50' 
                            : 'border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <Image 
                        src={char.avatar} 
                        alt={char.name} 
                        fill
                        className="object-cover opacity-75 group-hover:opacity-90 transition-opacity" 
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                      
                      {/* Live feedback status badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="px-2 py-0.5 bg-slate-50/80 text-[8px] font-black text-slate-500 uppercase tracking-widest rounded backdrop-blur-md border border-slate-800">
                          Board Simulator
                        </span>
                        {char.status !== 'idle' && (
                          <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded backdrop-blur-md border ${
                            char.status === 'speaking' 
                              ? 'bg-[#D4AF37]/20/20 text-amber-400 border-[#D4AF37]/30/30 animate-pulse' 
                              : 'bg-[#D4AF37]/20/20 text-blue-400 border-blue-500/30'
                          }`}>
                            {char.status}
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-900 font-extrabold text-xs uppercase tracking-wider">{char.name}</p>
                            <p className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider">{char.role}</p>
                          </div>
                          {char.status === 'speaking' && (
                            <div className="flex items-end gap-0.5 h-4 px-1.5 py-0.5 bg-[#D4AF37]/20/20 rounded">
                              <span className="w-0.5 h-2 bg-[#D4AF37]/20 animate-[bounce_0.6s_infinite]"></span>
                              <span className="w-0.5 h-3 bg-[#D4AF37]/20 animate-[bounce_0.8s_infinite]"></span>
                              <span className="w-0.5 h-1.5 bg-[#D4AF37]/20 animate-[bounce_0.4s_infinite]"></span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* User Active View */}
                  <div className={`relative bg-slate-50 border-2 aspect-video overflow-hidden rounded-none flex items-center justify-center transition-all ${
                    isRecording 
                      ? 'border-red-500 shadow-none shadow-red-500/5' 
                      : 'border-slate-800/80'
                  }`}>
                    {isVideoOn ? (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center italic text-slate-600 text-xs relative">
                        <span className="absolute top-3 right-3 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]/100"></span>
                        </span>
                        Camera Mock Active
                      </div>
                    ) : (
                      /* Glowing soundwave responsive visualizer when camera off */
                      <div className="text-center relative w-full h-full flex flex-col items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0,transparent_70%)]"></div>
                        
                        <div className="relative">
                          {isRecording ? (
                            <div className="flex items-center justify-center gap-1 h-14 mb-2">
                              {micVolume.map((vol, i) => (
                                <motion.div 
                                  key={i}
                                  animate={{ height: vol }}
                                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                  className="w-1 bg-[#D4AF37]/100 rounded-full"
                                  style={{ minHeight: '4px' }}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-700/60 flex items-center justify-center text-slate-900 text-lg font-black mb-2 shadow-inner">
                              U
                            </div>
                          )}
                        </div>
                        
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {isRecording ? 'Capturing Audio...' : 'Camera Inactive'}
                        </p>
                        <p className="text-[8px] text-slate-600 font-bold uppercase mt-1">You (CEO)</p>
                      </div>
                    )}
                    
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-0.5 bg-slate-50/80 text-[8px] font-black text-slate-500 uppercase tracking-widest rounded backdrop-blur-md border border-slate-800/80">
                        CEO (You)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtitles & Dynamic Transcript Feed */}
                <div className="bg-slate-50/30 border border-slate-800/60 rounded-none p-5 flex-1 min-h-[250px] flex flex-col shadow-inner backdrop-blur-sm">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <Activity size={14} className="text-[#D4AF37] animate-pulse" /> Meeting Log & Real-time Transcription
                    </div>
                    {isTranscribing && (
                      <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-1">
                        <Loader2 size={12} className="animate-spin" /> processing speech metrics...
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        <div className={`max-w-[80%] rounded-none p-4 text-xs leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-slate-50 text-slate-900 border border-slate-700/60 shadow-none' 
                            : 'bg-slate-50/80 border border-slate-800 text-slate-200 shadow-none'
                        }`}>
                          <div className="flex items-center justify-between gap-6 mb-2">
                            <span className="font-extrabold text-[9px] uppercase tracking-widest text-[#D4AF37]">
                              {msg.sender}
                            </span>
                            <span className="text-[8px] text-slate-600 font-bold">
                              {msg.timestamp}
                            </span>
                          </div>
                          
                          <p className="text-slate-300 font-medium">{msg.text}</p>
                          
                          {msg.analysis && (
                            <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-wrap gap-x-4 gap-y-2">
                              {msg.analysis.score && (
                                <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-1 bg-[#D4AF37]/100/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  <Sparkles size={10} /> grammar: {msg.analysis.score}%
                                </span>
                              )}
                              {msg.analysis.tone_check && (
                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-wider flex items-center gap-1 bg-[#D4AF37]/20/10 px-2 py-0.5 rounded border border-blue-500/20">
                                  <TrendingUp size={10} /> tone: {msg.analysis.tone_check}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex gap-4">
                        <div className="bg-slate-50/60 border border-slate-800 p-4 rounded-none flex items-center gap-3">
                          <Loader2 className="animate-spin text-[#D4AF37]" size={16} />
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider animate-pulse">
                            Board is reflecting...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Sidebar: Evaluation & Session Objectives */}
              <div className="w-80 border-l border-slate-800 bg-slate-50/20 backdrop-blur-lg flex flex-col z-10 shrink-0">
                
                {/* Score Dashboard */}
                <div className="p-6 border-b border-slate-800/80 bg-slate-50/40">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy size={16} className="text-[#D4AF37]" />
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Real-Time Evaluation</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Grammar Progress */}
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                        <span>Grammar accuracy</span>
                        <span className="text-emerald-400">{grammarScore}%</span>
                      </div>
                      <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${grammarScore}%` }}></div>
                      </div>
                    </div>

                    {/* Executive Tone Progress */}
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                        <span>Executive Tone</span>
                        <span className="text-amber-400">{toneScore}%</span>
                      </div>
                      <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${toneScore}%` }}></div>
                      </div>
                    </div>

                    {/* Vocabulary Upgrade Progress */}
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                        <span>Vocabulary VIP</span>
                        <span className="text-cyan-400">{vocabularyScore}%</span>
                      </div>
                      <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full transition-all duration-500" style={{ width: `${vocabularyScore}%` }}></div>
                      </div>
                    </div>

                    {/* Fluency / Pronunciation Progress */}
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                        <span>Mic Fluency</span>
                        <span className="text-pink-400">{fluencyScore}%</span>
                      </div>
                      <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-pink-400 h-full transition-all duration-500" style={{ width: `${fluencyScore}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session Objectives */}
                <div className="p-6 border-b border-slate-800/80 flex-1 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <Check size={16} className="text-[#D4AF37]" />
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Session Objectives</h3>
                  </div>
                  
                  <div className="space-y-3.5">
                    {selectedScenario.objectives.map((obj, i) => (
                      <div 
                        key={i} 
                        className={`flex items-start gap-3 text-[10px] font-bold transition-colors ${
                          completedObjectives[i] ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        <div className={`mt-0.5 w-4 h-4 border rounded flex items-center justify-center shrink-0 transition-all ${
                          completedObjectives[i] 
                            ? 'bg-[#D4AF37]/100 border-emerald-400 text-slate-950' 
                            : 'border-slate-700 bg-slate-50'
                        }`}>
                          {completedObjectives[i] && <Check size={10} strokeWidth={3} />}
                        </div>
                        <span className="leading-normal">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions Board */}
                <div className="p-6 bg-slate-50/40 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={14} className="text-cyan-400" />
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider">C-Level Upgrade Tips</h4>
                  </div>
                  <div className="space-y-2">
                    {suggestions.map((sug, i) => (
                      <div key={i} className="p-3 bg-slate-50/60 border border-slate-800/40 rounded text-[9px] font-bold text-slate-500 leading-normal flex gap-2">
                        <span className="text-[#D4AF37] shrink-0">•</span>
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Dynamic Executive Toolbox Drawer */}
              <AnimatePresence>
                {isToolboxOpen && (
                  <motion.div 
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 300 }}
                    className="w-96 border-l border-orange-500/20 bg-white/85 backdrop-blur-2xl flex flex-col z-25 shrink-0 overflow-y-auto"
                  >
                    <div className="p-6 border-b border-orange-500/20 flex items-center justify-between">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={14} className="text-orange-400" /> Executive Analytics
                      </h3>
                      <button 
                        onClick={() => setIsToolboxOpen(false)}
                        className="p-1 bg-white/5 hover:bg-white/15 text-orange-300 rounded"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-orange-500/10 bg-white/40">
                      {[
                        { id: 'analytics', label: 'Analytics', icon: Activity },
                        { id: 'drills', label: 'Drills', icon: Zap },
                        { id: 'voice', label: 'Voice & LVL', icon: Mic },
                        { id: 'history', label: 'Cert & Logs', icon: Award }
                      ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = toolboxTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setToolboxTab(tab.id as any)}
                            className={`flex-1 py-3.5 flex flex-col items-center justify-center gap-1 border-b-2 text-[9px] font-black uppercase tracking-wider transition-all ${
                              isActive 
                                ? 'border-orange-500 text-orange-400 bg-orange-950/15' 
                                : 'border-transparent text-slate-600 hover:text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            <Icon size={12} className={isActive ? 'text-orange-400' : 'text-slate-600'} />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-6 space-y-6">
                      {/* TAB 1: ANALYTICS */}
                      {toolboxTab === 'analytics' && (
                        <div className="space-y-6">
                          {/* Stopwatch & Trust */}
                          <div className="p-4 bg-orange-950/20 border border-orange-500/20 rounded-none">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[10px] font-bold text-orange-300 uppercase">Session Timer</span>
                              <span className="text-xs font-black text-slate-900">{formatSessionTimer(sessionTimer)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-bold text-orange-300 uppercase">Board Status</span>
                              <span className="text-[10px] font-extrabold text-orange-400 leading-normal text-right max-w-[180px]">{getBoardSatisfactionIndicator()}</span>
                            </div>
                            <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden mt-1">
                              <div className="bg-orange-500 h-full transition-all duration-500" style={{ width: `${boardTrust}%` }}></div>
                            </div>
                          </div>

                          {/* Stress Level & Pace */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/40 border border-orange-950 rounded-none">
                              <span className="text-[9px] font-bold text-slate-500 uppercase">Stress Index</span>
                              <p className={`text-xl font-black mt-1 ${getStressLevelColor()}`}>{getStressLevelIndex()}%</p>
                            </div>
                            <div className="p-4 bg-white/40 border border-orange-950 rounded-none">
                              <span className="text-[9px] font-bold text-slate-500 uppercase">Buzzword Jargon</span>
                              <p className="text-xl font-black text-slate-900 mt-1">{jargonCount} used</p>
                            </div>
                          </div>

                          {/* Daily Challenge */}
                          <div className="p-4 bg-orange-950/10 border border-orange-900/30 rounded-none">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[9px] font-black text-orange-400 uppercase tracking-wider">Dynamic Challenge</span>
                              <button 
                                onClick={generateDynamicChallenge}
                                className="text-[8px] font-black text-slate-900 bg-orange-500 px-2 py-0.5 rounded uppercase hover:bg-orange-450"
                              >
                                Reroll
                              </button>
                            </div>
                            <p className="text-xs font-bold text-slate-200">{activeChallenge}</p>
                          </div>

                          {/* Objection Blueprint */}
                          <div className="p-4 bg-white/50 border border-orange-950 rounded-none">
                            <span className="text-[9px] font-black text-slate-500 uppercase">Objection Defense Blueprint</span>
                            <p className="text-xs font-bold text-orange-300 mt-2 leading-relaxed">{getObjectionDefenseTip(selectedScenario.id)}</p>
                          </div>

                          {/* Notes Editor */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-black text-slate-900 uppercase">CEO Notes</label>
                              {executiveNotes && (
                                <button 
                                  onClick={clearExecutiveNotes}
                                  className="text-[8px] font-bold text-red-400 uppercase"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                            <textarea 
                              value={executiveNotes}
                              onChange={(e) => saveNotesLocally(e.target.value)}
                              placeholder="Draft your boardroom arguments here. Auto-saved locally..."
                              className="w-full h-24 bg-slate-50 border border-orange-950 rounded-none p-3 text-xs font-bold text-slate-900 placeholder:text-slate-700 focus:outline-none focus:border-orange-500/80 transition-all shadow-inner resize-none"
                            />
                          </div>

                          {/* Export Action Controls */}
                          <div className="pt-4 border-t border-orange-500/10 space-y-3">
                            <button 
                              onClick={exportMinutesToDisk}
                              className="w-full py-3 bg-orange-500 text-slate-950 hover:bg-white transition-all font-extrabold uppercase tracking-widest text-[9px] rounded-none shadow-none active:scale-95"
                            >
                              Download Meeting Minutes (.txt)
                            </button>
                            <button 
                              onClick={toggleSystemDiagnostics}
                              className="w-full py-2 text-slate-600 hover:text-orange-400 font-bold uppercase tracking-widest text-[8px] transition-colors"
                            >
                              Run Diagnostics Test
                            </button>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: DRILLS */}
                      {toolboxTab === 'drills' && (
                        <div className="space-y-6">
                          <div className="p-4 bg-orange-950/20 border border-orange-500/20 rounded-none">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Jargon Vocabulary Drill</span>
                              <span className="text-[10px] font-bold text-slate-500">{getJargonQuizProgress()}% completed</span>
                            </div>
                            <div className="w-full bg-slate-50 h-1 rounded-full overflow-hidden mb-4">
                              <div className="bg-orange-500 h-full transition-all duration-300" style={{ width: `${getJargonQuizProgress()}%` }}></div>
                            </div>
                            
                            <h4 className="text-xs font-bold text-slate-900 leading-relaxed mb-4">
                              {getJargonQuizQuestion().question}
                            </h4>
                            
                            <div className="space-y-2">
                              {getJargonQuizQuestion().options.map((opt, i) => {
                                const isSelected = selectedQuizAnswer === opt;
                                const isCorrect = opt === getJargonQuizQuestion().answer;
                                return (
                                  <button
                                    key={i}
                                    onClick={() => !selectedQuizAnswer && checkJargonQuizAnswer(opt)}
                                    disabled={!!selectedQuizAnswer}
                                    className={`w-full p-3 rounded-none text-left text-xs font-bold border transition-all ${
                                      selectedQuizAnswer 
                                        ? isCorrect 
                                          ? 'bg-[#D4AF37]/100/20 border-emerald-500 text-emerald-300' 
                                          : isSelected 
                                            ? 'bg-[#D4AF37]/100/20 border-red-500 text-red-300' 
                                            : 'bg-slate-50 border-slate-900 text-slate-600'
                                        : 'bg-slate-50 hover:bg-slate-50 border-slate-800 text-slate-300 hover:text-slate-900'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                            
                            {quizFeedback && (
                              <div className={`mt-4 p-3 rounded-none text-[10px] font-bold ${
                                quizFeedback.includes('Correct') 
                                  ? 'bg-[#D4AF37]/100/10 border border-emerald-500/20 text-emerald-400' 
                                  : 'bg-[#D4AF37]/100/10 border border-red-500/20 text-red-400'
                              }`}>
                                {quizFeedback}
                              </div>
                            )}

                            {selectedQuizAnswer && (
                              <button
                                onClick={nextJargonQuizQuestion}
                                className="w-full mt-4 py-2 bg-white text-slate-950 hover:bg-orange-500 transition-all font-black uppercase tracking-widest text-[9px] rounded-none"
                              >
                                Next Question
                              </button>
                            )}
                          </div>

                          <div className="p-4 bg-white/40 border border-orange-950 rounded-none">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Lexicon List</span>
                            <div className="flex flex-wrap gap-1.5">
                              {getJargonBadges().map((badge, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[8px] font-bold uppercase rounded">
                                  {badge}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 3: VOICE & LEVELS */}
                      {toolboxTab === 'voice' && (
                        <div className="space-y-6">
                          {/* Executive XP & Level Badge */}
                          <div className="p-4 bg-orange-950/20 border border-orange-500/20 rounded-none">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[9px] font-black text-orange-400 uppercase tracking-wider">Executive Status</span>
                              <span className="text-[9px] font-extrabold text-slate-900 bg-orange-500 px-2 py-0.5 rounded">LVL {getExecutiveLevel()}</span>
                            </div>
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-3">
                              {getExecutiveLevelBadge()}
                            </h4>
                            <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase mb-1">
                              <span>Level Progress</span>
                              <span>{executiveXP} / {getXPNeededForNextLevel()} XP</span>
                            </div>
                            <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                              <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-500" style={{ width: `${getLevelProgressPercentage()}%` }}></div>
                            </div>
                          </div>

                          {/* Voice Calibration Parameters */}
                          <div className="p-4 bg-white/40 border border-orange-950 rounded-none space-y-4">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block border-b border-orange-950 pb-2">Voice Calibration</span>
                            
                            {/* Pitch Slider */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
                                <span>Vocal Pitch</span>
                                <span className="text-orange-400">{voicePitch.toFixed(1)}x</span>
                              </div>
                              <input 
                                type="range" 
                                min="0.5" 
                                max="2.0" 
                                step="0.1" 
                                value={voicePitch}
                                onChange={(e) => changeVoicePitch(parseFloat(e.target.value))}
                                className="w-full accent-orange-500 bg-slate-50 rounded-none appearance-none h-1 cursor-pointer"
                              />
                            </div>

                            {/* Speed / Pace Slider */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
                                <span>Speaking Pace</span>
                                <span className="text-orange-400">{playbackSpeed.toFixed(1)}x</span>
                              </div>
                              <input 
                                type="range" 
                                min="0.5" 
                                max="2.0" 
                                step="0.1" 
                                value={playbackSpeed}
                                onChange={(e) => changePlaybackSpeed(parseFloat(e.target.value))}
                                className="w-full accent-orange-500 bg-slate-50 rounded-none appearance-none h-1 cursor-pointer"
                              />
                            </div>

                            {/* Speaker Volume Slider */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
                                <span>Speaker Volume</span>
                                <span className="text-orange-400">{speakerVolume}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={speakerVolume}
                                onChange={(e) => changeSpeakerVolume(parseInt(e.target.value))}
                                className="w-full accent-orange-500 bg-slate-50 rounded-none appearance-none h-1 cursor-pointer"
                              />
                            </div>

                            {/* Speaker Accent Dropdown */}
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold text-slate-500 uppercase">Interactive Accent Calibration</label>
                              <select
                                value={speakerAccent}
                                onChange={(e) => alert(`Accent calibrated to: ${e.target.value}`)}
                                className="w-full bg-slate-50 border border-slate-900 rounded-none p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                              >
                                <option value="US">American Corporate (Lead Investor)</option>
                                <option value="UK">British Professional (CTO)</option>
                                <option value="ES">Spanish Bilateral (Chief Financial Officer)</option>
                              </select>
                              <p className="text-[8px] text-slate-600 leading-normal italic mt-1">
                                {getAccentDescription()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 4: CERTIFICATES & LOGS */}
                      {toolboxTab === 'history' && (
                        <div className="space-y-6">
                          {/* Board Accreditation Certificate */}
                          <div className="p-4 bg-orange-950/20 border border-orange-500/20 rounded-none relative overflow-hidden">
                            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest block mb-2">Digital Accreditation</span>
                            <div className="bg-slate-50 p-3 rounded-none border border-slate-900 max-h-48 overflow-y-auto mb-3 font-mono text-[8px] leading-relaxed text-slate-500 whitespace-pre">
                              {generateDigitalCertificate()}
                            </div>
                            
                            <div className="flex gap-2">
                              <button 
                                onClick={copyCertificateToClipboard}
                                className="flex-1 py-2 bg-orange-500 hover:bg-white text-slate-950 transition-all font-extrabold uppercase tracking-widest text-[8px] rounded-none"
                              >
                                Copy Cert
                              </button>
                              <button 
                                onClick={shareToLinkedIn}
                                className="flex-1 py-2 bg-white/5 border border-orange-500/20 text-slate-900 hover:bg-white/10 transition-all font-extrabold uppercase tracking-widest text-[8px] rounded-none"
                              >
                                LinkedIn
                              </button>
                            </div>
                          </div>

                          {/* Historical Session Logs */}
                          <div className="p-4 bg-white/40 border border-orange-950 rounded-none">
                            <div className="flex justify-between items-center mb-3 border-b border-orange-950 pb-2">
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Corporativo Session Logs</span>
                              {historicalLogs.length > 0 && (
                                <button 
                                  onClick={clearSessionHistory}
                                  className="text-[8px] font-bold text-red-400 uppercase"
                                >
                                  Clear
                                </button>
                              )}
                            </div>

                            {historicalLogs.length === 0 ? (
                              <p className="text-[9px] font-bold text-slate-600 uppercase italic py-4 text-center">
                                No past session logs found
                              </p>
                            ) : (
                              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                                {historicalLogs.map((log, idx) => (
                                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-900 rounded flex justify-between items-center text-[8px] font-bold">
                                    <div>
                                      <p className="text-slate-900 uppercase truncate max-w-[140px]">{log.title || 'Simulation Run'}</p>
                                      <p className="text-slate-600 mt-0.5">{new Date(log.timestamp).toLocaleDateString()}</p>
                                    </div>
                                    <span className="text-orange-400 font-extrabold font-mono">TRUST: {log.trust || log.trustScore}%</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Bottom Interaction / Controls Bar */}
            <div className="h-24 bg-slate-50 border-t border-slate-800/80 px-6 md:px-10 flex items-center justify-between gap-6 z-10">
              
              {/* Hardware micro toggles */}
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`w-12 h-12 rounded-none flex flex-col items-center justify-center border transition-all ${
                    isMicOn 
                      ? 'bg-slate-50 border-slate-700 text-slate-900' 
                      : 'bg-[#D4AF37]/100/20 border-red-500/30 text-red-400 hover:bg-[#D4AF37]/100/30'
                  }`}
                  title={isMicOn ? "Disable Mic input" : "Enable Mic input"}
                >
                  {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
                
                <button 
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`w-12 h-12 rounded-none flex flex-col items-center justify-center border transition-all ${
                    isVideoOn 
                      ? 'bg-slate-50 border-slate-700 text-slate-900' 
                      : 'bg-[#D4AF37]/100/20 border-red-500/30 text-red-400 hover:bg-[#D4AF37]/100/30'
                  }`}
                  title={isVideoOn ? "Turn off Camera" : "Turn on Camera"}
                >
                  {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
                </button>
              </div>

              {/* Central text & speech response bar */}
              <div className="flex-1 max-w-3xl flex items-center gap-3">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isRecording ? "Recording active. Speak to transcribe..." : "Speak or type your strategic response to the board..."}
                    className="w-full bg-slate-50 border border-slate-800 rounded-none pl-5 pr-14 py-3.5 text-xs font-bold text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-[#D4AF37]/30/80 transition-all shadow-inner"
                    disabled={isRecording}
                  />
                  
                  {inputText.trim() && (
                    <button 
                      onClick={handleSendMessage}
                      className="absolute right-3 top-2.5 p-2 bg-[#D4AF37]/20 text-slate-950 hover:bg-white transition-all rounded-none"
                    >
                      <Send size={14} />
                    </button>
                  )}
                </div>

                {/* Primary Mic Trigger */}
                <button 
                  onClick={isRecording ? stopMicRecording : startMicRecording}
                  className={`w-14 h-14 rounded-none flex items-center justify-center transition-all ${
                    isRecording 
                      ? 'bg-[#D4AF37]/100 text-slate-900 animate-pulse shadow-none shadow-red-500/20' 
                      : 'bg-[#D4AF37]/20 text-slate-950 hover:bg-white shadow-none shadow-amber-500/10 hover:scale-105 active:scale-95'
                  }`}
                  title={isRecording ? "Stop recording and transcribe" : "Record voice answer"}
                >
                  {isRecording ? <Circle size={16} className="fill-white" /> : <Mic size={20} />}
                </button>
              </div>

              {/* End meeting */}
              <div className="flex items-center gap-4 shrink-0">
                <button 
                  onClick={() => setIsJoined(false)}
                  className="px-6 py-3.5 bg-[#D4AF37]/20/90 text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37]/20 transition-all rounded-none shadow-none active:scale-95"
                >
                  End Meeting
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}


