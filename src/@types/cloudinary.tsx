export type UploadResponse = {
  message: string;
  images: CloudinaryImage[];
};

export type CloudinaryImage = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
};

export type ImageFormData = {
  images: FileList;
};

export type ImageProcessingState = {
  id: string;
  file: File;
  preview: string;
  status: "importing" | "processing" | "completed" | "error";
  progress: number;
  cloudinaryData?: CloudinaryImage;
};

export type UploadedFile = {
  name: string;
  publicId: string; // ID public retourné par Cloudinary
  secureUrl: string; // URL du fichier téléversé
  alt: string; //
  size: string;
  productId: string;
  storeId: string;
  format: string;
  type: string;
};

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  original_filename: string;
  format?: string;
  resource_type: string;
  bytes?: number;
}

export interface UploadResult {
  success: boolean;
  title: string;
  description: string;
  data?: UploadedFile;
}

export type MediaType =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "archive"
  | "unknown";
