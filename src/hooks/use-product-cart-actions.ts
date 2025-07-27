import { useState, useCallback, useTransition } from "react";
import { toast } from "@/hooks/use-toast.hook";

interface AddToCartResult {
  success: boolean;
  title: string;
  description: string;
}

interface UseProductCartActionsProps {
  addToCartAction: (data: {
    id: string;
    qty: number;
    productId: string;
  }) => Promise<AddToCartResult | undefined>;
  productId: string;
  productName: string;
  availableInventory: number;
}

export function useProductCartActions({
  addToCartAction,
  productId,
  productName,
  availableInventory,
}: UseProductCartActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Stock local pour l'optimistic UI
  const [localStock, setLocalStock] = useState<number>(availableInventory);

  const handleQuantityChange = (value: number) => {
    if (value < 1) {
      setQuantity(1);
      setError("Minimum 1 article.");
    } else if (value > localStock) {
      setQuantity(localStock);
      setError(`Stock limité à ${localStock}.`);
    } else {
      setQuantity(value);
      setError(null);
    }
  };

  const handleAddToCart = useCallback(() => {
    if (quantity < 1 || quantity > localStock) {
      setError("Quantité invalide.");
      return;
    }
    setError(null);
    // Optimistic UI : on met à jour le stock local immédiatement
    setLocalStock((prev) => prev - quantity);
    startTransition(async () => {
      try {
        await addToCartAction({ id: productId, productId, qty: quantity });
        toast({
          title: "Ajouté au panier",
          description: `${quantity}x ${productName} ajouté au panier.`,
        });
      } catch {
        // En cas d'échec, on restaure le stock local
        setLocalStock((prev) => prev + quantity);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter au panier",
          variant: "destructive",
        });
      }
    });
  }, [quantity, addToCartAction, productId, productName, localStock]);

  // Synchronise le stock local si le stock serveur change (ex: navigation, revalidation)
  // Peut être amélioré avec un effet si availableInventory change

  return {
    quantity,
    setQuantity: handleQuantityChange,
    handleAddToCart,
    isPending,
    error,
    localStock,
  };
}
