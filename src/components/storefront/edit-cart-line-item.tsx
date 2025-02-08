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
  updateCart,
  updateCartItemQuantity,
} from "@/server-actions/add-to-cart";

const EditCartLineItem = ({ productInCart, product }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState<string | number>(
    productInCart?.qty ?? 1
  );
  console.log("🚀 ~ EditCartLineItem ~ quantity:", quantity);
  console.log(
    "🚀 ~ EditCartLineItem ~ productInCart:PROD IN CART",
    productInCart
  );
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
              onChange={(e) => setQuantity(e.target.value)}
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

                  const yoyo = await updateCartItemQuantity({
                    id: product.id,
                    qty: Number(quantity),
                  });
                  console.log("🚀 ~ onClick={ ~ yoyo:", yoyo);

                  // toast({
                  //   title: "Cart updated",
                  //   description: `${product.name} has been removed from your cart.`,
                  // });
                }
              }}
            >
              Remove from cart
            </Button>
            <AlertDialogCancel onClick={() => setIsOpen((prev) => !prev)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={!productInCart}
              onClick={() => {
                setIsOpen((prev) => !prev);
                if (productInCart) {
                  //   void updateCartItemQuantity({
                  //     id: product.id,
                  //     qty: Number(quantity),
                  //   });
                  //   void updateCart({
                  //     ...props.productInCart,
                  //     qty: Number(quantity),
                  //   });
                  void updateCartItemQuantity({
                    id: product.id,
                    qty: Number(quantity),
                  });

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
