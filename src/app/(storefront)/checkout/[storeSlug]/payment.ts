"use server";

import { CheckoutItem } from "@/@types/cart/cart.item.interface";
import { platformFeeDecimal } from "@/lib/application-constants";
import { prisma } from "@/lib/prisma";
// import { unstable_noStore } from "next/cache";
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from "next/cache";
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

// export async function createStripePaymentIntent(): Promise<string | undefined> {
//   noStore();
//   try {
//     const payments = await prisma.payment.findMany({
//       where: { storeId: "b4d35aad-f0bd-41d7-827f-1c8a82bef234" },
//       select: { stripeAccountId: true },
//     });

//     const storeStripeAccountId = payments[0]?.stripeAccountId as string;

//     if (!storeStripeAccountId) {
//       throw new Error("Stripe account not found.");
//     }

//     console.log(
//       "🚀 ~ createStripePaymentIntent ~ payment:SE-C0",
//       storeStripeAccountId
//     );

//     const paymentIntent = await stripe.paymentIntents.create(
//       {
//         amount: 5000, // Montant en centimes (ex: 50€)
//         currency: "usd",
//         automatic_payment_methods: { enabled: true },
//       }
//       // {
//       //   stripeAccount: storeStripeAccountId,
//       // }
//     );

//     // const paymentIntent = await stripe.paymentIntents.create(
//     //   {
//     //     amount: total,
//     //     application_fee_amount: fee,
//     //     currency: "usd",
//     //     metadata,
//     //     automatic_payment_methods: {
//     //       enabled: true,
//     //     },
//     //   },
//     //   {
//     //     stripeAccount: payment.stripeAccountId,
//     //   }
//     // )

//     console.log(
//       "🚀 ~ createStripePaymentIntent ~ paymentIntent:SA-PI",
//       paymentIntent
//     );

//     return paymentIntent.client_secret ?? undefined; // Assure que `undefined` est retourné en cas d'échec
//   } catch (error) {
//     console.error("Erreur de création du Payment Intent:", error);
//     return undefined; // Retourne `undefined` en cas d'erreur
//   }
// }
export async function createStripePaymentIntent2({
  items,
  storeId,
}: {
  items: CheckoutItem[];
  storeId: string;
}): Promise<string | undefined> {
  noStore();

  try {
    const payments = await prisma.payment.findMany({
      where: { storeId },
      select: { stripeAccountId: true },
    });
    console.log("🚀 ~ payments:", payments);

    const storeStripeAccountId = payments[0]?.stripeAccountId as string;

    if (!storeStripeAccountId) {
      throw new Error("Stripe account not found.");
    }

    // const account = await stripe.accounts.retrieve(storeStripeAccountId);
    // console.log("🚀 ~ account:TALA", account?.charges_enabled);

    // console.log(
    //   "🚀 ~ createStripePaymentIntent ~ payment:SE-C0",
    //   storeStripeAccountId
    // );

    const cartId = String(cookies().get("cartId")?.value);

    const metadata: Metadata = {
      cartId,
      items: JSON.stringify(items),
    };

    const { orderTotal, platformFee } = calculateOrderAmounts(items);

    if (
      !storeStripeAccountId ||
      storeStripeAccountId === process.env.PLATFORM_STRIPE_ACCOUNT_ID
    ) {
      throw new Error(
        "Le store doit avoir un compte Stripe Connect valide (et différent de la plateforme)."
      );
    }

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: orderTotal, // Montant en centimes (ex: 50€)
        currency: "eur",
        // payment_method_types: ["card", "google_pay"],
        automatic_payment_methods: { enabled: true },
        application_fee_amount: platformFee,
        transfer_data: {
          destination: storeStripeAccountId, // 🛠 Redirige l'argent vers le compte Stripe du store
        },
        metadata,
      }

      // {
      //   stripeAccount: storeStripeAccountId,
      // }
    );

    // STRIPE_PLATFORM_ACCOUNT_ID
    // console.log("🚀 ~ paymentIntent:INTENT", paymentIntent);

    // ✅ Mise à jour du panier dans la base de données avec Prisma
    await prisma.cart.update({
      where: { id: cartId },
      data: {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      },
    });

    // return { clientSecret: paymentIntent.client_secret as string };

    return paymentIntent.client_secret ?? undefined; // Assure que `undefined` est retourné en cas d'échec
  } catch (error) {
    console.error("Erreur de création du Payment Intent:", error);
    return undefined; // Retourne `undefined` en cas d'erreur
  }
}

type Metadata = {
  cartId: string;
  items: string;
};

// export async function createStripePaymentIntent1({
//   items,
//   storeId,
// }: {
//   items: CheckoutItem[];
//   storeId: string;
// }): Promise<string | undefined> {
//   noStore();
//   try {
//     // 🔍 Fetch Stripe Account ID
//     const payment = await prisma.payment.findMany({
//       where: { storeId },
//       select: { stripeAccountId: true },
//     });

//     const stripeAccountId = payment[0].stripeAccountId;
//     // console.log("🚀 ~ stripeAccountId:SE", stripeAccountId);

//     if (!stripeAccountId) {
//       throw new Error("Stripe Account Id not found");
//     }

//     const cartId = String(cookies().get("cartId")?.value);

//     const metadata: Metadata = {
//       cartId: cartId ? String(cartId) : "",
//       items: JSON.stringify(items),
//     };

//     const { orderTotal, platformFee } = calculateOrderAmounts(items);

//     const paymentIntent = await stripe.paymentIntents.create(
//       {
//         amount: orderTotal, // Montant en centimes (ex: 50€)
//         currency: "eur",
//         automatic_payment_methods: { enabled: true },
//         application_fee_amount: platformFee,
//         metadata,
//       },

//       {
//         stripeAccount: stripeAccountId,
//       }
//     );
//     // console.log("🚀 ~ paymentIntent:INTENT", paymentIntent);

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

// Helper Functions
const calculateOrderAmounts = (items: CheckoutItem[]) => {
  const total = items.reduce((acc, item) => {
    return acc + item.price * item.qty;
  }, 0);
  const fee = total * platformFeeDecimal;
  return {
    orderTotal: Number((total * 100).toFixed(0)), // converts to cents which stripe charges in
    platformFee: Number((fee * 100).toFixed(0)),
  };
};
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
