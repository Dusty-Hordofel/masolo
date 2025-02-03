import { getVerificationTokenByEmail } from "@/services/prisma/token.service";
import prismadb from "./prisma";

export const generateToken = (length = 6): string => {
  let otp = "";
  const digits = "0123456789";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }
  return otp;
};

export const generateEmailVerificationToken = async (email: string) => {
  const sixDigitCode = generateToken();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await prismadb.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await prismadb.verificationToken.create({
    data: {
      email,
      token: sixDigitCode,
      expires,
    },
  });

  return verificationToken;
};
