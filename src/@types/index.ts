export type ImageData = {
  id: string;
  file: File;
  preview: string;
  url?: string;
  publicId?: string;
  isUploaded: boolean;
  isUploading: boolean;
  progress: number;
  isSelected: boolean;
  name: string;
  size: number;
  uploadDate: Date;
  type: string;
  usedIn: string[];
  products: string[];
  width?: number;
  height?: number;
};
