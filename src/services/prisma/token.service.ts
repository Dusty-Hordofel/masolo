import prismadb from "@/lib/prismadb";

export async function getVerificationTokenByEmail(email: string) {
  if (!email || typeof email !== "string") {
    throw new Error("Invalid email provided.");
  }

  try {
    const verificationToken = await prismadb.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch (error) {
    console.error("Error fetching verification token:", error);
    throw new Error("Unable to fetch verification token.");
  }
}

export async function getVerificationTokenByToken(token: string) {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid token provided.");
  }

  try {
    return await prismadb.verificationToken.findUnique({
      where: { token },
    });
  } catch (error) {
    console.error("Error fetching verification token by token:", error);
    throw new Error("Unable to fetch verification token.");
  }
}
