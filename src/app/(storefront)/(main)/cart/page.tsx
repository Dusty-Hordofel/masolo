import { routes } from "@/app/data/routes";
import { CartLineItems } from "@/components/storefrontc/cart-line-items";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { currencyFormatter } from "@/lib/currency";
import { getCart } from "@/server-actions/add-to-cart";
import { ChevronRight } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";
import { CheckoutButton } from "./components/checkout-button";

const CartPage = async () => {
  const cartId = cookies().get("cartId")?.value;
  const { cartItems, uniqueStoreIds, cartItemDetails } = await getCart(
    String(cartId)
  );
  // console.log("🚀 ~ CartPage ~ cartItems:", cartItems);
  // console.log("🚀 ~ CartPage ~ cartItemDetails:", cartItemDetails);

  // const lolo = cartItemDetails.filter(
  //   (item) => item.storeId === "b4d35aad-f0bd-41d7-827f-1c8a82bef234"
  // );
  // const cartQuantity = lolo.reduce((accum, curr) => {
  //   const quantityInCart = cartItems.find(
  //     (item) => item.productId === curr.id
  //   )?.qty;
  //   console.log("🚀 ~ cartQuantity ~ quantityInCart:", quantityInCart);

  //   return accum + Number(curr.price) * (quantityInCart ?? 0);
  // }, 0);
  // console.log("🚀 ~ cartQuantity ~ cartQuantity:", cartQuantity);
  // console.log("🚀 ~ CartPage ~ lolo:", lolo);

  if (!String(cartId) || !cartItems.length) {
    return (
      <div className="mt-4 gap-4 rounded-md border-2 border-dashed border-gray-200 p-6 text-center h-[200px] flex items-center justify-center flex-col">
        <Heading size="h3">Your cart is empty</Heading>
        <Link href={routes.products}>
          <Button>Start shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Heading size="h2">Cart</Heading>
        <Link href={routes.products}>
          <Button
            variant="link"
            className="flex items-end justify-center m-0 p-0 text-muted-foreground"
          >
            <p>Continue shopping</p>
            <ChevronRight size={16} />
          </Button>
        </Link>
      </div>
      <div className="lg:grid lg:grid-cols-9 lg:gap-6 flex flex-col-reverse gap-6">
        <div className="col-span-6 flex flex-col gap-8">
          {uniqueStoreIds.map((storeId, i) => (
            <div
              key={i}
              className="bg-secondary border border-border p-6 rounded-md"
            >
              <Heading size="h4">
                {
                  cartItemDetails?.find((item) => item.storeId === storeId)
                    ?.name
                }
              </Heading>
              <CartLineItems
                variant="cart"
                cartItems={cartItems}
                products={
                  cartItemDetails?.filter((item) => item.storeId === storeId) ??
                  []
                }
              />
            </div>
          ))}
        </div>
        <div className="bg-secondary col-span-3 rounded-md border border-border p-6 h-fit flex flex-col gap-4">
          <Heading size="h3">Cart Summary</Heading>
          {uniqueStoreIds.map((storeId, i) => (
            <div
              key={i}
              className="flex items-center border-b border-border pb-2 gap-4 flex-nowrap overflow-auto"
            >
              <p className="font-semibold">
                {
                  cartItemDetails?.find((item) => item.storeId === storeId)
                    ?.name
                }
              </p>
              <p>
                {currencyFormatter(
                  cartItemDetails
                    .filter((item) => item.storeId === storeId)
                    .reduce((accum, curr) => {
                      const quantityInCart = cartItems.find(
                        (item) => item.productId === curr.id
                      )?.qty;
                      return accum + Number(curr.price) * (quantityInCart ?? 0);
                    }, 0)
                )}
              </p>
              <CheckoutButton storeId={storeId} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
