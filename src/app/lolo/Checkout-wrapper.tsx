"use client";

import { useEffect, useMemo, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import CheckoutForm from "./checkout-form";
import { CheckoutItem } from "@/@types/cart/cart.item.interface";
import { currencyFormatter } from "@/lib/currency";

const CheckoutWrapper = (props: {
  paymentIntent: Promise<{ clientSecret: string | null } | undefined>;
  detailsOfProductsInCart: CheckoutItem[];
  storeStripeAccountId: string;
  cartLineItems: React.ReactNode;
}) => {
  const [clientSecret, setClientSecret] = useState("");
  const stripePromise = useMemo(
    () =>
      loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, {
        stripeAccount: props.storeStripeAccountId,
      }),
    [props.storeStripeAccountId]
  );

  useEffect(() => {
    let error;
    props.paymentIntent.then((data) => {
      if (!data || !data.clientSecret) {
        error = true;
        return;
      }
      setClientSecret(data.clientSecret);
    });
    if (error) throw new Error("Payment intent not found");
  }, [props.paymentIntent]);

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

  // const orderTotal = useMemo(() => {
  //   return currencyFormatter(
  //     props.detailsOfProductsInCart.reduce(
  //       (acc, item) => acc + item.price * item.qty,
  //       0
  //     )
  //   );
  // }, [props.detailsOfProductsInCart]);

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutWrapper;
