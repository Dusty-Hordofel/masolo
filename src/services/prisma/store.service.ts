import { auth } from "@/lib/(auth)/better-auth/auth";
import { prisma } from "@/lib/prisma";
import { StoreSchemaFormData } from "@/schemas/stores/stores.schema";
import { createSlug } from "@/utils";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export const StoreService = {
   async  createStoreForUser(storeValues: StoreSchemaFormData) {

      const session = await auth.api.getSession({ headers: await headers() });
      console.log("🚀 ~ fetchUserStores ~ session:", session)

      if (!session)  redirect("/sign-in")
    

  try {
        const existingStore = await prisma.store.findFirst({
        where: {
          name: storeValues.name,
        },
      });


    if (existingStore) {
      return {
        success: false,
        title: "Store already exists",
        description: "A store with that name already exists. Please try again.",
      };
    }

     const newStore = await prisma.store.create({
        data: {
          ...storeValues,
          slug: createSlug(storeValues.name),
          owner: {
            connect: { id: session.user.id },
          },
        },
      });

    // Invalide le cache pour recharger la page
    revalidatePath("/dashboard");

    return {
      success: true,
      data: newStore,
      title: "Store created",
      description: "Success! Your store has been created.",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return {
        success: false,
        title: "Database connection failed",
        description: "Impossible de se connecter à la base de données.",
      };
    } else if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientRustPanicError
    ) {
      return {
        success: false,
        title: "Server error",
        description: "Une erreur serveur est survenue. Veuillez réessayer plus tard.",
      };
    } else {
      return {
        success: false,
        title: "Unknown error",
        description: error.message || "Sorry, an error occurred creating your store.",
      };
    }
  }
},

// Fonction cache par userId
 getUserStores:  
/*  cache( */
  async (userId: string) => {

      const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { redirect: "/sign-in" as const};

  // Vérifier que l'utilisateur existe encore en base
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { redirect: "/sign-in" };

  
  try {
    const stores = await prisma.store.findMany({
        where: { ownerId: userId },
      });

    return {
      success: true,
      data: stores,
      title: "Stores fetched",
      description: "Stores loaded successfully",
    };


  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientInitializationError) {
      return {
        success: false,
        title: "Database connection failed",
        description: "Impossible de se connecter à la base de données.",
      };
    } else if (
      err instanceof Prisma.PrismaClientKnownRequestError ||
      err instanceof Prisma.PrismaClientValidationError ||
      err instanceof Prisma.PrismaClientRustPanicError
    ) {
      return {
        success: false,
        title: "Server error",
        description: "Une erreur serveur est survenue. Veuillez réessayer plus tard.",
      };
    } else {
      return {
        success: false,
        title: "Unknown error",
        description: err.message || "Une erreur inconnue est survenue.",
      };
    }
  }
}
/* S */
, 

async  fetchUserStores() {
  const session = await auth.api.getSession({ headers: await headers() });
  console.log("🚀 ~ fetchUserStores ~ session:SESSION", session)
  if (!session) return { redirect: "/sign-in" as const};

  // Vérifier que l'utilisateur existe encore en base
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { redirect: "/sign-in" };

  return this.getUserStores(user.id);
}

 /*  async createStore(storeValues: StoreSchemaFormData) {
    const user = await currentUser();

    console.log("🚀 ~ createStore ~ user:", user);

    // Check if user is authenticated
    if (!user || !user.id) {
      console.log("🚀 ~ createStore ~ user not authenticated:", { user });
      return {
        error: true,
        title: "Authentication required",
        description: "Please log in to create a store.",
      };
    }

    try {
      const existingStore = await prisma.store.findFirst({
        where: {
          name: storeValues.name,
        },
      });
      console.log("🚀 ~ createStore ~ existingStore:14", existingStore);

      if (existingStore?.name === storeValues.name) {
        return {
          error: true,
          title: "Sorry, a store with that name already exists.",
          description: "Please try again.",
        };
      }

      const newStore = await prisma.store.create({
        data: {
          ...storeValues,
          slug: createSlug(storeValues.name),
          owner: {
            connect: { id: user.id },
          },
        },
      });

      return {
        success: true,
        title: "Store created",
        description: "Success, your store has been created",
        newStore,
      };
    } catch (err) {
      console.log(err);

      return {
        error: true,
        title: "Please try again.",
        description: "Sorry, an error occured creating your store. ",
      };
    }
  }, */
  ,
/*   async getUserStores(userId: string) {
    try {
      const stores = await prisma.store.findMany({
        where: { ownerId: userId },
      });

      return stores;
    } catch (error) {
      console.error("Error fetching user stores:", error);
      return [];
    }
  }, */

  async getStoreAndProduct() {
    try {
      const storeAndProduct = await prisma.product.findMany({
        include: {
          images: true,
          store: true,
          // store: {
          //   select: {
          //     id: true,
          //     name: true,
          //     slug: true,
          //   },
          // },
        },
        take: 8, // Équivaut à LIMIT 8 en SQL
      });
      // console.log("🚀 ~ Home ~ storeAndProduct:", storeAndProduct);

      return storeAndProduct;
    } catch (error) {
      console.error("Error fetching  product stores:", error);
      return [];
    }
  },

  async getStore() {
    try {
      const store = await prisma.store.findFirst({
        include: {
          products: {
            include: {
              images: true,
            },
          },
        },
      });
      console.log("��� ~ getStore ~ store:", store);

      return store;
    } catch (error) {
      console.error("Error fetching  store:", error);
      return null;
    }
  },

  async getStoreById(id: string) {
    try {
      const store = await prisma.store.findFirst({
        where: { id },
        // include: {
        //   products: {
        //     include: {
        //       images: true,
        //     },
        //   },
        // },
      });
      // console.log("��� ~ getStoreBySlug ~ store:", store);

      return store?.slug;
    } catch (error) {
      console.error("Error fetching  store by slug:", error);
      return null;
    }
  },

  async getStoreBySlug(slug: string, returnId: boolean = false) {
    try {
      const store = await prisma.store.findFirst({
        where: {
          slug,
        },
        include: {
          payments: {
            select: {
              stripeAccountId: true,
            },
          },
        },
      });
      console.log("🚀 ~ getStoreBySlug ~ store:", store);

      if (store) {
        return returnId ? store.id : store.slug;
      }

      return null;
    } catch (error) {
      console.error("Error fetching store by slug:", error);
      return null;
    }
  },

  async getStoreImages(storeId: string) {
    try {
      if (!storeId) throw new Error("Store ID is required.");

      const images = await prisma.image.findMany({
        where: {
          storeId,
        },
      });
      console.log("🚀 ~ getStoreImages ~ images:TALA", images);

      return images;
    } catch (error) {
      console.error("Error fetching  product stores:", error);
      return [];
    }
  },
};
