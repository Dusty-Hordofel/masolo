// "use client";

// import React, { useEffect, useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent } from "./payment";
import CheckoutForm from "./checkout-form";

// Charger Stripe avec la clé publique
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const CheckoutPage = async () => {
  //   const [clientSecret, setClientSecret] = useState<string | null>(null);
  //   console.log("🚀 ~ CheckoutPage ~ clientSecret:", clientSecret);

  //   useEffect(() => {
  //     createPaymentIntent().then((data) => {
  //       if (data.clientSecret) {
  //         setClientSecret(data.clientSecret);
  //       }
  //     });
  //   }, []);

  const clientSecret = await createPaymentIntent();
  console.log("🚀 ~ CheckoutPage ~ clientSecret:TOLO", clientSecret);

  if (!clientSecret) {
    return <p>Erreur lors de la création du paiement. Veuillez réessayer.</p>;
  }

  if (!clientSecret) return <p>Chargement...</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <h1>Checkout</h1>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutPage;
