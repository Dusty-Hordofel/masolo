"use client";
import React, { MutableRefObject, useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFileUploadToCloudinary } from "../../../hooks/use-file-upload";
import { Loader2, XIcon } from "lucide-react";
import { Image } from "@prisma/client";
import MediaUrlDropdown from "@/app/v13/components/media-url-dropdown";
import { Button } from "../../ui/button";

type UploadingImage = {
  file: File;
  previewUrl: string;
  status: "uploading" | "processing" | "done";
};

const ProductMediaUploader4 = ({
  storeId,
  productId,
  setUploadedImages,
  currentProductImages,
  handleDeleteProductImage,
  showAllImages,
  hasImages,
}: {
  storeId: string;
  productId: string;
  currentProductImages: Image[];
  setUploadedImages: React.Dispatch<React.SetStateAction<Image[]>>;
  handleDeleteProductImage: (id: string) => Promise<void>;
  setShowAllImages?: React.Dispatch<React.SetStateAction<boolean>>;
  showAllImages?: boolean;
  hasImages: boolean;
}) => {
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);

  const { isUploading, uploadFiles, uploadFile } = useFileUploadToCloudinary(
    storeId,
    productId,
    setUploadedImages
  );

  return (
    <div>
      <label htmlFor="product-images" className="font-semibold">
        Images
      </label>
      <ImageGallery
        currentProductImages={currentProductImages}
        uploadingImages={uploadingImages}
        onDeleteImage={handleDeleteProductImage}
      />

      <MediaDropZone
        setUploadingImages={setUploadingImages}
        uploadFile={uploadFile}
        showAllImages={showAllImages}
        hasImages={hasImages}
      />
    </div>
  );
};

export default ProductMediaUploader4;

const ImageGallery = ({
  currentProductImages,
  uploadingImages,
  onDeleteImage,
}: {
  currentProductImages: Image[];
  uploadingImages: UploadingImage[];
  onDeleteImage: (id: string) => Promise<void>;
}) => {
  const hasImages =
    currentProductImages.length > 0 || uploadingImages.length > 0;

  if (!hasImages) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="mt-2 border border-border p-4 rounded-md flex items-center justify-start gap-2 flex-wrap ">
        <div className="flex flex-wrap gap-4">
          {currentProductImages &&
            currentProductImages.length > 0 &&
            currentProductImages.map((image) => (
              <UploadedImage image={image} onDelete={onDeleteImage} />
            ))}

          {uploadingImages.map((image, index) => (
            <UploadingImage image={image} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const UploadingImage = ({
  image,
  index,
}: {
  image: UploadingImage;
  index: number;
}) => {
  if (image.status === "uploading") {
    return (
      <div
        key={index}
        className="relative w-36 h-36 rounded-md border bg-white flex items-center justify-center"
      >
        <Loader2 className="w-6 h-6 animate-spin mb-1" />
        <span className="absolute bottom-2 text-xs text-muted-foreground">
          Uploading…
        </span>
      </div>
    );
  }

  if (image.status === "processing") {
    return (
      <div
        key={index}
        className="relative w-36 h-36 rounded-md overflow-hidden border"
      >
        <img
          src={image.previewUrl}
          alt={image.file.name}
          className={`w-full h-full object-cover ${
            image.status === "processing" ? "blur-sm opacity-60" : ""
          }`}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-sm">
          <Loader2 className="w-6 h-6 animate-spin mb-1 text-black" />
          <span className="text-black">Processing…</span>
        </div>
      </div>
    );
  }

  return null;
};

const UploadedImage = ({
  image,
  onDelete,
}: {
  image: Image;
  onDelete: (id: string) => Promise<void>;
}) => {
  return (
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
        onClick={async () => await onDelete(image.id)}
        aria-label="Delete image"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

const MediaDropZone = ({
  setUploadingImages,
  uploadFile,
  showAllImages,
  hasImages,
}: {
  uploadFile: (file: File) => Promise<{
    success: boolean;
    title: string;
    description: string;
    data: Image;
  }>;
  setUploadingImages: React.Dispatch<React.SetStateAction<UploadingImage[]>>;
  showAllImages?: boolean;
  hasImages: boolean;
}) => {
  const ignoreNextClick = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div
      {...getRootProps()}
      className="border-border border-2 rounded-md border-dashed p-8"
      onClick={() => {
        if (ignoreNextClick.current) {
          ignoreNextClick.current = false; // reset
          return; // ignorer ce clic
        }
        fileInputRef.current?.click();
      }}
    >
      <div className="space-y-2 flex  flex-col justify-center items-center">
        <div className="relative flex justify-center items-center">
          <Button
            type="button"
            className=" bg-gray-100/50  hover:bg-gray-100 text-black"
          >
            <span>Upload new</span>
          </Button>

          {hasImages && <MediaUrlDropdown ignoreNextClick={ignoreNextClick} />}
          {!hasImages && !showAllImages && (
            <Button
              variant="link"
              onClick={(e) => {
                e.stopPropagation();
                // setShowAllImages(true);
              }}
            >
              Sélect existing
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-1">
          Glisser-déposer des images, des vidéos, des modèles 3D et des fichiers
        </p>

        <input
          id="product-images"
          className="sr-only"
          {...getInputProps()}
          ref={fileInputRef}
        />
      </div>
    </div>
  );
};
