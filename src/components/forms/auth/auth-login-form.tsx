"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import { cn } from "@/lib/utils";
import { LoginFormData, LoginSchema } from "@/schemas/user/auth";
import DynamicFormField from "../dynamic-form-field";
import { Mail } from "lucide-react";
import AuthSocialButtons from "./auth-social-buttons";
import { useForm } from "react-hook-form";
import AuthDivider from "./auth-divider";
import PasswordToggleButton from "./password-toggle-button";
import SubmitButton from "./submit-button";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

function AuthLoginForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState({
    general: false,
    google: false,
    github: false,
  });

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const toggleLoading = (key: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  console.log(process.env.GOOGLE_CLIENT_SECRET);
  console.log(process.env.GOOGLE_CLIENT_SECRET);

  async function handleRegisterSubmit(data: LoginFormData) {
    console.log("🚀 ~ AuthForm ~ data:", data);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {/* <form onSubmit={handleSubmit(handleRegisterSubmit)} className="space-y-4">
        <DynamicFormField
          inputType="input"
          showLabel
          label="Email"
          name="email"
          register={register}
          errors={errors}
          type="email"
          fieldProps={{
            disabled: false,
          }}
        >
          <Mail
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="absolute top-10 right-3"
          />
        </DynamicFormField>

        <DynamicFormField
          inputType="input"
          showLabel
          label="Password"
          name="password"
          register={register}
          errors={errors}
          type="password"
          fieldProps={{
            disabled: false,
          }}
        >
          <PasswordToggleButton
            isVisible={isVisible}
            toggleVisibility={toggleVisibility}
            hasError={!!errors["password"]}
          />
        </DynamicFormField>

        <SubmitButton label="Continuer" isSubmitting={isSubmitting} />
      </form> */}

      {/* <AuthDivider /> */}
      <AuthSocialButtons
        isSubmitting={isSubmitting}
        loading={loading}
        toggleLoading={toggleLoading}
      />
    </div>
  );
}

export default AuthLoginForm;
