"use server";

import { CheckoutItem } from "@/@types/cart/cart.item.interface";
import { platformFeeDecimal } from "@/lib/application-constants";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

/**
 * Crée un Payment Intent Stripe et renvoie le clientSecret sous le bon type.
 * @returns {Promise<string | undefined>} clientSecret si succès, undefined si erreur
 */

// ("use server");

// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2024-04-10",
// });

/**
 * Crée un Payment Intent Stripe et renvoie le clientSecret sous le bon type.
 * @returns {Promise<string | undefined>} clientSecret si succès, undefined si erreur
 */
// export async function createPaymentIntent(
//   stripeAccountId: string
// ): Promise<string | undefined> {
//   try {
//     const paymentIntent = await stripe.paymentIntents.create(
//       {
//         amount: 5000, // Montant en centimes (ex: 50€)
//         currency: "eur",
//         automatic_payment_methods: { enabled: true },
//       },
//       {
//         stripeAccount: stripeAccountId,
//       }
//     );

//     return paymentIntent.client_secret ?? undefined; // Assure que `undefined` est retourné en cas d'échec
//   } catch (error) {
//     console.error("Erreur de création du Payment Intent:", error);
//     return undefined; // Retourne `undefined` en cas d'erreur
//   }
// }

// type Metadata = {
//   cartId: string;
//   items: string;
// };

// export async function createStripePaymentIntent({
//   items,
//   storeId,
// }: {
//   items: CheckoutItem[];
//   storeId: string;
// }): Promise<string | undefined> {
//   try {
//     // 🔍 Fetch Stripe Account ID
//     const payment = await prisma.payment.findMany({
//       where: { storeId },
//       select: { stripeAccountId: true },
//     });

//     const stripeAccountId = payment[0].stripeAccountId;

//     if (!stripeAccountId) {
//       throw new Error("Stripe Account Id not found");
//     }

//     const cartId = String(cookies().get("cartId")?.value);

//     const metadata: Metadata = {
//       cartId: cartId ? String(cartId) : "",
//       items: JSON.stringify(items),
//     };

//     const { orderTotal, platformFee } = calculateOrderAmounts(items);

//     // const metadata = {
//     //   cartId: cartId ? String(cartId) : "",
//     // };

//     const paymentIntent = await stripe.paymentIntents.create(
//       {
//         amount: orderTotal, // Montant en centimes (ex: 50€)
//         currency: "usd",
//         automatic_payment_methods: { enabled: true },
//         application_fee_amount: platformFee,
//       },
//       {
//         stripeAccount: stripeAccountId,
//       }
//     );

//     // ✅ Mise à jour du panier dans la base de données avec Prisma
//     await prisma.cart.update({
//       where: { id: cartId },
//       data: {
//         paymentIntentId: paymentIntent.id,
//         clientSecret: paymentIntent.client_secret,
//       },
//     });

//     // return { clientSecret: paymentIntent.client_secret as string };

//     return paymentIntent.client_secret ?? undefined; // Assure que `undefined` est retourné en cas d'échec
//   } catch (error) {
//     console.error("Erreur de création du Payment Intent:", error);
//     return undefined; // Retourne `undefined` en cas d'erreur
//   }
// }

// // Helper Functions
// const calculateOrderAmounts = (items: CheckoutItem[]) => {
//   const total = items.reduce((acc, item) => {
//     return acc + item.price * item.qty;
//   }, 0);
//   const fee = total * platformFeeDecimal;
//   return {
//     orderTotal: Number((total * 100).toFixed(0)), // converts to cents which stripe charges in
//     platformFee: Number((fee * 100).toFixed(0)),
//   };
// };

// export async function createStripePaymentIntent(): Promise<string | undefined> {
//   try {

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: 5000, // Montant en centimes (ex: 50€)
//       currency: "eur",
//       automatic_payment_methods: { enabled: true },
//     });

//     return paymentIntent.client_secret ?? undefined; // Assure que `undefined` est retourné en cas d'échec
//   } catch (error) {
//     console.error("Erreur de création du Payment Intent:", error);
//     return undefined; // Retourne `undefined` en cas d'erreur
//   }
// }

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
