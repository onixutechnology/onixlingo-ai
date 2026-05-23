'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  Volume2, ArrowRight, XCircle, CheckCircle2, AlertTriangle, Play, RefreshCw, X,
  Clock, Zap, Check, X as XIcon, Save, BookOpen, Brain, Target, Flame, Award,
  Trophy, Lightbulb, Settings, Download, Share2, Eye, EyeOff, BarChart3,
  MessageSquare, Mic, MicOff, Pause, SkipForward, HelpCircle, MapPin, Filter,
  TrendingUp, Star, Heart, Lock, Unlock, Copy, ChevronDown, ChevronUp, Menu,
  Radio, Grid, List, Search, Calendar, Users, Repeat2, RotateCw, ChevronRight, Sparkles
} from 'lucide-react';

import Avatar3D from '@/components/avatar/Avatar3D';
import LessonComplete from '@/components/lesson/LessonComplete';
import { useAvatarStore } from '@/store/avatarStore';
import { useUIStore } from '@/store/uiStore';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/lib/apiClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';




// ============================================================================
// ======================== TIPOS DE DATOS EXPANDIDOS =======================
// ============================================================================

interface QuizQuestion {
  id?: string;
  type?: string;
  question: string;
  options?: string[];
  correct_answer?: string;
  correct_answers?: string[];
  parts?: string[];
  correct_order?: string[];
  explanation?: string;
  tts_text?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  hints?: string[];
  pronunciation_guide?: string;
  image_url?: string;
}

interface LecturePart {
  visual: string;
  audio: string;
  duration?: number;
  subtitle?: string;
}

interface LessonStage {
  id: string;
  type: string;
  title?: string;
  parts?: LecturePart[];
  questions?: QuizQuestion[];
  scenario?: string;
  content?: any;
  duration?: number;
  tags?: string[];
}

interface LessonData {
  id: string;
  title: string;
  stages: LessonStage[];
  total_xp?: number;
  difficulty?: string;
  category?: string;
  author?: string;
}

interface LessonStats {
  correctAnswers: number;
  totalQuestionsAnswered: number;
  xpAccumulated: number;
  timeSpent: number;
  accuracy: number;
  streakCount: number;
  perfectStages: number;
  averageResponseTime: number;
}

interface UserProgress {
  userId: string;
  lessonId: string;
  completedAt: string;
  score: number;
  xpEarned: number;
  timeSpent: number;
  answers: any[];
  difficulty: string;
}

interface AnalyticsEvent {
  type: string;
  timestamp: number;
  data: any;
}

// ============================================================================
// ==================== COMPONENTE PRINCIPAL MEJORADO =======================
// ============================================================================

