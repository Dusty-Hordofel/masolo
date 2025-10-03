import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripeInstance: Promise<Stripe | null> | null = null;

export const getStripeInstance = (
  stripeAccount?: string
): Promise<Stripe | null> => {
  if (!stripeInstance || stripeAccount) {
    stripeInstance = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!, {
      stripeAccount,
    });
  }
  return stripeInstance;
};
