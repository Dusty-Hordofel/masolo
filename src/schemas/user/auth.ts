import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const LookupSchema = LoginSchema.pick({ email: true });

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

export const AuthSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
export type LookupFormData = z.infer<typeof LookupSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type AuthFormData = z.infer<typeof AuthSchema>;
