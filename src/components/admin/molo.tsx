import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const UploadComponent = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Stocker les fichiers ajoutés
  const [isUploading, setIsUploading] = useState(false); // Indiquer si l'upload est en cours

  const onDrop = (acceptedFiles: File[]) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*", // Vous pouvez ajuster les types autorisés
  });

  const uploadFiles = async () => {
    setIsUploading(true);
    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload";
    const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("Uploaded file:", data.secure_url); // Affichez l'URL du fichier téléversé
      }
      alert("Tous les fichiers ont été téléversés avec succès !");
      setSelectedFiles([]); // Réinitialiser les fichiers après téléversement
    } catch (error) {
      console.error("Erreur lors du téléversement :", error);
      alert("Une erreur est survenue lors du téléversement.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div
        {...getRootProps({
          style: {
            border: "2px dashed #ccc",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
          },
        })}
      >
        <input {...getInputProps()} />
        <p>Glissez-déposez vos fichiers ici ou cliquez pour sélectionner</p>
      </div>

      {/* Aperçu des fichiers ajoutés */}
      {selectedFiles.length > 0 && (
        <div>
          <h4>Fichiers sélectionnés :</h4>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bouton pour téléverser les fichiers */}
      <button
        onClick={uploadFiles}
        disabled={isUploading || selectedFiles.length === 0}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: isUploading ? "#ccc" : "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: isUploading ? "not-allowed" : "pointer",
        }}
      >
        {isUploading ? "Téléversement en cours..." : "Téléverser les fichiers"}
      </button>
    </div>
  );
};

export default UploadComponent;