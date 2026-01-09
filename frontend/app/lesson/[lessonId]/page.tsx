'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  BookOpen, Volume2, ArrowRight, XCircle, CheckCircle2, 
  AlertTriangle, Play, RefreshCw, X
} from 'lucide-react';

import Avatar3D from '@/components/avatar/Avatar3D';
import LessonComplete from '@/components/lesson/LessonComplete';
import { useAvatarStore } from '@/store/avatarStore';

// --- CONFIGURACIÓN INTELIGENTE (CORREGIDA) ---
// Detecta si estás en tu PC o en Render para evitar el error "Failed to fetch"
const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8001'                  // Tu PC
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

  // --- 1. CARGA DE DATOS ---
  useEffect(() => {
    const initLesson = async () => {
      try {
        const lessonId = params?.lessonId as string;
        if (!lessonId) throw new Error("ID inválido");

        // Log para depuración (puedes borrarlo luego)
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

  // --- INICIALIZAR PREGUNTA (Cargar pool de palabras) ---
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
    <div className="min-h-screen flex flex-col bg-slate-50">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
            <button onClick={() => router.push('/dashboard')} className="text-slate-400 hover:text-slate-600"><XCircle /></button>
            <div className="w-1/3 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((currentStageIndex + 1) / (lesson?.stages.length || 1)) * 100}%` }}></div>
            </div>
            <span className="font-bold text-slate-700 hidden sm:block truncate w-32 text-right">{lesson?.title}</span>
        </header>

        <main className="flex-1 p-4 md:p-8 flex justify-center overflow-y-auto">
            
            {/* --- MODO 1: LECTURE (TEORÍA) --- */}
            {(currentStage.type === 'lecture' || currentStage.type === 'theory') && currentStage.parts && (
                <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl border-4 border-white shadow-xl relative min-h-[300px] flex items-end justify-center overflow-hidden">
                        <div className="absolute inset-0"><Avatar3D /></div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                            <h2 className="text-2xl font-black mb-6 text-slate-800">{currentStage.title}</h2>
                            <div className="prose lg:prose-xl text-slate-600 mb-8 whitespace-pre-wrap">
                                {currentStage.parts[lecturePartIndex]?.visual}
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => speakText(currentStage.parts![lecturePartIndex]?.audio)} className="p-4 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"><Volume2 /></button>
                                <button 
                                    onClick={() => {
                                        if (lecturePartIndex < (currentStage.parts?.length || 0) - 1) setLecturePartIndex(prev => prev + 1);
                                        else nextStage();
                                    }} 
                                    className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 flex justify-center gap-2 shadow-lg shadow-blue-200"
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
                <div className="max-w-2xl w-full flex flex-col justify-center animate-in zoom-in-95">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                        {/* HEADER DE PREGUNTA */}
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Pregunta {currentQuestionIndex + 1} de {currentStage.questions.length}
                            </span>
                            {feedback && (
                                <span className={`text-sm font-bold animate-pulse ${feedback.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                    {feedback.isCorrect ? '¡Bien hecho!' : 'Intenta de nuevo'}
                                </span>
                            )}
                        </div>

                        {(() => {
                            const activeQuestion = currentStage.questions![currentQuestionIndex];
                            if (!activeQuestion) return <div>Error cargando pregunta</div>;

                            return (
                                <>
                                    <h2 className="text-xl font-bold text-slate-800 mb-8">{activeQuestion.question}</h2>

                                    {/* --- TIPO A: LISTENING (Botón de Audio) --- */}
                                    {activeQuestion.type === 'listening_match' && (
                                        <div className="mb-8 flex justify-center">
                                            <button 
                                                onClick={() => speakText(activeQuestion.tts_text || activeQuestion.correct_answer || "")}
                                                className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                                            >
                                                <Volume2 size={32} className="text-white" />
                                            </button>
                                        </div>
                                    )}

                                    {/* --- TIPO B: ORDENAR FRASES (Visual Builder) --- */}
                                    {activeQuestion.type === 'order_sentence' && (
                                        <div className="space-y-6">
                                            {/* Zona de Construcción */}
                                            <div className="min-h-[80px] p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-wrap gap-2 items-center transition-colors hover:border-blue-300">
                                                {sentenceBuilder.length === 0 && <span className="text-slate-400 text-sm italic">Toca las palabras abajo para construir la frase...</span>}
                                                {sentenceBuilder.map((word, idx) => (
                                                    <button 
                                                        key={`built-${idx}`} 
                                                        onClick={() => handleWordClick(word, idx, false)}
                                                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-red-500 transition-colors animate-in zoom-in"
                                                    >
                                                        {word}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Pool de Palabras */}
                                            <div className="flex flex-wrap gap-3 justify-center">
                                                {wordPool.map((word, idx) => (
                                                    <button 
                                                        key={`pool-${idx}`} 
                                                        onClick={() => handleWordClick(word, idx, true)}
                                                        className="px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 font-medium rounded-lg hover:border-blue-400 hover:text-blue-600 hover:-translate-y-1 transition-all shadow-sm"
                                                    >
                                                        {word}
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            <div className="flex justify-end pt-4">
                                                <button 
                                                     onClick={() => { setSentenceBuilder([]); setWordPool([...(activeQuestion.parts || [])]); }}
                                                     className="text-slate-400 hover:text-blue-500 flex items-center gap-1 text-sm font-bold"
                                                >
                                                    <RefreshCw size={14} /> REINICIAR
                                                </button>
                                            </div>

                                            <button 
                                                onClick={() => validateAnswer(activeQuestion)}
                                                disabled={sentenceBuilder.length === 0 || !!feedback}
                                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                                            >
                                                COMPROBAR ORDEN
                                            </button>
                                        </div>
                                    )}

                                    {/* --- TIPO C: FILL INPUT (Caja de Texto) --- */}
                                    {activeQuestion.type === 'fill_input' && (
                                        <div className="space-y-4">
                                            <input 
                                                type="text" 
                                                value={textInput}
                                                onChange={(e) => setTextInput(e.target.value)}
                                                placeholder="Escribe tu respuesta aquí..."
                                                className="w-full p-4 text-lg border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                                disabled={!!feedback}
                                                autoFocus
                                                onKeyDown={(e) => { if (e.key === 'Enter' && !feedback) validateAnswer(activeQuestion); }}
                                            />
                                            <button 
                                                onClick={() => validateAnswer(activeQuestion)}
                                                disabled={!textInput.trim() || !!feedback}
                                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                COMPROBAR
                                            </button>
                                        </div>
                                    )}

                                    {/* --- TIPO D: MÚLTIPLE OPCIÓN (Default) --- */}
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
                                                            : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50'}
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

            {/* --- MODO 3: CHAT / ROLEPLAY (Fallback) --- */}
            {currentStage.type === 'practice_chat' && (
                <div className="max-w-3xl w-full text-center mt-20">
                   <h2 className="text-2xl font-bold">Modo Conversación</h2>
                   <p className="text-slate-500 mb-6">Esta sección requiere el módulo de voz activado.</p>
                   <button onClick={nextStage} className="bg-blue-600 text-white px-6 py-2 rounded-lg">Saltar por ahora</button>
                </div>
            )}

        </main>
    </div>
  );
}