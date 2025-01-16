import { cn } from "@/lib/utils";
import { type PropsWithChildren } from "react";

const headingStyles = {
  h1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "text-3xl font-semibold tracking-tight transition-colors",
  h3: "text-2xl font-semibold tracking-tight",
  h4: "text-xl font-semibold tracking-tight",
};

export const Heading = ({
  children,
  size,
  className,
}: PropsWithChildren<{
  size: "h1" | "h2" | "h3" | "h4";
  className?: string;
}>) => {
  const Tag = size;
  return <Tag className={cn(headingStyles[size], className)}>{children}</Tag>;
};


