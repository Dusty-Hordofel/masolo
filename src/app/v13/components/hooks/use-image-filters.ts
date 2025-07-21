import { FileTypeFilter, ImageData, SortOption, ViewMode } from "@/@types";
import { useState } from "react";

export function useImageFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [fileTypeFilter, setFileTypeFilter] = useState<FileTypeFilter>("");
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [usageFilter, setUsageFilter] = useState("all");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  // const [productSearchQuery, setProductSearchQuery] = useState("");

  const filteredAndSortedImages = (
    images: ImageData[],
    selectedProducts: Set<string>
  ) =>
    images
      .filter((image) => {
        if (
          searchQuery &&
          !image.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false;
        if (
          fileTypeFilter !== "all" &&
          fileTypeFilter === "images" &&
          !image.type.startsWith("image/")
        )
          return false;
        if (minSize && image.size < Number.parseFloat(minSize) * 1024 * 1024)
          return false;
        if (maxSize && image.size > Number.parseFloat(maxSize) * 1024 * 1024)
          return false;
        if (usageFilter !== "all" && !image.usedIn.includes(usageFilter))
          return false;
        if (
          selectedProducts.size > 0 &&
          !Array.from(selectedProducts).some((product) =>
            image.products.includes(product)
          )
        )
          return false;
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "date-desc":
            return b.uploadDate.getTime() - a.uploadDate.getTime();
          case "date-asc":
            return a.uploadDate.getTime() - b.uploadDate.getTime();
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "size-asc":
            return a.size - b.size;
          case "size-desc":
            return b.size - a.size;
          default:
            return 0;
        }
      });

  return {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    fileTypeFilter,
    setFileTypeFilter,
    minSize,
    setMinSize,
    maxSize,
    setMaxSize,
    usageFilter,
    setUsageFilter,
    filteredAndSortedImages,
    openFilter,
    setOpenFilter,
  };
}

// Refactoring
// export type ViewMode = "grid" | "list";
// export type SortOption = "date-asc" | "date-desc" | "name-asc" | "name-desc";
// export type FileTypeFilter = "all" | "image" | "video" | "document";

// interface Filters {
//   searchQuery: string;
//   viewMode: ViewMode;
//   sortBy: SortOption;
//   fileType: FileTypeFilter;
//   minSize: string;
//   maxSize: string;
//   usage: "all" | "used" | "unused";
// }

// const initialFilters: Filters = {
//   searchQuery: "",
//   viewMode: "grid",
//   sortBy: "date-desc",
//   fileType: "all",
//   minSize: "",
//   maxSize: "",
//   usage: "all",
// };

// export function useImageFilters() {
//   const [filters, setFilters] = useState<Filters>(initialFilters);

//   const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const resetFilters = () => setFilters(initialFilters);

//   return {
//     filters,
//     setFilters,
//     updateFilter,
//     resetFilters,
//   };
// }

// const {
//   filters,
//   updateFilter,
//   resetFilters,
// } = useImageFilters();

// // Exemple de mise à jour :
// updateFilter("sortBy", "name-asc");
// updateFilter("searchQuery", "background");

// // Accès :
// console.log(filters.fileType);
