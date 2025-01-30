"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

// const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload";
// const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET"; // La présélection non signée

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUD_SECRET as string; // La présélection non signée
console.log("🚀 ~ UPLOAD_PRESET:", UPLOAD_PRESET);
console.log("🚀 ~ CLOUDINARY_URL:", CLOUDINARY_URL);

const ImageUploader1 = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  console.log("🚀 ~ ImageUploader ~ uploadedImages:", uploadedImages);

  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    const uploadedUrls: string[] = [];

    // Téléversement des fichiers un par un
    for (const file of acceptedFiles) {
      await uploadImageToCloudinary(file, uploadedUrls);
    }

    setUploadedImages((prev) => [...prev, ...uploadedUrls]);
    setIsUploading(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, // N'accepte que les fichiers image
    multiple: true, // Permet plusieurs fichiers
  });

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <p>Téléversement en cours...</p>
        ) : (
          <p>
            Glissez-déposez vos fichiers ici, ou cliquez pour en sélectionner
          </p>
        )}
      </div>

      {uploadedImages.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4>Images téléversées :</h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {uploadedImages.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Uploaded ${index}`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader1;

export const uploadImageToCloudinary = async (
  file: File,
  uploadedUrls: string[]
) => {
  const formData = new FormData();

  formData.append("file", file); //The file to be uploaded
  formData.append("upload_preset", UPLOAD_PRESET); // Unsigned preselection
  formData.append("folder", "masolo"); // Target folder in cloudinary

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    console.log("🚀 ~ onDrop ~ response:", response);

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const data = await response.json();
    uploadedUrls.push(data.secure_url); // URL sécurisée de Cloudinary
  } catch (error) {
    // console.error("Erreur de téléversement :", error);
    console.error("Error uploading image:", error);
    throw error;
  }
};
