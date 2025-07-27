"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFileUploadToCloudinary } from "../../hooks/use-file-upload";
import { Loader2, XIcon } from "lucide-react";
import { Image } from "@prisma/client";

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
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);

  const { isUploading, uploadFiles, uploadFile } = useFileUploadToCloudinary(
    storeId,
    productId,
    setUploadedImages
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        status: "uploading" as const,
      }));

      setUploadingImages((prev) => [...prev, ...newFiles]);
      acceptedFiles.forEach((file) => handleSingleUpload(file));
    },
    [uploadFile]
  );

  const handleSingleUpload = async (file: File) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUploadingImages((prev) =>
      prev.map((img) =>
        img.file === file ? { ...img, status: "processing" } : img
      )
    );

    try {
      await uploadFile(file);

      setUploadingImages((prev) =>
        prev.map((img) =>
          img.file === file ? { ...img, status: "done" } : img
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

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

            {uploadingImages.map((img, idx) => {
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
            })}

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
      </div>
    </div>
  );
};

export default ProductMediaUploader;
