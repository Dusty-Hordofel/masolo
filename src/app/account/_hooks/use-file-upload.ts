"use client";

import {
  addProductImage,
  addProductImages,
  getNewImages,
} from "@/actions/products";
import { useState } from "react";
import { Image } from "@prisma/client";
import { UploadedFile, UploadResult } from "@/@types/cloudinary";
import {
  CLOUDINARY_URL,
  createUploadedFile,
  UPLOAD_CONFIG,
  UPLOAD_PRESET,
  validateCloudinaryResponse,
} from "@/utils/cloudinary";


export const useFileUploadToCloudinary = (
  storeId: string,
  productId: string,
  setUploadedImages: React.Dispatch<React.SetStateAction<Image[] | []>>
) => {
  const [isUploading, setIsUploading] = useState(false);

  // TODO: UPDATE uploadFiles content  like uploadFile
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
          const format =
            (data.format || file.type.split("/")[1]).toString() || "unknown";

          const getMediaType = (resourceType: string, mimeType: string) => {
            if (resourceType === "image") return "image";
            if (resourceType === "video") return "video";
            if (resourceType === "raw") {
              if (mimeType.startsWith("audio/")) return "audio";
              if (mimeType.includes("pdf")) return "document";
              if (mimeType.includes("zip") || mimeType.includes("rar"))
                return "archive";
              return "document";
            }
            return "unknown";
          };

          const mediaType = getMediaType(data.resource_type, file.type);

          results.push({
            name: data.original_filename,
            publicId: data.public_id,
            secureUrl: data.secure_url,
            alt: data.original_filename.replace(/_/g, " "),
            size: data.bytes?.toString() || "0",
            format: format,
            type: mediaType, // Convertir en string comme requis par le modèle
            productId: productId,
            storeId: storeId,
          });
        }
      }

    
      await addProductImages(storeId, productId, results);

      const newImages = await getNewImages(productId, results);
  

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

  const uploadFile = async (file: File) => {
    if (!file) {
      throw new Error("File required for upload");
    }
    if (!productId || !storeId) {
      throw new Error("productId and storeId are required");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      UPLOAD_CONFIG.TIMEOUT
    );

    try {
      // Data preparation
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_CONFIG.PRESET);
      formData.append("folder", UPLOAD_CONFIG.FOLDER);

      // Download to Cloudinary
      const response = await fetch(UPLOAD_CONFIG.URL, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // HTTP response check
      if (!response.ok) {
        throw new Error(
          `Erreur HTTP: ${response.status} - ${response.statusText}`
        );
      }

      const cloudinaryData = await response.json();
      console.log("🚀 ~ uploadFile ~ cloudinaryData:CCC", cloudinaryData)

      // Cloudinary data validation
      if (!validateCloudinaryResponse(cloudinaryData)) {
        throw new Error("Invalid Cloudinary response: missing data.");
      }

      // Create the UploadedFile object
      const uploadedFile = createUploadedFile(
        cloudinaryData,
        file,
        productId,
        storeId
      );

      // Add to database
      const addedImage = await addProductImage(
        storeId,
        productId,
        uploadedFile
      );

      if (!addedImage?.secureUrl) {
        throw new Error("Failed to add image to database");
      }

      // Status update
      setUploadedImages((prev) => [...prev, addedImage]);

      return {
        success: true,
        title: "Downloaded image",
        description: "Images successfully uploaded and added.",
        data: addedImage,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      // Specific error handling
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Timeout: Upload took too long");
        }

        console.error("Upload error:", {
          message: error.message,
          fileName: file.name,
          fileSize: file.size,
          productId,
          storeId,
        });
      }

      throw error;
    }
  };

  // Version with automatic retry (optional)
  const uploadFileWithRetry = async (
    file: File,
    maxRetries = 3
  ): Promise<UploadResult> => {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await uploadFile(file);
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error("Erreur inconnue");

        if (attempt === maxRetries) break;

        // Exponential delay between attempts
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));

        console.warn(
          `Tentative ${attempt}/${maxRetries} échouée, retry dans ${delay}ms`,
          lastError.message
        );
      }
    }

    throw lastError!;
  };

  return { isUploading, uploadFiles, uploadFile, uploadFileWithRetry };
};

