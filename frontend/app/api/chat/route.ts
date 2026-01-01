import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Recibimos el mensaje del usuario desde el Frontend
    const body = await req.json();
    
    // 2. Le preguntamos a tu Backend Python (en el puerto 8001)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001/api/v1';
    
    const response = await fetch(`${apiUrl}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // 3. Devolvemos la respuesta de la IA al Frontend
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error en el puente Next.js:', error);
    return NextResponse.json(
      { text: "Error de conexión con el cerebro 🧠", gesture: "neutral", emotion: "sad" },
      { status: 500 }
    );
  }
}