export default function LessonRunnerEngine() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonType = searchParams.get('type') || 'standard';
  const { setSpeaking } = useAvatarStore();
  const { mode, activeLanguage, userTier, energy, checkAndResetDailyLimits } = useUIStore();
  
  useEffect(() => {
    checkAndResetDailyLimits();
  }, [checkAndResetDailyLimits]);

  const isPro = mode === 'professional' || (params?.lessonId as string || '').includes('mock');

  // ⏱️ DETECTAR MODO DE TIEMPO
  const timeMode = searchParams.get('timeMode') || 'basic';
  const initialSeconds = timeMode === 'advanced' ? 300 : timeMode === 'intermediate' ? 600 : 0;

  // ✅ CORRECCIÓN 2: El userId ahora es dinámico (Estado real)
  const [userId, setUserId] = useState<string>('estudiante_anonimo');

  useEffect(() => {
    // Al cargar la página, leemos quién es el usuario real
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUserId(storedUser);
    }
  }, []);

  // ========== ESTADOS GLOBALES EXPANDIDOS ==========
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ========== ESTADOS DE PAIRING DRILL ==========
  const [selectedLeft, setSelectedLeft] = useState<{ id: string; word: string } | null>(null);
  const [selectedRight, setSelectedRight] = useState<{ id: string; word: string } | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [shuffledLeft, setShuffledLeft] = useState<any[]>([]);
  const [shuffledRight, setShuffledRight] = useState<any[]>([]);

  // ========== ESTADÍSTICAS MEJORADAS ==========
  const [stats, setStats] = useState<LessonStats>({
    correctAnswers: 0,
    totalQuestionsAnswered: 0,
    xpAccumulated: 0,
    timeSpent: 0,
    accuracy: 0,
    streakCount: 0,
    perfectStages: 0,
    averageResponseTime: 0
  });

  // ========== ESTADOS DE EJERCICIOS ==========
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    text: string;
    explanation?: string;
    correctAnswer?: string;
    responseTime?: number;
  } | null>(null);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [sentenceBuilder, setSentenceBuilder] = useState<string[]>([]);
  const [wordPool, setWordPool] = useState<string[]>([]);
  const [lecturePartIndex, setLecturePartIndex] = useState(0);

  // ========== CARACTERÍSTICAS PRO ==========
  const [seconds, setSeconds] = useState(initialSeconds);
  
  // ========== RETOMAR LECCIÓN / PROGRESO GUARDADO ==========
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [pendingResumeState, setPendingResumeState] = useState<any>(null);
  const [isActive, setIsActive] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showHints, setShowHints] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // ========== CARACTERÍSTICAS NORMALES EXPANDIDAS ==========
  const [showProgress, setShowProgress] = useState(true);
  const [contentView, setContentView] = useState<'grid' | 'list'>('grid');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // ========== GESTIÓN DE RESPUESTAS Y HISTORIAL ==========
  const [answerHistory, setAnswerHistory] = useState<any[]>([]);
  const [responseStartTime, setResponseStartTime] = useState<number | null>(null);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [skipCount, setSkipCount] = useState(0);

  // ========== MODO OSCURO Y TEMAS ==========
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [fontSize, setFontSize] = useState(16);

  // ========== REFERENCIA PARA TRACKING ==========
  const responseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lectureStartTimeRef = useRef<number>(Date.now());

  // ============================================================================
  // ==================== FUNCIONES UTILIDAD BASE =============================
  // ============================================================================

  // [FUNCIÓN 1] Formatear tiempo
  const formatTime = useCallback((secs: number): string => {
    const mins = Math.floor(secs / 60);
    const rs = secs % 60;
    return `${mins}:${rs < 10 ? '0' : ''}${rs}`;
  }, []);

  // [FUNCIÓN 2] Normalizar texto
  const normalizeText = useCallback((text: string): string => {
    return text.trim().toLowerCase().replace(/\s+/g, ' ');
  }, []);

  // [FUNCIÓN 3] Calcular precisión
  const calculateAccuracy = useCallback((): number => {
    if (stats.totalQuestionsAnswered === 0) return 0;
    return Math.round((stats.correctAnswers / stats.totalQuestionsAnswered) * 100);
  }, [stats]);

  // [FUNCIÓN 4] Guardar en localStorage
  const saveToLocalStorage = useCallback((key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Error silenciado para producción
    }
  }, []);

  // [FUNCIÓN 5] Cargar desde localStorage
  const loadFromLocalStorage = useCallback((key: string, defaultValue: any = null): any => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      // Error silenciado para producción
      return defaultValue;
    }
  }, []);

  // [FUNCIÓN 6 - FALLBACK] Reproductor local en caso de desconexión
  const fallbackSpeakText = useCallback((text: string, rate: number = 0.9): void => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !soundEnabled) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Mapear idioma activo para el lector del navegador
    const langMap: Record<string, string> = { en: 'en-US', fr: 'fr-FR', zh: 'zh-CN' };
    const targetLang = langMap[activeLanguage] || 'en-US';
    
    // Seleccionar una voz que coincida con el idioma objetivo
    const targetVoice = voices.find(v => v.lang.startsWith(targetLang));
    if (targetVoice) utterance.voice = targetVoice;

    utterance.lang = targetLang;
    utterance.rate = rate * playbackSpeed;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [soundEnabled, playbackSpeed, activeLanguage, setSpeaking]);

  // [FUNCIÓN 6 - PREMIUM] Reproducir sonido ultra-realista con Google Cloud TTS
  const speakText = useCallback((text: string, rate: number = 0.9): void => {
    if (!soundEnabled) return;

    try {
      // Intentar reproducir voz ultra-realista mediante el backend
      const baseUrl = apiClient.defaults.baseURL || 'http://localhost:8000';
      const audioUrl = `${baseUrl}/api/v1/ai/tts?text=${encodeURIComponent(text)}&lang=${activeLanguage}`;
      
      const audio = new Audio(audioUrl);
      audio.playbackRate = playbackSpeed;
      audio.onplay = () => setSpeaking(true);
      audio.onended = () => setSpeaking(false);
      
      audio.onerror = (e) => {
        console.warn("⚠️ Google Cloud TTS no disponible o credencial inactiva. Usando sintetizador local:", e);
        setSpeaking(false);
        fallbackSpeakText(text, rate);
      };
      
      audio.play().catch(err => {
        console.warn("⚠️ Reproducción automática bloqueada por el navegador. Usando sintetizador local:", err);
        fallbackSpeakText(text, rate);
      });
      
    } catch (err) {
      console.warn("⚠️ Error al inicializar audio premium. Usando sintetizador local:", err);
      fallbackSpeakText(text, rate);
    }
  }, [soundEnabled, playbackSpeed, activeLanguage, setSpeaking, fallbackSpeakText]);

  const handleLeftClick = useCallback((item: { id: string; word: string }) => {
    if (matchedPairs.includes(item.id)) return;
    if (selectedLeft?.id === item.id) {
      setSelectedLeft(null);
      return;
    }
    setSelectedLeft(item);
    
    if (selectedRight) {
      if (item.id === selectedRight.id) {
        setMatchedPairs(prev => [...prev, item.id]);
        setSelectedLeft(null);
        setSelectedRight(null);
        if (soundEnabled) speakText("Excellent");
      } else {
        if (soundEnabled) speakText("Wrong");
        setSelectedLeft(null);
        setSelectedRight(null);
      }
    }
  }, [matchedPairs, selectedLeft, selectedRight, soundEnabled, speakText]);

  const handleRightClick = useCallback((item: { id: string; word: string }) => {
    if (matchedPairs.includes(item.id)) return;
    if (selectedRight?.id === item.id) {
      setSelectedRight(null);
      return;
    }
    setSelectedRight(item);
    
    if (selectedLeft) {
      if (item.id === selectedLeft.id) {
        setMatchedPairs(prev => [...prev, item.id]);
        setSelectedLeft(null);
        setSelectedRight(null);
        if (soundEnabled) speakText("Excellent");
      } else {
        if (soundEnabled) speakText("Wrong");
        setSelectedLeft(null);
        setSelectedRight(null);
      }
    }
  }, [matchedPairs, selectedLeft, selectedRight, soundEnabled, speakText]);

  // [FUNCIÓN 7] Detener reproducción de audio
  const stopSpeech = useCallback((): void => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [setSpeaking]);

  // [FUNCIÓN 8] Manejar salida de la lección
  const handleExit = useCallback((): void => {
    // GUARDAR PROGRESO AL SALIR
    const sessionState = {
      currentStageIndex,
      currentQuestionIndex,
      stats,
      answerHistory,
      timestamp: Date.now()
    };
    try {
      localStorage.setItem(`session_${params?.lessonId}`, JSON.stringify(sessionState));
    } catch(e){}

    if (lessonType === 'vocab') router.push('/dashboard/vocabulary'); 
    else if (isPro || (params?.lessonId as string || '').includes('mock')) router.push('/dashboard');
    else router.push('/dashboard');
  }, [router, isPro, lessonType, currentStageIndex, currentQuestionIndex, stats, answerHistory, params?.lessonId]);

  // [FUNCIÓN 9] Registrar evento analítico
  const trackEvent = useCallback((eventType: string, data: any): void => {
    const event: AnalyticsEvent = {
      type: eventType,
      timestamp: Date.now(),
      data
    };
    setAnalyticsEvents(prev => [...prev, event]);
  }, []);

  // [FUNCIÓN 10] Copiar texto al portapapeles
  const copyToClipboard = useCallback(async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      trackEvent('copy_text', { text });
    } catch (e) {
      // Error silenciado para producción
    }
  }, [trackEvent]);

  // ============================================================================
  // ==================== FUNCIONES PRO (50 NUEVAS) ===========================
  // ============================================================================

  // [PRO 1] Análisis avanzado de respuestas
  const analyzeAnswerPattern = useCallback((questionType: string): string => {
    const relevantAnswers = answerHistory.filter(a => a.type === questionType);
    const correctRate = relevantAnswers.length > 0
      ? (relevantAnswers.filter(a => a.isCorrect).length / relevantAnswers.length) * 100
      : 0;

    if (correctRate >= 90) return 'Dominado';
    if (correctRate >= 70) return 'Competente';
    if (correctRate >= 50) return 'Desarrollando';
    return 'Iniciante';
  }, [answerHistory]);

  // [PRO 2] Generar reporte detallado JSON
  const generateDetailedReport = useCallback((): string => {
    return JSON.stringify({
      lessonId: lesson?.id,
      userId,
      timestamp: new Date().toISOString(),
      totalTime: seconds,
      accuracy: calculateAccuracy(),
      stats,
      answerHistory,
      analyticsEvents,
      difficulty: lesson?.difficulty
    }, null, 2);
  }, [lesson, userId, seconds, stats, answerHistory, analyticsEvents, calculateAccuracy]);

  // [PRO 3] Exportar reporte a PDF
  const exportReportPDF = useCallback(async (): Promise<void> => {
    const report = generateDetailedReport();
    // Simulación - en producción usarías jsPDF
    // Exportación PDF procesada
    trackEvent('export_pdf', { size: report.length });
  }, [generateDetailedReport, trackEvent]);

  // [PRO 4] Compartir progreso en redes sociales
  const shareProgress = useCallback(async (platform: 'twitter' | 'linkedin'): Promise<void> => {
    const message = `¡Acabo de completar ${lesson?.title} con ${calculateAccuracy()}% de precisión en OnixLingo! 🎓`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=onixlingo.com`
    };

    if (typeof window !== 'undefined') {
      window.open(urls[platform], '_blank');
    }
    trackEvent('share_progress', { platform });
  }, [lesson, calculateAccuracy, trackEvent]);

  // [PRO 5] Análisis de patrones de errores
  const identifyWeakAreas = useCallback((): { category: string; weakness: number }[] => {
    const categoryStats: { [key: string]: { correct: number; total: number } } = {};

    answerHistory.forEach(answer => {
      const cat = answer.category || 'general';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { correct: 0, total: 0 };
      }
      categoryStats[cat].total++;
      if (answer.isCorrect) categoryStats[cat].correct++;
    });

    return Object.entries(categoryStats)
      .map(([cat, stats]) => ({
        category: cat,
        weakness: 100 - ((stats.correct / stats.total) * 100)
      }))
      .sort((a, b) => b.weakness - a.weakness);
  }, [answerHistory]);

  // [PRO 6] Recomendaciones personalizadas
  const getPersonalizedRecommendations = useCallback((): string[] => {
    const weakAreas = identifyWeakAreas();
    const recommendations: string[] = [];

    if (weakAreas[0]?.weakness > 40) {
      recommendations.push(`⚠️ Practica más: ${weakAreas[0].category}`);
    }
    if (calculateAccuracy() < 70) {
      recommendations.push('📚 Revisa la teoría antes de continuar');
    }
    if (stats.streakCount > 5) {
      recommendations.push('🔥 ¡Excelente racha! Mantén el momentum');
    }

    return recommendations;
  }, [identifyWeakAreas, calculateAccuracy, stats.streakCount]);

  // [PRO 7] Modo competitivo con ranking
  const getLeaderboardPosition = useCallback(async (): Promise<number> => {
    // Simulación de API call
    try {
      const response = await fetch(`${API_URL}/api/v1/leaderboard/${lesson?.id}`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        return data.position || 0;
      }
    } catch (e) {
      // Error silenciado
    }
    return 0;
  }, [lesson?.id]);

  // [PRO 8] Cálculo inteligente de XP con multiplicadores
  const calculateAdvancedXP = useCallback((isCorrect: boolean, difficulty: string, timeSpent: number): number => {
    let baseXP = isCorrect ? 10 : 0;

    // Multiplicador por dificultad
    const difficultyMultiplier = {
      easy: 1,
      medium: 1.5,
      hard: 2.5
    };

    // Bonus por velocidad (responder rápido)
    const speedBonus = timeSpent < 10 ? 5 : timeSpent < 20 ? 2 : 0;

    // Bonus por racha
    const streakBonus = stats.streakCount > 0 ? Math.min(stats.streakCount * 0.5, 5) : 0;

    return Math.round(
      baseXP * (difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier] || 1) +
      speedBonus +
      streakBonus
    );
  }, [stats.streakCount]);

  // [PRO 9] Sistema de logros desbloqueables
  const checkAchievements = useCallback((): string[] => {
    const achievements: string[] = [];

    if (calculateAccuracy() === 100) achievements.push('🏆 Perfeccionista');
    if (stats.streakCount >= 10) achievements.push('🔥 Racha Imparable');
    if (stats.perfectStages >= lesson?.stages.length! * 0.8) achievements.push('⭐ Maestría');
    if (seconds < 300 && stats.totalQuestionsAnswered >= 20) achievements.push('⚡ Velocista');
    if (hintsUsed === 0 && stats.correctAnswers > 0) achievements.push('🎯 Sin Ayuda');

    return achievements;
  }, [calculateAccuracy, stats, lesson, seconds, hintsUsed]);

  // [PRO 10] Grabación de sesión para reproducción
  const startSessionRecording = useCallback((): void => {
    lectureStartTimeRef.current = Date.now();
    trackEvent('session_recording_start', {});
  }, [trackEvent]);

  // [PRO 11] Análisis de tiempo de respuesta
  const analyzeResponseTimes = useCallback((): { average: number; median: number; fastest: number; slowest: number } => {
    const times = answerHistory.map(a => a.responseTime || 0).filter(t => t > 0);
    if (times.length === 0) return { average: 0, median: 0, fastest: 0, slowest: 0 };

    times.sort((a, b) => a - b);
    const average = Math.round(times.reduce((a, b) => a + b) / times.length);
    const median = times[Math.floor(times.length / 2)];

    return {
      average,
      median,
      fastest: times[0],
      slowest: times[times.length - 1]
    };
  }, [answerHistory]);

  // [PRO 12] Sistema de desafíos personalizados
  const generateCustomChallenge = useCallback((): { title: string; description: string; reward: number } => {
    const challenges = [
      { title: 'Racha de 5', description: 'Responde 5 preguntas correctas seguidas', reward: 50 },
      { title: 'Velocista', description: 'Completa 10 preguntas en menos de 30 segundos', reward: 100 },
      { title: 'Perfeccionista', description: 'Obtén 100% de precisión en 15 preguntas', reward: 150 }
    ];

    return challenges[Math.floor(Math.random() * challenges.length)];
  }, []);

  // [PRO 13] Comparativa con sesiones anteriores
  const compareWithPreviousSessions = useCallback(async (): Promise<any> => {
    const previousData = loadFromLocalStorage(`lesson_${lesson?.id}_history`, []);

    if (previousData.length === 0) return null;

    const lastSession = previousData[previousData.length - 1];
    return {
      accuracyDelta: calculateAccuracy() - (lastSession.accuracy || 0),
      timeDelta: seconds - (lastSession.timeSpent || 0),
      xpDelta: stats.xpAccumulated - (lastSession.xpAccumulated || 0),
      improved: calculateAccuracy() > (lastSession.accuracy || 0)
    };
  }, [lesson, calculateAccuracy, seconds, stats.xpAccumulated, loadFromLocalStorage]);

  // [PRO 14] Soporte para múltiples idiomas en pronunciación
  const getSpeechLanguage = useCallback((contentLanguage: string): string => {
    const langMap: { [key: string]: string } = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'pt': 'pt-BR',
      'ja': 'ja-JP'
    };
    return langMap[contentLanguage] || 'en-US';
  }, []);

  // [PRO 15] Generador de certificados
  const generateCertificate = useCallback((): string => {
    return `
      =====================================
      CERTIFICADO DE LOGRO
      =====================================
      Usuario: ${userId}
      Lección: ${lesson?.title}
      Precisión: ${calculateAccuracy()}%
      XP Ganado: ${stats.xpAccumulated}
      Fecha: ${new Date().toLocaleDateString()}
      =====================================
    `;
  }, [userId, lesson, calculateAccuracy, stats.xpAccumulated]);

  // [PRO 16] Modo oscuro avanzado con AMOLED
  const getThemeColors = useCallback((): { bg: string; fg: string; accent: string } => {
    const themes = {
      light: { bg: 'bg-slate-50', fg: 'text-slate-900', accent: 'bg-blue-600' },
      dark: { bg: 'bg-slate-950', fg: 'text-white', accent: 'bg-indigo-600' },
      amoled: { bg: 'bg-black', fg: 'text-white', accent: 'bg-indigo-500' }
    };
    return themes[colorScheme as keyof typeof themes] || themes.light;
  }, [colorScheme]);

  // [PRO 17] Micrófono para pronunciación
  const startPronunciationCheck = useCallback(async (): Promise<void> => {
    if (!('webkitSpeechRecognition' in window)) {
      // No soportado
      return;
    }

    trackEvent('pronunciation_check_start', {});
    // Implementación completa requeriría Web Speech API
    // Pronunciación iniciada
  }, [trackEvent]);

  // [PRO 18] Editor de notas avanzado con sincronización
  const saveNoteWithSync = useCallback(async (stageId: string, noteText: string): Promise<void> => {
    const newNotes = { ...notes, [stageId]: noteText };
    setNotes(newNotes);
    saveToLocalStorage(`notes_${lesson?.id}`, newNotes);
    trackEvent('note_saved', { stageId, length: noteText.length });
  }, [lesson, notes, saveToLocalStorage, trackEvent]);

  // [PRO 19] Sistema de pistas inteligentes (3 niveles)
  const getIntelligentHint = useCallback((question: QuizQuestion, hintLevel: 1 | 2 | 3 = 1): string => {
    const hints = question.hints || [];

    if (hints[hintLevel - 1]) return hints[hintLevel - 1];

    switch (hintLevel) {
      case 1:
        return `Mira la pregunta: "${question.question.substring(0, 20)}..."`;
      case 2:
        return `Respuesta tiene ${question.correct_answer?.length || 0} caracteres`;
      case 3:
        return `Primera letra: ${question.correct_answer?.charAt(0) || '?'}`;
      default:
        return 'No hay más pistas disponibles';
    }
  }, []);

  // [PRO 20] Gestor de almacenamiento en caché
  const cacheLesson = useCallback((): void => {
    saveToLocalStorage(`lesson_cache_${lesson?.id}`, {
      lesson,
      timestamp: Date.now()
    });
    trackEvent('lesson_cached', {});
  }, [lesson, saveToLocalStorage, trackEvent]);

  // [PRO 21] Sincronización en tiempo real con servidor
  const syncProgressRealtime = useCallback(async (): Promise<void> => {
    try {
      await fetch(`${API_URL}/api/v1/progress/realtime`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          lessonId: lesson?.id,
          stats,
          analyticsEvents
        })
      });
    } catch (e) {
      // Error sincronizando
    }
  }, [userId, lesson, stats, analyticsEvents]);

  // [PRO 22] Análisis de patrones de aprendizaje
  const identifyLearningPattern = useCallback((): string => {
    const correctRatio = calculateAccuracy() / 100;

    if (correctRatio >= 0.9) return 'Visual Learner - Responde rápido a ejercicios';
    if (stats.averageResponseTime > 30) return 'Analytical Learner - Necesita más tiempo para pensar';
    if (hintsUsed > stats.totalQuestionsAnswered * 0.3) return 'Support Learner - Usa muchas pistas';

    return 'Balanced Learner';
  }, [calculateAccuracy, stats, hintsUsed]);

  // [PRO 23] Generador de rutas de aprendizaje adaptativas
  const generateAdaptivePath = useCallback((): string[] => {
    const weakAreas = identifyWeakAreas();
    const path: string[] = [];

    if (weakAreas.length > 0) {
      path.push(`Repasa: ${weakAreas[0].category}`);
      path.push(`Practica: ${weakAreas[0].category} - Nivel Avanzado`);
    }

    path.push(`Siguiente lección recomendada`);
    return path;
  }, [identifyWeakAreas]);

  // [PRO 24] Integración con API de traducción
  const translateContent = useCallback(async (text: string, targetLang: string): Promise<string> => {
    // Simulación - en producción usarías Google Translate API
    trackEvent('translation_requested', { targetLang, textLength: text.length });
    return `[Translated to ${targetLang}]: ${text}`;
  }, [trackEvent]);

  // [PRO 25] Dashboard de analítica en tiempo real
  const getRealTimeAnalytics = useCallback((): any => {
    return {
      currentAccuracy: calculateAccuracy(),
      sessionTime: formatTime(seconds),
      questionsCompleted: stats.totalQuestionsAnswered,
      streakCurrent: stats.streakCount,
      xpRate: Math.round(stats.xpAccumulated / Math.max(seconds, 1) * 60),
      avgResponseTime: Math.round(stats.averageResponseTime)
    };
  }, [calculateAccuracy, formatTime, seconds, stats]);

  // [PRO 26] Exportar transcripción de lección
  const exportTranscript = useCallback((): string => {
    let transcript = `TRANSCRIPCIÓN DE: ${lesson?.title}\n`;
    transcript += `Generado: ${new Date().toLocaleString()}\n\n`;

    lesson?.stages.forEach((stage, idx) => {
      transcript += `--- ETAPA ${idx + 1}: ${stage.title} ---\n`;
      if (stage.parts) {
        stage.parts.forEach(part => {
          transcript += `${part.visual}\n`;
        });
      }
      transcript += '\n';
    });

    return transcript;
  }, [lesson]);

  // [PRO 27] Sistema de notificaciones push
  const sendPushNotification = useCallback((title: string, message: string): void => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
    trackEvent('notification_sent', { title });
  }, [trackEvent]);

  // [PRO 28] Integración de video tutorial contextual
  const loadContextualVideo = useCallback((concept: string): string => {
    // URL simulada
    return `https://videos.onixlingo.com/tutorials/${concept.replace(/\s+/g, '-')}`;
  }, []);

  // [PRO 29] Predicción de completación
  const predictCompletionTime = useCallback((): number => {
    const avgTimePerQuestion = stats.averageResponseTime || 15;
    const remainingQuestions = lesson?.stages.reduce((acc, stage) =>
      acc + (stage.questions?.length || 0), 0) || 0;

    return Math.round((remainingQuestions - stats.totalQuestionsAnswered) * avgTimePerQuestion);
  }, [stats, lesson]);

  // [PRO 30] Modo de repaso intensivo
  const enableIntensiveReviewMode = useCallback((): void => {
    const wrongAnswers = answerHistory.filter(a => !a.isCorrect);
    // Filtraría solo las preguntas mal respondidas
    trackEvent('intensive_review_activated', { questionCount: wrongAnswers.length });
  }, [answerHistory, trackEvent]);

  // [PRO 31] Generador de flashcards automáticos
  const generateFlashcards = useCallback((): any[] => {
    const flashcards: any[] = [];

    answerHistory.filter(a => !a.isCorrect).forEach(answer => {
      flashcards.push({
        question: answer.question,
        answer: answer.correctAnswer,
        difficulty: answer.difficulty || 'medium'
      });
    });

    return flashcards;
  }, [answerHistory]);

  // [PRO 32] Integración Spaced Repetition
  const scheduleSpacedRepetition = useCallback((questionId: string): Date => {
    const intervals = [1, 3, 7, 14, 30]; // días
    const lastReview = loadFromLocalStorage(`last_review_${questionId}`, null);

    if (!lastReview) {
      return new Date(Date.now() + intervals[0] * 24 * 60 * 60 * 1000);
    }

    const daysSinceReview = Math.floor((Date.now() - lastReview) / (24 * 60 * 60 * 1000));
    const nextInterval = intervals.find(i => i > daysSinceReview) || 30;

    return new Date(Date.now() + nextInterval * 24 * 60 * 60 * 1000);
  }, [loadFromLocalStorage]);

  // [PRO 33] Sistema de colaboración en grupo
  const shareWithStudyGroup = useCallback(async (groupId: string): Promise<void> => {
    try {
      await fetch(`${API_URL}/api/v1/study-groups/${groupId}/share`, {
        method: 'POST',
        body: JSON.stringify({
          userId,
          lessonId: lesson?.id,
          progress: stats
        })
      });
      trackEvent('shared_with_group', { groupId });
    } catch (e) {
      // Error compartiendo
    }
  }, [userId, lesson, stats, trackEvent]);

  // [PRO 34] Integración de IA para feedback personalizado
  const getAIFeedback = useCallback(async (answer: string, question: string): Promise<string> => {
    // Simulación - en producción llamarías a un modelo LLM
    trackEvent('ai_feedback_requested', { answerLength: answer.length });
    return `Feedback IA: Tu respuesta "${answer}" fue ${answer.length > 5 ? 'completa' : 'breve'}`;
  }, [trackEvent]);

  // [PRO 35] Gestor de sesiones guardadas
  const saveSessionState = useCallback((): void => {
    const sessionState = {
      currentStageIndex,
      currentQuestionIndex,
      stats,
      answerHistory,
      timestamp: Date.now()
    };
    saveToLocalStorage(`session_${lesson?.id}`, sessionState);
    trackEvent('session_saved', {});
  }, [currentStageIndex, currentQuestionIndex, stats, answerHistory, lesson, saveToLocalStorage, trackEvent]);

  // [PRO 36] Recuperación de sesiones previas
  const recoverPreviousSession = useCallback((): boolean => {
    const saved = loadFromLocalStorage(`session_${lesson?.id}`, null);

    if (saved && Date.now() - saved.timestamp < 24 * 60 * 60 * 1000) {
      setCurrentStageIndex(saved.currentStageIndex);
      setCurrentQuestionIndex(saved.currentQuestionIndex);
      setStats(saved.stats);
      setAnswerHistory(saved.answerHistory);
      return true;
    }
    return false;
  }, [lesson, loadFromLocalStorage]);

  // [PRO 37] Análisis de competencia por nivel
  const assessCompetencyLevel = useCallback((): 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' => {
    const accuracy = calculateAccuracy();
    const avgTime = stats.averageResponseTime;

    if (accuracy >= 95 && avgTime < 8) return 'C2';
    if (accuracy >= 85 && avgTime < 12) return 'C1';
    if (accuracy >= 75 && avgTime < 18) return 'B2';
    if (accuracy >= 65 && avgTime < 25) return 'B1';
    if (accuracy >= 50 && avgTime < 35) return 'A2';
    return 'A1';
  }, [calculateAccuracy, stats.averageResponseTime]);

  // [PRO 38] Exportar a formatos múltiples
  const exportInMultipleFormats = useCallback(async (formats: ('json' | 'csv' | 'pdf')[]): Promise<void> => {
    const report = generateDetailedReport();

    formats.forEach(format => {
      // Exportando formato
      trackEvent(`export_${format}`, {});
    });
  }, [generateDetailedReport, trackEvent]);

  // [PRO 39] Integración de gamificación avanzada
  const calculateBadges = useCallback((): string[] => {
    const badges: string[] = [];

    if (calculateAccuracy() >= 90) badges.push('🥇 Gold Badge');
    if (stats.streakCount > 20) badges.push('🔥 Streak Master');
    if (stats.perfectStages > lesson?.stages.length! * 0.5) badges.push('⭐ Stage Master');

    return badges;
  }, [calculateAccuracy, stats, lesson]);

  // [PRO 40] Sistema de puntos y niveles
  const calculatePlayerLevel = useCallback((): number => {
    return Math.floor(stats.xpAccumulated / 1000) + 1;
  }, [stats.xpAccumulated]);

  // [PRO 41] Sugerencias de mejora basadas en IA
  const getAIImprovementSuggestions = useCallback((): string[] => {
    const suggestions: string[] = [];
    const weakAreas = identifyWeakAreas();

    if (weakAreas[0]?.weakness > 50) {
      suggestions.push(`🎯 Enfócate en: ${weakAreas[0].category}`);
    }
    if (stats.averageResponseTime > 30) {
      suggestions.push('⚡ Intenta responder más rápido');
    }
    if (hintsUsed > stats.totalQuestionsAnswered * 0.5) {
      suggestions.push('💪 Intenta menos pistas, confía en ti');
    }

    return suggestions;
  }, [identifyWeakAreas, stats, hintsUsed]);

  // [PRO 42] Integración con calendario de estudio
  const scheduleStudyReminder = useCallback((daysFromNow: number): void => {
    const reminderDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
    saveToLocalStorage(`reminder_${lesson?.id}`, reminderDate.toISOString());
    trackEvent('study_reminder_scheduled', { daysFromNow });
  }, [lesson, saveToLocalStorage, trackEvent]);

  // [PRO 43] Análisis de interferencia de idiomas
  const analyzeLanguageInterference = useCallback((): string => {
    const errorPatterns = answerHistory.filter(a => !a.isCorrect).map(a => a.answer);

    if (errorPatterns.some(p => p && p.includes(' '))) {
      return 'Posible interferencia de estructura del español';
    }

    return 'Patrones de error normales';
  }, [answerHistory]);

  // [PRO 44] Sistema de mentoría
  const requestMentor = useCallback(async (topic: string): Promise<void> => {
    trackEvent('mentor_requested', { topic });
    // Mentor solicitado
  }, [trackEvent]);

  // [PRO 45] Análisis predictivo de éxito
  const predictSuccessRate = useCallback((): number => {
    if (stats.totalQuestionsAnswered < 10) return 0;

    const currentAccuracy = calculateAccuracy();
    const trend = answerHistory.length > 5
      ? answerHistory.slice(-5).filter(a => a.isCorrect).length / 5
      : 0.5;

    return Math.round((currentAccuracy + trend * 100) / 2);
  }, [stats, answerHistory, calculateAccuracy]);

  // [PRO 46] Integraciones externas (Slack, Teams)
  const sendToExternalPlatform = useCallback(async (platform: 'slack' | 'teams'): Promise<void> => {
    const message = `✅ Completé ${lesson?.title} con ${calculateAccuracy()}% precisión`;
    trackEvent('sent_to_external', { platform });
  }, [lesson, calculateAccuracy, trackEvent]);

  // [PRO 47] Modo de accesibilidad mejorado
  const enableAccessibilityMode = useCallback((): void => {
    setFontSize(20);
    setSubtitlesEnabled(true);
    trackEvent('accessibility_mode_enabled', {});
  }, []);

  // [PRO 48] Integración de biometría
  const authenticateWithBiometric = useCallback(async (): Promise<boolean> => {
    if (!window.isSecureContext) return false;

    try {
      // Simulación de WebAuthn
      trackEvent('biometric_auth_attempted', {});
      return true;
    } catch (e) {
      return false;
    }
  }, [trackEvent]);

  // [PRO 49] Almacenamiento encriptado de datos sensibles
  const saveEncryptedData = useCallback((key: string, data: any): void => {
    // En producción, usarías una librería como TweetNaCl.js
    const encrypted = btoa(JSON.stringify(data)); // Base64 encoding simple
    saveToLocalStorage(`encrypted_${key}`, encrypted);
    trackEvent('data_encrypted', {});
  }, [saveToLocalStorage, trackEvent]);

  // [PRO 50] Dashboard ejecutivo con KPIs
  const getExecutiveKPIs = useCallback((): any => {
    return {
      totalXP: stats.xpAccumulated,
      currentLevel: calculatePlayerLevel(),
      accuracy: calculateAccuracy(),
      completionRate: Math.round((currentStageIndex / (lesson?.stages.length || 1)) * 100),
      studyStreak: stats.streakCount,
      estimatedCompletion: predictCompletionTime(),
      learningPattern: identifyLearningPattern(),
      competencyLevel: assessCompetencyLevel()
    };
  }, [stats, calculatePlayerLevel, calculateAccuracy, currentStageIndex, lesson, predictCompletionTime, identifyLearningPattern, assessCompetencyLevel]);

  // ============================================================================
  // ==================== FUNCIONES NORMAL (25 NUEVAS) =========================
  // ============================================================================

  // [NORMAL 1] Cambiar vista (grid/list)
  const toggleViewMode = useCallback((): void => {
    setContentView(contentView === 'grid' ? 'list' : 'grid');
  }, [contentView]);

  // [NORMAL 2] Añadir bookmarks
  const addBookmark = useCallback((stageId: string): void => {
    setBookmarks(prev =>
      prev.includes(stageId)
        ? prev.filter(id => id !== stageId)
        : [...prev, stageId]
    );
  }, []);

  // [NORMAL 3] Cargar bookmarks guardados
  const loadSavedBookmarks = useCallback((): void => {
    const saved = loadFromLocalStorage(`bookmarks_${lesson?.id}`, []);
    setBookmarks(saved);
  }, [lesson, loadFromLocalStorage]);

  // [NORMAL 4] Guardar nota en etapa
  const addNoteToStage = useCallback((stageId: string, noteText: string): void => {
    setNotes(prev => ({ ...prev, [stageId]: noteText }));
    saveToLocalStorage(`notes_${lesson?.id}`, notes);
  }, [lesson, notes, saveToLocalStorage]);

  // [NORMAL 5] Filtrar por categoría
  const filterStagesByCategory = useCallback((category: string): void => {
    setFilterCategory(category === filterCategory ? null : category);
  }, [filterCategory]);

  // [NORMAL 6] Obtener estadísticas rápidas
  const getQuickStats = useCallback((): any => {
    return {
      correct: stats.correctAnswers,
      total: stats.totalQuestionsAnswered,
      accuracy: calculateAccuracy()
    };
  }, [stats, calculateAccuracy]);

  // [NORMAL 7] Reiniciar lección
  const restartLesson = useCallback((): void => {
    setCurrentStageIndex(0);
    setCurrentQuestionIndex(0);
    setStats({
      correctAnswers: 0,
      totalQuestionsAnswered: 0,
      xpAccumulated: 0,
      timeSpent: 0,
      accuracy: 0,
      streakCount: 0,
      perfectStages: 0,
      averageResponseTime: 0
    });
    setSeconds(0);
    setShowResults(false);
  }, []);

  // [NORMAL 8] Omitir pregunta
  const skipQuestion = useCallback((): void => {
    setSkipCount(prev => prev + 1);
    trackEvent('question_skipped', { questionIndex: currentQuestionIndex });
    nextQuestionOrStage();
  }, [currentQuestionIndex, trackEvent]);

  // [NORMAL 9] Obtener pista
  const requestHint = useCallback((question: QuizQuestion): string => {
    setHintsUsed(prev => prev + 1);
    trackEvent('hint_requested', { questionIndex: currentQuestionIndex });
    return getIntelligentHint(question);
  }, [currentQuestionIndex, trackEvent, getIntelligentHint]);

  // [NORMAL 10] Pausar lección
  const pauseLesson = useCallback((): void => {
    setIsActive(!isActive);
    trackEvent(isActive ? 'lesson_paused' : 'lesson_resumed', {});
  }, [isActive, trackEvent]);

  // [NORMAL 11] Obtener lista de preguntas respondidas
  const getAnsweredQuestions = useCallback((): any[] => {
    return answerHistory.map(answer => ({
      ...answer,
      correct: answer.isCorrect
    }));
  }, [answerHistory]);

  // [NORMAL 12] Mostrar resumen por etapa
  const getStagesSummary = useCallback((): any[] => {
    return lesson?.stages.map((stage, idx) => ({
      stageName: stage.title,
      questionCount: stage.questions?.length || 0,
      completed: idx <= currentStageIndex
    })) || [];
  }, [lesson, currentStageIndex]);

  // [NORMAL 13] Cambiar velocidad de reproducción
  const setPlaybackSpeedValue = useCallback((speed: number): void => {
    setPlaybackSpeed(Math.max(0.5, Math.min(2, speed)));
  }, []);

  // [NORMAL 14] Alternar subtítulos
  const toggleSubtitles = useCallback((): void => {
    setSubtitlesEnabled(!subtitlesEnabled);
  }, [subtitlesEnabled]);

  // [NORMAL 15] Alternar sonido
  const toggleSound = useCallback((): void => {
    setSoundEnabled(!soundEnabled);
    stopSpeech();
  }, [soundEnabled, stopSpeech]);

  // [NORMAL 16] Obtener tiempo total gastado
  const getTotalTimeSpent = useCallback((): string => {
    return formatTime(seconds);
  }, [seconds, formatTime]);

  // [NORMAL 17] Mostrar retroalimentación visual
  const showVisualFeedback = useCallback((isCorrect: boolean): void => {
    trackEvent('visual_feedback_shown', { isCorrect });
  }, [trackEvent]);

  // [NORMAL 18] Reproducción de video de explicación
  const playExplanationVideo = useCallback((videoId: string): void => {
    trackEvent('explanation_video_played', { videoId });
    // Reproduciendo
  }, [trackEvent]);

  // [NORMAL 19] Limpiar datos locales
  const clearLocalData = useCallback((): void => {
    setAnswerHistory([]);
    setNotes({});
    setBookmarks([]);
    trackEvent('local_data_cleared', {});
  }, [trackEvent]);

  // [NORMAL 20] Obtener progreso en porcentaje
  const getProgressPercentage = useCallback((): number => {
    if (!lesson) return 0;
    
    // 1. Calcular total de pasos en toda la lección
    let total = 0;
    for (const stage of lesson.stages) {
      if (stage.type === 'theory' && stage.parts) {
        total += stage.parts.length;
      } else if (stage.type === 'pairing_drill') {
        total += 1;
      } else if ((stage.type === 'quiz' || stage.type === 'gamified_quiz') && stage.questions) {
        total += stage.questions.length;
      } else {
        total += 1;
      }
    }
    
    if (total === 0) return 0;
    
    // 2. Calcular pasos completados hasta el momento actual
    let current = 0;
    for (let i = 0; i < currentStageIndex; i++) {
      const stage = lesson.stages[i];
      if (stage.type === 'theory' && stage.parts) {
        current += stage.parts.length;
      } else if (stage.type === 'pairing_drill') {
        current += 1;
      } else if ((stage.type === 'quiz' || stage.type === 'gamified_quiz') && stage.questions) {
        current += stage.questions.length;
      } else {
        current += 1;
      }
    }
    
    // Añadir progreso de la etapa actual
    const currentStage = lesson.stages[currentStageIndex];
    if (currentStage) {
      if (currentStage.type === 'theory') {
        current += lecturePartIndex;
      } else if (currentStage.type === 'pairing_drill') {
        const totalPairs = (currentStage as any).pairs?.length || 1;
        current += matchedPairs.length / totalPairs;
      } else if ((currentStage.type === 'quiz' || currentStage.type === 'gamified_quiz') && currentStage.questions) {
        current += currentQuestionIndex;
      }
    }
    
    return Math.round((current / total) * 100);
  }, [lesson, currentStageIndex, lecturePartIndex, currentQuestionIndex, matchedPairs.length]);

  // [NORMAL 21] Validar entrada de usuario
  const validateUserInput = useCallback((input: string): { valid: boolean; message: string } => {
    if (!input || input.trim().length === 0) {
      return { valid: false, message: 'La respuesta no puede estar vacía' };
    }
    if (input.length > 500) {
      return { valid: false, message: 'La respuesta es muy larga' };
    }
    return { valid: true, message: 'Validación exitosa' };
  }, []);

  // [NORMAL 22] Obtener categorías disponibles
  const getAvailableCategories = useCallback((): string[] => {
    const categories = new Set<string>();
    lesson?.stages.forEach(stage => {
      stage.tags?.forEach(tag => categories.add(tag));
    });
    return Array.from(categories);
  }, [lesson]);

  // [NORMAL 23] Reproducir sonido de éxito/error
  const playFeedbackSound = useCallback((isCorrect: boolean): void => {
    const sound = isCorrect ? 'success' : 'error';
    trackEvent('feedback_sound_played', { sound });
  }, [trackEvent]);

  // [NORMAL 24] Obtener sugerencia rápida
  const getQuickTip = useCallback((): string => {
    const tips = [
      '💡 Lee la pregunta cuidadosamente',
      '🎧 Escucha la pronunciación',
      '📝 Escribe respuestas completas',
      '⏱️ No te apures, tienes tiempo',
      '🔄 Revisa tu respuesta antes de enviar'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }, []);

  // [NORMAL 25] Exportar notas como texto
  const exportNotesAsText = useCallback((): string => {
    let notesText = `NOTAS DE: ${lesson?.title}\n`;
    notesText += `Generado: ${new Date().toLocaleString()}\n\n`;

    Object.entries(notes).forEach(([stageId, noteText]) => {
      notesText += `--- Nota para etapa ${stageId} ---\n${noteText}\n\n`;
    });

    return notesText;
  }, [lesson, notes]);

  // ============================================================================
  // ==================== EFECTO PARA CRONÓMETRO ==============================
  // ============================================================================

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => {
          if (timeMode !== 'basic') {
            if (s <= 1) {
              clearInterval(interval);
              finishLesson(); // Finalizar examen al agotarse el tiempo
              return 0;
            }
            return s - 1;
          } else {
            return s + 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeMode]);

  // ============================================================================
  // ==================== EFECTO PARA CARGA DE LECCIÓN =======================
  // ============================================================================


  useEffect(() => {
    const initLesson = async () => {
      try {
        const lessonId = params?.lessonId as string;
        if (!lessonId) throw new Error("ID inválido");

        const { data } = await apiClient.get(`/lessons/${lessonId}?lang=${activeLanguage}`);

        const normalizedStages = data.stages.map((s: any) => {
          if (s.type === 'lecture' && s.content && !s.parts) {
            s.parts = [{ visual: s.content.visual || s.content.text, audio: s.content.audio || "" }];
          }
          if ((s.type === 'gamified_quiz' || s.type === 'quiz') && s.content?.questions && !s.questions) {
            s.questions = s.content.questions;
          }
          return s;
        });

        data.stages = normalizedStages;
        setLesson(data);

        // estas llamadas NO deben meter dependencias nuevas:
        const savedSession = loadFromLocalStorage(`session_${lessonId}`, null);
        if (savedSession && Date.now() - savedSession.timestamp < 24 * 60 * 60 * 1000) {
          setPendingResumeState(savedSession);
          setShowResumePrompt(true);
        }
        loadSavedBookmarks();       // useCallback
      } catch (err: any) {
        setError(err.message || "No se pudo cargar la lección");
      } finally {
        setLoading(false);
      }
    };

    initLesson();
    // 👇 IMPORTANTE: sin lesson?.id ni otras refs inestables
  }, [params?.lessonId, isPro, activeLanguage]);


  // ============================================================================
  // ==================== EFECTO PARA INICIALIZAR PREGUNTA ====================
  // ============================================================================

  useEffect(() => {
    if (!lesson) return;
    const stage = lesson.stages[currentStageIndex];
    if (stage?.questions) {
      const q = stage.questions[currentQuestionIndex];
      if (q.type === 'order_sentence' && q.parts) {
        setWordPool([...q.parts]);
        setSentenceBuilder([]);
      }
      setTextInput('');
      setSelectedOption(null);
      setFeedback(null);
      setResponseStartTime(Date.now());
    }
  }, [currentStageIndex, currentQuestionIndex, lesson]);

  // ============================================================================
  // ==================== EFECTO PARA PAIRING DRILL ===========================
  // ============================================================================

  useEffect(() => {
    if (!lesson) return;
    const stage = lesson.stages[currentStageIndex];
    if (stage?.type === 'pairing_drill') {
      const pairs = (stage as any).pairs || [];
      const leftItems = pairs.map((p: any) => ({ id: p.id, word: p.en }));
      const rightItems = pairs.map((p: any) => ({ id: p.id, word: p.es || p.fr }));
      
      setShuffledLeft([...leftItems].sort(() => Math.random() - 0.5));
      setShuffledRight([...rightItems].sort(() => Math.random() - 0.5));
      setSelectedLeft(null);
      setSelectedRight(null);
      setMatchedPairs([]);
    }
  }, [currentStageIndex, lesson]);

  // ============================================================================
  // ==================== FUNCIÓN FINALIZAR LECCIÓN (CONECTADA) =================
  // ============================================================================

  const finishLesson = async () => {
    setIsActive(false);
    setIsSaving(true);

    // Consume 50% de energía si es plan gratuito
    const { consumeEnergy, userTier } = useUIStore.getState();
    if (userTier === 'free') {
      consumeEnergy(50);
    }

    // Calcular métricas finales
    const accuracy = stats.totalQuestionsAnswered > 0
      ? Math.round((stats.correctAnswers / stats.totalQuestionsAnswered) * 100)
      : 0;

    const baseXP = lesson?.total_xp || 100;
    const totalXP = baseXP + stats.xpAccumulated; // XP total ganado en esta sesión

    // 1. Calcular total de preguntas reales
    const totalQuestions = lesson?.stages.reduce((acc, stage) =>
      acc + (stage.questions ? stage.questions.length : 1), 0) || 1;

    const payload = {
      lesson_id: lesson?.id,
      lesson_type: lessonType,
      current_step: totalQuestions, // Enviamos que completó todo
      total_steps: totalQuestions,
      score: accuracy,
      stars: accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1
    };

    try {
      // LLAMADA AL BACKEND PARA GUARDAR Y DESBLOQUEAR
      await apiClient.post('/progress/complete', payload);
      // Progreso guardado

      // 2. GUARDADO LOCAL (FALLBACK Y UI RAPIDA)
      const progress: UserProgress = {
        userId,
        lessonId: lesson?.id || '',
        completedAt: new Date().toISOString(),
        score: accuracy,
        xpEarned: totalXP,
        timeSpent: seconds,
        answers: answerHistory,
        difficulty: lesson?.difficulty || 'medium'
      };

      saveToLocalStorage(`progress_${lesson?.id}`, progress);

    } catch (error) {
      // Error crítico manejado
    } finally {
      setIsSaving(false);
      setShowResults(true); // Muestra la pantalla de "Lección Completada"
    }
  };


  // ============================================================================
  // ==================== FUNCIÓN SIGUIENTE ETAPA ============================
  // ============================================================================

  const nextStage = () => {
    if (!lesson) return;
    if (currentStageIndex < lesson.stages.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
      setLecturePartIndex(0);
    } else {
      finishLesson();
    }
  };

  // ============================================================================
  // ==================== FUNCIÓN SIGUIENTE PREGUNTA ==========================
  // ============================================================================

  const nextQuestionOrStage = () => {
    setFeedback(null);
    if (lesson?.stages[currentStageIndex].questions && currentQuestionIndex < (lesson.stages[currentStageIndex].questions!.length - 1)) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      nextStage();
    }
  };

  // ============================================================================
  // ==================== FUNCIÓN MANEJAR PALABRAS ============================
  // ============================================================================

  const handleWordClick = (word: string, index: number, fromPool: boolean) => {
    if (feedback) return;
    if (fromPool) {
      const newPool = [...wordPool];
      newPool.splice(index, 1);
      setWordPool(newPool);
      setSentenceBuilder([...sentenceBuilder, word]);
    } else {
      const newBuilder = [...sentenceBuilder];
      newBuilder.splice(index, 1);
      setSentenceBuilder(newBuilder);
      setWordPool([...wordPool, word]);
    }
  };

  // ============================================================================
  // ==================== FUNCIÓN VALIDAR RESPUESTA ===========================
  // ============================================================================

  const validateAnswer = (question: QuizQuestion) => {
    let isCorrect = false;
    const clean = (str: string) => (str ? str.trim() : "");

    // Tiempo de respuesta en segundos
    const responseTime = responseStartTime
      ? Math.floor((Date.now() - responseStartTime) / 1000)
      : 0;

    // --- 1. LÓGICA DE CORRECCIÓN ---
    if (
      question.type === "quiz_choice" ||
      question.type === "listening_match" ||
      (!question.type && question.options)
    ) {
      isCorrect =
        normalizeText(selectedOption || "") ===
        normalizeText(question.correct_answer || "");
    } else if (question.type === "fill_input") {
      const answers = question.correct_answers || [question.correct_answer || ""];
      isCorrect = answers.some(
        (ans) => normalizeText(ans) === normalizeText(textInput)
      );
    } else if (question.type === "order_sentence") {
      if (question.correct_order) {
        isCorrect =
          JSON.stringify(sentenceBuilder) ===
          JSON.stringify(question.correct_order);
      } else {
        isCorrect =
          normalizeText(sentenceBuilder.join(" ")) ===
          normalizeText(question.correct_answer || "");
      }
    }

    // --- 2. CÁLCULO DE XP ---
    const xpGained = isPro
      ? calculateAdvancedXP(isCorrect, question.difficulty || "medium", responseTime)
      : isCorrect
        ? 10
        : 0;

    // --- 3. ACTUALIZAR ESTADÍSTICAS ---
    setStats((prev) => ({
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
      xpAccumulated: prev.xpAccumulated + xpGained,
      timeSpent: prev.timeSpent + responseTime,
      // accuracy se recalcula después, pero si quieres aquí:
      accuracy:
        prev.totalQuestionsAnswered + 1 > 0
          ? Math.round(
            ((prev.correctAnswers + (isCorrect ? 1 : 0)) /
              (prev.totalQuestionsAnswered + 1)) *
            100
          )
          : 0,
      streakCount: isCorrect ? prev.streakCount + 1 : 0,
      perfectStages: prev.perfectStages,
      averageResponseTime:
        prev.totalQuestionsAnswered + 1 > 0
          ? Math.round(
            (prev.averageResponseTime * prev.totalQuestionsAnswered +
              responseTime) /
            (prev.totalQuestionsAnswered + 1)
          )
          : responseTime,
    }));

    // --- 4. GUARDAR EN HISTORIAL ---
    setAnswerHistory((prev) => [
      ...prev,
      {
        question: question.question,
        answer:
          selectedOption ||
          textInput ||
          sentenceBuilder.join(" "),
        correctAnswer:
          question.correct_answer ||
          (question.correct_order
            ? question.correct_order.join(" ")
            : ""),
        isCorrect,
        responseTime,
        difficulty: question.difficulty,
        category: question.category,
        type: question.type,
      },
    ]);

    // --- 5. SETEAR FEEDBACK PARA MOSTRAR EN UI ---
    setFeedback({
      isCorrect,
      text: isCorrect ? "¡Excelente! 🎉" : "Respuesta Incorrecta",
      explanation: question.explanation,
      correctAnswer: isCorrect
        ? undefined
        : question.correct_answer ||
        (question.correct_order
          ? question.correct_order.join(" ")
          : ""),
      responseTime,
    });

    // --- 6. AUDIO OPCIONAL ---
    if (soundEnabled) {
      speakText(isCorrect ? "Correct!" : "Check the explanation.");
    }

    // --- 7. AUTO-SAVE SESIÓN EN PRO ---
    if (isPro) {
      saveSessionState();
    }
  };


  // ============================================================================
  // ==================== RENDERS CONDICIONALES ==============================
  // ============================================================================

  if (userTier === 'free' && energy < 50) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-teal-500"></div>
        
        <div className="bg-slate-950/80 border border-slate-800 p-10 max-w-md w-full shadow-2xl rounded-none text-center relative z-10 backdrop-blur-md">
          <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto mb-6">
            <Zap size={32} className="animate-pulse" />
          </div>
          <h2 className="text-xl font-serif font-black italic uppercase tracking-wider text-teal-400 mb-2">
            Energía Insuficiente
          </h2>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-8 uppercase tracking-wider">
            Completar una lección normal consume 50% de energía. Tu energía actual es de {energy}%.
          </p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.push('/dashboard/pricing')}
              className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white font-black text-[9px] uppercase tracking-[0.2em] transition-all rounded-none shadow-lg shadow-teal-600/30"
            >
              Subir a Pro / Executive
            </button>
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 border border-slate-700 bg-transparent text-slate-400 hover:text-white font-black text-[9px] uppercase tracking-[0.2em] transition-all rounded-none"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-bold animate-pulse">
      <Zap className="mr-3 animate-spin" /> Cargando Lección...
    </div>
  );

  if (isSaving) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-bold">
      <Save className="animate-bounce mr-2" /> Guardando Progreso...
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-slate-50">
      <AlertTriangle size={48} className="text-red-500 mb-4" />
      <h2 className="text-xl font-bold text-slate-800 mb-2">Error de Conexión</h2>
      <p className="text-slate-500 mb-4 text-center">{error}</p>
      <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">
        Reintentar
      </button>
    </div>
  );

  if (showResults) {
    const finalAccuracy = stats.totalQuestionsAnswered > 0
      ? Math.round((stats.correctAnswers / stats.totalQuestionsAnswered) * 100)
      : 0;
    const finalXP = (lesson?.total_xp || 100) + stats.xpAccumulated;

    return (
      <LessonComplete
        xpEarned={finalXP}
        accuracy={finalAccuracy}
        lessonId={lesson?.id || ''}       // 👈 Necesario
        lessonType={lessonType as any}    // 👈 CRÍTICO para navegación
        totalSteps={lesson?.stages.length || 1}
        onRetry={restartLesson} // 👈 Usa la función optimizada que ya creaste
        onExit={handleExit}               // 👈 Conecta tu función de salida
        answerHistory={answerHistory}     // 👈 NUEVO: historial de respuestas para el reporte y certificado
      />
    );
  }

  const currentStage = lesson?.stages[currentStageIndex];
  if (!currentStage) return null;

  // ============================================================================
  // ==================== RENDER PRINCIPAL ====================================
  // ============================================================================

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isPro ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`} style={{ fontSize: `${fontSize}px` }}>

      {/* HEADER */}
      {isPro ? (
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={handleExit} className="p-2 hover:bg-white/10 rounded-none transition-colors text-slate-400 hover:text-white">
              <X size={24} />
            </button>
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-teal-500 font-black font-serif italic">Titanium Executive</span>
              <div className="flex items-center gap-2 text-teal-400 text-xs font-black">
                <Zap size={12} fill="currentColor" /> {stats.correctAnswers} ACIERTOS
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {showAnalytics && (
              <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2 rounded-none border border-slate-700 text-[10px] font-black uppercase">
                <div>⚡ {Math.round(stats.xpAccumulated / Math.max(seconds, 1) * 60)} XP/min</div>
                <div>📊 {calculateAccuracy()}%</div>
              </div>
            )}
            <div className={`flex items-center gap-3 px-4 py-2 rounded-none border shadow-inner transition-colors duration-300 ${timeMode !== 'basic' && seconds < 60 ? 'bg-red-950/80 border-red-800 animate-pulse' : 'bg-slate-800/80 border-slate-700'}`}>
              <Clock size={16} className={timeMode !== 'basic' && seconds < 60 ? 'text-red-400 animate-bounce' : 'text-teal-400'} />
              <span className={`font-mono text-xl font-black tracking-widest ${timeMode !== 'basic' && seconds < 60 ? 'text-red-200' : 'text-teal-50'}`}>{formatTime(seconds)}</span>
            </div>
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 hover:bg-white/10 rounded-none border border-transparent hover:border-slate-700">
              <Settings size={20} />
            </button>
          </div>
        </header>
      ) : (
        <header className="h-12 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={handleExit} className="text-slate-400 hover:text-amber-600 transition-colors"><X size={20} /></button>
            {userTier === 'free' && (
              <div className="flex items-center">
                {/* Cuerpo de la Batería */}
                <div className="relative w-12 h-4 bg-slate-950 rounded-[4px] border border-slate-700 p-0.5 flex items-center shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.8)] overflow-hidden">
                  <div 
                    className={`h-full rounded-[2px] transition-all duration-500 ${
                      energy > 50 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                        : energy > 20 
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                          : 'bg-gradient-to-r from-rose-600 to-rose-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]'
                    }`}
                    style={{ width: `${energy}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white font-mono leading-none tracking-wider drop-shadow-[0_1.5px_2px_rgba(0,0,0,1)]">
                    {energy}%
                  </span>
                </div>
                {/* Polo Positivo */}
                <div className="w-[2px] h-2 bg-slate-700 rounded-r-[1.5px] -ml-[1px] shadow-sm shrink-0" />
              </div>
            )}
            {timeMode !== 'basic' && (
              <div className={`flex items-center gap-1.5 px-3 py-1 border transition-colors ${seconds < 60 ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                <Clock size={12} className="animate-pulse" />
                <span className="font-mono text-[10px] font-black tracking-wider">{formatTime(seconds)}</span>
              </div>
            )}
          </div>
          <div className="w-1/3 h-1 bg-slate-100 rounded-none overflow-hidden">
            <div className="h-full bg-amber-600 transition-all duration-500" style={{ width: `${getProgressPercentage()}%` }}></div>
          </div>
          <span className="font-black text-slate-800 hidden sm:block truncate w-48 text-right text-[10px] uppercase tracking-widest font-serif italic">{lesson?.title}</span>
        </header>
      )}

      {/* SETTINGS MODAL PRO */}
      {isPro && showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">⚙️ Configuración PRO</h2>
              <button onClick={() => setShowSettings(false)}><X /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold mb-2 block">Velocidad de reproducción: {playbackSpeed}x</label>
                <input type="range" min="0.5" max="2" step="0.25" value={playbackSpeed} onChange={(e) => setPlaybackSpeedValue(parseFloat(e.target.value))} className="w-full" />
              </div>

              <div>
                <label className="text-sm font-bold mb-2 block">Tamaño de fuente: {fontSize}px</label>
                <input type="range" min="12" max="24" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full" />
              </div>

              <button onClick={() => toggleSound()} className={`w-full py-2 px-4 rounded-lg flex items-center gap-2 justify-center ${soundEnabled ? 'bg-emerald-600' : 'bg-red-600'}`}>
                {soundEnabled ? <Volume2 size={18} /> : <MicOff size={18} />} Sonido
              </button>

              <button onClick={() => toggleSubtitles()} className={`w-full py-2 px-4 rounded-lg flex items-center gap-2 justify-center ${subtitlesEnabled ? 'bg-emerald-600' : 'bg-red-600'}`}>
                {subtitlesEnabled ? <Eye size={18} /> : <EyeOff size={18} />} Subtítulos
              </button>

              <button onClick={() => setShowAnalytics(!showAnalytics)} className={`w-full py-2 px-4 rounded-lg flex items-center gap-2 justify-center ${showAnalytics ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                <BarChart3 size={18} /> Analítica
              </button>

              <button onClick={() => enableAccessibilityMode()} className="w-full py-2 px-4 rounded-lg bg-indigo-600 flex items-center gap-2 justify-center">
                <Check size={18} /> Modo Accesibilidad
              </button>

              <button onClick={() => exportReportPDF()} className="w-full py-2 px-4 rounded-lg bg-amber-600 flex items-center gap-2 justify-center">
                <Download size={18} /> Exportar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIÁLOGO INTERACTIVO PARA RETOMAR SESIÓN GUARDADA */}
      {showResumePrompt && pendingResumeState && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border-2 border-amber-950 p-6 md:p-8 max-w-md w-full shadow-2xl text-center rounded-none relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
            <div className="flex justify-center mb-4 text-amber-500">
              <Sparkles size={40} className="animate-pulse" />
            </div>
            <h3 className="text-sm font-serif font-black italic uppercase tracking-wider text-amber-400 mb-2">¿Deseas retomar tu intento?</h3>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-6">
              Hemos detectado un progreso guardado del <span className="text-white font-mono font-black">{new Date(pendingResumeState.timestamp).toLocaleDateString()}</span>. ¿Prefieres reanudar tu examen desde la etapa donde estabas o comenzar uno nuevo de cero?
            </p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  setCurrentStageIndex(pendingResumeState.currentStageIndex);
                  setCurrentQuestionIndex(pendingResumeState.currentQuestionIndex);
                  setStats(pendingResumeState.stats);
                  setAnswerHistory(pendingResumeState.answerHistory);
                  setShowResumePrompt(false);
                }} 
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-black text-[10px] uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-1.5"
              >
                SÍ, REANUDAR EXAMEN <ChevronRight size={14} />
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem(`session_${params.lessonId}`);
                  setSeconds(initialSeconds);
                  setShowResumePrompt(false);
                }} 
                className="w-full py-2.5 border border-slate-700 bg-transparent text-slate-400 hover:text-white font-black text-[9px] uppercase tracking-widest transition-all rounded-none"
              >
                NO, COMENZAR DE CERO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 flex justify-center overflow-y-auto relative">

        {/* Efectos de fondo Pro */}
        {isPro && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] animate-pulse delay-700"></div>
          </div>
        )}

        {/* MODO 1: LECTURE */}
        {(currentStage.type === 'lecture' || currentStage.type === 'theory') && currentStage.parts && (
          <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in relative z-10">
            <div className={`rounded-none border-2 shadow-sm relative min-h-[400px] flex items-end justify-center overflow-hidden ${isPro ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <div className="absolute inset-0"><Avatar3D /></div>
            </div>
            <div className="flex flex-col justify-center">
              <div className={`p-8 rounded-none border ${isPro ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-4">
                   <Zap size={14} className="text-teal-600" />
                   <h2 className={`text-xs font-black uppercase tracking-[0.3em] font-serif italic ${isPro ? 'text-teal-400' : 'text-slate-800'}`}>{currentStage.title}</h2>
                </div>
                <div className={`text-sm font-black uppercase tracking-widest mb-8 leading-relaxed opacity-80 ${isPro ? 'text-slate-400' : 'text-slate-500'}`}>
                  {currentStage.parts[lecturePartIndex]?.visual}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => speakText(currentStage.parts![lecturePartIndex]?.audio)} className={`p-4 rounded-none border transition-colors ${isPro ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-white' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'}`}>
                    <Volume2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (lecturePartIndex < (currentStage.parts?.length || 0) - 1) setLecturePartIndex(prev => prev + 1);
                      else nextStage();
                    }}
                    className={`flex-1 font-black py-4 rounded-none flex justify-center gap-3 text-[10px] uppercase tracking-[0.2em] transition-all ${isPro ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-900/20' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}
                  >
                    SIGUIENTE FASE <ArrowRight size={14} />
                  </button>
                </div>

                {isPro && (
                  <div className="mt-6 flex gap-2">
                    <button onClick={() => addBookmark(currentStage.id)} className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${bookmarks.includes(currentStage.id) ? 'bg-amber-600' : 'bg-slate-700'}`}>
                      <Heart size={16} /> {bookmarks.includes(currentStage.id) ? 'Guardado' : 'Guardar'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODO: PAIRING DRILL */}
        {currentStage.type === 'pairing_drill' && (
          <div className="max-w-2xl w-full flex flex-col justify-center animate-in zoom-in-95 relative z-10">
            <div className={`p-8 rounded-none border ${isPro ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                 <Zap size={14} className="text-teal-600" />
                 <h2 className={`text-xs font-black uppercase tracking-[0.3em] font-serif italic ${isPro ? 'text-teal-400' : 'text-slate-800'}`}>{currentStage.title || "Vocabulario Clé"}</h2>
              </div>
              
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Empareja cada palabra en inglés con su traducción en francés:</p>
              
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Columna Izquierda: Inglés */}
                <div className="space-y-4">
                  {shuffledLeft.map((item) => {
                    const isMatched = matchedPairs.includes(item.id);
                    const isSelected = selectedLeft?.id === item.id;
                    return (
                      <button
                        key={`left-${item.id}`}
                        onClick={() => handleLeftClick(item)}
                        disabled={isMatched}
                        className={`w-full p-4 border-2 text-center font-bold text-xs uppercase tracking-wider transition-all
                          ${isMatched 
                            ? 'bg-emerald-950/20 border-emerald-600 text-emerald-500 opacity-60 cursor-not-allowed'
                            : isSelected
                              ? 'bg-amber-900/20 border-amber-600 text-amber-500 scale-[0.98]'
                              : isPro ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-600' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-400'
                          }
                        `}
                      >
                        {item.word}
                      </button>
                    );
                  })}
                </div>

                {/* Columna Derecha: Francés */}
                <div className="space-y-4">
                  {shuffledRight.map((item) => {
                    const isMatched = matchedPairs.includes(item.id);
                    const isSelected = selectedRight?.id === item.id;
                    return (
                      <button
                        key={`right-${item.id}`}
                        onClick={() => handleRightClick(item)}
                        disabled={isMatched}
                        className={`w-full p-4 border-2 text-center font-bold text-xs uppercase tracking-wider transition-all
                          ${isMatched 
                            ? 'bg-emerald-950/20 border-emerald-600 text-emerald-500 opacity-60 cursor-not-allowed'
                            : isSelected
                              ? 'bg-amber-900/20 border-amber-600 text-amber-500 scale-[0.98]'
                              : isPro ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-600' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-400'
                          }
                        `}
                      >
                        {item.word}
                      </button>
                    );
                  })}
                </div>
              </div>

              {matchedPairs.length > 0 && matchedPairs.length === ((currentStage as any).pairs?.length || 0) ? (
                <div className="animate-in fade-in duration-300">
                  <div className={`p-4 mb-6 rounded-none text-center font-bold text-xs uppercase tracking-wider ${isPro ? 'bg-emerald-950/30 border border-emerald-500 text-emerald-400' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'}`}>
                    🎉 ¡Perfecto! Todas las parejas han sido emparejadas con éxito.
                  </div>
                  <button
                    onClick={nextStage}
                    className={`w-full font-black py-4 rounded-none flex justify-center gap-3 text-[10px] uppercase tracking-[0.2em] transition-all bg-amber-600 hover:bg-amber-700 text-white shadow-lg`}
                  >
                    CONTINUAR A LA SIGUIENTE FASE <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <button
                  disabled
                  className="w-full font-black py-4 rounded-none flex justify-center gap-3 text-[10px] uppercase tracking-[0.2em] bg-slate-800 text-slate-600 cursor-not-allowed"
                >
                  EMPAREJA TODO PARA CONTINUAR
                </button>
              )}
            </div>
          </div>
        )}

        {/* MODO 2: QUIZ */}
        {(currentStage.type === 'gamified_quiz' || currentStage.type === 'quiz') && currentStage.questions && (
          <div className="max-w-2xl w-full flex flex-col justify-center animate-in zoom-in-95 relative z-10">
            <div className={`p-8 rounded-none border ${isPro ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${isPro ? 'text-slate-500' : 'text-slate-400'}`}>
                  MOD {currentQuestionIndex + 1} / {currentStage.questions.length}
                </span>
                {isPro && (
                  <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-teal-400">
                    <span>ACC: {calculateAccuracy()}%</span>
                    <span>🔥 {stats.streakCount}</span>
                  </div>
                )}
              </div>

              {(() => {
                const activeQuestion = currentStage.questions![currentQuestionIndex];
                if (!activeQuestion) return <div>Error cargando pregunta</div>;

                return (
                  <>
                    <h2 className={`text-sm font-black uppercase tracking-widest mb-10 font-serif italic ${isPro ? 'text-white' : 'text-slate-800'}`}>{activeQuestion.question}</h2>

                    {activeQuestion.type === 'listening_match' && (
                      <div className="mb-8 flex justify-center">
                        <button
                          onClick={() => speakText(activeQuestion.tts_text || activeQuestion.correct_answer || "")}
                          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform ${isPro ? 'bg-indigo-600 shadow-indigo-500/30' : 'bg-blue-500'}`}
                        >
                          <Volume2 size={32} className="text-white" />
                        </button>
                      </div>
                    )}

                    {activeQuestion.type === 'order_sentence' && (
                      <div className="space-y-6">
                        <div className={`min-h-[80px] p-4 border-2 border-dashed rounded-xl flex flex-wrap gap-2 items-center transition-colors ${isPro ? 'bg-slate-800/50 border-slate-600' : 'bg-slate-50 border-slate-300'}`}>
                          {sentenceBuilder.length === 0 && <span className="text-slate-500 text-sm italic">Toca las palabras abajo...</span>}
                          {sentenceBuilder.map((word, idx) => (
                            <button key={`built-${idx}`} onClick={() => handleWordClick(word, idx, false)} className={`px-4 py-2 font-bold rounded-lg shadow-md transition-colors animate-in zoom-in ${isPro ? 'bg-indigo-600 text-white' : 'bg-blue-600 text-white'}`}>
                              {word}
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-3 justify-center">
                          {wordPool.map((word, idx) => (
                            <button key={`pool-${idx}`} onClick={() => handleWordClick(word, idx, true)} className={`px-4 py-2 border-2 font-medium rounded-lg hover:-translate-y-1 transition-all shadow-sm ${isPro ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-indigo-500' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400'}`}>
                              {word}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-end pt-4">
                          <button onClick={() => { setSentenceBuilder([]); setWordPool([...(activeQuestion.parts || [])]); }} className="text-slate-400 hover:text-blue-500 flex items-center gap-1 text-sm font-bold">
                            <RefreshCw size={14} /> REINICIAR
                          </button>
                        </div>
                        <button onClick={() => validateAnswer(activeQuestion)} disabled={sentenceBuilder.length === 0 || !!feedback} className={`w-full font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${isPro ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/50' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'}`}>
                          COMPROBAR ORDEN
                        </button>
                      </div>
                    )}

                    {activeQuestion.type === 'fill_input' && (
                      <div className="space-y-4">
                        <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Escribe tu respuesta aquí..." className={`w-full p-4 text-lg border-2 rounded-xl outline-none transition-all ${isPro ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'}`} disabled={!!feedback} autoFocus onKeyDown={(e) => { if (e.key === 'Enter' && !feedback) validateAnswer(activeQuestion); }} />
                        {isPro && showHints && (
                          <div className="p-3 rounded-lg bg-amber-900/30 border border-amber-500 text-amber-200 text-sm">
                            💡 {getIntelligentHint(activeQuestion, 1)}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => validateAnswer(activeQuestion)} disabled={!textInput.trim() || !!feedback} className={`flex-1 font-bold py-3 rounded-xl disabled:opacity-50 ${isPro ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                            COMPROBAR
                          </button>
                          {isPro && (
                            <button onClick={() => { setShowHints(!showHints); setHintsUsed(prev => prev + 1); }} className="px-4 py-3 rounded-xl bg-slate-700 hover:bg-slate-600">
                              💡
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {(activeQuestion.type === 'quiz_choice' || activeQuestion.type === 'listening_match' || (!activeQuestion.type && activeQuestion.options)) && activeQuestion.options && (
                      <div className="space-y-3">
                        {activeQuestion.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => { setSelectedOption(opt); }}
                            disabled={!!feedback}
                            className={`w-full p-5 rounded-none border-2 text-left font-black text-[10px] uppercase tracking-widest transition-all group
                              ${selectedOption === opt
                                ? (isPro ? 'bg-amber-900/20 border-amber-600 text-amber-400' : 'bg-amber-50 border-amber-600 text-amber-900')
                                : (isPro ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-amber-600' : 'bg-white border-slate-200 text-slate-500 hover:border-amber-400')
                              }
                            `}
                          >
                            <div className="flex justify-between items-center">
                              <span>{opt}</span>
                              {selectedOption === opt && <div className="w-2 h-2 bg-amber-600"></div>}
                            </div>
                          </button>
                        ))}
                        <div className="flex gap-2 pt-6">
                          <button onClick={() => validateAnswer(activeQuestion)} disabled={!selectedOption || !!feedback} className={`flex-1 font-black py-4 rounded-none text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 transition-all ${isPro ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}>
                            VALIDAR RESPUESTA
                          </button>
                          {isPro && (
                            <button onClick={() => skipQuestion()} className="px-5 py-4 rounded-none bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors">
                              <SkipForward size={18} className="text-slate-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {feedback && (
                      <div className={`mt-8 p-6 rounded-none border-l-4 animate-in slide-in-from-bottom-2 duration-300 ${feedback.isCorrect ? 'bg-amber-900/10 border-amber-600 text-amber-400' : 'bg-red-900/10 border-red-600 text-red-400'}`}>
                        <div className="flex items-center gap-3 mb-4">
                          {feedback.isCorrect ? <CheckCircle2 size={24} /> : <XIcon size={24} />}
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">{feedback.isCorrect ? "Sync Correct" : "Sync Error"}</h3>
                        </div>
                        {!feedback.isCorrect && feedback.correctAnswer && (
                          <div className="mb-4 text-[11px] font-bold uppercase tracking-widest opacity-80">
                            <span className="text-slate-500">Expectativa:</span> <br />
                            <span className="text-red-400 mt-1 inline-block">{feedback.correctAnswer}</span>
                          </div>
                        )}
                        <button onClick={nextQuestionOrStage} className={`w-full mt-6 py-4 rounded-none font-black text-[10px] uppercase tracking-[0.3em] transition-all ${feedback.isCorrect ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
                          PROCESAR SIGUIENTE
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {currentStage.type === 'practice_chat' && (
          <div className="max-w-3xl w-full text-center mt-20">
            <h2 className={`text-2xl font-bold ${isPro ? 'text-white' : 'text-slate-900'}`}>Modo Conversación</h2>
            <p className="text-slate-500 mb-6">Esta sección requiere el módulo de voz activado.</p>
            <button onClick={nextStage} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
              Saltar por ahora
            </button>
          </div>
        )}

      </main>
    </div>
  );
}