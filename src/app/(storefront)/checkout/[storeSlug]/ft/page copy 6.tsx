// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
// import { createPaymentIntent } from "./payment";
// import CheckoutForm from "./checkout-form";

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
import CheckoutClient from "../../components/checkout-client";
import CheckoutWrapper from "./Checkout-wrapper";
import Stripe from "stripe";
import { CartLineItems } from "@/components/storefront/cart-line-items";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

async function checkStripeAccount(accountId: string) {
  try {
    const account = await stripe.accounts.retrieve(accountId);
    console.log("✅ Compte Stripe trouvé :", account);
    return account;
  } catch (error) {
    console.error("❌ Erreur : compte Stripe inexistant ou invalide", error);
    return null;
  }
}

export default async function CheckoutPage({
  params,
}: {
  params: { storeSlug: string };
}) {
  const cartId = cookies().get("cartId")?.value;

  const { cartItems, cartItemDetails } = await getCart(String(cartId));

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

  const storeProducts = await prisma.product.findMany({
    where: {
      storeId: store?.id,
    },
    select: {
      id: true,
      price: true,
    },
  });

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

  console.log(
    "🚀 ~ CheckoutPage ~ detailsOfProductsInCart:",
    detailsOfProductsInCart
  );
  // console.log("🚀 ~ CheckoutPage ~ store:", store);
  // console.log("🚀 ~ CheckoutPage ~ storeProducts:", storeProducts);
  // console.log("🚀 ~ CheckoutPage ~ storeProducts:ID", store?.id);

  // const storeId = Number(store[0].storeId);
  const storeStripeAccountId = store?.payments[0]?.stripeAccountId;
  console.log(
    "🚀 ~ CheckoutPage ~ storeStripeAccountId:",
    storeStripeAccountId
  );

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

  if (!storeProducts.length || !detailsOfProductsInCart.length || !store?.id)
    throw new Error("Store not found");

  const paymentIntent = processPaymentIntent({
    items: detailsOfProductsInCart,
    storeId: store?.id,
  });
  // console.log("🚀 ~ CheckoutPage ~ paymentIntent:IT", paymentIntent);

  // const test = await checkStripeAccount(storeStripeAccountId);
  // console.log("🚀 ~ test:", test);

  return (
    <CheckoutWrapper
      // detailsOfProductsInCart={detailsOfProductsInCart}
      storeStripeAccountId={storeStripeAccountId}
      paymentIntent={paymentIntent}
      // cartLineItems={
      //   <CartLineItems
      //     variant="checkout"
      //     cartItems={cartItems}
      //     products={
      //       cartItemDetails?.filter((item) => item.storeId === store?.id) ?? []
      //     }
      //   />
      // }
    />
  );
}
