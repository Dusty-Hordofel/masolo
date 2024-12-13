import Link from "next/link";
import React from "react";

type UserAuthFooterProps = {
  type: "login" | "register";
};

const AuthFooter = ({ type }: UserAuthFooterProps) => {
  return (
    <>
      {type === "login" ? (
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      ) : (
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:text-brand underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-brand underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      )}
    </>
  );
};

export default AuthFooter;
