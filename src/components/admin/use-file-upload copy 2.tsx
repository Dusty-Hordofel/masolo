"use client";

import prismadb from "@/lib/prismadb";
import { getProductDetails } from "@/server-actions/products";
import { Prisma } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { Description } from "@radix-ui/react-toast";
import { useState } from "react";

interface UseFileUploadProps {
  cloudinaryUrl: string; // URL Cloudinary
  uploadPreset: string; // Preset pour Cloudinary
}

interface UploadedFile {
  publicId: string; // ID public retourné par Cloudinary
  secureUrl: string; // URL du fichier téléversé
  alt?: string; //
}

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUD_SECRET as string; // La présélection non signée
console.log("🚀 ~ UPLOAD_PRESET:", UPLOAD_PRESET);
console.log("🚀 ~ CLOUDINARY_URL:", CLOUDINARY_URL);

export const useFileUploadToCloudinary = (productId: string) => {
  const [isUploading, setIsUploading] = useState(false); // État pour indiquer si le téléversement est en cours
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]); // Stocker les fichiers téléversés
  console.log("🚀 ~ uploadedFiles:UPLOADED", uploadedFiles);
  console.log("🚀 ~ useFileUploadToCloudinary ~ productId:ID", productId);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    try {
      const results: UploadedFile[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file); //The file to be uploaded
        formData.append("upload_preset", UPLOAD_PRESET); // Unsigned preselection
        formData.append("folder", "masolo"); // Target folder in cloudinary

        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });
        console.log("🚀 ~ uploadFiles ~ response:", response);

        const data = await response.json();
        console.log("🚀 ~ uploadFiles ~ data:VV", data);

        if (data.secure_url && data.public_id && data.original_filename) {
          results.push({
            publicId: data.public_id,
            secureUrl: data.secure_url,
            alt: data.original_filename.replace(/_/g, " "),
          });

          setUploadedFiles(results);
        }
      }

      const existingProduct = await getProductDetails(productId);
      console.log("🚀 ~ uploadFiles ~ existingProduct:EXX", existingProduct);

      // if (productId) {
      //   const existingProduct = await prismadb.product.findUnique({
      //     where: { id: productId },
      //   });
      //   console.log("🚀 ~ uploadFiles ~ existingProduct:EX", existingProduct);
      // }

      // if (!existingProduct) {
      //   throw new Error("Produit introuvable.");
      // }

      // Mettre à jour le champ `images` du produit avec les nouvelles images
      // const updatedImages = [
      //   ...(Array.isArray(existingProduct.images)
      //     ? existingProduct.images
      //     : []), // Vérifier si c'est un tableau
      //   ...results, // Ajouter les nouvelles images téléversées
      // ];

      const updatedImages: Prisma.JsonValue[] = results.map((file) => ({
        publicId: file.publicId,
        secureUrl: file.secureUrl,
        alt: file.alt,
      }));
      console.log("🚀 ~ uploadFiles ~ updatedImages:", updatedImages);

      setUploadedFiles(results);

      const isJsonCompatible = (obj: any): boolean => {
        try {
          JSON.stringify(obj);
          return true;
        } catch {
          return false;
        }
      };

      if (!updatedImages.every(isJsonCompatible)) {
        throw new Error("One or more images are not JSON serializable.");
      }

      // const newProd = await prismadb.product.update({
      //   where: { id: productId },
      //   data: {
      //     images: updatedImages, // Typé explicitement comme JsonValue[]
      //   },
      // });
      // console.log("🚀 ~ uploadFiles ~ newProd:", newProd);

      const newProd = await prismadb.product.update({
        where: { id: productId },
        data: {
          images: [
            {
              publicId: "example_public_id",
              secureUrl: "https://example.com/image.jpg",
              alt: "Example Image",
            },
          ],
        },
      });
      console.log("🚀 ~ uploadFiles ~ newProd:TALA", newProd);

      // const newProd = await prismadb.product.update({
      //   where: { id: productId },
      //   data: {
      //     images: updatedImages, // Typé explicitement comme JsonValue[]
      //   },
      // });
      // console.log("🚀 ~ uploadFiles ~ newProd:", newProd);

      // console.log("🚀 ~ uploadFiles ~ updatedImages:UPI", updatedImages);
      // const newProd = await prismadb.product.update({
      //   where: { id: productId },
      //   data: {
      //     images: updatedImages as unknown as JsonValue[], // On force le type JsonValue[] ici
      //   },
      // });
      // console.log("🚀 ~ uploadFiles ~ newProd:PROD", newProd);

      return {
        title: "Image televerser",
        description: "Images téléversées et ajoutées avec succès.",
        // product: updatedImages,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, uploadedFiles, uploadFiles, setUploadedFiles };
};
