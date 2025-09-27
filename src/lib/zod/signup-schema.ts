import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "The first name must contain at least 2 characters."),
    lastName: z
      .string()
      .min(2, "The last name must contain at least 2 characters."),
    email: z.string().email("The email is not valid."),
    password: z
      .string()
      .min(8, "The password must contain at least 8 characters.")
      .regex(
        /[A-Z]/,
        "The password must contain at least one uppercase letter."
      )
      .regex(
        /[a-z]/,
        "The password must contain at least one lowercase letter."
      )
      .regex(/[0-9]/, "The password must contain at least one number.")
      .regex(
        /[\W_]/,
        "The password must contain at least one special character."
      ),
    confirmPassword: z.string().min(8, "Password confirmation is required"),
    // image: z.instanceof(File).optional().nullable()
    image: z
      .instanceof(File)
      .optional()
      .nullable()
      .refine((file) => !file || file.size < 5 * 1024 * 1024, {
        message: "The image must be less than 5 MB.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });
