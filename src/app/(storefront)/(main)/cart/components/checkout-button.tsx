"use client";

import { routes } from "@/app/data/routes";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast.hook";
import { getStoreById } from "@/server-actions/store";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";

interface CheckoutButtonProps {
  storeId: string;
}

export const CheckoutButton = ({ storeId }: CheckoutButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCheckout = useCallback(() => {
    startTransition(async () => {
      try {
        const slug = await getStoreById(storeId);
        router.push(`${routes.checkout}/${slug}`);
      } catch (error) {
        toast({
          title: "Error",
          description: "Unable to retrieve the store. Please try again",
        });
      }
    });
  }, [storeId, router]);

  return (
    <Button
      size="sm"
      className="ml-auto flex items-center gap-2 justify-center"
      onClick={handleCheckout}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Lock size={16} />
      )}
      <span>Checkout</span>
    </Button>
  );
};
