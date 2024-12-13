import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
// import { AuthForm } from "@/components/forms/auth/auth-form";
import AuthFooter from "@/components/forms/auth/auth-footer";
import AuthHeader from "@/components/forms/auth/auth-header";
import AuthForm from "@/components/forms/auth/auth-register-form";
import { signIn } from "../../../auth";

// import { Icons } from "@/components/icons";
// import { UserAuthForm } from "@/components/user-auth-form";

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
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {/* <AuthHeader
            title="Create an account"
            description="Enter your details below to create your account"
          /> */}
          {/* <AuthForm /> */}
          <form
            // action={async (formData) => {
            //   "use server";
            //   await signIn("forwardemail", formData);
            // }}
            action={async (formData) => {
              "use server";
              await signIn("forwardemail", formData);
            }}
          >
            <input type="text" name="email" placeholder="Email" />
            <button type="submit">Signin with Forward Email</button>
          </form>
          {/* <AuthFooter type="register" /> */}
        </div>
      </div>
    </div>
  );
}
