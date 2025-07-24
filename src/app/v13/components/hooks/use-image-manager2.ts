import { ImageData } from "@/@types";
import { getStoreImages } from "@/actions/store";
import { Image } from "@prisma/client";
// import { Image } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export const useImageManager2 = () => {
  // const [images, setImages] = useState<Image[]>([]);
  const [images, setImages] = useState<ImageData[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const [storeImages, setStoreImages] = useState<Image[]>([]);
  console.log("🚀 ~ useImageManager ~ storeImages:", storeImages);

  useEffect(() => {
    const fetchImages = async () => {
      const imgs = await getStoreImages("cee0cf56-b4f1-4451-969f-509b2b9ef2e0");
      console.log("🚀 ~ Home ~ images:MATA", imgs);

      setStoreImages(imgs);
      // setImages(imgs);
    };

    fetchImages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const uploadImage = async (imageId: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, isUploading: true, progress: 0 } : img
      )
    );

    const image = images.find((img) => img.id === imageId);
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image.file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, progress: percentComplete } : img
          )
        );
      }
    });

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  url: response.url,
                  publicId: response.publicId,
                  isUploaded: true,
                  isUploading: false,
                  progress: 100,
                  width: response.width,
                  height: response.height,
                }
              : img
          )
        );
      }
    };

    xhr.open("POST", "/api/upload-cloudinary");
    xhr.send(formData);
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const newImages: ImageData[] = imageFiles.map((file) => ({
      id: Date.now().toString() + Math.random().toString(),
      file,
      preview: URL.createObjectURL(file),
      isUploaded: false,
      isUploading: false,
      progress: 0,
      isSelected: false,
      name: file.name,
      size: file.size,
      uploadDate: new Date(),
      type: file.type,
      usedIn: ["Supports multimédias du produit"],
      products: [],
    }));

    setImages((prev) => [...prev, ...newImages]);

    // Start uploading each image
    newImages.forEach((image) => {
      uploadImage(image.id);
    });
  };

  const addImageFromUrl = async () => {
    if (!urlInput.trim()) return;

    try {
      const response = await fetch(urlInput);
      const blob = await response.blob();
      const file = new File([blob], "image-from-url.jpg", { type: blob.type });

      handleFiles([file]);
      setUrlInput("");
    } catch (error) {
      console.error("Error adding image from URL:", error);
    }
  };

  const deleteImage = async (
    imageId: string,
    setSelectedImages: Dispatch<SetStateAction<Set<string>>>
  ) => {
    const image = images.find((img) => img.id === imageId);
    if (!image) return;

    if (image.publicId) {
      try {
        await fetch("/api/delete-cloudinary", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: image.publicId }),
        });
      } catch (error) {
        console.error("Delete error:", error);
      }
    }

    setImages((prev) => prev.filter((img) => img.id !== imageId));
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
  };

  const deleteSelectedImages = async (
    selectedImages: Set<string>,
    setSelectedImages: Dispatch<SetStateAction<Set<string>>>
  ) => {
    const imagesToDelete = images.filter((img) => selectedImages.has(img.id));

    const deletePromises = imagesToDelete.map(async (image) => {
      if (image.publicId) {
        try {
          await fetch("/api/delete-cloudinary", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicId: image.publicId }),
          });
        } catch (error) {
          console.error("Delete error:", error);
        }
      }
    });

    await Promise.all(deletePromises);
    setImages((prev) => prev.filter((img) => !selectedImages.has(img.id)));
    setSelectedImages(new Set());
  };

  return {
    images,
    setImages,
    storeImages,
    setStoreImages,
    addImageFromUrl,
    handleFileChange,
    handleFiles,
    uploadImage,
    deleteImage,
    deleteSelectedImages,
    urlInput,
    setUrlInput,
    fileInputRef,
    modalFileInputRef,
  };
};
