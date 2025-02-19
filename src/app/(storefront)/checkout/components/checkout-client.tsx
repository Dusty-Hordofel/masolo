"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe, StripeElementsOptions } from "@stripe/stripe-js";
// import { loadStripe, Stripe } from "@stripe/stripe-js";
// import CheckoutForm from "./checkout-form";
// import { stripePromise } from "./stripe";
// import CheckoutForm from "./checkout-form";
// import { useEffect, useState } from "react";

interface CheckoutClientProps {
  clientSecret: string;
}

const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);
export default function CheckoutClient({ clientSecret }: CheckoutClientProps) {
  // const options = {
  //   clientSecret,
  //   appearance: { theme: "stripe" },
  // } as StripeElementsOptions;
  // options={options}
  return (
    <Elements stripe={stripePromise}>
      {/* <CheckoutForm /> */}
      <h1>Checkout 22</h1>
    </Elements>
  );
}
