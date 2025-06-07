"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { routes } from "@/app/data/routes";

const CartNavigationButton = ({
  numberOfCartItems,
}: {
  numberOfCartItems: number | undefined;
}) => {
  const router = useRouter();

  return (
    <Button
      className="w-full"
      onClick={() => {
        router.push(
          numberOfCartItems && numberOfCartItems > 0
            ? routes.cart
            : routes.products
        );
      }}
    >
      {numberOfCartItems && numberOfCartItems > 0
        ? "View full cart"
        : "Start shopping"}
    </Button>
  );
};

export default CartNavigationButton;
