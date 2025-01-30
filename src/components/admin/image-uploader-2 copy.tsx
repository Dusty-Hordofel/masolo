"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFileUploadToCloudinary } from "./use-file-upload";
import Image from "next/image";
import { XIcon } from "lucide-react";
import prismadb from "@/lib/prismadb";
import { ProductImage } from "./product-editor-elements";

// const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload";
// const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET"; // La présélection non signée

const ImageUploader2 = ({
  productId,
  uploadedFiles,
  setUploadedFiles,
}: {
  productId: string;
  uploadedFiles: ProductImage[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<ProductImage[]>>;
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // const [isUploading, setIsUploading] = useState(false);

  const { isUploading, uploadFiles } = useFileUploadToCloudinary(
    productId,
    setUploadedFiles
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
      // if (results.success) {
      //   console.log("🚀 ~ uploadFiles ~ newProd:MAMA", "YOYO");
      // }
      // console.log("Fichiers téléversés :", results);
      setSelectedFiles([]); // Réinitialisez les fichiers sélectionnés après le téléversement
    } catch (error) {
      alert("Une erreur est survenue lors du téléversement.");
    }
  };

  return (
    <>
      <div>
        {/* <div
          {...getRootProps({
            style: {
              border: "2px dashed #ccc",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
            },
          })}
        >
          <input {...getInputProps()} />
          <p>Glissez-déposez vos fichiers ici ou cliquez pour sélectionner</p>
        </div> */}
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

        {/* Aperçu des fichiers ajoutés */}
        {/* {selectedFiles.length > 0 && (
          <div>
            <h4>Fichiers sélectionnés :</h4>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </li>
              ))}
            </ul>
          </div>
        )} */}

        {/* Liste des fichiers téléversés */}
        {/* {uploadedFiles.length > 0 && (
        <div>
          <h4>Fichiers téléversés :</h4>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )} */}

        {uploadedFiles.length > 0 && (
          <div>
            <h4>Fichiers téléversés :</h4>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative"
                  // style={{ textAlign: "center", position: "relative" }}
                >
                  <img
                    src={file.secureUrl}
                    alt={`Uploaded ${index + 1}`}
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />

                  <div className="">

</div>
                  <button
                    type="button"
                    // onClick={() => {
                    //   props.setImagesToDelete((prev) => [...prev, image]);
                    // }}
                    // -top-4 ml-28
                    className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>

                  <p style={{ marginTop: "5px", fontSize: "12px" }}>
                  {file.publicId}
                </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bouton pour téléverser les fichiers */}
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
      <div>
        {/* <Label htmlFor="product-images">Images</Label> */}
        <div className="mt-2 border border-border p-4 rounded-md flex items-center justify-start gap-2 flex-wrap"></div>
      </div>
      {/* <div className="mt-2 border border-border p-4 rounded-md flex items-center justify-start gap-2 flex-wrap">
        {[...props.product.images, ...props.newImages]
          .filter((item) => !props.imagesToDelete.includes(item))
          .map((image) => (
            <div key={image.id}>
              <li className="relative w-36 h-36">
                <Image
                  src={image.url}
                  alt={image.alt ?? ""}
                  fill
                  className="object-cover w-36 h-36"
                />
                <button
                  type="button"
                  onClick={() => {
                    props.setImagesToDelete((prev) => [...prev, image]);
                  }}
                  className="relative -top-4 ml-28 bg-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </li>
            </div>
          ))}
        <div
          {...getRootProps()}
          className="border-border border-2 rounded-md border-dashed w-36 h-36"
        >
          <p className="items-center justify-center flex relative top-[50px] flex-col text-sm">
            <span className="font-semibold mr-1">Click to upload</span>
            <span>or drag and drop.</span>
            <span className="text-xs text-muted-foreground">
              (Max {permittedFileInfo?.config.image?.maxFileSize})
            </span>
          </p>
          <input
            id="product-images"
            className="relative z-10 h-[100px] border-2 opacity-0 w-full"
            {...getInputProps()}
            style={{ display: "block" }}
          />
        </div>
      </div> */}
    </>
  );
};

export default ImageUploader2;
