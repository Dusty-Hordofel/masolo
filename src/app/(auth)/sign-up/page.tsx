import { SignUp } from "@/components/auth/sign-up";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className=" w-full max-w-md">
        <SignUp />
      </div>
    </div>
  );
};

export default SignUpPage;
