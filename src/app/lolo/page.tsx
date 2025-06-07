"use client";

import { useEffect, useMemo, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { createPaymentIntent } from "./payment";
import CheckoutForm from "./checkout-form";

const CheckoutPage = ({
  storeStripeAccountId,
}: {
  storeStripeAccountId: string;
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  //   let stripeAccountId = "acct_1QtLL5PPN6he4rg6";

  const stripePromise = useMemo(
    () =>
      loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!, {
        stripeAccount: storeStripeAccountId,
      }),
    [storeStripeAccountId]
  );

  useEffect(() => {
    createPaymentIntent().then((secret) => {
      if (secret) {
        setClientSecret(secret);
      }
    });
  }, []);

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
};

export default CheckoutPage;
