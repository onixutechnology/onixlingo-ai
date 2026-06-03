'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, ArrowRight, RotateCcw, Gem, Zap, Loader2, XCircle, 
  Award, Shield, FileText, Sparkles, Download, User, Calendar, 
  Hash, ArrowUpRight, CheckCircle2, ChevronRight, AlertCircle, BookOpen
} from 'lucide-react';
import Cookies from 'js-cookie';
import confetti from 'canvas-confetti';
import { useUIStore } from '@/store/uiStore';

// URL HÍBRIDA: Detecta si estás en Vercel (Prod) o en tu PC (Dev)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

interface Props {
  xpEarned: number;
  accuracy: number;
  lessonId: string;
  lessonType: 'standard' | 'pro' | 'vocab';
  totalSteps: number;
  onRetry: () => void;
  onExit: () => void;
  answerHistory?: any[];
}

export default function LessonComplete({ 
  xpEarned, 
  accuracy, 
  lessonId, 
  lessonType, 
  totalSteps, 
  onRetry, 
  onExit,
  answerHistory = []
}: Props) {
  const { mode, activeLanguage } = useUIStore();
  const isPro = mode === 'professional' || lessonType === 'pro' || lessonId.includes('mock');
  
  const [isSaving, setIsSaving] = useState(true); 
  const [saveError, setSaveError] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string>('Estudiante OnixLingo');
  const [activeTab, setActiveTab] = useState<'cert' | 'report' | 'review'>('cert');
  const [certHash, setCertHash] = useState<string>('ONIX-XXXXXX');

  const isSuccess = accuracy >= 50; 
  const isExamMock = lessonId.includes('mock') || lessonId.includes('listening') || lessonId.includes('reading');

  // Cargar nombre de usuario real y generar hash único
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser') || Cookies.get('user_username');
      if (storedUser) {
        // Formatear nombre estético
        const formattedName = storedUser
          .split(/[_-]/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setStudentName(formattedName);
      }
      
      // Generar hash de verificación simulado
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let randomHash = 'ONIX-';
      for (let i = 0; i < 6; i++) {
        randomHash += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setCertHash(randomHash);
    }
  }, []);

  useEffect(() => {
    const executeSave = async () => {
      // 1. Lanzar confetti si aprobó
      if (isSuccess) {
        const duration = 4000;
        const end = Date.now() + duration;
        const frame = () => {
          confetti({
            particleCount: 4,
            angle: 60,
            spread: 60,
            origin: { x: 0 },
            colors: isExamMock ? ['#d97706', '#f59e0b', '#fbbf24'] : ['#6366f1', '#10b981', '#fbbf24']
          });
          confetti({
            particleCount: 4,
            angle: 120,
            spread: 60,
            origin: { x: 1 },
            colors: isExamMock ? ['#d97706', '#f59e0b', '#fbbf24'] : ['#6366f1', '#10b981', '#fbbf24']
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      }

      // 2. Guardar en Servidor
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          console.warn("Modo offline o sin token.");
          setIsSaving(false);
          return;
        }

        let stars = 0;
        if (accuracy >= 90) stars = 3;
        else if (accuracy >= 70) stars = 2;
        else if (accuracy >= 50) stars = 1;

        const payload = {
          lesson_id: lessonId,
          lesson_type: lessonType,
          score: accuracy, 
          current_step: totalSteps,
          total_steps: totalSteps,
          stars: stars,
          language: activeLanguage
        };

        const res = await fetch(`${API_URL}/api/v1/progress/complete`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error("Error guardando progreso en servidor");
            setSaveError("No se pudo registrar tu puntaje en el servidor.");
        }
      } catch (err) {
        console.error("Save error:", err);
        setSaveError("No se pudo conectar con el servidor online.");
      } finally {
        setTimeout(() => setIsSaving(false), 900);
      }
    };

    executeSave();
  }, []); 

  // ============================================================================
  // ================= CALCULO DE ESCALAS REALES DE CERTIFICACIÓN ================
  // ============================================================================
  
  const getExamCalculations = () => {
    const isToeic = lessonId.includes('toeic');
    const isToefl = lessonId.includes('toefl');
    const isIelts = lessonId.includes('ielts');

    if (isToeic) {
      // TOEIC: 10 a 990 puntos.
      // Se divide equitativamente 495 en Listening y 495 en Reading
      let listeningCorrect = 0, listeningTotal = 0;
      let readingCorrect = 0, readingTotal = 0;

      answerHistory.forEach(ans => {
        const isList = ans.type === 'listening_match' || ans.question.toLowerCase().includes('listen') || ans.question.toLowerCase().includes('audio') || (ans.id && ans.id.startsWith('T_L'));
        if (isList) {
          listeningTotal++;
          if (ans.isCorrect) listeningCorrect++;
        } else {
          readingTotal++;
          if (ans.isCorrect) readingCorrect++;
        }
      });

      // Si no hay historial (o carga rápida), dividimos la precisión global
      const lAcc = listeningTotal > 0 ? (listeningCorrect / listeningTotal) : (accuracy / 100);
      const rAcc = readingTotal > 0 ? (readingCorrect / readingTotal) : (accuracy / 100);

      const listeningScore = Math.min(495, Math.max(5, Math.round(5 + lAcc * 490)));
      const readingScore = Math.min(495, Math.max(5, Math.round(5 + rAcc * 490)));
      const totalScore = listeningScore + readingScore;

      // Equivalencia MCER (CEFR)
      let cefr = 'A1';
      let description = 'Principiante básico';
      if (totalScore >= 905) { cefr = 'C1'; description = 'Usuario Profesional Avanzado'; }
      else if (totalScore >= 785) { cefr = 'B2'; description = 'Usuario Independiente Avanzado'; }
      else if (totalScore >= 550) { cefr = 'B1'; description = 'Usuario de Nivel Intermedio'; }
      else if (totalScore >= 225) { cefr = 'A2'; description = 'Principiante con Habilidades Básicas'; }

      return {
        title: 'TOEIC® Listening & Reading',
        scoreLabel: 'Puntaje TOEIC®',
        score: `${totalScore} / 990`,
        cefr,
        description,
        subscores: [
          { name: 'Listening (Comprensión Auditiva)', val: `${listeningScore} / 495` },
          { name: 'Reading (Comprensión Lectora)', val: `${readingScore} / 495` }
        ]
      };
    } else if (isToefl) {
      // TOEFL iBT: 0 a 120 puntos
      const score = Math.min(120, Math.round((accuracy / 100) * 120));
      
      let cefr = 'A1';
      let description = 'Principiante';
      if (score >= 95) { cefr = 'C1'; description = 'Nivel Académico Avanzado'; }
      else if (score >= 72) { cefr = 'B2'; description = 'Nivel Universitario Independiente'; }
      else if (score >= 42) { cefr = 'B1'; description = 'Nivel Umbral / Transición'; }
      else if (score >= 32) { cefr = 'A2'; description = 'Plataforma Elemental'; }

      return {
        title: 'TOEFL® iBT Academic',
        scoreLabel: 'Score TOEFL® iBT',
        score: `${score} / 120`,
        cefr,
        description,
        subscores: [
          { name: 'Integrated Reading & Listening', val: `${Math.round(score * 0.6)} / 70` },
          { name: 'Integrated Writing & Structure', val: `${Math.round(score * 0.4)} / 50` }
        ]
      };
    } else if (isIelts) {
      // IELTS: Band Score 0.0 a 9.0 (pasos de 0.5)
      const rawBand = (accuracy / 100) * 9;
      // Redondear a la mitad más cercana (ej. 7.25 -> 7.5, 7.1 -> 7.0)
      const band = Math.min(9.0, Math.round(rawBand * 2) / 2);

      let cefr = 'A1';
      let description = 'Non-User';
      if (band >= 7.5) { cefr = 'C1/C2'; description = 'Expert Academic User'; }
      else if (band >= 6.0) { cefr = 'B2'; description = 'Competent / Independent User'; }
      else if (band >= 5.0) { cefr = 'B1'; description = 'Modest English Speaker'; }
      else if (band >= 4.0) { cefr = 'A2'; description = 'Limited User'; }

      return {
        title: 'IELTS® Academic Indicator',
        scoreLabel: 'Band Score IELTS®',
        score: `Band ${band.toFixed(1)}`,
        cefr,
        description,
        subscores: [
          { name: 'Academic Core Comprehension', val: `Band ${band.toFixed(1)}` },
          { name: 'Structural Cohesion Rank', val: `Nivel ${cefr}` }
        ]
      };
    }

    // Default estándar
    return {
      title: 'Evaluación Estratégica OnixLingo',
      scoreLabel: 'Precisión General',
      score: `${accuracy}%`,
      cefr: accuracy >= 90 ? 'C1' : accuracy >= 70 ? 'B2' : accuracy >= 50 ? 'B1' : 'A2',
      description: 'Módulo de Entrenamiento Completado',
      subscores: [
        { name: 'Precisión Global', val: `${accuracy}%` },
        { name: 'XP Acumulado', val: `+${xpEarned} XP` }
      ]
    };
  };

  const examData = getExamCalculations();

  // ============================================================================
  // ================= GENERACIÓN DE ANALÍTICA Y ÁREAS DE MEJORA ================
  // ============================================================================

  const getPerformanceAnalytics = () => {
    if (answerHistory.length === 0) {
      return {
        strengths: ['Comprensión auditiva general', 'Agilidad de respuesta'],
        weaknesses: ['Refuerzo de gramática académica', 'Vocabulario contextual avanzado'],
        tips: isExamMock 
          ? 'Te recomendamos repetir el simulador para familiarizarte con el formato oficial del examen.' 
          : 'Te recomendamos seguir repasando los ejercicios para afianzar los conceptos clave de la lección.'
      };
    }

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    let tips = '';

    // Agrupar respuestas por ID / Sección
    const incorrects = answerHistory.filter(a => !a.isCorrect);
    const corrects = answerHistory.filter(a => a.isCorrect);

    // TOEIC Analysis
    if (lessonId.includes('toeic')) {
      const failedL1 = incorrects.some(a => a.question.includes('PHOTOGRAPHS') || a.id === 'T_L1');
      const failedL3 = incorrects.some(a => a.question.includes('CONVERSATIONS') || a.id === 'T_L3' || a.id === 'T_L4');
      const failedL5 = incorrects.some(a => a.question.includes('TALKS') || a.id === 'T_L5');
      const failedR5 = incorrects.some(a => a.question.includes('INCOMPLETE SENTENCES') || a.id?.startsWith('T_R5'));
      const failedR7 = incorrects.some(a => a.question.includes('MEMORANDUM') || a.id?.startsWith('T_R7'));

      if (!failedL1) strengths.push('Descripción de Fotos (TOEIC Part 1)');
      else weaknesses.push('Descripción de Fotografías (Confusión en verbos de acción)');

      if (!failedL3 && !failedL5) strengths.push('Comprensión de Diálogos & Monólogos (Parts 3/4)');
      else weaknesses.push('Comprensión de Diálogos y Anuncios Rápidos (Detalles específicos)');

      if (!failedR5) strengths.push('Gramática en Oraciones Incompletas (Part 5)');
      else weaknesses.push('Estructura Gramatical (Colocaciones, adjetivos y adverbios)');

      if (!failedR7) strengths.push('Análisis de Memorandos y Mails Corporativos (Part 7)');
      else weaknesses.push('Lectura Rápida de Memorandos (Skimming y localización de datos)');

      if (weaknesses.length === 0) {
        tips = '¡Felicidades! Tienes un dominio absoluto de la estructura corporativa. Te sugerimos subir de nivel y probar el simulador TOEFL® iBT.';
      } else {
        tips = 'Foco de estudio: Trabaja especialmente en tus áreas débiles en la sección de Reading. Memoriza preposiciones combinadas como "comply with" y repasa el descarte rápido en audios.';
      }
    } 
    // TOEFL Analysis
    else if (lessonId.includes('toefl')) {
      const failedReading = incorrects.some(a => a.question.includes('Origin of Earth') || a.id?.startsWith('TF_R'));
      const failedListening = incorrects.some(a => a.question.includes('LECTURE') || a.id?.startsWith('TF_L'));
      const failedWriting = incorrects.some(a => a.id?.startsWith('TF_W'));

      if (!failedReading) strengths.push('Lectura Académica de Alta Densidad (Astrofísica/Geología)');
      else weaknesses.push('Comprensión de Textos Científicos (Vocabulario en contexto y analogías)');

      if (!failedListening) strengths.push('Síntesis de Clases Magistrales (Quimiosíntesis Marina)');
      else weaknesses.push('Escucha Activa en Conferencias Académicas (Toma de notas rápidas)');

      if (!failedWriting) strengths.push('Redacción de Tesis y Cohesión de Textos');
      else weaknesses.push('Uso de Conectores Formales de Contraste y Causa (However, Due to)');

      if (weaknesses.length === 0) {
        tips = 'Excelente perfil académico. Tu capacidad para interpretar papers científicos y lecciones universitarias es de nivel nativo C1/C2.';
      } else {
        tips = 'Recomendación: Lee artículos científicos en inglés (Nature o Scientific American) y practica estructurar oraciones utilizando conectores subordinados.';
      }
    }
    // IELTS & default Analysis
    else {
      const failedReading = incorrects.some(a => a.question.includes('Epigenetics') || a.id?.startsWith('IE_R'));
      const failedListening = incorrects.some(a => a.question.includes(' Liam') || a.id?.startsWith('IE_L'));
      const failedWriting = incorrects.some(a => a.id?.startsWith('IE_W'));

      if (!failedReading) strengths.push('Análisis de Textos de Divulgación Científica (Epigenética)');
      else weaknesses.push('Lectura Científica Rigurosa (Comprensión de conceptos avanzados)');

      if (!failedListening) strengths.push('Comprensión de Diálogos Académicos / Tutorías');
      else weaknesses.push('Audición de Acentos Globales (Variación de modulación e inglés formal)');

      if (!failedWriting) strengths.push('Conectores Coherentes de Causa y Efecto');
      else weaknesses.push('Vocabulario Formal en Reportes (Consequently, Therefore)');

      if (weaknesses.length === 0) {
        tips = isExamMock 
          ? '¡Impecable! Tienes un nivel excepcional. Estás listo para presentarte al examen real de certificación con plenas garantías.' 
          : '¡Impecable! Tienes un dominio excepcional de los contenidos. Estás listo para continuar con la siguiente lección curricular.';
      } else {
        tips = 'Tip del Asesor: Familiarízate con la modulación de acentos británicos y australianos en grabaciones académicas. Práctica ortografía precisa para evitar errores en completar espacios.';
      }
    }

    return {
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      tips
    };
  };

  const analytics = getPerformanceAnalytics();

  // Función para simular descarga del PDF del Certificado
  const handleDownload = () => {
    const reportText = `
    =======================================================
               ONIXLINGO OFFICIAL SCORE CERTIFICATE
    =======================================================
    NÚMERO DE REGISTRO: ${certHash}
    FECHA DE EMISIÓN: ${new Date().toLocaleDateString()}
    
    ESTUDIANTE: ${studentName}
    EVALUACIÓN: ${examData.title}
    
    RESULTADO OBTENIDO: ${examData.score}
    EQUIVALENTE MCER: ${examData.cefr} - ${examData.description}
    
    DESGLOSE DE SUB-PUNTAJES:
    ${examData.subscores.map(s => ` - ${s.name}: ${s.val}`).join('\n')}
    
    -------------------------------------------------------
    Firmado y Certificado por el Comité Académico de OnixLingo
    Código de verificación digital: https://verify.onixlingo.com/${certHash}
    =======================================================
    `;
    
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Certificado_${examData.title.replace(/\s+/g, '_')}_${studentName.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Fondo desenfocado */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" 
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-none shadow-2xl overflow-hidden flex flex-col lg:flex-row my-8"
      >
        
        {/* PANEL IZQUIERDO: DETALLES DE ACCESOS Y NAVEGACIÓN */}
        <div className="w-full lg:w-80 bg-slate-950/60 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-amber-500/10 p-2 text-amber-500">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest font-serif italic">OnixLingo Security</h3>
                <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold font-mono">Control Tower</p>
              </div>
            </div>

            <div className="space-y-1 mb-8">
              <button 
                onClick={() => setActiveTab('cert')}
                className={`w-full py-3 px-4 flex items-center gap-3 text-left transition-all rounded-none text-xs font-black uppercase tracking-wider border-l-2 ${activeTab === 'cert' ? 'bg-amber-600/10 border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <Award size={16} /> 📜 Certificado Oficial
              </button>
              <button 
                onClick={() => setActiveTab('report')}
                className={`w-full py-3 px-4 flex items-center gap-3 text-left transition-all rounded-none text-xs font-black uppercase tracking-wider border-l-2 ${activeTab === 'report' ? 'bg-amber-600/10 border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <FileText size={16} /> 📊 Reporte & IA Asesor
              </button>
              {answerHistory && answerHistory.length > 0 && (
                <button 
                  onClick={() => setActiveTab('review')}
                  className={`w-full py-3 px-4 flex items-center gap-3 text-left transition-all rounded-none text-xs font-black uppercase tracking-wider border-l-2 ${activeTab === 'review' ? 'bg-amber-600/10 border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <BookOpen size={16} /> 🔍 Revisión Detalle
                </button>
              )}
            </div>

            {/* Tarjeta de XP y Precisión rápida */}
            <div className="bg-slate-900 border border-slate-800 p-4 space-y-3 mb-6">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                <span>Precisión del Test:</span>
                <span className={`font-mono font-black ${isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>{accuracy}%</span>
              </div>
              <div className="w-full bg-slate-850 h-1.5 rounded-none overflow-hidden">
                <div className={`h-full ${isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${accuracy}%` }} />
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 pt-1">
                <span>XP Total Ganado:</span>
                <span className="font-mono font-black text-amber-400">+{xpEarned} XP</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-6 lg:mt-0">
            {isSuccess ? (
              <button onClick={onExit} className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-black text-[10px] uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-2">
                SALIR AL PANEL PRINCIPAL <ArrowRight size={14} />
              </button>
            ) : (
              <button onClick={onRetry} className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-2">
                <RotateCcw size={14} /> REINTENTAR MÓDULO
              </button>
            )}
            
            {isSuccess && (
              <button onClick={onRetry} className="w-full py-2.5 border border-slate-700 bg-transparent text-slate-400 hover:text-white font-black text-[9px] uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-1.5">
                <RotateCcw size={12} /> Repetir simulador
              </button>
            )}

            {!isSuccess && (
              <button onClick={onExit} className="w-full py-2 text-slate-500 hover:text-slate-300 text-center font-bold text-[9px] uppercase tracking-widest">
                {isExamMock ? 'Abandonar examen' : 'Abandonar lección'}
              </button>
            )}
          </div>
        </div>

        {/* PANEL DERECHO: VISUALIZACIÓN DINÁMICA DE PESTAÑAS */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-slate-900/40 relative">
          
          <AnimatePresence mode="wait">
            
            {/* PESTAÑA 1: CERTIFICADO PREMIUM */}
            {activeTab === 'cert' && (
              <motion.div
                key="cert-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-serif font-black italic tracking-wide text-amber-500 uppercase">
                      Certificate of Achievement
                    </h2>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mt-0.5">CREDENCIAL ACADÉMICA OFICIAL</p>
                  </div>
                  {isSuccess && (
                    <button 
                      onClick={handleDownload}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-amber-400 hover:text-amber-300 transition-all text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Download size={12} /> Descargar TXT
                    </button>
                  )}
                </div>

                {/* DISEÑO DEL CERTIFICADO FÍSICO DIGITALIZADO */}
                <div className="relative border-4 border-double border-amber-950 bg-slate-950 p-6 md:p-8 text-center overflow-hidden shadow-2xl rounded-none">
                  
                  {/* Filigranas y Marcas de agua decorativas */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
                    <Shield size={260} className="text-amber-500" />
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent blur-2xl" />

                  {/* Cabecera */}
                  <div className="flex justify-center mb-4">
                    <Award size={44} className="text-amber-500 animate-[pulse_2s_infinite]" />
                  </div>

                  <p className="text-[9px] font-mono tracking-[0.4em] uppercase text-amber-500/80 mb-2">ONIXLINGO ACADEMIC COMMISSION</p>
                  <h4 className="text-xs text-slate-400 font-serif italic mb-6">Hereby certifies that</h4>

                  <h3 className="text-2xl font-black text-slate-100 font-serif tracking-wide border-b border-slate-800 pb-2 max-w-lg mx-auto mb-2">
                    {studentName}
                  </h3>

                  <p className="text-[10px] text-slate-400 max-w-md mx-auto mb-6">
                    has successfully sat the rigorous evaluation and demonstrated proficiency in the mock certification standard for
                  </p>

                  <h2 className="text-lg font-black text-amber-400 uppercase tracking-widest font-mono mb-6">
                    {examData.title}
                  </h2>

                  {/* BLOQUE DE PUNTUACIÓN DE ESCALA REAL */}
                  <div className="bg-slate-900/60 border border-amber-950 p-4 max-w-sm mx-auto mb-6 flex items-center justify-around">
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase tracking-wider font-bold block">{examData.scoreLabel}</span>
                      <span className="text-2xl font-black text-amber-400 font-mono tracking-wider">{examData.score}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-850" />
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase tracking-wider font-bold block">Rango MCER (CEFR)</span>
                      <span className="text-2xl font-black text-white font-mono tracking-widest">{examData.cefr}</span>
                    </div>
                  </div>

                  <p className="text-[9px] text-slate-400 italic mb-8">
                    "{examData.description}"
                  </p>

                  {/* Firmas y Sellos */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-850 pt-4 text-left text-[8px] font-mono text-slate-500 uppercase">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-amber-500/60" />
                      <span>Emitido el: {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash size={14} className="text-amber-500/60" />
                      <span>ID Credencial: {certHash}</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-black text-amber-500/80">DIRECTORATE SIGNATURE</span>
                      <span className="text-[7px] lowercase text-slate-600 block">secured_by_onixlingo_neural_node</span>
                    </div>
                  </div>

                </div>

                {!isSuccess && (
                  <div className="bg-rose-950/20 border border-rose-900/40 p-4 flex gap-3 text-rose-300 text-xs">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <div>
                      <p className="font-bold">Módulo reprobado</p>
                      <p className="text-[11px] text-rose-400 mt-0.5">Necesitas una precisión mínima del 50% para que OnixLingo emita tu certificado oficial de puntaje real.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* PESTAÑA 2: ANALÍTICA BASADA EN IA Y MEJORAS */}
            {activeTab === 'report' && (
              <motion.div
                key="report-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-serif font-black italic tracking-wide text-amber-500 uppercase">
                    Reporte de Fortalezas y Áreas de Mejora
                  </h2>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mt-0.5">ANÁLISIS DE HABILIDADES BASADO EN NEURAL ADVISOR IA</p>
                </div>

                {/* Subscores Desglosados */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {examData.subscores.map((sub, idx) => (
                    <div key={idx} className="bg-slate-950/80 border border-slate-800 p-4 rounded-none">
                      <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 block mb-1">{sub.name}</span>
                      <span className="text-lg font-black text-amber-400 font-mono">{sub.val}</span>
                    </div>
                  ))}
                </div>

                {/* Fortalezas y Debilidades */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Fortalezas Acertadas */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Fortalezas Demostradas
                    </h4>
                    <div className="space-y-2">
                      {analytics.strengths.map((str, i) => (
                        <div key={i} className="bg-emerald-950/15 border border-emerald-900/30 p-3 flex items-start gap-2.5 rounded-none">
                          <ChevronRight size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-emerald-300">{str}</span>
                        </div>
                      ))}
                      {analytics.strengths.length === 0 && (
                        <p className="text-[11px] text-slate-500 italic">No se detectaron fortalezas destacadas en este intento.</p>
                      )}
                    </div>
                  </div>

                  {/* Áreas de Mejora */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                      <AlertCircle size={14} /> Áreas que Requieren Atención
                    </h4>
                    <div className="space-y-2">
                      {analytics.weaknesses.map((weak, i) => (
                        <div key={i} className="bg-rose-950/15 border border-rose-900/30 p-3 flex items-start gap-2.5 rounded-none">
                          <ChevronRight size={12} className="text-rose-500 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-rose-300">{weak}</span>
                        </div>
                      ))}
                      {analytics.weaknesses.length === 0 && (
                        <div className="bg-emerald-950/15 border border-emerald-900/30 p-3 flex items-start gap-2.5 rounded-none">
                          <Sparkles size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-emerald-300">¡Ninguna! Has completado {isExamMock ? 'el examen' : 'la lección'} de forma perfecta.</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* RECOMENDACIONES DE NEURAL ADVISOR IA */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-none relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/5 to-transparent blur-xl pointer-events-none" />
                  
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-amber-400 animate-spin" style={{ animationDuration: '6s' }} /> Recomendación Estratégica OnixLingo
                  </h4>
                  
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {analytics.tips}
                  </p>
                </div>

              </motion.div>
            )}

            {activeTab === 'review' && (
              <motion.div
                key="review-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 max-h-[500px] overflow-y-auto pr-2"
              >
                <div>
                  <h2 className="text-xl font-serif font-black italic tracking-wide text-amber-500 uppercase">
                    Revisión Detallada de Preguntas
                  </h2>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mt-0.5">HISTORIAL DE RESPUESTAS Y EXPLICACIONES</p>
                </div>

                <div className="space-y-4">
                  {answerHistory.map((ans, idx) => (
                    <div 
                      key={idx} 
                      className={`p-5 border rounded-none ${
                        ans.isCorrect 
                          ? 'bg-emerald-950/10 border-emerald-900/20 text-emerald-100' 
                          : 'bg-rose-950/10 border-rose-900/20 text-rose-100'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <span className="text-[9px] font-black uppercase tracking-wider font-mono text-slate-400">
                          PREGUNTA {idx + 1}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-widest font-mono px-2 py-0.5 rounded-none ${
                          ans.isCorrect 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {ans.isCorrect ? 'Correcta' : 'Incorrecta'}
                        </span>
                      </div>
                      
                      <p className="text-sm font-black text-slate-200 uppercase tracking-wide leading-relaxed mb-4">{ans.question}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-4">
                        <div className="bg-slate-950 border border-slate-850 p-3 rounded-none">
                          <span className="text-slate-500 block text-[8px] uppercase tracking-wider font-mono font-bold mb-1">Tu Respuesta:</span>
                          <span className={`${ans.isCorrect ? 'text-emerald-400' : 'text-rose-400'} font-extrabold`}>{ans.answer || '(Sin respuesta)'}</span>
                        </div>
                        {!ans.isCorrect && (
                          <div className="bg-slate-950 border border-slate-850 p-3 rounded-none">
                            <span className="text-slate-500 block text-[8px] uppercase tracking-wider font-mono font-bold mb-1">Respuesta Correcta:</span>
                            <span className="text-emerald-400 font-extrabold">{ans.correctAnswer}</span>
                          </div>
                        )}
                      </div>

                      {ans.explanation && (
                        <div className="p-4 bg-slate-950/60 border border-slate-850 text-[10px] leading-relaxed uppercase tracking-wider text-slate-400 rounded-none">
                          <span className="font-black text-[8px] tracking-widest text-teal-500 block mb-1">Análisis de la Diapositiva / Evaluación:</span>
                          {ans.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                  {answerHistory.length === 0 && (
                    <p className="text-xs text-slate-500 italic text-center py-8">No hay respuestas registradas para revisar.</p>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* MENSAJE INFORMATIVO INFERIOR */}
          {saveError && (
            <div className="text-[9px] uppercase tracking-widest font-mono text-rose-500 font-bold mt-4 animate-pulse">
              ⚠️ {saveError}
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
}
