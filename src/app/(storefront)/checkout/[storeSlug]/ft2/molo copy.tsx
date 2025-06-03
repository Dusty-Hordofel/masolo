"use client";
import { CheckoutItem } from "@/@types/cart/cart.item.interface";
import {
  loadStripe,
  StripeElementsOptions,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import React, { useEffect, useMemo, useState } from "react";
import { createStripePaymentIntent } from "./payment";
import { processPaymentIntent } from "@/server-actions/stripe/payment";

const Molo = ({
  paymentIntent,
}: //   storeStripeAccountId,
//   storeId,
//   storeStripeAccountId,
//   detailsOfProductsInCart,
{
  //   storeStripeAccountId: string;
  //   storeId: string;
  //   detailsOfProductsInCart: CheckoutItem[];
  paymentIntent: Promise<{ clientSecret: string | null } | undefined>;
}) => {
  //   console.log("🚀 ~ storeId:", storeId);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  console.log("🚀 ~ clientSecret:", clientSecret);

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
  );
  console.log("🚀 ~ stripePromise:", stripePromise);

  //   const stripePromise = useMemo(() => {
  //     if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  //       console.error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is missing!");
  //       return null;
  //     }

  //     if (!storeStripeAccountId) {
  //       console.warn("storeStripeAccountId is missing or invalid!");
  //       return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
  //     }

  //     return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!, {
  //       stripeAccount: storeStripeAccountId,
  //     });
  //   }, [storeStripeAccountId]);

  //   useEffect(() => {
  //     let error;
  //     paymentIntent.then((data) => {
  //       if (!data || !data.clientSecret) {
  //         error = true;
  //         return;
  //       }
  //       setClientSecret(data.clientSecret);
  //     });
  //     if (error) throw new Error("Payment intent not found");
  //   }, [paymentIntent]);

  //   "acct_1QtLL5PPN6he4rg6"
  useEffect(() => {
    createStripePaymentIntent().then((secret) => {
      if (secret) {
        setClientSecret(secret);
      }
    });
  }, []);

  //   useEffect(() => {
  //     // if (!storeId) return; // Vérifie avant d'envoyer la requête
  //     // if (!storeStripeAccountId) return; // Vérifie avant d'envoyer la requête

  //     const fetchPaymentIntent = async () => {
  //       try {
  //         const intent = await processPaymentIntent({
  //           storeId: "b4d35aad-f0bd-41d7-827f-1c8a82bef234", // Utilisation correcte
  //           items: [
  //             { id: "541646a8-e85a-4b0f-bcb9-56daad5498f4", price: 2450, qty: 7 },
  //             { id: "243b5952-b115-4283-b72e-d600f9cf076b", price: 2200, qty: 5 },
  //           ], // Remplace par les items du panier
  //         });
  //         console.log("🚀 ~ fetchPaymentIntent ~ intent:", intent);

  //         if (intent?.clientSecret) {
  //           setClientSecret(intent.clientSecret);
  //         }
  //       } catch (error) {
  //         console.error("Erreur lors de la création du PaymentIntent:", error);
  //       }
  //     };

  //     fetchPaymentIntent();
  //   }, []);
  //   storeId useEffect dependeces

  //   props.storeStripeAccountId
  //   useEffect(() => {
  //     createPaymentIntent().then((secret) => {
  //       if (secret) {
  //         setClientSecret(secret);
  //       }
  //     });
  //   }, []);

  //   if (!clientSecret) return <p>Chargement...</p>;

  console.log("🚀 ~ stripePromise ~ stripePromise:", stripePromise);

  const paymentElementOptions = {
    layout: "tabs",
  } as StripePaymentElementOptions;

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
    <>
      {clientSecret && (
        <div>
          <h1>Hello from Molo</h1>
          {/* <p>Store Stripe Account ID: {storeStripeAccountId}</p> */}
          <p>client secret: {clientSecret}</p>
          {/* <pre>{JSON.stringify(detailsOfProductsInCart, null, 2)}</pre> */}
        </div>
      )}

      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <PaymentElement
            id="payment-element"
            options={paymentElementOptions}
          />
        </Elements>
      )}
    </>
  );
};

export default Molo;
