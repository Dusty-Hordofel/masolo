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
import Meka from "./meka";

export default async function CheckoutPage({
  params,
}: {
  params: { storeSlug: string };
}) {
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
  return (
    <Meka
      storeStripeAccountId={storeStripeAccountId}
      paymentIntent={paymentIntent}
    />
  );
}
