import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordToggleButtonProps = {
  isVisible: boolean;
  toggleVisibility: () => void;
  hasError?: boolean;
};

const PasswordToggleButton = ({
  isVisible,
  toggleVisibility,
  hasError = false,
}: PasswordToggleButtonProps) => {
  return (
    <button
      className={cn(
        "absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        hasError ? "text-destructive" : "text-muted-foreground/80"
      )}
      type="button"
      onClick={toggleVisibility}
      aria-label={isVisible ? "Hide password" : "Show password"}
      aria-pressed={isVisible}
      aria-controls="password"
    >
      {isVisible ? (
        <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Eye size={16} strokeWidth={2} aria-hidden="true" />
      )}
    </button>
  );
};

export default PasswordToggleButton;
