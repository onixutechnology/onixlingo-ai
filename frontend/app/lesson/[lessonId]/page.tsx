'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Volume2, ArrowRight, XCircle, CheckCircle2, AlertTriangle, Play, RefreshCw, X, 
  Clock, Zap, Check, X as XIcon, Save, BookOpen, Brain, Target, Flame, Award, 
  Trophy, Lightbulb, Settings, Download, Share2, Eye, EyeOff, BarChart3, 
  MessageSquare, Mic, MicOff, Pause, SkipForward, HelpCircle, MapPin, Filter,
  TrendingUp, Star, Heart, Lock, Unlock, Copy, ChevronDown, ChevronUp, Menu,
  Radio, Grid, List, Search, Calendar, Users, Repeat2, RotateCw, ChevronRight
} from 'lucide-react';

import Avatar3D from '@/components/avatar/Avatar3D';
import LessonComplete from '@/components/lesson/LessonComplete';
import { useAvatarStore } from '@/store/avatarStore';
import { useUIStore } from '@/store/uiStore';

const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8001' 
  : 'https://onixlingo-bckend.onrender.com';

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
  const { setSpeaking } = useAvatarStore();
  const { mode } = useUIStore();
  const isPro = mode === 'professional';

  const userId = "user_123_placeholder";

  // ========== ESTADOS GLOBALES EXPANDIDOS ==========
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
  const [seconds, setSeconds] = useState(0);
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
      console.error('Error guardando en localStorage:', e);
    }
  }, []);

  // [FUNCIÓN 5] Cargar desde localStorage
  const loadFromLocalStorage = useCallback((key: string, defaultValue: any = null): any => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Error cargando de localStorage:', e);
      return defaultValue;
    }
  }, []);

  // [FUNCIÓN 6] Reproducir sonido TTS
  const speakText = useCallback((text: string, rate: number = 0.9): void => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !soundEnabled) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(v => 
      v.name.includes('Male') || v.name.includes('David') || v.name.includes('Google US English')
    );
    
    if (maleVoice) utterance.voice = maleVoice;
    utterance.lang = 'en-US';
    utterance.rate = rate * playbackSpeed;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [soundEnabled, playbackSpeed, setSpeaking]);

  // [FUNCIÓN 7] Detener reproducción de audio
  const stopSpeech = useCallback((): void => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [setSpeaking]);

  // [FUNCIÓN 8] Manejar salida de la lección
  const handleExit = useCallback((): void => {
    router.push(isPro ? '/dashboard/pro' : '/dashboard');
  }, [router, isPro]);

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
      console.error('Error copiando:', e);
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
    console.log('📊 Exportando PDF:', report);
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
      console.error('Error obteniendo leaderboard:', e);
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
      console.error('Speech Recognition no soportado');
      return;
    }

    trackEvent('pronunciation_check_start', {});
    // Implementación completa requeriría Web Speech API
    console.log('🎤 Iniciando verificación de pronunciación...');
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
      console.error('Error sincronizando:', e);
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
      console.error('Error compartiendo:', e);
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
      console.log(`📤 Exportando en formato: ${format}`);
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
    console.log(`📞 Solicitando mentor para: ${topic}`);
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
    console.log(`🎬 Reproduciendo: ${videoId}`);
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
    return lesson ? Math.round(((currentStageIndex + 1) / lesson.stages.length) * 100) : 0;
  }, [lesson, currentStageIndex]);

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
    if (isActive && isPro) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPro]);

  // ============================================================================
  // ==================== EFECTO PARA CARGA DE LECCIÓN =======================
  // ============================================================================

