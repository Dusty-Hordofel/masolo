import { UploadedFile } from "@/@types/cloudinary";

export const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
export const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string;
console.log("🚀 ~ CLOUDINARY_URL:", CLOUDINARY_URL)
console.log("🚀 ~ UPLOAD_PRESET:", UPLOAD_PRESET)
/* const UPLOAD_PRESET = mdtyff4d */

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  original_filename: string;
  format?: string;
  resource_type: string;
  bytes?: number;}

interface UploadResult {
  success: boolean;
  title: string;
  description: string;
  data?: UploadedFile;
}

type MediaType =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "archive"
  | "unknown";

// Constants
export const UPLOAD_CONFIG = {
  PRESET: UPLOAD_PRESET,
  FOLDER: "masolo",
  URL: CLOUDINARY_URL,
  TIMEOUT: 30000, // 30 secondes
} as const;

const MEDIA_TYPE_MAP: Record<string, MediaType> = {
  image: "image",
  video: "video",
} as const;

const MIME_TYPE_PATTERNS = {
  audio: /^audio\//,
  pdf: /pdf/,
  archive: /zip|rar/,
} as const;

// Utilities
export const determineMediaType = (
  resourceType: string,
  mimeType: string
): MediaType => {
  // Direct mapping for Cloudinary types
  if (resourceType in MEDIA_TYPE_MAP) {
    return MEDIA_TYPE_MAP[resourceType as keyof typeof MEDIA_TYPE_MAP];
  }

  // Logic for raw files
  if (resourceType === "raw") {
    if (MIME_TYPE_PATTERNS.audio.test(mimeType)) return "audio";
    if (MIME_TYPE_PATTERNS.pdf.test(mimeType)) return "document";
    if (MIME_TYPE_PATTERNS.archive.test(mimeType)) return "archive";
    return "document";
  }

  return "unknown";
};

export const validateCloudinaryResponse = (
  data: any
): data is CloudinaryResponse => {
  return !!(data?.secure_url && data?.public_id && data?.original_filename);
};

export const createUploadedFile = (
  cloudinaryData: CloudinaryResponse,
  originalFile: File,
  productId: string,
  storeId: string
): UploadedFile => {
  const format = (
    cloudinaryData.format ??
    originalFile.type.split("/")[1] ??
    "unknown"
  ).toString();
  const mediaType = determineMediaType(
    cloudinaryData.resource_type,
    originalFile.type
  );

  return {
    name: cloudinaryData.original_filename,
    publicId: cloudinaryData.public_id,
    secureUrl: cloudinaryData.secure_url,
    alt: cloudinaryData.original_filename.replace(/_/g, " "),
    size: cloudinaryData.bytes?.toString() ?? "0",
    format,
    type: mediaType,
    productId,
    storeId,
  };
};

// ==================== UPLOAD CORE ========================

// ==================== UPLOAD MULTIPLE ====================
