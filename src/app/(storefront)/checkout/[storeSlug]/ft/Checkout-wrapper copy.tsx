"use client";

import { useEffect, useMemo, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { createPaymentIntent } from "./payment";
import CheckoutForm from "./checkout-form";
import { CheckoutItem } from "@/@types/cart/cart.item.interface";
import { Heading } from "@/components/ui/heading";
import { FeatureIcons } from "@/components/storefront/feature-icons";
import { OrderSummaryAccordion } from "./order-summary-accordion";

export default function CheckoutWrapper(props: {
  paymentIntent: Promise<{ clientSecret: string | null } | undefined>;
  detailsOfProductsInCart: CheckoutItem[];
  storeStripeAccountId: string;
  cartLineItems: React.ReactNode;
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

  // useEffect(() => {
  //   createPaymentIntent(props.storeStripeAccountId).then((secret) => {
  //     if (secret) {
  //       setClientSecret(secret);
  //     }
  //   });
  // }, []);

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

  // if (!clientSecret) return <p>Chargement...</p>;

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
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 mt-4 flex flex-col-reverse gap-6">
            <div className="col-span-7">
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            </div>
            <div className="col-span-5">
              <div className="bg-secondary rounded-lg lg:p-6 h-fit border-border border p-1 px-4 lg:mb-8">
                {/* <div className="hidden lg:flex flex-col gap-2">
                  <Heading size="h4">Order Summary</Heading>
                  {props.cartLineItems}
                  <OrderTotalRow total={orderTotal} />
                </div> */}
                <OrderSummaryAccordion
                  title="Order Summary"
                  className="lg:hidden"
                >
                  {props.cartLineItems}
                  {/* <OrderTotalRow total={orderTotal} /> */}
                </OrderSummaryAccordion>
              </div>
              <div className="lg:hidden bg-secondary border border-border p-5 pt-8 mt-8 rounded-md">
                <TrustBadges />
              </div>
              <div className="hidden lg:block">
                <TrustBadges />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const TrustBadges = () => {
  return (
    <div className="flex items-center justify-center flex-col gap-6">
      <div className="flex flex-col gap-2 items-center justify-center">
        <p className="text-lg font-semibold text-center">
          Hundreds of happy customers worldwide
        </p>
        <div className="flex items-center justify-center gap-1">
          {Array.from(Array(5)).map((_, i) => (
            <div className="max-w-2" key={i}>
              <StarSVG />
            </div>
          ))}
        </div>
      </div>
      <FeatureIcons />
    </div>
  );
};

const OrderTotalRow = (props: { total: string }) => {
  return (
    <div className="flex items-center justify-between p-4 py-2 border-y border-slate-200">
      <Heading size="h4">Total</Heading>
      <p className="text-lg font-semibold">{props.total}</p>
    </div>
  );
};

export const StarSVG = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.5 2L30.4525 16.1525L46 18.4359L34.75 29.4458L37.405 45L23.5 37.6525L9.595 45L12.25 29.4458L1 18.4359L16.5475 16.1525L23.5 2Z"
        fill="#FFD232"
        stroke="#FFD232"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
