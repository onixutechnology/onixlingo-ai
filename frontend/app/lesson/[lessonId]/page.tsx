'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookOpen, Mic, Send, CheckCircle2, SkipForward, Volume2, ArrowRight, AlertCircle } from 'lucide-react';
import Avatar3D from '@/components/avatar/Avatar3D';
import { useAvatarStore } from '@/store/avatarStore';
import { useProgressStore } from '@/store/progressStore'; // <--- USAMOS EL STORE CORRECTO
import LessonComplete from '@/components/lesson/LessonComplete';

// --- CONFIGURACIÓN DE ENTORNO (CRÍTICO) ---
// Detecta si estamos en Vercel o en Local
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

// --- TIPOS DE DATOS ---
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface LecturePart {
    visual: string; 
    audio: string;  
    animation: string; 
}

interface LessonStage {
  type: 'theory' | 'quiz' | 'practice_chat' | 'pronunciation_drill' | 'lecture';
  title?: string;
  content?: string;
  parts?: LecturePart[];     
  questions?: QuizQuestion[]; 
  sentences?: string[];      
  scenario?: string;         
  ai_system_prompt?: string; 
}

interface LessonData {
  id: string;
  title: string;
  level: string;
  stages: LessonStage[];
}

export default function LessonRunnerPage() {
  const params = useParams();
  const router = useRouter();
  
  // STORES
  const { setGesture, setSpeaking } = useAvatarStore(); // Solo visuales
  const { completeLesson } = useProgressStore(); // Solo lógica de progreso

  // ESTADOS GENERALES
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // STATS
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [xpSession, setXpSession] = useState(0);

  // SUB-ESTADOS
  const [lecturePartIndex, setLecturePartIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillFeedback, setDrillFeedback] = useState<'listening' | 'success' | 'retry' | 'idle'>('idle');
  
  // CHAT STATE
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  // 1. CARGAR LECCIÓN (CON URL DINÁMICA)
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const lessonId = params?.lessonId;
        if (!lessonId) return;

        console.log(`📡 Buscando lección en: ${API_URL}/api/v1/lessons/${lessonId}`);

        const res = await fetch(`${API_URL}/api/v1/lessons/${lessonId}`, {
            cache: 'no-store' // Evita caché viejo
        });

        if (!res.ok) throw new Error("No se pudo conectar con el Tutor IA.");
        
        const data = await res.json();
        setLesson(data);

        // Calcular total de "retos" para la barra de progreso
        let qCount = 0;
        data.stages.forEach((s: any) => { 
            if(s.questions) qCount += s.questions.length;
            if(s.sentences) qCount += s.sentences.length; 
            if(s.parts) qCount += s.parts.length;
        });
        setTotalQuestions(qCount || 1);
        setLoading(false);
      } catch (error) {
        console.error("Error Fetching Lesson:", error);
        setError("Error de conexión. Asegúrate que el Backend está activo.");
        setLoading(false);
      }
    };
    fetchLesson();
  }, [params, router]);

  // 2. CONFIGURAR RECONOCIMIENTO DE VOZ (Seguro)
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const currentStage = lesson?.stages[currentStageIndex];
        
        if (currentStage?.type === 'practice_chat') {
            setInput(transcript);
            handleChatSend(transcript);
        } else if (currentStage?.type === 'pronunciation_drill') {
            handleDrillCheck(transcript);
        }
      };
      
      recognition.onend = () => {
          setIsListening(false);
          if (lesson?.stages[currentStageIndex]?.type === 'pronunciation_drill') {
             if (drillFeedback === 'listening') setDrillFeedback('idle');
          }
      };
      recognitionRef.current = recognition;
    }
  }, [lesson, currentStageIndex, drillIndex, drillFeedback]);

  // 3. AUTO-PLAY AUDIO PARA LECTURE
  useEffect(() => {
      const currentStage = lesson?.stages[currentStageIndex];
      if (currentStage?.type === 'lecture' && currentStage.parts) {
          const part = currentStage.parts[lecturePartIndex];
          if (part) {
              speakText(part.audio);
              if (part.animation) setGesture(part.animation);
          }
      }
  }, [currentStageIndex, lecturePartIndex, lesson]);

  // --- HELPERS ---
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    // Intentar usar voz de Google si existe
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang === 'en-US');
    if (voice) utterance.voice = voice;
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // --- NAVEGACIÓN GLOBAL ---
  const nextStage = () => {
    if (!lesson) return;
    window.speechSynthesis.cancel(); 

    if (currentStageIndex < lesson.stages.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
      // Resetear sub-estados
      setCurrentQuestionIndex(0);
      setQuizSelectedOption(null);
      setQuizFeedback(null);
      setAiExplanation(null);
      setDrillIndex(0); 
      setDrillFeedback('idle');
      setLecturePartIndex(0);
    } else {
      // FINALIZAR LECCIÓN
      const finalXp = xpSession + 100;
      const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
      const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;

      // Guardar en Store (y DB)
      if (lesson) {
        completeLesson(lesson.id, 100, stars);
      }
      setShowResults(true);
    }
  };

  const handleNextLecturePart = () => {
      const currentStage = lesson?.stages[currentStageIndex];
      if (!currentStage || !currentStage.parts) return;
      if (lecturePartIndex < currentStage.parts.length - 1) {
          setLecturePartIndex(prev => prev + 1);
      } else {
          nextStage();
      }
  };

  // --- LÓGICA DRILL ---
  const handleDrillCheck = (userSaid: string) => {
      const currentStage = lesson?.stages[currentStageIndex];
      if (!currentStage || !currentStage.sentences) return;
      const target = currentStage.sentences[drillIndex];
      
      // Limpieza simple para comparar
      const cleanTarget = target.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      const cleanUser = userSaid.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");

      // Algoritmo de coincidencia flexible (80% match)
      if (cleanUser.includes(cleanTarget) || cleanTarget.includes(cleanUser) || cleanUser.length > cleanTarget.length * 0.8) {
          setDrillFeedback('success');
          setCorrectAnswers(prev => prev + 1);
          setXpSession(prev => prev + 5);
          setTimeout(() => {
              if (drillIndex < currentStage.sentences!.length - 1) {
                  setDrillIndex(prev => prev + 1);
                  setDrillFeedback('idle');
              } else {
                  nextStage(); 
              }
          }, 1000);
      } else {
          setDrillFeedback('retry');
          setTimeout(() => setDrillFeedback('idle'), 2000);
      }
  };

  const startDrillListening = () => {
      try {
        setDrillFeedback('listening');
        setIsListening(true);
        recognitionRef.current?.start();
      } catch (e) {
        console.warn("Micrófono ocupado o no disponible.");
        setIsListening(false);
        setDrillFeedback('idle');
      }
  };

  const handleSkipPhrase = () => {
      const currentStage = lesson?.stages[currentStageIndex];
      if (!currentStage?.sentences) return;
      if (drillIndex < currentStage.sentences.length - 1) {
          setDrillIndex(prev => prev + 1);
          setDrillFeedback('idle');
      } else {
          nextStage();
      }
  };

  // --- LÓGICA QUIZ ---
  const handleOptionClick = (option: string, question: QuizQuestion) => {
      if (quizSelectedOption) return; 
      setQuizSelectedOption(option);
      const isCorrect = option === question.correct_answer;
      setQuizFeedback({ isCorrect, text: isCorrect ? "¡Correcto!" : "Incorrecto" });
      
      if (isCorrect) {
          setCorrectAnswers(prev => prev + 1);
          setXpSession(prev => prev + 10);
          speakText("Correct!");
          setTimeout(() => {
              const currentStage = lesson?.stages[currentStageIndex];
              if (currentStage?.questions && currentQuestionIndex < currentStage.questions.length - 1) {
                  setCurrentQuestionIndex(prev => prev + 1);
                  setQuizSelectedOption(null);
                  setQuizFeedback(null);
                  setAiExplanation(null);
              } else {
                  nextStage();
              }
          }, 1200);
      } else {
          setAiExplanation(question.explanation);
          speakText("Not exactly. Try again.");
      }
  };

  // --- LÓGICA CHAT (CON URL DINÁMICA) ---
  const handleChatSend = async (msg: string = input) => {
    if (!msg.trim()) return;
    const newMessages = [...chatMessages, { role: 'user' as const, text: msg }];
    setChatMessages(newMessages);
    setInput('');
    setChatLoading(true);
    
    try {
      const currentStage = lesson?.stages[currentStageIndex];
      
      // ✅ URL CORREGIDA AQUÍ TAMBIÉN
      const res = await fetch(`${API_URL}/api/v1/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: msg,
            context: currentStage?.ai_system_prompt || "You are a helpful English tutor."
        }),
      });

      if(!res.ok) throw new Error("Error en IA");

      const data = await res.json();
      setChatMessages([...newMessages, { role: 'ai' as const, text: data.text }]);
      if (data.gesture) setGesture(data.gesture);
      speakText(data.text);
    } catch (e) { 
        console.error(e); 
        setChatMessages([...newMessages, { role: 'ai' as const, text: "Lost connection to AI brain. Please check internet." }]);
    } finally { 
        setChatLoading(false); 
    }
  };


  // --- RENDERIZADO ---
  if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Cargando lección...</p>
          </div>
      </div>
  );

  if (error || !lesson) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4 p-8 text-center">
        <AlertCircle size={48} className="text-red-500" />
        <h2 className="text-xl font-bold text-slate-800">Hubo un problema</h2>
        <p className="text-slate-500">{error || "No se pudo cargar la lección."}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Reintentar</button>
        <button onClick={() => router.push('/dashboard')} className="text-slate-400 font-medium hover:underline">Volver al Dashboard</button>
    </div>
  );

  if (showResults) {
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 100;
    return <LessonComplete xpEarned={xpSession + 100} accuracy={accuracy} onRetry={() => window.location.reload()} />;
  }

  const currentStage = lesson.stages[currentStageIndex];
  
  // Cálculo de progreso visual
  let subProgress = 0;
  if (currentStage.type === 'quiz' && currentStage.questions) {
      subProgress = currentQuestionIndex / currentStage.questions.length;
  } else if (currentStage.type === 'pronunciation_drill' && currentStage.sentences) {
      subProgress = drillIndex / currentStage.sentences.length;
  } else if (currentStage.type === 'lecture' && currentStage.parts) {
      subProgress = lecturePartIndex / currentStage.parts.length;
  }
  
  const totalStages = lesson.stages.length;
  const progress = ((currentStageIndex + subProgress) / totalStages) * 100;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        {/* Header */}
        <div className="fixed top-0 w-full h-16 bg-white/90 backdrop-blur border-b border-slate-200 z-50 px-6 flex items-center justify-between shadow-sm">
            <button onClick={() => router.push('/dashboard')} className="text-slate-400 hover:text-red-500 font-bold transition-colors">✕ SALIR</button>
            <div className="flex-1 mx-4 sm:mx-8 bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="font-bold text-slate-700 hidden sm:block truncate max-w-[200px]">{lesson.title}</div>
        </div>

        <div className="flex-1 pt-24 pb-12 px-4 flex justify-center overflow-y-auto">
            
            {/* VISTA 1: LEGACY THEORY */}
            {currentStage.type === 'theory' && (
                <div className="max-w-2xl w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                    <div className="mb-6 p-4 bg-blue-50 text-blue-600 rounded-2xl w-fit"><BookOpen size={32} /></div>
                    <h2 className="text-3xl font-black text-slate-800 mb-6">Instrucciones</h2>
                    <div className="prose prose-lg text-slate-600 whitespace-pre-wrap">{currentStage.content}</div>
                    <button onClick={nextStage} className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-[0_4px_0_0_#15803d] active:shadow-none active:translate-y-1 transition-all">CONTINUAR ➔</button>
                </div>
            )}

            {/* VISTA 2: LECTURE MODE (AVATAR + BOARD) */}
            {currentStage.type === 'lecture' && currentStage.parts && (
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[70vh] animate-in fade-in">
                    {/* IZQUIERDA: AVATAR */}
                    <div className="bg-gradient-to-b from-blue-50 to-white rounded-3xl border-4 border-white shadow-2xl relative overflow-hidden flex flex-col justify-end min-h-[300px]">
                         <div className="absolute top-0 left-0 w-full h-full">
                            <Avatar3D />
                         </div>
                    </div>

                    {/* DERECHA: PIZARRA */}
                    <div className="flex flex-col justify-center">
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 relative">
                             <div className="absolute top-8 -left-3 w-6 h-6 bg-white rotate-45 border-l border-b border-slate-100 hidden lg:block"></div>
                             
                             <h2 className="text-2xl font-black text-slate-800 mb-4">{currentStage.title}</h2>
                             
                             <div className="prose prose-lg text-slate-600 mb-8 whitespace-pre-wrap leading-relaxed min-h-[100px]">
                                {currentStage.parts[lecturePartIndex].visual}
                             </div>

                             <div className="flex gap-4">
                                <button 
                                    onClick={() => speakText(currentStage.parts![lecturePartIndex].audio)}
                                    className="p-4 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                >
                                    <Volume2 size={24} />
                                </button>

                                <button 
                                    onClick={handleNextLecturePart}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-[0_4px_0_0_#15803d] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
                                >
                                    {lecturePartIndex < currentStage.parts.length - 1 ? 'SIGUIENTE' : 'EJERCICIOS'} <ArrowRight size={20} />
                                </button>
                             </div>
                        </div>
                        <p className="text-center text-slate-400 mt-4 text-xs font-bold uppercase tracking-widest">
                            Parte {lecturePartIndex + 1} de {currentStage.parts.length}
                        </p>
                    </div>
                </div>
            )}

            {/* VISTA 3: QUIZ */}
            {currentStage.type === 'quiz' && currentStage.questions && (
                <div className="max-w-xl w-full flex flex-col justify-center animate-in zoom-in-95 duration-300">
                    <h2 className="text-2xl font-bold text-center text-slate-700 mb-8 leading-snug">{currentStage.questions[currentQuestionIndex].question}</h2>
                    <div className="space-y-4">
                        {currentStage.questions[currentQuestionIndex].options.map((option) => (
                            <button key={option} onClick={() => handleOptionClick(option, currentStage.questions![currentQuestionIndex])} disabled={!!quizSelectedOption} 
                            className={`w-full p-5 rounded-2xl border-b-4 text-lg font-medium text-left transition-all active:scale-95 ${quizSelectedOption === option ? quizFeedback?.isCorrect ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200'}`}>
                                {option}
                            </button>
                        ))}
                    </div>
                    {aiExplanation && (
                        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 flex flex-col gap-2 animate-in fade-in">
                            <p className="text-sm font-medium">{aiExplanation}</p>
                            <button onClick={() => {setQuizSelectedOption(null); setAiExplanation(null);}} className="text-sm font-bold underline self-end">Intentar de nuevo</button>
                        </div>
                    )}
                </div>
            )}

            {/* VISTA 4: PRONUNCIATION DRILL */}
            {currentStage.type === 'pronunciation_drill' && currentStage.sentences && (
                <div className="max-w-3xl w-full flex flex-col items-center justify-center text-center animate-in fade-in">
                    <div className="mb-8 px-4 py-2 bg-slate-200 rounded-full text-sm font-bold text-slate-600 uppercase tracking-widest">
                        Ejercicio {Math.min(drillIndex + 1, currentStage.sentences.length)} de {currentStage.sentences.length}
                    </div>
                    <h2 className={`text-4xl md:text-5xl font-black mb-12 transition-all duration-300 ${
                        drillFeedback === 'success' ? 'text-green-500 scale-105' : 
                        drillFeedback === 'retry' ? 'text-red-400 shake' : 'text-slate-800'
                    }`}>
                        "{currentStage.sentences[drillIndex]}"
                    </h2>
                    <div className="relative group">
                        <div className={`absolute inset-0 rounded-full blur-xl opacity-50 transition-colors ${drillFeedback === 'listening' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                        <button onClick={startDrillListening} className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all ${drillFeedback === 'listening' ? 'bg-red-500 scale-110 ring-4 ring-white' : drillFeedback === 'success' ? 'bg-green-500 scale-100' : 'bg-blue-600 hover:bg-blue-500 hover:scale-105'}`}>
                            {drillFeedback === 'success' ? <CheckCircle2 size={64} className="text-white" /> : <Mic size={64} className="text-white" />}
                        </button>
                    </div>
                    <p className="mt-8 text-xl font-bold text-slate-400 h-8">
                        {drillFeedback === 'listening' ? "Escuchando..." : drillFeedback === 'success' ? "¡Excelente!" : drillFeedback === 'retry' ? "No te entendí, otra vez..." : "Toca el micrófono y lee la frase"}
                    </p>
                    <button onClick={handleSkipPhrase} className="mt-12 px-4 py-2 rounded-lg hover:bg-slate-100 text-slate-400 text-xs font-bold flex items-center gap-2 transition-colors">
                        SALTAR (NO PUEDO HABLAR AHORA) <SkipForward size={14} />
                    </button>
                </div>
            )}

            {/* VISTA 5: CHAT FINAL */}
            {currentStage.type === 'practice_chat' && (
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 h-[75vh]">
                    <div className="bg-gradient-to-b from-slate-100 to-slate-200 rounded-3xl border-4 border-white shadow-xl relative overflow-hidden flex flex-col">
                        <div className="flex-1 relative"><Avatar3D /></div>
                        <div className="bg-white/80 backdrop-blur-md p-6 border-t border-white/50">
                            <div className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase rounded mb-2 tracking-wider">Misión Final</div>
                            <p className="text-slate-800 font-bold text-lg leading-tight">{currentStage.scenario}</p>
                        </div>
                    </div>
                    <div className="flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                            {chatMessages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                                    <Mic size={48} className="mb-2" />
                                    <p>Habla o escribe para comenzar</p>
                                </div>
                            )}
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border text-slate-700 rounded-tl-none'}`}>{msg.text}</div>
                                </div>
                            ))}
                            {chatLoading && <div className="text-slate-400 text-xs ml-4 font-bold animate-pulse">Pensando...</div>}
                        </div>
                        <div className="p-4 bg-white border-t border-slate-100 flex gap-3 items-center">
                            <button 
                                onClick={() => { if (isListening) { recognitionRef.current?.stop(); } else { try { recognitionRef.current?.start(); } catch (e) { console.warn("Activo"); } } }}
                                className={`h-12 w-12 rounded-full flex items-center justify-center transition-all active:scale-95 ${isListening ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                <Mic size={20} />
                            </button>
                            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChatSend()} placeholder="Escribe tu respuesta..." className="flex-1 bg-slate-100 border-none rounded-xl px-4 h-12 outline-none text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                            <button onClick={() => handleChatSend()} className="h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 active:scale-95 transition-all"><Send size={20} /></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}