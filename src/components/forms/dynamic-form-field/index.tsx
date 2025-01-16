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
  floatingLabel?: boolean;
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
  children,
  showError = true,
  showLabel = false,
  floatingLabel = false,
}: DynamicFormFieldProps) => {
  const error = errors[name];
  const errorMessage = error ? (error.message as string) : "";

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
              className={cn(
                showLabel &&
                  !floatingLabel &&
                  "inline-block mb-1 font-semibold",
                !showLabel && "sr-only",
                showLabel && floatingLabel && "floating-label"
              )}
            >
              <span
                className={cn(
                  "inline-flex bg-background",
                  showLabel && floatingLabel && "px-2",
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
