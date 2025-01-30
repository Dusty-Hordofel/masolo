"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFileUploadToCloudinary } from "./use-file-upload";
// import Image from "next/image";
import { XIcon } from "lucide-react";
import prismadb from "@/lib/prismadb";
import { ProductImage } from "./product-editor-elements";
import { Image } from "@prisma/client";

// const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload";
// const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET"; // La présélection non signée

const ImageUploader2 = ({
  productId,
  uploadedImages,
  setUploadedImages,
  setProductImages,
  productImages,
  // setProductImages,
  existingImages,
}: {
  productId: string;
  uploadedImages: ProductImage[];
  existingImages: Image[];
  productImages?: Image[];
  setUploadedImages: React.Dispatch<React.SetStateAction<ProductImage[]>>;
  setProductImages: React.Dispatch<React.SetStateAction<Image[] | undefined>>;
  // productImages
  //    setProductImages: React.Dispatch<React.SetStateAction<{
  //     id: string;
  //     publicId: string;
  //     secureUrl: string;
  //     alt: string | null;
  //     productId: string;
  // }[] | undefined>>
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // const [isUploading, setIsUploading] = useState(false);

  const { isUploading, uploadFiles } = useFileUploadToCloudinary(
    productId,
    setUploadedImages
  );

  // console.log("🚀 ~ ImageUploader2 ~ uploadedFiles:UPLOADED", uploadedFiles);

  const onDrop = (acceptedFiles: File[]) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, // N'accepte que les fichiers image
    multiple: true, // Permet plusieurs fichiers
  });

  const handleUpload = async () => {
    try {
      const results = await uploadFiles(selectedFiles); // Appel du hook pour téléverser les fichiers
      console.log("🚀 ~ handleUpload ~ results:RORO", results);

      // console.log("🚀 ~ uploadFiles ~ newProd:MAMA", "YOYO");

      if (results.success) {
        setProductImages(results.images);
        setSelectedFiles([]); // Réinitialisez les fichiers sélectionnés après le téléversement
      }
      // console.log("Fichiers téléversés :", results);
    } catch (error) {
      alert("Une erreur est survenue lors du téléversement.");
    }
  };

  return (
    <>
      <div className="bg-red-400 w-full">
        <div
          // className="bg-yellow-400 w-full"
          className="mt-2 border border-border p-4 rounded-md flex items-center justify-start gap-2 flex-wrap bg-yellow-300 "
        >
          {productImages && productImages.length > 0 && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.secureUrl}
                    alt={`Uploaded ${index + 1}`}
                    style={{
                      width: "144px",
                      height: "144px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />

                  <div className=""></div>
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>

                 
                </div>
              ))}
            </div>
          )}

          <div
            {...getRootProps()}
            className="border-border border-2 rounded-md border-dashed w-36 h-36"
          >
            <p className="items-center justify-center flex relative top-[50px] flex-col text-sm">
              <span className="font-semibold mr-1">Click to upload</span>
              <span>or drag and drop.</span>
              <span className="text-xs text-muted-foreground">
                (Max 1MB)
                {/* (Max {permittedFileInfo?.config.image?.maxFileSize}) */}
              </span>
            </p>
            <input
              id="product-images"
              className="relative z-10 h-[100px] border-2 opacity-0 w-full"
              {...getInputProps()}
              style={{ display: "block" }}
            />
          </div>
        </div>

        {/* {uploadedImages.length > 0 && (
          <div>
            <h4>Fichiers téléversés :</h4>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.secureUrl}
                    alt={`Uploaded ${index + 1}`}
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />

                  <div className=""></div>
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>

                  <p style={{ marginTop: "5px", fontSize: "12px" }}>
                    {image.publicId}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )} */}

        <button
          onClick={handleUpload}
          disabled={isUploading || selectedFiles.length === 0}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: isUploading ? "#ccc" : "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: isUploading ? "not-allowed" : "pointer",
          }}
        >
          {isUploading
            ? "Téléversement en cours..."
            : "Téléverser les fichiers"}
        </button>
      </div>
      {/* <div>
        <div className="mt-2 border border-border p-4 rounded-md flex items-center justify-start gap-2 flex-wrap"></div>
      </div> */}
    </>
  );
};

export default ImageUploader2;
