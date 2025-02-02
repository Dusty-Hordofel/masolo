"use client";

import { useState } from "react";
// import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
// import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
import { RegisterFormData, RegisterSchema } from "@/schemas/user/auth";
import DynamicFormField from "../dynamic-form-field";
import { Mail } from "lucide-react";
import AuthSocialButtons from "./auth-social-buttons";
import PasswordRequirements from "./password-requirements";
import AuthDivider from "./auth-divider";
import SubmitButton from "./submit-button";
import PasswordToggleButton from "./password-toggle-button";

// interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

function AuthRegisterForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
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

  const password = watch("password", "");

  async function handleRegisterSubmit(data: RegisterFormData) {
    console.log("🚀 ~ AuthForm ~ data:", data);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(handleRegisterSubmit)} className="space-y-4">
        <div className="flex gap-x-2">
          <DynamicFormField
            inputType="input"
            showLabel
            label="FirstName"
            name="firstName"
            register={register}
            errors={errors}
            type="text"
            fieldProps={{
              disabled: false,
            }}
            className="w-full"
          />

          <DynamicFormField
            inputType="input"
            showLabel
            label="LastName"
            name="lastName"
            register={register}
            errors={errors}
            type="text"
            fieldProps={{
              disabled: false,
            }}
          />
        </div>

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
          <Mail size={16} strokeWidth={2} aria-hidden="true" />
        </DynamicFormField>

        <DynamicFormField
          inputType="input"
          showLabel
          label="Password"
          name="password"
          register={register}
          errors={errors}
          type={isVisible ? "text" : "password"}
          fieldProps={{
            disabled: false,
          }}
          showError={false}
        >
          <PasswordToggleButton
            isVisible={isVisible}
            toggleVisibility={toggleVisibility}
            hasError={!!errors["password"]}
          />
        </DynamicFormField>

        <PasswordRequirements errors={errors} password={password} />
        <SubmitButton label="Continuer" isSubmitting={isSubmitting} />
      </form>

      <AuthDivider />
      <AuthSocialButtons
        isSubmitting={isSubmitting}
        loading={loading}
        toggleLoading={toggleLoading}
      />
    </div>
  );
}

export default AuthRegisterForm;
