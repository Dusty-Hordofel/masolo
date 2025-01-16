import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(1, { message: "The store name is required." }).max(100, {
    message: "The store name must be at most 100 characters long.",
  }),
  description: z
    .string()
    .max(500, {
      message: "The description must be at most 500 characters long.",
    })
    .optional(),
});

export type StoreSchemaFormData = z.infer<typeof storeSchema>;
