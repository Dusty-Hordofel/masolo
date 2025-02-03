import { prisma } from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    return user;
  } catch (error) {
    console.log("🚀 ~ getUserByEmail ~ error:", error);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    // const user = await prismadb.user.findUnique({ where: { id } });
    const user = await prisma.user.findUnique({
      where: { id },
    });

    // await prismadb.user.findUnique({
    //   where: { id: user.id },
    //   include: { store: true },
    // });

    return user;
  } catch (error) {
    console.log("🚀 ~ getUserById ~ error:", error);
    return null;
  }
};
