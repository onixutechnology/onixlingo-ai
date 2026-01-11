'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  BookOpen, Volume2, ArrowRight, XCircle, CheckCircle2, 
  AlertTriangle, Play, RefreshCw, X, Clock, Zap, Trophy // 👈 Iconos nuevos agregados
} from 'lucide-react';

import Avatar3D from '@/components/avatar/Avatar3D';
import LessonComplete from '@/components/lesson/LessonComplete';
import { useAvatarStore } from '@/store/avatarStore';
import { useUIStore } from '@/store/uiStore'; // 👈 1. Importamos el Store de UI

// --- CONFIGURACIÓN INTELIGENTE ---
const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8001'           // Tu PC
  : 'https://onixlingo-bckend.onrender.com'; // Tu Backend en la Nube

// --- TIPOS DE DATOS ---
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
}

interface LecturePart {
  visual: string; 
  audio: string;  
}

interface LessonStage {
  id: string;
  type: string; 
  title?: string;
  parts?: LecturePart[];     
  questions?: QuizQuestion[];
  scenario?: string;         
  content?: any; 
}

interface LessonData {
  id: string;
  title: string;
  stages: LessonStage[];
}

export default function LessonRunnerEngine() {
  const params = useParams();
  const router = useRouter();
  const { setSpeaking } = useAvatarStore(); 
  
  // 🕵️ DETECTAMOS SI ES VIP (TITANIUM)
  const { mode } = useUIStore();
  const isPro = mode === 'professional'; 

  // Estados Globales
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  // Estados de Ejercicios
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  
  // Sub-estados por tipo de ejercicio
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [sentenceBuilder, setSentenceBuilder] = useState<string[]>([]); 
  const [wordPool, setWordPool] = useState<string[]>([]); 
  
  const [lecturePartIndex, setLecturePartIndex] = useState(0);

  // --- ⏱️ LÓGICA DE CRONÓMETRO (SOLO PRO) ---
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isActive && isPro) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } 
    return () => clearInterval(interval);
  }, [isActive, isPro]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rs = secs % 60;
    return `${mins}:${rs < 10 ? '0' : ''}${rs}`;
  };

  const handleExit = () => {
     router.push(isPro ? '/dashboard/pro' : '/dashboard');
  };

  // --- 1. CARGA DE DATOS ---
  useEffect(() => {
    const initLesson = async () => {
      try {
        const lessonId = params?.lessonId as string;
        if (!lessonId) throw new Error("ID inválido");

        console.log(`📡 Fetching lesson from: ${API_URL}/api/v1/lessons/${lessonId}`);

        const res = await fetch(`${API_URL}/api/v1/lessons/${lessonId}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Error ${res.status}: No se pudo cargar la lección`);
        
        const data = await res.json();
        
        // NORMALIZACIÓN DE DATOS
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

      } catch (err: any) {
        console.error("Error de carga:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initLesson();
  }, [params]);

  // --- INICIALIZAR PREGUNTA ---
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
    }
  }, [currentStageIndex, currentQuestionIndex, lesson]);

  // --- NAVEGACIÓN ---
  const nextStage = () => {
    if (!lesson) return;
    if (currentStageIndex < lesson.stages.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
      setLecturePartIndex(0);
    } else {
      setShowResults(true);
    }
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // --- LOGICA ORDER SENTENCE ---
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

  // --- VALIDACIÓN DE RESPUESTAS ---
  const validateAnswer = (question: QuizQuestion) => {
    let isCorrect = false;
    
    if (question.type === 'quiz_choice' || question.type === 'listening_match' || (!question.type && question.options)) {
        isCorrect = selectedOption === question.correct_answer;
    } 
    else if (question.type === 'fill_input') {
        const answers = question.correct_answers || [question.correct_answer || ""];
        isCorrect = answers.some(ans => ans.toLowerCase().trim() === textInput.toLowerCase().trim());
    } 
    else if (question.type === 'order_sentence') {
        const userOrder = sentenceBuilder.join(" ");
        const targetOrder = question.correct_order ? question.correct_order.join(" ") : question.correct_answer;
        
        isCorrect = userOrder.trim() === targetOrder?.trim();
        if (!isCorrect && question.correct_order) {
            isCorrect = JSON.stringify(sentenceBuilder) === JSON.stringify(question.correct_order);
        }
    }

    setFeedback({ 
        isCorrect, 
        text: isCorrect ? "¡Excelente! 🎉" : `Incorrecto. ${question.explanation || ""}` 
    });

    if (isCorrect) speakText("Correct!");
    else speakText("Try again.");

    setTimeout(() => {
        if (lesson?.stages[currentStageIndex].questions && currentQuestionIndex < (lesson.stages[currentStageIndex].questions!.length - 1)) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            nextStage();
        }
    }, 2500);
  };

  // --- RENDER ---
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-bold animate-pulse">Cargando Lección...</div>;
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-slate-50">
        <AlertTriangle size={48} className="text-red-500 mb-4"/>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Error de Conexión</h2>
        <p className="text-slate-500 mb-4 text-center">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Reintentar</button>
    </div>
  );
  if (showResults) return <LessonComplete xpEarned={100} accuracy={100} opportunities={[]} onRetry={() => window.location.reload()} />;

  const currentStage = lesson?.stages[currentStageIndex];
  if (!currentStage) return null;

  return (
    // 🎨 CAMALEÓN: Cambia colores según isPro
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isPro ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        
        {/* ======================= HEADER ======================= */}
        {isPro ? (
            // 🪙 HEADER EJECUTIVO PRO
            <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={handleExit} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                    <div className="hidden md:flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">Titanium Session</span>
                        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                           <Zap size={12} fill="currentColor" /> RACHA ACTIVA
                        </div>
                    </div>
                </div>
                {/* Cronómetro Pro */}
                <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700 shadow-inner">
                    <Clock size={16} className="text-emerald-400 animate-pulse" />
                    <span className="font-mono text-xl font-bold tracking-widest text-emerald-50">{formatTime(seconds)}</span>
                </div>
            </header>
        ) : (
            // 🧢 HEADER ESTUDIANTE STANDARD
            <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
                <button onClick={handleExit} className="text-slate-400 hover:text-slate-600"><XCircle /></button>
                <div className="w-1/3 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((currentStageIndex + 1) / (lesson?.stages.length || 1)) * 100}%` }}></div>
                </div>
                <span className="font-bold text-slate-700 hidden sm:block truncate w-32 text-right">{lesson?.title}</span>
            </header>
        )}

        <main className="flex-1 p-4 md:p-8 flex justify-center overflow-y-auto relative">
            
            {/* Efectos de fondo Pro */}
            {isPro && (
                <div className="absolute inset-0 pointer-events-none">
                     <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
                     <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] animate-pulse delay-700"></div>
                </div>
            )}

            {/* --- MODO 1: LECTURE (TEORÍA) --- */}
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
                                <button onClick={() => speakText(currentStage.parts![lecturePartIndex]?.audio)} className={`p-4 rounded-xl transition-colors ${isPro ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}><Volume2 /></button>
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
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODO 2: QUIZ / DRILL (INTERACTIVO) --- */}
            {(currentStage.type === 'gamified_quiz' || currentStage.type === 'quiz') && currentStage.questions && (
                <div className="max-w-2xl w-full flex flex-col justify-center animate-in zoom-in-95 relative z-10">
                    <div className={`p-8 rounded-3xl shadow-xl border ${isPro ? 'bg-slate-900/90 border-slate-700 shadow-black/50' : 'bg-white border-slate-100'}`}>
                        {/* HEADER DE PREGUNTA */}
                        <div className="flex justify-between items-center mb-6">
                            <span className={`text-xs font-bold uppercase tracking-widest ${isPro ? 'text-slate-500' : 'text-slate-400'}`}>
                                Pregunta {currentQuestionIndex + 1} de {currentStage.questions.length}
                            </span>
                            {feedback && (
                                <span className={`text-sm font-bold animate-pulse ${feedback.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                    {feedback.isCorrect ? '¡Bien hecho!' : 'Intenta de nuevo'}
                                </span>
                            )}
                        </div>

                        {(() => {
                            const activeQuestion = currentStage.questions![currentQuestionIndex];
                            if (!activeQuestion) return <div>Error cargando pregunta</div>;

                            return (
                                <>
                                    <h2 className={`text-xl font-bold mb-8 ${isPro ? 'text-white' : 'text-slate-800'}`}>{activeQuestion.question}</h2>

                                    {/* --- TIPO A: LISTENING --- */}
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

                                    {/* --- TIPO B: ORDENAR FRASES --- */}
                                    {activeQuestion.type === 'order_sentence' && (
                                        <div className="space-y-6">
                                            <div className={`min-h-[80px] p-4 border-2 border-dashed rounded-xl flex flex-wrap gap-2 items-center transition-colors ${isPro ? 'bg-slate-800/50 border-slate-600' : 'bg-slate-50 border-slate-300'}`}>
                                                {sentenceBuilder.length === 0 && <span className="text-slate-500 text-sm italic">Toca las palabras abajo...</span>}
                                                {sentenceBuilder.map((word, idx) => (
                                                    <button 
                                                        key={`built-${idx}`} 
                                                        onClick={() => handleWordClick(word, idx, false)}
                                                        className={`px-4 py-2 font-bold rounded-lg shadow-md transition-colors animate-in zoom-in ${isPro ? 'bg-indigo-600 text-white hover:bg-red-500' : 'bg-blue-600 text-white hover:bg-red-500'}`}
                                                    >
                                                        {word}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="flex flex-wrap gap-3 justify-center">
                                                {wordPool.map((word, idx) => (
                                                    <button 
                                                        key={`pool-${idx}`} 
                                                        onClick={() => handleWordClick(word, idx, true)}
                                                        className={`px-4 py-2 border-2 font-medium rounded-lg hover:-translate-y-1 transition-all shadow-sm ${isPro ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-indigo-500' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600'}`}
                                                    >
                                                        {word}
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            <div className="flex justify-end pt-4">
                                                <button onClick={() => { setSentenceBuilder([]); setWordPool([...(activeQuestion.parts || [])]); }} className="text-slate-400 hover:text-blue-500 flex items-center gap-1 text-sm font-bold">
                                                    <RefreshCw size={14} /> REINICIAR
                                                </button>
                                            </div>

                                            <button 
                                                onClick={() => validateAnswer(activeQuestion)}
                                                disabled={sentenceBuilder.length === 0 || !!feedback}
                                                className={`w-full font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${isPro ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/50' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'}`}
                                            >
                                                COMPROBAR ORDEN
                                            </button>
                                        </div>
                                    )}

                                    {/* --- TIPO C: FILL INPUT --- */}
                                    {activeQuestion.type === 'fill_input' && (
                                        <div className="space-y-4">
                                            <input 
                                                type="text" 
                                                value={textInput}
                                                onChange={(e) => setTextInput(e.target.value)}
                                                placeholder="Escribe tu respuesta aquí..."
                                                className={`w-full p-4 text-lg border-2 rounded-xl outline-none transition-all ${isPro ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'}`}
                                                disabled={!!feedback}
                                                autoFocus
                                                onKeyDown={(e) => { if (e.key === 'Enter' && !feedback) validateAnswer(activeQuestion); }}
                                            />
                                            <button 
                                                onClick={() => validateAnswer(activeQuestion)}
                                                disabled={!textInput.trim() || !!feedback}
                                                className={`w-full font-bold py-3 rounded-xl disabled:opacity-50 ${isPro ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                            >
                                                COMPROBAR
                                            </button>
                                        </div>
                                    )}

                                    {/* --- TIPO D: MÚLTIPLE OPCIÓN --- */}
                                    {(activeQuestion.type === 'quiz_choice' || activeQuestion.type === 'listening_match' || (!activeQuestion.type && activeQuestion.options)) && activeQuestion.options && (
                                        <div className="space-y-3">
                                            {activeQuestion.options.map((opt, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => { setSelectedOption(opt); validateAnswer(activeQuestion); }} 
                                                    disabled={!!feedback}
                                                    className={`w-full p-5 rounded-xl border-2 text-left font-medium transition-all group
                                                        ${selectedOption === opt 
                                                            ? (feedback?.isCorrect ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700')
                                                            : (isPro ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500 hover:bg-indigo-900/30' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50')
                                                        }
                                                    `}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span>{opt}</span>
                                                        {selectedOption === opt && (feedback?.isCorrect ? <CheckCircle2 className="text-green-600"/> : <XCircle className="text-red-500"/>)}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* FEEDBACK AREA */}
                                    {feedback && !feedback.isCorrect && (
                                        <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3 text-orange-800 animate-in slide-in-from-top-2">
                                            <AlertTriangle className="shrink-0" />
                                            <p className="font-medium">{feedback.text}</p>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* --- MODO 3: CHAT (Fallback) --- */}
            {currentStage.type === 'practice_chat' && (
                <div className="max-w-3xl w-full text-center mt-20">
                   <h2 className={`text-2xl font-bold ${isPro ? 'text-white' : 'text-slate-900'}`}>Modo Conversación</h2>
                   <p className="text-slate-500 mb-6">Esta sección requiere el módulo de voz activado.</p>
                   <button onClick={nextStage} className="bg-blue-600 text-white px-6 py-2 rounded-lg">Saltar por ahora</button>
                </div>
            )}

        </main>
    </div>
  );
}