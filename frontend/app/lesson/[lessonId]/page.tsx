'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookOpen, Mic, Send, CheckCircle2, SkipForward, Volume2, ArrowRight } from 'lucide-react';
import Avatar3D from '@/components/avatar/Avatar3D';
import { useAvatarStore } from '@/store/avatarStore';
import LessonComplete from '@/components/lesson/LessonComplete';

// --- TIPOS DE DATOS ---
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

// Nuevo tipo para las partes de la lección magistral
interface LecturePart {
    visual: string; // Markdown visual
    audio: string;  // Lo que dice el robot
    animation: string; // Gesto del avatar
}

interface LessonStage {
  type: 'theory' | 'quiz' | 'practice_chat' | 'pronunciation_drill' | 'lecture'; // <--- TIPO NUEVO
  
  // Campos comunes
  title?: string;
  content?: string; // Para legacy theory
  
  // Campos específicos
  parts?: LecturePart[];     // Para Lecture
  questions?: QuizQuestion[]; // Para Quiz
  sentences?: string[];      // Para Drill
  scenario?: string;         // Para Chat
  ai_system_prompt?: string; // Para Chat
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
  const { setGesture, setSpeaking, addXp } = useAvatarStore();

  // Estados Generales
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Stats
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [xpSession, setXpSession] = useState(0);

  // Estados Lecture (NUEVO)
  const [lecturePartIndex, setLecturePartIndex] = useState(0);

