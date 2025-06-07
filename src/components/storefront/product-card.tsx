"use client";

import { StoreAndProduct } from "@/@types/admin/product";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/server-actions/add-to-cart";
import {
  useTransition,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast.hook";
import { ToastAction } from "@/components/ui/toast";
import { routes } from "@/app/data/routes";
import { cn, handleInputQuantity } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { currencyFormatter } from "@/lib/currency";
import { ProductImage } from "@/components/ui/product-image";

export const ProductCard = ({
  product,
  hideButtonActions,
}: {
  product: StoreAndProduct;
  hideButtonActions?: boolean;
}) => {
  return (
    <>
      {product.images && product.images.length > 0 && (
        <div>
          <Link href={`${routes.products}/${product.id}`}>
            <ProductImage
              src={product.images[0]?.secureUrl}
              alt={product.images[0]?.alt}
              height="h-48"
              width="w-full"
            />
          </Link>

          <ProductInformation
            productName={product.name}
            productPrice={product.price}
            productId={product.id}
          />

          {!hideButtonActions && (
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-4 mb-8">
              <ProductQuickViewButton productId={product.id} />
              <ProductCartActions
                addToCartAction={addToCart}
                availableInventory={product.inventory}
                isPreOrderAvailable={product.isPreOrderAvailable}
                productId={product.id}
                productName={product.name}
                disableQuantitySelector
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export const ProductInformation = ({
  productId,
  productName,
  productPrice,
}: {
  productId: string;
  productName: string;
  productPrice: number;
}) => {
  return (
    <Link href={`${routes.products}/${productId}`}>
      <Text className="line-clamp-1 w-full mt-2">{productName}</Text>
      <Text>{currencyFormatter(Number(productPrice))}</Text>
    </Link>
  );
};

export const ProductCartActions = (props: {
  addToCartAction: typeof addToCart;
  availableInventory: number;
  isPreOrderAvailable?: boolean;
  productId: string;
  productName: string;
  disableQuantitySelector?: boolean;
  buttonSize?: "default" | "sm";
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div
      className={cn(
        "flex items-end justify-start gap-4",
        props.disableQuantitySelector && "w-full"
      )}
    >
      {props.availableInventory &&
        Number(props.availableInventory) > 0 &&
        !props.disableQuantitySelector && (
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
        )}
      {/* {getActionButton(
        props.availableInventory,
        props.isPreOrderAvailable ?? false,
        { ...props, quantity }
      )} */}
    </div>
  );
};

// interface ActionButtonProps {
//   addToCartAction: (data: {
//     id: string;
//     qty: number;
//     productId: string;
//   }) => Promise<{
//     success: boolean;
//     title: string;
//     description: string;
//   }>;
//   id: string;
//   productId: string;
//   productName: string;
//   quantity: number;
// }

// const getActionButton = (
//   availableInventory: number | null,
//   isPreOrderAvailable: boolean,
//   props: ActionButtonProps
// ) => {
//   if (availableInventory && Number(availableInventory) > 0) {
//     return <AddToCartButton {...props} />;
//   } else if (isPreOrderAvailable) {
//     return <PreOrderButton {...props} />;
//   } else {
//     return <SoldOutButton />;
//   }
// };

interface AddToCartButtonProps {
  addToCartAction: (data: {
    id: string;
    qty: number;
    productId: string;
  }) => Promise<{
    success: boolean;
    title: string;
    description: string;
  }>;
  id: string;
  productId: string;
  productName: string;
  quantity: number;
}

export const AddToCartButton = ({
  addToCartAction,
  id,
  productId,
  productName,
  quantity,
}: AddToCartButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = useCallback(() => {
    startTransition(async () => {
      try {
        await addToCartAction({ id, productId, qty: quantity });

        toast({
          title: "Added to cart",
          description: `${quantity}x ${productName} has been added to your cart.`,
          action: (
            <Link href={routes.cart}>
              <ToastAction altText="View cart">View</ToastAction>
            </Link>
          ),
        });
      } catch (error) {
        console.log("🚀 ~ startTransition ~ error:", error);
        toast({
          title: "Error",
          description: "Failed to add product to cart. Please try again.",
          variant: "destructive",
        });
      }
    });
  }, [addToCartAction, productId, productName, quantity]);

  return (
    <Button
      size="default"
      className="w-full"
      onClick={handleAddToCart}
      disabled={isPending}
    >
      {isPending ? "Adding..." : "Add to Cart"}
    </Button>
  );
};

const QuantitySelector = ({
  quantity,
  setQuantity,
}: {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
}) => (
  <div className="flex flex-col gap-1 items-start">
    <Label htmlFor="quantity">Quantity</Label>
    <Input
      className="w-24"
      id="quantity"
      value={quantity}
      onChange={(e) =>
        setQuantity(isNaN(Number(e.target.value)) ? 1 : Number(e.target.value))
      }
      onBlur={(e) => handleInputQuantity(e, setQuantity)}
      type="number"
    />
  </div>
);

// const SoldOutButton = () => (
//   <Button variant="secondary" disabled={true} className="w-36">
//     Sold Out
//   </Button>
// );

// interface PreOrderButtonProps {
//   addToCartAction: (data: {
//     id: string;
//     qty: number;
//     productId: string;
//   }) => Promise<{
//     success: boolean;
//     title: string;
//     description: string;
//   }>;
//   id: string;
//   productId: string;
//   productName: string;
//   quantity: number;
// }

// const PreOrderButton = ({
//   addToCartAction,
//   id,
//   productId,
//   productName,
//   quantity,
// }: PreOrderButtonProps) => {
//   const [isPending, startTransition] = useTransition();

//   const handlePreOrder = async () => {
//     // const result =

//     await addToCartAction({
//       id,
//       productId,
//       qty: Number(quantity),
//     });

//     toast({
//       title: "Preorder placed",
//       description: `${quantity}x ${productName} has been preordered.`,
//       action: (
//         <Link href={routes.cart}>
//           <ToastAction altText="View cart">View</ToastAction>
//         </Link>
//       ),
//     });

//     // toast({
//     //   title: result.title, // Utilisez le title retourné de l'action
//     //   description: result.description, // Utilisez la description retournée
//     //   action: (
//     //     <Link href={routes.cart}>
//     //       <ToastAction altText="View cart">View</ToastAction>
//     //     </Link>
//     //   ),
//     // });
//   };
//   return (
//     <Button
//       disabled={isPending}
//       size="default"
//       className="w-36 bg-blue-500 hover:bg-blue-600 text-white"
//       onClick={() => {
//         startTransition(() => {
//           handlePreOrder(); // Appeler la fonction handlePreOrder séparée
//         });
//       }}
//       // onClick={() => {
//       //   startTransition(() =>
//       //     addToCartAction({
//       //       id: productId,
//       //       qty: Number(quantity),
//       //       // isPreOrder: true,
//       //     })
//       //   );
//       //   toast({
//       //     title: "Preorder placed",
//       //     description: `${quantity}x ${productName} has been preordered.`,
//       //     action: (
//       //       <Link href={routes.cart}>
//       //         <ToastAction altText="View cart">View</ToastAction>
//       //       </Link>
//       //     ),
//       //   });
//       // }}
//     >
//       Preorder
//     </Button>
//   );
// };

interface ProductQuickViewButtonProps {
  productId: string;
}

export const ProductQuickViewButton = ({
  productId,
}: ProductQuickViewButtonProps) => {
  return (
    <Link href={`${routes.productQuickView}/${productId}`} className="w-full">
      <Button variant="outline" size="sm" className="flex gap-2 w-full">
        <span>Quick View</span>
      </Button>
    </Link>
  );
};