useEffect(() => {
  const initLesson = async () => {
    try {
      const lessonId = params?.lessonId as string;
      if (!lessonId) throw new Error("ID inválido");

      const res = await fetch(`${API_URL}/api/v1/lessons/${lessonId}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Error ${res.status}: No se pudo cargar la lección`);

      const data = await res.json();

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
      if (isPro) {
        recoverPreviousSession(); // useCallback
      }
      loadSavedBookmarks();       // useCallback
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  initLesson();
  // 👇 IMPORTANTE: sin lesson?.id ni otras refs inestables
}, [params, isPro]);


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
  // ==================== FUNCIÓN FINALIZAR LECCIÓN ==========================
  // ============================================================================

  const finishLesson = async () => {
    setIsActive(false);
    setIsSaving(true);

    const accuracy = stats.totalQuestionsAnswered > 0
      ? Math.round((stats.correctAnswers / stats.totalQuestionsAnswered) * 100)
      : 0;

    const baseXP = lesson?.total_xp || 100;
    const totalXP = baseXP + stats.xpAccumulated;

    // PRO: Guardar sesión y sincronizar
    if (isPro) {
      saveSessionState();
      await syncProgressRealtime();
      sendPushNotification('¡Lección Completada!', `Obtuviste ${accuracy}% de precisión`);
    }

    try {
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

      // TODO: Descomentar cuando endpoint esté listo
      /*
      await fetch(`${API_URL}/api/v1/progress/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progress)
      });
      */

      console.log("💾 Guardado:", { accuracy, totalXP });
    } catch (error) {
      console.error("Error guardando:", error);
    } finally {
      setIsSaving(false);
      setShowResults(true);
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
        onRetry={() => window.location.reload()}
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
            <button onClick={handleExit} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
              <X size={24} />
            </button>
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">Titanium Session</span>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                <Zap size={12} fill="currentColor" /> {stats.correctAnswers} Aciertos
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {showAnalytics && (
              <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700 text-xs">
                <div>⚡ {Math.round(stats.xpAccumulated / Math.max(seconds, 1) * 60)} XP/min</div>
                <div>📊 {calculateAccuracy()}%</div>
              </div>
            )}
            <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700 shadow-inner">
              <Clock size={16} className="text-emerald-400 animate-pulse" />
              <span className="font-mono text-xl font-bold tracking-widest text-emerald-50">{formatTime(seconds)}</span>
            </div>
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 hover:bg-white/10 rounded-full">
              <Settings size={20} />
            </button>
          </div>
        </header>
      ) : (
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <button onClick={handleExit} className="text-slate-400 hover:text-slate-600"><XCircle /></button>
          <div className="w-1/3 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${getProgressPercentage()}%` }}></div>
          </div>
          <span className="font-bold text-slate-700 hidden sm:block truncate w-32 text-right">{lesson?.title}</span>
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
            <div className={`rounded-3xl border-4 shadow-xl relative min-h-[300px] flex items-end justify-center overflow-hidden ${isPro ? 'bg-gradient-to-b from-slate-900 to-indigo-950 border-slate-800' : 'bg-gradient-to-br from-blue-50 to-white border-white'}`}>
              <div className="absolute inset-0"><Avatar3D /></div>
            </div>
            <div className="flex flex-col justify-center">
              <div className={`p-8 rounded-3xl shadow-lg border ${isPro ? 'bg-slate-900/80 border-slate-700 backdrop-blur-md' : 'bg-white border-slate-100'}`}>
                <h2 className={`text-2xl font-black mb-6 ${isPro ? 'text-white' : 'text-slate-800'}`}>{currentStage.title}</h2>
                <div className={`prose lg:prose-xl mb-8 whitespace-pre-wrap ${isPro ? 'text-slate-300' : 'text-slate-600'}`}>
                  {currentStage.parts[lecturePartIndex]?.visual}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => speakText(currentStage.parts![lecturePartIndex]?.audio)} className={`p-4 rounded-xl transition-colors ${isPro ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>
                    <Volume2 />
                  </button>
                  <button
                    onClick={() => {
                      if (lecturePartIndex < (currentStage.parts?.length || 0) - 1) setLecturePartIndex(prev => prev + 1);
                      else nextStage();
                    }}
                    className={`flex-1 font-bold py-4 rounded-xl flex justify-center gap-2 shadow-lg ${isPro ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/50 text-white' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 text-white'}`}
                  >
                    CONTINUAR <ArrowRight />
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

        {/* MODO 2: QUIZ */}
        {(currentStage.type === 'gamified_quiz' || currentStage.type === 'quiz') && currentStage.questions && (
          <div className="max-w-2xl w-full flex flex-col justify-center animate-in zoom-in-95 relative z-10">
            <div className={`p-8 rounded-3xl shadow-xl border ${isPro ? 'bg-slate-900/90 border-slate-700 shadow-black/50' : 'bg-white border-slate-100'}`}>
              <div className="flex justify-between items-center mb-6">
                <span className={`text-xs font-bold uppercase tracking-widest ${isPro ? 'text-slate-500' : 'text-slate-400'}`}>
                  Pregunta {currentQuestionIndex + 1} de {currentStage.questions.length}
                </span>
                {isPro && (
                  <div className="flex items-center gap-4 text-xs">
                    <span>📊 {calculateAccuracy()}%</span>
                    <span>🔥 {stats.streakCount}</span>
                  </div>
                )}
              </div>

              {(() => {
                const activeQuestion = currentStage.questions![currentQuestionIndex];
                if (!activeQuestion) return <div>Error cargando pregunta</div>;

                return (
                  <>
                    <h2 className={`text-xl font-bold mb-8 ${isPro ? 'text-white' : 'text-slate-800'}`}>{activeQuestion.question}</h2>

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
                            className={`w-full p-5 rounded-xl border-2 text-left font-medium transition-all group
                              ${selectedOption === opt
                                ? (isPro ? 'bg-indigo-900/50 border-indigo-500 text-white' : 'bg-blue-100 border-blue-500 text-blue-800')
                                : (isPro ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500 hover:bg-indigo-900/30' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50')
                              }
                            `}
                          >
                            <div className="flex justify-between items-center">
                              <span>{opt}</span>
                              {selectedOption === opt && <div className="w-4 h-4 rounded-full bg-current"></div>}
                            </div>
                          </button>
                        ))}
                        <div className="flex gap-2 pt-4">
                          <button onClick={() => validateAnswer(activeQuestion)} disabled={!selectedOption || !!feedback} className={`flex-1 mt-4 font-bold py-3 rounded-xl disabled:opacity-50 ${isPro ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                            CONFIRMAR
                          </button>
                          {isPro && (
                            <button onClick={() => skipQuestion()} className="px-4 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center gap-2">
                              <SkipForward size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {feedback && (
                      <div className={`mt-6 p-6 rounded-2xl border-2 animate-in slide-in-from-bottom-4 fade-in duration-300 ${feedback.isCorrect ? (isPro ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-300' : 'bg-green-50 border-green-200 text-green-800') : (isPro ? 'bg-red-900/30 border-red-500/50 text-red-300' : 'bg-red-50 border-red-200 text-red-800')}`}>
                        <div className="flex items-center gap-3 mb-3">
                          {feedback.isCorrect ? <CheckCircle2 size={28} /> : <XIcon size={28} />}
                          <h3 className="text-lg font-black uppercase tracking-wide">{feedback.isCorrect ? "Correcto" : "Incorrecto"}</h3>
                          {isPro && feedback.responseTime && <span className="ml-auto text-sm">⏱️ {feedback.responseTime}s</span>}
                        </div>
                        {!feedback.isCorrect && feedback.correctAnswer && (
                          <div className="mb-4 text-sm opacity-90">
                            <span className="font-bold">Respuesta correcta:</span> <br />
                            <span className="font-mono bg-black/20 px-2 py-1 rounded mt-1 inline-block">{feedback.correctAnswer}</span>
                          </div>
                        )}
                        {feedback.explanation && (
                          <div className={`p-4 rounded-xl text-sm leading-relaxed whitespace-pre-line ${isPro ? 'bg-black/30' : 'bg-white/60'}`}>
                            <span className="font-bold block mb-1">💡 Análisis:</span>
                            {feedback.explanation}
                          </div>
                        )}
                        <button onClick={nextQuestionOrStage} className={`w-full mt-6 py-4 rounded-xl font-black uppercase tracking-widest shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] ${feedback.isCorrect ? (isPro ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white') : (isPro ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white')}`}>
                          CONTINUAR
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