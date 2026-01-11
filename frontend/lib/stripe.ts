import Stripe from 'stripe';

// FIX: Usar una clave "dummy" si la variable de entorno no existe durante el build.
// Esto evita que Vercel falle al compilar. En ejecución real, usará la variable correcta.
const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build_process';

export const stripe = new Stripe(apiKey, {
  apiVersion: '2023-10-16' as any,
  typescript: true,
});