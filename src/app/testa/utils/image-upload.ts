import { ImageProcessingState } from "@/@types/cloudinaty";

export const createPreview = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.readAsDataURL(file);
  });
};

export const updateImageState = (
  id: string,
  updates: Partial<ImageProcessingState>,
  setProcessingImages: React.Dispatch<
    React.SetStateAction<ImageProcessingState[]>
  >
) => {
  setProcessingImages((prev) =>
    prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
  );
};

export const processIndividualImage = async (
  imageState: ImageProcessingState,
  setProcessingImages: React.Dispatch<
    React.SetStateAction<ImageProcessingState[]>
  >
) => {
  try {
    // Phase 1: Importation (simulation)
    updateImageState(
      imageState.id,
      { status: "importing", progress: 20 },
      setProcessingImages
    );
    await new Promise((resolve) => setTimeout(resolve, 800));

    updateImageState(imageState.id, { progress: 40 }, setProcessingImages);
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Phase 2: Traitement
    updateImageState(
      imageState.id,
      { status: "processing", progress: 60 },
      setProcessingImages
    );
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Upload vers Cloudinary
    const formData = new FormData();
    formData.append("files", imageState.file);

    updateImageState(imageState.id, { progress: 80 }, setProcessingImages);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erreur lors du téléchargement");
    }

    const result = await response.json();

    // Phase 3: Terminé
    updateImageState(
      imageState.id,
      {
        status: "completed",
        progress: 100,
        cloudinaryData: result.images[0], // Supposant qu'on upload une image à la fois
      },
      setProcessingImages
    );
  } catch (error) {
    console.error("Erreur:", error);
    updateImageState(
      imageState.id,
      { status: "error", progress: 0 },
      setProcessingImages
    );
  }
};
