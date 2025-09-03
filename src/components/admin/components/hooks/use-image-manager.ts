import { ImageData } from "@/@types";
import { deleteProductImage } from "@/actions/products";
import { getStoreImages } from "@/actions/store";
import { Image } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export const useImageManager = () => {
  // const [images, setImages] = useState<ImageData[]>([]);
  // console.log("🚀 ~ useImageManager ~ images:IMG", images);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const [storeImages, setStoreImages] = useState<Image[]>([]);

  useEffect(() => {
    const fetchStoreImages = async () => {
      const imgs = await getStoreImages("6790252988a3132278447d6e");
      setStoreImages(imgs);
    };

    fetchStoreImages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  // const uploadImage = async (imageId: string) => {
  //   setImages((prev) =>
  //     prev.map((img) =>
  //       img.id === imageId ? { ...img, isUploading: true, progress: 0 } : img
  //     )
  //   );

  //   const image = images.find((img) => img.id === imageId);
  //   if (!image) return;

  //   const formData = new FormData();
  //   formData.append("file", image.file);

  //   const xhr = new XMLHttpRequest();

  //   xhr.upload.addEventListener("progress", (event) => {
  //     if (event.lengthComputable) {
  //       const percentComplete = (event.loaded / event.total) * 100;
  //       setImages((prev) =>
  //         prev.map((img) =>
  //           img.id === imageId ? { ...img, progress: percentComplete } : img
  //         )
  //       );
  //     }
  //   });

  //   xhr.onload = () => {
  //     if (xhr.status >= 200 && xhr.status < 300) {
  //       const response = JSON.parse(xhr.responseText);
  //       setImages((prev) =>
  //         prev.map((img) =>
  //           img.id === imageId
  //             ? {
  //                 ...img,
  //                 url: response.url,
  //                 publicId: response.publicId,
  //                 isUploaded: true,
  //                 isUploading: false,
  //                 progress: 100,
  //                 width: response.width,
  //                 height: response.height,
  //               }
  //             : img
  //         )
  //       );
  //     }
  //   };

  //   xhr.open("POST", "/api/upload-cloudinary");
  //   xhr.send(formData);
  // };

  const handleFiles = (files: File[]) => {
    // console.log("🚀 ~ handleFiles ~ files:MONA MESSO", files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    // console.log("🚀 ~ handleFiles ~ imageFiles:TALALALA", imageFiles);
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

  // const deleteImage = async (
  //   imageId: string,
  //   setSelectedImages: Dispatch<SetStateAction<Set<string>>>
  // ) => {
  //   const image = storeImages.find((img) => img.id === imageId);
  //   if (!image) return;

  //   if (image.publicId) {
  //     try {
  //       await fetch("/api/delete-cloudinary", {
  //         method: "DELETE",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ publicId: image.publicId }),
  //       });
  //     } catch (error) {
  //       console.error("Delete error:", error);
  //     }
  //   }

  //   setStoreImages((prev) => prev.filter((img) => img.id !== imageId));
  //   setSelectedImages((prev) => {
  //     const newSet = new Set(prev);
  //     newSet.delete(imageId);
  //     return newSet;
  //   });
  // };

  const deleteSelectedImages = async (
    selectedImages: Set<string>,
    setSelectedImages: Dispatch<SetStateAction<Set<string>>>
  ) => {
    const imagesToDelete = storeImages.filter((img) =>
      selectedImages.has(img.id)
    );
    console.log("🚀 ~ deleteSelectedImages ~ imagesToDelete:", imagesToDelete);

    const deletePromises = imagesToDelete.map(async (image) => {
      if (image.id) {
        await deleteProductImage(image.id);
        // try {
        //   await fetch("/api/delete-cloudinary", {
        //     method: "DELETE",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ publicId: image.publicId }),
        //   });
        // } catch (error) {
        //   console.error("Delete error:", error);
        // }
      }

      return;
    });

    await Promise.all(deletePromises);
    setStoreImages((prev) => prev.filter((img) => !selectedImages.has(img.id)));
    setSelectedImages(new Set());
  };

  // const handleDeleteProductImage = async (id: string) => {
  //   setDeletedImageIds((prev) => [...prev, id]);

  //   const result = await deleteProductImage(id);
  //   if (result.success) {
  //     toast({
  //       title: result.title,
  //       description: result.description,
  //     });
  //   } else {
  //     setDeletedImageIds((prev) => prev.filter((imgId) => imgId !== id));
  //     toast({
  //       title: result.title,
  //       description: result.description,
  //     });
  //   }
  // };

  return {
    // images,
    // setImages,
    storeImages,
    setStoreImages,
    addImageFromUrl,
    handleFileChange,
    handleFiles,
    // uploadImage,
    // deleteImage,
    deleteSelectedImages,
    urlInput,
    setUrlInput,
    fileInputRef,
    modalFileInputRef,
  };
};
