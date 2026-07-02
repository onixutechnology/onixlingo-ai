'use client';
import LandingFooter from '@/components/LandingFooter';
import LandingNavbar from '@/components/LandingNavbar';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Building2, Crown, Trophy, ArrowRight, ChevronRight, CheckCircle2,
  Briefcase, MessageSquare
} from 'lucide-react';

const BoardroomSimulator = dynamic(() => import('./BoardroomSimulator'), { ssr: false });

const roles = [
  { id: 'ceo', name: 'CEO (Director Ejecutivo)', icon: Crown, desc: 'Enfocado en visión estratégica, diplomacia y discursos de alta dirección.' },
  { id: 'cfo', name: 'CFO (Director de Finanzas)', icon: Briefcase, desc: 'Enfocado en precisión analítica, reportes trimestrales y juntas de inversión.' },
  { id: 'cmo', name: 'CMO (Director de Marketing)', icon: MessageSquare, desc: 'Enfocado en persuasión, branding de marca y relaciones públicas.' }
];

const scenarios = [
  {
    id: 'ma',
    role: 'ceo',
    title: 'Negociación de Fusión & Adquisición (M&A)',
    situation: 'Debes presentar los términos finales de una adquisición estratégica ante un panel de accionistas escépticos de OnixLingo.',
    prompt: 'Presenta la justificación estratégica del acuerdo de $40M, minimizando el riesgo de pasivos ocultos.',
    teleprompter: 'Este acuerdo representa una sinergia operativa sin precedentes. Hemos auditado con rigor cada pasivo estratégico para garantizar un proceso de integración limpio.',
    jargonKeywords: ['sinergia', 'pasivo', 'estratégico', 'integración']
  },
  {
    id: 'vc',
    role: 'ceo',
    title: 'Series B Pitch a Venture Capitalists',
    situation: 'Estás buscando levantar $15 millones de dólares ante un sindicato de fondos de Silicon Valley.',
    prompt: 'Explica tu tracción del último año y el multiplicador de valor proyectado de la tecnología de OnixLingo.',
    teleprompter: 'Nuestra tasa de retención corporativa se mantiene en un noventa y cuatro por ciento, con un costo de adquisición de clientes optimizado al máximo.',
    jargonKeywords: ['retención', 'adquisición', 'optimizado', 'clientes']
  },
  {
    id: 'pr',
    role: 'cmo',
    title: 'Conferencia de Prensa por Crisis de Datos',
    situation: 'Una filtración menor de datos simulada requiere un discurso público sumamente controlado y empático para calmar a los clientes.',
    prompt: 'Comunica las medidas de seguridad inmediatas sin sonar defensivo ni admitir negligencia legal directa.',
    teleprompter: 'Nuestra prioridad absoluta es resguardar la soberanía de los datos. Hemos mitigado la brecha en cuarenta minutos e implementado un cifrado avanzado.',
    jargonKeywords: ['soberanía', 'datos', 'mitigado', 'cifrado']
  },
  {
    id: 'ipo',
    role: 'cfo',
    title: 'Presentación de Cierre Fiscal para IPO',
    situation: 'Presentación de resultados financieros consolidados ante la junta preparatoria del debut en Wall Street.',
    prompt: 'Justifica el margen operativo del trimestre y explica los gastos amortizados de I+D.',
    teleprompter: 'Amortizamos la inversión en el motor de análisis algorítmico a cinco años, asegurando un margen neto estable del treinta y dos por ciento para el debut bursátil.',
    jargonKeywords: ['amortizamos', 'margen', 'estable', 'bursátil']
  }
];

const executiveUnits = [
  { id: '01', title: 'Fundamentos de Oratoria Alta Dirección', topic: 'Postura, modulación del ritmo e inflexión tonal de autoridad.' },
  { id: '02', title: 'Fusiones e Integración de Culturas', topic: 'Uso de vocabulario diplomático durante adquisiciones hostiles.' },
  { id: '03', title: 'Roadshows Financieros e IPO', topic: 'Presentación de métricas de capital y rentabilidad ante bolsas globales.' },
  { id: '04', title: 'Gestión Lingüística de Crisis', topic: 'Comunicación de incidentes operativos mitigando el pánico de inversores.' },
  { id: '05', title: 'El Arte del Pitch Persuasivo', topic: 'Estructuración de discursos de inversión con alta densidad léxica.' },
  { id: '06', title: 'Diplomacia y Alianzas Estatales', topic: 'Protocolos de lenguaje corporativo en negociaciones de alto nivel.' }
];

