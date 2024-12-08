"use server";

import prismadb from "@/lib/prismadb";
import { StoreSchemaFormData } from "@/schemas/stores/stores.schema";
import { createSlug } from "@/utils";

export async function createStore(storeValues: StoreSchemaFormData) {
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
        action: "Sorry, a store with that name already exists.",
        message: "Please try again.",
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
      action: "Store created",
      message: "Success, your store has been created",
    };
  } catch (err) {
    console.log(err);

    return {
      error: true,
      action: "Please try again.",
      message: "Sorry, an error occured creating your store. ",
    };
  }
}
