"use server ";

import { ErrorCode } from "@/constants/error-codes";
import { sendVerificationEmail } from "@/lib/mail";
import prismadb from "@/lib/prismadb";
import { generateEmailVerificationToken } from "@/lib/tokens";
import { RegisterFormData, RegisterSchema } from "@/schemas/user/auth";
import { getUserByEmail } from "@/services/prisma/user.service";
import bcrypt from "bcrypt";

export const register = async (registerData: RegisterFormData) => {
  const validatedFields = RegisterSchema.safeParse(registerData);

  if (!validatedFields.success) {
    return {
      success: false,
      heading: "Validation Error",
      description: "Invalid fields!",
      type: "error",
      code: ErrorCode.INVALID_FIELDS,
    };
  }

  const { email, lastName, firstName, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      success: false,
      heading: "Duplicate Email",
      description: "Email already in use!",
      type: "error",
      code: ErrorCode.USER_EMAIL_EXISTS,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prismadb.user.create({
    data: {
      name: lastName + " " + firstName,
      email,
      password: hashedPassword,
    },
  });
  console.log("🚀 ~ register ~ newUser:", newUser);

  const verificationToken = await generateEmailVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success: true,
    heading: "Confirmation Email",
    description: `Confirmation email sent to ${email}!`,
    type: "success",
  };
};
