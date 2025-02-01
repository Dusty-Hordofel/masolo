// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
// const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUD_SECRET as string;

export const deleteImageFromCloudinary = async (public_id: string) => {
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/delete/upload/${public_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete image: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Erreur lors de la suppression d'une image.", error);
  }
};

// TODO: refactor
// export const uploadImagesToCloudinary = async (file: File) => {};

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
    console.log("🚀 ~ uploadImageToCloudinary ~ data:DATA", data);
    return {
      url: data.secure_url,
      public_url: data.url,
      public_id: data.public_id,
    };
    // return data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
