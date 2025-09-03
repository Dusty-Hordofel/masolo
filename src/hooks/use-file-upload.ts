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

// const uploadFile = async (storeId: string,setUploadedImages: React.Dispatch<React.SetStateAction<Image[] | []>>, productId: string, file: File) => {
//   if (!file) {
//     throw new Error("File required for upload");
//   }
//   if (!productId || !storeId) {
//     throw new Error("productId and storeId are required");
//   }

//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), UPLOAD_CONFIG.TIMEOUT);

//   try {
//     // Data preparation
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", UPLOAD_CONFIG.PRESET);
//     formData.append("folder", UPLOAD_CONFIG.FOLDER);

//     // Download to Cloudinary
//     const response = await fetch(UPLOAD_CONFIG.URL, {
//       method: "POST",
//       body: formData,
//       signal: controller.signal,
//     });

//     clearTimeout(timeoutId);

//     // HTTP response check
//     if (!response.ok) {
//       throw new Error(
//         `Erreur HTTP: ${response.status} - ${response.statusText}`
//       );
//     }

//     const cloudinaryData = await response.json();

//     // Cloudinary data validation
//     if (!validateCloudinaryResponse(cloudinaryData)) {
//       throw new Error("Invalid Cloudinary response: missing data.");
//     }

//     // Create the UploadedFile object
//     const uploadedFile = createUploadedFile(
//       cloudinaryData,
//       file,
//       productId,
//       storeId
//     );

//     // Add to database
//     const addedImage = await addProductImage(storeId, productId, uploadedFile);

//     if (!addedImage?.secureUrl) {
//       throw new Error("Failed to add image to database");
//     }

//     // Status update
//     setUploadedImages((prev) => [...prev, addedImage]);

//     return {
//       success: true,
//       title: "Downloaded image",
//       description: "Images successfully uploaded and added.",
//       data: addedImage,
//     };
//   } catch (error) {
//     clearTimeout(timeoutId);

//     // Specific error handling
//     if (error instanceof Error) {
//       if (error.name === "AbortError") {
//         throw new Error("Timeout: Upload took too long");
//       }

//       console.error("Upload error:", {
//         message: error.message,
//         fileName: file.name,
//         fileSize: file.size,
//         productId,
//         storeId,
//       });
//     }

//     throw error;
//   }
// };

// type UploadFileReturn = ReturnType<typeof uploadFile>;

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
      console.log("🚀 ~ uploadFiles ~ results:MAMA", results);
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

          // setUploadedImages((prev) => [...prev, ...results]);
        }
      }

      // const addedProduct =
      await addProductImages(storeId, productId, results);

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

// OLD VERSION
// "use client";

// import {
//   addProductImage,
//   addProductImages,
//   getNewImages,
// } from "@/actions/products";
// import { useState } from "react";
// import { Image } from "@prisma/client";

// export interface UploadedFile {
//   name: string;
//   publicId: string; // ID public retourné par Cloudinary
//   secureUrl: string; // URL du fichier téléversé
//   alt: string; //
//   size: string;
//   productId: string;
//   storeId: string;
//   format: string;
//   type: string;
// }

// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
// const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUD_SECRET as string;

// export const useFileUploadToCloudinary1 = (
//   storeId: string,
//   productId: string,
//   setUploadedImages: React.Dispatch<React.SetStateAction<Image[] | []>>
// ) => {
//   const [isUploading, setIsUploading] = useState(false);

//   const uploadFiles = async (files: File[]) => {
//     setIsUploading(true);
//     try {
//       const results: UploadedFile[] = [];
//       console.log("🚀 ~ uploadFiles ~ results:MAMA", results);
//       for (const file of files) {
//         const formData = new FormData();
//         formData.append("file", file); //The file to be uploaded
//         formData.append("upload_preset", UPLOAD_PRESET); // Unsigned preselection
//         formData.append("folder", "masolo"); // Target folder in cloudinary

//         const response = await fetch(CLOUDINARY_URL, {
//           method: "POST",
//           body: formData,
//         });

//         const data = await response.json();

//         if (data.secure_url && data.public_id && data.original_filename) {
//           const format =
//             (data.format || file.type.split("/")[1]).toString() || "unknown";

