"use client";
import { CheckoutItem } from "@/@types/cart/cart.item.interface";
import {
  loadStripe,
  StripeElementsOptions,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";
import { Elements, PaymentElement, useCheckout } from "@stripe/react-stripe-js";
import React, { useEffect, useMemo, useState } from "react";
// import {
//   createStripePaymentIntent,
//   createStripePaymentIntent1,
// } from "./payment";
import { processPaymentIntent } from "@/server-actions/stripe/payment";

const Molo = ({
  storeStripeAccountId,
  detailsOfProductsInCart,
  storeId,
  paymentIntentPromise,
}: //   paymentIntent,
{
  storeId: string;
  //   storeProducts: StoreProduct[];
  storeStripeAccountId: string;
  detailsOfProductsInCart: CheckoutItem[];
  paymentIntentPromise: Promise<string | undefined>;
}) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
  );

  // const stripePromise = useMemo(
  //   () =>
  //     loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!, {
  //       stripeAccount: storeStripeAccountId,
  //     }),
  //   [storeStripeAccountId]
  // );

  const clientSecret = React.use(paymentIntentPromise);
  console.log("🚀 ~ clientSecret:", clientSecret);

  if (!clientSecret) {
    return <p>Chargement en cours....</p>;
  }

  console.log("🚀 ~ data:DADA", clientSecret);

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
          {/* <p>client secret: {clientSecret}</p>
          <p>client secret1: {clientSecret1}</p> */}
          <p>client secret2: {clientSecret}</p>
          {/* <pre>{JSON.stringify(detailsOfProductsInCart, null, 2)}</pre> */}
        </div>
      )}

      <p className="pt-10">Partie 2</p>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <form>
            <PaymentElement
              id="payment-element"
              options={paymentElementOptions}
            />
          </form>
        </Elements>
      )}
    </>
  );
};

export default Molo;
