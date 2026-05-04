'use client';

import { useEffect, useState } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';

export function PaddleProvider({ children }: { children: React.ReactNode }) {
  const [paddleInfo, setPaddleInfo] = useState<Paddle | undefined>();

  useEffect(() => {
    // Evitamos inicializar dos veces
    if (paddleInfo) return;

    initializePaddle({
      environment: process.env.NEXT_PUBLIC_PADDLE_ENV as 'sandbox' | 'production',
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
      // Esto hace que el checkout herede un poco de los colores de tu marca (opcional)
      checkout: {
        settings: {
          displayMode: 'overlay',
          theme: 'light',
          locale: 'es'
        }
      }
    }).then((paddleInstance) => {
      if (paddleInstance) {
        setPaddleInfo(paddleInstance);
        // Guardamos la instancia de Paddle globalmente en Window para usarla en cualquier botón
        (window as any).Paddle = paddleInstance;
      }
    });
  }, [paddleInfo]);

  return <>{children}</>;
}