//           const getMediaType = (resourceType: string, mimeType: string) => {
//             if (resourceType === "image") return "image";
//             if (resourceType === "video") return "video";
//             if (resourceType === "raw") {
//               if (mimeType.startsWith("audio/")) return "audio";
//               if (mimeType.includes("pdf")) return "document";
//               if (mimeType.includes("zip") || mimeType.includes("rar"))
//                 return "archive";
//               return "document";
//             }
//             return "unknown";
//           };

//           const mediaType = getMediaType(data.resource_type, file.type);

//           results.push({
//             name: data.original_filename,
//             publicId: data.public_id,
//             secureUrl: data.secure_url,
//             alt: data.original_filename.replace(/_/g, " "),
//             size: data.bytes?.toString() || "0",
//             format: format,
//             type: mediaType, // Convertir en string comme requis par le modèle
//             productId: productId,
//             storeId: storeId,
//           });

//           // setUploadedImages((prev) => [...prev, ...results]);
//         }
//       }

//       // const addedProduct =
//       await addProductImages(storeId, productId, results);
//       // console.log(
//       //   "🚀 ~ uploadFiles ~ addedProduct:ADDED-PRODUCT",
//       //   addedProduct
//       // );

//       // if (addedProduct.count !== results.length) {
//       //   throw new Error("Erreur survenu lors de l'ajout d'une nouvelle image");
//       // }
//       const newImages = await getNewImages(productId, results);
//       console.log("🚀 ~ uploadFiles ~ newImages:SIKA3", newImages);

//       if (newImages.length > 0) {
//         setUploadedImages((prev) => [...prev, ...newImages]);
//       }