export default function ProgramaEjecutivoPage() {
  const [selectedRole, setSelectedRole] = useState('ceo');
  const [selectedScenarioId, setSelectedScenarioId] = useState('ma');
  const [certShared, setCertShared] = useState(false);

  const activeScenarios = useMemo(() => scenarios.filter(s => s.role === selectedRole), [selectedRole]);
  const currentScenario = useMemo(() => scenarios.find(s => s.id === selectedScenarioId) || scenarios[0], [selectedScenarioId]);

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    const related = scenarios.find(s => s.role === roleId);
    if (related) {
      setSelectedScenarioId(related.id);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D4AF37]/30 selection:text-black">
      
      {/* NAVBAR */}
      <LandingNavbar />

      {/* HERO (BLACK) */}
      <header className="pt-28 pb-12 px-6 relative overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#D4AF37]/10 blur-[140px] opacity-60 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest shadow-none">
            <Crown size={12} className="text-[#D4AF37] animate-pulse" />
            Alta Dirección Corporativo Training
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Domina el Lenguaje de los<br />
            <span className="text-[#D4AF37]">Negocios Globales.</span>
          </h1>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed font-light">
            El simulador definitivo para directivos y líderes corporativos. Entrena oratoria, pitch con inversionistas y diplomacia ejecutiva en entornos reales.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <a href="#simulator">
              <button className="bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold py-3.5 px-8 transition-all flex items-center gap-2 shadow-none shadow-[#D4AF37]/15">
                Probar Simulador <ArrowRight size={18} />
              </button>
            </a>
            <Link href="/planes">
                <button className="bg-transparent border border-[#D4AF37] hover:bg-[#D4AF37] text-slate-900 hover:text-black font-semibold py-3.5 px-8 transition-all">
                Planes Corporativos
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* QUICK STATS (WHITE) */}
      <section className="py-10 px-6 border-y border-black bg-white text-black">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { val: '60', label: 'Unidades Executive', color: 'text-black' },
            { val: '1,400+', label: 'Escenarios Reales', color: 'text-[#D4AF37]' },
            { val: '98.4%', label: 'Precisión Fonométrica', color: 'text-black' },
            { val: 'OnixLingo', label: 'Estándar Oficial', color: 'text-black' }
          ].map((s, i) => (
            <div key={i} className="p-5 border border-black bg-white shadow-xl">
              <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-[9px] text-gray-600 font-bold uppercase mt-1 tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOARDROOM SIMULATOR (GOLD 20%) */}
      <section id="simulator" className="py-20 px-6 relative bg-[#D4AF37]/20 text-black">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-black text-black/70 uppercase tracking-widest">Simulator Console</span>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Simulador de Oratoria Directiva Alta Dirección</h2>
            <p className="text-black text-sm max-w-xl mx-auto font-medium">Selecciona tu rol estratégico y lee la frase ante la consola fonométrica.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Roles selector */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-[10px] font-bold text-black uppercase tracking-wider">1. Perfil Alta Dirección</h4>
              <div className="space-y-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleRoleChange(r.id)}
                      className={`w-full p-4 border text-left transition-all flex gap-3.5 ${selectedRole === r.id ? 'border-black bg-white' : 'border-black/20 bg-white hover:border-black/50'}`}
                    >
                      <div className={`p-2 shrink-0 ${selectedRole === r.id ? 'bg-[#D4AF37] text-black' : 'bg-white text-slate-500'}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className={`font-bold text-xs ${selectedRole === r.id ? 'text-slate-900' : 'text-black'}`}>{r.name}</p>
                        <p className={`text-[10px] leading-relaxed mt-0.5 ${selectedRole === r.id ? 'text-slate-700' : 'text-gray-600'}`}>{r.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-black space-y-2">
                <h4 className="text-[10px] font-bold text-black uppercase tracking-wider">2. Caso de Negociación</h4>
                <div className="space-y-1.5">
                  {activeScenarios.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedScenarioId(s.id);
                      }}
                      className={`w-full p-3 text-left text-xs font-bold border transition-colors flex justify-between items-center ${selectedScenarioId === s.id ? 'border-black text-slate-900 bg-white' : 'border-black/20 bg-white text-black hover:border-black/50'}`}
                    >
                      <span>{s.title}</span>
                      <ChevronRight size={12} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <BoardroomSimulator key={currentScenario.id} currentScenario={currentScenario} />

          </div>
        </div>
      </section>

      {/* CURRICULUM SYLLABUS (BLACK) */}
      <section className="py-20 px-6 bg-slate-50 border-y border-black text-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">Temario del Programa</span>
            <h2 className="text-3xl font-bold text-slate-900">60 Unidades de Especialización Directiva</h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">Cada módulo incluye simulaciones adaptativas específicas y análisis de vocabulario Alta Dirección.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {executiveUnits.map((u) => (
              <div key={u.id} className="p-5 border border-slate-200 bg-slate-50 hover:border-[#D4AF37] transition-all group flex gap-4">
                <div className="text-xl font-black text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors shrink-0">{u.id}</div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{u.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-normal mt-1">{u.topic}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCREDITATION (WHITE) */}
      <section className="py-20 px-6 relative overflow-hidden bg-white text-black">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 blur-[120px] pointer-events-none rounded-none" />
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-black text-black uppercase tracking-widest bg-[#D4AF37] px-2 py-1">Acreditación Oficial</span>
              <h2 className="text-3xl font-bold text-black leading-tight">
                Certificación Directiva:<br />
                <span className="text-[#D4AF37]">Executive Speech Standard</span>
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed font-light">
                Al completar la currícula de 60 unidades, obtendrás reportes analíticos detallados respaldados por OnixLingo, ideales para demostrar tu evolución ante departamentos de RH.
              </p>

              <ul className="space-y-3 text-xs text-gray-700 font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0" />
                  <span>Alineado con el estándar C2 del MCER.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0" />
                  <span>Integración de un solo clic con LinkedIn.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0" />
                  <span>Acreditación verificable y auditable por terceros.</span>
                </li>
              </ul>
            </div>

            {/* Certificate */}
            <div className="lg:col-span-7">
              <div className="p-6 md:p-8 bg-white border border-black rounded-none shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 blur-xl pointer-events-none rounded-none" />
                
                <div className="border-4 border-double border-slate-900 p-8 md:p-12 space-y-8 text-center bg-white relative">
                  {/* Watermark-like background */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <Crown size={200} className="text-black" />
                  </div>

                  <div className="flex justify-center relative z-10">
                    <div className="w-14 h-14 bg-white text-[#D4AF37] flex items-center justify-center border-2 border-slate-900 shadow-sm">
                      <Crown size={28} />
                    </div>
                  </div>

                  <div className="space-y-2 relative z-10">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Acreditación Oficial</p>
                    <h3 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-wide font-medium">Executive Speech Standard</h3>
                  </div>

                  <div className="space-y-4 relative z-10 py-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Otorgado a:</p>
                    <p className="font-serif text-3xl font-bold text-slate-900 tracking-widest border-b border-slate-300 pb-2 max-w-sm mx-auto">
                      A. P. C.
                    </p>
                    <p className="text-xs text-slate-600 italic font-serif leading-relaxed max-w-md mx-auto">
                      "Por acreditar con excelencia las 60 unidades del simulador interactivo de oratoria de alta dirección internacional."
                    </p>
                  </div>

                  <div className="flex justify-between items-end text-[9px] text-slate-600 font-mono pt-6 border-t border-slate-200 relative z-10">
                    <div className="text-left space-y-1">
                      <p className="tracking-widest">ID: ONIX-839-C2</p>
                      <p className="text-slate-900 font-bold bg-[#D4AF37]/20 px-2 py-0.5 inline-block border border-[#D4AF37]">VERIFICACIÓN ACTIVA</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="border-b border-slate-400 pb-1 mb-1 px-4">
                         <span className="font-script text-lg text-slate-800">O.L. Board</span>
                      </div>
                      <p className="tracking-widest">DIRECCIÓN ACADÉMICA</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-gray-600">
                  <span className="font-semibold">Comparte tu acreditación:</span>
                  <div className="flex gap-2">
                    <button onClick={() => setCertShared(true)} className="flex items-center gap-1.5 bg-white text-[#D4AF37] py-1.5 px-3 hover:opacity-90 transition-all font-semibold rounded-none">
                      LinkedIn
                    </button>
                    <button onClick={() => setCertShared(true)} className="flex items-center gap-1.5 bg-white text-[#D4AF37] py-1.5 px-3 hover:opacity-90 transition-all font-semibold rounded-none">
                      Twitter
                    </button>
                  </div>
                </div>

                {certShared && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 text-green-700 text-[10px] text-center font-bold">
                    ✓ Credencial vinculada a tu cuenta con éxito.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* B2B FOOTER CALL TO ACTION (GOLD 20%) */}
      <section className="py-20 px-6 bg-[#D4AF37]/20 border-t border-black text-center relative overflow-hidden text-black">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10" />
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-10 h-10 bg-white text-[#D4AF37] flex items-center justify-center mx-auto border border-black">
            <Building2 size={20} />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-black">¿Implementación Corporativa?</h2>
            <p className="text-gray-700 text-sm font-medium leading-relaxed">
              Consigue licencias por volumen, control multi-tenant de analíticas, SSO y currícula personalizada de marca para tus equipos directivos.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/planes">
              <button className="bg-white hover:bg-slate-50 text-[#D4AF37] font-bold py-3 px-6 text-xs uppercase tracking-widest transition-colors shadow-none border border-[#D4AF37]">
                Ver Planes B2B
              </button>
            </Link>
            <Link href="/ventas">
              <button className="bg-transparent border border-black text-black hover:bg-white hover:text-slate-900 font-semibold py-3 px-6 text-xs uppercase tracking-widest transition-all">
                Contactar Ventas
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <LandingFooter />

    </div>
  );
}
