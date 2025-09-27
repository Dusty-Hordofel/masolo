import MagicLink from "@/components/auth/magic-link";
import SignIn from "@/components/auth/sign-in";
import { Tabs } from "@/components/ui/tabs2";
import React from "react";

const SignInPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className=" w-full max-w-md">
        <Tabs
          tabs={[
            {
              title: "Sign In",
              value: "sign-in",
              content: <SignIn />,
            },
            {
              title: "Magic Link",
              value: "magic-link",
              content: <MagicLink />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default SignInPage;
