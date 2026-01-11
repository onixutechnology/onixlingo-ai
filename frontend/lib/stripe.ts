import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Usamos 'as any' para evitar que TypeScript bloquee el build por conflictos de versión
  apiVersion: '2023-10-16' as any, 
  typescript: true,
});