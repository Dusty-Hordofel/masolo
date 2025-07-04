import { ImageData } from "@/@types";
import { useRef, useState } from "react";

export const useImageManager = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  //   const [images, setImages] = useState<ImageData[]>([]);
  // const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

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

  const deleteImage = async (imageId: string) => {
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

  const deleteSelectedImages = async () => {
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
    selectedImages,
    setSelectedImages,
    addImageFromUrl,
    // toggleImageSelection,
    // handleDrop,
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
