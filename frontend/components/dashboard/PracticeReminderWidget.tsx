'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Sparkles, X, Plus } from 'lucide-react';

interface PracticeReminderWidgetProps {
  themeColor?: string; // 'teal', 'orange', 'blue', etc.
}

export default function PracticeReminderWidget({ themeColor = 'orange' }: PracticeReminderWidgetProps) {
  const [enabled, setEnabled] = useState(false);
  const [reminderTimes, setReminderTimes] = useState<string[]>(['08:00', '14:00', '20:00']);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEnabled = localStorage.getItem('practice_reminders_enabled') === 'true';
      const storedTimes = localStorage.getItem('practice_reminders_times');
      setEnabled(storedEnabled);
      if (storedTimes) {
        try {
          setReminderTimes(JSON.parse(storedTimes));
        } catch (e) {
          setReminderTimes(['08:00', '14:00', '20:00']);
        }
      }
    }
  }, []);

  const handleToggle = async () => {
    const nextState = !enabled;
    
    if (nextState) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          localStorage.setItem('practice_reminders_enabled', 'true');
          localStorage.setItem('practice_reminders_times', JSON.stringify(reminderTimes));
          setEnabled(true);
          setStatusMessage('¡Recordatorios activados!');
          
          try {
            new Notification('OnixLingo', {
              body: `¡Felicidades! Tus recordatorios diarios se programaron.`,
              icon: '/favicon.ico'
            });
          } catch (e) {
            console.error('Error al lanzar notificación:', e);
          }
        } else {
          setStatusMessage('Permiso denegado por el navegador.');
        }
      } else {
        setStatusMessage('Tu navegador no soporta notificaciones.');
      }
    } else {
      localStorage.setItem('practice_reminders_enabled', 'false');
      setEnabled(false);
      setStatusMessage('Recordatorios desactivados.');
    }

    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleTimeChange = (index: number, newTime: string) => {
    const updated = [...reminderTimes];
    updated[index] = newTime;
    setReminderTimes(updated);
    if (enabled) {
      localStorage.setItem('practice_reminders_times', JSON.stringify(updated));
      setStatusMessage(`Alerta ${index + 1} actualizada`);
      setTimeout(() => setStatusMessage(null), 2500);
    }
  };

  const addReminder = () => {
    if (reminderTimes.length >= 5) {
      setStatusMessage('Máximo 5 alertas permitidas');
      setTimeout(() => setStatusMessage(null), 2500);
      return;
    }
    const updated = [...reminderTimes, '12:00'];
    setReminderTimes(updated);
    if (enabled) {
      localStorage.setItem('practice_reminders_times', JSON.stringify(updated));
    }
  };

  const removeReminder = (index: number) => {
    if (reminderTimes.length <= 1) {
      setStatusMessage('Debes tener al menos 1 alerta');
      setTimeout(() => setStatusMessage(null), 2500);
      return;
    }
    const updated = reminderTimes.filter((_, i) => i !== index);
    setReminderTimes(updated);
    if (enabled) {
      localStorage.setItem('practice_reminders_times', JSON.stringify(updated));
    }
  };

  const colorMap: Record<string, { primary: string, bg: string, border: string, text: string, button: string }> = {
    orange: {
      primary: 'bg-orange-600',
      bg: 'bg-orange-50/50',
      border: 'border-orange-200',
      text: 'text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700'
    },
    teal: {
      primary: 'bg-[#D4AF37]/20',
      bg: 'bg-teal-50/50',
      border: 'border-teal-200',
      text: 'text-teal-650',
      button: 'bg-[#D4AF37]/20 hover:bg-teal-700'
    },
    blue: {
      primary: 'bg-[#D4AF37]/20',
      bg: 'bg-blue-50/50',
      border: 'border-blue-200',
      text: 'text-[#D4AF37]',
      button: 'bg-[#D4AF37]/20 hover:bg-blue-700'
    },
    wood: {
      primary: 'bg-[#D4AF37]/20',
      bg: 'bg-[#2a1409]',
      border: 'border-[#4a240f]',
      text: 'text-[#D4AF37]',
      button: 'bg-[#D4AF37]/20 hover:bg-amber-700'
    }
  };

  const colors = colorMap[themeColor] || colorMap.orange;
  const isWood = themeColor === 'wood';

  const woodPanelStyle = {
    backgroundColor: '#2a1409',
    backgroundImage: `
      linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, transparent 100%),
      radial-gradient(ellipse at 50% 0%, rgba(255, 223, 128, 0.06) 0%, transparent 70%),
      linear-gradient(90deg, rgba(0,0,0,0.1) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.1) 100%)
    `,
    border: '3px solid #4a240f',
    borderTopColor: '#5d3017',
    borderBottomColor: '#301608',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -1px 0 rgba(0, 0, 0, 0.4), 0 12px 32px rgba(0, 0, 0, 0.75)',
  };

  return (
    <div 
      className={isWood 
        ? `border ${colors.border} p-5 rounded-none shadow-[0_10px_40px_rgba(14,165,233,0.08)] flex flex-col justify-between relative overflow-hidden group text-[#ecd3b5] animate-fade-in-up opacity-0 [animation-delay:200ms]`
        : `bg-white border ${colors.border} p-5 rounded-none shadow-[0_10px_40px_rgba(14,165,233,0.08)] flex flex-col justify-between relative overflow-hidden group animate-fade-in-up opacity-0 [animation-delay:200ms]`}
      style={isWood ? woodPanelStyle : undefined}
    >
      <div className="absolute top-0 right-0 p-1 opacity-5"><Bell size={60} className={colors.text} /></div>
      
      <div className="relative z-10 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={11} className={colors.text} />
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isWood ? 'text-amber-200/50' : (themeColor === 'orange' ? 'text-orange-600' : 'text-slate-900')}`}>Hábitos Diarios</span>
            </div>
            <h3 className={`text-xs font-black uppercase tracking-tight leading-none ${isWood ? 'text-white' : (themeColor === 'orange' ? 'text-orange-950' : 'text-sky-950')}`}>Recordatorio de Práctica</h3>
            <p className={`text-[9px] font-semibold leading-none mt-1.5 mb-3 ${isWood ? 'text-slate-300' : (themeColor === 'orange' ? 'text-orange-700' : 'text-sky-700')}`}>
              Mantén activa tu racha y no pierdas tu XP diario.
            </p>
          </div>
          
          <button 
            onClick={handleToggle}
            className={`p-2 transition-all ${
              enabled 
                ? `${colors.primary} text-slate-900` 
                : isWood 
                  ? 'bg-[#361d0f] text-[#D4AF37]/60 hover:bg-[#462614] hover:text-amber-400' 
                  : (themeColor === 'orange' ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-sky-100 text-sky-600 hover:bg-sky-200')
            }`}
            title={enabled ? 'Desactivar recordatorios' : 'Activar recordatorios'}
          >
            {enabled ? <Bell size={14} className="animate-swing" /> : <BellOff size={14} />}
          </button>
        </div>

        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
          {reminderTimes.map((time, idx) => (
            <div key={idx} className={`flex items-center gap-3 p-2.5 border rounded-none justify-between ${
              isWood ? 'bg-[#100501]/70 border-[#3c1e0a]' : (themeColor === 'orange' ? 'bg-orange-50 border-orange-200' : 'bg-sky-50 border-sky-150')
            }`}>
              <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isWood ? 'text-[#ecd3b5]/80' : (themeColor === 'orange' ? 'text-orange-800' : 'text-sky-800')}`}>
                <Clock size={12} className={isWood ? 'text-[#D4AF37]/60' : (themeColor === 'orange' ? 'text-orange-600' : 'text-sky-600')} />
                <span>Alerta {idx + 1}:</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <input 
                  type="time" 
                  value={time} 
                  onChange={(e) => handleTimeChange(idx, e.target.value)}
                  className={`px-1.5 py-1 text-xs font-bold font-mono outline-none rounded-none w-20 ${
                    isWood 
                      ? 'bg-[#1b0e06] border border-[#5d3017] text-white focus:border-[#ecd3b5]/60' 
                      : (themeColor === 'orange' ? 'bg-white border border-orange-200 text-orange-950 focus:border-orange-400' : 'bg-white border border-sky-200 text-sky-950 focus:border-sky-400')
                  }`}
                />
                <button 
                  onClick={() => removeReminder(idx)}
                  className={`p-1 transition-colors ${
                    isWood ? 'text-slate-500 hover:text-red-500' : 'text-slate-400 hover:text-red-500'
                  }`}
                  title="Eliminar alerta"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {reminderTimes.length < 5 && (
          <button 
            onClick={addReminder}
            className={`w-full py-2 border border-dashed flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-all mt-2 ${
              isWood ? 'border-[#5d3017] text-[#D4AF37]/60 hover:bg-[#361d0f]' : (themeColor === 'orange' ? 'border-orange-300 text-orange-600 hover:bg-orange-50' : 'border-sky-300 text-sky-600 hover:bg-sky-50')
            }`}
          >
            <Plus size={10} /> Añadir Alerta
          </button>
        )}

        {statusMessage && (
          <div className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] animate-pulse pt-1">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
}
