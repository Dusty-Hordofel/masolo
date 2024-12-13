import React, { ReactNode } from "react";
import {
  UseFormRegister,
  FieldErrors,
  Path,
  FieldValues,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Item } from "@/@types/admin/admin.item.interface";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

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
  previewUrl?: string;
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

  const baseStyles =
    "origin-left absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all";
  const focusStyles =
    "group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground";
  const placeholderStyles =
    "has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground";

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
                // onChange: (e) => {
                //   // Si un onChange est fourni dans fieldProps, appelez-le
                //   fieldProps?.onChange?.(e);

                //   // Appel du onChange de React Hook Form (comportement par défaut)
                //   register(name).onChange(e);
                // },
              })}
              {...(fieldProps as InputProps)}
              hasError={!!error}
              placeholder=""
              className="peer"
            />
            <div
              className={cn(
                // pointer-events-none
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

export default DynamicFormField;

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
