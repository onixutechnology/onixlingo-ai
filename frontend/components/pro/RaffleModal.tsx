'use client';

import { useState, useEffect } from 'react';
import { X, Ticket, Clock, Award, Gift, Sparkles, Calendar, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RaffleModalProps {
  onClose: () => void;
  totalTickets: number;
}

export const RaffleModal = ({ onClose, totalTickets }: RaffleModalProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 5 });

  // Live countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        clearInterval(timer);
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Generate mock premium ticket numbers based on the user's tickets
  const ticketList = Array.from({ length: totalTickets }, (_, i) => {
    const num = String(1000 + i + 1).padStart(4, '0');
    return `ONIX-EXEC-${num}`;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-slate-50 border border-slate-800 rounded-none w-full max-w-xl overflow-hidden shadow-2xl shadow-black relative">
        {/* Decorative background glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-[#D4AF37]/20/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#D4AF37]/20/10 rounded-full blur-[80px] pointer-events-none" />

        {/* HEADER */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-50/50 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D4AF37]/20/10 rounded-none text-amber-400 border border-[#D4AF37]/30/20 shadow-none shadow-amber-500/5">
              <Ticket size={22} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">OnixLingo Executive Raffle</h2>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mt-0.5">Titanium Member Privilege</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-slate-900 transition-colors p-2 bg-slate-50 rounded-full active:scale-95 border border-slate-700/50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* PROMOTIONAL BANNER */}
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-600/20 to-teal-600/20 border border-[#D4AF37]/30/30 rounded-none p-6 text-center">
            <div className="absolute top-0 right-0 p-3 opacity-15">
              <Gift size={64} className="text-amber-400" />
            </div>
            <span className="inline-block px-3 py-1 bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-widest rounded-full mb-3 shadow-none">
              Sorteo Mensual Activo
            </span>
            <h3 className="text-lg font-black text-slate-900 leading-tight mb-2">
              ¡Gana una Sesión de Mentoría Ejecutiva 1-a-1 & un iPad Pro!
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Cada lección ejecutiva completada te otorga <span className="text-amber-400 font-extrabold">5 boletos VIP</span>. Cuanto más practiques, mayores serán tus probabilidades de ganar.
            </p>
          </div>

          {/* COUNTDOWN TIMER */}
          <div className="bg-slate-50 border border-slate-800 rounded-none p-5 text-center">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-center gap-1.5">
              <Clock size={12} className="text-teal-400" /> Tiempo Restante para el Sorteo
            </h4>
            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
              {[
                { label: 'DÍAS', val: timeLeft.days },
                { label: 'HORAS', val: timeLeft.hours },
                { label: 'MINUTOS', val: timeLeft.minutes },
                { label: 'SEGUNDOS', val: timeLeft.seconds }
              ].map((t, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-800 p-2.5 rounded-none shadow-inner">
                  <span className="block text-xl font-black text-slate-900 font-mono leading-none">
                    {String(t.val).padStart(2, '0')}
                  </span>
                  <span className="block text-[8px] text-slate-600 font-extrabold mt-1 tracking-wider">
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* USER TICKET COUNTER & DISPLAY */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                Mis Boletos Registrados <Sparkles size={13} className="text-amber-400" />
              </h4>
              <span className="text-sm font-black text-amber-400 bg-[#D4AF37]/20/10 border border-[#D4AF37]/30/20 px-2.5 py-0.5 rounded-full">
                {totalTickets} {totalTickets === 1 ? 'Boleto' : 'Boletos'}
              </span>
            </div>

            {totalTickets === 0 ? (
              <div className="bg-slate-50 border border-slate-800 rounded-none p-8 text-center">
                <Ticket size={36} className="text-slate-700 mx-auto mb-3 opacity-40" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">No tienes boletos acumulados aún</p>
                <p className="text-[11px] text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                  Completa tu primera lección en la sección de "Titanium Curriculum" a continuación para registrar tus boletos VIP de forma automática.
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-800 rounded-none p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                  {ticketList.map((ticket, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-gradient-to-b from-amber-500/5 to-amber-500/10 border border-[#D4AF37]/30/20 rounded-none p-2.5 flex flex-col justify-center items-center relative overflow-hidden shadow-none"
                    >
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-slate-50 rounded-r-full border-r border-[#D4AF37]/30/20" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-slate-50 rounded-l-full border-l border-[#D4AF37]/30/20" />
                      
                      <Ticket size={14} className="text-amber-400/60 mb-1" />
                      <span className="text-[10px] font-black text-amber-200 tracking-tight font-mono">
                        {ticket}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RULES INFO */}
          <div className="flex gap-3 bg-slate-50/40 p-4 border border-slate-800 rounded-none text-[11px] text-slate-500 font-semibold leading-relaxed">
            <HelpCircle size={18} className="text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-300 font-bold uppercase tracking-wider text-[9px] mb-1">Reglas Generales de OnixLingo Executive</p>
              <ul className="list-disc list-inside space-y-1 text-slate-500">
                <li>Los boletos se registran automáticamente al finalizar con éxito cualquier lección Executive.</li>
                <li>Los ganadores serán notificados a través de correo electrónico corporativo registrado.</li>
                <li>El sorteo de este mes expira en la fecha mostrada. Boletos no transferibles.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
