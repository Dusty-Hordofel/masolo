"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RegisterFormData, RegisterSchema } from "@/schemas/user/auth";
import DynamicFormField from "../dynamic-form-field";
import { Loader2, Mail } from "lucide-react";
import SocialAuthButtons from "./social-auth-buttons";
import PasswordRequirements from "./password-requirements";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

function AuthRegisterForm({ className, ...props }: UserAuthFormProps) {
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

  const searchParams = useSearchParams();
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
          type="password"
          fieldProps={{
            disabled: false,
          }}
          showError={false}
        >
          <button
            className={cn(
              "absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg  outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ",
              errors["password"]
                ? "text-destructive"
                : "text-muted-foreground/80"
            )}
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            aria-controls="password"
          >
            {isVisible ? (
              <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </DynamicFormField>
        <PasswordRequirements errors={errors} password={password} />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex gap-2 items-center justify-center w-full h-11"
        >
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            "Continuer"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <SocialAuthButtons
        isSubmitting={isSubmitting}
        loading={loading}
        toggleLoading={toggleLoading}
      />
    </div>
  );
}

export default AuthRegisterForm;
