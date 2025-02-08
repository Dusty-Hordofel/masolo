"use server";
import { ShoppingCart } from "lucide-react";
import { cookies } from "next/headers";
import { getCart } from "@/server-actions/add-to-cart";
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Heading } from "./ui/heading";
import { EmptyState } from "./ui/empty-state";
import { CartLineItems } from "./storefront/cart-line-items";

export const ShoppingCartHeader = async () => {
  const cartId = cookies().get("cartId")?.value;
  console.log("🚀 ~ ShoppingCartHeader ~ cartId:", cartId);

  const { cartItems, uniqueStoreIds, cartItemDetails } = await getCart(
    String(cartId)
  );

  const numberOfCartItems =
    !!cartItems &&
    cartItems.reduce((acc, item) => (acc += Number(item.qty)), 0);

  return (
    <Sheet>
      <SheetTrigger>
        <div className="relative">
          <ShoppingCart size={26} />
          {numberOfCartItems && numberOfCartItems > 0 ? (
            <span className="bg-primary p-1 rounded-full aspect-square min-w-6 min-h-6 text-white flex items-center justify-center text-sm absolute -top-2 -right-3">
              {numberOfCartItems}
            </span>
          ) : null}
        </div>
      </SheetTrigger>
      <SheetContent className="overflow-auto lg:max-w-[600px] sm:max-w-[400px] xl:max-w-[650px]">
        <SheetHeader>
          <SheetTitle>
            Cart{" "}
            {numberOfCartItems && numberOfCartItems > 0
              ? `(${numberOfCartItems})`
              : ""}
          </SheetTitle>
          <SheetDescription className="border border-border bg-secondary p-2 rounded-md flex items-center justify-center text-center py-3">
            Free shipping on all orders over $50
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          {numberOfCartItems && numberOfCartItems > 0 ? (
            <div className="flex flex-col gap-6 mt-6">
              {uniqueStoreIds.map((storeId) => (
                <div key={storeId}>
                  <Heading size="h4">
                    {
                      cartItemDetails.find((item) => item.storeId === storeId)
                        ?.name
                    }
                  </Heading>
                  <CartLineItems
                    variant="cart"
                    cartItems={cartItems}
                    products={
                      cartItemDetails?.filter(
                        (item) => item.storeId === storeId
                      ) ?? []
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState height="h-[150px]">
              <Heading size="h4">Your cart is empty</Heading>
            </EmptyState>
          )}
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button className="w-full">
              {numberOfCartItems && numberOfCartItems > 0
                ? "View full cart"
                : "Start shopping"}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
