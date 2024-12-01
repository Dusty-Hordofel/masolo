import React from "react";
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
  inputType: "select" | "input" | "textarea" | "file";
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
}: DynamicFormFieldProps) => {
  const error = errors[name];
  const errorMessage = error ? (error.message as string) : "";

  switch (inputType) {
    case "textarea":
      return (
        <div className=" w-full">
          <label className="sr-only" htmlFor={`input-${label}`}>
            {label}
          </label>
          <Textarea
            id={`input-${label}`}
            {...register(name)}
            {...(fieldProps as TextareaProps)}
            rows={lines}
          />
          <ErrorMessage type="text" error={error} errorMessage={errorMessage} />
        </div>
      );

    case "select":
      return (
        <div className="flex flex-col">
          <div
            className={cn(
              "w-full py-4 pr-4 pl-3 rounded-lg border-default border focus:outline-none transition-all flex justify-between relative ",
              error ? "text-red-600" : "text-black-200"
            )}
          >
            <label className="sr-only" htmlFor={`select-${label}`}>
              {label}
            </label>
            <select
              {...register(name)}
              id={`select-${label}`}
              name={name}
              {...(fieldProps as SelectProps)}
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

          <ErrorMessage type="text" error={error} errorMessage={errorMessage} />
        </div>
      );

    case "input":
    default:
      return (
        <div className=" w-full">
          <label className="sr-only" htmlFor={`input-${label}`}>
            {label}
          </label>
          <Input
            id={`input-${label}`}
            type={type}
            {...register(name, {
              ...(type === "number" && { valueAsNumber: true }),
            })}
            {...(fieldProps as InputProps)}
            defaultValue={type === "number" ? 0 : ""}
          />

          <ErrorMessage type="text" error={error} errorMessage={errorMessage} />
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
    <div className="h-6">
      {error && type !== "checkbox" && (
        <p className="px-4 pt-[6px] text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};
