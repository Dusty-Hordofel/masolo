import { auth } from "@/auth";
import { currentUser } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { StoreSchemaFormData } from "@/schemas/stores/stores.schema";
import { createSlug } from "@/utils";
import { useSession } from "next-auth/react";

export const StoreService = {
  async createStore(storeValues: StoreSchemaFormData) {
    const user = await currentUser();
    console.log("🚀 ~ createStore ~ user:CREATE", user);
    // const { data: session, update } = useSession();
    // const data = await auth();
    // console.log("🚀 ~ createStore ~ data:DATA", session);

    try {
      const existingStore = await prismadb.store.findFirst({
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

      const newStore = await prismadb.store.create({
        data: {
          ...storeValues,
          slug: createSlug(storeValues.name),
          //   ownerId: user?.id,
          owner: {
            connect: { id: user?.id }, // Associe le magasin à l'utilisateur connecté
          },
        },
      });

      // console.log("🚀 ~ createStore ~ newStore:31", newStore);

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
      const stores = await prismadb.store.findMany({
        where: { ownerId: userId },
      });

      return stores;
    } catch (error) {
      console.error("Error fetching user stores:", error);
      return [];
    }
  },
};

// export const StoreService = {
//   async createStore(data: StoreSchemaFormData) {
//     const existingStore = await prismadb.store.findFirst({
//       where: { name: data.name },
//     });

//     if (existingStore) {
//       return {
//         error: true,
//         title: "Store already exists",
//         description: "Please choose another name.",
//       };
//     }

//     await prismadb.store.create({
//       data: {
//         ...data,
//         slug: createSlug(data.name),
//       },
//     });

//     return {
//       success: true,
//       title: "Store created",
//       description: "Your store has been created successfully.",
//     };
//   },
// };
