import { ImageData } from "@/@types";
import { useState, useRef } from "react";

export function useImageUpload() {
  const [images, setImages] = useState<ImageData[]>([]);
  // const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  return {
    images,
    setImages,
    // isDragging,
    // setIsDragging,
    urlInput,
    setUrlInput,
    fileInputRef,
    modalFileInputRef,
  };
}
