import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().optional(), // Validation pour un ObjectId MongoDB
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  price: z
    .number()
    .min(0, "Le prix ne peut pas être négatif")
    .refine((val) => Number.isFinite(val), "Le prix doit être un nombre valide")
    .default(0),
  description: z
    .string()
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .optional()
    .nullable(),
  inventory: z
    .number()
    .min(0, "L'inventaire ne peut pas être négatif")
    .refine(
      (val) => Number.isFinite(val),
      "L'inventaire doit être un nombre valide"
    )
    .default(0),
  images: z
    .array(
      z.object({
        publicId: z.string().url("L'ID de l'image doit être valide"),
        secureUrl: z.string().url("L'URL de l'image doit être valide"),
        alt: z.string(), // Texte alternatif optionnel
      })
    )
    .optional(),
  // storeId: z
  //   .string()
  //   .regex(/^[a-f\d]{24}$/i, "ID de magasin invalide")
  //   .optional()
  //   .nullable(),
});

export type ProductFormData = z.infer<typeof ProductSchema>;
