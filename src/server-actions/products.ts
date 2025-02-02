"use server";

// @ts-nocheck
import { UploadedFile } from "@/components/admin/use-file-upload";
import prismadb from "@/lib/prismadb";
import { ProductFormData } from "@/schemas/products/product.schema";
import { deleteImageFromCloudinary } from "@/services/cloudinary/cloudinary.service";
import { ProductService } from "@/services/prisma/product.sevice";
import { Product } from "@prisma/client";

export async function createNewProduct(
  productData: ProductFormData,
  storeId: string
) {
  return await ProductService.createProduct(productData, storeId);
}

export async function getProductDetails(id: string): Promise<Product> {
  return await ProductService.productDetails(id);
}

export async function updateProduct(product: any) {
  return await ProductService.updateProduct(product);
}

export async function deleteProduct(id: string) {
  return await ProductService.deleteProduct(id);
}

export async function addProductImages(
  productId: string,
  productImages: Array<{ publicId: string; secureUrl: string; alt: string }>
) {
  try {
    // Étape 1 : Récupérer le produit existant
    const existingProduct = (await prismadb.product.findUnique({
      where: { id: productId },
    })) as Product;

    if (!existingProduct) {
      throw new Error(`Product with ID ${productId} not found.`);
    }

    const updatedProduct = await prismadb.image.createMany({
      data: productImages.map((productImage) => ({
        ...productImage,
        productId, // Assurez-vous d'inclure la clé étrangère
      })),
    });

    console.log("🚀 ~ Product updated successfully:", updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product images:", error);
    throw error;
  }
}

export async function deleteProductImage(imageId: string) {
  try {
    // Récupérer l'image avant de la supprimer
    const image = await prismadb.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new Error(`Image with ID ${imageId} not found.`);
    }

    // Supprimer d'abord l'image sur Cloudinary
    await deleteImageFromCloudinary(image.publicId);

    // Supprimer l'image de la base de données
    await prismadb.image.delete({
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
    const newImages = await prismadb.image.findMany({
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
