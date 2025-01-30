import prismadb from "@/lib/prismadb";
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

export const useFileUploadToCloudinary = (productId: string) =>
  //   {
  //   cloudinaryUrl,
  //   uploadPreset,
  // }: UseFileUploadProps
  {
    const [isUploading, setIsUploading] = useState(false); // État pour indiquer si le téléversement est en cours
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]); // Stocker les fichiers téléversés
    console.log("🚀 ~ uploadedFiles:UPLOADED", uploadedFiles);

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
          }
        }
        // setUploadedFiles(results);
        // setUploadedFiles((prev) => [...prev, ...results]);
        // setUploadedFiles((prev) => [...prev, ...results]);
        // return results;

        // Ajouter les nouvelles images au produit existant via Prisma
        // const updatedProduct = await prismadb.product.update({
        //   where: { id: productId },
        //   data: {
        //     images: {
        //       push: results,
        //     },
        //   },
        // });

        // console.log("🚀 ~ uploadFiles ~ updatedProduct:POPO", updatedProduct);
        // 2. Vérifier si le produit existe
        const existingProduct = await prismadb.product.findUnique({
          where: { id: productId },
        });

        if (!existingProduct) {
          throw new Error("Produit introuvable.");
        }
        // 3. Ajouter les images à la table `Image`
        for (const image of results) {
          await prismadb.image.create({
            data: {
              publicId: image.publicId,
              secureUrl: image.secureUrl,
              alt: image.alt,
              product: {
                connect: { id: productId }, // Associe l'image au produit
              },
            },
          });
        }

        const updatedProduct = await prismadb.product.findUnique({
          where: { id: productId },
          // include: { images: true }, // Inclure les images dans le retour
        });
        console.log(
          "🚀 ~ uploadFiles ~ updatedProduct:MAKAMBO",
          updatedProduct
        );

        // return {
        //   title: "Image televerser"
        //   description: "Images téléversées et ajoutées avec succès.",
        //   product: updatedProduct,
        // };
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    };

    return { isUploading, uploadedFiles, uploadFiles, setUploadedFiles };
  };
