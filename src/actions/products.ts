"use server";

import { Result } from "@/@types";
import { CloudinaryError } from "@/@types";
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

export async function addProductImage(
  storeId: string,
  productId: string,
  image: Omit<Image, "id" | "createdAt" | "product" | "store">
) {
  try {
    // Vérifier que le produit existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existingProduct) {
      throw new Error(`Product with ID ${productId} not found.`);
    }

    // Créer l'image en base
    const createdImage = await prisma.image.create({
      data: {
        ...image,
        productId,
        storeId,
      },
    });

    return createdImage;
  } catch (error) {
    console.error("Error adding product image:", error);
    throw error;
  }
}

export async function deleteProductImage(
  imageId: string
): Promise<Result<{ id: string }>> {
  try {
    // Récupérer l'image avant de la supprimer
    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return {
        success: false,
        title: "Image not found",
        description: `Image with ID ${imageId} not found.`,
      };
    }

    await deleteImageFromCloudinary(image.publicId);

    await prisma.image.delete({
      where: { id: imageId },
    });

    return {
      success: true,
      title: "Product deleted",
      description: `
    Image with ${imageId} have been deleted successfully`,
      data: { id: imageId },
    };
  } catch (error: any) {
    console.error("❌ Image deletion error :", error);

    if (error instanceof CloudinaryError) {
      return {
        success: false,
        title: "Cloudinary error",
        description: error.message, // ou un message plus clair pour le frontend
      };
    }

    if (
      error.name === "FetchError" ||
      error.code === "ECONNREFUSED" ||
      error.code === "ENOTFOUND"
    ) {
      return {
        success: false,
        title: "Network error",
        description:
          "Connection problem with remote service. Please check your network or try again later.",
      };
    }

    return {
      success: false,
      title: "Deletion error",
      // description: `An error occurred while deleting the image ${imageId}.`,
      description: `Unable to delete the image with ${imageId}. Please try again`,
    };
  }
}
// `Unable to delete the image with ${id}. Please try again`,
export async function getNewImages(
  productId: string,
  results?: UploadedFile[]
) {
  try {
    const newImages = await prisma.image.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      // take: 2,
      take: results?.length,
    });
    console.log("🚀 ~ getNewImages ~ newImages:", newImages);
    return newImages;
  } catch (error) {
    console.error("Error getting last new images:", error);
    throw error;
  }
}
export async function getProducts() {
  return await ProductService.getProducts();
}
