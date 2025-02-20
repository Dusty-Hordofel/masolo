import AuthFooter from "@/components/forms/auth/auth-footer";
import AuthHeader from "@/components/forms/auth/auth-header";
import AuthLoginForm from "@/components/forms/auth/auth-login-form";

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
};

export default function LoginPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="hidden h-full bg-muted lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto px-9 flex w-full flex-col justify-center space-y-6 max-w-[480px]">
          <AuthHeader
            title="Enter your email to join us or sign in."
            // description=""
          />
          <AuthLoginForm />
          <AuthFooter type="register" />
        </div>
      </div>
    </div>
  );
}
