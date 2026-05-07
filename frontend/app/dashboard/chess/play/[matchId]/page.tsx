'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePvPStore } from '@/store/usePvPStore';
import LiveChessboard from '@/components/chess/LiveChessboard';
import { User, Shield, Zap } from 'lucide-react';

export default function PlayMatchPage({ params }: { params: { matchId: string } }) {
  const { matchId } = params;
  const router = useRouter();
  const { localPlayer, opponent, matchStatus } = usePvPStore();

  useEffect(() => {
    // Si recargan la página y se pierde el store, los mandamos al lobby
    if (!localPlayer || !opponent) {
      router.push('/dashboard');
    }
  }, [localPlayer, opponent, router]);

  if (!localPlayer || !opponent) {
    // Renderizado seguro durante hidratación o antes del redirect
    return (
      <div className="min-h-screen bg-[#060a10] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Identificar los roles exactos para mostrar color correcto
  const localIsWhite = localPlayer.color === 'white';
  const opponentIsWhite = opponent.color === 'white';

  return (
    <div className="min-h-screen bg-[#060a10] flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Decoración de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Container principal Titanium Enterprise */}
      <div className="w-full max-w-[600px] relative z-10 bg-[#0f172a]/70 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]">

        {/* HUD: Oponente (Arriba) */}
        <div className="flex items-center justify-between bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-white/5 mb-4 sm:mb-6 shadow-inner">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl border border-white/10 flex items-center justify-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5"></div>
              <User className="text-slate-400 relative z-10" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                {opponent.username}
                <span className={`hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${opponentIsWhite ? 'bg-white/10 text-white border-white/20' : 'bg-black/30 text-slate-400 border-black/50'}`}>
                  {opponentIsWhite ? 'Blancas' : 'Negras'}
                </span>
              </h3>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs sm:text-sm font-medium">
                <Shield size={14} className="text-indigo-400" />
                <span>ELO: {opponent.elo}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex px-3 py-1.5 bg-slate-800/50 rounded-lg border border-white/5">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Oponente</span>
          </div>
        </div>

        {/* Tablero en el centro */}
        <div className="mb-4 sm:mb-6 w-full max-w-[500px] mx-auto">
          <LiveChessboard
            matchId={matchId}
            token={localPlayer.userId}
            playerColor={localIsWhite ? 'w' : 'b'}
          />
        </div>

        {/* HUD: Jugador Local (Abajo) */}
        <div className="flex items-center justify-between bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5"></div>
          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl border border-white/10 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <User className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                {localPlayer.username}
                <span className={`hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${localIsWhite ? 'bg-white/10 text-white border-white/20' : 'bg-black/30 text-slate-400 border-black/50'}`}>
                  {localIsWhite ? 'Blancas' : 'Negras'}
                </span>
              </h3>
              <div className="flex items-center gap-1.5 text-slate-300 text-xs sm:text-sm font-medium">
                <Zap size={14} className="text-amber-400" />
                <span>ELO: {localPlayer.elo}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex px-3 py-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20 relative z-10">
            <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">Tú</span>
          </div>
        </div>

      </div>
    </div>
  );
}
