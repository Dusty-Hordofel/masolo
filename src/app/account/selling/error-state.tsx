// components/error-state.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
  showBack?: boolean;
  backLabel?: string; // ex: "Retour au dashboard"
}

export default function ErrorState({
  title,
  description,
  onRetry,
  showBack = true,
  backLabel = "Retour",
}: ErrorStateProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h2 className="text-xl font-semibold text-red-600">{title}</h2>
      <p className="text-gray-500 mt-2">{description}</p>

      <div className="flex gap-4 mt-6">
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            Réessayer
          </Button>
        )}
        {showBack && (
          <Button onClick={() => router.push("/")} variant="outline">
            {backLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
