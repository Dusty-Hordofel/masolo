"use client";

// import prismadb from "@/lib/prismadb";
import {
  getProductDetails,
  addProductImages,
  getNewImages,
} from "@/server-actions/products";
// import { Prisma } from "@prisma/client";
// import { JsonValue } from "@prisma/client/runtime/library";
// import { Description } from "@radix-ui/react-toast";
import { useState } from "react";
import { ProductImage } from "./product-editor-elements";
import prismadb from "@/lib/prismadb";
import { Image, Product } from "@prisma/client";

// interface UseFileUploadProps {
//   cloudinaryUrl: string; // URL Cloudinary
//   uploadPreset: string; // Preset pour Cloudinary
// }

export interface UploadedFile {
  publicId: string; // ID public retourné par Cloudinary
  secureUrl: string; // URL du fichier téléversé
  alt: string; //
}

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUD_SECRET as string;

export const useFileUploadToCloudinary = (
  productId: string,
  setUploadedImages: React.Dispatch<React.SetStateAction<Image[] | []>>
) => {
  const [isUploading, setIsUploading] = useState(false);

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

        const data = await response.json();

        if (data.secure_url && data.public_id && data.original_filename) {
          results.push({
            publicId: data.public_id,
            secureUrl: data.secure_url,
            alt: data.original_filename.replace(/_/g, " "),
          });

          // setUploadedImages((prev) => [...prev, ...results]);
        }
      }

      const addedProduct = await addProductImages(productId, results);
      // console.log(
      //   "🚀 ~ uploadFiles ~ addedProduct:ADDED-PRODUCT",
      //   addedProduct
      // );

      // if (addedProduct.count !== results.length) {
      //   throw new Error("Erreur survenu lors de l'ajout d'une nouvelle image");
      // }
      const newImages = await getNewImages(productId, results);
      console.log("🚀 ~ uploadFiles ~ newImages:SIKA3", newImages);
      if (newImages.length > 0) {
        setUploadedImages((prev) => [...prev, ...newImages]);
      }

      return {
        success: true,
        title: "Image televerser",
        description: "Images téléversées et ajoutées avec succès.",
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, uploadFiles };
};
