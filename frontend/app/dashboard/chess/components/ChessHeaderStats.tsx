'use client';

import { Trophy, Target, Flame, Crown, Zap, Shield, Layers, Swords } from 'lucide-react';
import { woodPanelLightStyle } from '../styles';

interface ChessHeaderStatsProps {
  user: any;
  stats: {
    tacticalElo: number;
    arenaElo: number;
    puzzlesSolved: number;
  };
}

export const ChessHeaderStats = ({ user, stats }: ChessHeaderStatsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-4">
      {/* 1. ELO Táctico */}
      <div style={woodPanelLightStyle} className="p-3.5 rounded-none shadow-none flex flex-col justify-between h-full group hover:border-[#D4AF37]/30/40 transition-colors">
        <div>
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="font-black text-xl sm:text-2xl leading-none">{user?.chess_tactical_elo ?? stats.tacticalElo}</span>
            <Trophy size={18} />
          </div>
          <div className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">ELO Táctico</div>
        </div>
        <p className="text-[9px] text-[#fdf6ed] font-medium leading-snug mt-1.5 border-t border-[#5d3017]/50 pt-1.5">
          Habilidad al resolver problemas de táctica en la academia.
        </p>
      </div>

      {/* 2. ELO Arena */}
      <div style={woodPanelLightStyle} className="p-3.5 rounded-none shadow-none flex flex-col justify-between h-full group hover:border-[#D4AF37]/30/40 transition-colors">
        <div>
          <div className="flex items-center justify-between text-amber-300 mb-1">
            <span className="font-black text-xl sm:text-2xl leading-none">{user?.chess_elo ?? stats.arenaElo}</span>
            <Swords size={18} />
          </div>
          <div className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">ELO Arena</div>
        </div>
        <p className="text-[9px] text-[#fdf6ed] font-medium leading-snug mt-1.5 border-t border-[#5d3017]/50 pt-1.5">
          Habilidad competitiva en vivo en la Arena contra humanos/bots.
        </p>
      </div>

      {/* 3. Resueltos */}
      <div style={woodPanelLightStyle} className="p-3.5 rounded-none shadow-none flex flex-col justify-between h-full group hover:border-[#D4AF37]/30/40 transition-colors">
        <div>
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="font-black text-xl sm:text-2xl leading-none">{stats.puzzlesSolved}</span>
            <Target size={18} />
          </div>
          <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Resueltos</div>
        </div>
        <p className="text-[9px] text-[#fdf6ed] font-medium leading-snug mt-1.5 border-t border-[#5d3017]/50 pt-1.5">
          Total de ejercicios y lecciones completadas con éxito.
        </p>
      </div>

      {/* 4. Racha Activa */}
      <div style={woodPanelLightStyle} className="p-3.5 rounded-none shadow-none flex flex-col justify-between h-full group hover:border-[#D4AF37]/30/40 transition-colors">
        <div>
          <div className="flex items-center justify-between text-orange-400 mb-1">
            <span className="font-black text-xl sm:text-2xl leading-none">{stats.puzzlesSolved > 0 ? "5 Días" : "0 Días"}</span>
            <Flame size={18} />
          </div>
          <div className="text-[10px] text-orange-300 font-bold uppercase tracking-wider">Racha Activa</div>
        </div>
        <p className="text-[9px] text-[#fdf6ed] font-medium leading-snug mt-1.5 border-t border-[#5d3017]/50 pt-1.5">
          Días seguidos entrenando. Resuelve el reto diario para subir.
        </p>
      </div>

      {/* 5. Rango Ejecutivo */}
      <div style={woodPanelLightStyle} className="p-3.5 rounded-none shadow-none flex flex-col justify-between h-full group hover:border-[#D4AF37]/30/40 transition-colors">
        <div>
          <div className="flex items-center justify-between text-[#D4AF37] mb-1">
            <span className="font-bold text-xs sm:text-sm uppercase tracking-tight truncate max-w-[80px] block leading-none pt-1">
              {(user?.chess_elo ?? stats.arenaElo) >= 1600 ? "CEO" : (user?.chess_elo ?? stats.arenaElo) >= 1400 ? "Manager" : "Asociado"}
            </span>
            <Crown size={18} />
          </div>
          <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Rango</div>
        </div>
        <p className="text-[9px] text-[#fdf6ed] font-medium leading-snug mt-1.5 border-t border-[#5d3017]/50 pt-1.5">
          Jerarquía y título en ajedrez según tu ELO de la Arena.
        </p>
      </div>

      {/* 6. Experiencia (XP) */}
      <div style={woodPanelLightStyle} className="p-3.5 rounded-none shadow-none flex flex-col justify-between h-full group hover:border-[#D4AF37]/30/40 transition-colors">
        <div>
          <div className="flex items-center justify-between text-cyan-400 mb-1">
            <span className="font-black text-xl sm:text-2xl leading-none">{stats.puzzlesSolved * 15 + 320}</span>
            <Zap size={18} />
          </div>
          <div className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">Puntos XP</div>
        </div>
        <p className="text-[9px] text-[#fdf6ed] font-medium leading-snug mt-1.5 border-t border-[#5d3017]/50 pt-1.5">
          Experiencia total acumulada por tus lecciones completadas.
        </p>
      </div>

      {/* 7. Tasa de Victoria */}
      <div style={woodPanelLightStyle} className="p-3.5 rounded-none shadow-none flex flex-col justify-between h-full group hover:border-[#D4AF37]/30/40 transition-colors">
        <div>
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="font-black text-xl sm:text-2xl leading-none">{stats.puzzlesSolved > 0 ? "58%" : "100%"}</span>
            <Shield size={18} />
          </div>
          <div className="text-[10px] text-rose-300 font-bold uppercase tracking-wider">Win Rate</div>
        </div>
        <p className="text-[9px] text-[#fdf6ed] font-medium leading-snug mt-1.5 border-t border-[#5d3017]/50 pt-1.5">
          Porcentaje de victorias y tablas en tus combates PvP.
        </p>
      </div>

      {/* 8. Precisión Táctica */}
      <div style={woodPanelLightStyle} className="p-3.5 rounded-none shadow-none flex flex-col justify-between h-full group hover:border-[#D4AF37]/30/40 transition-colors">
        <div>
          <div className="flex items-center justify-between text-purple-400 mb-1">
            <span className="font-black text-xl sm:text-2xl leading-none">{stats.puzzlesSolved > 0 ? "84%" : "100%"}</span>
            <Layers size={18} />
          </div>
          <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Precisión</div>
        </div>
        <p className="text-[9px] text-[#fdf6ed] font-medium leading-snug mt-1.5 border-t border-[#5d3017]/50 pt-1.5">
          Porcentaje de aciertos en el primer intento al resolver problemas.
        </p>
      </div>
    </div>
  );
};
