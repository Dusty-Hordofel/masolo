import { getCart } from "@/server-actions/add-to-cart";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import React from "react";
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
import CheckoutClient from "../components/checkout-client";

const CheckoutPage = async ({ params }: { params: { storeSlug: string } }) => {
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
  console.log("🚀 ~ CheckoutPage ~ store:", store);
  console.log("🚀 ~ CheckoutPage ~ storeProducts:", storeProducts);
  console.log("🚀 ~ CheckoutPage ~ storeProducts:ID", store?.id);

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

  const paymentIntent = await processPaymentIntent({
    items: detailsOfProductsInCart,
    storeId: store?.id,
  });
  console.log("🚀 ~ CheckoutPage ~ paymentIntent:IT", paymentIntent);

  return (
    <>
      <Heading size="h2">Checkout</Heading>
      <div className="text-muted-foreground flex items-center justify-start gap-1">
        <Link href={routes.cart}>
          <Button variant="link" className="p-0 text-muted-foreground">
            Cart
          </Button>
        </Link>
        <ChevronRight size={16} />
        <Button
          variant="link"
          className="p-0 text-muted-foreground hover:no-underline hover:cursor-auto"
        >
          Checkout
        </Button>
      </div>
      {paymentIntent?.clientSecret && (
        <div>
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 mt-4 flex flex-col-reverse gap-6">
            <div className="col-span-7">
              <CheckoutClient
                clientSecret={paymentIntent?.clientSecret as string}
              />
            </div>
            <div className="col-span-5">
              <div className="bg-secondary rounded-lg lg:p-6 h-fit border-border border p-1 px-4 lg:mb-8">
                <div className="hidden lg:flex flex-col gap-2">
                  <Heading size="h4">Order Summary</Heading>
                </div>
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
};

export default CheckoutPage;

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
