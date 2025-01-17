import { ShoppingCart } from "lucide-react";
import { cookies } from "next/headers";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
// import { getCart } from "@/server-actions/get-cart-details";
// import { CartLineItems } from "./storefront/cart-line-items";
// import { Heading } from "./ui/heading";
// import { Button } from "./ui/button";
// import { routes } from "@/lib/routes";
// import { SheetWrapper } from "./storefront/sheet-wrapper";
// import { EmptyStateWrapper } from "./ui/empty-state-wrapper";
import { Button } from "./button";
import { Heading } from "./heading";
import { SheetWrapper } from "../storefront/sheet-wrapper";
import { EmptyStateWrapper } from "./empty-state-wrapper";
import { routes } from "@/app/data/routes";

export const ShoppingCartHeader = async () => {
  // Récupération de l'ID du panier
  const cartId = cookies().get("cartId")?.value;
  // const cartIdNumber = cartId ? Number(cartId) : null;

  // Récupération des détails du panier
  // const {
  //   cartItems = [],
  //   uniqueStoreIds = [],
  //   cartItemDetails = [],
  // } = (await getCart(cartIdNumber)) || {};

  // Calcul du nombre total d'articles dans le panier
  // const numberOfCartItems = cartItems.reduce(
  //   (acc, item) => acc + Number(item.qty),
  //   0
  // );

  const numberOfCartItems = 0;

  // Rendu des lignes d'articles par magasin
  const renderCartLineItems = () => 2;
  // uniqueStoreIds.map((storeId) => {
  //   const storeName =
  //     cartItemDetails.find((item) => item.storeId === storeId)?.storeName ||
  //     "Unknown Store";

  //   const products =
  //     cartItemDetails.filter((item) => item.storeId === storeId) || [];

  //   return (
  //     <div key={storeId}>
  //       <Heading size="h4">{storeName}</Heading>
  //       <CartLineItems variant="cart" cartItems={cartItems} products={products} />
  //     </div>
  //   );
  // }

  // );

  // Déterminer l'action du bouton principal
  const buttonLabel =
    numberOfCartItems > 0 ? "View full cart" : "Start shopping";
  const buttonRoute = numberOfCartItems > 0 ? routes.cart : routes.products;

  return (
    <SheetWrapper
      trigger={
        <SheetTrigger
          className="flex items-center justify-center relative -left-2"
          aria-label="View Shopping Cart"
        >
          <ShoppingCart size={26} />
          {2}
          {numberOfCartItems > 0 && (
            <span
              className="bg-primary rounded-full w-6 h-6 text-white flex items-center justify-center text-sm absolute -top-2 -right-3"
              aria-live="polite"
            >
              {numberOfCartItems}
            </span>
          )}
        </SheetTrigger>
      }
      buttonRoute={buttonRoute}
      insideButton={<Button className="w-full">{buttonLabel}</Button>}
    >
      <SheetHeader>
        <SheetTitle>
          Cart
          {/* {numberOfCartItems > 0 ? `(${numberOfCartItems})` : ""} */}
        </SheetTitle>
        <SheetDescription className="border border-border bg-secondary p-2 rounded-md flex items-center justify-center text-center py-3">
          Free shipping on all orders over $50
        </SheetDescription>
      </SheetHeader>

      {numberOfCartItems > 0 ? (
        <div className="flex flex-col gap-6 mt-6">{renderCartLineItems()}</div>
      ) : (
        <EmptyStateWrapper height="h-[150px]">
          <Heading size="h4">Your cart is empty</Heading>
        </EmptyStateWrapper>
      )}
    </SheetWrapper>
  );
};
