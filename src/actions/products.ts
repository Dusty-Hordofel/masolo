"use server";

import { UploadedFile } from "@/components/admin/use-file-upload";
import { prisma } from "@/lib/prisma";
import { ProductFormData } from "@/schemas/products/product.schema";
import { deleteImageFromCloudinary } from "@/services/cloudinary/cloudinary.service";
import { ProductService } from "@/services/prisma/product.sevice";
import { Image, Product } from "@prisma/client";

export async function createNewProduct(
  productData: ProductFormData,
  storeId: string
) {
  return await ProductService.createProduct(productData, storeId);
}

export async function getProduct(id: string): Promise<Product> {
  return await ProductService.product(id);
}

export async function updateProduct(
  product: Omit<Product, "createdAt" | "updatedAt" | "isPreOrderAvailable">
) {
  return await ProductService.updateProduct(product);
}

export async function deleteProduct(id: string) {
  return await ProductService.deleteProduct(id);
}

export async function addProductImages(
  storeId: string,
  productId: string,
  productImages: Array<Omit<Image, "id" | "createdAt" | "product" | "store">>
  // Array<{
  //   name: string;
  //   publicId: string;
  //   secureUrl: string;
  //   alt: string;
  //   size: string;
  //   format: string;
  //   type: string;
  //   storeId: string;
  //   productId: string;
  // }>
) {
  try {
    // Étape 1 : Récupérer le produit existant
    const existingProduct = (await prisma.product.findUnique({
      where: { id: productId },
    })) as Product;
    console.log("🚀 ~ existingProduct:ID", existingProduct);

    if (!existingProduct) {
      throw new Error(`Product with ID ${productId} not found.`);
    }

    const updatedProduct = await prisma.image.createMany({
      data: productImages.map((productImage) => ({
        ...productImage,
        // productId,
        // storeId, // Assurez-vous d'inclure la clé étrangère
      })),
    });
    console.log("🚀 ~ updatedProduct:RESULT", updatedProduct);

    return updatedProduct;
  } catch (error) {
    console.error("Error updating product images:", error);
    throw error;
  }
}

export async function deleteProductImage(imageId: string) {
  try {
    // Récupérer l'image avant de la supprimer
    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new Error(`Image with ID ${imageId} not found.`);
    }

    // Supprimer d'abord l'image sur Cloudinary
    await deleteImageFromCloudinary(image.publicId);

    // Supprimer l'image de la base de données
    await prisma.image.delete({
      where: { id: imageId },
    });

    console.log("✅ Image supprimée de la base de données.");
    return {
      success: true,
      title: "Product deleted",
      description: `
    Image with ${imageId} have been deleted successfully`,
    };
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'image :", error);
    throw error;
  }
}

export async function getNewImages(productId: string, results: UploadedFile[]) {
  try {
    const newImages = await prisma.image.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      // take: 2,
      take: results.length,
    });
    return newImages;
  } catch (error) {
    console.error("Error getting last new images:", error);
    throw error;
  }
}
export async function getProducts() {
  return await ProductService.getProducts();
}
