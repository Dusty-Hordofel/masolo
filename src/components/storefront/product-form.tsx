"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

export const ProductForm = (props: {
  // addToCartAction: typeof addToCart;
  // availableInventory: number | null;
  // productId: string;
  // productName: string | null;
  // disableQuantitySelector?: boolean;
  // buttonSize?: "default" | "sm";
}) => {
  const [quantity, setQuantity] = useState<string | number>(1);
  // let [isPending, startTransition] = useTransition();

  return (
    <div className="">
      <Button>Add to Cart</Button>
    </div>
  );
};
