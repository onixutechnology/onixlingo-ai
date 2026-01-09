import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    // 1. Recibir datos del usuario desde el Frontend
    const { userId, userEmail } = await req.json();

    // 2. Crear la sesión de Stripe (Aquí sucede la magia de los 7 días y cupones)
    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/pro?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/pro?canceled=true`,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: userEmail,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_PRO, // Cobra los $49
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7, // 🎁 ¡Aquí están tus 7 días GRATIS!
        metadata: {
          userId: userId, 
        },
      },
      allow_promotion_codes: true, // 🎟️ ¡Aquí habilitas el campo para el código VIP!
    });

    // 3. Devolver la URL de pago al Frontend
    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('[STRIPE_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}