export interface UploadResponse {
  message: string;
  images: CloudinaryImage[];
}

export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
}

export interface ImageFormData {
  images: FileList;
}

export interface ImageProcessingState {
  id: string;
  file: File;
  preview: string;
  status: "importing" | "processing" | "completed" | "error";
  progress: number;
  cloudinaryData?: CloudinaryImage;
}
