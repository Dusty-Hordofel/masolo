import { cn } from "@/lib/utils";
import { type PropsWithChildren } from "react";

export const ContentWrapper = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={cn(`max-w-[1400px] m-auto p-6`, className)}>{children}</div>
  );
};

// import { cn } from "@/lib/utils";
// import React, { type PropsWithChildren } from "react";

// type ContentWrapperProps = PropsWithChildren<{
//   className?: string;
// }> &
//   React.HTMLAttributes<HTMLDivElement>;

// export const ContentWrapper = React.memo(
//   ({ children, className = "", ...rest }: ContentWrapperProps) => {
//     return (
//       <div className={cn("max-w-[1400px] m-auto p-6", className)} {...rest}>
//         {children}
//       </div>
//     );
//   }
// );

// ContentWrapper.displayName = "ContentWrapper";
