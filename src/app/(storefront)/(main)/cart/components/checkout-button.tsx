"use client";

import { routes } from "@/app/data/routes";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast.hook";
import { getStoreById } from "@/server-actions/store";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const CheckoutButton = ({ storeId }: { storeId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <Button
      size="sm"
      className="ml-auto flex items-center gap-2 justify-center"
      onClick={() => {
        setIsLoading(true);
        getStoreById(storeId)
          .then((slug) => {
            router.push(`${routes.checkout}/${slug}`);
          })
          .catch(() => {
            toast({
              title: "Sorry, an error occurred.",
              description: "Something went wrong. Please try again later.",
            });
          })
          .finally(() => setIsLoading(false));
      }}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Lock size={16} />
      )}
      <p>Checkout</p>
    </Button>
  );
};
