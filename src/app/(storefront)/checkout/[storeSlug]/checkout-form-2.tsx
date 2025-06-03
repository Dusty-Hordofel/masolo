"use client";

import { useEffect, useMemo, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { createPaymentIntent } from "./payment";
import CheckoutForm from "./checkout-form";
import { Store } from "@prisma/client";
import { CheckoutItem } from "@/@types/cart/cart.item.interface";
import { processPaymentIntent } from "@/server-actions/stripe/payment";

export default function CheckoutPage({
  storeStripeAccountId,
  detailsOfProductsInCart,
}: //
// store,
// paymentIntent,
{
  // store: Store;
  storeStripeAccountId?: string;
  detailsOfProductsInCart: CheckoutItem[];
  // paymentIntent: Promise<{ clientSecret: string | null } | undefined>;
}) {
  console.log("🚀 ~ storeStripeAccountId:", storeStripeAccountId);
  console.log("🚀 ~ detailsOfProductsInCart:", detailsOfProductsInCart);
  // console.log("🚀 ~ store:", store);
  // console.log("🚀 ~ storeStripeAccountId:", storeStripeAccountId);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<string | undefined>(
    undefined
  );

  console.log("🚀 ~ clientSecret:", clientSecret);
  console.log("🚀 ~ paymentIntent:", paymentIntent);
  //   let stripeAccountId = "acct_1QtLL5PPN6he4rg6";

  // const stripePromise = useMemo(
  //   () =>
  //     loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!, {
  //       stripeAccount: storeStripeAccountId,
  //     }),
  //   [storeStripeAccountId]
  // );
  // if (!storeStripeAccountId) throw new Error("StripeAccount not found");

  const stripePromise = useMemo(() => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
      console.error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is missing!");
      return null;
    }

    if (!storeStripeAccountId) {
      console.warn("storeStripeAccountId is missing or invalid!");
      return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
    }

    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!, {
      stripeAccount: storeStripeAccountId,
    });
  }, [storeStripeAccountId]);

  // useEffect(() => {
  //   let error;
  //   paymentIntent.then((data) => {
  //     if (!data || !data.clientSecret) {
  //       error = true;
  //       return;
  //     }
  //     setClientSecret(data.clientSecret);
  //   });
  //   if (error) throw new Error("Payment intent not found");
  // }, [paymentIntent]);

  // useEffect(() => {
  //   createPaymentIntent().then((secret) => {
  //     if (secret) {
  //       setClientSecret(secret);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (!storeStripeAccountId) return; // Vérifie avant d'envoyer la requête

    const fetchPaymentIntent = async () => {
      try {
        const intent = await processPaymentIntent({
          storeId: storeStripeAccountId, // Utilisation correcte
          items: [], // Remplace par les items du panier
        });
        console.log("🚀 ~ fetchPaymentIntent ~ intent:", intent);

        if (intent?.clientSecret) {
          setClientSecret(intent.clientSecret);
        }
      } catch (error) {
        console.error("Erreur lors de la création du PaymentIntent:", error);
      }
    };

    fetchPaymentIntent();
  }, [storeStripeAccountId]);

  // if (!clientSecret || !stripePromise) return <p>Chargement...</p>;

  // useEffect(() => {
  //   const fetchPaymentIntent = async () => {
  //     try {
  //       const intent = await processPaymentIntent({
  //         items: detailsOfProductsInCart,
  //         storeId: store?.id,
  //       });
  //       setPaymentIntent(intent);
  //     } catch (error) {
  //       console.error("Erreur lors de la création du PaymentIntent:", error);
  //     }
  //   };

  //   if (detailsOfProductsInCart.length > 0 && store?.id) {
  //     fetchPaymentIntent();
  //   }
  // }, [detailsOfProductsInCart, store?.id]);

  // useEffect(() => {
  //   const fetchPaymentIntent = async () => {
  //     try {
  //       const intent = await processPaymentIntent({
  //         items: detailsOfProductsInCart,
  //         storeId: store?.id,
  //       });
  //       setPaymentIntent(intent?.clientSecret);
  //     } catch (error) {
  //       console.error("Erreur lors de la création du PaymentIntent:", error);
  //     }
  //   };

  //   if (detailsOfProductsInCart.length > 0 && store?.id) {
  //     fetchPaymentIntent();
  //   }
  // }, [detailsOfProductsInCart, store?.id]);

  if (!clientSecret) return <p>Chargement...</p>;

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
    paymentMethodOrder: [
      "apple_pay",
      "google_pay",
      "paypal",
      "alma",
      "card",
      "klarna",
      "revolut_pay",
    ],
  } as StripeElementsOptions;

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
