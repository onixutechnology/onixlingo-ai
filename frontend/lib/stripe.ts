import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // TypeScript te avisará si hay una versión más nueva, usa esa.
  typescript: true,
});