'use client';

import ChessTrainer from '@/components/chess/ChessTrainer';

export default function ChessPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Academia de Ajedrez</h1>
        <p className="text-slate-600 mb-8">Mejora tu estrategia resolviendo problemas tácticos.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Columna Izquierda: El Tablero */}
          <div>
            <ChessTrainer />
          </div>

          {/* Columna Derecha: Teoría o Lista de Lecciones */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-none shadow-none border border-slate-200">
              <h3 className="font-bold text-lg mb-2">¿Qué es el Jaque Mate?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                El jaque mate ocurre cuando el rey está amenazado (en jaque) y no tiene ninguna jugada legal para escapar. En este ejercicio, busca mover tu Torre a la última fila.
              </p>
            </div>

            <div className="bg-white p-6 rounded-none shadow-none border border-slate-200">
                <h3 className="font-bold text-lg mb-4">Tu Ruta</h3>
                <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-[#D4AF37]/10 rounded-none border border-emerald-100">
                        <div className="w-6 h-6 rounded-full bg-[#D4AF37]/100 flex items-center justify-center text-slate-900 text-xs font-bold">1</div>
                        <span className="text-sm font-bold text-emerald-900">Mate con Torre</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-none border border-slate-200 opacity-60">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-slate-600 text-xs font-bold">2</div>
                        <span className="text-sm font-medium text-slate-600">El Clavado (The Pin)</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-none border border-slate-200 opacity-60">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-slate-600 text-xs font-bold">3</div>
                        <span className="text-sm font-medium text-slate-600">Ataque Doble</span>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}