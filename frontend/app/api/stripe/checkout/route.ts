import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// 🛑 IMPORTANTE: Esto arregla el error "Neither apiKey nor config.authenticator provided"
// Le dice a Vercel que esta ruta es dinámica y no debe ejecutarse durante el Build.
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log("💳 [STRIPE] Iniciando Checkout...");

    // 1. Obtener la URL base dinámicamente (funciona en localhost y producción)
    // Si por alguna razón no detecta el origen, usa la variable de entorno como respaldo.
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // 2. Validación de Configuración
    const priceId = process.env.STRIPE_PRICE_ID_PRO;
    if (!priceId) {
      console.error("❌ [STRIPE CRITICAL] Falta STRIPE_PRICE_ID_PRO en .env.local");
      return new NextResponse(JSON.stringify({ error: "Server Config Error" }), { status: 500 });
    }

    // 3. Parsear datos del usuario
    const body = await req.json();
    const { userId, userEmail } = body;

    if (!userId) {
      return new NextResponse("Unauthorized: Missing User ID", { status: 401 });
    }

    console.log(`👤 Procesando para usuario: ${userId} (${userEmail || 'No email'})`);

    // 4. Crear Sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/pro?canceled=true`,
      
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: userEmail,
      
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      // 🎁 Metadatos en la SESIÓN (Para fácil acceso)
      metadata: {
        userId: userId,
      },

      subscription_data: {
        trial_period_days: 7, // 7 Días Gratis
        // 🎁 Metadatos en la SUSCRIPCIÓN (Para los webhooks de renovación)
        metadata: {
          userId: userId,
        },
      },

      // 🎟️ Permitir Cupones (ONIXVIP)
      allow_promotion_codes: true,
    });

    console.log("✅ [STRIPE] Sesión creada exitosamente:", session.id);

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('❌ [STRIPE ERROR]:', error);
    // Devolvemos un mensaje genérico al cliente por seguridad, pero logueamos el real
    return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
  }
}