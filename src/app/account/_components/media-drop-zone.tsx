

import React, { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Image } from "@prisma/client";
import { Button } from "@/components/ui/button";
import MediaUrlDropdown from "./media-url-dropdown";


export type UploadingImage = {
  file: File;
  previewUrl: string;
  status: "uploading" | "processing" | "done";
};

export const MediaDropZone = ({
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
  console.log("🚀 ~ handleSingleUpload ~ file:YOLO", file)
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


export default MediaDropZone