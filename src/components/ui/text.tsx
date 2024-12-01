import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export const Text = ({
  children,
  appearance = "default",
  className,
}: PropsWithChildren<{
  appearance?: "default" | "secondary";
  className?: string;
}>) => {
  const appearanceStyles = {
    default: "text-base text-foreground", //we are not obliged to set the text-base, it is defined by default
    secondary: "text-base text-muted-foreground",
  };

  return (
    <p className={cn("leading-7", appearanceStyles[appearance], className)}>
      {children}
    </p>
  );
};
