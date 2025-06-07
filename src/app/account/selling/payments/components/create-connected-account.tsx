"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast.hook";

import { Loader2, Lock } from "lucide-react";
import { useTransition } from "react";

export const CreateConnectedAccount = ({
  createAccountLink,
}: {
  createAccountLink: (storeId: string) => Promise<string | null>;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleConnectWithStripe = () => {
    startTransition(async () => {
      try {
        const url = await createAccountLink(
          "b4d35aad-f0bd-41d7-827f-1c8a82bef234"
        );

        if (!url) {
          throw new Error("No URL returned from Stripe");
        }

        window.location.href = url;
      } catch (error) {
        console.error("Error occured creating Stripe connect account", error);
        toast({
          title: "Sorry, an error occurred",
          description:
            "An error occured creating your Stripe connect account. Please try again later.",
        });
        return;
      }
    });
  };

  return (
    <form>
      <Button
        disabled={isPending}
        size="sm"
        className="flex gap-2"
        onClick={handleConnectWithStripe}
      >
        {isPending ? <Loader2 className="animate-spin" /> : <Lock size={16} />}
        <span>Connect with Stripe</span>
      </Button>
    </form>
  );
};
