import { z } from "zod";

export const ProductSchema = z.object({
  // id: z.string().regex(/^[a-f\d]{24}$/i, "ID invalide"), // Validation pour un ObjectId MongoDB
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
        url: z.string().url("L'URL de l'image doit être valide"),
        alt: z.string().optional(), // Texte alternatif optionnel
      })
    )
    .optional(),
  // images: z
  //   .array(
  //     z.object({
  //       url: z.string().url("L'URL de l'image doit être valide"),
  //       alt: z.string().optional(), // Texte alternatif optionnel
  //     })
  //   )
  //   .min(1, "Au moins une image est requise"),
  storeId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "ID de magasin invalide")
    .optional(), // Validation pour un ObjectId MongoDB
});

export type ProductFormData = z.infer<typeof ProductSchema>;
