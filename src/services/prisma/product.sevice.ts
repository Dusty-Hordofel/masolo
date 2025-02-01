import { currentUser } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import {
  ProductFormData,
  ProductSchema,
} from "@/schemas/products/product.schema";
import { Product } from "@prisma/client";
import { z } from "zod";

export const ProductService = {
  async createProduct(productData: ProductFormData, storeId: string) {
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
          storeId: storeId,
          // store: {
          //   connect: { id: storeId }, // Connecte le produit au Store existant
          // },
          // images,
        },
      });

      return {
        success: true,
        title: "Product created",
        description: "Success, your new product has been created",
        productId: newProduct.id,
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
    console.log("LOMO", productValues);
    try {
      // Validation des valeurs du produit
      // ProductSchema.parse(productValues);

      // Récupération de l'utilisateur courant
      const user = await currentUser();
      // if (!user?.store.length) {
      //   throw new Error("L'utilisateur n'est pas associé à un magasin.");
      // }

      // Transformation des valeurs avant mise à jour
      const updatedValues = {
        name: productValues.name,
        description: productValues.description,
        price:
          isNaN(Number(productValues.price)) || Number(productValues.price) < 0
            ? 0
            : Number(productValues.price),
        inventory: isNaN(Number(productValues.inventory))
          ? 0
          : Number(productValues.inventory),
        // images: productValues.images ?? [],
        // storeId: "1234567",
      };

      // Mise à jour du produit avec Prisma
      const dbRes = await prismadb.product.updateMany({
        where: {
          id: productValues.id,
          // storeId: updatedValues.storeId, // Vérifie que le produit appartient au bon magasin
        },
        data: {
          name: updatedValues.name,
          description: updatedValues.description,
          price: updatedValues.price,
          inventory: updatedValues.inventory,
        },
      });
      console.log("LALAMI", { dbRes });
      return {
        success: true,
        title: "Product successfully updated.",
        description: "Success, your product has been updated.",
      };
    } catch (err) {
      console.error("Product update error :", err);

      return {
        error: true,
        title: "Sorry, an error occured while updating the product.",
        description: "Please try again.",
      };
    }
  },

  // async getProductsByStore(storeId: string) {},
  async getProducts() {
    const products = await prismadb.product.findMany({
      include: { images: true },
    });

    return products;
  },
};
