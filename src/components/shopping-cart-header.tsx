"use server";
import { ShoppingCart } from "lucide-react";
import { cookies } from "next/headers";
import { getCart, getCartTest } from "@/server-actions/add-to-cart";
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
import { Heading } from "./ui/heading";
import { EmptyState } from "./ui/empty-state";
import { CartLineItems } from "./storefront/cart-line-items";
import CartNavigationButton from "./cart-navigation-button";

const getCartData = async () => {
  const cartId = cookies().get("cartId")?.value;
  if (!cartId)
    return { cartItems: [], uniqueStoreIds: [], cartItemDetails: [] };

  const { cartItems, uniqueStoreIds, cartItemDetails } = await getCart(cartId);

  const numberOfCartItems = cartItems.reduce(
    (acc, item) => acc + Number(item.qty),
    0
  );

  return { cartItems, uniqueStoreIds, cartItemDetails, numberOfCartItems };
};

export const ShoppingCartHeader = async () => {
  const { cartItems, uniqueStoreIds, cartItemDetails, numberOfCartItems } =
    await getCartData();

  return (
    <Sheet>
      <SheetTrigger>
        <CartIconBadge numberOfCartItems={numberOfCartItems} />
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
            <CartContent
              uniqueStoreIds={uniqueStoreIds}
              cartItems={cartItems}
              cartItemDetails={cartItemDetails}
            />
          ) : (
            <EmptyState height="h-[150px]">
              <Heading size="h4">Your cart is empty</Heading>
            </EmptyState>
          )}
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <CartNavigationButton numberOfCartItems={numberOfCartItems} />
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export const CartIconBadge = ({
  numberOfCartItems,
}: {
  numberOfCartItems: number | undefined;
}) => (
  <div className="relative">
    <ShoppingCart size={26} />
    {numberOfCartItems && numberOfCartItems > 0 ? (
      <span className="bg-primary p-1 rounded-full aspect-square min-w-6 min-h-6 text-white flex items-center justify-center text-sm absolute -top-2 -right-3">
        {numberOfCartItems}
      </span>
    ) : null}
  </div>
);

export const CartContent = ({
  uniqueStoreIds,
  cartItems,
  cartItemDetails,
}: {
  uniqueStoreIds: string[];
  cartItems: { id: string; productId: string; qty: number; cartId: string }[];
  cartItemDetails: getCartTest[];
}) => (
  <div className="flex flex-col gap-6 mt-6">
    {uniqueStoreIds.map((storeId) => (
      <div key={storeId}>
        <Heading size="h4">
          {cartItemDetails.find((item) => item.storeId === storeId)?.name}
        </Heading>
        <CartLineItems
          variant="cart"
          cartItems={cartItems}
          products={
            cartItemDetails.filter((item) => item.storeId === storeId) ?? []
          }
        />
      </div>
    ))}
  </div>
);
