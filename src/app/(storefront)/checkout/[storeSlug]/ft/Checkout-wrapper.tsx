"use client";

import { useEffect, useMemo, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { createPaymentIntent } from "./payment";
import CheckoutForm from "./checkout-form";

export default function CheckoutWrapper(props: {
  paymentIntent: Promise<{ clientSecret: string | null } | undefined>;
  // detailsOfProductsInCart: CheckoutItem[];
  storeStripeAccountId: string;
  // cartLineItems: React.ReactNode;
}) {
  console.log("🚀 ~ storeStripeAccountId:MIKE", props.storeStripeAccountId);

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const stripePromise = useMemo(() => {
    if (!props.storeStripeAccountId) {
      console.warn("⚠ storeStripeAccountId est manquant !");
      return null;
    }
    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!, {
      stripeAccount: props.storeStripeAccountId,
    });
  }, [props.storeStripeAccountId]);

  if (!stripePromise) return <p>Impossible de charger Stripe...</p>;

  useEffect(() => {
    createPaymentIntent(props.storeStripeAccountId).then((secret) => {
      if (secret) {
        setClientSecret(secret);
      }
    });
  }, []);

  // useEffect(() => {
  //   let error;
  //   props.paymentIntent.then((data) => {
  //     if (!data || !data.clientSecret) {
  //       error = true;
  //       return;
  //     }
  //     setClientSecret(data.clientSecret);
  //   });
  //   if (error) throw new Error("Payment intent not found");
  // }, [props.paymentIntent]);

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
    <>
      {/* {clientSecret && ( */}
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
      {/* )} */}
    </>
  );
}
