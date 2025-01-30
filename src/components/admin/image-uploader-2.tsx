"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFileUploadToCloudinary } from "./use-file-upload";
import { XIcon } from "lucide-react";
import { Image } from "@prisma/client";
import { Button } from "../ui/button";
import { deleteProductImage } from "@/server-actions/products";
import { toast } from "@/hooks/use-toast.hook";

const ImageUploader2 = ({
  productId,
  uploadedImages,
  setUploadedImages,
  productImages,
  existingImages,
  setProductImages,
}: {
  productId: string;
  uploadedImages: Image[];
  existingImages: Image[];
  productImages: Image[];
  setUploadedImages: React.Dispatch<React.SetStateAction<Image[]>>;
  setProductImages: React.Dispatch<React.SetStateAction<Image[]>>;
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [allProductImages, setAllProductImages] = useState<Image[]>([
    ...existingImages,
    ...uploadedImages,
  ]);

  console.log("🚀 ~ allProductImages:NIOSO", allProductImages);
  const { isUploading, uploadFiles } = useFileUploadToCloudinary(
    productId,
    setUploadedImages
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const handleUpload = async () => {
    try {
      const results = await uploadFiles(selectedFiles);

      if (results.success) {
        setSelectedFiles([]);
      }
    } catch (error) {
      alert("Une erreur est survenue lors du téléversement.");
    }
  };

  const handleDeleteProductImage = async (id: string) => {
    const deleteledProductImage = await deleteProductImage(id);
    if (deleteledProductImage.success) {
      setAllProductImages((prev) => prev.filter((i) => i.id !== id));

      toast({
        title: deleteledProductImage?.title,
        description: deleteledProductImage?.description,
      });
    }
  };

  return (
    <>
      <div className="bg-red-400 w-full">
        <div className="mt-2 border border-border p-4 rounded-md flex items-center justify-start gap-2 flex-wrap bg-yellow-300 ">
          <div className="flex flex-wrap gap-4 bg-red-400">
            {productImages &&
              productImages.length > 0 &&
              // [...existingImages, ...uploadedImages]

              allProductImages.map((image, index) => (
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
                    onClick={async () =>
                      await handleDeleteProductImage(image.id)
                    }
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
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

        {selectedFiles.length > 0 && (
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
        )}
      </div>
    </>
  );
};

export default ImageUploader2;
