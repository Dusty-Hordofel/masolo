import { getCart } from "@/server-actions/add-to-cart";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import React from "react";
import { InfoCard } from "@/components/admin/info-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/app/data/routes";
import { AlertCircle } from "lucide-react";
import { hasConnectedStripeAccount } from "@/server-actions/stripe/account";

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

  const detailsOfProductsInCart = cartItems.map((item) => {
    const product = storeProducts.find((p) => p.id === item.productId);

    if (!product) return;

    return {
      id: item.id,
      price: product.price,
      qty: item.qty,
    };
  });
  // .filter(Boolean); // as CheckoutItem[];

  console.log(
    "🚀 ~ CheckoutPage ~ detailsOfProductsInCart:",
    detailsOfProductsInCart
  );

  console.log("🚀 ~ CheckoutPage ~ storeProducts:", storeProducts);
  console.log("🚀 ~ CheckoutPage ~ storeProducts:ID", store?.id);

  const storeStripeAccountId = store?.payments[0]?.stripeAccountId;
  if (
    !storeStripeAccountId ||
    !(await hasConnectedStripeAccount(store?.id, true))
  ) {
    console.log("first", await hasConnectedStripeAccount(store?.id, true));
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

  // const paymentIntent = createPaymentIntent({
  //   items: detailsOfProductsInCart,
  //   storeId,
  // });

  return <h1>OMOTUNDE</h1>;
};

export default CheckoutPage;
