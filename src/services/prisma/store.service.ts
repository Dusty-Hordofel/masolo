import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StoreSchemaFormData } from "@/schemas/stores/stores.schema";
import { createSlug } from "@/utils";

export const StoreService = {
  async createStore(storeValues: StoreSchemaFormData) {
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
  },
  async getUserStores(userId: string) {
    try {
      const stores = await prisma.store.findMany({
        where: { ownerId: userId },
      });

      return stores;
    } catch (error) {
      console.error("Error fetching user stores:", error);
      return [];
    }
  },

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
