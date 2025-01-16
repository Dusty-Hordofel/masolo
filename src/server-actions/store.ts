"use server";

import { StoreSchemaFormData } from "@/schemas/stores/stores.schema";
import { StoreService } from "@/services/prisma/store.service";

export async function createStore(data: StoreSchemaFormData) {
  return await StoreService.createStore(data);
}