  // Estados Quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  // Estados Drill Pronunciación
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillFeedback, setDrillFeedback] = useState<'listening' | 'success' | 'retry' | 'idle'>('idle');

  // Estados Chat
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  // 1. CARGAR LECCIÓN
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const lessonId = params?.lessonId;
        if (!lessonId) return;

        const res = await fetch(`http://127.0.0.1:8001/api/v1/lessons/${lessonId}`);
        if (!res.ok) throw new Error("Lección no encontrada");
        
        const data = await res.json();
        setLesson(data);

        // Calcular total de "retos"
        let qCount = 0;
        data.stages.forEach((s: any) => { 
            if(s.questions) qCount += s.questions.length;
            if(s.sentences) qCount += s.sentences.length; 
            if(s.parts) qCount += s.parts.length; // Contamos las partes de la lección como progreso
        });
        setTotalQuestions(qCount);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLesson();
  }, [params, router]);

  // 2. CONFIGURAR VOZ (INPUT)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.webkitSpeechRecognition) {
      const recognition = new window.webkitSpeechRecognition();
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

  // 3. AUTO-PLAY AUDIO PARA LECTURE MODE (OUTPUT)
  useEffect(() => {
      const currentStage = lesson?.stages[currentStageIndex];
      
      if (currentStage?.type === 'lecture' && currentStage.parts) {
          const part = currentStage.parts[lecturePartIndex];
          if (part) {
              // 1. Hablar
              speakText(part.audio);
              // 2. Gesto del Avatar
              if (part.animation) setGesture(part.animation);
          }
      }
  }, [currentStageIndex, lecturePartIndex, lesson]);


  // --- HELPERS ---
  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Detener anterior
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    // Buscar mejor voz
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
    window.speechSynthesis.cancel(); // Calla al avatar al cambiar

    if (currentStageIndex < lesson.stages.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
      // Resetear estados de sub-etapas
      setCurrentQuestionIndex(0);
      setQuizSelectedOption(null);
      setQuizFeedback(null);
      setAiExplanation(null);
      setDrillIndex(0); 
      setDrillFeedback('idle');
      setLecturePartIndex(0); // Reset lecture
    } else {
      addXp(xpSession + 100);
      setShowResults(true);
    }
  };

  // --- LÓGICA DE LECTURE (NEXT PART) ---
  const handleNextLecturePart = () => {
      const currentStage = lesson?.stages[currentStageIndex];
      if (!currentStage || !currentStage.parts) return;

      if (lecturePartIndex < currentStage.parts.length - 1) {
          setLecturePartIndex(prev => prev + 1);
      } else {
          nextStage();
      }
  };

  // --- LÓGICA DE DRILL ---
  const handleDrillCheck = (userSaid: string) => {
      const currentStage = lesson?.stages[currentStageIndex];
      if (!currentStage || !currentStage.sentences) return;
      const target = currentStage.sentences[drillIndex];
      const cleanTarget = target.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      const cleanUser = userSaid.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");

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
        console.warn("El micrófono ya estaba activo.");
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

  // --- LÓGICA DE QUIZ ---
  const handleOptionClick = (option: string, question: QuizQuestion) => {
      if (quizSelectedOption) return; 
      setQuizSelectedOption(option);
      const isCorrect = option === question.correct_answer;
      setQuizFeedback({ isCorrect, text: isCorrect ? "¡Correcto!" : "Incorrecto" });
      if (isCorrect) {
          setCorrectAnswers(prev => prev + 1);
          setXpSession(prev => prev + 10);
          speakText("Correct!"); // Feedback auditivo
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

  // --- LÓGICA DE CHAT ---
  const handleChatSend = async (msg: string = input) => {
    if (!msg.trim()) return;
    const newMessages = [...chatMessages, { role: 'user', text: msg }];
    setChatMessages(newMessages as any);
    setInput('');
    setChatLoading(true);
    try {
      const currentStage = lesson?.stages[currentStageIndex];
      const res = await fetch('http://127.0.0.1:8001/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: msg,
            context: currentStage?.ai_system_prompt || "You are a helpful tutor."
        }),
      });
      const data = await res.json();
      setChatMessages([...newMessages, { role: 'ai', text: data.text }] as any);
      if (data.gesture) setGesture(data.gesture);
      speakText(data.text);
    } catch (e) { console.error(e); } finally { setChatLoading(false); }
  };


  // --- RENDERIZADO ---
  if (loading || !lesson) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Cargando...</div>;

  if (showResults) {
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 100;
    return <LessonComplete xpEarned={xpSession + 100} accuracy={accuracy} onRetry={() => window.location.reload()} />;
  }

  const currentStage = lesson.stages[currentStageIndex];
  
  // Cálculo de progreso
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
        <div className="fixed top-0 w-full h-16 bg-white border-b z-50 px-6 flex items-center justify-between shadow-sm">
            <button onClick={() => router.push('/dashboard')} className="text-slate-400 hover:text-slate-600 font-bold">✕ SALIR</button>
            <div className="flex-1 mx-8 bg-slate-100 h-4 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="font-bold text-slate-700 hidden sm:block">{lesson.title}</div>
        </div>

        <div className="flex-1 pt-24 pb-12 px-4 flex justify-center overflow-y-auto">
            
            {/* VISTA 1: LEGACY THEORY (Texto plano) */}
            {currentStage.type === 'theory' && (
                <div className="max-w-2xl w-full bg-white rounded-3xl p-8 shadow-md border border-slate-200">
                    <div className="mb-6 p-4 bg-blue-50 text-blue-600 rounded-2xl w-fit"><BookOpen size={32} /></div>
                    <h2 className="text-3xl font-black text-slate-800 mb-6">Instrucciones</h2>
                    <div className="prose prose-lg text-slate-600 whitespace-pre-wrap">{currentStage.content}</div>
                    <button onClick={nextStage} className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg">CONTINUAR ➔</button>
                </div>
            )}

            {/* --- VISTA NUEVA: LECTURE MODE (MASTERCLASS) --- */}
            {currentStage.type === 'lecture' && currentStage.parts && (
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 h-[70vh] animate-in fade-in">
                    
                    {/* IZQUIERDA: AVATAR GRANDE */}
                    <div className="bg-gradient-to-b from-blue-100 to-white rounded-3xl border-4 border-white shadow-xl relative overflow-hidden flex flex-col justify-end">
                         <div className="absolute top-0 left-0 w-full h-full">
                            <Avatar3D />
                         </div>
                    </div>

                    {/* DERECHA: PIZARRA DE EXPLICACIÓN */}
                    <div className="flex flex-col justify-center">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 relative">
                             {/* Burbuja de diálogo estética */}
                             <div className="absolute top-8 -left-3 w-6 h-6 bg-white rotate-45 border-l border-b border-slate-200 hidden lg:block"></div>
                             
                             <h2 className="text-2xl font-black text-slate-800 mb-4">{currentStage.title}</h2>
                             
                             {/* Contenido Markdown Renderizado */}
                             <div className="prose prose-lg text-slate-600 mb-8 whitespace-pre-wrap leading-relaxed">
                                {currentStage.parts[lecturePartIndex].visual}
                             </div>

                             {/* Controles */}
                             <div className="flex gap-4">
                                <button 
                                    onClick={() => speakText(currentStage.parts![lecturePartIndex].audio)}
                                    className="p-4 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                    title="Repetir Audio"
                                >
                                    <Volume2 size={24} />
                                </button>

                                <button 
                                    onClick={handleNextLecturePart}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {lecturePartIndex < currentStage.parts.length - 1 ? 'SIGUIENTE' : 'EMPEZAR EJERCICIOS'} <ArrowRight size={20} />
                                </button>
                             </div>
                        </div>
                        
                        <p className="text-center text-slate-400 mt-6 text-sm font-bold uppercase tracking-widest">
                            Lección {lecturePartIndex + 1} de {currentStage.parts.length}
                        </p>
                    </div>
                </div>
            )}

            {/* VISTA 3: QUIZ */}
            {currentStage.type === 'quiz' && currentStage.questions && (
                <div className="max-w-xl w-full flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-center text-slate-700 mb-8">{currentStage.questions[currentQuestionIndex].question}</h2>
                    <div className="space-y-4">
                        {currentStage.questions[currentQuestionIndex].options.map((option) => (
                            <button key={option} onClick={() => handleOptionClick(option, currentStage.questions![currentQuestionIndex])} disabled={!!quizSelectedOption} 
                            className={`w-full p-5 rounded-2xl border-2 text-lg font-medium text-left transition-all ${quizSelectedOption === option ? quizFeedback?.isCorrect ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700' : 'bg-white hover:bg-blue-50'}`}>
                                {option}
                            </button>
                        ))}
                    </div>
                    {aiExplanation && <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600"><p>{aiExplanation}</p><button onClick={() => {setQuizSelectedOption(null); setAiExplanation(null);}} className="font-bold underline mt-2">Reintentar</button></div>}
                </div>
            )}

            {/* VISTA 4: PRONUNCIATION DRILL */}
            {currentStage.type === 'pronunciation_drill' && currentStage.sentences && (
                <div className="max-w-3xl w-full flex flex-col items-center justify-center text-center">
                    <div className="mb-8 px-4 py-2 bg-slate-200 rounded-full text-sm font-bold text-slate-600 uppercase tracking-widest">
                        Frase {Math.min(drillIndex + 1, currentStage.sentences.length)} de {currentStage.sentences.length}
                    </div>
                    <h2 className={`text-4xl md:text-5xl font-black mb-12 transition-all duration-300 ${
                        drillFeedback === 'success' ? 'text-green-500 scale-105' : 
                        drillFeedback === 'retry' ? 'text-red-400 shake' : 'text-slate-800'
                    }`}>
                        "{currentStage.sentences[drillIndex] || "¡Fin del Drill!"}"
                    </h2>
                    <div className="relative">
                        <button onClick={startDrillListening} className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all ${drillFeedback === 'listening' ? 'bg-red-500 scale-110 ring-8 ring-red-200 animate-pulse' : drillFeedback === 'success' ? 'bg-green-500 scale-100' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'}`}>
                            {drillFeedback === 'success' ? <CheckCircle2 size={64} className="text-white" /> : <Mic size={64} className="text-white" />}
                        </button>
                        <p className="mt-6 text-xl font-bold text-slate-400 h-8">
                            {drillFeedback === 'listening' ? "Escuchando..." : drillFeedback === 'success' ? "¡Perfecto!" : drillFeedback === 'retry' ? "Intenta de nuevo..." : "Toca para hablar"}
                        </p>
                    </div>
                    <button onClick={handleSkipPhrase} className="mt-12 text-slate-300 text-sm font-bold hover:text-slate-500 flex items-center gap-2">SALTAR ESTA FRASE <SkipForward size={16} /></button>
                </div>
            )}

            {/* VISTA 5: CHAT FINAL */}
            {currentStage.type === 'practice_chat' && (
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 h-[75vh]">
                    <div className="bg-gradient-to-b from-blue-100 to-white rounded-3xl border-4 border-white shadow-xl relative overflow-hidden flex flex-col">
                        <div className="flex-1 relative"><Avatar3D /></div>
                        <div className="bg-white/90 backdrop-blur p-6 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">FINAL BOSS</p>
                            <p className="text-slate-800 font-medium text-lg">{currentStage.scenario}</p>
                        </div>
                    </div>
                    <div className="flex flex-col bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 custom-scrollbar">
                            {chatMessages.length === 0 && <p className="text-center text-slate-400 mt-10">Presiona el micrófono para iniciar la entrevista.</p>}
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border text-slate-700 rounded-tl-none'}`}>{msg.text}</div>
                                </div>
                            ))}
                            {chatLoading && <div className="text-slate-400 text-sm ml-4 animate-pulse">Escribiendo...</div>}
                        </div>
                        <div className="p-4 bg-white border-t border-slate-100 flex gap-3 items-center">
                            <button 
                                onClick={() => { if (isListening) { recognitionRef.current?.stop(); } else { try { recognitionRef.current?.start(); } catch (e) { console.warn("Activo"); } } }}
                                className={`h-14 w-14 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 ${isListening ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                <Mic />
                            </button>
                            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChatSend()} placeholder="Responde..." className="flex-1 bg-slate-50 border-none rounded-xl px-4 h-14 outline-none" />
                            <button onClick={() => handleChatSend()} className="h-14 w-14 bg-blue-600 text-white rounded-xl"><Send size={20} /></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}