import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    // 1. Logs de diagnóstico para ver qué pasa en la consola
    console.log("💳 Iniciando proceso de Checkout en Stripe...");

    // 2. Validación de seguridad: ¿Tenemos la clave del precio?
    const priceId = process.env.STRIPE_PRICE_ID_PRO;
    if (!priceId) {
      console.error("❌ ERROR CRÍTICO: Falta STRIPE_PRICE_ID_PRO en .env.local");
      return new NextResponse('Server Config Error: Missing Price ID', { status: 500 });
    }

    // 3. Recibir datos del usuario (Frontend)
    const body = await req.json();
    const { userId, userEmail } = body;

    // 4. Crear la Sesión de Stripe (La configuración maestra)
    const session = await stripe.checkout.sessions.create({
      // A dónde ir si paga o cancela
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/pro?canceled=true`,
      
      // Configuración de Pago
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: userEmail, // Pre-llenar el email si lo tenemos
      
      // El Producto ($49 MXN)
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      // 🎁 TUS REQUISITOS (Prueba Gratis + Metadatos)
      subscription_data: {
        trial_period_days: 7, // 7 Días de prueba gratuita
        metadata: {
          userId: userId, // Guardamos quién pagó para activarlo luego
        },
      },

      // 🎟️ TUS REQUISITOS (Cupones VIP)
      allow_promotion_codes: true, // Habilita la caja para poner "ONIXVIP"
    });

    console.log("✅ Sesión creada. URL:", session.url);

    // 5. Devolver la URL a tu Frontend para que redirija
    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('❌ [STRIPE ERROR]:', error.message);
    return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
  }
}