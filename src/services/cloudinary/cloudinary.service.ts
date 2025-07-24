import { v2 as cloudinary } from "cloudinary";
import { CloudinaryError } from "@/@types";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteImageFromCloudinary = async (publicId: string) => {
  if (!publicId || typeof publicId !== "string") {
    throw new Error("Invalid publicId provided for Cloudinary deletion");
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok" && result.result !== "not found") {
      throw new CloudinaryError(`Cloudinary deletion failed: ${result.result}`);
    }
    return result;
  } catch (error) {
    console.error("Error when deleting an image.", error);
    throw error;
  }
};

export const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUD_SECRET as string
  );

  try {
    console.log("CLOUDINARY", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      public_url: data.url,
      public_id: data.public_id,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
