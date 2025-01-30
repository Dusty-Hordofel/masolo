import { currentUser } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import {
  ProductFormData,
  ProductSchema,
} from "@/schemas/products/product.schema";
import { Product } from "@prisma/client";
import { z } from "zod";

interface AddImageParams {
  productId: string;
  newImages: Array<{
    publicId: string;
    secureUrl: string;
    alt: string;
  }>;
}

export const ProductService = {
  async createProduct(productData: ProductFormData) {
    console.log("🚀 ~ createProduct ~ productData:PDO", productData);
    try {
      const validatedProduct = ProductSchema.safeParse(productData);

      if (validatedProduct.error) {
        return {
          error: true,
          title: "Validation Error",
          description: "Invalid fields!",
        };
      }

      // Extraire les images et le reste des données
      const { images = [], ...rest } = validatedProduct.data;

      // Créer le produit avec Prisma
      const newProduct = await prismadb.product.create({
        data: {
          ...rest,
          // images,
        },
      });
      console.log("🚀 ~ createNewProduct ~ newProduct:", validatedProduct.data);
      // console.log("🚀 ~ createNewProduct ~ newProduct:", newProduct);

      return {
        success: true,
        title: "Product created",
        description: "Success, your new product has been created",
        productId: newProduct.id,
        // productId: newProduct.id,
      };
    } catch (error) {
      console.log("🚀 ~ createProduct ~ error:", error);

      return {
        error: true,
        title: "Please try again.",
        description: "Sorry, an error occured creating your product.",
      };
    }
  },
  // : Promise<Omit<Product, "createdAt updatedAt">>
  async productDetails(id: string) {
    const product = await prismadb.product.findUnique({
      where: { id },
      include: { images: true },
    });
    console.log("🚀 ~ productDetails ~ product:", product);

    if (!product) {
      throw new Error("Product not found");
    }

    return {
      ...product,
      images: product.images ?? [], // Si les images sont null, définissez un tableau vide
    };

    return product as Product;
  },

  async deleteProduct(productId: string | undefined) {
    const schema = z.string();

    try {
      schema.parse(productId);

      if (!productId) throw new Error("No product id provided");

      await prismadb.product.delete({
        where: { id: productId },
      });

      return {
        success: true,
        title: "Product deleted",
        description: "Success, your product has been deleted",
      };
    } catch (err) {
      console.log(err);
      return {
        error: true,
        title: "Sorry, an error occured deleting your product.",
        description: "Please try again.",
      };
    }
  },
  async updateProduct(productValues: Omit<Product, "storeId">) {
    // Définition du schéma Zod
    // const schema = z.object({
    //   name: z.string().nonempty("Le nom du produit est requis."),
    //   description: z.string().optional(),
    //   price: z.string().nullable(),
    //   inventory: z.string().nullable(),
    //   id: z.number(),
    //   images: z
    //     .array(
    //       z.object({
    //         url: z.string().url("L'URL de l'image doit être valide."),
    //         alt: z.string().optional(),
    //       })
    //     )
    //     .optional(),
    // });

    console.log("LOMO", productValues);
    try {
      // Validation des valeurs du produit
      // schema.parse(productValues);
      // const lolo = ProductSchema.parse(productValues);
      // console.log("🚀 ~ updateProduct ~ lolo:", lolo);
      // Récupération de l'utilisateur courant
      // const user = await currentUser();
      // if (!user?.store.length) {
      //   throw new Error("L'utilisateur n'est pas associé à un magasin.");
      // }
      // Transformation des valeurs avant mise à jour
      // const updatedValues = {
      //   name: productValues.name,
      //   description: productValues.description,
      //   price:
      //     isNaN(Number(productValues.price)) || Number(productValues.price) < 0
      //       ? 0
      //       : Number(productValues.price),
      //   inventory: isNaN(Number(productValues.inventory))
      //     ? 0
      //     : Number(productValues.inventory),
      //   images: productValues.images ?? [],
      //   storeId: "1234567",
      //   // storeId: Number(user.privateMetadata.storeId),
      // };
      // Mise à jour du produit avec Prisma
      // const dbRes = await prismadb.product.updateMany({
      //   where: {
      //     id: productValues.id,
      //     // storeId: updatedValues.storeId, // Vérifie que le produit appartient au bon magasin
      //   },
      //   data: {
      //     name: updatedValues.name,
      //     description: updatedValues.description,
      //     price: updatedValues.price,
      //     inventory: updatedValues.inventory,
      //     images: updatedValues.images,
      //   },
      // });
      // console.log("LALAMI", { dbRes });
      // return {
      //   success: true,
      //   title: "Produit mis à jour avec succès.",
      //   description: "Succès, votre produit a été mis à jour.",
      // };
    } catch (err) {
      console.error("Erreur lors de la mise à jour du produit :", err);

      return {
        error: true,
        title:
          "Désolé, une erreur est survenue lors de la mise à jour du produit.",
        description: "Veuillez réessayer.",
      };
    }
  },

  // async addImage({ productId, newImages }: AddImageParams) {
  //   try {
  //     // Mise à jour des images du produit
  //     const updatedProduct = await prismadb.product.update({
  //       where: { id: productId },
  //       data: {
  //         images: {
  //           push: newImages, // Utiliser `push` pour ajouter des éléments au tableau existant
  //         },
  //       },
  //     });

  //     console.log("🚀 ~ addImage ~ updatedProduct:", updatedProduct);

  //     return updatedProduct;
  //   } catch (error) {
  //     console.error("🚀 ~ addImage ~ error:", error);
  //     throw new Error("Failed to add images to the product.");
  //   }
  // },
};

// product.service.ts
// export const productService = {
//   create: async (product: any) => {
//     const res = await fetch("/api/product", {
//       method: "POST",
//       body: JSON.stringify(product),
//     });
//     return res.json();
//   },

//   update: async (product: any) => {
//     // Appel à une action ou API de mise à jour
//     return await props.productActions.updateProduct(product);
//   },

//   delete: async (id: string) => {
//     // Appel à une action ou API de suppression
//     return await props.productActions.deleteProduct(id);
//   },
// };
