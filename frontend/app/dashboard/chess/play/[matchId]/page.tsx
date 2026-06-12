'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { usePvPStore } from '@/store/usePvPStore';
import { useAuthStore } from '@/store/useAuthStore';
import LiveChessboard from '@/components/chess/LiveChessboard';
import { User, Shield, Zap } from 'lucide-react';

export default function PlayMatchPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params);
  const router = useRouter();
  const { localPlayer, opponent, matchStatus } = usePvPStore();
  const { token: jwtToken } = useAuthStore();

  useEffect(() => {
    // Si recargan la página y se pierde el store, los mandamos al lobby
    if (!localPlayer || !opponent) {
      router.push('/dashboard');
    }
  }, [localPlayer, opponent, router]);

  if (!localPlayer || !opponent) {
    // Renderizado seguro durante hidratación o antes del redirect
    return (
      <div className="min-h-screen wood-theme-bg flex items-center justify-center rounded-none">
        <div className="w-8 h-8 border-4 border-[#D4AF37]/30 border-t-transparent rounded-none animate-spin"></div>
      </div>
    );
  }

  // Identificar los roles exactos para mostrar color correcto
  const localIsWhite = localPlayer.color === 'white';
  const opponentIsWhite = opponent.color === 'white';

  return (
    <div className="min-h-screen wood-theme-bg flex flex-col items-center justify-center p-4 sm:p-8 rounded-none">
      {/* Decoración de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-950/10 blur-[120px] rounded-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-955/10 blur-[120px] rounded-none"></div>
      </div>

      {/* Container principal Titanium Enterprise */}
      <div className="w-full max-w-[600px] relative z-10 wood-panel p-4 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.7)] text-[#ecd3b5] rounded-none">

        {/* HUD: Oponente (Arriba) */}
        <div className="flex items-center justify-between wood-panel-light p-3 sm:p-4 rounded-none mb-4 sm:mb-6 shadow-inner">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#25140b] rounded-none border border-[#3c1e0a] flex items-center justify-center shadow-none relative overflow-hidden">
              <User className="text-[#ecd3b5]/60 relative z-10" size={20} />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-base sm:text-lg flex items-center gap-2">
                {opponent.username}
                <span className={`hidden sm:inline-block px-2 py-0.5 rounded-none text-[9px] font-black uppercase tracking-wider border ${opponentIsWhite ? 'bg-amber-950/60 text-amber-300 border-amber-800/40' : 'bg-[#130a04] text-[#ecd3b5]/60 border-[#3c1e0a]'}`}>
                  {opponentIsWhite ? 'Blancas' : 'Negras'}
                </span>
              </h3>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs sm:text-sm font-medium">
                <Shield size={14} className="text-amber-400" />
                <span className="text-[#ecd3b5]/70">ELO: {opponent.elo}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex px-3 py-1.5 bg-[#25140b] rounded-none border border-[#3c1e0a]">
            <span className="text-[#ecd3b5]/60 text-[10px] font-bold uppercase tracking-widest">Oponente</span>
          </div>
        </div>

        {/* Tablero en el centro */}
        <div className="mb-4 sm:mb-6 w-full max-w-[500px] mx-auto rounded-none">
          <LiveChessboard
            matchId={matchId}
            token={jwtToken || localPlayer.userId}
            playerColor={localIsWhite ? 'w' : 'b'}
          />
        </div>

        {/* HUD: Jugador Local (Abajo) */}
        <div className="flex items-center justify-between wood-panel-light p-3 sm:p-4 rounded-none shadow-[0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#25140b] rounded-none border border-[#3c1e0a] flex items-center justify-center shadow-none">
              <User className="text-slate-900" size={20} />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-base sm:text-lg flex items-center gap-2">
                {localPlayer.username}
                <span className={`hidden sm:inline-block px-2 py-0.5 rounded-none text-[9px] font-black uppercase tracking-wider border ${localIsWhite ? 'bg-amber-950/60 text-amber-300 border-amber-800/40' : 'bg-[#130a04] text-[#ecd3b5]/60 border-[#3c1e0a]'}`}>
                  {localIsWhite ? 'Blancas' : 'Negras'}
                </span>
              </h3>
              <div className="flex items-center gap-1.5 text-slate-300 text-xs sm:text-sm font-medium">
                <Zap size={14} className="text-amber-400" />
                <span className="text-amber-300">ELO: {localPlayer.elo}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex px-3 py-1.5 bg-[#25140b] rounded-none border border-[#3c1e0a] relative z-10">
            <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">Tú</span>
          </div>
        </div>

      </div>
    </div>

  );
}
