"use client";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { FieldErrors } from "react-hook-form";

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

export default PasswordRequirements;
