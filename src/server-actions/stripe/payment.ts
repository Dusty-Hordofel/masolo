"use server";

import { CheckoutItem } from "@/@types/cart/cart.item.interface";
import { platformFeeDecimal } from "@/lib/application-constants";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import Stripe from "stripe";

type Metadata = {
  cartId: string;
  items: string;
};

export async function processPaymentIntent({
  items,
  storeId,
}: {
  items: CheckoutItem[];
  storeId: string;
}) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-05-28.basil",
    });

    // 🔍 Fetch Stripe Account ID
    const payment = await prisma.payment.findMany({
      where: { storeId },
      select: { stripeAccountId: true },
    });

    const stripeAccountId = payment[0].stripeAccountId;

    if (!stripeAccountId) {
      throw new Error("Stripe Account Id not found");
    }

    const cartId = String(cookies().get("cartId")?.value);

    const metadata: Metadata = {
      cartId: cartId ? "" : cartId,
      items: JSON.stringify(items),
    };

    const { orderTotal, platformFee } = calculateOrderAmounts(items);

    if (cartId) {
      const paymentIntent = await prisma.cart.findUnique({
        where: { id: cartId },
        select: {
          paymentIntentId: true,
          clientSecret: true,
        },
      });

      // ✅ Si un PaymentIntent existe, le mettre à jour
      if (paymentIntent?.clientSecret && paymentIntent?.paymentIntentId) {
        await stripe.paymentIntents.update(
          paymentIntent.paymentIntentId,
          {
            amount: orderTotal,
            application_fee_amount: platformFee,
            metadata,
          },
          {
            stripeAccount: stripeAccountId,
          }
        );

        return { clientSecret: paymentIntent.clientSecret };
      }
    }

    const newPaymentIntent = await stripe.paymentIntents.create(
      {
        amount: orderTotal,
        currency: "usd",
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
        application_fee_amount: platformFee,
      },
      {
        stripeAccount: stripeAccountId,
      }
    );

    // ✅ Mise à jour du panier dans la base de données avec Prisma
    await prisma.cart.update({
      where: { id: cartId },
      data: {
        paymentIntentId: newPaymentIntent.id,
        clientSecret: newPaymentIntent.client_secret,
      },
    });

    return { clientSecret: newPaymentIntent.client_secret as string };
  } catch (error) {
    console.log(error);
  }
}

/**
 * Create a PaymentIntent in Stripe.
 * @param cartId ID of the cart containing the PaymentIntent.
 * @param orderTotal Total amount of the order.
 * @param platformFee Platform fee amount.
 * @param metadata Metadata associated with the payment.
 * @param stripeAccountId ID of the connected Stripe account.
 * @returns {Promise<{ clientSecret: string } >} - A promise that resolves to an object containing the  client secret of the created PaymentIntent, or `null` if the PaymentIntent creation failed.
 */

export async function createPaymentIntent(
  cartId: string,
  orderTotal: number,
  platformFee: number,
  metadata: Metadata,
  stripeAccountId: string,
  stripe: Stripe
): Promise<{ clientSecret: string }> {
  try {
    // ✅ Création d'un PaymentIntent Stripe
    const newPaymentIntent = await stripe.paymentIntents.create(
      {
        amount: orderTotal,
        currency: "usd",
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
        application_fee_amount: platformFee,
      },
      {
        stripeAccount: stripeAccountId,
      }
    );

    // ✅ Mise à jour du panier dans la base de données avec Prisma
    await prisma.cart.update({
      where: { id: cartId },
      data: {
        paymentIntentId: newPaymentIntent.id,
        clientSecret: newPaymentIntent.client_secret,
      },
    });

    return { clientSecret: newPaymentIntent.client_secret as string };
  } catch (error) {
    console.error("❌ Erreur lors de la création du PaymentIntent :", error);
    throw new Error("Impossible de créer un PaymentIntent.");
  }
}

/**
 * Updates an existing PaymentIntent in Stripe.
 * @param cartId ID of the cart containing the PaymentIntent.
 * @param orderTotal Total amount of the order.
 * @param platformFee Platform fee amount.
 * @param metadata Metadata associated with the payment.
 * @param stripeAccountId ID of the connected Stripe account.
 * @returns {Promise<{ clientSecret: string } | null>} Updated ClientSecret or `null` if no update was made.
 */

export async function updatePaymentIntent(
  cartId: string,
  orderTotal: number,
  platformFee: number,
  metadata: Metadata,
  stripeAccountId: string,
  stripe: Stripe
): Promise<{ clientSecret: string } | null> {
  try {
    // 🔍 Vérifier si le panier possède un PaymentIntent existant
    const paymentIntent = await prisma.cart.findUnique({
      where: { id: cartId },
      select: {
        paymentIntentId: true,
        clientSecret: true,
      },
    });
    console.log("🚀 ~ paymentIntent:DD", paymentIntent);

    // ✅ Si un PaymentIntent existe, le mettre à jour
    if (paymentIntent?.clientSecret && paymentIntent?.paymentIntentId) {
      await stripe.paymentIntents.update(
        paymentIntent.paymentIntentId,
        {
          amount: orderTotal,
          application_fee_amount: platformFee,
          metadata,
        },
        {
          stripeAccount: stripeAccountId,
        }
      );

      return { clientSecret: paymentIntent.clientSecret };
    }

    return null; // Aucun PaymentIntent trouvé, donc rien à mettre à jour
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du PaymentIntent :", error);
    throw new Error("Impossible de mettre à jour le paiement.");
  }
}

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
