import AuthFooter from "@/components/forms/auth/auth-footer";
import AuthHeader from "@/components/forms/auth/auth-header";
import { signIn } from "../../../auth";
import AuthRegisterForm from "@/components/forms/auth/auth-register-form";

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
};

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Login
      </Link> */}
      <div className="hidden h-full bg-muted lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto px-9 flex w-full flex-col justify-center space-y-6 max-w-[480px]">
          <AuthHeader
            title="Your journey begins here - Register."
            description=""
          />
          <AuthRegisterForm />
          <AuthFooter type="register" />
        </div>
      </div>
    </div>
  );
}
