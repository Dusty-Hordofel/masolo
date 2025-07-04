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

// SORT
export type ViewMode = "grid" | "list";
export type SortOption =
  | "date-desc"
  | "date-asc"
  | "name-asc"
  | "name-desc"
  | "size-asc"
  | "size-desc";
export type FileTypeFilter =
  | "all"
  | "images"
  | "videos"
  | "external-videos"
  | "3d-models";
