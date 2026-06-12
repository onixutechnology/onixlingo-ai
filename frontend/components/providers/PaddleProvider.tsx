'use client';

import { useEffect, useState } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';

export function PaddleProvider({ children }: { children: React.ReactNode }) {
  const [paddleInfo, setPaddleInfo] = useState<Paddle | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Evitamos inicializar dos veces
    if (paddleInfo) return;

    const init = async () => {
      try {
        const paddleInstance = await initializePaddle({
          environment: (process.env.NEXT_PUBLIC_PADDLE_ENV as 'sandbox' | 'production') || 'sandbox',
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '',
          checkout: {
            settings: {
              displayMode: 'overlay',
              theme: 'light',
              locale: 'es'
            }
          },
          eventCallback: (event) => {
            if (event.name === 'checkout.completed') {
              // Recarga la página automáticamente para que el frontend 
              // descargue el nuevo estado (PRO/EXECUTIVE) de la base de datos
              window.location.href = '/dashboard?payment=success';
            }
          }
        });

        if (paddleInstance) {
          setPaddleInfo(paddleInstance);
          (window as any).Paddle = paddleInstance;
        } else {
          throw new Error('Paddle instance is undefined');
        }
      } catch (err) {
        setError('No se pudo cargar el sistema de pagos. Por favor, desactiva tu AdBlocker e intenta de nuevo.');
      }
    };

    init();
  }, [paddleInfo]);

  // Si hay un error crítico (ej. AdBlocker bloqueando el script), podríamos mostrar una alerta sutil
  return (
    <>
      {error && (
        <div className="fixed bottom-4 right-4 z-[9999] bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-4 rounded-none shadow-2xl max-w-sm animate-in slide-in-from-right">
          <p className="text-[#D4AF37] text-sm font-medium">
            ⚠️ {error}
          </p>
        </div>
      )}
      {children}
    </>
  );
}
