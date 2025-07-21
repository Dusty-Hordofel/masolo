"use client";
import { useState } from "react";
import { Image } from "@prisma/client";

import { useFileUploadToCloudinary } from "./useFileUploadToCloudinary";
import UploadUI from "./upload-ui";
// import { useFileUploadToCloudinary } from "./useFileUploadToCloudinary";

const ProductImageManager = ({
  storeId,
  productId,
}: {
  storeId: string;
  productId: string;
}) => {
  const [uploadedImages, setUploadedImages] = useState<Image[]>([]);

  const {
    isUploading,
    uploadFiles,
    uploadProgress,
    uploadedCount,
    failedUploads,
    cancelledUploads,
    cancelUpload,
    canCancel,
  } = useFileUploadToCloudinary(storeId, productId, setUploadedImages);

  //   const { toast } = useToast()

  const handleUpload = async (files: File[]) => {
    try {
      const result = await uploadFiles(files);
      console.log("🚀 ~ handleUpload ~ result:", result);

      //   if (result.success) {
      //     toast.success(result.title, { description: result.description });
      //   } else {
      //     toast.error(result.title, { description: result.description });
      //   }
    } catch (error) {
      console.log("🚀 ~ handleUpload ~ error:", error);
      //   toast.error("Erreur", {
      //     description: "Une erreur inattendue s'est produite.",
      //   });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        Gestionnaire d&apos;images produit
      </h2>

      <UploadUI
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        uploadedCount={uploadedCount}
        failedUploads={failedUploads}
        cancelledUploads={cancelledUploads}
        canCancel={canCancel as boolean}
        onUpload={handleUpload}
        onCancel={cancelUpload}
      />

      {/* Affichage des images uploadées */}
      {uploadedImages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Images uploadées</h3>
          <div className="grid grid-cols-3 gap-4">
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative">
                <picture>
                  <img
                    src={image.secureUrl}
                    alt={image.alt}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </picture>
                <p className="text-xs text-gray-600 mt-1">{image.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageManager;
