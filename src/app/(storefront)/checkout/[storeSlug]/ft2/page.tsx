// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
// import { createPaymentIntent } from "./payment";
// import CheckoutForm from "./checkout-form";
// import CheckoutForm2 from "./checkout-form-2";

// "use";

import { getCart } from "@/server-actions/add-to-cart";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { InfoCard } from "@/components/admin/info-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/app/data/routes";
import { AlertCircle, ChevronRight } from "lucide-react";
import { hasConnectedStripeAccount } from "@/server-actions/stripe/account";
import { CheckoutItem } from "@/@types/cart/cart.item.interface";
import {
  createPaymentIntent,
  processPaymentIntent,
} from "@/server-actions/stripe/payment";
import { FeatureIcons } from "@/components/storefront/feature-icons";
import { Heading } from "@/components/ui/heading";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
// import CheckoutClient from "../../components/checkout-client";
import CheckoutWrapper from "./Checkout-wrapper";
import Stripe from "stripe";
import { CartLineItems } from "@/components/storefront/cart-line-items";
import CheckoutForm2 from "./checkout-form-2";
import Molo from "./molo";
import { useMemo } from "react";
import { createStripePaymentIntent2 } from "./payment";
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from "next/cache";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-04-10",
// });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

export default async function CheckoutPage({
  params,
}: {
  params: { storeSlug: string };
}) {
  // noStore();
  const cartId = cookies().get("cartId")?.value;
  // console.log("🚀 ~ cartId:", cartId);

  const { cartItems, cartItemDetails } = await getCart(String(cartId));
  // console.log("🚀 ~ cartItems:", cartItems);

  const store = await prisma.store.findFirst({
    where: {
      slug: params.storeSlug,
    },
    include: {
      payments: {
        select: {
          stripeAccountId: true,
        },
      },
    },
  });
  // console.log("🚀 ~ store:", store);

  const storeProducts = await prisma.product.findMany({
    where: {
      storeId: store?.id,
    },
    select: {
      id: true,
      price: true,
    },
  });
  // console.log("🚀 ~ storeProducts:", storeProducts);

  const detailsOfProductsInCart = cartItems
    .map((item) => {
      const product = storeProducts.find((p) => p.id === item.productId);

      if (!product) return;

      return {
        id: item.id,
        price: product.price,
        qty: item.qty,
      };
    })
    .filter(Boolean) as CheckoutItem[];

  // console.log(
  //   "🚀 ~ CheckoutPage ~ detailsOfProductsInCart:",
  //   detailsOfProductsInCart
  // );

  // console.log("🚀 ~ CheckoutPage ~ store:", store);
  // console.log("🚀 ~ CheckoutPage ~ storeProducts:", storeProducts);
  // console.log("🚀 ~ CheckoutPage ~ storeProducts:ID", store?.id);

  // const storeId = Number(store[0].storeId);
  const storeStripeAccountId = store?.payments[0]?.stripeAccountId;
  console.log("🚀 ~ storeStripeAccountId:", storeStripeAccountId);

  // const account = await stripe.accounts.retrieve();
  // console.log("🚀 ~ account:ACC", account);
  // console.log(
  //   "🚀 ~ CheckoutPage ~ storeStripeAccountId:",
  //   storeStripeAccountId
  // );

  if (
    !storeStripeAccountId ||
    !(await hasConnectedStripeAccount(store?.id, true))
  ) {
    return (
      <InfoCard
        heading="Online payments not setup"
        subheading="This seller does not have online payments setup yet. Please contact the seller directly to submit your order."
        icon={<AlertCircle size={24} />}
        button={
          <Link href={routes.cart}>
            <Button>Return to cart</Button>
          </Link>
        }
      />
    );
  }

  // const paymentIntent = processPaymentIntent({
  //   items: detailsOfProductsInCart,
  //   storeId: store?.id,
  // });

  const paymentIntentPromise = createStripePaymentIntent2({
    storeId: store.id,
    items: detailsOfProductsInCart,
  });
  const paymentIntent = createStripePaymentIntent2({
    storeId: store.id,
    items: detailsOfProductsInCart,
  });
  // console.log("🚀 ~ paymentIntentPromise:", paymentIntentPromise);

  // const account = await stripe.accounts.retrieve(
  //   process.env.STRIPE_PLATFORM_ACCOUNT_ID as string
  // );
  // console.log("🚀 ~ account:ACCOUNT", account.capabilities);
  // console.log("🚀 ~ account:ACCOUNT-R", account.requirements);

  // const paymentMethod = await stripe.paymentMethods.retrieve(await paymentIntent.payment_method);

  // console.log("Type de paiement:", paymentMethod.type);
  // console.log("Détails:", paymentMethod);
  // const paymentIntentPromise2 = await createStripePaymentIntent2({
  //   storeId: store.id,
  //   items: detailsOfProductsInCart,
  // });
  // console.log("🚀 ~ paymentIntentPromise2:", paymentIntentPromise2);
  // console.log("🚀 ~ CheckoutPage ~ paymentIntent:IT", paymentIntent);

  // const test = await checkStripeAccount(storeStripeAccountId);
  // console.log("🚀 ~ test:", test);

  return (
    <>
      <h1>OL</h1>
      <Molo
        storeStripeAccountId={storeStripeAccountId}
        storeId={store?.id}
        detailsOfProductsInCart={detailsOfProductsInCart}
        paymentIntentPromise={paymentIntentPromise}
      />

      {/* <CheckoutWrapper
        detailsOfProductsInCart={detailsOfProductsInCart}
        paymentIntent={paymentIntent}
        storeStripeAccountId={storeStripeAccountId}
        cartLineItems={
          <CartLineItems
            variant="checkout"
            cartItems={cartItems}
            products={
              cartItemDetails?.filter((item) => item.storeId === store.id) ?? []
            }
          />
        }
      /> */}
    </>
  );
}
