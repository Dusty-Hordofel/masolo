"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { handleInputQuantity } from "@/lib/utils";
import { toast } from "@/hooks/use-toast.hook";
import {
  getCartTest,
  updateCartItemQuantity,
} from "@/server-actions/add-to-cart";
import { CartItem } from "@/@types/cart/cart.item.interface";
// import { CartItem } from "@prisma/client";

const EditCartLineItem = ({
  productInCart,
  product,
}: {
  productInCart: CartItem | undefined;
  product: getCartTest;
}) => {
  // const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(productInCart?.qty ?? 1);

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Edit</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit {product.name}</AlertDialogTitle>
            <AlertDialogDescription>
              Change the quantity or remove this item from your cart.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mb-6">
            <Label className="my-2 block">Quantity</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              onBlur={(e) => handleInputQuantity(e, setQuantity, 0)}
            />
          </div>
          <AlertDialogFooter className="flex items-center justify-between">
            <Button
              variant="destructiveOutline"
              className="mr-auto"
              onClick={async () => {
                // setIsOpen((prev) => !prev);
                if (productInCart) {
                  // void updateCart({
                  //   ...productInCart,
                  //   qty: 0,
                  // });
                  // updateCart({},{})
                  // console.log("KATI", quantity);
                  // const yoyo = await updateCartItemQuantity(
                  //   product.id,
                  //   Number(quantity)
                  // );
                  // console.log("🚀 ~ onClick={ ~ yoyo:", yoyo);
                  // toast({
                  //   title: "Cart updated",
                  //   description: `${product.name} has been removed from your cart.`,
                  // });
                }
              }}
            >
              Remove from cart
            </Button>
            <AlertDialogCancel
            // onClick={() => setIsOpen((prev) => !prev)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={!productInCart}
              onClick={() => {
                // setIsOpen((prev) => !prev);
                if (productInCart) {
                  console.log("KATI", quantity);
                  // void updateCartItemQuantity(product.id, Number(quantity));

                  toast({
                    title: "Cart updated",
                    description: `${product.name} has been updated in your cart.`,
                  });
                }
              }}
            >
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditCartLineItem;
