'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Award, Lock, Flame, BookOpen, Swords, ArrowLeft, Calendar, Zap, 
  Trophy, User, Mail, Phone, Globe, Shield, Copy, Check, Save, LogOut,
  Eye, EyeOff, X, Sparkles, CreditCard, CheckCircle2, Briefcase,
  Activity, Clock, MapPin, Star, ChevronUp, BarChart2, TrendingUp,
  Percent
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { UpgradeModal } from '@/components/pro/UpgradeModal';
import PushNotificationManager from '../components/PushNotificationManager';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');

  // Control del modal de historial y racha
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyTab, setHistoryTab] = useState<'xp' | 'streak'>('xp');
  const [visibleCount, setVisibleCount] = useState(16);

  // Estado para Toast Premium
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const showToastMsg = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const handleLogout = async () => {
    try { await apiClient.post('/auth/logout'); }
    catch (err) { console.error('Logout error:', err); }
    Cookies.remove('access_token', { path: '/' });
    Cookies.remove('username', { path: '/' });
    router.push('/login');
    router.refresh();
  };

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    country_code: 'MX',
    avatar_url: '',
    password: '',
    confirm_password: ''
  });

  const [passwordError, setPasswordError] = useState('');

  const COUNTRIES = [
    { code: 'MX', label: 'México', flag: '🇲🇽' },
    { code: 'ES', label: 'España', flag: '🇪🇸' },
    { code: 'US', label: 'Estados Unidos', flag: '🇺🇸' },
    { code: 'CO', label: 'Colombia', flag: '🇨🇴' },
    { code: 'AR', label: 'Argentina', flag: '🇦🇷' },
    { code: 'CL', label: 'Chile', flag: '🇨🇱' },
    { code: 'PE', label: 'Perú', flag: '🇵🇪' },
    { code: 'VE', label: 'Venezuela', flag: '🇻🇪' },
    { code: 'EC', label: 'Ecuador', flag: '🇪🇨' },
    { code: 'GT', label: 'Guatemala', flag: '🇬🇹' },
    { code: 'CA', label: 'Canadá', flag: '🇨🇦' },
    { code: 'BR', label: 'Brasil', flag: '🇧🇷' },
    { code: 'DE', label: 'Alemania', flag: '🇩🇪' },
    { code: 'GB', label: 'Reino Unido', flag: '🇬🇧' },
    { code: 'FR', label: 'Francia', flag: '🇫🇷' },
  ];

  // Avatares ilustrados, sencillos y sonrientes (estilo Duolingo/Slack de DiceBear)
  const PRESET_AVATARS = [
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Lily&backgroundColor=0f172a', // Carita feliz guiñando
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Milo&backgroundColor=0d9488', // Carita sonriente con lentes
    'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Oliver&backgroundColor=4f46e5', // Carita feliz de lado
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=0f172a', // Dibujo sonriente masculino
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=0d9488', // Dibujo sonriente femenino
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=4f46e5', // Dibujo sonriente moderno
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Sophie&backgroundColor=0f172a', // Ilustración dulce femenina
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Leo&backgroundColor=0d9488', // Ilustración dulce de niño
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Maya&backgroundColor=4f46e5', // Ilustración dulce alegre
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, statsRes, mapRes] = await Promise.all([
        apiClient.get('/users/me'),
        apiClient.get('/progress/stats'),
        apiClient.get('/progress/map')
      ]);

      setProfile(profileRes.data);
      setStats(statsRes.data);

      // Cargar lista de lecciones completadas para timeline e historial real
      const standardList = mapRes.data.standard || [];
      const proList = mapRes.data.pro || [];
      const vocabList = mapRes.data.vocab || [];
      const allLessons = [...standardList, ...proList, ...vocabList];
      const completed = allLessons
        .filter((p: any) => p.status === 'completed')
        .sort((a: any, b: any) => {
          const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
          const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
          return dateB - dateA; // Orden descendente por fecha
        });
      setCompletedLessons(completed);

      // Cargar avatar desde localStorage si existe, o usar el del perfil
      const cachedAvatar = localStorage.getItem(`onix_avatar_${profileRes.data.username}`);

      setFormData({
        full_name: profileRes.data.full_name || '',
        email: profileRes.data.email || '',
        phone: profileRes.data.phone || '',
        country_code: profileRes.data.country_code || 'MX',
        avatar_url: cachedAvatar || profileRes.data.avatar_url || '',
        password: '',
        confirm_password: ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      showToastMsg('Error al conectar con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (updatedFields?: any) => {
    // Validar contraseña
    if (!updatedFields && formData.password) {
      if (formData.password.length < 6) {
        setPasswordError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (formData.password !== formData.confirm_password) {
        setPasswordError('Las contraseñas no coinciden.');
        return;
      }
    }
    setPasswordError('');
    setSaving(true);
    try {
      const updateData: any = { ...formData, ...(updatedFields || {}) };
      delete updateData.confirm_password;
      if (!updateData.password) delete updateData.password;

      // Guardar localmente el avatar si fue modificado
      if (updateData.avatar_url) {
        localStorage.setItem(`onix_avatar_${profile?.username}`, updateData.avatar_url);
      }

      await apiClient.put('/users/me', updateData);
      
      // Recargar datos
      const [profileRes, statsRes] = await Promise.all([
        apiClient.get('/users/me'),
        apiClient.get('/progress/stats')
      ]);

      setProfile(profileRes.data);
      setStats(statsRes.data);

      setFormData(prev => ({
        ...prev,
        full_name: profileRes.data.full_name || '',
        email: profileRes.data.email || '',
        phone: profileRes.data.phone || '',
        country_code: profileRes.data.country_code || 'MX',
        avatar_url: localStorage.getItem(`onix_avatar_${profileRes.data.username}`) || profileRes.data.avatar_url || '',
        password: '',
        confirm_password: ''
      }));

      showToastMsg('Perfil ejecutivo actualizado correctamente', 'success');
    } catch (err) {
      showToastMsg('Error al actualizar las credenciales', 'error');
    } finally {
      setSaving(false);
    }
  };

  const selectAvatar = (url: string) => {
    setFormData(prev => ({ ...prev, avatar_url: url }));
    setShowAvatarPicker(false);
    handleSave({ avatar_url: url });
  };

  const copyReferral = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      setCopied(true);
      showToastMsg('Código de referido copiado al portapapeles', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ---- RANGOS EJECUTIVOS ----
  const getExecutiveRank = (points: number) => {
    const pts = points || 0;
    if (pts < 1000) return { label: 'Analista Junior', nextLabel: 'Asociado Senior', min: 0, max: 1000, color: 'from-slate-400 to-slate-500', badge: 'bg-white text-slate-700 border-slate-200' };
    if (pts < 3000) return { label: 'Asociado Senior', nextLabel: 'Gerente Líder', min: 1000, max: 3000, color: 'from-teal-500 to-emerald-400', badge: 'bg-teal-50 text-teal-800 border-teal-300' };
    if (pts < 6000) return { label: 'Gerente Líder', nextLabel: 'Vicepresidente de Comunicaciones', min: 3000, max: 6000, color: 'from-indigo-500 to-blue-400', badge: 'bg-indigo-50 text-indigo-800 border-indigo-300' };
    if (pts < 12000) return { label: 'Vicepresidente de Comunicaciones', nextLabel: 'Director de Elocuencia', min: 6000, max: 12000, color: 'from-amber-500 to-yellow-400', badge: 'bg-[#D4AF37]/10 text-[#D4AF37] border-amber-300' };
    return { label: 'Director de Elocuencia', nextLabel: 'Cima Alta Dirección', min: 12000, max: 12000, color: 'from-emerald-500 to-teal-400', badge: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30' };
  };

  const userPoints = stats?.total_xp || profile?.stats?.total_xp || 0;
  const streakDays = stats?.streak_days || profile?.stats?.streak_days || 0;
  const rank = getExecutiveRank(userPoints);
  const progressPct = rank.max === rank.min ? 100 : Math.min(100, Math.max(0, ((userPoints - rank.min) / (rank.max - rank.min)) * 100));

  // ---- MÉTRICAS DE HABILIDADES DIVERSIFICADAS ----
  const skills = [
    {
      name: 'Speaking',
      desc: 'Oratoria Directiva y Juntas',
      val: stats?.skills_radar?.find((s: any) => s.subject === 'Speaking')?.A ?? 0,
      color: 'from-teal-500 to-emerald-400',
      icon: <Sparkles size={13} className="text-[#D4AF37]" />
    },
    {
      name: 'Listening',
      desc: 'Comprensión de Audiencias',
      val: stats?.skills_radar?.find((s: any) => s.subject === 'Listening')?.A ?? 0,
      color: 'from-indigo-500 to-blue-400',
      icon: <Globe size={13} className="text-[#D4AF37]" />
    },
    {
      name: 'Reading',
      desc: 'Auditoría y Memos Técnicos',
      val: stats?.skills_radar?.find((s: any) => s.subject === 'Reading')?.A ?? 0,
      color: 'from-emerald-500 to-green-400',
      icon: <BookOpen size={13} className="text-[#D4AF37]" />
    },
    {
      name: 'Writing',
      desc: 'Correspondencia Corporativa',
      val: stats?.skills_radar?.find((s: any) => s.subject === 'Writing')?.A ?? 0,
      color: 'from-amber-500 to-yellow-400',
      icon: <Save size={13} className="text-[#D4AF37]" />
    },
    {
      name: 'Grammar',
      desc: 'Estructura e Hilo Conductor',
      val: stats?.skills_radar?.find((s: any) => s.subject === 'Grammar')?.A ?? 0,
      color: 'from-purple-500 to-violet-400',
      icon: <Shield size={13} className="text-purple-500" />
    },
    {
      name: 'Vocabulary',
      desc: 'Terminología Directiva Alta Dirección',
      val: stats?.skills_radar?.find((s: any) => s.subject === 'Vocabulary')?.A ?? 0,
      color: 'from-pink-500 to-rose-400',
      icon: <Briefcase size={13} className="text-pink-500" />
    },
  ];

  // ---- FILTRO DE LA VITRINA DE TROFEOS ----
  const [trophyFilter, setTrophyFilter] = useState<'all' | 'business' | 'exams' | 'habits'>('all');

  // ---- GENERADOR DINÁMICO DE 500 TROFEOS (CERO HARDCODING) ----
  const generateTrophies = (
    completed: any[], 
    points: number, 
    streak: number, 
    userStats: any, 
    userProfile: any
  ) => {
    const list: any[] = [];
    
    // 1. LOS 12 LOGROS MAESTROS PRINCIPALES
    const masterTrophies = [
      {
        id: 'c_suite',
        category: 'business',
        title: 'Comunicador Alta Dirección',
        desc: 'Dominio absoluto de la oratoria y liderazgo directivo en juntas.',
        req: 'Plan Pro/Executive y más de 1,000 XP.',
        icon: <Award size={20} />,
        color: 'from-amber-400 via-yellow-300 to-amber-600',
        glow: 'shadow-amber-500/20',
        isUnlocked: !!userProfile?.is_pro && points >= 1000
      },
      {
        id: 'master_a1',
        category: 'business',
        title: 'Pionero A1',
        desc: 'Fundamentos sólidos en terminología de negocios esenciales.',
        req: 'Completa 10 lecciones A1.',
        icon: <BookOpen size={20} />,
        color: 'from-slate-300 via-slate-100 to-slate-400',
        glow: 'shadow-slate-400/20',
        isUnlocked: !!userStats?.achievements?.includes('master_a1')
      },
      {
        id: 'perfectionist',
        category: 'business',
        title: 'Precisión Perfecta',
        desc: 'Alcanza el 100% de efectividad en una lección directiva.',
        req: 'Obtén 100 en cualquier lección.',
        icon: <CheckCircle2 size={20} />,
        color: 'from-emerald-400 via-emerald-200 to-teal-600',
        glow: 'shadow-emerald-500/20',
        isUnlocked: !!userStats?.achievements?.includes('perfectionist')
      },
      {
        id: 'fluent_speaker',
        category: 'business',
        title: 'Orador Fluido',
        desc: 'Nivel sobresaliente de elocuencia y soltura oral estimada.',
        req: 'Fluidez promedio mayor o igual a 80%.',
        icon: <Sparkles size={20} />,
        color: 'from-teal-400 via-cyan-100 to-indigo-500',
        glow: 'shadow-teal-500/20',
        isUnlocked: (userStats?.fluency_score ?? 0) >= 80
      },
      {
        id: 'chess_grandmaster',
        category: 'exams',
        title: 'Gran Maestro',
        desc: 'Desarrollo de visión estratégica de alto nivel directivo.',
        req: 'Completa 5 lecciones de Ajedrez.',
        icon: <Swords size={20} />,
        color: 'from-violet-500 via-fuchsia-300 to-indigo-700',
        glow: 'shadow-violet-500/20',
        isUnlocked: !!userStats?.achievements?.includes('chess_grandmaster')
      },
      {
        id: 'toeic_mock',
        category: 'exams',
        title: 'Especialista TOEIC',
        desc: 'Familiarización con la estructura de inglés para el comercio.',
        req: 'Completa un simulador TOEIC.',
        icon: <Trophy size={20} />,
        color: 'from-amber-500 via-amber-300 to-yellow-600',
        glow: 'shadow-amber-500/20',
        isUnlocked: completed.some((l: any) => l.lesson_id.toLowerCase().includes('toeic'))
      },
      {
        id: 'toefl_mock',
        category: 'exams',
        title: 'Especialista TOEFL',
        desc: 'Aprobación de simulacro de evaluación académica avanzada.',
        req: 'Completa un simulador TOEFL.',
        icon: <Trophy size={20} />,
        color: 'from-indigo-500 via-sky-300 to-blue-700',
        glow: 'shadow-indigo-500/20',
        isUnlocked: completed.some((l: any) => l.lesson_id.toLowerCase().includes('toefl'))
      },
      {
        id: 'ielts_mock',
        category: 'exams',
        title: 'Especialista IELTS',
        desc: 'Familiarización con los estándares internacionales británicos.',
        req: 'Completa un simulador IELTS.',
        icon: <Trophy size={20} />,
        color: 'from-rose-500 via-pink-300 to-rose-700',
        glow: 'shadow-rose-500/20',
        isUnlocked: completed.some((l: any) => l.lesson_id.toLowerCase().includes('ielts'))
      },
      {
        id: 'streak_7',
        category: 'habits',
        title: 'Racha de Acero',
        desc: 'Una semana completa de estudio diario ininterrumpido.',
        req: 'Mantén una racha de 7 días.',
        icon: <Flame size={20} />,
        color: 'from-orange-500 via-yellow-400 to-red-600',
        glow: 'shadow-orange-500/20',
        isUnlocked: !!userStats?.achievements?.includes('streak_7')
      },
      {
        id: 'streak_30',
        category: 'habits',
        title: 'Leyenda Directiva',
        desc: 'Consolidación de hábito ejecutivo por un mes entero.',
        req: 'Mantén una racha de 30 días.',
        icon: <Trophy size={20} />,
        color: 'from-amber-400 via-yellow-200 to-amber-600',
        glow: 'shadow-amber-500/20',
        isUnlocked: !!userStats?.achievements?.includes('streak_30')
      },
      {
        id: 'night_owl',
        category: 'habits',
        title: 'Búho de Oficina',
        desc: 'Aprovechamiento de horas nocturnas para desarrollo personal.',
        req: 'Completa una lección después de las 20:00.',
        icon: <Clock size={20} />,
        color: 'from-purple-500 via-purple-300 to-indigo-800',
        glow: 'shadow-purple-500/20',
        isUnlocked: completed.some((l: any) => {
          if (!l.updated_at) return false;
          const hour = new Date(l.updated_at).getHours();
          return hour >= 20;
        })
      },
      {
        id: 'early_bird',
        category: 'habits',
        title: 'Enfoque Matutino',
        desc: 'Estudio y disciplina mental al comenzar el día de negocios.',
        req: 'Completa una lección antes de las 9:00 AM.',
        icon: <Zap size={20} />,
        color: 'from-yellow-400 via-orange-300 to-yellow-600',
        glow: 'shadow-yellow-500/20',
        isUnlocked: completed.some((l: any) => {
          if (!l.updated_at) return false;
          const hour = new Date(l.updated_at).getHours();
          return hour >= 5 && hour < 9;
        })
      }
    ];

    list.push(...masterTrophies);

    // 2. RELLENAR HASTA COMPLETAR EXACTAMENTE 500 LOGROS CORPORATIVOS REALES
    const remaining = 500 - list.length;
    for (let i = 1; i <= remaining; i++) {
      let id = '';
      let category = '';
      let title = '';
      let desc = '';
      let req = '';
      let isUnlocked = false;
      let color = '';
      let icon = null;

      if (i % 3 === 0) {
        // Negocios y Elocuencia
        category = 'business';
        const idx = Math.floor(i / 3);
        id = `business_module_achievement_${idx}`;
        title = `Especialista de Módulo ${idx}`;
        desc = `Domina con maestría directiva la lección de negocios #${idx} del currículum.`;
        req = `Completa la lección de negocios #${idx}.`;
        isUnlocked = completed.some(l => 
          l.lesson_id.toLowerCase().includes(`-lesson-${idx}`) || 
          l.lesson_id.toLowerCase().includes(`_${idx}`)
        );
        color = 'from-teal-500 to-emerald-400';
        icon = <Briefcase size={20} />;
      } else if (i % 3 === 1) {
        // Certificaciones y Exámenes
        category = 'exams';
        const idx = Math.floor(i / 3) + 1;
        id = `exam_tactic_achievement_${idx}`;
        title = `Estratega Táctico ${idx}`;
        desc = `Desarrollo de visión y pensamiento lateral en simulador o ajedrez #${idx}.`;
        req = `Completa el simulador o lección de ajedrez #${idx}.`;
        isUnlocked = completed.some(l => 
          l.lesson_id.toLowerCase().includes(`chess`) && 
          l.lesson_id.toLowerCase().includes(`_${idx}`)
        );
        color = 'from-violet-500 to-indigo-700';
        icon = <Swords size={20} />;
      } else {
        // Hábitos y Constancia
        category = 'habits';
        const targetStreak = Math.floor(i / 3) * 2 + 1; // 1, 3, 5, 7, 9, 11, etc.
        id = `constancy_target_${targetStreak}`;
        title = `Constancia de ${targetStreak} Días`;
        desc = `Establece un hábito de aprendizaje directivo robusto por ${targetStreak} días consecutivos.`;
        req = `Mantén una racha de ${targetStreak} días.`;
        isUnlocked = streak >= targetStreak;
        color = 'from-orange-500 to-red-600';
        icon = <Flame size={20} />;
      }

      list.push({
        id,
        category,
        title,
        desc,
        req,
        icon,
        color,
        glow: 'shadow-slate-500/10',
        isUnlocked
      });
    }

    return list;
  };

  const ALL_TROPHIES = generateTrophies(completedLessons, userPoints, streakDays, stats, profile);
  const unlockedCount = ALL_TROPHIES.filter(t => t.isUnlocked).length;

  const filteredTrophies = ALL_TROPHIES.filter(t => {
    if (trophyFilter === 'all') return true;
    return t.category === trophyFilter;
  });

  const formatActivityTime = (dateStr: string) => {
    if (!dateStr) return 'Reciente';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    return `Hace ${diffDays} días`;
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Renderizar la rejilla del calendario de racha
  const renderCalendarGrid = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    
    // Convertir para iniciar en Lunes (0) en vez de Domingo (0)
    const startDayIndex = firstDay === 0 ? 6 : firstDay - 1;
    
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    const cells = [];
    
    // Celdas vacías previas
    for (let i = 0; i < startDayIndex; i++) {
      cells.push(<div key={`empty-${i}`} className="h-9 w-full rounded bg-white/20" />);
    }
    
    // Celdas del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = now.getDate() === day;
      
      // Validar si hay actividad real registrada ese día
      const hasActivity = completedLessons.some((lesson: any) => {
        if (!lesson.updated_at) return false;
        const lessonDate = new Date(lesson.updated_at);
        return (
          lessonDate.getFullYear() === currentYear &&
          lessonDate.getMonth() === currentMonth &&
          lessonDate.getDate() === day
        );
      });
      
      cells.push(
        <div 
          key={`day-${day}`}
          className={`h-9 w-full flex flex-col items-center justify-center rounded relative border ${
            isToday 
              ? 'bg-slate-50 border-slate-900 text-slate-900 font-black' 
              : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          <span className="text-[10px]">{day}</span>
          {hasActivity && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-1"
            >
              <Flame size={10} className="text-orange-500 fill-orange-500 animate-pulse" />
            </motion.div>
          )}
        </div>
      );
    }
    
    return (
      <div className="w-full max-w-sm mx-auto bg-white border border-slate-200/80 p-5 rounded-none shadow-none">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <span className="text-[8px] font-black text-[#D4AF37] bg-teal-50 border border-teal-100 px-2 py-0.5 uppercase tracking-widest">
            {streakDays} Días de Racha
          </span>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {dayNames.map((d, idx) => (
            <div key={idx} className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
              {d}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {cells}
        </div>
        
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-200 text-[8px] font-bold text-slate-500 uppercase tracking-wide">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-slate-50 rounded-sm" />
            <span>Hoy</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame size={10} className="text-orange-500 fill-orange-500" />
            <span>Día Completado</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-slate-950 border-t-teal-500 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Cargando credenciales...</p>
      </div>
    </div>
  );

  const rawTier = profile?.membership?.tier?.toLowerCase() || 'free';
  const userTier = rawTier === 'titanium' ? 'executive' : rawTier;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans relative overflow-x-hidden">

      {/* ─── TOAST PREMIUM ─── */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -48, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -48, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={`fixed top-5 right-5 z-[300] flex items-center gap-3 px-5 py-3.5 shadow-2xl border min-w-[280px] ${
              toast.type === 'success' ? 'bg-slate-50 border-emerald-500/40' : 'bg-slate-50 border-rose-500/40'
            }`}
          >
            <div className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${toast.type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-900 flex-1">{toast.message}</span>
            <button onClick={() => setToast(p => ({ ...p, show: false }))} className="text-slate-600 hover:text-slate-900 transition-colors">
              <X size={11} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── NAVEGACIÓN PRINCIPAL ─── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-white transition-colors border border-transparent hover:border-slate-200 rounded-none">
            <ArrowLeft size={16} />
          </button>
          <span className="font-black text-[10px] tracking-[0.3em] uppercase text-slate-900">
            Perfil <span className="text-[#D4AF37]">Ejecutivo</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="border border-slate-200 hover:bg-[#D4AF37]/10 hover:border-red-200 text-slate-600 hover:text-[#D4AF37] px-3 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5"
          >
            <LogOut size={11} /> Cerrar sesión
          </button>
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="bg-slate-50 text-slate-900 px-5 py-1.5 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-teal-800 disabled:opacity-50 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.18)]"
          >
            {saving ? (
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando...</span>
            ) : (
              <><Save size={11} /> Guardar cambios</>
            )}
          </button>
        </div>
      </nav>

      {/* ─── COVER BANNER DIRECTIVO ─── */}
      <div className="w-full relative h-52 bg-gradient-to-r from-slate-900 via-[#0c4a3f] to-indigo-950 overflow-hidden">
        {/* Patrón corporativo */}
        <div className="absolute inset-0 opacity-[0.12]" style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />
        {/* Luces decorativas */}
        <div className="absolute -bottom-16 right-24 w-[360px] h-[360px] bg-teal-400/10 rounded-full blur-[100px]" />
        <div className="absolute -top-10 left-10 w-[250px] h-[250px] bg-[#D4AF37]/20/10 rounded-full blur-[80px]" />
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-[8px] text-slate-900/60 font-black uppercase tracking-widest">Sesión activa</span>
        </div>

        {/* Stats dinámicos y clickables en el banner */}
        <div className="absolute bottom-6 left-0 right-0 px-8 max-w-6xl mx-auto flex items-end justify-end gap-6">
          <button 
            onClick={() => { setHistoryTab('xp'); setShowHistoryModal(true); }}
            className="text-right hidden md:block hover:opacity-85 transition-opacity group cursor-pointer"
          >
            <p className="text-[7px] text-slate-900/40 font-black uppercase tracking-widest group-hover:text-teal-400 transition-colors">Elocuencia Total</p>
            <p className="text-xl font-black text-slate-900 font-mono flex items-center gap-1">{userPoints.toLocaleString()} <span className="text-[10px] text-teal-400">XP</span></p>
          </button>
          <div className="w-px h-8 bg-white/10 hidden md:block" />
          <button 
            onClick={() => { setHistoryTab('streak'); setShowHistoryModal(true); }}
            className="text-right hidden md:block hover:opacity-85 transition-opacity group cursor-pointer"
          >
            <p className="text-[7px] text-slate-900/40 font-black uppercase tracking-widest group-hover:text-orange-400 transition-colors">Racha Activa</p>
            <p className="text-xl font-black text-slate-900 font-mono flex items-center gap-1">{streakDays} <span className="text-[10px] text-orange-400">días</span></p>
          </button>
          <div className="w-px h-8 bg-white/10 hidden md:block" />
          <button 
            onClick={() => setShowUpgradeModal(true)}
            className="text-right hidden md:block hover:opacity-85 transition-opacity group cursor-pointer"
          >
            <p className="text-[7px] text-slate-900/40 font-black uppercase tracking-widest group-hover:text-amber-400 transition-colors">Plan Activo</p>
            <p className="text-xl font-black text-teal-400 uppercase tracking-wide">{userTier}</p>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ════════ COLUMN izquierda (2/3) ════════ */}
          <div className="lg:col-span-2 space-y-8">

            {/* TARJETA DE IDENTIDAD */}
            <section className="bg-white border border-slate-200 shadow-none overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6">

                  {/* Avatar con anillo de rango */}
                  <div className="relative shrink-0 -mt-4 md:-mt-0">
                    <div className={`absolute -inset-1.5 bg-gradient-to-br ${rank.color} opacity-80 blur-[2px]`} />
                    <div
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                      className="relative w-28 h-28 bg-slate-50 border-2 border-white flex items-center justify-center text-teal-400 text-4xl font-black cursor-pointer overflow-hidden hover:ring-4 hover:ring-teal-500/20 transition-all shadow-2xl group"
                    >
                      {formData.avatar_url
                        ? <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        : <span className="font-black text-slate-900 text-3xl">{profile?.username?.slice(0, 2).toUpperCase()}</span>
                      }
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] text-slate-900 font-black uppercase tracking-wider">Cambiar</span>
                      </div>
                    </div>

                    {/* El selector de avatar se maneja mediante un modal al final del archivo para evitar problemas de clipping */}
                  </div>

                  {/* Info básica del directivo */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1.5 justify-center md:justify-start">
                      <h2 className="text-3xl font-black tracking-tighter uppercase text-slate-950">{profile?.username}</h2>
                      <span className={`inline-flex items-center gap-1 border text-[8px] font-black px-2.5 py-1 uppercase tracking-widest ${rank.badge}`}>
                        <Star size={8} fill="currentColor" /> {rank.label}
                      </span>
                    </div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center justify-center md:justify-start gap-1.5">
                      <Shield size={11} className={profile?.is_pro ? 'text-[#D4AF37]' : 'text-slate-500'} />
                      {profile?.is_pro ? 'Cuenta Ejecutiva Profesional' : 'Cuenta de Estudiante Estándar'}
                      {formData.country_code && (
                        <span className="ml-2 flex items-center gap-1">
                          <MapPin size={9} className="text-slate-300" />
                          {COUNTRIES.find(c => c.code === formData.country_code)?.label || formData.country_code}
                        </span>
                      )}
                    </p>

                    {/* Barra de Rango y XP */}
                    <div className="max-w-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Nivel de elocuencia</span>
                        <span className="text-[8px] font-black text-slate-900 font-mono">{userPoints.toLocaleString()} / {rank.max.toLocaleString()} XP</span>
                      </div>
                      <div className="w-full h-2.5 bg-white border border-slate-200 p-[1px]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          className={`h-full bg-gradient-to-r ${rank.color} shadow-[0_0_8px_rgba(13,148,136,0.4)]`}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[7px] text-slate-500 font-bold uppercase">{rank.label}</span>
                        <span className="text-[7px] text-slate-500 font-bold uppercase flex items-center gap-0.5"><ChevronUp size={8} />{rank.nextLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PASE DIGITAL */}
            <section className="bg-white border border-slate-200 shadow-none overflow-hidden">
              <div className="px-8 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard size={13} className="text-slate-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Pase Ejecutivo Digital</h3>
                </div>
                {userTier !== 'executive' && (
                  <button onClick={() => setShowUpgradeModal(true)} className="bg-[#D4AF37]/20 hover:bg-[#D4AF37]/20 text-slate-950 px-3 py-1.5 text-[8px] font-black uppercase tracking-widest transition-colors">
                    Mejorar plan
                  </button>
                )}
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* Tarjeta metálica premium */}
                <div className="w-full h-44 bg-white border border-slate-200 p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[6px] text-slate-500 font-black tracking-widest uppercase">OnixLingo Corporate</p>
                      <p className="text-[8px] text-slate-900 font-black tracking-[0.2em] uppercase mt-0.5">Pase de Miembro Ejecutivo</p>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[6px] text-emerald-700 font-black tracking-wider uppercase">Activo</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[5px] text-slate-500 font-bold uppercase tracking-widest">Titular</p>
                      <p className="text-[9px] text-slate-900 font-black font-mono tracking-wider uppercase mt-0.5">{profile?.username}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[5px] text-slate-500 font-bold uppercase tracking-widest">ID de Pase</p>
                      <p className="text-[7px] text-slate-500 font-black font-mono tracking-wider uppercase mt-0.5">ONX-{profile?.referral_code || 'EX-0000'}</p>
                    </div>
                  </div>
                </div>

                {/* Beneficios corporativos */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest block mb-1.5">Rango del Plan</span>
                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border inline-block ${
                      userTier === 'executive' ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]' :
                      userTier === 'pro' ? 'bg-teal-50 border-teal-200 text-teal-800' :
                      'bg-white border-slate-200 text-slate-600'
                    }`}>PLAN {userTier.toUpperCase()}</span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      'Acceso completo a lecciones A1 hasta C1',
                      'Tutoría conversacional interactiva',
                      'Energía ilimitada y sin publicidad corporativa',
                    ].map((b, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-[#D4AF37] shrink-0" />
                        <span className="text-[9px] font-semibold text-slate-700 uppercase tracking-tight">{b}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[8px] text-slate-500 font-bold uppercase italic border-t border-slate-200 pt-2.5">
                    Vigencia: {profile?.membership?.valid_until
                      ? new Date(profile.membership.valid_until).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
                      : userTier === 'free' ? 'Plan de por vida' : 'Ilimitada'}
                  </p>
                </div>
              </div>
            </section>

            {/* VITRINA DE TROFEOS PREMIUM (GABINETE EXCLUSIVO) */}
            <section className="bg-white border border-slate-200 shadow-none overflow-hidden">
              <div className="px-8 py-5 bg-white border-b border-slate-200 text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Trophy size={18} className="text-amber-400 animate-pulse" />
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.25em]">Vitrina de Trofeos Directivos ({unlockedCount} / 500)</h3>
                    <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Credenciales y méritos de todas las secciones</p>
                  </div>
                </div>
                {/* Pestañas de categorías */}
                <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-none shrink-0 self-start md:self-center">
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'business', label: 'Negocios' },
                    { id: 'exams', label: 'Exámenes' },
                    { id: 'habits', label: 'Constancia' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setTrophyFilter(tab.id as any);
                        setVisibleCount(16);
                      }}
                      className={`px-3 py-1.5 text-[7px] font-black uppercase tracking-widest transition-all ${
                        trophyFilter === tab.id 
                          ? 'bg-white text-slate-950 shadow-none font-black' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* El gabinete de la vitrina */}
              <div className="p-8 bg-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: 'radial-gradient(circle, #000000 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }} />
                
                {/* Rejilla de Trofeos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 relative z-10">
                  {filteredTrophies.slice(0, visibleCount).map(trophy => (
                    <div 
                      key={trophy.id} 
                      className="group flex flex-col items-center justify-between p-4 bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 relative text-center min-h-[190px]"
                    >
                      {/* Aro de luz de fondo para trofeos desbloqueados */}
                      {trophy.isUnlocked && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${trophy.color} opacity-[0.02] blur-xl`} />
                      )}
                      
                      {/* Estado visual del Trofeo */}
                      <div className="relative flex items-center justify-center w-16 h-16 mb-3 shrink-0">
                        {trophy.isUnlocked ? (
                          <>
                            {/* Trofeo Desbloqueado - Hermoso círculo metalizado */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${trophy.color} rounded-full opacity-10 shadow-none`} />
                            <div className={`w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-900 font-black shadow-sm relative transition-transform duration-500 group-hover:scale-110`}>
                              {trophy.icon}
                              {/* Micro check de verificado */}
                              <div className="absolute -bottom-1 -right-1 bg-white text-emerald-500 border border-emerald-200 p-0.5 rounded-full">
                                <CheckCircle2 size={8} />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Trofeo Bloqueado - Opaco */}
                            <div className="absolute inset-0 bg-slate-50 rounded-full opacity-20 border border-slate-200" />
                            <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 shadow-none relative">
                              <Lock size={16} className="opacity-60" />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Títulos y descripción */}
                      <div className="flex-1 flex flex-col justify-center">
                        <p className={`text-[9px] font-black uppercase tracking-wider mb-1 ${
                          trophy.isUnlocked ? 'text-slate-900' : 'text-slate-500'
                        }`}>{trophy.title}</p>
                        <p className="text-[7px] text-slate-500 font-semibold leading-relaxed px-1 line-clamp-2">
                          {trophy.isUnlocked ? trophy.desc : trophy.req}
                        </p>
                      </div>

                      {/* Estado inferior */}
                      <div className="mt-3 w-full border-t border-slate-100 pt-2 shrink-0">
                        {trophy.isUnlocked ? (
                          <span className="text-[6px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 uppercase tracking-widest inline-block">
                            Verificado
                          </span>
                        ) : (
                          <span className="text-[6px] font-black text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 uppercase tracking-widest inline-block">
                            Bloqueado
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botón de "Cargar más" */}
                {visibleCount < filteredTrophies.length && (
                  <div className="flex justify-center mt-8 relative z-10 shrink-0">
                    <button
                      type="button"
                      onClick={() => setVisibleCount(prev => Math.min(prev + 16, filteredTrophies.length))}
                      className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-6 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      Cargar más trofeos (+16)
                    </button>
                  </div>
                )}
                
                {/* Repisa de madera/cristal virtual de fondo */}
                <div className="h-2 w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mt-6 rounded-full blur-[1px] relative z-0" />
              </div>
            </section>

            {/* HABILIDADES DIVERSIFICADAS DINÁMICAS */}
            <section className="bg-white border border-slate-200 shadow-none">
              <div className="px-8 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 size={13} className="text-slate-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Habilidades corporativas reales</h3>
                </div>
                <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Métricas de competencia directiva</span>
              </div>
              <div className="p-8 space-y-5">
                {skills.map((skill, idx) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        {skill.icon}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-wide">{skill.name === 'Speaking' ? 'Habla' : skill.name === 'Listening' ? 'Escucha' : skill.name === 'Reading' ? 'Lectura' : skill.name === 'Writing' ? 'Escritura' : skill.name === 'Grammar' ? 'Gramática' : 'Vocabulario'}</span>
                          <span className="text-[7px] text-slate-500 font-bold hidden md:block">({skill.desc})</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-black text-slate-900">{skill.val}%</span>
                    </div>
                    <div className="w-full h-3 bg-white border border-slate-200/60 p-[1.5px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.val}%` }}
                        transition={{ duration: 0.9, delay: idx * 0.1, ease: 'easeOut' }}
                        className={`h-full bg-gradient-to-r ${skill.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FORMULARIOS DE INFORMACIÓN */}
            <section className="bg-white border border-slate-200 shadow-none overflow-hidden">
              {/* Pestañas */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 px-8 py-4 text-[9px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${activeTab === 'info' ? 'bg-white border-b-2 border-teal-600 text-teal-700' : 'bg-white text-slate-500 hover:text-slate-700'}`}
                >
                  <User size={12} /> Información personal
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 px-8 py-4 text-[9px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${activeTab === 'security' ? 'bg-white border-b-2 border-teal-600 text-teal-700' : 'bg-white text-slate-500 hover:text-slate-700'}`}
                >
                  <Lock size={12} /> Seguridad y acceso
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'info' && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {[
                      { label: 'Nombre completo', field: 'full_name', type: 'text', icon: <User size={13} />, placeholder: 'Ej. Nombre Apellido' },
                      { label: 'Correo electrónico', field: 'email', type: 'email', icon: <Mail size={13} />, placeholder: 'correo@empresa.com' },
                      { label: 'Teléfono de contacto', field: 'phone', type: 'tel', icon: <Phone size={13} />, placeholder: '+52 000 000 0000' },
                    ].map(({ label, field, type, icon, placeholder }) => (
                      <div key={field} className="space-y-1.5">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">{label}</label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>
                          <input
                            type={type}
                            value={(formData as any)[field]}
                            onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                            className="w-full bg-white border border-slate-200 py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                            placeholder={placeholder}
                          />
                        </div>
                      </div>
                    ))}
                    {/* Región */}
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Región de residencia</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={13} />
                        <select
                          value={formData.country_code}
                          onChange={e => setFormData({ ...formData, country_code: e.target.value })}
                          className="w-full bg-white border border-slate-200 py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white appearance-none transition-all"
                        >
                          {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                      {/* Nueva contraseña */}
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Nueva contraseña</label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={13} />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-white border border-slate-200 py-3 pl-10 pr-10 text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                            placeholder="Mínimo 6 caracteres"
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900">
                            {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                      </div>
                      {/* Confirmar contraseña */}
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Confirmar contraseña</label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={13} />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.confirm_password}
                            onChange={e => setFormData({ ...formData, confirm_password: e.target.value })}
                            className={`w-full bg-white border py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white transition-all ${passwordError ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-teal-500'}`}
                            placeholder="Confirma la contraseña"
                          />
                        </div>
                      </div>
                      {/* Error de contraseña */}
                      {passwordError && (
                        <div className="md:col-span-2 flex items-center gap-2 text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3 py-2">
                          <X size={11} />
                          <span className="text-[8px] font-black uppercase tracking-widest">{passwordError}</span>
                        </div>
                      )}
                    </div>
                    {/* Preferencias de notificaciones In-App */}
                    <div className="mt-6">
                      <PushNotificationManager />
                    </div>
                    {/* Información de accesos */}
                    <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-white border border-slate-200">
                        <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Último acceso</p>
                        <p className="text-[9px] font-black text-slate-900 flex items-center gap-1">
                          <Clock size={10} className="text-[#D4AF37]" />
                          {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="p-4 bg-white border border-slate-200">
                        <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Sesiones activas</p>
                        <p className="text-[9px] font-black text-slate-900 flex items-center gap-1">
                          <Activity size={10} className="text-[#D4AF37]" />1 dispositivo
                        </p>
                      </div>
                      <div className="p-4 bg-white border border-slate-200">
                        <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Fecha de registro</p>
                        <p className="text-[9px] font-black text-slate-900 flex items-center gap-1">
                          <Calendar size={10} className="text-[#D4AF37]" />
                          {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('es-MX', { month: 'short', year: 'numeric' }) : 'No disponible'}
                        </p>
                      </div>
                    </div>
                    <p className="text-[7px] text-slate-500 font-bold uppercase italic mt-4">Deja los campos en blanco si no deseas cambiar tu contraseña.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

          </div>

          {/* ════════ COLUMN derecha (1/3) ════════ */}
          <div className="space-y-8">

            {/* RED DE REFERIDOS */}
            <section className="bg-slate-50 text-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-[0.07] p-3"><Swords size={72} /></div>
              <div className="p-7">
                <h3 className="text-[11px] font-black uppercase tracking-[0.25em] mb-1.5 flex items-center gap-2">
                  <Award size={14} className="text-teal-400" /> Red de referidos
                </h3>
                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tight mb-6 leading-relaxed">
                  Invita colegas directivos a OnixLingo y gana puntos de elocuencia por cada registro activo verificado.
                </p>
                <div className="bg-white/5 border border-white/10 p-4 mb-3">
                  <span className="text-[7px] font-black text-[#D4AF37] uppercase tracking-widest block mb-2">Código personal</span>
                  <div className="flex items-center justify-between gap-3">
                    <code className="text-base font-mono font-black tracking-widest text-teal-400">{profile?.referral_code || '------'}</code>
                    <button onClick={copyReferral} className="p-2 bg-white/10 hover:bg-white/20 transition-colors border border-white/5">
                      {copied ? <Check size={14} className="text-teal-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <p className="text-[7px] text-slate-600 font-black uppercase text-center tracking-wider">0 Invitaciones confirmadas</p>
              </div>
            </section>

            {/* TIMELINE DE ACTIVIDAD REAL */}
            <section className="bg-white border border-slate-200 shadow-none">
              <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-2">
                <Activity size={13} className="text-slate-500" />
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em]">Actividad reciente</h3>
              </div>
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                {completedLessons.length > 0 ? (
                  completedLessons.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-start gap-3 px-5 py-4 hover:bg-white transition-colors">
                      <div className="w-7 h-7 bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                        {item.lesson_type === 'pro' ? (
                          <Briefcase size={12} className="text-[#D4AF37]" />
                        ) : item.lesson_type === 'vocab' ? (
                          <Star size={12} className="text-[#D4AF37]" />
                        ) : (
                          <BookOpen size={12} className="text-[#D4AF37]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-tight text-slate-900">
                          {item.lesson_type === 'pro' ? 'Lección Pro' : item.lesson_type === 'vocab' ? 'Vocabulario' : 'Lección Estándar'}
                        </p>
                        <p className="text-[7px] text-slate-500 font-bold truncate mt-0.5">
                          ID: {item.lesson_id.toUpperCase()} · Precisión: {item.score}%
                        </p>
                      </div>
                      <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest whitespace-nowrap">
                        {formatActivityTime(item.updated_at)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                    <Clock size={16} />
                    <p className="text-[8px] font-black uppercase tracking-widest">Sin actividad registrada aún</p>
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* ─── MODAL PREMIUM DE HISTORIAL DE XP Y RACHA ─── */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop con desenfoque de cristal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryModal(false)}
              className="absolute inset-0 bg-slate-50/40 backdrop-blur-md"
            />
            
            {/* Contenedor del Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Encabezado */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-6 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-900 flex items-center gap-2">
                  <TrendingUp size={14} className="text-[#D4AF37] animate-pulse" /> Historial de Progreso
                </span>
                <button 
                  onClick={() => setShowHistoryModal(false)}
                  className="text-slate-500 hover:text-slate-950 p-1 transition-colors border border-transparent hover:border-slate-200"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Pestañas dentro del Modal */}
              <div className="flex border border-slate-200 bg-white p-1 mb-6 shrink-0">
                <button
                  onClick={() => setHistoryTab('xp')}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    historyTab === 'xp' 
                      ? 'bg-white text-slate-950 shadow-none border border-slate-200/50' 
                      : 'text-slate-500 hover:text-slate-600'
                  }`}
                >
                  <Zap size={11} /> Ganancia de XP
                </button>
                <button
                  onClick={() => setHistoryTab('streak')}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    historyTab === 'streak' 
                      ? 'bg-white text-slate-950 shadow-none border border-slate-200/50' 
                      : 'text-slate-500 hover:text-slate-600'
                  }`}
                >
                  <Flame size={11} /> Calendario de Racha
                </button>
              </div>

              {/* Contenido Dinámico */}
              <div className="flex-1 overflow-y-auto pr-1">
                {historyTab === 'xp' ? (
                  <div className="space-y-6">
                    {/* Tarjeta resumen de XP */}
                    <div className="grid grid-cols-3 gap-4 bg-slate-50 text-slate-900 p-5 border border-slate-800">
                      <div className="text-center">
                        <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest">XP Acumulado</p>
                        <p className="text-lg font-black font-mono text-teal-400 mt-1">{userPoints.toLocaleString()}</p>
                      </div>
                      <div className="text-center border-x border-white/10">
                        <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Precisión Promedio</p>
                        <p className="text-lg font-black font-mono text-indigo-300 mt-1">{stats?.accuracy ?? 0}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Fluidez Estimada</p>
                        <p className="text-lg font-black font-mono text-emerald-300 mt-1">{stats?.fluency_score ?? 0}%</p>
                      </div>
                    </div>

                    {/* Timeline de ganancias */}
                    <div className="space-y-3">
                      <h4 className="text-[8px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">Registro de Ganancias</h4>
                      
                      {completedLessons.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                          {completedLessons.map((lesson, idx) => (
                            <div key={idx} className="flex justify-between items-center py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-none border border-slate-200 bg-white flex items-center justify-center text-slate-600">
                                  {lesson.lesson_type === 'pro' ? <Briefcase size={12} /> : <BookOpen size={12} />}
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">
                                    {lesson.lesson_type === 'pro' ? 'Módulo Ejecutivo Pro' : 'Módulo de Estudio Estándar'}
                                  </p>
                                  <p className="text-[7px] text-slate-500 font-bold uppercase mt-0.5">
                                    ID: {lesson.lesson_id.toUpperCase()} · {new Date(lesson.updated_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono font-black text-[#D4AF37] bg-[#D4AF37]/10 border border-emerald-100 px-2 py-0.5 rounded-sm">
                                +{lesson.score} XP
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-slate-500 flex flex-col items-center justify-center gap-2">
                          <Zap size={24} className="text-slate-300" />
                          <p className="text-[8px] font-black uppercase tracking-widest">Aún no has ganado XP en lecciones</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Resumen de Racha */}
                    <div className="flex items-center gap-4 bg-orange-50 border border-orange-200/60 p-4">
                      <div className="w-10 h-10 bg-orange-500 rounded-none flex items-center justify-center text-slate-900 shrink-0 shadow-none shadow-orange-500/20">
                        <Flame size={20} className="fill-white" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Compromiso Diario</h4>
                        <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tight mt-0.5">
                          Tienes una racha activa de <span className="text-orange-600 font-black">{streakDays} días</span>. ¡Sigue así y alcanza el Alta Dirección!
                        </p>
                      </div>
                    </div>

                    {/* Calendario mensual de racha */}
                    {renderCalendarGrid()}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}

      {/* ─── MODAL PREMIUM DE SELECCIÓN DE AVATAR (EVITA PROBLEMAS DE CLIPPING) ─── */}
      <AnimatePresence>
        {showAvatarPicker && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            {/* Backdrop con desenfoque de cristal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAvatarPicker(false)}
              className="absolute inset-0 bg-slate-50/40 backdrop-blur-md"
            />
            
            {/* Contenedor del Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative w-full max-w-md bg-white border border-slate-200 shadow-2xl p-6 overflow-hidden flex flex-col"
            >
              {/* Encabezado */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-6 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-900 flex items-center gap-2">
                  <User size={14} className="text-[#D4AF37] animate-pulse" /> Seleccionar avatar
                </span>
                <button 
                  onClick={() => setShowAvatarPicker(false)}
                  className="text-slate-500 hover:text-slate-950 p-1 transition-colors border border-transparent hover:border-slate-200"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Grid de selección */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {PRESET_AVATARS.map((url, i) => (
                  <div
                    key={i}
                    onClick={() => selectAvatar(url)}
                    className={`w-full aspect-square border cursor-pointer hover:border-teal-500 hover:shadow-none transition-all bg-white overflow-hidden relative group ${
                      formData.avatar_url === url ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200'
                    }`}
                  >
                    <img src={url} alt={`Avatar ${i+1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    {formData.avatar_url === url && (
                      <div className="absolute inset-0 bg-teal-950/20 flex items-center justify-center">
                        <div className="bg-[#D4AF37]/20 text-slate-900 p-1 rounded-full">
                          <Check size={10} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-[7px] text-slate-500 font-bold uppercase text-center mt-2">
                Haz clic en cualquier avatar para seleccionarlo y guardarlo automáticamente de forma local.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
