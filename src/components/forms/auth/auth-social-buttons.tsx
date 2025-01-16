import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type AuthSocialButtonsProps = {
  toggleLoading: (key: "general" | "google" | "github", value: boolean) => void;
  loading: {
    general: boolean;
    google: boolean;
    github: boolean;
  };
  isSubmitting: boolean;
};

const AUTH_PROVIDERS = [
  {
    id: "google",
    label: "Google",
    icon: FcGoogle,
    ariaLabel: "Sign in with Google",
  },
  {
    id: "github",
    label: "GitHub",
    icon: FaGithub,
    ariaLabel: "Sign in with GitHub",
  },
];

const AuthSocialButtons = ({
  toggleLoading,
  loading,
  isSubmitting,
}: AuthSocialButtonsProps) => {
  const handleSignIn = (provider: string) => {
    toggleLoading(provider as "google" | "github", true);
    signIn(provider, {
      callbackUrl: `${window.location.origin}`,
    });
  };

  return (
    <div className="flex space-x-4 justify-center">
      {AUTH_PROVIDERS.map(({ id, label, icon: Icon, ariaLabel }) => (
        <Button
          key={id}
          type="button"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 text-black flex items-center justify-center"
          )}
          onClick={() => handleSignIn(id)}
          disabled={isSubmitting || loading[id as keyof typeof loading]}
          aria-label={ariaLabel}
        >
          {loading[id as keyof typeof loading] ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icon className="mr-2 h-4 w-4" />
          )}
          {label}
        </Button>
      ))}
    </div>
  );
};

export default AuthSocialButtons;
