"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-05-28.basil",
});

/**
 * Crée un Payment Intent Stripe et renvoie le clientSecret sous le bon type.
 * @returns {Promise<string | undefined>} clientSecret si succès, undefined si erreur
 */
export async function createPaymentIntent(): Promise<string | undefined> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, // Montant en centimes (ex: 50€)
      currency: "eur",
      automatic_payment_methods: { enabled: true },
    });

    return paymentIntent.client_secret ?? undefined; // Assure que `undefined` est retourné en cas d'échec
  } catch (error) {
    console.error("Erreur de création du Payment Intent:", error);
    return undefined; // Retourne `undefined` en cas d'erreur
  }
}

// export async function createPaymentIntent() {
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: 1000, // Montant en centimes (10€)
//       currency: "eur",
//       automatic_payment_methods: { enabled: true },
//     });

//     return { clientSecret: paymentIntent.client_secret ?? undefined };
//     // return { clientSecret: paymentIntent.client_secret ?? undefined };
//   } catch (error) {
//     console.error("Erreur Stripe:", error);
//     return { error: "Erreur lors de la création du paiement" };
//   }
// }
