"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFileUploadToCloudinary } from "./use-file-upload";
import { Loader2, XIcon } from "lucide-react";
import { Image } from "@prisma/client";
import { addProductImage, getNewImages } from "@/actions/products";
// import { Button } from "../ui/button";

type UploadingImage = {
  file: File;
  previewUrl: string;
  status: "uploading" | "processing" | "done";
};

const ProductMediaUploader = ({
  storeId,
  productId,
  setUploadedImages,
  currentProductImages,
  handleDeleteProductImage,
}: {
  storeId: string;
  productId: string;
  currentProductImages: Image[];
  setUploadedImages: React.Dispatch<React.SetStateAction<Image[]>>;
  handleDeleteProductImage: (id: string) => Promise<void>;
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  console.log("🚀 ~ currentProductImages:", currentProductImages);
  // console.log("🚀 ~ setUploadingImages:", uploadingImages);

  const { isUploading, uploadFiles, uploadFile } = useFileUploadToCloudinary(
    storeId,
    productId,
    setUploadedImages
  );

  // const onDrop1 = useCallback((acceptedFiles: File[]) => {
  //   const newFiles = acceptedFiles.map((file) => ({
  //     file,
  //     previewUrl: URL.createObjectURL(file),
  //     status: "uploading" as "uploading" | "processing" | "done",
  //   }));

  //   setUploadingImages((prev) => [...prev, ...newFiles]);

  //   // On lance l'upload automatiquement
  //   acceptedFiles.forEach((file) => handleSingleUpload(file));
  // }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        status: "uploading" as const,
      }));

      setUploadingImages((prev) => [...prev, ...newFiles]);
      // On lance l'upload automatiquement
      acceptedFiles.forEach((file) => uploadFile(file));
    },
    [uploadFile]
  );

  // const handleSingleUpload = async (file: File) => {
  //   // On simule d’abord "uploading"
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  //   // On passe à "processing"
  //   setUploadingImages((prev) =>
  //     prev.map((img) =>
  //       img.file === file ? { ...img, status: "processing" } : img
  //     )
  //   );

  //   // Upload réel
  //   try {
  //     await uploadFiles([file]); // ta fonction existante
  //     // Une fois fini, on passe à "done"
  //     setUploadingImages((prev) =>
  //       prev.map((img) =>
  //         img.file === file ? { ...img, status: "done" } : img
  //       )
  //     );
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // MOMO YA KALA
  const onDrop1 = useCallback(
    async (acceptedFiles: File[]) => {
      setSelectedFiles((prev) => [...prev, ...acceptedFiles]);

      try {
        const results = await uploadFiles(acceptedFiles);
        if (results.success) {
          setSelectedFiles([]);
        }
      } catch (error) {
        console.log("🚀 ~ handleUpload ~ error:", error);
        alert("Une erreur est survenue lors du téléversement.");
      }
    },
    [uploadFiles]
  );

  // const onDrop= useCallback((acceptedFiles: File[]) => {
  //   setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  // }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  // const handleUpload = async () => {
  //   try {
  //     const results = await uploadFiles(selectedFiles);

  //     if (results.success) {
  //       setSelectedFiles([]);
  //     }
  //   } catch (error) {
  //     console.log("🚀 ~ handleUpload ~ error:", error);
  //     alert("Une erreur est survenue lors du téléversement.");
  //   }
  // };

  return (
    <div>
      <label htmlFor="product-images" className="font-semibold">
        Images
      </label>
      <div className="w-full">
        <div className="mt-2 border border-border p-4 rounded-md flex items-center justify-start gap-2 flex-wrap ">
          <div className="flex flex-wrap gap-4">
            {currentProductImages &&
              currentProductImages.length > 0 &&
              currentProductImages.map((image) => (
                <div key={image.id} className="relative">
                  <picture>
                    <img
                      src={image.secureUrl}
                      alt={`Uploaded ${image.id}`}
                      style={{
                        width: "144px",
                        height: "144px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </picture>

                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center"
                    onClick={async () =>
                      await handleDeleteProductImage(image.id)
                    }
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}

            {/* {uploadingImages.map((img, idx) => {
              if (img.status === "uploading") {
                return (
                  <div
                    key={idx}
                    className="relative w-36 h-36 rounded-md border bg-white flex items-center justify-center"
                  >
                    <Loader2 className="w-6 h-6 animate-spin mb-1" />
                    <span className="absolute bottom-2 text-xs text-muted-foreground">
                      Uploading…
                    </span>
                  </div>
                );
              }

              if (img.status === "processing") {
                return (
                  <div
                    key={idx}
                    className="relative w-36 h-36 rounded-md overflow-hidden border"
                  >
                    <img
                      src={img.previewUrl}
                      alt={img.file.name}
                      className={`w-full h-full object-cover ${
                        img.status === "processing" ? "blur-sm opacity-60" : ""
                      }`}
                    />

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-sm">
                      <Loader2 className="w-6 h-6 animate-spin mb-1 text-black" />
                      <span className="text-black">Processing…</span>
                    </div>
                  </div>
                );
              }
              // processing & done -> on affiche l'image
            })} */}

            <div
              {...getRootProps()}
              className="border-border border-2 rounded-md border-dashed w-36 h-36"
            >
              <p className="items-center justify-center flex relative top-[50px] flex-col text-sm">
                <span className="font-semibold mr-1">Click to upload</span>
                <span>or drag and drop.</span>
                <span className="text-xs text-muted-foreground">(Max 1MB)</span>
              </p>
              <input
                id="product-images"
                className="relative z-10 h-[100px] border-2 opacity-0 w-full"
                {...getInputProps()}
                style={{ display: "block" }}
              />
            </div>
          </div>
        </div>

        {/* <div className="flex gap-4 flex-wrap">
          {uploadingImages.map((img, idx) => (
            <div
              key={idx}
              className="relative w-36 h-36 rounded-md overflow-hidden border"
            >
              <img
                src={img.previewUrl}
                alt={img.file.name}
                className={`w-full h-full object-cover transition ${
                  img.status === "processing" ? "blur-sm opacity-50" : ""
                }`}
              />

              {img.status !== "done" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white text-sm">
                  <Loader2 className="animate-spin w-6 h-6 mb-1" />
                  <span>
                    {img.status === "uploading"
                      ? "Uploading..."
                      : "Processing..."}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div> */}

        {/* {selectedFiles.length > 0 && (
          <div className="mt-4">
            {selectedFiles.map((file, i) => (
              <li key={i}>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
            <Button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
              className="mt-2"
              type="button"
            >
              {isUploading ? "Uploading" : "Upload"}
            </Button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ProductMediaUploader;