//       return {
//         success: true,
//         title: "Image televerser",
//         description: "Images téléversées et ajoutées avec succès.",
//       };
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       throw error;
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const uploadFile = async (file: File) => {
//     if (!file) {
//       throw new Error("File required for upload");
//     }
//     if (!productId || !storeId) {
//       throw new Error("productId and storeId are required");
//     }

//     let result: UploadedFile;

//     try {
//       const formData = new FormData();
//       formData.append("file", file); //The file to be uploaded
//       formData.append("upload_preset", UPLOAD_PRESET); // Unsigned preselection
//       formData.append("folder", "masolo"); // Target folder in cloudinary

//       const response = await fetch(CLOUDINARY_URL, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();
//       console.log("🚀 ~ handleSingleUpload ~ data:TALA", data);

//       if (data.secure_url && data.public_id && data.original_filename) {
//         const format =
//           (data.format || file.type.split("/")[1]).toString() || "unknown";

//         const getMediaType = (resourceType: string, mimeType: string) => {
//           if (resourceType === "image") return "image";
//           if (resourceType === "video") return "video";
//           if (resourceType === "raw") {
//             if (mimeType.startsWith("audio/")) return "audio";
//             if (mimeType.includes("pdf")) return "document";
//             if (mimeType.includes("zip") || mimeType.includes("rar"))
//               return "archive";
//             return "document";
//           }
//           return "unknown";
//         };

//         const mediaType = getMediaType(data.resource_type, file.type);

//         result = {
//           name: data.original_filename,
//           publicId: data.public_id,
//           secureUrl: data.secure_url,
//           alt: data.original_filename.replace(/_/g, " "),
//           size: data.bytes?.toString() || "0",
//           format: format,
//           type: mediaType, // Convertir en string comme requis par le modèle
//           productId: productId,
//           storeId: storeId,
//         };

//         const addedImage = await addProductImage(storeId, productId, result);
//         console.log("MALANDA", result);
//         if (addedImage.secureUrl) {
//           setUploadedImages((prev) => [...prev, addedImage]);
//         }

//         return {
//           success: true,
//           title: "Downloaded image",
//           description: "Images successfully uploaded and added.",
//         };
//       }
//     } catch (error) {
//       console.log("🚀 ~ handleSingleUpload ~ error:", error);
//       throw error;
//     }
//   };

//   return { isUploading, uploadFiles, uploadFile };
// };

// VERSION A ANALYSER
// "use client";

// import { addProductImages, getNewImages } from "@/actions/products";
// import { useRef, useState } from "react";
// import { Image } from "@prisma/client";

// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
// const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUD_SECRET as string;

// interface UploadedFile {
//   publicId: string;
//   secureUrl: string;
//   alt: string;
//   name: string;
//   size: string;
//   bytes: number;
//   width: number;
//   height: number;
//   format: string;
// }

// interface UploadProgress {
//   current: number;
//   total: number;
//   fileName: string;
//   fileSize: string;
//   percentage: number;
//   canCancel: boolean;
// }

// interface UploadResult {
//   success: boolean;
//   title: string;
//   description: string;
//   uploadedCount: number;
//   failedCount: number;
//   cancelledCount: number;
// }

// const formatFileSize = (bytes: number): string => {
//   if (bytes === 0) return "0 Bytes";

//   const k = 1024;
//   const sizes = ["Bytes", "KB", "MB", "GB"];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));

//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
// };

// export const useFileUploadToCloudinary = (
//   storeId: string,
//   productId: string,
//   setUploadedImages: React.Dispatch<React.SetStateAction<Image[] | []>>
// ) => {
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
//     null
//   );
//   const [uploadedCount, setUploadedCount] = useState(0);
//   const [failedUploads, setFailedUploads] = useState<string[]>([]);
//   const [cancelledUploads, setCancelledUploads] = useState<string[]>([]);

//   // Références pour gérer l'annulation
//   const abortControllerRef = useRef<AbortController | null>(null);
//   const isUploadCancelledRef = useRef(false);

//   const uploadSingleFile = async (
//     file: File,
//     abortController: AbortController
//   ): Promise<UploadedFile> => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", UPLOAD_PRESET);
//     formData.append("folder", "masolo");

//     const response = await fetch(CLOUDINARY_URL, {
//       method: "POST",
//       body: formData,
//       signal: abortController.signal, // 🔑 Signal d'annulation
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();

//     if (!data.secure_url || !data.public_id) {
//       throw new Error("Réponse Cloudinary invalide");
//     }

//     return {
//       publicId: data.public_id,
//       secureUrl: data.secure_url,
//       alt: data.original_filename?.replace(/_/g, " ") || file.name,
//       name: file.name,
//       size: formatFileSize(file.size),
//       bytes: file.size,
//       width: data.width || 0,
//       height: data.height || 0,
//       format: data.format || file.type.split("/")[1] || "unknown",
//     };
//   };

//   const uploadFiles = async (files: File[]): Promise<UploadResult> => {
//     setIsUploading(true);
//     setUploadedCount(0);
//     setFailedUploads([]);
//     setCancelledUploads([]);
//     isUploadCancelledRef.current = false;

//     // Créer un nouveau AbortController pour cette session d'upload
//     const abortController = new AbortController();
//     abortControllerRef.current = abortController;

//     try {
//       const results: UploadedFile[] = [];
//       const failed: string[] = [];
//       const cancelled: string[] = [];

//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];

//         // Vérifier si l'annulation a été demandée
//         if (isUploadCancelledRef.current) {
//           console.log(`🚫 Upload annulé pour: ${file.name}`);
//           cancelled.push(file.name);
//           setCancelledUploads((prev) => [...prev, file.name]);
//           continue;
//         }

//         // Mettre à jour le progress
//         setUploadProgress({
//           current: i + 1,
//           total: files.length,
//           fileName: file.name,
//           fileSize: formatFileSize(file.size),
//           percentage: Math.round(((i + 1) / files.length) * 100),
//           canCancel: true,
//         });

//         try {
//           const uploadedFile = await uploadSingleFile(file, abortController);
//           results.push(uploadedFile);
//           setUploadedCount((prev) => prev + 1);

//           console.log(`✅ Upload réussi: ${file.name} (${uploadedFile.size})`);
//         } catch (error) {
//           if (error instanceof Error) {
//             if (error.name === "AbortError") {
//               console.log(`🚫 Upload annulé: ${file.name}`);
//               cancelled.push(file.name);
//               setCancelledUploads((prev) => [...prev, file.name]);
//             } else {
//               console.error(`❌ Erreur upload ${file.name}:`, error);
//               failed.push(file.name);
//               setFailedUploads((prev) => [...prev, file.name]);
//             }
//           }
//         }
//       }

//       // Sauvegarder les images en base de données (seulement si pas annulé)
//       let savedImages: Image[] = [];
//       if (results.length > 0 && !isUploadCancelledRef.current) {
//         try {
//           await addProductImages(storeId, productId, results);
//           console.log(`💾 ${results.length} images ajoutées en base`);

//           const newImages = await getNewImages(productId, results);
//           console.log("🚀 ~ uploadFiles ~ newImages:", newImages);

//           if (newImages.length > 0) {
//             savedImages = newImages;
//             setUploadedImages((prev) => [...prev, ...newImages]);
//           }
//         } catch (dbError) {
//           console.error("❌ Erreur sauvegarde base de données:", dbError);
//           throw new Error("Erreur lors de la sauvegarde en base de données");
//         }
//       }

//       // Préparer le résultat
//       const successCount = results.length;
//       const failedCount = failed.length;
//       const cancelledCount = cancelled.length;

//       let title: string;
//       let description: string;

//       if (cancelledCount > 0) {
//         if (successCount === 0) {
//           title = "Upload annulé";
//           description = `${cancelledCount} upload(s) annulé(s).`;
//         } else {
//           title = "Upload partiellement annulé";
//           description = `${successCount} image(s) uploadée(s), ${cancelledCount} annulée(s)${
//             failedCount > 0 ? `, ${failedCount} échec(s)` : ""
//           }.`;
//         }
//       } else if (failedCount === 0) {
//         title = "Images téléversées avec succès";
//         description = `${successCount} image(s) téléversée(s) et ajoutée(s) avec succès.`;
//       } else if (successCount === 0) {
//         title = "Échec du téléversement";
//         description = `Aucune image n'a pu être téléversée. ${failedCount} échec(s).`;
//       } else {
//         title = "Téléversement partiellement réussi";
//         description = `${successCount} image(s) téléversée(s) avec succès, ${failedCount} échec(s).`;
//       }

//       return {
//         success: successCount > 0,
//         title,
//         description,
//         uploadedCount: successCount,
//         failedCount,
//         cancelledCount,
//       };
//     } catch (error) {
//       console.error("❌ Erreur générale upload:", error);

//       return {
//         success: false,
//         title: "Erreur de téléversement",
//         description:
//           "Une erreur est survenue lors du téléversement des images.",
//         uploadedCount: 0,
//         failedCount: files.length,
//         cancelledCount: 0,
//       };
//     } finally {
//       setIsUploading(false);
//       setUploadProgress(null);
//       abortControllerRef.current = null;
//     }
//   };

//   const cancelUpload = () => {
//     if (abortControllerRef.current && isUploading) {
//       console.log("🚫 Annulation des uploads en cours...");

//       // Marquer comme annulé
//       isUploadCancelledRef.current = true;

//       // Annuler les requêtes en cours
//       abortControllerRef.current.abort();

//       // Mettre à jour l'état
//       setUploadProgress((prev) =>
//         prev ? { ...prev, canCancel: false } : null
//       );

//       // Note: l'état isUploading sera mis à false dans le finally du uploadFiles
//     }
//   };

//   // Fonction pour nettoyer les images uploadées sur Cloudinary en cas d'annulation
//   const cleanupCancelledUploads = async (uploadedFiles: UploadedFile[]) => {
//     if (uploadedFiles.length === 0) return;

//     console.log(`🧹 Nettoyage de ${uploadedFiles.length} images uploadées...`);

//     const deletePromises = uploadedFiles.map(async (file) => {
//       try {
//         await fetch("/api/delete-cloudinary", {
//           method: "DELETE",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ publicId: file.publicId }),
//         });
//         console.log(`🗑️ Image supprimée: ${file.name}`);
//       } catch (error) {
//         console.error(`❌ Erreur suppression ${file.name}:`, error);
//       }
//     });

//     await Promise.all(deletePromises);
//   };

//   return {
//     isUploading,
//     uploadFiles,
//     uploadProgress,
//     uploadedCount,
//     failedUploads,
//     cancelledUploads,
//     cancelUpload,
//     cleanupCancelledUploads,
//     canCancel: isUploading && uploadProgress?.canCancel,
//   };
// };
