"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useProductCartActions } from "@/hooks/useProductCartActions";

interface AddToCartResult {
  success: boolean;
  title: string;
  description: string;
}

interface ProductCartActionsProps {
  addToCartAction: (data: {
    id: string;
    qty: number;
    productId: string;
  }) => Promise<AddToCartResult | undefined>;
  availableInventory: number;
  isPreOrderAvailable?: boolean;
  productId: string;
  productName: string;
  disableQuantitySelector?: boolean;
  buttonSize?: "default" | "sm";
}

export const ProductCartActions: React.FC<ProductCartActionsProps> = ({
  addToCartAction,
  availableInventory,
  productId,
  productName,
  disableQuantitySelector,
  buttonSize = "default",
}) => {
  const {
    quantity,
    setQuantity,
    handleAddToCart,
    isPending,
    error,
    localStock,
  } = useProductCartActions({
    addToCartAction,
    productId,
    productName,
    availableInventory,
  });

  return (
    <div className="flex items-end gap-4 w-full">
      {!disableQuantitySelector && (
        <div className="flex flex-col gap-1 items-start">
          <Label htmlFor="quantity">Quantité</Label>
          <Input
            id="quantity"
            aria-label="Quantité à ajouter au panier"
            type="number"
            min={1}
            max={localStock}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-24"
            disabled={localStock === 0}
          />
          {/* <span className="text-xs text-gray-500">
            Stock restant : {localStock}
          </span> */}
          {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
      )}
      <Button
        size={buttonSize}
        className="w-full"
        onClick={handleAddToCart}
        disabled={isPending || !!error || localStock === 0}
        aria-disabled={isPending || !!error || localStock === 0}
        aria-busy={isPending}
      >
        {localStock === 0
          ? "Rupture de stock"
          : isPending
          ? "Ajout en cours..."
          : "Ajouter au panier"}
      </Button>
    </div>
  );
};
