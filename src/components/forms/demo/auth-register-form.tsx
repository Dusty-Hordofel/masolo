"use client";
import React, { ReactNode, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import {
  useForm,
  FieldErrors,
  UseFormRegister,
  Path,
  FieldValues,
} from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Check, X, Loader2, Mail, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

// interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const RegisterSchema = z.object({
  lastName: z.string().min(2, "Required"),
  firstName: z.string().min(2, "Required"),
  email: z.string().email({
    message: "Required",
  }),
  password: z.string().superRefine((password, ctx) => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("At least 8 characters");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("At least 1 number");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("At least 1 lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("At least 1 uppercase letter");
    }

    if (errors.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: JSON.stringify(errors),
      });
    }
  }),
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;

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
    console.log("🚀 ~ handleRegisterSubmit ~ data:", data);
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

export interface Item {
  value: string;
  label: string;
  id: string;
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

interface DynamicFormFieldProps {
  inputType: "select" | "input" | "textarea" | "file" | "test";
  type?: "text" | "email" | "password" | "number";
  name: string;
  label?: string;
  disabled?: boolean;
  options?: Item[];
  previewUrl?: any;
  // previewUrl?: string;//revois le type
  className?: string;
  lines?: number;
  register: UseFormRegister<any>;
  errors: FieldErrors<FieldValues>;
  fieldProps?: InputProps | TextareaProps | SelectProps;
  showLabel?: boolean;
  showError?: boolean;
  children?: ReactNode;
}

const DynamicFormField = ({
  inputType,
  label,
  register,
  errors,
  name,
  className,
  lines,
  type,
  options,
  fieldProps,
  showLabel = false,
  children,
  showError = true,
}: DynamicFormFieldProps) => {
  const error = errors[name];
  const errorMessage = error ? (error.message as string) : "";

  // const baseStyles =
  //   "origin-left absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all";
  // const focusStyles =
  //   "group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground";
  // const placeholderStyles =
  //   "has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground";

  switch (inputType) {
    case "textarea":
      return (
        <div className="w-full">
          <label
            className={cn(!showLabel && "sr-only")}
            htmlFor={`input-${label}`}
          >
            <span
              className={cn(
                "inline-flex bg-background px-2",
                !!error && "text-destructive"
              )}
            >
              {label}
            </span>
          </label>

          <Textarea
            id={`input-${label}`}
            {...register(name)}
            {...(fieldProps as TextareaProps)}
            rows={lines}
            className={className}
          />
          {showError && (
            <ErrorMessage
              type="text"
              error={error}
              errorMessage={errorMessage}
            />
          )}
        </div>
      );

    case "select":
      return (
        <div className="w-full">
          <div
            className={cn(
              "py-4 pr-4 pl-3 rounded-lg border-default border focus:outline-none transition-all flex justify-between relative ",
              error ? "text-red-600" : "text-black-200"
            )}
          >
            <label
              htmlFor={`select-${label}`}
              className={cn(!showLabel && "sr-only")}
            >
              {label}
            </label>
            <select
              {...register(name)}
              id={`select-${label}`}
              name={name}
              {...(fieldProps as SelectProps)}
              className={className}
            >
              <option style={{ display: "none" }}>{label}</option>

              {options?.length &&
                options.map((option) => (
                  <option value={option.value} key={option.id}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>

          {showError && (
            <ErrorMessage
              type="text"
              error={error}
              errorMessage={errorMessage}
            />
          )}
        </div>
      );

    case "input":
    default:
      return (
        <div className="w-full">
          <div className="group relative">
            <label
              htmlFor={`input-${label}`}
              className={cn(!showLabel && "sr-only", "floating-label")}
            >
              <span
                className={cn(
                  "inline-flex bg-background px-2",
                  !!error && "text-destructive"
                )}
              >
                {label}
              </span>
            </label>
            <Input
              type={type}
              id={`input-${label}`}
              {...register(name, {
                ...(type === "number" && { valueAsNumber: true }),
              })}
              {...(fieldProps as InputProps)}
              hasError={!!error}
              placeholder=""
              className="peer"
            />
            <div
              className={cn(
                " absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50",
                !!error ? "text-destructive" : "text-muted-foreground/80 "
              )}
            >
              {children}
            </div>
          </div>
          {showError && (
            <ErrorMessage
              type="text"
              error={error}
              errorMessage={errorMessage}
            />
          )}
        </div>
      );
  }
};

interface ErrorMessageProps<T extends FieldValues> {
  error: FieldErrors<T>[Path<T>];
  type?: "text" | "email" | "password" | "number" | "checkbox" | "file";
  errorMessage: string;
}

const ErrorMessage = <T extends FieldValues>({
  type,
  error,
  errorMessage,
}: ErrorMessageProps<T>) => {
  return (
    <div className={cn(error ? "h-6" : "h-2")}>
      {error && type !== "checkbox" && (
        <p className="px-4 pt-[6px] text-xs text-destructive">{errorMessage}</p>
      )}
    </div>
  );
};

type SubmitButtonProps = {
  label: string;
  isSubmitting: boolean;
};

const SubmitButton = ({ label, isSubmitting }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="flex gap-2 items-center justify-center w-full h-11"
    >
      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : label}
    </Button>
  );
};

type PasswordToggleButtonProps = {
  isVisible: boolean;
  toggleVisibility: () => void;
  hasError?: boolean;
};

const PasswordToggleButton = ({
  isVisible,
  toggleVisibility,
  hasError = false,
}: PasswordToggleButtonProps) => {
  return (
    <button
      className={cn(
        "absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        hasError ? "text-destructive" : "text-muted-foreground/80"
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
  );
};

type AuthSocialButtonsProps = {
  toggleLoading: (key: "general" | "google" | "github", value: boolean) => void;
  loading: {
    general: boolean;
    google: boolean;
    github: boolean;
  };
  isSubmitting: boolean;
};

const AUTH_PROVIDERS = [
  {
    id: "google",
    label: "Google",
    icon: FcGoogle,
    ariaLabel: "Sign in with Google",
  },
  {
    id: "github",
    label: "GitHub",
    icon: FaGithub,
    ariaLabel: "Sign in with GitHub",
  },
];

const AuthSocialButtons = ({
  toggleLoading,
  loading,
  isSubmitting,
}: AuthSocialButtonsProps) => {
  const handleSignIn = (provider: string) => {
    toggleLoading(provider as "google" | "github", true);
    signIn(provider, {
      callbackUrl: `${window.location.origin}`,
    });
  };

  return (
    <div className="flex space-x-4 justify-center">
      {AUTH_PROVIDERS.map(({ id, label, icon: Icon, ariaLabel }) => (
        <Button
          key={id}
          type="button"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 text-black flex items-center justify-center"
          )}
          onClick={() => handleSignIn(id)}
          disabled={isSubmitting || loading[id as keyof typeof loading]}
          aria-label={ariaLabel}
        >
          {loading[id as keyof typeof loading] ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icon className="mr-2 h-4 w-4" />
          )}
          {label}
        </Button>
      ))}
    </div>
  );
};

interface PasswordRequirement {
  matchesRequirement: boolean;
  description: string;
}

const PasswordRequirements = ({
  errors,
  password,
}: {
  password: string;
  errors: FieldErrors<{
    password: string;
    email: string;
  }>;
}) => {
  const PASSWORD_REQUIREMENTS = [
    { regex: /.{8,}/, description: "At least 8 characters" },
    { regex: /[0-9]/, description: "At least 1 number" },
    { regex: /[a-z]/, description: "At least 1 lowercase letter" },
    { regex: /[A-Z]/, description: "At least 1 uppercase letter" },
  ];

  const checkPasswordStrength = (password: string): PasswordRequirement[] =>
    PASSWORD_REQUIREMENTS.map(({ regex, description }) => ({
      matchesRequirement: regex.test(password),
      description,
    }));

  const strength = checkPasswordStrength(password);

  return (
    <div className="mt-2">
      <ul
        className={cn("space-y-1.5 pl-4 grid grid-cols-2")}
        aria-label="Password requirements"
      >
        {strength.map((req, index) => {
          return (
            <li key={index} className="flex items-center gap-2">
              {req.matchesRequirement ? (
                <Check
                  size={16}
                  className="text-emerald-500"
                  aria-hidden="true"
                />
              ) : !req.matchesRequirement &&
                errors &&
                errors.password?.message?.includes(req.description) ? (
                <Check
                  size={16}
                  className="text-destructive"
                  aria-hidden="true"
                />
              ) : (
                <X
                  size={16}
                  className="text-muted-foreground/80"
                  aria-hidden="true"
                />
              )}
              <span
                className={`text-xs ${
                  req.matchesRequirement
                    ? "text-emerald-600"
                    : !req.matchesRequirement &&
                      errors &&
                      errors.password?.message?.includes(req.description)
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {req.description}
                <span className="sr-only">
                  {req.matchesRequirement
                    ? " - Requirement met"
                    : " - Requirement not met"}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const AuthDivider = () => {
  return (
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
  );
};
