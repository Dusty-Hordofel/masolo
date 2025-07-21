import { ImageData } from "@/@types";

export const useImageUploader = (
  setImages: React.Dispatch<React.SetStateAction<ImageData[]>>,
  images: ImageData[]
) => {
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

  return { uploadImage };
};
