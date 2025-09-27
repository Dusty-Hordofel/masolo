import ForgetPasswordForm from "./forget-password-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8 flex flex-col items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
            alt="Brand Logo"
            className="h-12 w-auto mb-4"
          />
          <h1 className="text-3xl font-bold tracking-tight">RESET PASSWORD</h1>
        </div>

        <ForgetPasswordForm />

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
