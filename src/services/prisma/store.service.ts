import prismadb from "@/lib/prismadb";
import { StoreSchemaFormData } from "@/schemas/stores/stores.schema";
import { createSlug } from "@/utils";

export const StoreService = {
  async createStore(storeValues: StoreSchemaFormData) {
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
        },
      });

      console.log("🚀 ~ createStore ~ newStore:31", newStore);

      return {
        success: true,
        title: "Store created",
        description: "Success, your store has been created",
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
