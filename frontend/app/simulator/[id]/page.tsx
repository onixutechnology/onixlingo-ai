'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Clock, AlertTriangle, PlayCircle, 
  Volume2, Image as ImageIcon, CheckCircle2, ChevronRight,
  Mic, Square, Type, Loader2
} from 'lucide-react';
import apiClient from '@/lib/apiClient';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

interface SimulatorSection {
  id: string;
  type: 'reading' | 'listening' | 'speaking' | 'writing';
  title: string;
  instructions: string;
  passageText?: string;
  imageUrl?: string;
  audioUrl?: string;
  questions: Question[];
}

export default function SimulatorPage() {
  const params = useParams();
  const router = useRouter();
  const simulatorId = (params?.id as string) || '';

  const [timeLeft, setTimeLeft] = useState(7200); // 2 horas por defecto
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  // Estados para Speaking
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);

  const [sections, setSections] = useState<SimulatorSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimulatorData = async () => {
      try {
        const response = await apiClient.get(`/lessons/${simulatorId}?lang=en`);
        const data = response.data;
        
        // Transform backend data to SimulatorSection format
        // Assuming backend sends data.stages as the sections
        if (data && data.stages) {
          setSections(data.stages);
        }
      } catch (error) {
        console.error('Error fetching simulator data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (simulatorId) {
      fetchSimulatorData();
    }
  }, [simulatorId]);


  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleTextChange = (questionId: string, text: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: text }));
  };

  const handleToggleRecording = (questionId: string) => {
    if (isRecording) {
      setIsRecording(false);
      setAnswers(prev => ({ ...prev, [questionId]: '[Audio Recorded Successfully]' }));
    } else {
      setIsRecording(true);
      setRecordTime(45); // 45 seconds to speak in TOEFL usually
    }
  };

  useEffect(() => {
    let recTimer: NodeJS.Timeout;
    if (isRecording && recordTime > 0) {
      recTimer = setInterval(() => {
        setRecordTime(prev => {
          if (prev <= 1) {
            clearInterval(recTimer);
            setIsRecording(false);
            const qId = sections[currentSectionIndex]?.questions[currentQuestionIndex]?.id;
            if (qId) setAnswers(ans => ({ ...ans, [qId]: '[Audio Recorded Successfully]' }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(recTimer);
  }, [isRecording, recordTime, currentSectionIndex, currentQuestionIndex, sections]);

  const handleNext = () => {
    const currentSection = sections[currentSectionIndex];
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white p-12 shadow-2xl border border-slate-200 text-center max-w-lg w-full">
          <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Examen Finalizado</h1>
          <p className="text-slate-600 mb-8">Tus respuestas han sido enviadas para la evaluación oficial.</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-slate-900 text-white font-bold uppercase tracking-wider py-4 px-8 w-full hover:bg-slate-800 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Error de Carga</h2>
          <p className="text-slate-600 mb-6">No pudimos obtener las preguntas del simulador. Por favor, inténtalo más tarde.</p>
          <button onClick={() => router.push('/dashboard')} className="bg-slate-900 text-white px-6 py-2">Volver</button>
        </div>
      </div>
    );
  }

  const currentSection = sections[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id] || '';
  const wordCount = currentAnswer.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* HEADER GLOBAL */}
      <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 border-b-4 border-[#D4AF37]">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <h1 className="font-black text-sm uppercase tracking-widest text-[#D4AF37]">{simulatorId.replace('_v1', '').toUpperCase()} OFFICIAL SIMULATOR</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider">Candidate Testing Station</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700">
            <Clock size={14} className={timeLeft < 300 ? "text-red-400" : "text-emerald-400"} />
            <span className={`font-mono font-bold text-sm ${timeLeft < 300 ? "text-red-400 animate-pulse" : "text-white"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <button 
            onClick={() => setIsFinished(true)}
            className="text-[10px] uppercase font-black tracking-widest bg-red-600 hover:bg-red-700 text-white px-4 py-2 transition-colors"
          >
            Finalizar Examen
          </button>
        </div>
      </header>

      {/* INSTRUCTIONS BAR */}
      <div className="bg-slate-100 border-b border-slate-200 px-8 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="bg-slate-900 text-white text-[10px] font-black uppercase px-2 py-1 tracking-wider">
            {currentSection.title}
          </span>
          <p className="text-xs text-slate-700 font-medium">
            {currentSection.instructions}
          </p>
        </div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Question {currentQuestionIndex + 1} of {currentSection.questions.length}
        </div>
      </div>

      {/* SPLIT VIEW WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* PANEL IZQUIERDO: MULTIMEDIA / LECTURA */}
        <div className="w-1/2 border-r border-slate-200 bg-slate-50 flex flex-col relative">
          <div className="absolute inset-0 overflow-y-auto p-8 custom-scrollbar">
            
            {currentSection.imageUrl && (
              <div className="mb-8 border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-center relative overflow-hidden bg-slate-100">
                  <img src={currentSection.imageUrl} alt="Reference" className="max-w-full max-h-[400px] object-contain" />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 uppercase tracking-wider font-bold">
                    Reference Image
                  </div>
                </div>
              </div>
            )}

            {currentSection.audioUrl && (
              <div className="mb-8 bg-white border border-slate-200 p-6 flex flex-col items-center justify-center shadow-sm w-full">
                <audio controls src={currentSection.audioUrl} className="w-full" controlsList="nodownload">
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>
            )}

            {currentSection.passageText && (
              <div className="bg-white border border-slate-200 p-8 shadow-sm">
                <h3 className="font-serif font-black text-lg mb-6 text-slate-900 border-b border-slate-200 pb-4">
                  Reading Passage
                </h3>
                <div className="prose prose-sm text-slate-700 leading-relaxed font-serif">
                  {currentSection.passageText.split('\\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* PANEL DERECHO: PREGUNTAS */}
        <div className="w-1/2 bg-white flex flex-col relative">
          <div className="absolute inset-0 overflow-y-auto p-8 custom-scrollbar">
            
            <div className="max-w-xl mx-auto">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="space-y-3">
                {currentSection.type === 'writing' && (
                  <div className="w-full">
                    <textarea
                      className="w-full h-64 p-4 border border-slate-300 rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none resize-none font-serif text-base"
                      placeholder="Type your response here..."
                      value={currentAnswer}
                      onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-2 text-xs text-slate-500 font-bold uppercase tracking-wider">
                      <span>Minimum words: 150</span>
                      <span className={wordCount < 150 ? "text-amber-600" : "text-emerald-600"}>Word count: {wordCount}</span>
                    </div>
                  </div>
                )}

                {currentSection.type === 'speaking' && (
                  <div className="w-full flex flex-col items-center justify-center py-12 border border-slate-200 bg-slate-50 rounded-sm">
                    {currentAnswer === '[Audio Recorded Successfully]' ? (
                      <div className="text-center">
                        <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
                        <p className="font-bold text-slate-900 mb-2">Response Recorded</p>
                        <p className="text-sm text-slate-500">Your audio has been saved for evaluation.</p>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleToggleRecording(currentQuestion.id)}
                          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${
                            isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-slate-900 hover:bg-slate-800'
                          }`}
                        >
                          {isRecording ? <Square className="text-white" size={32} /> : <Mic className="text-white" size={32} />}
                        </button>
                        <p className="mt-6 font-bold text-slate-900 uppercase tracking-widest text-sm">
                          {isRecording ? 'Recording...' : 'Click to Speak'}
                        </p>
                        <p className="mt-2 text-slate-500 font-mono text-lg">
                          {isRecording ? `00:${recordTime.toString().padStart(2, '0')}` : 'Max: 45s'}
                        </p>
                      </>
                    )}
                  </div>
                )}

                {(currentSection.type === 'reading' || currentSection.type === 'listening') && currentQuestion.options?.map((option, idx) => {
                  const isSelected = answers[currentQuestion.id] === option;
                  const letters = ['A', 'B', 'C', 'D'];
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQuestion.id, option)}
                      className={`w-full text-left flex items-center p-4 border transition-all ${
                        isSelected 
                          ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-sm' 
                          : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 flex items-center justify-center border font-bold text-sm shrink-0 mr-4 transition-colors ${
                        isSelected ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {letters[idx]}
                      </div>
                      <span className={`text-base font-medium ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={currentSection.type === 'writing' ? wordCount < 50 : (!answers[currentQuestion.id] || isRecording)}
                  className={`flex items-center gap-2 px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all ${
                    (currentSection.type === 'writing' ? wordCount >= 50 : (answers[currentQuestion.id] && !isRecording))
                      ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  }`}
                >
                  Continuar <ChevronRight size={18} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
