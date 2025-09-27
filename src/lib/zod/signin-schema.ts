import { z } from "zod";

const TraditionalSignInSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" }),
  rememberMe: z.boolean().optional(),
});

const MagicLinkSignInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Must be a valid email"),
});

// export default signInSchema;

const SignInSchema = z.union([TraditionalSignInSchema, MagicLinkSignInSchema]);
export default SignInSchema;
