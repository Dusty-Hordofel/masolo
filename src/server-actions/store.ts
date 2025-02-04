"use server";

import { prisma } from "@/lib/prisma";
import { StoreSchemaFormData } from "@/schemas/stores/stores.schema";
import { StoreService } from "@/services/prisma/store.service";

export async function createStore(data: StoreSchemaFormData) {
  return await StoreService.createStore(data);
}

export async function getStoreAndProduct() {
  return await StoreService.getStoreAndProduct();
}

export async function getStoreByProductId(productId: string) {
  try {
    if (!productId) throw new Error("Product ID is required.");

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { storeId: true },
    });

    if (!product) throw new Error("Product not found.");

    const store = await prisma.store.findUnique({
      where: { id: product.storeId },
      select: {
        name: true,
        description: true,
        slug: true,
      },
    });

    if (!store) throw new Error("Store not found.");

    return store;
  } catch (error) {
    console.error("❌ Error in getStoreByProductId:", error);
    throw new Error("Failed to fetch store.");
  }
}
